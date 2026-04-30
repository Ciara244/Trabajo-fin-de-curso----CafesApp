import React from "react";
import { IonLabel, IonIcon, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet } from '@ionic/react';
import { Route, Switch, Redirect } from 'react-router-dom';

/* RESOURCES */
import { cafe, mailUnread, settings } from 'ionicons/icons';

/* PAGES */
import Menu from "../pages/Menu";
import Orders from "../pages/Orders";
import Settings from "../pages/Settings";

export default function Tab() {

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Switch>
                    <Route exact  path="/tabs/menu" component={Menu} />
                    <Route exact  path="/tabs/orders" component={Orders} />
                    <Route exact  path="/tabs/settings" component={Settings} />

                    <Redirect to="/tabs/menu"/>
                </Switch>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="menu" href="/tabs/menu">
                    <IonIcon icon={cafe}></IonIcon>
                    <IonLabel>Menu</IonLabel>
                </IonTabButton>

                <IonTabButton tab="orders" href="/tabs/orders">
                    <IonIcon icon={mailUnread} />
                    <IonLabel>Pedidos</IonLabel>
                </IonTabButton>

                <IonTabButton tab="settings" href="/tabs/settings">
                    <IonIcon icon={settings} />
                    <IonLabel>Ajustes</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

//https://ionicframework.com/docs/api/tabs