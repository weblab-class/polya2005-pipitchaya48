import React, { useEffect, useState, useContext } from "react";
import { fetchLocations, useApiDispatch, useApiState } from "../hooks/ApiContext";
import { SettingsHeading } from "../modules/SettingsHeading";
import { get, post } from "../../utilities";
import { MenuItem, MenuList } from "../modules/MenuList";
import { UserContext } from "../App";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DialogButton } from "../modules/DialogButton";
import { Loading } from "../modules/Loading";

// time contansts
const msPerMin = 60 * 1000;
const msPerHr = 60 * msPerMin;
const msPerDay = 24 * msPerHr;
const msPerMo = 30.44 * msPerDay;
const msPerYr = 365.25 * msPerDay;

const getTimeAgo = (timeSearch) => {
  const timeNow = Date.now();
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

const HistoryItem = ({ from, to }) => (
  <span className="flex flex-col">
    <span className="flex gap-m">
      <div className="text-gray-500 w-10">From</div>
      <div>{from}</div>
    </span>
    <span className="flex gap-m">
      <div className="text-gray-500 w-10">To</div>
      <div>{to}</div>
    </span>
  </span>
);

const HistoryMenuList = ({ history }) => {
  const navigate = useNavigate();
  const { locations } = useApiState();
  const dispatch = useApiDispatch();
  const [locationsTable, setLocationsTable] = useState({});

  useEffect(() => {
    if (!locations) {
      fetchLocations(dispatch);
      return;
    }
    const tempLocationsTable = {
      null: {
        _id: null,
        name: "Your Location",
      },
    };
    locations.forEach((location) => {
      tempLocationsTable[location._id] = location;
    });
    setLocationsTable(tempLocationsTable);
  }, [locations]);

  return (
    <MenuList className="w-full">
      {history.map(
        (historyItem) => (
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
                  <HistoryItem
                    from={locationsTable[historyItem.from].name}
                    to={locationsTable[historyItem.to].name}
                  />
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
  );
};

export const History = () => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    get("/api/history").then((history) => {
      setHistory(history);
    });
  }, []);

  const clearHistoryButton = (
    <div className="flex justify-end w-full px-m">
      <DialogButton
        rootClassName=""
        title="Clear History"
        description={
          <div className="flex flex-col px-s">
            <span className="py-xs">
              Navigation History will be cleared. This action is irreversible.
            </span>
            <span>Are you sure you want to proceed?</span>
          </div>
        }
        dismissButtonText="Cancel"
        dismissButtonClassName="border border-solid border-opacity-25 border-slate-900 bg-bright-red text-white px-m hover:bg-mit-red"
        className="mainButton bg-bright-red text-white disabled:opacity-20 disabled:border-transparent w-max hover:bg-mit-red"
        confirmButton={
          <DialogButton
            rootClassName=""
            title="History Cleared"
            description={
              <div className="px-s">
                Your navigation history is cleared. Plase refresh to see the change.
              </div>
            }
            beforeOpen={() => {
              post("/api/clear-history");
            }}
            afterClose={() => {
              navigate(0);
            }}
            dismissButtonText="Close"
            dismissButtonClassName="bg-mit-red text-white px-m"
            className="p-s rounded-lg border border-solid border-opacity-25 border-slate-900 text-slate-900 bg-slate-900 bg-opacity-5 hover:bg-opacity-20"
          >
            Confirm
          </DialogButton>
        }
      >
        Clear History
      </DialogButton>
    </div>
  );

  return (
    <div className="flex flex-col items-center py-8 w-full max-h-full">
      <SettingsHeading>History</SettingsHeading>
      {user ? (
        history ? (
          <>
            <HistoryMenuList history={history} navigate={navigate} />
            {history.length > 0 ? clearHistoryButton : <span>No Navigation History</span>}
          </>
        ) : (
          <Loading> className="w-full h-full flex justify-center" </Loading>
        )
      ) : (
        <span>You are not logged in</span>
      )}
    </div>
  );
};
