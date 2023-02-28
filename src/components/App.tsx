import React from "react";
import AggregateProvider from "./context/ProjectContext";
import { Header } from "./Header";
import { Upload } from "./Upload";
import { Report } from "./Report/Report";

export const App = () => {

  return (
    <>
      <Header />
      <AggregateProvider>
        <Upload />
        <Report />
      </AggregateProvider>
    </>
  )
}




