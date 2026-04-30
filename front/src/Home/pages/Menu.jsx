import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";

// Añadimos IonSegment, IonSegmentButton y IonLabel a los imports de Ionic
import { IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react"; 

import { supabase } from "../../services/supabaseClient"; 

import Loading from "../components/Loading";
import Header from "../components/Header";
import Item from "../ionic/Item";

// Definimos las categorías exactas de la base de datos
const CATEGORIAS = [
    "Todos",
    "Bebida caliente",
    "Bebida fría",
    "Bocadillo",
    "Golosina",
    "Combo excursión"
];

function Menu() {

    const [loader, setLoader] = useState(true);
    const [productos, setProductos] = useState([]);
    
    // 👇 Nuevo estado para saber qué categoría estamos viendo
    const [categoriaActiva, setCategoriaActiva] = useState("Todos"); 

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

    // 👇 LA MAGIA DEL FILTRO: Comprueba la categoría seleccionada
    const productosFiltrados = categoriaActiva === "Todos" 
        ? productos 
        : productos.filter(producto => producto.categoria === categoriaActiva);

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                <div className={'padre'}>
                    {loader ? <Loading /> : null}

                    <Header user={user} />
                    
                   {/* 🔘 BARRA DE CATEGORÍAS PERSONALIZADA (A prueba de CSS) 🔘 */}
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center",
                        overflowX: "auto", 
                        overflowY: "hidden", 
                        padding: "15px 10px", 
                        gap: "10px",
                        width: "100%", /* Obliga a que ocupe todo el ancho */
                        boxSizing: "border-box",
                        backgroundColor: "#f5f5dc", 
                        WebkitOverflowScrolling: "touch" 
                    }}>
                        {CATEGORIAS.map((cat) => (
                            // 🚀 CAMBIO CLAVE: Usamos un <div> en lugar de un <button>
                            <div 
                                key={cat} 
                                onClick={() => setCategoriaActiva(cat)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px 18px",
                                    borderRadius: "25px",
                                    backgroundColor: categoriaActiva === cat ? "#8D6E63" : "#e0e0e0",
                                    color: categoriaActiva === cat ? "white" : "#333",
                                    fontWeight: "bold",
                                    fontSize: "14px", /* ¡Ahora sí nos hará caso! */
                                    fontFamily: "Txt, sans-serif",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    boxShadow: categoriaActiva === cat ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>

                    <div className={"cuerpo"} style={{ paddingBottom: "20px", marginTop: "15px" }}>
                        
                        {/* Iteramos sobre los productos FILTRADOS, no sobre todos */}
                        {productosFiltrados.map((product) => (
                            <Item key={product.id} data={product} />
                        ))}

                        {/* Mensaje amigable si la categoría no tiene productos aún */}
                        {productosFiltrados.length === 0 && !loader && (
                            <p style={{ textAlign: "center", color: "#666", marginTop: "30px" }}>
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