import React, { useState } from "react";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Citizen from "./pages/Citizen";
import Driver from "./pages/Driver";
import Login from "./pages/Login";
import "./theme/variables.css";

// ✅ Encabezado con navegación dinámica
const HeaderNav: React.FC<{ role: string | null }> = ({ role }) => {
  const navigate = useNavigate();

  return (
    <IonHeader>
      <IonToolbar color="dark">
        <IonTitle>TuraBMA</IonTitle>
        <IonButtons slot="end">
          {role === "driver" && (
            <IonButton onClick={() => navigate("/driver")}>Conductor</IonButton>
          )}
          {role === "citizen" && (
            <IonButton onClick={() => navigate("/citizen")}>Ciudadano</IonButton>
          )}
          <IonButton onClick={() => navigate("/login")}>Salir</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

// ✅ Componente principal
const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const handleLogin = (newToken: string, newRole: string) => {
    setToken(newToken);
    setRole(newRole);
  };

  return (
    <IonApp>
      <Router>
        {token && <HeaderNav role={role} />}

        <IonContent>
          <Routes>
            {/* Login */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Vistas según rol */}
            {role === "citizen" && <Route path="/citizen" element={<Citizen />} />}
            {role === "driver" && <Route path="/driver" element={<Driver />} />}

            {/* Redirigir por defecto */}
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        </IonContent>
      </Router>
    </IonApp>
  );
};

export default App;
