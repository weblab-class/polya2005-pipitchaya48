import React, { useState, useEffect} from "react";
import { useSearchParams } from "react-router-dom";

import { get } from "../../utilities";
import "../../utilities.css";
import { RouteUpdater } from "../modules/RouteUpdater";
import { BaseMap } from "../modules/BaseMap";

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
        "678e8d67141b2290313bcebf",
        "678e8d68141b2290313bcecf",
        "678e8d68141b2290313bced5",
      ]); // to be changed
    } else {
      get("/api/route", { startId: startLocationId, endId: endLocationId }).then((route) => {
        setRoute(route);
      });
    }
  }, []);

  console.log(route);

  const map = (
    <BaseMap>
      <RouteUpdater route={route} />
    </BaseMap>
  );

  return (
    <div className="h-full w-full flex flex-col items-center justify-center flex-auto">
      Results for {searchParams.get("from")} to {searchParams.get("to")}
      {map}
    </div>
  );
};
