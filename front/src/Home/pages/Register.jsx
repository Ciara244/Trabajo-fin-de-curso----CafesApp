/**
 * Register.jsx
 * Página de registro para nuevos usuarios (alumnos o profesores).
 * Permite a los usuarios crear una cuenta proporcionando su nombre, contraseña, rol (alumno o profesor), colegio, horario y si son alérgicos a algún alimento.
 * El formulario incluye validación para asegurar que se completen todos los campos necesarios antes de permitir el registro.
 * Al registrarse, la información se guarda en la tabla Usuario de Supabase, y el usuario es redirigido a la página de inicio de sesión.
 * Se muestra un mensaje de alerta en caso de errores (como nombre de usuario ya registrado o problemas de conexión) o al completar el registro exitosamente.
 * El diseño es sencillo y claro, con controles intuitivos para seleccionar el rol, colegio, horario y alergias, así como un acuerdo de términos que el usuario debe aceptar antes de registrarse.
 * El código está estructurado de forma clara, con funciones separadas para manejar cada acción (mostrar términos, habilitar el botón de registro, procesar el registro)
 *  y un sistema de alertas para dar feedback al usuario en cada paso del proceso.
 * Se utiliza el contexto UserLogin para gestionar el estado del usuario en la aplicación, aunque en esta página específica el enfoque principal es la creación de la cuenta y 
 * la interacción con Supabase para guardar los datos del nuevo usuario.
 * Se ha implementado bcrypt para hashear las contraseñas en el frontend antes de enviarlas a Supabase, asegurando que las contraseñas se almacenen de forma segura 
 * en la base de datos.
 */



import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import "../style/import.css";

/* COMPONENTS */
import TextInput from "../components/input/Input";
import Selector from "../ionic/Selector";
import Schedule from "../ionic/Schedule";
import Allergies from "../ionic/Allergies";
import { IonAlert } from '@ionic/react';

/* RESOURCES */
import tick from "../../resources/img/tick.webp";

/* IMPORTAMOS SUPABASE */
import { supabase } from "../../services/supabaseClient";

/* BCRYPT para hashear contraseñas en el frontend */
import bcrypt from 'bcryptjs';

function Register() {
    const nav = useHistory();
    
    const [leer, setLeer] = useState(false); 
    const [enable, setEnable] = useState(true); 
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertHeader, setAlertHeader] = useState("Atención");

    const [rol, setRol] = useState("alumno"); 
    const [colegio, setColegio] = useState("IES José Zerpa"); 
    const [horario, setHorario] = useState("Mañana");
    const [alergias, setAlergias] = useState([]);

    //-----------------------FUNCTIONS---------------------------//
    function terms() { setLeer(true); }

    function ok() {
        setLeer(false);
        const checkIn = document.getElementById("agree");
        checkIn.disabled = false;
        checkIn.classList.remove("disabled");
    }

    function buttonRegister() {
        const checkIn = document.getElementById("agree");
        const buttonIn = document.getElementById("allow");
        if (checkIn.checked) {
            setEnable(false);
            buttonIn.classList.remove("disabled");
        } else {
            setEnable(true);
            buttonIn.classList.add("disabled");
        }
    }

    async function loadRegister() {
        const id = document.getElementById("Name")?.value;
        const pass = document.getElementById("Password")?.value;
        
        if (!id || !pass || !colegio || !horario) {
            setAlertHeader("Faltan datos");
            setAlertMessage("Por favor, completa todos los campos (nombre, contraseña, colegio y horario).");
            setShowAlert(true);
            return;
        }

        try {
            // HASHEAMOS la contraseña antes de guardarla
            // 10 rounds es suficiente para frontend (12 puede ser lento en móviles)
            const passHash = await bcrypt.hash(pass, 10);

            const alergico = alergias.length >=1 ? true : false;

            const { error } = await supabase
                .from('Usuario')
                .insert([
                    { 
                        nombre: id,          
                        pass: passHash,      // guardamos el hash, nunca el texto plano
                        rango: rol,          
                        institucion: colegio,
                        turno: horario,
                        alergico: alergico,
                        alergias: alergias
                    }
                ]);

            if (error) {
                console.error("Error de inserción:", error);
                
                if (error.code === '23505' || error.message.includes('duplicate')) {
                    setAlertHeader("Nombre no disponible");
                    setAlertMessage("Ese nombre de usuario ya está registrado. Por favor, elige otro diferente.");
                } else {
                    setAlertHeader("Error al registrar");
                    setAlertMessage("No se pudo completar el registro. Inténtalo de nuevo más tarde.");
                }
                
                setShowAlert(true);
            } else {
                setAlertHeader("¡Registro Exitoso!");
                setAlertMessage("Tu cuenta ha sido creada. Ahora puedes iniciar sesión.");
                setShowAlert(true);
                setTimeout(() => nav.push("/"), 2000); 
            }

        } catch (error) {
            setAlertHeader("Error General");
            setAlertMessage("Hubo un problema de conexión.");
            setShowAlert(true);
        }
    }
    //------------------------------------------------------------------//
    
    return (
        <div className={'inicio'}>
            
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={alertHeader}
                message={alertMessage}
                buttons={['OK']}
                cssClass="alertStyle"
            />

            <h1>REGISTRO</h1>
            <TextInput txt="Nombre" valor="text" id="Name" />
            <TextInput txt="Contraseña" valor="password" id="Password" />
            
            <div className={'line'} id="rolSelectorRadio">
                <h5>Rol:</h5>
                <div>
                    <label>
                        <input type="radio" name="rol" value="alumno" defaultChecked onChange={(e) => setRol(e.target.value)} /> Alumno
                    </label>
                    <label>
                        <input type="radio" name="rol" value="profesor" onChange={(e) => setRol(e.target.value)} /> Profesor
                    </label>
                </div>
            </div>
            
            <div className={'line'}>
                <h5>Colegio:</h5>
                <Selector onSeleccion={setColegio} />
            </div>
            
            <div className={'line'}>
                <h5>Horario:</h5>
                <Schedule onSeleccion={setHorario} />
            </div>

            <div className={'line'}>
                <h5>Alergias:</h5>
                <Allergies onChange={setAlergias}/>
            </div>
            
            <div className={"checkStyle"}>
                <input type="checkbox" id="agree" className="disabled" onChange={() => buttonRegister()} disabled/>
                <div className={"checkmark"} />
                <p>Estoy de acuerdo con los <b onClick={() => terms()}>términos.</b></p>
            </div>

            <button onClick={() => loadRegister()} className={"brownButton disabled"} id={"allow"} disabled={enable}>REGISTRARSE</button>
            <button onClick={() => {nav.push("/")}} className={"brownButton"}>VOLVER</button>

            {leer && <div className={"absolute"}>
                <h1>¡ATENCIÓN!</h1>
                <p>Al registrarse aseguras lo siguiente:</p>
                <ul>
                    <li>Eres un estudiante o profesorado activo del centro. Por lo tanto, si haces un pago en el colegio el centro educativo no se hará responsable de la perdida monetaria en caso de no estar matrículado.</li>
                    <li>La institución no se hará responsable por pedidos falsos, una vez que pages no se devolverá el dinero.</li>
                    <li>Cuando realices un pedido y hayas pagado, independientemente de que recogas el pedido o no, el pago se dará por efectuado. No se admiten devoluciones una vez que el pedido haya sido solicitado y pagado.</li>
                    <li>Si la persona que recoga el pedido no coincide con la identidad proporcionada a la hora de registro, se penalizará con una sanción y su cuenta será eliminada.</li>
                </ul>
                <p>Si estás de acuerdo con estos términos puede continuar:</p>
                <button onClick={() => ok()} className={"brownButton"}><img src={tick} alt="tick"/> ACEPTAR</button>
            </div> }

        </div>
    )
}

export default Register;