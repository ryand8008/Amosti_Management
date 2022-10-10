import React from "react";
import styled from "styled-components";

export const Report = () => {
const months = [' ', 'enero', 'febrero', 'marzo', 'abril', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]

  return (
    <>
      <h1>Hello from Report!</h1>
      <StyledTable>
        <StyledHeaderContainer>
          { months.map((item) =>
          <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
          )}
        </StyledHeaderContainer>
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