import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { get } from "../../utilities";
import "../../utilities.css";
import { RouteUpdater } from "../modules/RouteUpdater";
import { BaseMap } from "../modules/BaseMap";
import { useApiState, useApiDispatch, fetchLocations } from "../hooks/ApiContext";

function findClosestLocation(locations, coords) {
  let closestLocation = null;
  let minDistance = Infinity;
  for (const location of locations) {
    const distance = Math.sqrt(
      (location.latitude - coords.latitude) ** 2 + (location.longitude - coords.longitude) ** 2
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = location;
    }
  }
  return closestLocation;
}

export const Results = () => {
  const [searchParams] = useSearchParams();
  const [route, setRoute] = useState([]);
  const [startLocationId, setStartLocationId] = useState(searchParams.get("from"));
  const [endLocationId, setEndLocationId] = useState(searchParams.get("to"));

  const { locations } = useApiState();
  const dispatch = useApiDispatch();

  useEffect(() => {
    if (!locations) {
      fetchLocations(dispatch);
    }
  }, [locations, dispatch]);

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
    if (!locations) {
      return;
    }
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const closestLocation = findClosestLocation(locations, coords);
      console.log(closestLocation);
      if (startLocationId === "null") {
        setStartLocationId(closestLocation._id);
      }
      if (endLocationId === "null") {
        setEndLocationId(closestLocation._id);
      }
    });
  }, [locations]);

  useEffect(() => {
    if (startLocationId !== "null" && endLocationId !== "null") {
      get("/api/route", { startId: startLocationId, endId: endLocationId }).then((route) => {
        setRoute(route);
      });
    }
  }, [startLocationId, endLocationId]);

  console.log(route);

  const map = route ? (
    <BaseMap>
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
