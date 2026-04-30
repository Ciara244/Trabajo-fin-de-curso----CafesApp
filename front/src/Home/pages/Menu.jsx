import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";

import { IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

import { supabase } from "../../services/supabaseClient";

/* COMPONENTS */
import Loading from "../components/Loading";
import Header from "../components/Header";
import Item from "../ionic/Item";

//Category of the products
const category = [
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

    const [activeCategory, setActiveCategory] = useState("Todos");

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
                        <div className={"categoryList"}>
                            {category.map((cat) => (
                                <div key={cat} onClick={() => setActiveCategory(cat)} className={"categorySelect"}
                                    style={{
                                        backgroundColor: activeCategory === cat ? "#6b9696" : "#6b96969e",
                                        color: activeCategory === cat ? "white" : "#373758ad",
                                        boxShadow: activeCategory === cat ? "0 0.25rem 0.375rem rgba(0,0,0,0.1)" : "none",
                                    }}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>

                        {productosFiltrados.map((product) => (
                            <Item key={product.id} data={product} />
                        ))}

                        {productosFiltrados.length === 0 && !loader && (<p>Aún no hay productos en esta categoría.</p>)}

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Menu;