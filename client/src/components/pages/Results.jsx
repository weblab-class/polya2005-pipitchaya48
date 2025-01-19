import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { get } from "../../utilities";

export const Results = () => {
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState(null);
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

  // get Route
  useEffect(() => {
    if (startLocationId === "null" || endLocationId === "null") {
      setRoute([1, 2, 3]); // to be changed
    } else {
      get("/api/route", { startId: startLocationId, endId: endLocationId }).then((route) => {
        setRoute(route);
      });
    }
  }, []);

  console.log(route);

  return (
    <div>
      Results for {searchParams.get("from")} to {searchParams.get("to")}
      <p>{route}</p>
    </div>
  );
};
