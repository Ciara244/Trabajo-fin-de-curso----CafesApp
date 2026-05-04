import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { useContext, useEffect } from 'react';
import { UserLogin } from './Home/js/UserId';

/* PAGES */
import HomePage from './Home/HomePage';
import Register from './Home/pages/Register';
import Workers from './Home/pages/Workers';
import Cart from './Home/pages/Cart';
import Payment from './Home/pages/Payment';
import Product from './Home/pages/Product';
import Add from './Home/pages/Add';

import IonTab from './Home/ionic/IonTab'


//--------------------------------

function App() {
  //CSS modi. When the user change the variable in settings.
  const { fontSize } = useContext(UserLogin);
  const { color } = useContext(UserLogin);
  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-size", fontSize + "rem");
    document.documentElement.style.setProperty("--app-color-mode", color);
  }, [fontSize, color]);

  return (
    <IonApp>
      <IonRouterOutlet>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/workers" component={Workers} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/product" component={Product} />
          <Route exact path="/add" component={Add} />

          {/*IonTabs. Inside IonTab you will see the other Route's*/}
          <Route path="/tabs" component={IonTab} />

          {/*Todo lo que no coincida con lo de arriba me va a este*/}
          <Redirect to="/" />
        </Switch>
      </IonRouterOutlet>
    </IonApp>
  );
}

export default App;
