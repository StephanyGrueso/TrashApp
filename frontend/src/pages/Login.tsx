import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonLabel,
  IonItem,
  useIonRouter,
} from "@ionic/react";
import "./Login.css";

const Login: React.FC = () => {
  const [role, setRole] = useState<string>("");
  const router = useIonRouter();

  const handleLogin = () => {
    if (!role) return;
    localStorage.setItem("role", role);

    if (role === "citizen") router.push("/citizen", "forward");
    if (role === "driver") router.push("/driver", "forward");
    if (role === "admin") router.push("/admin", "forward");
  };

  return (
    <IonPage>
      {/* NAVBAR */}
      <IonToolbar color="success" className="navbar">
        <IonButtons slot="start" className="navbar-logo">
          <IonTitle>TrashApp</IonTitle>
        </IonButtons>
        <IonButtons slot="end" className="navbar-links">
          <IonText className="navbar-link">OffLine</IonText>
          <IonText className="navbar-link">Ayuda</IonText>
        </IonButtons>
      </IonToolbar>

      {/* HERO SECTION */}
      <IonContent className="login-bg">
        <div className="hero-container">
          <h1 className="hero-title">TrashApp</h1>
          <h2 className="hero-subtitle">Por más calles limpias</h2>

          <div className="select-container">
            <IonItem className="login-item" lines="none">
              <IonLabel position="stacked" className="label-rol">
                Rol
              </IonLabel>
              <IonSelect
                interface="popover"
                placeholder="Seleccionar Rol"
                value={role}
                onIonChange={(e) => setRole(e.detail.value)}
              >
                <IonSelectOption value="citizen">Ciudadano</IonSelectOption>
                <IonSelectOption value="driver">Conductor</IonSelectOption>
                <IonSelectOption value="admin">Administrador</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>

          <IonButton
            expand="block"
            className="login-button"
            onClick={handleLogin}
            disabled={!role}
          >
            INGRESAR
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
