import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

// it requires:
// total for each month (not netprofit)
  // make annual
// total expenses
  // make annual
// sum them all up

export const FullReport = () => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
  const { aggregate } = useContext(AggregateContext)
  const [buildings, setBuildings] = useState<string[]>([])

  useEffect(() => {
    if (aggregate) {
      let tempBuilding = Object.keys(aggregate)
      setBuildings(tempBuilding)
    }
    console.log(buildings, 'this is buildings')
  }, [aggregate, JSON.stringify(buildings)])

  return (
    <>
      <h1>Full Report</h1>

      <StyledTable>
        <StyledHeaderContainer>
        <th>Depto</th>
        { hardCodeMonths.map((item) =>
        <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
        )}
        <StyleMonthsHeaders>annual</StyleMonthsHeaders>

        </StyledHeaderContainer>
          {buildings.length > 0 ? buildings.map((item) =>
        <StyledRowUnit>
          <StyledCell>{item}</StyledCell>
        </StyledRowUnit>
          ): null}
      </StyledTable>
    </>
  )
}

const StyledCell = styled.td`
  text-align: center;
`
const StyledRowE = styled.tr`
`
const StyledRowUnit = styled.tr`
`
const StyledTable = styled.table`
  border: 1px solid black;
  border-radius: 5px
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  // ${StyledRowE}:nth-child(even) {
  //   background: lightgrey;
  // }
  // ${StyledRowUnit}:nth-child(even) {
  //   background: lightgrey;
  // }
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