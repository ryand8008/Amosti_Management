import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ReportBuilding } from "./ReportBuilding";


// GET BUILDING NAMES with Object.keys(aggregate), then iterate through
export const Report = ({yr, testing}) => {
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
const { aggregate } = useContext(AggregateContext)

const [buildingNames, setBuildingNames] = useState<string[]>([])

// to print things
const componentToPrint = useRef(null)

// years logic
// shape of data => {[buildingName1]: [year, ....], [buildingName2]: [year, ...], ...}
let years = {};

const [buildyr, setBuildYr] = useState(yr)


useEffect(() => {

  const buildings = Object.keys(aggregate);
  setBuildingNames(buildings)
  setBuildYr(() => yr)

  buildingNames.forEach((building) => {
    if (!years[building]) {
      years[building] = Object.keys(aggregate[building])
    }
  })

}, [ JSON.stringify(buildingNames), aggregate ? JSON.stringify(aggregate) : null, yr])

// DO NOT TOUCH
const handlePrint = useReactToPrint({
  content: () => componentToPrint.current,
});

  return (
    <>
      {/* <StyledReportTitle>Individual Building Report</StyledReportTitle> */}
      {aggregate && buildingNames.length > 0 ? buildingNames.map((building) =>
        <>{aggregate[building][buildyr] ? <><div ref={componentToPrint}>
          <ReportBuilding buildingName={building} yr={buildyr} />
        </div><button onClick={handlePrint}>{`print building: ${building}`}</button></> : null}
        </>
        )
         : null}
    </>
  )
}

const StyledReportTitle = styled.h1`
  display: flex;
  justify-content: center;
  text-decoration: underline;
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