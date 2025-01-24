import React, { useEffect, useState } from "react";
import { fetchLocations, useApiDispatch, useApiState } from "../hooks/ApiContext";
import { SettingsHeading } from "../modules/SettingsHeading";
import { get } from "../../utilities";
import { MenuItem, MenuList } from "../modules/MenuList";

export const History = () => {
  const [history, setHistory] = useState(null);
  const { locations } = useApiState();
  const dispatch = useApiDispatch();
  const [locationsTable, setLocationsTable] = useState({});

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
        <MenuList>
          {history.map(
            (historyItem) => (
              console.log(historyItem),
              (
                <MenuItem>
                  {locationsTable[historyItem.to] && locationsTable[historyItem.from] ? (
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
