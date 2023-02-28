import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Building } from "./buildingClass";

interface NewReportProps {
  buildings: string[];
  aggregate: any
}

export const NewFullReport = ({aggregate, buildings}: NewReportProps) => {

  const [reportingYear, setReportingYear] = useState(null)

  const years = useMemo(() => {
    if (aggregate) {
      const yearsSet = {};
      buildings.forEach(building => {
        const years = Object.keys(aggregate[building]);
        years.forEach(year => {
          yearsSet[year] = true;
        });
      });
      return Object.keys(yearsSet);
    }
    return [];
  }, [aggregate]);


  useEffect(() => {

  }, [reportingYear])

  return (
    <>
      <StyledH1>Hello from New FullReport</StyledH1>
      <StyledContainer>
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReportingYear(() => e.target.value)}>
        {!reportingYear ? <option value='default'>select a year</option> : null}
          {years.map((year) => <option value={year}> {year}</option>)}
        </select>
        {/* FOR TESTS PURPOSES | DELETE ME LATER */}
        {reportingYear ? <div>TESTING {reportingYear}</div> : null}
      </StyledContainer>
    </>
  )
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`

const StyledH1 = styled.div`
  margin: auto
`