import { circleMarker, polyline, canvas } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useApiState, useApiDispatch, fetchLocations } from "../hooks/ApiContext";


const routeSegmentRenderer = canvas({ padding: 0.5, tolerance: 5 });

const nodeMarker = (location) =>
  circleMarker([location.latitude, location.longitude], {
    radius: 3,
    color: "#750014",
    stroke: false,
    fillOpacity: 1,
  }).bindTooltip(location.name);

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
      { color: "#750014", weight: 2, renderer: routeSegmentRenderer }
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
export const ReportMapUpdater = ({ onChange }) => {
  const map = useMap();
  const { locations } = useApiState();
  const dispatch = useApiDispatch();

  useEffect(() => {
    const updateReportMap = async () => {
      // Fetch locations and coordinates
      if (!locations) {
        await fetchLocations(dispatch);
      }
      locations.forEach((location) => {
        map.addLayer(nodeMarker(location));
      });

        new RouteSegment(locations[0], locations[1])
          .onSelect((route) => console.log(`Selected ${route}`))
          .onDeselect((route) => console.log(`Deselected ${route}`)).addTo(map);
    };

    updateReportMap();
  }, [locations, dispatch]);

  return null;
};
