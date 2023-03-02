import React, { lazy, Suspense } from "react";
import { Header } from "./Header";
import { Upload } from "./Upload";

export const App = () => {
  return (
    <>
      <Header />
      <Upload />
    </>
  );
};
