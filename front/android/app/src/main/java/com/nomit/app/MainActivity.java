package com.nomit.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.nomit.app.plugins.printer.PrinterPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrinterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
