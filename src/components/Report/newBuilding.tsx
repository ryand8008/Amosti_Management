import React from "react";

interface NewBuildingProps {
  buildingName: string;
}

export const NewBuilding = ({buildingName}: NewBuildingProps) => {

  return (
    <>
      <h1>hello from New Building</h1>
      <h2>{`building is: ${buildingName}`}</h2>
    </>
  )
}