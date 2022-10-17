import React, { useState } from "react";
import AggregateProvider from "./context/ProjectContext";
import { Report } from "./Report.tsx/Report";
import { Upload } from "./Upload";

export const App = () => {
  const [showReport, setShowReport] = useState<Boolean>(false)
  return (
    <>
      <AggregateProvider>

        {showReport ? <Report /> : null }
        <button onClick={() =>setShowReport(!showReport)}>show report</button>
        <Upload />
      </AggregateProvider>
    </>
  )
}

// shape of things to come


