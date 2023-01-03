import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ReportBuilding } from "./ReportBuilding";


// GET BUILDING NAMES with Object.keys(aggregate), then iterate through
export const Report = ({yr}) => {
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
const { aggregate, yearPicked } = useContext(AggregateContext)
// building name
const [buildingNames, setBuildingNames] = useState<string[]>([])
const [showReport, setShowReport] = useState<boolean>(false)

// to print things
const componentToPrint = useRef(null)

// years logic
// shape of data => {[buildingName1]: [year, ....], [buildingName2]: [year, ...], ...}
let years = {};


useEffect(() => {

  const buildings = Object.keys(aggregate);
  setBuildingNames(buildings)

  // find the years!
  console.log(yr, 'yr, does it change?')
  buildingNames.forEach((building) => {
    if (!years[building]) {
      years[building] = Object.keys(aggregate[building])
    }
  })

  console.log(years, 'this is years, should be an object {}')
  // years = Object.keys(aggregate[buildings])

}, [ JSON.stringify(buildingNames), aggregate ? JSON.stringify(aggregate) : null, yr])

// DO NOT TOUCH
const handlePrint = useReactToPrint({
  content: () => componentToPrint.current,
});

  return (
    <>
      <StyledReportTitle>Individual Building Report</StyledReportTitle>
      {aggregate && buildingNames.length > 0 ? buildingNames.map((building) =>
        <>{aggregate[building][yr] ? <><div ref={componentToPrint}>
          <ReportBuilding buildingName={building} yr={yr} />
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


// notes
  // all little convulted but it is the final total for this buildingname, year, and month
  // let final = Object.values(aggregate['Tinoco'][2022]['October']['costs'])[aggregate['Tinoco'][2022]['October']['costs'].length-1]
  // console.log(final, 'this final')
  // console.log(Object.values(final)[Object.values(final).length-1], 'values')