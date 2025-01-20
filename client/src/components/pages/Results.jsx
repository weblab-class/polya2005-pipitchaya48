import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { get } from "../../utilities";
import "../../utilities.css";
import { RouteUpdater } from "../modules/RouteUpdater";
import { BaseMap } from "../modules/BaseMap";

export const Results = () => {
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState(null); // use null here to add loading screen
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
      get("/api/route", { startId: startLocationId, endId: endLocationId })
        .then((route) => {
          setRoute(route);
        })
        .catch((err) => {
          console.log(`error at route API: ${err}`);
        });
    }
  }, []);

  console.log(route);
  console.log(route === null);

  // added loading screen if route is not fetched
  const map = route ? (
    <BaseMap route={route}>
      <RouteUpdater route={route} />
    </BaseMap>
  ) : (
    <p>Loading...</p>
  );

  return (
    <div className="h-full w-full flex flex-col items-center justify-center flex-auto">
      Results for {searchParams.get("from")} to {searchParams.get("to")}
      {map}
    </div>
  );
};
