import { registerPlugin } from "@capacitor/core";
import { ticketGenerator } from "../services/printService";

type PrinterPluginType = {
  printTicket(options: { ip: string; port: number; data: string }): Promise<void>;
};

export const Printer = registerPlugin<PrinterPluginType>('Printer', {
  web: () => import('./printer.web.ts').then(m => new m.PrinterWeb()),
});

export async function imprimirAndroid(order: any) {
  const ticket = ticketGenerator(order);

  await Printer.printTicket({
    ip: "192.168.30.10",
    port: 9100,
    data: ticket
  });
}