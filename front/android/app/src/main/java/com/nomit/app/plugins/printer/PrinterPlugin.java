package com.nomit.app.plugins.printer;

import android.util.Log;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.Charset;

@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {
    @PluginMethod
    public void printTicket(PluginCall call) {
        String ip = call.getString("ip");
        int port = call.getInt("port", 9100);
        String data = call.getString("data");

        if (ip == null || data == null) {
            call.reject("Missing IP or data");
            return;
        }

        new Thread(() -> {
            try {
                Socket socket = new Socket();
                socket.connect(new java.net.InetSocketAddress(ip, port), 3000);
                OutputStream out = socket.getOutputStream();

                // IMPORTANTE: usar ISO-8859-1 para CP858
                byte[] bytes = data.getBytes(Charset.forName("ISO-8859-1"));
                out.write(bytes);
                out.flush();

                socket.close();
                call.resolve();
            } catch (Exception e) {
                Log.e("PrinterPlugin", "Error printing", e);
                call.reject("Error printing: " + e.getMessage());
            }
        }).start();
    }
}
