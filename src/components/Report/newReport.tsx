import React, { useContext, useEffect, useMemo } from "react";
import { AggregateContext } from "../context/ProjectContext";
import { NewBuilding } from "./newBuilding";

export const NewReport = () => {
  const { aggregate } = useContext(AggregateContext)

  const buildings = useMemo(() => {
    if (aggregate) {
      return Object.keys(aggregate)
    }
    return []
  }, [aggregate])

  useEffect(() => {
    console.log(buildings, 'useeffect buildings')
  }, [buildings])

  return (
    <>
      <h1>It's me, from NewReport</h1>
      {buildings.map((building) =>
        <NewBuilding aggregate={aggregate} buildingName={building} />
      )}
    </>
  )
}
