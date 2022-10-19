import React, { useContext, useState } from "react";
import AggregateProvider, { AggregateContext } from "./context/ProjectContext";
import { Report } from "./Report/Report";
import { Upload } from "./Upload";

export const App = () => {
  const [showReport, setShowReport] = useState<Boolean>(false)
  // const { aggregate } = useContext(AggregateContext)
  // console.log(aggregate, 'app')
  return (
    <>
      <AggregateProvider>
        {showReport ? <Report /> : null }
        {<button onClick={() =>setShowReport(!showReport)}>show report</button> }
        <Upload />
      </AggregateProvider>
    </>
  )
}

// shape of things to come


