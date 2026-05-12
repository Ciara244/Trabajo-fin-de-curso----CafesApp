import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonContent, IonPage } from "@ionic/react";
import { supabase } from "../../services/supabaseClient";
import { IonHeader, IonToolbar } from "@ionic/react";

/* COMPONENTS */
import Loading from "../components/Loading";

// Estados posibles y su orden de flujo
const ESTADOS = ['Sin asignar', 'Preparando', 'Listo', 'Recogido'];

// Colores según el estado del pedido
const coloresEstado = {
    'Sin asignar': { bg: '#f2ede8', color: '#8a9a9a' },
    'Preparando':  { bg: '#fff3e0', color: '#e67e22' },
    'Listo':       { bg: '#e8f5e9', color: '#27ae60' },
    'Recogido':    { bg: '#e8f0fe', color: '#3498db' }
};

// Filtros de tiempo para admin
const FILTROS_TIEMPO = ['Hoy', 'Esta semana', 'Este mes'];

function Orders() {
    const { user } = useContext(UserLogin);

    const [pedidos, setPedidos] = useState([]);
    const [loader, setLoader] = useState(true);
    const [pedidoDetalle, setPedidoDetalle] = useState(null);

    // Datos del usuario del pedido seleccionado (solo para trabajador/admin)
    const [datosUsuarioPedido, setDatosUsuarioPedido] = useState(null);

    // Filtro de estado para trabajador y admin
    const [filtroEstado, setFiltroEstado] = useState('Todos');

    // Filtro de tiempo solo para admin
    const [filtroTiempo, setFiltroTiempo] = useState('Hoy');

    // Mensaje de feedback al cambiar estado
    const [mensajeCambio, setMensajeCambio] = useState('');

    const esUsuario    = user?.rol === 'usuario';
    const esTrabajador = user?.rol === 'trabajador';
    const esAdmin      = user?.rol === 'admin';

    useEffect(() => {
        borrarPedidosAntiguos();
        fetchPedidos();
    }, [filtroTiempo]);

    // Elimina pedidos con más de 1 mes de antigüedad
    async function borrarPedidosAntiguos() {
        try {
            const haceUnMes = new Date();
            haceUnMes.setMonth(haceUnMes.getMonth() - 1);
            const { error } = await supabase
                .from('Pedido')
                .delete()
                .lt('fecha', haceUnMes.toISOString());
            if (error) throw error;
        } catch (error) {
            console.error("Error al borrar pedidos antiguos:", error.message);
        }
    }

    // Carga pedidos según el rol
    async function fetchPedidos() {
        try {
            let query = supabase.from('Pedido').select('*');

            if (esUsuario) {
                query = query.eq('usuario_id', String(user?.id));
            } else if (esAdmin) {
                const fechaDesde = calcularFechaDesde(filtroTiempo);
                if (fechaDesde) query = query.gte('fecha', fechaDesde.toISOString());
            }
            // Trabajador ve todos sin filtro de tiempo

            query = query.order('fecha', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;
            setPedidos(data || []);
        } catch (error) {
            console.error("Error al cargar pedidos:", error.message);
        } finally {
            setTimeout(() => setLoader(false), 500);
        }
    }

    // Cuando se abre el detalle de un pedido, carga los datos del usuario que lo hizo
    async function fetchDatosUsuario(usuarioId) {
        try {
            const { data, error } = await supabase
                .from('Usuario')
                .select('id, nombre, rango, institucion, alergias')
                .eq('id', usuarioId)
                .single();
            if (error) throw error;
            setDatosUsuarioPedido(data);
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error.message);
            setDatosUsuarioPedido(null);
        }
    }

    function abrirDetalle(pedido) {
        setPedidoDetalle(pedido);
        // Solo trabajador y admin necesitan los datos del usuario
        if (esTrabajador || esAdmin) {
            fetchDatosUsuario(pedido.usuario_id);
        }
    }

    function calcularFechaDesde(filtro) {
        const ahora = new Date();
        if (filtro === 'Hoy') {
            const hoy = new Date(ahora);
            hoy.setHours(0, 0, 0, 0);
            return hoy;
        }
        if (filtro === 'Esta semana') {
            const semana = new Date(ahora);
            semana.setDate(ahora.getDate() - 7);
            return semana;
        }
        if (filtro === 'Este mes') {
            const mes = new Date(ahora);
            mes.setMonth(ahora.getMonth() - 1);
            return mes;
        }
        return null;
    }

    // Avanza el estado de un pedido al siguiente en el flujo
    async function cambiarEstado(pedido) {
        const indexActual = ESTADOS.indexOf(pedido.estado || 'Sin asignar');
        if (indexActual === ESTADOS.length - 1) return;

        const nuevoEstado = ESTADOS[indexActual + 1];

        try {
            const { error } = await supabase
                .from('Pedido')
                .update({ estado: nuevoEstado })
                .eq('id', pedido.id);
            if (error) throw error;

            setPedidos(prev => prev.map(p =>
                p.id === pedido.id ? { ...p, estado: nuevoEstado } : p
            ));
            if (pedidoDetalle?.id === pedido.id) {
                setPedidoDetalle(prev => ({ ...prev, estado: nuevoEstado }));
            }
            mostrarMensaje(`Actualizado a "${nuevoEstado}"`);
        } catch (error) {
            console.error("Error al cambiar estado:", error.message);
            mostrarMensaje("Error al actualizar el estado.");
        }
    }

    function mostrarMensaje(texto) {
        setMensajeCambio(texto);
        setTimeout(() => setMensajeCambio(''), 2500);
    }

    function formatearFecha(fechaStr) {
        if (!fechaStr) return "Sin fecha";
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    // Filtra por estado si hay filtro activo
    const pedidosFiltrados = filtroEstado === 'Todos'
        ? pedidos
        : pedidos.filter(p => (p.estado || 'Sin asignar') === filtroEstado);

    return (
        <IonPage>
           <IonContent className={"contentBackground"}>
                <div className={'padre'}>
                    {loader ? <Loading /> : null}
                           {/* BARRA DE FILTRO EN IONHEADER - fuera del IonContent */}
        {(esTrabajador || esAdmin) && (
                <IonToolbar>
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '8px 16px',
                        overflowX: 'scroll',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}>
                        {['Todos', ...ESTADOS].map(estado => (
                            <button
                                key={estado}
                                onClick={() => setFiltroEstado(estado)}
                                style={{
                                    padding: '7px 14px',
                                    borderRadius: '20px',
                                    flexShrink: 0,
                                    border: filtroEstado === estado
                                        ? `1.5px solid ${coloresEstado[estado]?.color || '#689d9d'}`
                                        : '1.5px solid transparent',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '0.82rem',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: filtroEstado === estado
                                        ? (coloresEstado[estado]?.bg || '#e8f5f5')
                                        : '#f2ede8',
                                    color: filtroEstado === estado
                                        ? (coloresEstado[estado]?.color || '#689d9d')
                                        : '#8a9a9a'
                                }}
                            >
                                {estado}
                                {estado !== 'Todos' && (
                                    <span style={{ marginLeft: '5px', opacity: 0.8 }}>
                                        ({pedidos.filter(p => (p.estado || 'Sin asignar') === estado).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </IonToolbar>
        )}


                    <div className={"cuerpo"} style={{ padding: '16px' }}>

                        {/* TITULO Y CONTADOR */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h2 style={{ margin: 0, color: '#3d2318' }}>
                                {esUsuario ? 'Mis pedidos' : 'Pedidos'}
                            </h2>
                            {pedidosFiltrados.length > 0 && (
                                <span style={{ backgroundColor: '#689d9d', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                    {pedidosFiltrados.length} {pedidosFiltrados.length === 1 ? 'pedido' : 'pedidos'}
                                </span>
                            )}
                        </div>

                        {/* FILTRO DE TIEMPO - solo admin */}
                        {esAdmin && (
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                {FILTROS_TIEMPO.map(filtro => (
                                    <button
                                        key={filtro}
                                        onClick={() => { setFiltroTiempo(filtro); setLoader(true); }}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap',
                                            backgroundColor: filtroTiempo === filtro ? '#5c4134' : '#efceb7',
                                            color: filtroTiempo === filtro ? '#fff' : '#5c4134'
                                        }}
                                    >
                                        {filtro}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* MENSAJE DE FEEDBACK */}
                        {mensajeCambio !== '' && (
                            <div style={{ backgroundColor: '#689d9d', color: '#fff', padding: '10px 16px', borderRadius: '10px', marginBottom: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                                {mensajeCambio}
                            </div>
                        )}

                        {/* LISTA VACIA */}
                        {!loader && pedidosFiltrados.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#8a9a9a', marginTop: '40px' }}>
                                No hay pedidos en esta categoría.
                            </p>
                        )}

                        {/* TARJETAS DE PEDIDOS */}
                        {pedidosFiltrados.map((pedido) => {
                            const estado = pedido.estado || 'Sin asignar';
                            const estiloEstado = coloresEstado[estado] || coloresEstado['Sin asignar'];
                            const indexEstado = ESTADOS.indexOf(estado);
                            const puedeAvanzar = (esTrabajador || esAdmin) && indexEstado < ESTADOS.length - 1;

                            return (
                                <div
                                    key={pedido.id}
                                    onClick={() => abrirDetalle(pedido)}
                                    style={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e8ddd7',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        marginBottom: '14px',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(92,65,52,0.06)',
                                        width: '90%'
                                    }}
                                >
                                    {/* NUMERO DE PEDIDO Y ESTADO */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#3d2318', fontSize: '1rem' }}>
                                            Pedido #{pedidos.findIndex(p => p.id === pedido.id) + 1}
                                        </p>
                                        <span style={{ backgroundColor: estiloEstado.bg, color: estiloEstado.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {estado}
                                        </span>
                                    </div>

                                    {/* ID DEL USUARIO - solo trabajador y admin */}
                                    {(esTrabajador || esAdmin) && (
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: '#8a9a9a' }}>
                                            Usuario ID: {pedido.usuario_id}
                                        </p>
                                    )}

                                    {/* PRODUCTOS */}
                                    <div style={{ marginBottom: '8px' }}>
                                        {(pedido.productos || []).slice(0, 3).map((prod, i) => (
                                            <p key={i} style={{ margin: '2px 0', fontSize: '0.9rem', color: '#5c4134' }}>
                                                • {prod.nombre}{prod.opcion ? ` (${prod.opcion})` : ''} x{prod.cantidad}
                                            </p>
                                        ))}
                                        {(pedido.productos || []).length > 3 && (
                                            <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#8a9a9a' }}>
                                                +{pedido.productos.length - 3} más...
                                            </p>
                                        )}
                                    </div>

                                    {/* FECHA, TOTAL Y BOTON AVANZAR */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #f2ede8', paddingTop: '10px' }}>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#8a9a9a' }}>
                                            {formatearFecha(pedido.fecha)}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#689d9d' }}>
                                                {pedido.total} €
                                            </p>
                                            {puedeAvanzar && (
                                                <button
                                                    onClick={e => { e.stopPropagation(); cambiarEstado(pedido); }}
                                                    style={{
                                                        backgroundColor: estiloEstado.color,
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        padding: '6px 12px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    → {ESTADOS[indexEstado + 1]}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* PANEL DE DETALLE */}
                    {pedidoDetalle && (
                        <>
                            <div
                                onClick={() => { setPedidoDetalle(null); setDatosUsuarioPedido(null); }}
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 150 }}
                            />
                            <div style={{
                                position: 'fixed',
                                bottom: 0, left: 0, right: 0,
                                backgroundColor: '#fff',
                                borderRadius: '20px 20px 0 0',
                                padding: '24px 20px 40px',
                                zIndex: 200,
                                maxHeight: '85vh',
                                overflowY: 'auto',
                                boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
                            }}>
                                {/* CABECERA DEL PANEL */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0, color: '#3d2318' }}>
                                        Pedido #{pedidos.findIndex(p => p.id === pedidoDetalle.id) + 1}
                                    </h3>
                                    <button
                                        onClick={() => { setPedidoDetalle(null); setDatosUsuarioPedido(null); }}
                                        style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#5c4134' }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* DATOS DEL USUARIO - solo trabajador y admin */}
                                {(esTrabajador || esAdmin) && (
                                    <div style={{ backgroundColor: '#faf6f2', borderRadius: '12px', padding: '14px', marginBottom: '20px', border: '1px solid #e8ddd7' }}>
                                        <p style={estiloSeccion}>Datos del cliente</p>
                                        {datosUsuarioPedido ? (
                                            <>
                                                <div style={estiloFilaDatos}>
                                                    <span style={estiloLabelDato}>Nombre</span>
                                                    <span style={estiloValorDato}>{datosUsuarioPedido.nombre}</span>
                                                </div>
                                                <div style={estiloFilaDatos}>
                                                    <span style={estiloLabelDato}>ID</span>
                                                    <span style={estiloValorDato}>{datosUsuarioPedido.id}</span>
                                                </div>
                                                <div style={estiloFilaDatos}>
                                                    <span style={estiloLabelDato}>Rango</span>
                                                    <span style={estiloValorDato}>{datosUsuarioPedido.rango || '—'}</span>
                                                </div>
                                                <div style={estiloFilaDatos}>
                                                    <span style={estiloLabelDato}>Institución</span>
                                                    <span style={estiloValorDato}>{datosUsuarioPedido.institucion || '—'}</span>
                                                </div>
                                                <div style={estiloFilaDatos}>
                                                    <span style={estiloLabelDato}>Alérgico</span>
                                                    <span style={{
                                                        ...estiloValorDato,
                                                        fontWeight: 'bold',
                                                        color: datosUsuarioPedido.alergias ? '#c0392b' : '#27ae60'
                                                    }}>
                                                        {datosUsuarioPedido.alergias ? 'Sí' : 'No'}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <p style={{ color: '#8a9a9a', fontSize: '0.9rem', margin: 0 }}>Cargando datos...</p>
                                        )}
                                    </div>
                                )}

                                {/* FLUJO DE ESTADO */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={estiloSeccion}>Estado del pedido</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {ESTADOS.map(e => {
                                            const activo = (pedidoDetalle.estado || 'Sin asignar') === e;
                                            const estilo = coloresEstado[e];
                                            return (
                                                <span key={e} style={{
                                                    padding: '6px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: activo ? estilo.bg : '#f2ede8',
                                                    color: activo ? estilo.color : '#c0b5ae',
                                                    border: activo ? `1.5px solid ${estilo.color}` : '1.5px solid transparent'
                                                }}>
                                                    {e}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Botón para avanzar estado desde el detalle */}
                                    {(esTrabajador || esAdmin) && ESTADOS.indexOf(pedidoDetalle.estado || 'Sin asignar') < ESTADOS.length - 1 && (
                                        <button
                                            onClick={() => cambiarEstado(pedidoDetalle)}
                                            style={{
                                                marginTop: '12px',
                                                backgroundColor: '#689d9d',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '10px 20px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                width: '100%'
                                            }}
                                        >
                                            Marcar como: {ESTADOS[ESTADOS.indexOf(pedidoDetalle.estado || 'Sin asignar') + 1]}
                                        </button>
                                    )}
                                </div>

                                {/* PRODUCTOS */}
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={estiloSeccion}>Productos</p>
                                    {(pedidoDetalle.productos || []).map((prod, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                            <span style={{ color: '#3d2318', fontSize: '0.95rem' }}>
                                                {prod.nombre}{prod.opcion ? ` (${prod.opcion})` : ''}
                                                <span style={{ color: '#8a9a9a', fontSize: '0.85rem' }}> x{prod.cantidad}</span>
                                            </span>
                                            <span style={{ color: '#689d9d', fontWeight: 'bold' }}>
                                                {(parseFloat(prod.precio) * prod.cantidad).toFixed(2)} €
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* EXTRAS */}
                                {(pedidoDetalle.extras || []).length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={estiloSeccion}>Extras</p>
                                        {pedidoDetalle.extras.map((extra, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ color: '#3d2318', fontSize: '0.95rem' }}>{extra.nombre_ex}</span>
                                                <span style={{ color: '#689d9d', fontWeight: 'bold' }}>{extra.precio_ex} €</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{ height: '1px', backgroundColor: '#e8ddd7', margin: '12px 0' }} />

                                {/* FECHA Y TOTAL */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ margin: 0, color: '#8a9a9a', fontSize: '0.85rem' }}>
                                        {formatearFecha(pedidoDetalle.fecha)}
                                    </p>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#3d2318', fontSize: '1.2rem' }}>
                                        Total: {pedidoDetalle.total} €
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
}

/* ── ESTILOS ── */

const estiloSeccion = {
    margin: '0 0 10px 0',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#8a9a9a'
};

const estiloFilaDatos = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
};

const estiloLabelDato = {
    fontSize: '0.85rem',
    color: '#8a9a9a'
};

const estiloValorDato = {
    fontSize: '0.9rem',
    color: '#3d2318',
    fontWeight: '500'
};

export default Orders;