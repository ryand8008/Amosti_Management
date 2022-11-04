import React, { useContext, useState } from "react";
import AggregateProvider, { AggregateContext } from "./context/ProjectContext";
import { Header } from "./Header";
import { FullReport } from "./Report/FullReport";
import { Report } from "./Report/Report";
import { Upload } from "./Upload";

export const App = () => {
  const [showReport, setShowReport] = useState<Boolean>(false)

  return (
    <>
      <Header />
      <AggregateProvider>
        {/* {showReport ? <Report /> : null } */}
        {/* {<button onClick={() =>setShowReport(!showReport)}>show report</button> } */}
        <FullReport />
        <Upload />
      </AggregateProvider>
    </>
  )
}




