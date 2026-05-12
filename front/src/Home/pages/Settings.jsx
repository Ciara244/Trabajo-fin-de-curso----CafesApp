/**
 * Settings.jsx
 * Página de ajustes para el usuario.
 * Permite al usuario ver su información personal (ID, nombre, rol, institución y alergias) de forma ordenada y clara.
 * Si el usuario es un administrador, también muestra una sección para modificar los trabajadores registrados en la aplicación.
 * El usuario puede cambiar el tamaño de las letras y el fondo de la aplicación desde esta página, con botones claros para cada opción.
 * Incluye una sección de seguridad donde el usuario puede cambiar su contraseña, con una alerta que solicita la nueva contraseña y otra alerta que confirma el cambio o muestra errores.
 * El diseño es sencillo y funcional, con secciones claramente diferenciadas para cada tipo de ajuste y un sistema de alertas para dar feedback al usuario en cada acción realizada.
 * Se utiliza el contexto UserLogin para acceder a la información del usuario y gestionar los cambios en la aplicación (como el tamaño de las letras y el fondo).
 * La función de cierre de sesión también está disponible en esta página, permitiendo al usuario salir de su cuenta de forma segura y redirigiéndolo a la página de inicio de sesión.
 * El código está estructurado de forma clara, con funciones separadas para cada acción (cambiar contraseña, modificar trabajadores, ajustar apariencia) y 
 * un sistema de alertas para dar feedback al usuario en cada paso del proceso.
 */


import React, { useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonContent, IonPage, IonAlert } from "@ionic/react";
import { supabase } from "../../services/supabaseClient";

/* BCRYPT para hashear la nueva contraseña */
import bcrypt from 'bcryptjs';

function Settings() {
    const nav = useHistory();
    const { user, logOut, setFontSize, setColor } = useContext(UserLogin);

    // Estados para las alertas de cambio de contraseña
    const [showChangePass, setShowChangePass] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    //------------------------------------------------------//
    // Functions to modify the fontSize of the App.
    const x1 = () => {
        setFontSize(1);
    };
    const x2 = () => {
        setFontSize(1.1);
    };
    const x3 = () => {
        setFontSize(1.2);
    };

    // Functions to modify the background color of the App.
    const light = () => {
        setColor("#ead8ca");
    };
    const dark = () => {
        setColor("#b88f74");
    };
    //------------------------------------------------------//

    async function actualizarPassword(nuevaPass) {
        if (!nuevaPass || nuevaPass.trim() === "") {
            setAlertMessage("La contraseña no puede estar vacía.");
            setShowAlert(true);
            return;
        }

        try {
            // Hasheamos la nueva contraseña antes de guardarla
            const passHash = await bcrypt.hash(nuevaPass, 10);

            const { error } = await supabase
                .from('Usuario')
                .update({ pass: passHash })  // guardamos el hash
                .eq('id', user.id);

            if (error) throw error;
            
            setAlertMessage("Tu contraseña ha sido actualizada correctamente.");
            setShowAlert(true);
        } catch (error) {
            console.error("Error al actualizar:", error.message);
            setAlertMessage("Hubo un error al cambiar la contraseña. Inténtalo de nuevo.");
            setShowAlert(true);
        }
    }

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                
                {/* ALERTA PARA ESCRIBIR LA NUEVA CONTRASEÑA */}
                <IonAlert
                    isOpen={showChangePass}
                    onDidDismiss={() => setShowChangePass(false)}
                    header="Cambiar contraseña"
                    message="Escribe tu nueva contraseña abajo:"
                    inputs={[
                        {
                            name: 'newPassword',
                            type: 'password',
                            placeholder: 'Nueva contraseña'
                        }
                    ]}
                    buttons={[
                        { 
                            text: 'Cancelar', 
                            role: 'cancel' 
                        },
                        { 
                            text: 'Guardar', 
                            handler: (data) => actualizarPassword(data.newPassword) 
                        }
                    ]}
                />

                {/* ALERTA DE ÉXITO O ERROR */}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Información"
                    message={alertMessage}
                    buttons={['OK']}
                    cssClass="alertStyle"
                />

                <div className={'padre'}>
                    <div className={"cuerpo"}>
                        <div className={"box"} >
                            
                            {/* --- INFORMACIÓN DEL USUARIO ORDENADA --- */}
                            <div>
                                <div>
                                    <b>ID:</b> 
                                    <p>{user?.id ?? "N/A"}</p>
                                </div>
                                <div>
                                    <b>Nombre:</b> 
                                    <p>{user?.nombre ?? "N/A"}</p>
                                </div>
                                <div>
                                    <b>Rol:</b> 
                                    <p style={{ textTransform: 'capitalize' }}>{user?.rango ?? "N/A"}</p>
                                </div>
                                <div>
                                    <b>Institución:</b> 
                                    <p style={{ textAlign: 'right' }}>{user?.institucion ?? "N/A"}</p>
                                </div>
                                <div>
                                    <b>Alergias:</b> 
                                    <p>{user?.alergias ? "Sí" : "No"}</p>
                                </div>
                            </div>
                            <div className={"line2"}/>

                            {/* ------------------------------- */}

                            {user?.id === "Admin00" &&
                                <>
                                    <div>
                                        <p>Modificar trabajadores:</p>
                                        <div className={"buttons"}>
                                            <button className={"blueButton"} onClick={() => nav.push("/workers")}>Editar</button>
                                        </div>
                                    </div>
                                    <div className={"line2"}/>

                                </>
                            }
                            
                            <div>
                                <p>Tamaño de las letras:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={x1}>x1</button>
                                    <button className={"blueButton"} onClick={x2}>x2</button>
                                    <button className={"blueButton"} onClick={x3}>x3</button>
                                </div>
                            </div>
                            
                            <div className={"line2"}/>
                            
                            <div>
                                <p>Fondo:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={light}>Claro</button>
                                    <button className={"blueButton"} onClick={dark}>Oscuro</button>
                                </div>
                            </div>
                            
                            <div className={"line2"}/>

                            {/* --- SECCIÓN DE SEGURIDAD --- */}
                            <div>
                                <p>Seguridad:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={() => setShowChangePass(true)}>
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                            
                            <div className={"line2"}/>
                            
                            <div>
                                <button onClick={() => { logOut(); nav.push("/"); }} className={"brownButton"}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Settings;