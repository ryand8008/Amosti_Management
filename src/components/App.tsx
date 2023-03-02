import React, { lazy, Suspense } from "react";
import { Header } from "./Header";
import { Upload } from "./Upload";

const Report = lazy(() => import("./Report/Report"));

export const App = () => {
  return (
    <>
      <Header />
      <Upload />
    </>
  );
};
