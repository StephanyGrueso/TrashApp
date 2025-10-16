import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({ iconUrl, shadowUrl });

interface Props {
  lat: number;
  lng: number;
  popupText: string;
  zoom?: number;
}

const MapComponent: React.FC<Props> = ({
  lat,
  lng,
  popupText = "Ubicación actual",
  zoom = 15,
}) => {
  const idRef = useRef(`map-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const map = L.map(idRef.current).setView([lat, lng], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(popupText).openPopup();

    return () => {
      map.remove();
    };
  }, [lat, lng, popupText, zoom]);

  return (
    <div
      id={idRef.current}
      style={{ height: "70vh", width: "100%", borderRadius: "10px" }}
    />
  );
};

export default MapComponent;
