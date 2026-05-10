import { createContext, useState } from "react";

export const UserLogin = createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const [fontSize, setFontSize] = useState(1);
    const [color, setColor] = useState("#ead8ca");
    const [priceUser, setPriceUser] = useState(0);
    const [basket, setBasket] = useState(0);

    const login = (userData) => {
        setUser(userData);
        setFontSize(1);
        setColor("#ead8ca");
        setPriceUser(0);
        setBasket(0);
    };

    const logOut = () => {
        setUser(null);
        setFontSize(1);
        setColor("#ead8ca");
        setPriceUser(0);
        setBasket(0);
        // Limpia el carrito al cerrar sesión para que no quede el carrito de otro usuario
        localStorage.removeItem("carrito");
    };

    return (
        <UserLogin.Provider value={{ user, login, logOut, fontSize, setFontSize, color, setColor, priceUser, setPriceUser, basket, setBasket}}>
            {children}
        </UserLogin.Provider>
    )
}