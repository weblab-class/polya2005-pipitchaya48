import React, { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import AutocompleteInput from "../modules/AutocompleteInput";
import { Input, Button } from "@mui/base";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";

import "./Home.css";
import "../../utilities.css";

import { get, post } from "../../utilities";
import { fetchLocations, useApiDispatch, useApiState } from "../hooks/ApiContext";

const hardcodedLocations = [
  { name: "Bldg 1", longitude: -71.092587, latitude: 42.3581539 },
  { name: "Bldg 1 (Memorial Dr entrance)", longitude: -71.0917994, latitude: 42.3580045 },
  { name: "Bldg 2", longitude: -71.0901479, latitude: 42.3591014 },
  { name: "Bldg 2 (Mem Dr Entrance)", longitude: -71.090451, latitude: 42.3584554 },
  { name: "Bldg 3", longitude: -71.0926796, latitude: 42.3593743 },
  { name: "Bldg 4 (North / Infinite Corridor)", longitude: -71.091249, latitude: 42.3598173 },
  { name: "Bldg 4 (South)", longitude: -71.0907138, latitude: 42.3589746 },
  { name: "Bldg 4/8 (Outfinite Entrance)", longitude: -71.0911268, latitude: 42.3598495 },
  { name: "Bldg 5", longitude: -71.0929582, latitude: 42.3587696 },
  { name: "Bldg 6", longitude: -71.0904873, latitude: 42.3596066 },
  { name: "Bldg 6C", longitude: -71.0908682, latitude: 42.3594916 },
  { name: "Bldg 7", longitude: -71.0931552, latitude: 42.3592078 },
  { name: "Bldg 8", longitude: -71.0907377, latitude: 42.359988 },
  { name: "Bldg 9", longitude: -71.0935173, latitude: 42.3596934 },
  { name: "Bldg 10 (The Great Dome)", longitude: -71.0920552, latitude: 42.3595445 },
  { name: "Bldg 13", longitude: -71.0923747, latitude: 42.3600402 },
  { name: "Bldg 14 (Hayden Lbry)", longitude: -71.0896455, latitude: 42.3593027 },
  { name: "Bldg 16", longitude: -71.0908564, latitude: 42.3603807 },
  { name: "Bldg 16/56 Border", longitude: -71.0902388, latitude: 42.3605897 },
  { name: "Bldg 18", longitude: -71.0897996, latitude: 42.3600636 },
  { name: "Bldg 26", longitude: -71.0912695, latitude: 42.361007 },
  { name: "Bldg 32 (Stata Ctr)", longitude: -71.0905589, latitude: 42.3616363 },
  { name: "Bldg 36", longitude: -71.0915453, latitude: 42.3615246 },
  { name: "Bldg 54&55 (Green Bldg)", longitude: -71.0892626, latitude: 42.3603518 },
  { name: "Bldg 56", longitude: -71.0894933, latitude: 42.3608354 },
  { name: "Bldg 66 (Fairchild Bldg)", longitude: -71.0887094, latitude: 42.3609915 },
  { name: "Bldg 68 (Koch Biology Bldg)", longitude: -71.088586, latitude: 42.3614395 },
  { name: "Bldg 76 (Koch Inst)", longitude: -71.088796, latitude: 42.362368 },
  { name: "Bldg E17", longitude: -71.087734, latitude: 42.3614836 },
  { name: "Bldg E18", longitude: -71.0877528, latitude: 42.3617551 },
  { name: "Bldg E19", longitude: -71.0879352, latitude: 42.3619831 },
  { name: "Bldg E25 (MIT Health / MBTA)", longitude: -71.0865271, latitude: 42.3615575 },
];

// Call this function to exports the hardcoded locations to the database
// Then delete the locaitons list above.
const handleImport = () => {
  for (let currentLocation of hardcodedLocations) {
    const dummyLatAndLong = 0;
    post("/api/hardcoded-locations-import", {
      name: currentLocation.name,
      latitude: currentLocation.latitude || dummyLatAndLong,
      longitude: currentLocation.longitude || dummyLatAndLong,
    })
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

/**
 * Home page component
 */
const Search = () => {
  const [searchQuery, setSearchQuery] = useState({ from: "", to: "" });
  const { locations } = useApiState();
  const dispatch = useApiDispatch();
  const navigate = useNavigate();

  const updateSearchQuery = (key) => (value) => {
    setSearchQuery((prev) => ({ ...prev, [key]: value._id })); // use _id for query
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/api/add-history", { ...searchQuery });
    navigate({
      pathname: "/results",
      search: createSearchParams(searchQuery).toString(),
    });
  };

  useEffect(() => {
    if (!locations) {
      fetchLocations(dispatch);
    }
  }, [locations, dispatch]);
  let options = locations ? [...locations] : [];
  if (navigator.geolocation) {
    options.unshift({
      _id: null,
      name: "Your Location",
    });
  }

  return locations ? (
    <form
      className="flex flex-col w-full p-m rounded-lg bg-silver-gray gap-m"
      onSubmit={handleSubmit}
    >
      <AutocompleteInput
        options={options}
        getOptionLabel={(option) => option.name}
        inputLabelText="Going from"
        onChange={updateSearchQuery("from")}
      />
      <AutocompleteInput
        options={options}
        getOptionLabel={(option) => option.name}
        inputLabelText="Going to"
        onChange={updateSearchQuery("to")}
      />
      <Button
        disabled={searchQuery.from === "" || searchQuery.to === ""}
        type="submit"
        className="mainButton bg-bright-red text-white disabled:opacity-20 disabled:border-none"
      >
        GO
      </Button>
    </form>
  ) : (
    <p>Loading Locations...</p>
  );
};

export const Home = () => {
  const [searchInProgress, setSearchInProgress] = useState(false);
  // useEffect(handleImport, []);
  const startPage = (
    <div className="flex flex-col items-center p-s h-full flex-grow max-w-full">
      <div className="Home-topSpacer" />
      <div className="Home-content flex flex-col items-center justify-center">
        <h1 className="text-3xl p-xs text-center my-3">
          MIT
          <br />
          Tunnel Navigator
        </h1>
        <div
          onClick={() => {
            setSearchInProgress(true);
          }}
          className="w-full"
        >
          <Input
            placeholder="Where are you going?"
            endAdornment={
              <InputAdornment>
                <SearchIcon />
              </InputAdornment>
            }
            className="Home-search flex"
          />
        </div>
      </div>
      <div className="Home-bottomSpacer" />
    </div>
  );

  return searchInProgress ? (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full p-m"
    >
      <Search />
    </motion.div>
  ) : (
    startPage
  );
};
