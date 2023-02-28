import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Building } from "./buildingClass";

interface NewReportProps {
  buildings: string[];
  aggregate: any
}

export const NewFullReport = ({aggregate, buildings}: NewReportProps) => {

  const [reportingYear, setReportingYear] = useState<string | null>(null);

const years = useMemo(() => {
  if (aggregate) {
    const yearsSet: Record<string, boolean> = {};
    buildings.forEach(building => {
      const years = Object.keys(aggregate[building]);
      years.forEach(year => {
        yearsSet[year] = true;
      });
    });
    const uniqueYears = Object.keys(yearsSet);
    const maxYear = uniqueYears.reduce((max, year) => Math.max(max, parseInt(year, 10)), -Infinity);
    setReportingYear(maxYear.toString());
    return uniqueYears;
  }
  return [];
}, [aggregate, buildings]);



  useEffect(() => {

  }, [reportingYear])

  return (
    <>
      <StyledH1>Hello from New FullReport</StyledH1>
      <StyledContainer>
      <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReportingYear(e.target.value)}>
        {reportingYear && (
          <option value={reportingYear}>{reportingYear}</option>
        )}
        {years
          .filter((year) => year !== reportingYear)
          .map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
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