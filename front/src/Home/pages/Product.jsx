import React, { useContext } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { useHistory, useLocation } from "react-router-dom";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";

function Product() {
    const { user } = useContext(UserLogin);
    const nav = useHistory();

    const location = useLocation();
    const prod = location.state?.product;
    //------------------------FUNCTIONS---------------------------------//

    console.log("STATE:", location.state);

    return (
        <div className={'padre'}>
            <div className={"cuerpo"}>
                <Header user={user} />
                <div className={"product"}>
                    <div id="photoProduct">
                        <Exit navi={"/tabs/menu"} />
                        <img alt={"Producto "+(prod.nombre??"name")} src={prod.imagen} />
                    </div>
                    <h1>{prod.nombre??"Nombre producto"}</h1>
                    <div className={"allergensList"}>
                        <ul>
                            <li>miau?</li>
                            <li>miau?</li>
                        </ul>
                    </div>
                    <p>Ingredientes:</p>
                    <ul>
                        <li>Ingrediente 1</li>
                        <li>Ingrediente 2</li>
                        <li>Ingrediente 3</li>
                    </ul>
                    <p>Categoría: {prod.categoria??"Item"}</p>
                </div>
                <div className={"purchase"}>
                    <h3><span id="price">{prod["precio_€"]??"0"} €</span></h3>
                    <button className={"aquaButton"} onClick={() => nav.push("/tabs/menu")}>Añadir al carrito</button>
                </div>
            </div>
        </div>
    )
}

export default Product;

//https://urianviera.com/reactjs/domina-el-hook-uselocation