/**
 * AdminWorkers.jsx
 * Página de administración de trabajadores para el administrador.
 * Permite añadir, eliminar y editar trabajadores en la tabla Trabajador de Supabase.
 * Cada trabajador tiene un nombre, contraseña y turno asignado (Mañana, Tarde o Noche).
 * El administrador puede gestionar los trabajadores desde esta interfaz, con feedback visual tras cada acción.
 */

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { IonContent, IonPage } from "@ionic/react";
import "../style/import.css";

// Turnos disponibles para los trabajadores
const turnos = ["Mañana", "Tarde", "Noche"];

// Formulario vacío para añadir o editar
const formularioVacio = {
    nombre_tr: "",
    pass_tr: "",
    turno_tr: "Mañana"
};

function AdminWorkers() {
    const nav = useHistory();

    // Vista activa: null | "añadir" | "eliminar" | "editar"
    const [vistaActiva, setVistaActiva] = useState(null);

    // Lista de todos los trabajadores
    const [trabajadores, setTrabajadores] = useState([]);

    // Datos del formulario para añadir o editar
    const [formulario, setFormulario] = useState(formularioVacio);

    // Trabajador seleccionado para editar
    const [trabajadorEditando, setTrabajadorEditando] = useState(null);

    // Mensaje de feedback tras cada acción
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        fetchTrabajadores();
    }, []);

    // Carga todos los trabajadores de la tabla Trabajador
    async function fetchTrabajadores() {
        try {
            const { data, error } = await supabase
                .from('Trabajador')
                .select('*')
                .order('id', { ascending: true });
            if (error) throw error;
            setTrabajadores(data || []);
        } catch (error) {
            console.error("Error al cargar trabajadores:", error.message);
        }
    }

    // Muestra un mensaje de feedback que desaparece a los 3 segundos
    function mostrarMensaje(texto) {
        setMensaje(texto);
        setTimeout(() => setMensaje(""), 3000);
    }

    // Actualiza un campo del formulario
    function handleFormulario(campo, valor) {
        setFormulario(prev => ({ ...prev, [campo]: valor }));
    }

    // Cambia de vista y resetea el formulario y el trabajador en edición
    function cambiarVista(vista) {
        setVistaActiva(vistaActiva === vista ? null : vista);
        setFormulario(formularioVacio);
        setTrabajadorEditando(null);
    }

    // Añade un nuevo trabajador a la tabla Trabajador
    async function añadirTrabajador() {
        if (!formulario.nombre_tr || !formulario.pass_tr) {
            mostrarMensaje("Nombre y contraseña son obligatorios.");
            return;
        }
        try {
            const { error } = await supabase.from('Trabajador').insert([{
                nombre_tr: formulario.nombre_tr,
                pass_tr: formulario.pass_tr,
                turno_tr: formulario.turno_tr
            }]);
            if (error) throw error;
            mostrarMensaje(`"${formulario.nombre_tr}" añadido correctamente.`);
            setFormulario(formularioVacio);
            fetchTrabajadores();
        } catch (error) {
            console.error("Error al añadir trabajador:", error.message);
            mostrarMensaje("Error al añadir el trabajador.");
        }
    }

    // Elimina un trabajador por su id tras confirmación
    async function eliminarTrabajador(id, nombre) {
        const confirmar = window.confirm(`¿Seguro que quieres eliminar a "${nombre}"?`);
        if (!confirmar) return;
        try {
            const { error } = await supabase.from('Trabajador').delete().eq('id', id);
            if (error) throw error;
            mostrarMensaje(`"${nombre}" eliminado correctamente.`);
            fetchTrabajadores();
        } catch (error) {
            console.error("Error al eliminar trabajador:", error.message);
            mostrarMensaje("Error al eliminar el trabajador.");
        }
    }

    // Carga el trabajador seleccionado en el formulario de edición
    function seleccionarParaEditar(trabajador) {
        setTrabajadorEditando(trabajador);
        setFormulario({
            nombre_tr: trabajador.nombre_tr || "",
            pass_tr: trabajador.pass_tr || "",
            turno_tr: trabajador.turno_tr || "Mañana"
        });
    }

    // Guarda los cambios del trabajador editado en Supabase
    async function guardarEdicion() {
        if (!formulario.nombre_tr || !formulario.pass_tr) {
            mostrarMensaje("Nombre y contraseña son obligatorios.");
            return;
        }
        try {
            const { error } = await supabase.from('Trabajador').update({
                nombre_tr: formulario.nombre_tr,
                pass_tr: formulario.pass_tr,
                turno_tr: formulario.turno_tr
            }).eq('id', trabajadorEditando.id);
            if (error) throw error;
            mostrarMensaje(`"${formulario.nombre_tr}" actualizado correctamente.`);
            setTrabajadorEditando(null);
            setFormulario(formularioVacio);
            fetchTrabajadores();
        } catch (error) {
            console.error("Error al editar trabajador:", error.message);
            mostrarMensaje("Error al editar el trabajador.");
        }
    }

    return (
        <IonPage>
            <IonContent className="contentBackground">
                <div className="padre">
                    <div className="cuerpo admin-body">

                        {/* CABECERA */}
                        <div className="admin-header">
                            <button onClick={() => nav.goBack()} className="btn-volver">
                                Volver
                            </button>
                            <h1 className="titulo-admin" style={{ fontSize: '1.5rem', marginBottom: 0 }}>
                                Gestión de trabajadores
                            </h1>
                        </div>

                        {/* MENSAJE DE FEEDBACK */}
                        {mensaje !== "" && (
                            <div className="feedback-msg">
                                {mensaje}
                            </div>
                        )}

                        {/* TRES BOTONES PRINCIPALES */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <button
                                onClick={() => cambiarVista("añadir")}
                                className={`btn-accion ${vistaActiva === "añadir" ? 'bg-teal' : 'bg-teal-light'}`}
                            >
                                Añadir
                            </button>
                            <button
                                onClick={() => cambiarVista("eliminar")}
                                className={`btn-accion ${vistaActiva === "eliminar" ? 'bg-red' : 'bg-teal-light'}`}
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => cambiarVista("editar")}
                                className={`btn-accion ${vistaActiva === "editar" ? 'bg-brown' : 'bg-teal-light'}`}
                            >
                                Editar
                            </button>
                        </div>

                        {/* ── VISTA: AÑADIR ── */}
                        {vistaActiva === "añadir" && (
                            <div className="tarjeta-admin">
                                <p className="titulo-admin">Nuevo trabajador</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input
                                        placeholder="Nombre de usuario"
                                        value={formulario.nombre_tr}
                                        onChange={e => handleFormulario('nombre_tr', e.target.value)}
                                        className="input-admin"
                                    />
                                    <input
                                        placeholder="Contraseña"
                                        type="password"
                                        value={formulario.pass_tr}
                                        onChange={e => handleFormulario('pass_tr', e.target.value)}
                                        className="input-admin"
                                    />
                                    <select
                                        value={formulario.turno_tr}
                                        onChange={e => handleFormulario('turno_tr', e.target.value)}
                                        className="input-admin"
                                    >
                                        {turnos.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    <button onClick={añadirTrabajador} className="btn-confirmar bg-teal">
                                        Añadir trabajador
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── VISTA: ELIMINAR ── */}
                        {vistaActiva === "eliminar" && (
                            <div className="tarjeta-admin">
                                <p className="titulo-admin">Selecciona el trabajador a eliminar</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {trabajadores.map(trabajador => (
                                        <div key={trabajador.id} className="fila-admin">
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'bold', color: '#3d2318' }}>
                                                    {trabajador.nombre_tr}
                                                </p>
                                                <p style={{ margin: 0, color: '#8a9a9a', fontSize: '0.8rem' }}>
                                                    Turno: {trabajador.turno_tr}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => eliminarTrabajador(trabajador.id, trabajador.nombre_tr)}
                                                className="btn-confirmar bg-red"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── VISTA: EDITAR ── */}
                        {vistaActiva === "editar" && (
                            <div className="tarjeta-admin">
                                {/* Si no hay trabajador seleccionado, muestra la lista */}
                                {!trabajadorEditando ? (
                                    <>
                                        <p className="titulo-admin">Selecciona el trabajador a editar</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {trabajadores.map(trabajador => (
                                                <div
                                                    key={trabajador.id}
                                                    className="fila-admin"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => seleccionarParaEditar(trabajador)}
                                                >
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#3d2318' }}>
                                                            {trabajador.nombre_tr}
                                                        </p>
                                                        <p style={{ margin: 0, color: '#8a9a9a', fontSize: '0.8rem' }}>
                                                            Turno: {trabajador.turno_tr}
                                                        </p>
                                                    </div>
                                                    <span style={{ color: '#689d9d', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                        Editar
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    /* Si hay trabajador seleccionado, muestra el formulario relleno */
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                            <button
                                                onClick={() => { setTrabajadorEditando(null); setFormulario(formularioVacio); }}
                                                className="btn-volver"
                                                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                                            >
                                                Atras
                                            </button>
                                            <p className="titulo-admin" style={{ margin: 0 }}>
                                                Editando: {trabajadorEditando.nombre_tr}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <input
                                                placeholder="Nombre de usuario"
                                                value={formulario.nombre_tr}
                                                onChange={e => handleFormulario('nombre_tr', e.target.value)}
                                                className="input-admin"
                                            />
                                            <input
                                                placeholder="Contraseña"
                                                type="password"
                                                value={formulario.pass_tr}
                                                onChange={e => handleFormulario('pass_tr', e.target.value)}
                                                className="input-admin"
                                            />
                                            <select
                                                value={formulario.turno_tr}
                                                onChange={e => handleFormulario('turno_tr', e.target.value)}
                                                className="input-admin"
                                            >
                                                {turnos.map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                            <button onClick={guardarEdicion} className="btn-confirmar bg-brown">
                                                Guardar cambios
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default AdminWorkers;