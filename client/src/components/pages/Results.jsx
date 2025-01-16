import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const Results = () => {
  const [searchParams] = useSearchParams();
  return (
    <div>
      Results for {searchParams.get("from")} to {searchParams.get("to")}
    </div>
  );
};
