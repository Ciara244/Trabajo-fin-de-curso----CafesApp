/**
 * HomePage.jsx
 * Página de inicio de la aplicación.
 * Permite al usuario iniciar sesión o registrarse para acceder a las funcionalidades de la app.
 * El diseño es sencillo y atractivo, con un fondo relacionado con el café y un formulario de inicio de sesión claro y fácil de usar.
 * Se utiliza el contexto UserLogin para gestionar el estado del usuario en toda la aplicación.
 * Al iniciar sesión, se verifica la información del usuario en las tablas Usuario, Trabajador y Administrador de Supabase para determinar su rol y redirigirlo a la página correspondiente.
 * Si el inicio de sesión es incorrecto, se muestra un mensaje de error al usuario.
 * El código está estructurado de forma clara, con funciones separadas para manejar el inicio de sesión y la navegación entre páginas.
 * Se utiliza IonAlert para mostrar mensajes de error de forma visual y atractiva.
 * El botón de registro redirige a la página de registro para crear una nueva cuenta.
 * La página se conecta a Supabase para verificar las credenciales del usuario y gestionar el estado de inicio de sesión en el contexto.
 */

import React, { useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./style/import.css";
import TextInput from "./components/input/Input";
import { UserLogin } from "./js/UserId";
import { IonAlert } from '@ionic/react';
import img from "../resources/img/LogoCafe.webp";
import { supabase } from "../services/supabaseClient";

function HomePage() {
    const nav = useHistory();
    const { login } = useContext(UserLogin);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");

    async function loadLogin() {
        const id = document.getElementById("Id").value;
        const pass = document.getElementById("Password").value;

        if (!id || !pass) {
            setAlertMsg("Rellena todos los campos.");
            setShowAlert(true);
            return;
        }

        // 1. Busca en la tabla Usuario (columnas: nombre, pass)
        const { data: dataUsuario } = await supabase
            .from('Usuario')
            .select('*')
            .eq('nombre', id)
            .eq('pass', pass);

        if (dataUsuario && dataUsuario.length > 0) {
            // Guarda el usuario en contexto con su rol para controlar funcionalidades
            login({ ...dataUsuario[0], rol: 'usuario' });
            nav.push("/tabs/menu");
            return;
        }

        // 2. Busca en la tabla Trabajador (columnas: nombre_tr, pass_tr)
        const { data: dataTrabajador } = await supabase
            .from('Trabajador')
            .select('*')
            .eq('nombre_tr', id)
            .eq('pass_tr', pass);

        if (dataTrabajador && dataTrabajador.length > 0) {
            // Guarda el trabajador en contexto con su rol
            login({ ...dataTrabajador[0], rol: 'trabajador' });
            nav.push("/tabs/menu");
            return;
        }

        // 3. Busca en la tabla Administrador (columnas: nombre_ad, pass_ad)
        const { data: dataAdmin } = await supabase
            .from('Administrador')
            .select('*')
            .eq('nombre_ad', id)
            .eq('pass_ad', pass);

        if (dataAdmin && dataAdmin.length > 0) {
            // Guarda el admin en contexto con su rol
            login({ ...dataAdmin[0], rol: 'admin' });
            nav.push("/tabs/menu");
            return;
        }

        // 4. Si no coincide en ninguna tabla, muestra error
        setAlertMsg("Usuario o contraseña incorrectos.");
        setShowAlert(true);
    }

    return (
        <div className={'inicio'}>
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Error"
                message={alertMsg}
                buttons={['OK']}
            />
            <img src={img} alt="Café" id="cafeBackground"/>
            <TextInput txt="Id" valor="text" id="Id" />
            <TextInput txt="Contraseña" valor="password" id="Password" />
            <button onClick={loadLogin} className={"brownButton"}>INICIAR SESIÓN</button>
            <button onClick={() => nav.push("/register")} className={"brownButton"}>REGISTRARSE</button>
        </div>
    );
}

export default HomePage;