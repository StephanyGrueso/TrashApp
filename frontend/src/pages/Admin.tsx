import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const Admin: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Administrador</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Pantalla del Administrador</h2>
        <p>
          Aquí el administrador podrá ver rutas guardadas, historial de recorridos
          y estadísticas del servicio.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Admin;
