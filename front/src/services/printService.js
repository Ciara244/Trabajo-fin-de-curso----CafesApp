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
    if (str === null) return '';
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

export function ticketGenerator(order) {
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

        const ticket =
            "\x1B\x74\x13" + "\x1B\x61\x01" + "\x1B\x45\x01" +
            dateTime + "\n" +
            enc(order.colegio) + "\n\n" + "\x1B\x45\x00" + "\x1B\x61\x00" +
            enc(`PEDIDO NÚMERO: ${order.id}`) + "\n" +
            enc(`USUARIO ID: #${order.usuario_id}`) + "\n" +
            enc(`NOMBRE: ${order.usuario_nombre}`) + "\n" +
            enc(`ALERGIAS: ${alergico}`) + "\n" +
            linea + "\n" +
            productosStr + "\n" +
            extrasStr + "\n" +
            linea + "\n" + "\x1B\x61\x01" + "\x1B\x45\x01" +
            enc(`TOTAL: ${order.total.toFixed(2)}€`) + "\n\n\n\n" + "\x1B\x45\x00" +
            "\x1D\x56\x00";
    
    return ticket;
}
