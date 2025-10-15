import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSpinner,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import L, { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

interface TruckLocation {
  lat: number;
  lng: number;
  timestamp?: string;
}

const Citizen: React.FC = () => {
  const [location, setLocation] = useState<TruckLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [marker, setMarker] = useState<Marker | null>(null);

  // ✅ Inicializar mapa solo una vez
  useEffect(() => {
    const leafletMap = L.map("map", {
      center: [3.8773, -77.0276],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(leafletMap);

    const truckMarker = L.marker([3.8773, -77.0276], {
      title: "Camión de basura",
    }).addTo(leafletMap);

    setMap(leafletMap);
    setMarker(truckMarker);

    // Evita errores de tamaño en Ionic
    setTimeout(() => leafletMap.invalidateSize(), 400);

    return () => {
      leafletMap.remove();
    };
  }, []);

  // 🔁 Actualizar posición desde el backend
  useEffect(() => {
    const fetchLocation = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:4000/api/truck/1/location");
        if (!response.ok) throw new Error("No se pudo obtener la ubicación");

        const data: TruckLocation = await response.json();
        setLocation(data);
        setLoading(false);

        if (map && marker) {
          marker.setLatLng([data.lat, data.lng]);
          map.panTo([data.lat, data.lng]);
        }
      } catch (error) {
        console.error("❌ Error obteniendo ubicación:", error);
      }
    };

    fetchLocation(); // primera vez
    const interval = setInterval(fetchLocation, 8000);
    return () => clearInterval(interval);
  }, [map, marker]);

  return (
    <IonPage>
      {/* ✅ Encabezado moderno */}
      <IonHeader translucent>
        <IonToolbar color="success">
          <IonTitle className="ion-text-center">Seguimiento del Camión 🚛</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* ✅ Contenido principal */}
      <IonContent fullscreen>
        {/* Tarjeta de información */}
        <IonCard
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            width: "90%",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          <IonCardContent className="ion-text-center">
            {loading ? (
              <IonSpinner name="dots" />
            ) : (
              <>
                <h2 style={{ margin: 0, color: "#16a085" }}>Camión activo</h2>
                <p style={{ margin: 0 }}>
                  📍 Lat: {location?.lat.toFixed(5)} | Lng: {location?.lng.toFixed(5)}
                </p>
                <small>
                  Última actualización:{" "}
                  {new Date(location?.timestamp || Date.now()).toLocaleTimeString()}
                </small>
              </>
            )}
          </IonCardContent>
        </IonCard>

        {/* Mapa a pantalla completa */}
        <div
          id="map"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Citizen;
