import { circleMarker, marker as mapMarker, polyline } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { get, coordinatesToArray } from "../../utilities";

export const RouteUpdater = ({ route }) => {
  const map = useMap();
  const numCoords = route.length;
  const fetchCoordinates = async (locationId) => {
    const coords = await get("/api/location-coords", { locationId: locationId });
    return coordinatesToArray(coords);
  };

  const updateRoute = async () => {
    const startCoordsFetch = fetchCoordinates(route[0]);
    const endCoordsFetch = fetchCoordinates(route[numCoords - 1]);
    const middleCoordinatesFetch = Promise.all(route.slice(1, numCoords - 1).map(fetchCoordinates));
    const startCoords = await startCoordsFetch;
    const endCoords = await endCoordsFetch;
    const middleCoords = await middleCoordinatesFetch;
    const coords = [startCoords, ...middleCoords, endCoords];

    coords.forEach((coord, index) => {
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
          break;
      }
      map.addLayer(marker);
    });

    map.addLayer(polyline(coords, { color: "#8b959e" }));
  };

  useEffect(() => {
    updateRoute();
  }, [route]);
  return null;
};
