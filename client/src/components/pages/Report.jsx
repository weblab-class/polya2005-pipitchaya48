import React from "react";

import "../../utilities.css";
import { BaseMap } from "../modules/BaseMap";
import { Button } from "@mui/base";
import { ReportMapUpdater } from "../modules/ReportMapUpdater";

export const Report = () => {
  return (
    <div className="flex flex-col flex-auto items-center py-12 px-m w-full h-full gap-l">
      <h1 className="text-2xl text-center w-full">Report closed routes</h1>
      <div className="p-m flex flex-col flex-auto items-center gap-m w-full h-full bg-silver-gray rounded-lg">
        <h2 className="self-start">Select Route</h2>
        <BaseMap className="border border-black rounded">
          <ReportMapUpdater />
        </BaseMap>
        <Button className="u-mainButton bg-bright-red text-white w-full">Report</Button>
      </div>
    </div>
  );
};
