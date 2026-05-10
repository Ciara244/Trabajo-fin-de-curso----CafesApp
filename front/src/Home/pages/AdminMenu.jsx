/**
 * AdminMenu.jsx
 * 
 * Página de administración del menú, accesible solo para usuarios con rol 'admin'.
 * Permite añadir, eliminar y editar productos del menú.
 * 
 * Funcionalidades principales: 
 * - Añadir producto: Formulario con campos para nombre, categoría, precio, descripción, imagen, alérgenos e ingredientes.
 *  La imagen se sube al bucket de Supabase y se guarda la URL en la tabla Menu.
 * - Eliminar producto: Lista de productos con botón para eliminar cada uno.
 * - Editar producto: Lista de productos para seleccionar, luego formulario similar al de añadir pero prellenado con los datos actuales.
 * - Feedback visual para el admin tras cada acción (añadir, eliminar, editar).
 * - Control de vistas para mostrar solo el formulario o lista correspondiente a la acción seleccionada.
 * - Validaciones básicas en el formulario (campos obligatorios, formato de precio).
 * - Uso de componentes CheckboxInput y RadioInput para seleccionar alérgenos, ingredientes y categoría.
 * - Diseño adaptado para facilitar la gestión del menú por parte del administrador.
 */

import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { IonContent, IonPage } from "@ionic/react";
import "../style/import.css";
import { useHistory } from "react-router-dom";

import CheckboxInput from "../components/input/Checkbox";
import RadioInput from "../components/input/Radio";
import plus from "../../resources/img/plus.webp";

const categorias = [
    "Bebida caliente",
    "Bebida fría",
    "Bocadillo",
    "Golosina",
    "Combo excursión"
];

const formularioVacio = {
    nombre: "",
    categoria: "Bebida caliente",
    "precio_€": "",
    imagen: "",
    descripcion: ""
};

function AdminMenu() {
    const [vistaActiva, setVistaActiva] = useState(null);
    const [productos, setProductos] = useState([]);
    const [formulario, setFormulario] = useState(formularioVacio);
    const [productoEditando, setProductoEditando] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [picture, setPicture] = useState(plus);
    
    // Estado y cambio exclusivo para la imagen en la vista de edición
    const [editPicture, setEditPicture] = useState(null);

    // Modal de confirmación personalizado
    const [modalConfirm, setModalConfirm] = useState({ visible: false, texto: '', onAceptar: null });

    const nav = useHistory();

    useEffect(() => {
        fetchProductos();
    }, []);

    async function fetchProductos() {
        try {
            const { data, error } = await supabase
                .from('Menu')
                .select('*')
                .order('id', { ascending: true });
            if (error) throw error;
            setProductos(data || []);
        } catch (error) {
            console.error("Error al cargar productos:", error.message);
        }
    }

    function mostrarMensaje(texto) {
        setMensaje(texto);
        setTimeout(() => setMensaje(""), 3000);
    }

    function handleFormulario(campo, valor) {
        setFormulario(prev => ({ ...prev, [campo]: valor }));
    }

    function cambiarVista(vista) {
        setVistaActiva(vistaActiva === vista ? null : vista);
        setFormulario(formularioVacio);
        setProductoEditando(null);
        setPicture(plus);
        setEditPicture(null); // Limpiar imagen de edición
    }

    function pictureChange(img) {
        const file = img.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPicture(reader.result);
        reader.readAsDataURL(file);
    }
    
    // Función exclusiva para cambiar la imagen en la vista de edición
    function editPictureChange(img) {
        const file = img.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setEditPicture(reader.result);
        reader.readAsDataURL(file);
    }

    // Muestra el modal y guarda la acción a ejecutar si el usuario acepta
    function confirmar(texto, accion) {
        setModalConfirm({ visible: true, texto, onAceptar: accion });
    }

    function cerrarModal() {
        setModalConfirm({ visible: false, texto: '', onAceptar: null });
    }

    async function añadirProducto(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const nombre = formData.get("nameProduct");
        const categoriaRaw = formData.get("category");
        const precio = parseFloat(formData.get("priceProduct"));
        const descripcion = formData.get("descripcionProduct") || "";
        const alergenosArray = formData.getAll("allergensDiv");
        const ingredientesArray = formData.getAll("ingredientsDiv");

        if (!nombre || isNaN(precio) || picture === plus) {
            mostrarMensaje("Nombre, precio e imagen son obligatorios.");
            return;
        }

        const alergenosFormateado = { [nombre]: alergenosArray };
        const ingredientesFormateado = { [nombre]: ingredientesArray };

        try {
            let carpeta = "";
            let categoriaFormateada = "Bebida caliente";

            switch (categoriaRaw?.toLowerCase()) {
                case "bocadillo":
                    carpeta = "bocadillos"; categoriaFormateada = "Bocadillo"; break;
                case "bebida caliente":
                    carpeta = "bebidasCalientes"; categoriaFormateada = "Bebida caliente"; break;
                case "bebida fria":
                case "bebida fría":
                    carpeta = "bebidasFrias"; categoriaFormateada = "Bebida fría"; break;
                case "golosina":
                    carpeta = "golosinas"; categoriaFormateada = "Golosina"; break;
                default:
                    carpeta = "otros"; categoriaFormateada = "Otros"; break;
            }

            const response = await fetch(picture);
            const blob = await response.blob();
            const mimeType = blob.type.split('/')[1] || 'png';
            const nombreLimpio = nombre.replace(/\s+/g, '_').toLowerCase();
            const fileName = `${Date.now()}_${nombreLimpio}.${mimeType}`;
            const filePath = `${carpeta}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('img').upload(filePath, blob);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('img').getPublicUrl(filePath);
            const publicUrl = urlData.publicUrl;

            const { error: insertError } = await supabase.from('Menu').insert([{
                nombre, categoria: categoriaFormateada,
                "precio_€": precio, alergenos: alergenosFormateado,
                ingredientes: ingredientesFormateado, imagen: publicUrl, descripcion
            }]);
            if (insertError) throw insertError;

            mostrarMensaje(`"${nombre}" añadido correctamente.`);
            e.target.reset();
            setPicture(plus);
            fetchProductos();

        } catch (error) {
            console.error("Error completo:", error);
            mostrarMensaje("Error al subir la imagen o procesar el producto.");
        }
    }

    async function eliminarProducto(id, nombre) {
        confirmar(
            `¿Seguro que quieres eliminar "${nombre}"?`,
            async () => {
                cerrarModal();
                try {
                    const { error } = await supabase.from('Menu').delete().eq('id', id);
                    if (error) throw error;
                    mostrarMensaje(`"${nombre}" eliminado correctamente.`);
                    fetchProductos();
                } catch (error) {
                    console.error("Error al eliminar producto:", error.message);
                    mostrarMensaje("Error al eliminar el producto.");
                }
            }
        );
    }

    function seleccionarParaEditar(producto) {
        setProductoEditando(producto);
        setEditPicture(producto.imagen || plus); // Cargar imagen actual o plus si no hay
        setFormulario({
            nombre: producto.nombre || "",
            categoria: producto.categoria || "Bebida caliente",
            "precio_€": producto["precio_€"] || "",
            imagen: producto.imagen || "", // Mantener URL original por si no se cambia
            descripcion: producto.descripcion || ""
        });
    }

    async function guardarEdicion() {
        if (!formulario.nombre || !formulario["precio_€"]) {
            mostrarMensaje("Nombre y precio son obligatorios.");
            return;
        }
        try {
            let finalImageUrl = productoEditando.imagen; // Mantener imagen original por defecto
            
            // Detectar si se ha subido una nueva imagen (es base64)
            const newImageSelected = editPicture && String(editPicture).startsWith("data:image/");
            
            if (newImageSelected) {
                // Lógica de subida adaptada de añadirProducto
                let carpeta = "";
                switch (formulario.categoria?.toLowerCase()) {
                    case "bocadillo": carpeta = "bocadillos"; break;
                    case "bebida caliente": carpeta = "bebidasCalientes"; break;
                    case "bebida fria":
                    case "bebida fría": carpeta = "bebidasFrias"; break;
                    case "golosina": carpeta = "golosinas"; break;
                    default: carpeta = "otros"; break;
                }

                const response = await fetch(editPicture);
                const blob = await response.blob();
                const mimeType = blob.type.split('/')[1] || 'png';
                const nombreLimpio = formulario.nombre.replace(/\s+/g, '_').toLowerCase();
                const fileName = `${Date.now()}_${nombreLimpio}.${mimeType}`;
                const filePath = `${carpeta}/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('img').upload(filePath, blob);
                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage.from('img').getPublicUrl(filePath);
                finalImageUrl = urlData.publicUrl;
            }

            const { error } = await supabase.from('Menu').update({
                nombre: formulario.nombre,
                categoria: formulario.categoria,
                "precio_€": parseFloat(formulario["precio_€"]),
                imagen: finalImageUrl, // Usar la URL actualizada o la original
                descripcion: formulario.descripcion
            }).eq('id', productoEditando.id);
            if (error) throw error;
            mostrarMensaje(`"${formulario.nombre}" actualizado correctamente.`);
            setProductoEditando(null);
            setEditPicture(null);
            setFormulario(formularioVacio);
            fetchProductos();
        } catch (error) {
            console.error("Error al editar producto:", error.message);
            mostrarMensaje("Error al editar el producto.");
        }
    }

    return (
        <IonPage>
            <IonContent className="contentBackground">
                <div className="padre">
                    <div className="cuerpo admin-body">

                        {/* CABECERA */}
                        <div className="admin-header">
                            <button onClick={() => nav.goBack()} className="btn-volver">Volver</button>
                            <h1 className="titulo-admin">Editor del menú</h1>
                        </div>

                        {/* MENSAJE DE FEEDBACK */}
                        {mensaje !== "" && (
                            <div className="feedback-msg">{mensaje}</div>
                        )}

                        {/* BOTONES PRINCIPALES */}
                        <div className="admin-actions-container">
                            <button onClick={() => cambiarVista("añadir")} className={`btn-accion ${vistaActiva === "añadir" ? 'bg-teal' : 'bg-teal-light'}`}>Añadir</button>
                            <button onClick={() => cambiarVista("eliminar")} className={`btn-accion ${vistaActiva === "eliminar" ? 'bg-red' : 'bg-teal-light'}`}>Eliminar</button>
                            <button onClick={() => cambiarVista("editar")} className={`btn-accion ${vistaActiva === "editar" ? 'bg-brown' : 'bg-teal-light'}`}>Editar</button>
                        </div>

                        {/* ── VISTA: AÑADIR ── */}
                        {vistaActiva === "añadir" && (
                            <div className="tarjeta-admin">
                               <form onSubmit={añadirProducto}>
                                    <div className={"product productAdd admin-padding-20"}>
                                        <div id="photoProduct" className="admin-photo-container">
                                            <img
                                                alt={"Inserte la imagen del producto"}
                                                src={picture}
                                                id="addProduct"
                                                className={`admin-image-preview ${picture === plus ? "smallImg" : "bigImg"}`}
                                                onClick={() => document.getElementById("fileInput").click()}
                                            />
                                            <input type="file" accept="image/*" id="fileInput" className="admin-hidden" onChange={pictureChange} />
                                        </div>

                                        <div className="admin-input-row">
                                            <button type="button" id="addIcon" className="admin-icon-btn">+</button>
                                            <input type="text" placeholder="Insertar nombre del producto" name="nameProduct" required className="input-admin admin-flex-1" />
                                        </div>

                                        <p className="admin-label-bold">Alergias:</p>
                                        <div className={"allergensList admin-mb-20"}>
                                            <ul className="admin-checkbox-list">
                                                <CheckboxInput txt="gluten" name="Gluten" group="allergensDiv" />
                                                <CheckboxInput txt="huevos" name="Huevos" group="allergensDiv" />
                                                <CheckboxInput txt="pescado" name="Pescado" group="allergensDiv" />
                                                <CheckboxInput txt="soja" name="Soja" group="allergensDiv" />
                                                <CheckboxInput txt="cacahuetes" name="Cacahuetes" group="allergensDiv" />
                                                <CheckboxInput txt="lacteos" name="Lacteos" group="allergensDiv" />
                                            </ul>
                                        </div>

                                        <p className="admin-label-bold">Ingredientes:</p>
                                        <div className="admin-mb-20">
                                            <ul className="admin-grid-list">
                                                <CheckboxInput txt="jamon" name="Jamón" group="ingredientsDiv" />
                                                <CheckboxInput txt="embutido" name="Embutido" group="ingredientsDiv" />
                                                <CheckboxInput txt="papa" name="Papa" group="ingredientsDiv" />
                                                <CheckboxInput txt="pechuga" name="Pechuga" group="ingredientsDiv" />
                                                <CheckboxInput txt="lomo" name="Lomo" group="ingredientsDiv" />
                                                <CheckboxInput txt="atun" name="Atún" group="ingredientsDiv" />
                                                <CheckboxInput txt="mayonesa" name="Mayonesa" group="ingredientsDiv" />
                                                <CheckboxInput txt="alioli" name="Alioli" group="ingredientsDiv" />
                                                <CheckboxInput txt="queso" name="Queso" group="ingredientsDiv" />
                                                <CheckboxInput txt="lechuga" name="Lechuga" group="ingredientsDiv" />
                                                <CheckboxInput txt="millo" name="Millo" group="ingredientsDiv" />
                                                <CheckboxInput txt="tomate" name="Tomate" group="ingredientsDiv" />
                                                <CheckboxInput txt="huevo" name="Huevo" group="ingredientsDiv" />
                                                <CheckboxInput txt="leche" name="Leche" group="ingredientsDiv" />
                                                <CheckboxInput txt="pan" name="Pan" group="ingredientsDiv" />
                                            </ul>
                                        </div>

                                        <p className="admin-label-bold">Categoría:</p>
                                        <div className="admin-mb-20">
                                            <ul className="admin-checkbox-list">
                                                <RadioInput txt="bocadillo" name="category" />
                                                <RadioInput txt="bebida caliente" name="category" />
                                                <RadioInput txt="bebida fria" name="category" />
                                                <RadioInput txt="golosina" name="category" />
                                            </ul>
                                        </div>

                                        <p className="admin-label-bold">Descripción:</p>
                                        <div className="admin-flex-row admin-mb-20">
                                            <textarea
                                                placeholder="Escribe una breve descripción del producto"
                                                name="descripcionProduct"
                                                className="input-admin admin-textarea"
                                                required
                                            />
                                        </div>

                                        <p className="admin-label-bold">Precio:</p>
                                        <div className="admin-input-row">
                                            <button type="button" id="addIcon" className="admin-icon-btn">+</button>
                                            <input type="number" placeholder="0.00" name="priceProduct" step="0.01" required className="input-admin admin-flex-1" />
                                        </div>

                                        <div className="admin-save-container">
                                            <button className={"aquaButton admin-btn-save"} type="submit">
                                                Guardar en menú
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ── VISTA: ELIMINAR ── */}
                        {vistaActiva === "eliminar" && (
                            <div className="tarjeta-admin">
                                <p className="titulo-admin">Selecciona el producto a eliminar</p>
                                <div className="admin-form-group">
                                    {productos.map(producto => (
                                        <div key={producto.id} className="fila-admin">
                                            <div>
                                                <p className="producto-nombre">{producto.nombre}</p>
                                                <p className="producto-detalle">{producto.categoria} — {producto["precio_€"]} €</p>
                                            </div>
                                            <button
                                                onClick={() => eliminarProducto(producto.id, producto.nombre)}
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
                                {!productoEditando ? (
                                    <>
                                        <p className="titulo-admin">Selecciona el producto a editar</p>
                                        <div className="admin-form-group">
                                            {productos.map(producto => (
                                                <div key={producto.id} className="fila-admin fila-admin-pointer" onClick={() => seleccionarParaEditar(producto)}>
                                                    <div>
                                                        <p className="producto-nombre">{producto.nombre}</p>
                                                        <p className="producto-detalle">{producto.categoria} — {producto["precio_€"]} €</p>
                                                    </div>
                                                    <span className="btn-editar-text">Editar</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="admin-edit-header">
                                            <button onClick={() => { setProductoEditando(null); setEditPicture(null); setFormulario(formularioVacio); }} className="btn-volver btn-volver-custom">Atras</button>
                                            <p className="titulo-admin editando-titulo">Editando: {productoEditando.nombre}</p>
                                        </div>
                                        <div className="admin-form-group">
                                            <input placeholder="Nombre del producto" value={formulario.nombre} onChange={e => handleFormulario('nombre', e.target.value)} className="input-admin" />
                                            <select value={formulario.categoria} onChange={e => handleFormulario('categoria', e.target.value)} className="input-admin">
                                                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <input placeholder="Precio (ej: 1.50)" type="number" step="0.01" value={formulario["precio_€"]} onChange={e => handleFormulario('precio_€', e.target.value)} className="input-admin" />
                                            
                                            {/* Sección de Imagen actualizada en Edición */}
                                            <p className="admin-label-bold">Imagen:</p>
                                            <div className="admin-padding-20 admin-edit-photo-upload-container">
                                                <div className="admin-photo-container">
                                                    <img
                                                        alt={"Imagen del producto"}
                                                        src={editPicture} // Muestra la imagen actual o el preview de la nueva
                                                        id="editAddProductImage"
                                                        // Se usa siempre bigImg para previsualizar la foto cargada o actual
                                                        className="admin-image-preview bigImg"
                                                        onClick={() => document.getElementById("editFileInput").click()}
                                                    />
                                                    {/* Input de archivo exclusivo para edición */}
                                                    <input type="file" accept="image/*" id="editFileInput" className="admin-hidden" onChange={editPictureChange} />
                                                </div>
                                            </div>

                                            <input placeholder="Descripción (opcional)" value={formulario.descripcion} onChange={e => handleFormulario('descripcion', e.target.value)} className="input-admin" />
                                            <button onClick={guardarEdicion} className="btn-confirmar bg-brown">Guardar cambios</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* MODAL DE CONFIRMACIÓN PERSONALIZADO */}
                {modalConfirm.visible && (
                    <>
                        <div className="admin-modal-overlay" />
                        <div className="admin-modal-box">
                            <p className="admin-modal-text">
                                {modalConfirm.texto}
                            </p>
                            <div className="admin-modal-actions">
                                <button onClick={cerrarModal} className="admin-modal-btn-cancel">
                                    Cancelar
                                </button>
                                <button onClick={modalConfirm.onAceptar} className="admin-modal-btn-confirm">
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

export default AdminMenu;