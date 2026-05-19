/**
 * Payment.jsx
 * Pantalla de pago donde el usuario introduce los datos de su tarjeta.
 * Utiliza Stripe Elements para la validación de la tarjeta (sin cobro real).
 * Al confirmar el pago, se guarda el pedido en Supabase y se limpia el carrito.
 * Si el pago es exitoso, muestra una pantalla de confirmación y redirige a "Mis Pedidos".
 * El total se calcula directamente desde el carrito almacenado en localStorage, no desde el contexto.
 * Esto garantiza que el total refleje exactamente lo que el usuario va a pagar, sin depender de posibles desincronizaciones con el contexto.
 */

import React, { useContext, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { supabase } from "../../services/supabaseClient";
import { IonIcon } from "@ionic/react";
import { checkmarkOutline, logIn } from 'ionicons/icons';
import { imprimirAndroid } from "../../plugins/printer.ts";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";
import TextInput from "../components/input/Input";
import RadioInput from "../components/input/Radio";
import { Capacitor } from "@capacitor/core";

// Cargamos Stripe con la publishable key del .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

// Estilos para el componente CardElement de Stripe
const cardElementStyle = {
    style: {
        base: {
            fontSize: '16px',
            color: '#3d2318',
            fontFamily: 'sans-serif',
            '::placeholder': { color: '#8a9a9a' }
        },
        invalid: { color: '#c0392b' }
    }
};

// Llama al servidor de impresión local con los datos del pedido
async function imprimirTicket(order) {
    try {
        //window.electronAPI.printTicket(order); Electron
        if (Capacitor.getPlatform() === "android") {
            await imprimirAndroid(order);
            return;
        }
        await fetch("http://localhost:3001/printTicket", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });
    } catch (error) {
        // No bloqueamos el flujo si la impresora falla
        console.error("Error al imprimir ticket:", error);
    }
}

// Formulario de pago separado para poder usar los hooks de Stripe
function FormularioPago({ user, carrito, totalCalculado }) {
    const { setBasket } = useContext(UserLogin);
    const stripe = useStripe();
    const elements = useElements();
    const nav = useHistory();

    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);

    async function handlePago(e) {
        e.preventDefault();

        if (!stripe || !elements) return;
        if (carrito.length === 0) {
            setError("El carrito está vacío.");
            return;
        }

        setProcesando(true);
        setError("");

        const titularInput = document.getElementById("Titular")?.value || user.nombre;

        // Validamos la tarjeta con Stripe (no cobra, solo valida el formato)
        const cardElement = elements.getElement(CardElement);
        const { error: stripeError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: { name: titularInput }
        });

        if (stripeError) {
            setError(stripeError.message);
            setProcesando(false);
            return;
        }

        // Tarjeta válida → guardamos el pedido en Supabase
        try {
            const productos = carrito.map(item => ({
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad || 1,
                opcion: item.opcion || null
            }));

            const extras = carrito.flatMap(item =>
                (item.extras || []).map(e => ({
                    nombre_ex: e.nombre_ex,
                    precio_ex: e.precio_ex
                }))
            );

            const { data: pedidoInsertado, error: supabaseError } = await supabase
                .from('Pedido')
                .insert([{
                    usuario_id: String(user.id),
                    productos: productos,
                    extras: extras.length > 0 ? extras : [],
                    total: parseFloat(totalCalculado),
                    estado: 'Sin asignar'
                }])
                .select()  // para obtener el pedido con id y fecha generados por Supabase
                .single();

            if (supabaseError) throw supabaseError;

            // Imprimimos el ticket con los datos completos del pedido
            await imprimirTicket({
                id: pedidoInsertado.id,
                fecha: pedidoInsertado.fecha,
                usuario_id: pedidoInsertado.usuario_id,
                usuario_nombre: user.nombre,
                colegio: user.institucion || '—',
                alergico: user.alergico,
                alergias: user.alergias,
                productos: productos,
                extras: extras,
                total: parseFloat(totalCalculado)
            });

            // Limpiamos el carrito tras el pago exitoso
            localStorage.removeItem("carrito");

            setExito(true);

            // Redirigimos a la pantalla de pedidos tras 2 segundos
            setTimeout(() => nav.push("/tabs/orders"), 2000);

        } catch (err) {
            console.error("Error al guardar pedido:", err.message);
            setError("Error al procesar el pedido. Inténtalo de nuevo.");
            setProcesando(false);
        }
    }

    // Pantalla de éxito tras el pago
    if (exito) {
        setBasket(0);
        return (
            <div className="payment-success-container">
                <div className="payment-success-icon">✓</div>
                <h2 className="payment-success-title">Pago realizado</h2>
                <p className="payment-success-text">Tu pedido ha sido registrado correctamente.</p>
                <p className="payment-success-subtext">Redirigiendo a tus pedidos...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handlePago} id="formularioMoney">

            {/* RESUMEN DEL PEDIDO */}
            <div className="payment-summary-box">
                <p className="payment-summary-title">Resumen del pedido</p>

                {carrito.length === 0 ? (
                    <p className="payment-empty-cart">El carrito está vacío</p>
                ) : (
                    carrito.map((item, i) => (
                        <div key={i} className="payment-item-row">
                            <span>
                                {item.nombre}
                                {item.opcion ? ` (${item.opcion})` : ''}
                                {' '}x{item.cantidad || 1}
                            </span>
                            <span className="payment-item-price">
                                {(parseFloat(item.precio) * (item.cantidad || 1)).toFixed(2)} €
                            </span>
                        </div>
                    ))
                )}

                <div className="payment-divider" />
                <div className="payment-total-row">
                    <span>Total</span>
                    <span>{totalCalculado} €</span>
                </div>
            </div>

            {/* Input normal para el Titular */}
            <TextInput txt="Titular de la tarjeta" valor="text" id="Titular" />

            {/* DATOS DE LA TARJETA con Stripe Elements */}
            <div className="stripe-card-container">
                <p className="stripe-card-title">Datos de la tarjeta</p>
                <div className="stripe-card-wrapper">
                    <CardElement options={cardElementStyle} />
                </div>
                
                {/*Para probar, prueba con tarjeta: 4242 4242 4242 4242 — cualquier fecha futura — cualquier CVV*/}
            </div>

            {/* Emisor de la tarjeta */}
            <h3 className="payment-emisor-title">Emisor de la tarjeta:</h3>
            <div className="buttonsPrice">
                <RadioInput txt="Visa" name="emisor" />
                <RadioInput txt="MasterCard" name="emisor" />
            </div>

            {/* MENSAJE DE ERROR */}
            {error && (
                <p className="payment-error-msg">{error}</p>
            )}

            {/* BOTONES */}
            <div className="buttonsPrice buttonsTogether" style={{ marginTop: '1rem' }}>
                <button
                    type="submit"
                    className="aquaButton"
                    disabled={procesando || !stripe || carrito.length === 0}
                    style={{ opacity: (procesando || carrito.length === 0) ? 0.6 : 1 }}
                >
                    <IonIcon icon={checkmarkOutline} className="payment-btn-icon" />
                    <p>{procesando ? 'Procesando...' : `Pagar ${totalCalculado} €`}</p>
                </button>
                <button
                    type="button"
                    className="aquaButton"
                    onClick={() => nav.push("/cart")}
                    disabled={procesando}
                >
                    <IonIcon icon={logIn} className="payment-btn-icon" />
                    <p>Regresar</p>
                </button>
            </div>
        </form>
    );
}

function Payment() {
    const { user } = useContext(UserLogin);

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const totalCalculado = carrito.reduce((sum, item) => {
        return sum + parseFloat(item.precio || 0) * (item.cantidad || 1);
    }, 0).toFixed(2);

    return (
        <div className="padre padreMovible">
            <Header user={user} menu={false} />
            <div className="cuerpo cuerpoMovible">
                <div className="cart">
                    <Exit navi="/cart" />
                    <h1 className="payment-main-title">Pagar</h1>

                    <Elements stripe={stripePromise}>
                        <FormularioPago
                            user={user}
                            carrito={carrito}
                            totalCalculado={totalCalculado}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
}

export default Payment;