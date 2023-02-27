import React, { useEffect, useMemo, useState } from "react";
import { Building } from "./buildingClass";

interface NewBuildingProps {
  buildingName: string;
  aggregate: any
}

export const NewBuilding = ({aggregate, buildingName}: NewBuildingProps) => {

  const years = useMemo(() => {
    if (aggregate) {
      return Object.keys(aggregate[buildingName]).sort()
    }
    return []
  }, [aggregate])

  const [selectedYear, setSelectedYear] = useState(years[0])

  const information = new Building(buildingName, selectedYear)

  useEffect(() => {
    // const information = new Building(buildingName, selectedYear)
  }, [selectedYear])

  console.log(information.getTotalRent(aggregate), `this is information for ${buildingName}`)

  const handleClickYear = (e, num) => {
    e.preventDefault()

    let position = years.indexOf(selectedYear) + num
    setSelectedYear((selectedYear) => years[position])
  }

  return (
    <>
      <h1>hello from New Building</h1>
      <h2>{`building is: ${buildingName}`}</h2>
      {
      <>
        { years.indexOf(selectedYear) > 0 ? <button onClick={(e) => handleClickYear(e, -1) }>-</button> : null}
          <span>YEAR</span>
          { years.indexOf(selectedYear) < years.length - 1 ? <button onClick={(e) => handleClickYear(e, 1) }>+</button> : null}
      </>
      }
    </>
  )
}