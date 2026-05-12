// https://github.com/lsongdev/node-escpos
// https://github.com/lsongdev/node-escpos/tree/v3/packages/network
// https://github.com/lsongdev/node-escpos/tree/v3/packages/network

const express = require("express");
const escpos = require("escpos");
const cors = require("cors");
escpos.Network = require("escpos-network");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const printer_IP = "192.168.30.10";
const printer_PORT = 9100;

// ─── TABLA CP858 ───────────────────────────────────────────────────────────
// Mapea cada carácter UTF-8 a su byte equivalente en CP858.
// Usamos latin1 como encoding del lado JS para que los bytes pasen sin
// reinterpretarse (en latin1, charCode === byte enviado).
const CP858 = {
    'Ç':'\x80','ü':'\x81','é':'\x82','â':'\x83','ä':'\x84','à':'\x85',
    'å':'\x86','ç':'\x87','ê':'\x88','ë':'\x89','è':'\x8A','ï':'\x8B',
    'î':'\x8C','ì':'\x8D','Ä':'\x8E','Å':'\x8F','É':'\x90','æ':'\x91',
    'Æ':'\x92','ô':'\x93','ö':'\x94','ò':'\x95','û':'\x96','ù':'\x97',
    'ÿ':'\x98','Ö':'\x99','Ü':'\x9A',
    'á':'\xA0','í':'\xA1','ó':'\xA2','ú':'\xA3','ñ':'\xA4','Ñ':'\xA5',
    'ª':'\xA6','º':'\xA7','¿':'\xA8','¡':'\xAD',
    'Á':'\xB5','Â':'\xB6','À':'\xB7',
    'Í':'\xD6','€':'\xD5',
    'Ó':'\xE0','Ú':'\xE9',
};

function enc(str) {
    if (str == null) return '';
    return String(str).split('').map(c => CP858[c] ?? c).join('');
}

//formatear fecha
function formatearDate(fechaUTC) {
    const fecha = new Date(fechaUTC);

    return fecha.toLocaleString("es-ES", {
        timeZone: "Atlantic/Canary",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}
// ──────────────────────────────────────────────────────────────────────────

function print(order) {
    const networkDevice = new escpos.Network(printer_IP, printer_PORT);

    // latin1: el byte enviado = charCode del carácter. No reinterpreta nada.
    const printer = new escpos.Printer(networkDevice, { encoding: 'latin1' });

    networkDevice.open(function (error) {
        if (error) {
            console.error("Error al conectar con la impresora:", error);
            return;
        }

        const linea = "-------------------------------";

        const productosStr = order.productos
            .map(item => {
                const precio = (parseFloat(item.precio) * item.cantidad).toFixed(2);
                return enc(`${item.nombre} x${item.cantidad}   -   ${precio}€`);
            })
            .join("\n");

        const extrasStr = order.extras && order.extras.length > 0
            ? order.extras
                .map(ext => enc(`${ext.nombre_ex}   -   ${ext.precio_ex.toFixed(2)}€`))
                .join("\n")
            : "";

        const alergico = (order.alergico ? 
            order.alergias
            .map(alergia => enc(`${alergia}`))
            .join(" ")
            : "NO");
        const dateTime = formatearDate(order.fecha);

        printer
            .raw(Buffer.from([0x1B, 0x74, 0x13]))
            .font("a")
            .align("ct")
            .raw(Buffer.from([0x1B, 0x45, 0x01]))
            .text(String(dateTime))
            .text(enc(String(order.colegio)))
            .raw(Buffer.from([0x1B, 0x45, 0x00]))
            .text("") //espacio

            .align("lt")
            .text(enc(`PEDIDO NÚMERO: ${order.id}`))
            .text(enc(`USUARIO ID: #${order.usuario_id}`))
            .text(enc(`NOMBRE: ${order.usuario_nombre}`))
            .text(enc(`ALERGIA: ${alergico}`))

            .text(linea)
            .text(productosStr)
            .text(extrasStr)
            .text(linea)

            .align("ct")
            .raw(Buffer.from([0x1B, 0x45, 0x01]))
            .text(enc(`TOTAL: ${order.total.toFixed(2)}€`))
            .raw(Buffer.from([0x1B, 0x45, 0x00]))
            .cut()
            .close();
    });
}


app.post("/printTicket", (req, res) => {
    const order = req.body;
    print(order);
    res.json({ ok: true });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor de impresión corriendo en http://localhost:${PORT}`);
});
