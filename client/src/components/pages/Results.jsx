import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import { circleMarker, polyline } from "leaflet";

import { get, coordinatesToArray } from "../../utilities";
import "../../utilities.css";

const RouteUpdater = ({ route }) => {
  const map = useMap();
  Promise.all(
    route.map((locationId) => get("/api/location-coords", { locationId: locationId }))
  ).then((coords) => {
    console.log(coords);
    coords = coords.map((coord)=>coordinatesToArray(coord));
    coords.map((coord) => {
      map.addLayer(circleMarker(coord, { radius: 3 }));
    });
    map.addLayer(polyline(coords, { color: "red" }));
  });
  return null;
};

export const Results = () => {
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState([]);
  const startLocationId = searchParams.get("from");
  const endLocationId = searchParams.get("to");

  /* get locations
  const [startCoords, setStartCoords] = useState({});
  const [endCoords, setEndCoords] = useState({});

  const setCoordsFromLocation = (locationId, setStateCallback) => {
    // use GPS location
    if (locationId === "null") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setStateCallback({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (err) => {
            console.log(`Error retreiving location: ${err}`);
          }
        );
      } else {
        console.log("GPS is not supported.");
      }
    } else {
      get("/api/location-coords", { locationId: locationId }).then((coords) => {
        setStateCallback(coords);
      });
    }
  };

  // fetch location coordinates
  useEffect(() => {
    setCoordsFromLocation(startLocationId, setStartCoords);
    setCoordsFromLocation(endLocationId, setEndCoords);
  }, []); */

  // fetch Route
  // TO-DO estimate nearest point from GPS location
  useEffect(() => {
    if (startLocationId === "null" || endLocationId === "null") {
      setRoute([
        "678c8bbc1140d591427ba321",
        "678c8b0d1140d591427ba31f",
        "678c8b6e1140d591427ba320",
      ]); // to be changed
    } else {
      get("/api/route", { startId: startLocationId, endId: endLocationId }).then((route) => {
        setRoute(route);
      });
    }
  }, []);

  console.log(route);

  const map = (
    <MapContainer
      className="h-full w-full flex-auto"
      center={[42.360058, -71.088678]}
      zoom={15}
      scrollWheelZoom={true}
      dragging={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[42.360058, -71.088678]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <RouteUpdater route={route} />
    </MapContainer>
  );

  return (
    <div className="h-full w-full flex flex-col items-center justify-center flex-auto">
      Results for {searchParams.get("from")} to {searchParams.get("to")}
      <p>{route}</p>
      {map}
    </div>
  );
};
