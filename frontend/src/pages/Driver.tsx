import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonText,
  IonToast,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import localforage from "localforage";

// 📍 Tipo de dato para las coordenadas
interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
}

const Driver: React.FC = () => {
  const [position, setPosition] = useState<LocationData | null>(null);
  const [sending, setSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 📦 Guarda la ubicación cuando no hay conexión
  const saveOfflineLocation = async (location: LocationData): Promise<void> => {
    const stored = (await localforage.getItem<LocationData[]>("pendingLocations")) || [];
    stored.push(location);
    await localforage.setItem("pendingLocations", stored);
  };

  // 🔁 Reenvía las ubicaciones guardadas cuando vuelve el internet
  const syncOfflineLocations = async (): Promise<void> => {
    const pending = await localforage.getItem<LocationData[]>("pendingLocations");
    if (!pending || pending.length === 0) return;

    for (const loc of pending) {
      try {
        await fetch("http://localhost:4000/api/truck/1/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loc),
        });
      } catch {
        return; // Si algo falla, se detiene para intentar después
      }
    }

    await localforage.removeItem("pendingLocations");
    setToastMessage("✅ Ubicaciones sincronizadas correctamente");
  };

  // 🛰️ Envía la ubicación actual
  const sendLocation = async (): Promise<void> => {
    setSending(true);
    try {
      const coords = await Geolocation.getCurrentPosition();
      const lat = coords.coords.latitude;
      const lng = coords.coords.longitude;
      const data: LocationData = { lat, lng, timestamp: new Date().toISOString() };

      setPosition(data);

      if (navigator.onLine) {
        await fetch("http://localhost:4000/api/truck/1/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        setToastMessage("📡 Ubicación enviada al servidor");
      } else {
        await saveOfflineLocation(data);
        setToastMessage("📦 Sin conexión — ubicación guardada localmente");
      }
    } catch {
      setToastMessage("⚠️ Error al obtener ubicación");
    } finally {
      setSending(false);
    }
  };

  // 🔄 Envía automáticamente cada 10 segundos
  useEffect(() => {
    const interval = setInterval(sendLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🌐 Sincroniza cuando vuelve la conexión
  useEffect(() => {
    window.addEventListener("online", syncOfflineLocations);
    return () => window.removeEventListener("online", syncOfflineLocations);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle className="ion-text-center">🚛 Conductor — TuraBMA</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{ "--background": "#f4f4f4", minHeight: "100vh" }}
      >
        {/* Tarjeta de información */}
        <IonCard
          style={{
            backgroundColor: "#1b5e20", // Verde bandera Buenaventura
            color: "white",
            borderRadius: "18px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <IonCardContent className="ion-text-center">
            <h2 style={{ marginBottom: "10px" }}>📍 Envío de ubicación</h2>
            <p>
              Tu ubicación se envía automáticamente cada <strong>10 segundos</strong>.
              Si pierdes la conexión, los datos se guardan y se sincronizan cuando vuelvas a estar en línea.
            </p>
          </IonCardContent>
        </IonCard>

        {/* Botón principal */}
        <IonButton
          expand="block"
          color="success"
          onClick={sendLocation}
          disabled={sending}
          style={{
            marginTop: "20px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {sending ? "Enviando ubicación..." : "Enviar ubicación ahora"}
        </IonButton>

        {/* Última ubicación */}
        {position && (
          <IonCard
            style={{
              backgroundColor: "#ffffff",
              marginTop: "20px",
              borderRadius: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <IonCardContent>
              <IonText>
                <h3>Última ubicación registrada:</h3>
                <p>Latitud: {position.lat.toFixed(6)}</p>
                <p>Longitud: {position.lng.toFixed(6)}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Toast de mensajes */}
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage || ""}
          duration={2000}
          color="dark"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Driver;
