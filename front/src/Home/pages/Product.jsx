/**
 * Product.jsx
 * Página de detalle de producto para el cliente.
 * Muestra la información completa del producto seleccionado desde el menú, incluyendo su imagen, nombre, descripción, precio y alérgenos.
 * Permite al cliente personalizar su pedido eligiendo opciones (si el producto tiene variantes) y añadiendo extras disponibles para la categoría del producto.
 * El cliente puede añadir el producto al carrito con las personalizaciones seleccionadas, y se muestra un toast de confirmación al hacerlo.
 * El diseño es visual y atractivo, con una estructura clara que resalta la información del producto y las opciones de personalización de forma intuitiva.
 * Se utiliza el contexto UserLogin para mostrar información relevante según el usuario, y se conecta a Supabase para obtener los extras disponibles y el diccionario de alérgenos.
 * El código está estructurado de forma clara, con funciones separadas para cada acción (obtener extras, manejar selección de extras, calcular precio total) y un sistema de estados
 *  para gestionar la interacción del usuario con la página.
 */

import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { useHistory, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

import { IonPage, IonContent, IonFooter } from "@ionic/react";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";

function Product() {
    const { user } = useContext(UserLogin);
    const nav = useHistory();
    const location = useLocation();

    // Producto recibido por navegación desde el menú
    const prod = location.state?.product;

    // Estado para los extras disponibles según categoría
    const [extras, setExtras] = useState([]);

    // Estado para los extras que el usuario ha seleccionado
    const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);

    // Estado para el diccionario completo de alérgenos (imagen + nombre)
    const [alergenosBase, setAlergenosBase] = useState([]);

    // Estado para la opción seleccionada cuando el producto tiene variantes
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);

    // Estado para mostrar u ocultar el toast de confirmación al añadir al carrito
    const [mostrarToast, setMostrarToast] = useState(false);

    // FIX: "nav" eliminado de las dependencias para evitar re-ejecuciones
    // infinitas que provocaban la redirección involuntaria al menú
    useEffect(() => {
        if (!prod) {
            nav.replace("/tabs/menu");
            return;
        }

        if (prod.categoria) fetchExtras(prod.categoria);
        fetchAlergenos();

        if (prod.ingredientes && typeof prod.ingredientes === "object") {
            const keys = Object.keys(prod.ingredientes);
            if (keys.length > 0 && Array.isArray(prod.ingredientes[keys[0]])) {
                setOpcionSeleccionada(keys[0]);
            }
        }
    }, [prod]); // solo "prod" como dependencia

    async function fetchExtras(categoriaProducto) {
        try {
            const { data, error } = await supabase
                .from('Extras')
                .select('*')
                .eq('categoria', categoriaProducto);
            if (error) throw error;
            setExtras(data || []);
        } catch (error) {
            console.error("Error al obtener los extras:", error.message);
        }
    }

    async function fetchAlergenos() {
        try {
            const { data, error } = await supabase
                .from('Alergenos')
                .select('*');
            if (error) throw error;
            setAlergenosBase(data || []);
        } catch (error) {
            console.error("Error al obtener alérgenos:", error.message);
        }
    }

    const handleExtraToggle = (extra) => {
        setExtrasSeleccionados(prev => {
            const existe = prev.find(e => e.id === extra.id);
            return existe
                ? prev.filter(e => e.id !== extra.id)
                : [...prev, extra];
        });
    };

    const precioBase = parseFloat(prod?.["precio_€"] || 0);
    const costeExtras = extrasSeleccionados.reduce(
        (sum, ext) => sum + parseFloat(ext.precio_ex || 0),
        0
    );
    const precioTotal = (precioBase + costeExtras).toFixed(2);

    const nombresAlergenos = prod?.alergenos && typeof prod.alergenos === 'object'
        ? Object.keys(prod.alergenos)
        : [];

    const esPorOpciones =
        prod?.ingredientes &&
        typeof prod.ingredientes === "object" &&
        Object.values(prod.ingredientes).some(v => Array.isArray(v));

    const listaIngredientes = !esPorOpciones
        ? Object.keys(prod?.ingredientes || {})
        : [];

    const handleAddToCart = () => {
        if (esPorOpciones && !opcionSeleccionada) {
            alert("Selecciona una opción");
            return;
        }

        const productoCarrito = {
            id: prod.id,
            nombre: prod.nombre,
            imagen: prod.imagen,
            precio: precioTotal,
            opcion: opcionSeleccionada,
            extras: extrasSeleccionados
        };

      const claveCarrito = "carrito";
const carritoActual = JSON.parse(localStorage.getItem(claveCarrito)) || [];
carritoActual.push(productoCarrito);
localStorage.setItem(claveCarrito, JSON.stringify(carritoActual));
        setMostrarToast(true);
        setTimeout(() => setMostrarToast(false), 2500);
    };

    if (!prod) return null;

    return (
        <IonPage>
            {/* IonContent maneja el scroll perfectamente */}
            <IonContent className="contentBackground">
                <div className="padre-full">
                    <div className="cuerpo-product">
                        <Header user={user} menu={false} />

                        {mostrarToast && (
                            <div className="toast-confirm">
                                {prod.nombre} añadido al carrito
                            </div>
                        )}

                        <div className="product-container">
                            <div id="photoProduct" className="photo-product-wrapper">
                                <div className="exit-btn-pos">
                                    <Exit navi={"/tabs/menu"} />
                                </div>
                                <img
                                    alt={prod.nombre}
                                    src={prod.imagen}
                                    className="product-img"
                                />
                            </div>

                            <h1 className="product-title">{prod.nombre}</h1>
                            <p className="product-cat-text">{prod.categoria}</p>

                            {prod.descripcion && (
                                <p className="product-desc">{prod.descripcion}</p>
                            )}

                            {nombresAlergenos.length > 0 && (
                                <div className="allergen-container">
                                    {nombresAlergenos.map((nombreAlergeno) => {
                                        const datosAlergeno = alergenosBase.find(
                                            a => a.nombre?.toLowerCase() === nombreAlergeno.toLowerCase()
                                        );
                                        return (
                                            <div key={nombreAlergeno} className="allergen-item">
                                                {datosAlergeno?.imagen ? (
                                                    <img
                                                        src={datosAlergeno.imagen}
                                                        alt={nombreAlergeno}
                                                        className="allergen-img"
                                                    />
                                                ) : (
                                                    <div className="allergen-fallback">!</div>
                                                )}
                                                <p className="allergen-name">{nombreAlergeno}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {esPorOpciones && (
                                <div className="section-card">
                                    <p className="section-title">Elige una opción:</p>
                                    <div className="options-list">
                                        {Object.keys(prod.ingredientes).map((opcion) => (
                                            <button
                                                key={opcion}
                                                onClick={() => setOpcionSeleccionada(opcion)}
                                                className={`btn-opcion ${opcionSeleccionada === opcion ? 'opcion-activa' : 'opcion-inactiva'}`}
                                            >
                                                {opcion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {((esPorOpciones && opcionSeleccionada) || (!esPorOpciones && listaIngredientes.length > 0)) && (
                                <div className="ingredients-section">
                                    <p className="section-title">Ingredientes:</p>
                                    <ul className="ingredients-list">
                                        {esPorOpciones && opcionSeleccionada
                                            ? prod.ingredientes[opcionSeleccionada].map((ing, i) => <li key={i}>{ing}</li>)
                                            : listaIngredientes.map((ing, i) => <li key={i}>{ing}</li>)
                                        }
                                    </ul>
                                </div>
                            )}

                            {extras.length > 0 && (
                                <div className="section-card extras-card">
                                    <h3 className="extras-title">Personaliza tu pedido:</h3>
                                    {extras.map((extra) => (
                                        <div key={extra.id} className="extra-item">
                                            <label className="extra-label">
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleExtraToggle(extra)}
                                                    className="extra-checkbox"
                                                />
                                                <span className="extra-name">
                                                    {extra.nombre_ex} <span className="extra-price">(+{extra.precio_ex}€)</span>
                                                </span>
                                            </label>
                                            {extra.descripcion_ex && (
                                                <p className="extra-desc">{extra.descripcion_ex}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </IonContent>

            {/* IONFOOTER: La forma oficial de fijar cosas abajo en Ionic */}
            <IonFooter style={{ borderTop: 'none', boxShadow: '0 -4px 15px rgba(0,0,0,0.1)' }}>
                <div style={{
                    height: '80px',
                    backgroundColor: '#efceb7',
                    padding: '0 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h3 style={{ margin: 0 }}>
                        <span className="price-text">{precioTotal} €</span>
                    </h3>

                    <button onClick={handleAddToCart} className="btn-add-cart">
                        Añadir al carrito
                    </button>
                </div>
            </IonFooter>
        </IonPage>
    );
}

export default Product;