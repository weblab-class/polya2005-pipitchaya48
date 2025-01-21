import { circleMarker, polyline, canvas } from "leaflet";
import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { useApiState, useApiDispatch, fetchLocations, fetchNeighbors } from "../hooks/ApiContext";

const routeRenderer = canvas({ padding: 0.5, tolerance: 5 });

const nodeMarker = (location) =>
  circleMarker([location.latitude, location.longitude], {
    radius: 3,
    color: "#750014",
    stroke: false,
    fillOpacity: 1,
    renderer: routeRenderer,
  }).bindPopup(location.name);

/**
 * @typedef Location
 * @type {object}
 * @property {string} _id
 * @property {string} name
 * @property {number} latitude
 * @property {number} longitude
 * @property {boolean} hardCoded
 */

class RouteSegment {
  /** @type {Location}*/
  start;
  /** @type {Location}*/
  end;
  /** @type {(RouteSegment) => void} */
  #onSelect;
  /** @type {(RouteSegment) => void} */
  #onDeselect;
  /** @type {boolean} */
  #selected;
  /** @type {L.Map} */
  #map;
  /** @type {L.Polyline} */
  #line;

  /**
   * A route segment between two locations
   * @param {Location} start
   * @param {Location} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  get name() {
    return `${this.start.name} to ${this.end.name}`;
  }

  /** @param {L.Map} map  */
  addTo(map) {
    this.#map = map;
    this.#line = polyline(
      [
        [this.start.latitude, this.start.longitude],
        [this.end.latitude, this.end.longitude],
      ],
      { color: "#750014", weight: 2, renderer: routeRenderer }
    );
    this.#line
      .on("click", () => {
        if (this.#selected) {
          this.#onDeselect(this);
          this.#selected = false;
          this.#line.setStyle({ weight: 2 });
        } else {
          this.#onSelect(this);
          this.#selected = true;
          this.#line.setStyle({ weight: 4 });
        }
      })
      .addTo(this.#map);
  }

  equals(other) {
    return this.start._id === other.start._id && this.end._id === other.end._id;
  }

  /** @param {(RouteSegment) => void} callback  */
  onSelect(callback) {
    this.#onSelect = callback;
    return this;
  }

  /** @param {(RouteSegment) => void} callback  */
  onDeselect(callback) {
    this.#onDeselect = callback;
    return this;
  }
}

/**
 * @param {(routeSegments: RouteSegment[]) => void} onChange
 */
export const ReportMapUpdater = ({ onChange = (routeSegments) => {} }) => {
  const map = useMap();
  const { locations, neighbors } = useApiState();
  const dispatch = useApiDispatch();
  const [reportList, setReportList] = useState([]);

  const addReport = useCallback((route) => {setReportList([...reportList, route])}, [reportList]);
  const removeReport = useCallback((route) => {setReportList(reportList.filter((r) => !r.equals(route)) )}, [reportList]);

  useEffect(() => {
    onChange(reportList);
  }, [reportList]);

  useEffect(() => {
    const updateReportMap = async () => {
      // Fetch locations and coordinates
      if (!locations) {
        await fetchLocations(dispatch);
      }
      let locationsTable = {};
      locations.forEach((location) => {
        locationsTable[location._id] = location;
      });

      locations
        .map(async (location) => {
          if (!neighbors[location?._id]) {
            await fetchNeighbors(dispatch, location._id);
          }
          return [location, neighbors[location._id]];
        })
        .forEach(async (neighborPromise) => {
          const [location, neighbor] = await neighborPromise;
          neighbor.forEach((neighborId) => {
            if (location._id < neighborId) {
              new RouteSegment(location, locationsTable[neighborId])
                .onSelect(addReport)
                .onDeselect(removeReport)
                .addTo(map);
            }
          });
        });

      locations.forEach((location) => {
        map.addLayer(nodeMarker(location));
      });
    };

    updateReportMap();
  }, [locations, neighbors, dispatch]);

  return null;
};
