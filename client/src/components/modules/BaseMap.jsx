import clsx from "clsx";
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const MIT_COORDINATES = [42.360058, -71.088678];
const MIT_BOUNDS = [
  [42.35271, -71.10781],
  [42.36262, -71.081382],
];

export const BaseMap = ({ children, className }) => {
  return (
    <MapContainer
      className={clsx("h-full w-full flex-auto", className)}
      center={MIT_COORDINATES}
      maxBounds={MIT_BOUNDS}
      zoom={15}
      zoomControl={false}
      touchZoom={true}
      scrollWheelZoom={true}
      dragging={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};
