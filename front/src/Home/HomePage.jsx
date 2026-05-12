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
 * Se ha implementado bcrypt para hashear las contraseñas en el frontend antes de enviarlas a Supabase, asegurando que las contraseñas se almacenen de forma segura 
 * en la base de datos.
 */

import React, { useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./style/import.css";
import TextInput from "./components/input/Input";
import { UserLogin } from "./js/UserId";
import { IonAlert } from '@ionic/react';
import img from "../resources/img/LogoCafe.webp";
import { supabase } from "../services/supabaseClient";
import bcrypt from 'bcryptjs';

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

        // 1. Busca en tabla Usuario solo por nombre
        const { data: dataUsuario } = await supabase
            .from('Usuario')
            .select('*')
            .eq('nombre', id)
            .single();

        if (dataUsuario) {
            const ok = await bcrypt.compare(pass, dataUsuario.pass);
            if (ok) {
                login({ ...dataUsuario, rol: 'usuario' });
                nav.push("/tabs/menu");
                return;
            }
        }

        // 2. Busca en tabla Trabajador
        const { data: dataTrabajador } = await supabase
            .from('Trabajador')
            .select('*')
            .eq('nombre_tr', id)
            .single();

        if (dataTrabajador) {
            const ok = await bcrypt.compare(pass, dataTrabajador.pass_tr);
            if (ok) {
                login({ ...dataTrabajador, rol: 'trabajador' });
                nav.push("/tabs/menu");
                return;
            }
        }

        // 3. Busca en tabla Administrador
        const { data: dataAdmin } = await supabase
            .from('Administrador')
            .select('*')
            .eq('nombre_ad', id)
            .single();

        if (dataAdmin) {
            const ok = await bcrypt.compare(pass, dataAdmin.pass_ad);
            if (ok) {
                login({ ...dataAdmin, rol: 'admin' });
                nav.push("/tabs/menu");
                return;
            }
        }

        // 4. Ninguno coincide
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
            <div id="creadoras">
                <p>Evelyn - evelynsan1805@gmail.com</p>
                <p>Ciara - martinsanchezciara244@gmail.com</p>
            </div>
        </div>
    );
}

export default HomePage;