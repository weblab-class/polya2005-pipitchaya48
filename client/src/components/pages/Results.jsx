import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { get } from "../../utilities";

export const Results = () => {
  const [searchParams] = useSearchParams();
  const startLocationId = searchParams.get("from");
  const endLocationId = searchParams.get("to");

  const [startCoords, setStartCoords] = useState({});
  const [endCoords, setEndCoords] = useState({});

  const setCoordsFromLocation = (locationId, setStateCallback) => {
    // use GPS location
    if (locationId === null) {
      setStateCallback({ latitude: 0, longitude: 0 });
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
  }, []);

  return (
    <div>
      Results for {searchParams.get("from")} to {searchParams.get("to")}
      <p>{startCoords.latitude || "Loading..."}</p>
      <p>{endCoords.latitude || "Loading..."}</p>
    </div>
  );
};
