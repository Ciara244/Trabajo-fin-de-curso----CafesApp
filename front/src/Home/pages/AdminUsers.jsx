/**
 * AdminUsers.jsx
 * Página de administración de usuarios para el panel de admin.
 * Permite visualizar todos los usuarios registrados, filtrarlos por tipo (alumnos, profesores) o estado (activos, suspendidos).
 * Desde esta página, el admin puede seleccionar un usuario para ver sus detalles y cambiar su estado (suspender o reactivar cuenta).
 * Se utiliza el contexto de Supabase para obtener y actualizar los datos de los usuarios en la base de datos.
 * El diseño es limpio y funcional, con un sistema de filtros en la parte superior y una lista de usuarios que muestra información relevante como nombre, rango, institución y estado.
 * Al hacer clic en un usuario, se abre un panel lateral con más detalles y opciones para gestionar su cuenta.
 * También se incluye un sistema de mensajes para informar al admin sobre el resultado de las acciones realizadas (suspender/reactivar).
 */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { IonContent, IonPage, IonHeader, IonToolbar } from "@ionic/react";
import "../style/import.css";

const FILTROS = ['Todos', 'Alumnos', 'Profesores', 'Activas', 'Suspendidas'];

function AdminUsers() {
    const nav = useHistory();

    const [usuarios, setUsuarios] = useState([]);
    const [loader, setLoader] = useState(true);
    const [filtroActivo, setFiltroActivo] = useState('Todos');
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);
    const [mensaje, setMensaje] = useState('');

    // Modal de confirmación personalizado
    const [modalConfirm, setModalConfirm] = useState({ visible: false, texto: '', onAceptar: null });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    async function fetchUsuarios() {
        try {
            const { data, error } = await supabase
                .from('Usuario')
                .select('id, nombre, turno, rango, institucion, alergias, suspendido')
                .order('nombre', { ascending: true });
            if (error) throw error;
            setUsuarios(data || []);
        } catch (error) {
            console.error("Error al cargar usuarios:", error.message);
        } finally {
            setLoader(false);
        }
    }

    // Muestra el modal y guarda la acción a ejecutar si el usuario acepta
    function confirmar(texto, accion) {
        setModalConfirm({ visible: true, texto, onAceptar: accion });
    }

    function cerrarModal() {
        setModalConfirm({ visible: false, texto: '', onAceptar: null });
    }

    async function toggleSuspendido(usuario) {
        const nuevoEstado = !usuario.suspendido;
        const accion = nuevoEstado ? 'suspender' : 'reactivar';

        confirmar(
            `¿Seguro que quieres ${accion} la cuenta de "${usuario.nombre}"?`,
            async () => {
                cerrarModal();
                try {
                    const { error } = await supabase
                        .from('Usuario')
                        .update({ suspendido: nuevoEstado })
                        .eq('id', usuario.id);
                    if (error) throw error;

                    setUsuarios(prev => prev.map(u =>
                        u.id === usuario.id ? { ...u, suspendido: nuevoEstado } : u
                    ));
                    if (usuarioDetalle?.id === usuario.id) {
                        setUsuarioDetalle(prev => ({ ...prev, suspendido: nuevoEstado }));
                    }
                    mostrarMensaje(`Cuenta de "${usuario.nombre}" ${nuevoEstado ? 'suspendida' : 'reactivada'} correctamente.`);
                } catch (error) {
                    console.error("Error al cambiar estado:", error.message);
                    mostrarMensaje("Error al actualizar la cuenta.");
                }
            }
        );
    }

    function mostrarMensaje(texto) {
        setMensaje(texto);
        setTimeout(() => setMensaje(''), 3000);
    }

    const usuariosFiltrados = usuarios.filter(u => {
        if (filtroActivo === 'Todos') return true;
        if (filtroActivo === 'Alumnos') return u.rango === 'alumno';
        if (filtroActivo === 'Profesores') return u.rango === 'profesor';
        if (filtroActivo === 'Activas') return !u.suspendido;
        if (filtroActivo === 'Suspendidas') return u.suspendido;
        return true;
    });

    return (
        <IonPage>

            <IonHeader>
                <IonToolbar style={{ '--background': '#fff', '--border-color': '#e8ddd7' }}>
                    <div style={{
                        display: 'flex', gap: '8px', padding: '8px 16px',
                        overflowX: 'scroll', WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none', msOverflowStyle: 'none',
                    }}>
                        {FILTROS.map(filtro => (
                            <button
                                key={filtro}
                                onClick={() => setFiltroActivo(filtro)}
                                style={{
                                    padding: '7px 16px', borderRadius: '20px', flexShrink: 0,
                                    border: filtroActivo === filtro ? '1.5px solid #689d9d' : '1.5px solid transparent',
                                    cursor: 'pointer', fontWeight: 'bold', fontSize: '0.82rem', whiteSpace: 'nowrap',
                                    backgroundColor: filtroActivo === filtro ? '#e8f5f5' : '#f2ede8',
                                    color: filtroActivo === filtro ? '#689d9d' : '#8a9a9a'
                                }}
                            >
                                {filtro}
                                <span style={{ marginLeft: '5px', opacity: 0.8 }}>
                                    ({filtro === 'Todos' ? usuarios.length
                                      : filtro === 'Alumnos' ? usuarios.filter(u => u.rango === 'alumno').length
                                      : filtro === 'Profesores' ? usuarios.filter(u => u.rango === 'profesor').length
                                      : filtro === 'Activas' ? usuarios.filter(u => !u.suspendido).length
                                      : usuarios.filter(u => u.suspendido).length})
                                </span>
                            </button>
                        ))}
                    </div>
                </IonToolbar>
            </IonHeader>

            <IonContent className={"contentBackground"}>
                <div className={"padre"}>
                    <div className={"cuerpo"} style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <button onClick={() => nav.goBack()} style={estiloBotonVolver}>Volver</button>
                            <h2 style={{ margin: 0, color: '#3d2318', fontSize: '1.4rem' }}>Usuarios</h2>
                            <span style={{ marginLeft: 'auto', backgroundColor: '#689d9d', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                {usuariosFiltrados.length}
                            </span>
                        </div>

                        {mensaje !== '' && (
                            <div style={{ backgroundColor: '#689d9d', color: '#fff', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center' }}>
                                {mensaje}
                            </div>
                        )}

                        {loader && <p style={{ textAlign: 'center', color: '#8a9a9a', marginTop: '40px' }}>Cargando usuarios...</p>}

                        {!loader && usuariosFiltrados.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#8a9a9a', marginTop: '40px' }}>No hay usuarios en esta categoría.</p>
                        )}

                        {usuariosFiltrados.map(usuario => (
                            <div
                                key={usuario.id}
                                onClick={() => setUsuarioDetalle(usuario)}
                                style={{
                                    backgroundColor: '#fff',
                                    border: `1px solid ${usuario.suspendido ? '#f5c6c6' : '#e8ddd7'}`,
                                    borderRadius: '16px', padding: '16px', marginBottom: '12px',
                                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(92,65,52,0.06)',
                                    opacity: usuario.suspendido ? 0.75 : 1
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#3d2318', fontSize: '1rem' }}>{usuario.nombre}</p>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold',
                                        backgroundColor: usuario.suspendido ? '#fdecea' : '#e8f5e9',
                                        color: usuario.suspendido ? '#c0392b' : '#27ae60'
                                    }}>
                                        {usuario.suspendido ? 'Suspendida' : 'Activa'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <span style={estiloTag}>ID: {usuario.id}</span>
                                    <span style={estiloTag}>{usuario.rango === 'alumno' ? 'Alumno' : 'Profesor'}</span>
                                    {usuario.institucion && <span style={estiloTag}>{usuario.institucion}</span>}
                                    {usuario.alergias && (
                                        <span style={{ ...estiloTag, backgroundColor: '#fdecea', color: '#c0392b' }}>Alérgico</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANEL DE DETALLE */}
                {usuarioDetalle && (
                    <>
                        <div onClick={() => setUsuarioDetalle(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 150 }} />
                        <div style={{
                            position: 'fixed', bottom: 0, left: 0, right: 0,
                            backgroundColor: '#fff', borderRadius: '20px 20px 0 0',
                            padding: '24px 20px 40px', zIndex: 200,
                            maxHeight: '80vh', overflowY: 'auto',
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, color: '#3d2318' }}>{usuarioDetalle.nombre}</h3>
                                <button onClick={() => setUsuarioDetalle(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#5c4134' }}>✕</button>
                            </div>

                            <div style={{
                                backgroundColor: usuarioDetalle.suspendido ? '#fdecea' : '#e8f5e9',
                                border: `1px solid ${usuarioDetalle.suspendido ? '#f5c6c6' : '#c8e6c9'}`,
                                borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 'bold', color: usuarioDetalle.suspendido ? '#c0392b' : '#27ae60' }}>
                                    Cuenta {usuarioDetalle.suspendido ? 'suspendida' : 'activa'}
                                </span>
                                <button
                                    onClick={() => toggleSuspendido(usuarioDetalle)}
                                    style={{
                                        backgroundColor: usuarioDetalle.suspendido ? '#27ae60' : '#c0392b',
                                        color: '#fff', border: 'none', borderRadius: '10px',
                                        padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
                                    }}
                                >
                                    {usuarioDetalle.suspendido ? 'Reactivar' : 'Suspender'}
                                </button>
                            </div>

                            <p style={estiloSeccion}>Datos del usuario</p>
                            {[
                                ['ID', usuarioDetalle.id],
                                ['Nombre', usuarioDetalle.nombre],
                                ['Rango', usuarioDetalle.rango === 'alumno' ? 'Alumno' : 'Profesor'],
                                ['Turno', usuarioDetalle.turno || '—'],
                                ['Institución', usuarioDetalle.institucion || '—'],
                            ].map(([label, valor]) => (
                                <div key={label} style={estiloFilaDatos}>
                                    <span style={estiloLabel}>{label}</span>
                                    <span style={estiloValor}>{valor}</span>
                                </div>
                            ))}
                            <div style={estiloFilaDatos}>
                                <span style={estiloLabel}>Alérgico</span>
                                <span style={{ ...estiloValor, fontWeight: 'bold', color: usuarioDetalle.alergias ? '#c0392b' : '#27ae60' }}>
                                    {usuarioDetalle.alergias ? 'Sí' : 'No'}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* MODAL DE CONFIRMACIÓN PERSONALIZADO */}
                {modalConfirm.visible && (
                    <>
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 400 }} />
                        <div style={{
                            position: 'fixed', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#fff', borderRadius: '20px',
                            padding: '28px 24px', zIndex: 500,
                            width: '85%', maxWidth: '360px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            textAlign: 'center'
                        }}>
                            <p style={{ margin: '0 0 24px 0', color: '#3d2318', fontSize: '1rem', fontWeight: '500', lineHeight: '1.5' }}>
                                {modalConfirm.texto}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={cerrarModal}
                                    style={{
                                        flex: 1, padding: '10px 0', borderRadius: '12px',
                                        border: '1.5px solid #e8ddd7', backgroundColor: '#f2ede8',
                                        color: '#5c4134', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={modalConfirm.onAceptar}
                                    style={{
                                        flex: 1, padding: '10px 0', borderRadius: '12px',
                                        border: 'none', backgroundColor: '#689d9d',
                                        color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem'
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </>
                )}

            </IonContent>
        </IonPage>
    );
}

/* ── ESTILOS ── */
const estiloBotonVolver = {
    backgroundColor: '#efceb7', color: '#5c4134', border: 'none',
    padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '0.95rem'
};
const estiloTag = {
    backgroundColor: '#faf6f2', border: '1px solid #e8ddd7',
    borderRadius: '8px', padding: '3px 10px', fontSize: '0.8rem', color: '#5c4134'
};
const estiloSeccion = {
    margin: '0 0 12px 0', fontSize: '11px', fontWeight: '600',
    letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8a9a9a'
};
const estiloFilaDatos = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f2ede8'
};
const estiloLabel = { fontSize: '0.85rem', color: '#8a9a9a' };
const estiloValor = { fontSize: '0.9rem', color: '#3d2318', fontWeight: '500' };

export default AdminUsers;