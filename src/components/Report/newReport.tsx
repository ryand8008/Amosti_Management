import React, { useContext } from "react";
import { AggregateContext } from "components/context/ProjectContext";
import { NewBuilding } from "./newBuilding";

export const NewReport = () => {
  const { aggregate } = useContext(AggregateContext)
  const buildings = Object.keys(aggregate)


  return (
    <>
      <h1>It's me, from NewReport</h1>
      {buildings.map((building) =>
        <NewBuilding buildingName={building} />
      )}
    </>
  )
}