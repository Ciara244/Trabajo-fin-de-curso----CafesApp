// https://github.com/lsongdev/node-escpos
// https://github.com/lsongdev/node-escpos/tree/v3/packages/network
// https://github.com/lsongdev/node-escpos/tree/v3/packages/network

const express = require("express");
const escpos = require("escpos");
escpos.Network = require("escpos-network");

const app = express();
app.use(express.json());



//-----------------------------------------//
//PRINTER:

const printer_IP = "192.168.30.10";
const printer_PORT = 9100;

//-----------------------------------------//

function print(order) {
    const networkDevice = new escpos.Network(printer_IP, printer_PORT);
    const printer = new escpos.Printer(networkDevice);

    networkDevice.open(function(error){
        printer
        .font("a")
        .align("ct")
        .text(`${order.fecha}`) //fecha del pedido
        .text(`${order.colegio}`) //colegio del usuario que lo pidió
        .align("lt")
        .text(`PEDIDO NÚMERO: ${order.id}`)
        .text(`USUARIO ID: #${order.usuario_id}`)
        .text(`NOMBRE: ${order.usuario_nombre}`)
        .align("ct")
        .text("-------------------------------")
        .text(order.productos.map(item => {
            const priceRound = (parseFloat(item.precio) * item.cantidad).toFixed(2);
            return `${item.nombre} x${item.cantidad}   -   ${priceRound}€`;}).join("\n"))
        .text(order.extras && order.extras.length > 0
            ? order.extras.map(ext => {
            return `${ext.nombre_ex}   -   ${ext.precio_ex.toFixed(2)}€`;}).join("\n")
            : ""
        )
        .text("-------------------------------")
        .text(`TOTAL: ${order.total.toFixed(2)}€`)
        .cut()
        .close();
    });
}

app.post("/printTicket", (req, res) => {
    const order = req.body;
    print(order);
    res.json({ok:true});
})


/////////////////////////
// Para poner en el front
/*
async function imprimirTicket(order) {
    try {
        await fetch("http://localhost:3000/printTicket", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(order)
        });
    } catch (error) {
        console.log("ERROR");
    };
};

imprimirTicket(order);
*/