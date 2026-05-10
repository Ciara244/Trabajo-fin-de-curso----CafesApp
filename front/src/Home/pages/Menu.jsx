/**
 * Menu.jsx
 * Página de menú para el cliente.
 * Muestra los productos disponibles organizados por categorías, con su imagen, nombre, descripción y precio.
 * El cliente puede navegar por las categorías para filtrar los productos y ver solo los que le interesan.
 * Si el cliente es un administrador, también puede acceder a un panel de edición para añadir o eliminar productos del menú.
 * El diseño es limpio y visual, con imágenes atractivas y una interfaz fácil de usar tanto para clientes como para administradores.
 * Se utiliza el contexto UserLogin para mostrar opciones específicas según el rol del usuario (cliente o administrador).
 * La página se conecta a Supabase para obtener la lista de productos desde la tabla Menu y reflejar los cambios en tiempo real tras añadir o eliminar productos.
 * Cada producto se muestra con su imagen, nombre, descripción y precio, y el administrador tiene botones claros para gestionar el menú de forma intuitiva.
 * El código está estructurado de forma clara, con funciones separadas para cada acción (filtrar por categoría, añadir producto, eliminar producto) y un sistema de mensajes 
 * para dar feedback al administrador tras cada acción realizada.
 */

import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../style/import.css";
import { UserLogin } from "../js/UserId";


import { IonContent, IonPage } from "@ionic/react";
import { supabase } from "../../services/supabaseClient";

/* COMPONENTS */
import Loading from "../components/Loading";
import Header from "../components/Header";
import Item from "../ionic/Item";

// Categorías de los productos
const category = [
    "Todos",
    "Bebida caliente",
    "Bebida fría",
    "Bocadillo",
    "Golosina",
    "Combo excursión"
];

// Formulario vacío para añadir producto (refleja las columnas de la tabla Menu)
const formularioVacio = {
    nombre: "",
    categoria: "Bebida caliente",
    "precio_€": "",
    imagen: "",
    descripcion: ""
};

function Menu() {

    const [loader, setLoader] = useState(true);
    const [productos, setProductos] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const nav = useHistory(); // Para navegar a la página de edición del menú

    // Controla si el panel de edición está abierto o cerrado
    const [modoEditor, setModoEditor] = useState(false);

    // Datos del formulario para añadir un nuevo producto
    const [formulario, setFormulario] = useState(formularioVacio);

    // Mensaje de feedback al admin tras una acción (añadir o eliminar)
    const [mensajeAdmin, setMensajeAdmin] = useState("");

    const { user } = useContext(UserLogin);

    useEffect(() => {
        fetchDataProduct(true);
    }, []);

    async function fetchDataProduct(firstTime = false) {
        try {
            const { data, error } = await supabase.from('Menu').select('*').order('id', { ascending: true });
            if (error) throw error;
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener productos:", error.message);
        } finally {
            if (firstTime) {
                setTimeout(() => setLoader(false), 1000);
            }
        }
    }

    // Elimina un producto de la tabla Menu por su id
    async function eliminarProducto(id, nombre) {
        const confirmar = window.confirm(`¿Seguro que quieres eliminar "${nombre}"?`);
        if (!confirmar) return;

        try {
            const { error } = await supabase.from('Menu').delete().eq('id', id);
            if (error) throw error;

            mostrarMensaje(`"${nombre}" eliminado correctamente.`);
            fetchDataProduct(); // Recarga la lista tras eliminar
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            mostrarMensaje("Error al eliminar el producto.");
        }
    }

    // Añade un nuevo producto a la tabla Menu con los datos del formulario
    async function añadirProducto() {
        if (!formulario.nombre || !formulario["precio_€"] || !formulario.imagen) {
            mostrarMensaje("Nombre, precio e imagen son obligatorios.");
            return;
        }

        try {
            const { error } = await supabase.from('Menu').insert([{
                nombre: formulario.nombre,
                categoria: formulario.categoria,
                "precio_€": parseFloat(formulario["precio_€"]),
                imagen: formulario.imagen,
                descripcion: formulario.descripcion
            }]);

            if (error) throw error;

            mostrarMensaje(`"${formulario.nombre}" añadido correctamente.`);
            setFormulario(formularioVacio); // Resetea el formulario
            fetchDataProduct(); // Recarga la lista tras añadir
        } catch (error) {
            console.error("Error al añadir producto:", error.message);
            mostrarMensaje("Error al añadir el producto.");
        }
    }

    // Muestra un mensaje de feedback durante 3 segundos
    function mostrarMensaje(texto) {
        setMensajeAdmin(texto);
        setTimeout(() => setMensajeAdmin(""), 3000);
    }

    // Actualiza el estado del formulario al escribir en un campo
    function handleFormulario(campo, valor) {
        setFormulario(prev => ({ ...prev, [campo]: valor }));
    }

    const productosFiltrados = activeCategory === "Todos"
        ? productos
        : productos.filter(producto => producto.categoria === activeCategory);

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                <div className={'padre'}>

                    {loader ? <Loading /> : null}
                    <Header user={user} menu={true} />

                    <div className={"cuerpo"}>

                        {/* BARRA DE CATEGORIAS */}
                        <div className="categoryList">
                            {category.map((cat) => (
                                <div
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`categoria-btn ${activeCategory === cat ? 'activa' : 'inactiva'}`}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>

                        {/* LISTADO DE PRODUCTOS */}
                        {productosFiltrados.map((product) => (
                            <Item key={product.id} data={product} />
                        ))}

                        {/* MENSAJE DE CATEGORIA VACIA */}
                        {productosFiltrados.length === 0 && !loader && (
                            <p className="empty-category-msg">
                                Aún no hay productos en esta categoría.
                            </p>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Menu;