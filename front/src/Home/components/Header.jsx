/**
 * Header.jsx
 * Componente de cabecera para la aplicación.
 * Muestra un icono de filtro (solo en menú), el nombre del usuario y un icono de carrito (solo para usuarios).
 * Si el usuario es admin, muestra un icono de menú hamburguesa que abre un panel lateral con opciones de administración.
 * El diseño es sencillo y funcional, con controles claros para acceder al carrito o al panel de administración según el rol del usuario.
 * Se utiliza el contexto UserLogin para acceder a la información del usuario y el número de productos en el carrito.
 * El código está estructurado de forma clara, con condicionales para mostrar u ocultar elementos según el rol del usuario y el estado del menú.
 */

import React, { useContext, useState } from "react";
import { IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { UserLogin } from "../js/UserId";
import { funnelOutline, bagHandle, menuOutline, closeOutline } from 'ionicons/icons';

export default function Header({ user, menu }) {
    const nav = useHistory();
    const { basket } = useContext(UserLogin);
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <>
            <div className="cabecera">
                {menu ? <IonIcon icon={funnelOutline} /> : <div id="divSpace"></div>}

                {user?.rol === 'usuario' && (
                    <div className="basket" onClick={() => nav.push("/cart")}>
                        <p>{basket}</p>
                        <IonIcon icon={bagHandle} />
                    </div>
                )}

                {/* HAMBURGUESA ADMIN - Estilos forzados para que NO desaparezca */}
                {user?.rol === 'admin' && (
                    <div
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        style={{ cursor: 'pointer', fontSize: '32px', display: 'flex', alignItems: 'center', color: '#5c4134' }}
                    >
                        <IonIcon icon={menuAbierto ? closeOutline : menuOutline} />
                    </div>
                )}
            </div>

            {menuAbierto && user?.rol === 'admin' && (
                <>
                    <div onClick={() => setMenuAbierto(false)} className="admin-menu-overlay" />
                    <div className="admin-side-panel">
                        <div className="admin-panel-header">
                            <p className="admin-panel-title">Panel admin</p>
                            <IonIcon icon={closeOutline} onClick={() => setMenuAbierto(false)} className="admin-panel-close" />
                        </div>
                        <p className="admin-panel-section-title">Gestión</p>
                        <button onClick={() => { nav.push("/admin/menu"); setMenuAbierto(false); }} className="admin-panel-option">
                            Editar menú
                        </button>
                        <button onClick={() => { nav.push("/admin/workers"); setMenuAbierto(false); }} className="admin-panel-option">
                            Gestionar trabajadores
                        </button>
                         <button onClick={() => { nav.push("/admin/users"); setMenuAbierto(false); }} className="admin-panel-option">
                            Gestionar usuarios
                        </button>
                        <div className="admin-panel-divider" />
                    </div>
                </>
            )}
        </>
    );
}