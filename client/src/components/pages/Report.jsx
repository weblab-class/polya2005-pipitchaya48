import React, { useEffect, useRef, useState } from "react";

import "../../utilities.css";
import { BaseMap } from "../modules/BaseMap";
import { ReportMapUpdater } from "../modules/ReportMapUpdater";
import { DialogButton } from "../modules/DialogButton";
import { post } from "../../utilities";
import { useNavigate } from "react-router-dom";

export const Report = () => {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);
  const handleCloseRef = useRef(null);

  const routeNames = (
    <ul className="w-full pl-l">
      {reportList.map((routeSegment) => (
        <li className="list-disc">{routeSegment.name}</li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col flex-auto items-center py-12 px-m w-full h-full gap-l">
      <h1 className="text-2xl text-center w-full">Report closed routes</h1>
      <div className="p-m flex flex-col flex-auto items-center gap-m w-full h-full bg-silver-gray rounded-lg">
        <h2 className="self-start">Select Route</h2>
        <BaseMap className="border border-black rounded">
          <ReportMapUpdater onChange={(routeSegments) => setReportList([...routeSegments])} />
        </BaseMap>
        <DialogButton
          disabled={reportList.length === 0}
          title="Report closed routes"
          description={
            <>These routes will be reported as unavailable for the rest of the day:{routeNames}</>
          }
          className="mainButton bg-bright-red text-white disabled:opacity-20 disabled:border-transparent w-full"
          dismissButtonText="Cancel"
          dismissButtonClassName="bg-mit-red text-white px-m"
          handleCloseRef={handleCloseRef}
          confirmButton={
            <DialogButton
              rootClassName=""
              title="Routes closure reported"
              description={
                <>
                  These routes have been reported as unavailable:
                  {routeNames}
                </>
              }
              beforeOpen={() =>
                reportList.forEach((routeSegment) =>
                  post("/api/report", {
                    node1: routeSegment.start._id,
                    node2: routeSegment.end._id,
                  })
                )
              }
              afterClose={() => {
                handleCloseRef.current();
                navigate("/");
              }}
              dismissButtonText="OK"
              dismissButtonClassName="bg-mit-red text-white px-m"
              className="p-s rounded-lg border border-solid border-opacity-25 border-slate-900 text-slate-900 bg-slate-900 bg-opacity-5"
            >
              Report
            </DialogButton>
          }
        >
          Report
        </DialogButton>
      </div>
    </div>
  );
};
