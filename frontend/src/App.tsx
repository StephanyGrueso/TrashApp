import React from "react";
import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

import Login from "./pages/Login";
import Citizen from "./pages/Citizen";
import Driver from "./pages/Driver";

import "./theme/variables.css";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Route path="/login" component={Login} exact />
        <Route path="/citizen" component={Citizen} exact />
        <Route path="/driver" component={Driver} exact />
        <Redirect exact from="/" to="/login" />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
