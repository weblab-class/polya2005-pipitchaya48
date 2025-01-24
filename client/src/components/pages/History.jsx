import React, { useEffect, useState } from "react";
import { fetchLocations, useApiDispatch, useApiState } from "../hooks/ApiContext";
import { SettingsHeading } from "../modules/SettingsHeading";
import { get, post } from "../../utilities";
import { MenuItem, MenuList } from "../modules/MenuList";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const History = () => {
  const [history, setHistory] = useState(null);
  const { locations } = useApiState();
  const dispatch = useApiDispatch();
  const [locationsTable, setLocationsTable] = useState({});
  const navigate = useNavigate();

  // time contansts
  const timeNow = Date.now();
  const msPerMin = 60 * 1000;
  const msPerHr = 60 * msPerMin;
  const msPerDay = 24 * msPerHr;
  const msPerMo = 30.44 * msPerDay;
  const msPerYr = 365.25 * msPerDay;

  const getTimeAgo = (timeSearch) => {
    const timeDiff = timeNow - timeSearch;
    if (timeDiff > msPerYr) {
      const res = Math.floor(timeDiff / msPerYr);
      return `${res} ${res > 1 ? "years" : "year"}`;
    }
    if (timeDiff > msPerMo) {
      const res = Math.floor(timeDiff / msPerMo);
      return `${res} mo`;
    }
    if (timeDiff > msPerDay) {
      const res = Math.floor(timeDiff / msPerDay);
      return `${res} ${res > 1 ? "days" : "day"}`;
    }
    if (timeDiff > msPerHr) {
      const res = Math.floor(timeDiff / msPerHr);
      return `${res} ${res > 1 ? "hours" : "hour"}`;
    }
    if (timeDiff > msPerMin) {
      const res = Math.floor(timeDiff / msPerMin);
      return `${res} ${res > 1 ? "mins" : "min"}`;
    }
    const res = Math.floor(timeDiff / 1000);
    return `${res} ${res > 1 ? "seconds" : "second"}`;
  };

  useEffect(() => {
    get("/api/history").then((history) => {
      setHistory(history);
    });
  }, []);

  useEffect(() => {
    if (!locations) {
      fetchLocations(dispatch);
      return;
    }
    const tempLocationsTable = {};
    locations.forEach((location) => {
      tempLocationsTable[location._id] = location;
    });
    console.log(tempLocationsTable);
    setLocationsTable(tempLocationsTable);
  }, [locations]);

  return (
    <div className="flex flex-col items-center py-8 w-full max-h-full">
      <SettingsHeading>History</SettingsHeading>
      {history ? (
        <MenuList className="w-full">
          {history.map(
            (historyItem) => (
              console.log(historyItem),
              (
                <MenuItem
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    post("/api/add-history", { from: historyItem.from, to: historyItem.to });
                    navigate(`/results?from=${historyItem.from}&to=${historyItem.to}`);
                  }}
                >
                  {locationsTable[historyItem.to] && locationsTable[historyItem.from] ? (
                    <div className="flex flex-row justify-between w-full">
                      <span className="flex flex-col">
                        <span className="flex gap-m">
                          <div className="text-gray-500 w-10">From</div>
                          <div>{locationsTable[historyItem.from].name}</div>
                        </span>
                        <span className="flex gap-m">
                          <div className="text-gray-500 w-10">To</div>
                          <div>{locationsTable[historyItem.to].name}</div>
                        </span>
                      </span>
                      <div className="flex flex-row items-center text-gray-500">
                        <p>{getTimeAgo(historyItem.date)} ago</p>
                        <ChevronRight />
                      </div>
                    </div>
                  ) : (
                    <span className="text-lg">Loading...</span>
                  )}
                </MenuItem>
              )
            )
          )}
        </MenuList>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};
