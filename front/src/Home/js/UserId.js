import { createContext, useState } from "react";

export const UserLogin = createContext(); //The id of the user will be saved in this variable.

export function UserProvider({children}) {
    const [user, setUser] = useState(null); //User info
    const [fontSize, setFontSize] = useState(1); //FontSize that the user had selected.
    const [color, setColor] = useState("#ead8ca"); //Color of the background of the app that the user had selected.
    const [priceUser, setPriceUser] = useState(0); //Total price of all the products
    const [basket, setBasket] = useState(0); //All the products selected

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
    };

    return (
        <UserLogin.Provider value={{ user, login, logOut, fontSize, setFontSize, color, setColor, priceUser, setPriceUser, basket, setBasket}}>
            {children}
        </UserLogin.Provider>
    )
}

/*
useContext:
https://elblogdelprogramador.com/posts/introduccion-al-contexto-de-react-guia-completa-actualizada/#gsc.tab=0
https://es.react.dev/reference/react/createContext
https://keepcoding.io/blog/context-para-autenticacion-en-aplicacion-react/
*/