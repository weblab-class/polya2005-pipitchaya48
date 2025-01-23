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
      (location.latitude - coords.latitude) ** 2 +
        ((location.longitude - coords.longitude) * Math.cos(location.latitude)) ** 2
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
    const getAndSetGpsLocation = async () => {
      if (startLocationId !== "null" && endLocationId !== "null") {
        return;
      }
      if (!locations) {
        await fetchLocations(dispatch);
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
    };
    getAndSetGpsLocation();
  }, [locations]);

  useEffect(() => {
    if (startLocationId !== "null" && endLocationId !== "null") {
      get("/api/route", { startId: startLocationId, endId: endLocationId }).then((route) => {
        setRoute(route);
      });
    }
  }, [startLocationId, endLocationId]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center flex-auto">
      Results for {searchParams.get("from")} to {searchParams.get("to")}
      {route.length > 0 ? (
        <BaseMap>
          <RouteUpdater route={route} />
        </BaseMap>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
