import React, { useContext, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { useHistory } from "react-router-dom";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";
import CheckboxInput from "../components/input/Checkbox";
import RadioInput from "../components/input/Radio";

/* RESOURCES */
import plus from "../../resources/img/plus.webp";

function Add({ prod }) {
    const { user } = useContext(UserLogin);
    const nav = useHistory();
    const [picture, setPicture] = useState(plus);

    //------------------------FUNCTIONS---------------------------------//
    function pictureChange(img) {
        const file = img.target.files[0];
        if (!file) {
            console.log("ERROR");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPicture(reader.result);
        }
        reader.readAsDataURL(file);
    };

    function submitFinal(result) {
        result.preventDefault();

        const formData = new FormData(result.target);

        const productData = {
            nombre: formData.get("nameProduct"),
            categoria: formData.get("category"),
            "precio_€": parseFloat(formData.get("priceProduct")),
            alergenos: formData.getAll("allergensDiv"),
            ingredientes: formData.getAll("ingredientsDiv"),
            imagen: picture
        };

        console.log(productData);

        //¡¡INSERTAR BACKEND AQUI!!
        //////////////////////////
        //////////////////////////
        //////////////////////////
        //////////////////////////
    }

    return (
        <div className={'padre'}>
            <div className={"cuerpo"}>
                <Header user={user} />
                <form onSubmit={submitFinal}>
                    <div className={"product productAdd"}>
                        <div id="photoProduct">
                            <Exit navi={"/tabs/menu"} />
                            <img alt={"Inserte la imagen del producto que desee añadir"} src={picture} id="addProduct" className={picture === plus ? "smallImg" : "bigImg"} onClick={() => document.getElementById("fileInput").click()} />
                            <input type="file" accept="image/*" id="fileInput" style={{ display: "none" }} onChange={pictureChange} />
                        </div>
                        <div>
                            <button id="addIcon">+</button>
                            <input type="text" placeholder="Insertar nombre del producto" name="nameProduct" required></input>
                        </div>
                        <p>Alergias:</p>
                        <div className={"allergensList"}>
                            <ul>
                                <CheckboxInput txt="gluten" name="Gluten" group="allergensDiv" />
                                <CheckboxInput txt="huevos" name="Huevos" group="allergensDiv" />
                                <CheckboxInput txt="pescado" name="Pescado" group="allergensDiv" />
                                <CheckboxInput txt="soja" name="Soja" group="allergensDiv" />
                                <CheckboxInput txt="cacahuetes" name="Cacahuetes" group="allergensDiv" />
                                <CheckboxInput txt="lacteos" name="Lacteos" group="allergensDiv" />
                            </ul>
                        </div>
                        <p>Ingredientes:</p>
                        <div>
                            <ul>
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
                        <p>Categoría:</p>
                        <div>
                            <ul>
                                <RadioInput txt="bocadillo" name="category" />
                                <RadioInput txt="bebida caliente" name="category" />
                                <RadioInput txt="bebida fria" name="category" />
                                <RadioInput txt="golosina" name="category" />
                            </ul>
                        </div>
                        <p>Precio:</p>
                        <div>
                            <button id="addIcon">+</button>
                            <input type="number" placeholder="0,00" name="priceProduct" step="0.01" required></input>
                        </div>
                        <button className={"aquaButton"} type="submit">Guardar</button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Add;
