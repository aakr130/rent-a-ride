"use client";

import { useEffect } from "react";

type Props = {
  vehicleCoords: [number, number];
  pathCoords: [number, number][];
  vehicleId: number;
};

export default function MapClient({
  vehicleCoords,
  pathCoords,
  vehicleId,
}: Props) {
  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
  } = require("react-leaflet");
  const L = require("leaflet");

  const carIcon = new L.Icon({
    iconUrl: "/images/car-icon.svg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
  });

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(vehicleCoords); // Keep center synced
    }, [vehicleCoords]);
    return null;
  };

  return (
    <MapContainer
      center={vehicleCoords}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={vehicleCoords} icon={carIcon}>
        <Popup>Vehicle #{vehicleId} is here.</Popup>
      </Marker>
      <Polyline
        positions={pathCoords}
        pathOptions={{
          color: "red",
          weight: 4,
          opacity: 0.7,
          dashArray: "6, 8",
        }}
      />
      <MapUpdater />
    </MapContainer>
  );
}
