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

/* COMPONENTS */

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

    // Función para actualizar la contraseña en Supabase
    async function actualizarPassword(nuevaPass) {
        if (!nuevaPass || nuevaPass.trim() === "") {
            setAlertMessage("La contraseña no puede estar vacía.");
            setShowAlert(true);
            return;
        }
        
        try {
            // Actualizamos la columna 'pass' en la tabla 'Usuario'
            const { error } = await supabase
                .from('Usuario')
                .update({ pass: nuevaPass })
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
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '12px', 
                                textAlign: 'left', 
                                marginBottom: '20px', 
                                color: '#3d2318',
                                padding: '15px',
                                borderRadius: '10px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(104, 157, 157, 0.3)', paddingBottom: '8px' }}>
                                    <b style={{ color: '#3d2318', textDecoration: 'none' }}>ID:</b> 
                                    <span>{user?.id ?? "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(104, 157, 157, 0.3)', paddingBottom: '8px' }}>
                                    <b style={{ color: '#3d2318', textDecoration: 'none' }}>Nombre:</b> 
                                    <span>{user?.nombre ?? "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(104, 157, 157, 0.3)', paddingBottom: '8px' }}>
                                    <b style={{ color: '#3d2318', textDecoration: 'none' }}>Rol:</b> 
                                    <span style={{ textTransform: 'capitalize' }}>{user?.rango ?? "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(104, 157, 157, 0.3)', paddingBottom: '8px' }}>
                                    <b style={{ color: '#3d2318', textDecoration: 'none' }}>Institución:</b> 
                                    <span style={{ textAlign: 'right' }}>{user?.institucion ?? "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <b style={{ color: '#3d2318', textDecoration: 'none' }}>Alergias:</b> 
                                    <span>{user?.alergias ? "Sí" : "No"}</span>
                                </div>
                            </div>
                            {/* ------------------------------- */}

                            {user?.id === "Admin00" &&
                                <>
                                    <div>
                                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#3d2318' }}>Modificar trabajadores:</p>
                                        <div className={"buttons"}>
                                            <button className={"blueButton"} onClick={() => nav.push("/workers")}>Editar</button>
                                        </div>
                                    </div>
                                    <div className={"line2"} style={{ margin: '20px 0' }} />
                                </>
                            }
                            
                            <div>
                                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#3d2318' }}>Tamaño de las letras:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={x1}>x1</button>
                                    <button className={"blueButton"} onClick={x2}>x2</button>
                                    <button className={"blueButton"} onClick={x3}>x3</button>
                                </div>
                            </div>
                            
                            <div className={"line2"} style={{ margin: '20px 0' }} />
                            
                            <div>
                                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#3d2318' }}>Fondo:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={light}>Claro</button>
                                    <button className={"blueButton"} onClick={dark}>Oscuro</button>
                                </div>
                            </div>
                            
                            <div className={"line2"} style={{ margin: '20px 0' }} />

                            {/* --- SECCIÓN DE SEGURIDAD --- */}
                            <div>
                                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#3d2318' }}>Seguridad:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={() => setShowChangePass(true)}>
                                        Cambiar contraseña
                                    </button>
                                </div>
                            </div>
                            
                            <div className={"line2"} style={{ margin: '20px 0' }} />
                            
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