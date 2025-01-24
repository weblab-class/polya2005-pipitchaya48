import { circleMarker, marker as mapMarker, polyline } from "leaflet";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useApiState, useApiDispatch, fetchCoordinates } from "../hooks/ApiContext";

import "../../utilities.css";

export const RouteUpdater = ({ route }) => {
  const map = useMap();
  const numCoords = route.length;
  const { coordinates } = useApiState();
  const dispatch = useApiDispatch();
  const [pathLayers, setPathLayers] = useState([]);

  const getCoord = async (locationId) => {
    if (!coordinates[locationId]) {
      await fetchCoordinates(dispatch, locationId);
    }
    return coordinates[locationId];
  };

  useEffect(() => {
    const updateRoute = async () => {
      // const coords = [startCoords, ...middleCoords, endCoords];
      pathLayers.forEach((layer) => map.removeLayer(layer));
      const coordsPromise = route.map(getCoord);
      const coords = [];
      const currentLayers = [];
      for (const coordPromise of coordsPromise) {
        coords.push(await coordPromise);
      }
      if (coords.length !== 0 && coords.every((coord) => coord?.length === 2)) {
        coords.forEach((coord_in, index) => {
          const coord = [...coord_in];
          let marker;
          switch (index) {
            case numCoords - 1:
              marker = mapMarker(coord, { color: "#8b959e" });
              break;
            case 0:
              marker = circleMarker(coord, { radius: 10, color: "#750014" });
              break;
            default:
              marker = circleMarker(coord, {
                radius: 5,
                stroke: false,
                fillOpacity: 1,
                color: "#8b959e",
              });
          }
          currentLayers.push(marker);
          map.addLayer(marker);
        });

        const path = polyline(coords, { color: "#750014" });
        path.addTo(map);
        currentLayers.push(path);
        setPathLayers(currentLayers);
      }
    };
    updateRoute();
  }, [coordinates]);

  // display user's locaiton
  useEffect(() => {
    if (navigator.geolocation) {
      let userCoord;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userCoord = [position.coords.latitude, position.coords.longitude];
          map.addLayer(
            circleMarker(userCoord, {
              radius: 7,
              color: "248cf3",
              fillOpacity: 0.5,
            })
          );
        },
        (err) => {
          console.log(`User's location is not available: ${err}`);
        }
      );
    }
  }, []);

  return null;
};
