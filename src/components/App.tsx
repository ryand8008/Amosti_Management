import React from "react";
import AggregateProvider from "./context/ProjectContext";
import { Header } from "./Header";
import { Upload } from "./Upload";

export const App = () => {

  return (
    <>
      <Header />
      <AggregateProvider>
        <Upload />
      </AggregateProvider>
    </>
  )
}




