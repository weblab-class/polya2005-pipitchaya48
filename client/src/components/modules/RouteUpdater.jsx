import { circleMarker, marker as mapMarker, polyline } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useApiState, useApiDispatch, fetchCoordinates } from "../hooks/ApiContext";

export const RouteUpdater = ({ route }) => {
  const map = useMap();
  const numCoords = route.length;
  const { coordinates } = useApiState();
  const dispatch = useApiDispatch();

  useEffect(() => {
    const updateRoute = async () => {
      const fetchCoord = async (locationId) => {
        if (!coordinates[locationId]) {
          await fetchCoordinates(dispatch, locationId);
        }
        return coordinates[locationId];
      };
      const startCoordsFetch = fetchCoord(route[0]);
      const endCoordsFetch = fetchCoord(route[numCoords - 1]);
      const middleCoordinatesFetch = Promise.all(route.slice(1, numCoords - 1).map(fetchCoord));
      const startCoords = await startCoordsFetch;
      const endCoords = await endCoordsFetch;
      const middleCoords = await middleCoordinatesFetch;
      const coords = [startCoords, ...middleCoords, endCoords];

      coords.forEach((coord_in, index) => {
        const coord = [...coord_in];
        let marker;
        switch (index) {
          case 0:
            marker = circleMarker(coord, { radius: 10, color: "#750014" });
            break;
          case numCoords - 1:
            marker = mapMarker(coord, { color: "#8b959e" });
            break;
          default:
            marker = circleMarker(coord, {
              radius: 5,
              stroke: false,
              fillOpacity: 1,
              color: "#8b959e",
            });
        }
        map.addLayer(marker);
      });

      polyline(coords, { color: "#750014" }).addTo(map);
    };

    updateRoute();
  }, [route, coordinates, dispatch]);

  return null;
};
