import React from "react";

interface NewBuildingProps {
  buildingName: string;
  aggregate: any
}

export const NewBuilding = ({aggregate, buildingName}: NewBuildingProps) => {
  console.log(aggregate, 'this is agg')
  return (
    <>
      <h1>hello from New Building</h1>
      <h2>{`building is: ${buildingName}`}</h2>
    </>
  )
}