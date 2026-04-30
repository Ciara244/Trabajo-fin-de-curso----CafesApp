import { TriggerAlert } from "../ionic/Alert";

/////////////////////////////////REGISTRAR  LOGIN   PAYMENT///////////////////////////////////////

//When "Registrarse" is pressed, this function would Register the user in the database.
//Parameters: String | Route for the nav -> example: "/"
//Return: String | Navigation - Bol | Correct or incorrect result
export function Adding(direction) {
    if (Check()) {
        // Aqui se tiene que llamar lo que sea para registrar al usuario.
        TriggerAlert("Se ha creado el usuario con éxito.");
        return {bol:true, navi: direction};
    }
    TriggerAlert("Rellene todas las casillas.");
    return {bol: false};
};

//When "Iniciar sesión" is pressed, this function would Check if the user is in the database.
//Parameters: String | Route for the nav - String | Id from the login camp, to verify if the user exists or not.
//Return: String | Navigation - Bol | Correct or incorrect result - user | Data from the database
export function Login(direction, ID) {
    if (Check()) {
        //Aqui se tiene que llamar lo que sea para buscar si el usuario existe. Si no existe se llama al alert y se hace return Null.
        return { bol: true, user: { id: ID }, navi: direction }; //Lo de ID se va a quitar para cuando se integre lo de recoger los datos del usuario.
    }
    TriggerAlert("Rellene todas las casillas.");
    return { bol: false};
}

//When the user accepts the payment this function would process it.
//Parameters: String | Route for the nav
//Return: String | Navigation
export function PaymentProcess(direction) {
    if (Check()) {
        //Aqui se tiene que hacer el proceso del pago. Lo que sea que haga lo de la impresora y tal cuando se haya confirmado el pago.
        return {bol:true, navi: direction};
    }
    TriggerAlert("Rellene todas las casillas.");
    return { bol: false};
}


//---------------------------AUXILIAR FUNCTIONS-------------------------------------//
//This is an auxiliar function. This function would be called to check if all the inputs are marked or not to proceed.
//Return: boolean
export function Check() {
    const inputs = document.getElementsByTagName('input');
    let radios = {};

    for (let input of inputs) {
        if (!input.value) {
            return false;
        } else if (input.type === "radio") {
            if (!radios[input.name]) {
                radios[input.name] = false;
            }
            if (input.checked) {
                radios[input.name] = true;
            }
        }
    }
    for (let radio in radios) {
        if (!radios[radio]) {
            return false;
        }
    }
    return true;
};
