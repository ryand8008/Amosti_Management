import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ReportBuilding } from "./ReportBuilding";

// GET BUILDING NAMES with Object.keys(aggregate), then iterate through
export const Report = () => {
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
const { aggregate } = useContext(AggregateContext)

// building name
const [buildingNames, setBuildingNames] = useState<string[]>([])
const [showReport, setShowReport] = useState<boolean>(false)

useEffect(() => {
  console.log(aggregate, 'dis agg')
  const buildings = Object.keys(aggregate);

  setBuildingNames(buildings)


}, [aggregate ? Object.keys(aggregate).length : null, buildingNames.length > 0])


  return (
    <>
      <StyledReportTitle>Report</StyledReportTitle>
      {buildingNames.length > 0 ? buildingNames.map((building) =>
        <ReportBuilding buildingName={building}/>)
         : null}
    </>
  )
}

const StyledReportTitle = styled.h1`
  display: flex;
  justify-content: center;
`
const StyledTable = styled.table`
  border: 1px solid red;
  margin: auto;
`
const StyleMonthsHeaders = styled.th`
  border: 1px solid black;
  text-align: center;
  width: 80px;
  padding: 5px;
`
const StyledHeaderContainer = styled.tr`
  border: 1px solid black;
`


// notes
  // all little convulted but it is the final total for this buildingname, year, and month
  // let final = Object.values(aggregate['Tinoco'][2022]['October']['costs'])[aggregate['Tinoco'][2022]['October']['costs'].length-1]
  // console.log(final, 'this final')
  // console.log(Object.values(final)[Object.values(final).length-1], 'values')