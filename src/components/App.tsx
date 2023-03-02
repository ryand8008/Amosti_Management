import React, { lazy, Suspense } from "react";
import AggregateProvider from "./context/ProjectContext";
import { Header } from "./Header";
import { Upload } from "./Upload";

const Report = lazy(() => import("./Report/Report"));

export const App = () => {
  return (
    <>
      <Header />
      <AggregateProvider>
        <Upload />
        {/* <Suspense fallback={<div>Loading Report...</div>}>
          <Report />
        </Suspense> */}
      </AggregateProvider>
    </>
  );
};
