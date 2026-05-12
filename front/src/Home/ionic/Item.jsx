/**
 * Item.jsx
 * Componente de tarjeta para mostrar un producto en el menú.
 * Recibe un objeto "data" con la información del producto (nombre, imagen, categoría, precio).
 * Al hacer clic en la tarjeta, navega a la página de detalles del producto pasando la información por estado.
 * El diseño incluye una imagen a la izquierda y el contenido (nombre, categoría, precio) a la derecha, con algunos elementos decorativos.
 */

import React from 'react';
import { IonCard } from '@ionic/react';
import { useHistory } from 'react-router-dom';

export default function Card({ data }) {
    const nav = useHistory();
    
    if (!data) return null;

    return (
        <IonCard 
            className="item-card cardProduct" 
            onClick={() => nav.push("/product", { product: data })} 
        >
            {/* 1. SECCIÓN DE LA IMAGEN */}
            <div className="item-img-wrapper">
                <img 
                    alt={data.nombre} 
                    src={data.imagen} 
                    className="item-img"
                />
            </div>

            {/* 2. SECCIÓN DEL CONTENIDO */}
            <div className="item-content">
                
                <h2 className="item-title">
                    {data.nombre}
                </h2>

                <div className="item-dots-wrapper">
                    <div className="item-dot-orange"></div>
                    <div className="item-dot-brown"></div>
                </div>

                <p className="item-category">
                    {data.categoria}
                </p>

                <div className="item-price-wrapper">
                    <span className="item-price">
                        {data["precio_€"]} €
                    </span>
                </div>

            </div>
        </IonCard>
    );
}