/**
 * Cart.jsx
 * Página de carrito de pedidos para el cliente.
 * Muestra los productos añadidos al carrito, permite modificar cantidades, eliminar productos y ver el precio total.
 * El carrito se guarda en localStorage para persistencia entre sesiones.
 * El usuario puede proceder al pago o limpiar el carrito desde esta página. 
 * El diseño es sencillo y funcional, con controles claros para gestionar el carrito de forma intuitiva.
 * Se utiliza el contexto UserLogin para acceder al usuario y actualizar el precio total en el contexto.
 * Cada producto en el carrito muestra su nombre, opción (si tiene), cantidad y precio total de esa línea.
 * Si el carrito está vacío, se muestra un mensaje indicándolo.
 * El botón de pago se desactiva si el carrito está vacío para evitar errores.
 * Los estilos se aplican para mejorar la experiencia visual, con un diseño limpio y organizado.
 * Se utilizan iconos de Ionicons para los botones de aumentar, reducir y limpiar el carrito, aportando claridad visual a las acciones disponibles.
 * El código está estructurado de forma clara, con funciones separadas para cada acción (aumentar, reducir, limpiar) y un cálculo dinámico del precio total basado en el estado actual del carrito.
 */

import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";

import { cartOutline, closeOutline, addOutline, removeOutline } from 'ionicons/icons';

function Cart() {
    const nav = useHistory();
    const { user, setPriceUser, setBasket } = useContext(UserLogin);

    // Clave fija para el carrito — se limpia en logOut desde UserId.js
    const CLAVE_CARRITO = "carrito";

    // Productos del carrito leídos desde localStorage
    const [carrito, setCarrito] = useState([]);

    // Al montar el componente, cargamos el carrito desde localStorage
    useEffect(() => {
        const carritoGuardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
        setCarrito(carritoGuardado);
    }, []);

    // Cada vez que cambia el carrito, recalculamos el precio total en el contexto
    useEffect(() => {
        const total = carrito.reduce((sum, item) => {
            return sum + parseFloat(item.precio || 0) * (item.cantidad || 1);
        }, 0);
        setPriceUser(Number(total.toFixed(2)));
    }, [carrito]);

    // Aumenta la cantidad de un producto por su índice
    function aumentarCantidad(index) {
        const nuevoCarrito = [...carrito];
        nuevoCarrito[index].cantidad = (nuevoCarrito[index].cantidad || 1) + 1;
        setCarrito(nuevoCarrito);
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(nuevoCarrito));
    }

    // Reduce la cantidad — si llega a 0 elimina el producto del carrito
    function reducirCantidad(index) {
        const nuevoCarrito = [...carrito];
        const cantidadActual = nuevoCarrito[index].cantidad || 1;

        if (cantidadActual <= 1) {
            nuevoCarrito.splice(index, 1);
        } else {
            nuevoCarrito[index].cantidad = cantidadActual - 1;
        }

        setCarrito(nuevoCarrito);
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(nuevoCarrito));
    }

    // Limpia completamente el carrito en estado y en localStorage
    function limpiarCarrito() {
        setCarrito([]);
        localStorage.removeItem(CLAVE_CARRITO);
        setPriceUser(0);
        setBasket(0);
    }

    // Precio total calculado desde el estado del carrito
    const precioTotal = carrito.reduce((sum, item) => {
        return sum + parseFloat(item.precio || 0) * (item.cantidad || 1);
    }, 0).toFixed(2);

    return (
        <div className={'padre padreMovible'}>
            <Header user={user} menu={false} />
            <div className={"cuerpo cuerpoMovible"}>
                <div className={"cart"}>
                    <Exit navi={"/tabs/menu"} />
                    <h1>Pedidos</h1>

                    <div id="orders">
                        {carrito.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#8a9a9a', margin: '20px 0' }}>
                                El carrito está vacío
                            </p>
                        ) : (
                            <ul>
                                {carrito.map((item, index) => (
                                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>

                                        {/* NOMBRE Y OPCION DEL PRODUCTO */}
                                        <p style={{ flex: 1 }}>
                                            {item.nombre}
                                            {item.opcion && (
                                                <span style={{ fontSize: '0.85rem', color: '#8a9a9a' }}> ({item.opcion})</span>
                                            )}
                                        </p>

                                        {/* CONTROLES DE CANTIDAD */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 10px' }}>
                                            <button onClick={() => reducirCantidad(index)} style={estiloBotonCantidad}>
                                                <IonIcon icon={removeOutline} />
                                            </button>
                                            <span style={{ fontWeight: 'bold', color: '#5c4134', minWidth: '20px', textAlign: 'center' }}>
                                                {item.cantidad || 1}
                                            </span>
                                            <button onClick={() => aumentarCantidad(index)} style={estiloBotonCantidad}>
                                                <IonIcon icon={addOutline} />
                                            </button>
                                        </div>

                                        {/* PRECIO DE LA LINEA */}
                                        <p style={{ minWidth: '60px', textAlign: 'right' }}>
                                            <var>{(parseFloat(item.precio) * (item.cantidad || 1)).toFixed(2)}</var> €
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* EXTRAS DE CADA PRODUCTO */}
                    {carrito.some(item => item.extras && item.extras.length > 0) && (
                        <>
                            <h3>Extras:</h3>
                            <div id="extras">
                                <ul>
                                    {carrito.map((item, index) =>
                                        item.extras && item.extras.map((extra, i) => (
                                            <li key={`${index}-${i}`}>
                                                <p>{extra.nombre_ex}</p>
                                                <p><var>{extra.precio_ex}</var> €</p>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </>
                    )}

                    <h3>Total: <span id="price">{precioTotal} €</span></h3>

                    <div className={"buttonsPrice buttonsTogether"}>
                        <button
                            className={"aquaButton"}
                            onClick={() => nav.push("/payment")}
                            disabled={carrito.length === 0}
                            style={{ opacity: carrito.length === 0 ? 0.5 : 1 }}
                        >
                            <IonIcon icon={cartOutline} /> Pagar
                        </button>
                        <button className={"aquaButton"} onClick={limpiarCarrito}>
                            <IonIcon icon={closeOutline} /> Limpiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const estiloBotonCantidad = {
    backgroundColor: '#689d9d',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0
};

export default Cart;