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

const hardcodedLocations = [
  { _id: "1", name: "1" },
  { _id: "2", name: "32 (Stata Center)" },
  { _id: "3", name: "26" },
  { _id: "4", name: "W1 (Maseeh Hall)" },
  { _id: "5", name: "W20 (Stratton Student Center)" },
  { _id: "6", name: "E25 (Amundson Hall)" },
  { _id: "7", name: "10" },
  { _id: "8", name: "14" },
  { _id: "9", name: "16" },
  { _id: "10", name: "18" },
  { _id: "11", name: "24" },
  { _id: "12", name: "34" },
  { _id: "13", name: "36" },
  { _id: "14", name: "38" },
  { _id: "15", name: "46" },
  { _id: "16", name: "50" },
  { _id: "17", name: "54" },
  { _id: "18", name: "56" },
  { _id: "19", name: "66" },
  { _id: "20", name: "68" },
  { _id: "21", name: "70" },
  { _id: "22", name: "76" },
  { _id: "23", name: "77" },
  { _id: "24", name: "E51" },
  { _id: "25", name: "E52" },
  { _id: "26", name: "E62" },
];

// Call this function to exports the hardcoded locations to the database
// Then delete the locaitons list above.
const handleImport = () => {
  for (let i = 0; i < hardcodedLocations.length; i++) {
    const currentLocation = hardcodedLocations[i];
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
  const [locations, setLocations] = useState(null);
  const navigate = useNavigate();

  const updateSearchQuery = (key) => (value) => {
    setSearchQuery((prev) => ({ ...prev, [key]: value._id })); // use _id for query
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate({
      pathname: "/results",
      search: createSearchParams(searchQuery).toString(),
    });
  };

  // fetch all locations
  useEffect(() => {
    let accessibleLocations = [];
    get("/api/location-names").then((locationsList) => {
      accessibleLocations = locationsList;
      // GPS utility
      if (navigator.geolocation) {
        accessibleLocations.unshift({
          _id: null,
          name: "Your Location",
        });
      }
      setLocations(accessibleLocations);
    });
  }, []);

  return locations ? (
    <form
      className="flex flex-col w-full p-m rounded-lg bg-silver-gray gap-m"
      onSubmit={handleSubmit}
    >
      <AutocompleteInput
        options={locations}
        getOptionLabel={(option) => option.name}
        inputLabelText="Going from"
        onChange={updateSearchQuery("from")}
      />
      <AutocompleteInput
        options={locations}
        getOptionLabel={(option) => option.name}
        inputLabelText="Going to"
        onChange={updateSearchQuery("to")}
      />
      <Button
        disabled={searchQuery.from === "" || searchQuery.to === ""}
        type="submit"
        className="u-mainButton bg-bright-red text-white disabled:opacity-20 disabled:border-none"
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
