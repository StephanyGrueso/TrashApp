import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/react";
import MapComponent from "../components/MapComponent";

const Citizen: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Vista Ciudadano</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <MapComponent
          lat={3.8801}
          lng={-77.0312}
          popupText="Ubicación en Buenaventura"
        />
      </IonContent>
    </IonPage>
  );
};

export default Citizen;
