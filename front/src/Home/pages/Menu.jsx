import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
import { UserLogin } from "../js/UserId";
import { IonContent, IonPage } from "@ionic/react";

/* COMPONENTS */
import Loading from "../components/Loading";
import Header from "../components/Header";
import Item from "../ionic/Item";

function Menu() {

    //Loader for the final user
    const [loader, setLoader] = useState(true);

    //State products
    const [productos, setProductos] = useState([]); //Aquí se insertan los datos para los productos.

    const { user } = useContext(UserLogin);

    //------------------------FUNCTIONS---------------------------------//
    useEffect(() => {
        fetchDataProduct(true);
    }, []);

    //Collect data from the database
    async function fetchDataProduct(firstTime = false) {
        try {
            const result = await fetch("backend");
            const data = await result.json();
            setProductos(data);
        } catch (error) {
            console.error("Error");
        } finally {
            if (firstTime) {
                //Loading effect
                setTimeout(() => {
                    setLoader(false);
                }, 1000);
            }
        }
    }
    //--------------------------------------------------------------------//

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                <div className={'padre'}>
                    {loader ? <Loading /> : null}

                    <Header user={user} />
                    <div className={"cuerpo"}>
                        {productos.map((product) => (
                            <Item key={product.id} data={product} />
                        ))}
                        {/*<Item product={1}/> <- Si quieres ver las Items sin nada lo pones así */}
                        <Item product={1} />
                        <Item product={1} />
                        <Item product={1} />
                        <Item product={1} />
                        <Item product={1} />
                        <Item product={1} />
                        <Item product={1} />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )


}

export default Menu;