import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import MapComponent from "../components/MapComponent";

const Driver: React.FC = () => {
  const [coords, setCoords] = useState({ lat: 3.8801, lng: -77.0312 });

  /* 🔁 Actualiza ubicación cada 30 s (simulado) */
  useEffect(() => {
    const interval = setInterval(() => {
      setCoords((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Ruta del Conductor</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <MapComponent
          lat={coords.lat}
          lng={coords.lng}
          popupText="Ubicación actual del camión"
        />
      </IonContent>
    </IonPage>
  );
};

export default Driver;
