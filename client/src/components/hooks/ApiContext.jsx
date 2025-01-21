import React, { createContext, useReducer, useContext } from "react";
import { get, coordinatesToArray } from "../../utilities";

const ApiStateContext = createContext();
const ApiDispatchContext = createContext();

const apiReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCATIONS":
      return { ...state, locations: action.payload };
    case "SET_COORDINATES":
      return {
        ...state,
        coordinates: { ...state.coordinates, [action.payload.id]: action.payload.coords },
      };
    case "SET_NEIGHBORS":
      return {
        ...state,
        neighbors: { ...state.neighbors, [action.payload.id]: action.payload.neighbors },
      }

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, {
    locations: null,
    coordinates: {},
    neighbors: {},
  });

  return (
    <ApiStateContext.Provider value={state}>
      <ApiDispatchContext.Provider value={dispatch}>{children}</ApiDispatchContext.Provider>
    </ApiStateContext.Provider>
  );
};

export const useApiState = () => useContext(ApiStateContext);
export const useApiDispatch = () => useContext(ApiDispatchContext);

// Fetch locations and set them in the context
export const fetchLocations = async (dispatch) => {
  dispatch({ type: "SET_LOCATIONS", payload: await get("/api/location-names") });
};

// Fetch coordinates and set them in the context
export const fetchCoordinates = async (dispatch, locationId) => {
  const coords = await get("/api/location-coords", { locationId: locationId });
  dispatch({
    type: "SET_COORDINATES",
    payload: { id: locationId, coords: coordinatesToArray(coords) },
  });
};

// Fetch neighbors and set them in the context
export const fetchNeighbors = async (dispatch, locationId) => {
  const neighbors = await get("/api/neighbors", { locationId: locationId });
  dispatch({
    type: "SET_NEIGHBORS",
    payload: { id: locationId, neighbors: neighbors },
  });
};
