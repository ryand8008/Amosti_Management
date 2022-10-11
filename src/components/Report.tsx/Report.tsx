import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect } from "react";
import styled from "styled-components";

export const Report = () => {
const months = [' ', 'enero', 'febrero', 'marzo', 'abril', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
const { aggregate } = useContext(AggregateContext)
// console.log(aggregate,' dis aggre'

useEffect(() => {
  console.log(aggregate, 'dis agg')
  // all little convulted but it is the final total for this buildingname, year, and month
  let final = Object.values(aggregate['Tinoco'][2022]['October']['costs'])[aggregate['Tinoco'][2022]['October']['costs'].length-1]
  console.log(final, 'this final')
  console.log(Object.values(final)[Object.values(final).length-1], 'values')
}, [aggregate])
  return (
    <>
      <h1>Hello from Report!</h1>
      <StyledTable>
        <StyledHeaderContainer>
          { months.map((item) =>
          <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
          )}
        </StyledHeaderContainer>
        <tr>{} </tr>
      </StyledTable>
    </>
  )
}

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