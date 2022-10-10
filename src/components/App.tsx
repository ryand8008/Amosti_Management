import React from "react";
import AggregateProvider from "./context/ProjectContext";
import { Report } from "./Report.tsx/Report";
import { Upload } from "./Upload";

export const App = () => {

  return (
    <>
      <AggregateProvider>

        <Upload />
        <Report />
      </AggregateProvider>
    </>
  )
}

// shape of things to come
const report = {
  'buildingName': {
    'enero':
    {
      'unitInfo': [],
      'costs': [],
    },

    'febrero':
    {
      'unitInfo': [],
      'costs': []
    }
  },

}

