import React from "react";
import AggregateProvider from "./context/ProjectContext";
import { Header } from "./Header";
import { Upload } from "./Upload";
import { NewReport } from "./Report/newReport";

export const App = () => {

  return (
    <>
      <Header />
      <AggregateProvider>
        <Upload />
        <NewReport />
      </AggregateProvider>
    </>
  )
}




