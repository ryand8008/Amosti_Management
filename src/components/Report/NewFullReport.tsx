import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Building } from "./buildingClass";

interface NewReportProps {
  buildings: string[];
  aggregate: any
}

export const NewFullReport = ({aggregate, buildings}: NewReportProps) => {

  const [reportingYear, setReportingYear] = useState<string | null>(null);
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre' ]
  const [totalObj, setTotalObj] = useState(null)
  useEffect(() => {
    if (reportingYear) {
      console.log(generateFull(reportingYear), 'what dis look like?')
       setTotalObj((prev) => generateFull(reportingYear))
    }

  }, [reportingYear])

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


  // MERGE
  const mergeTotals = (oldArr, newArr) => {
    if (oldArr.length !== newArr.length) {
      console.log('Error: merging arrays do not have the correct lengths in NewFullReport component. They must equal 13')
    }
    return oldArr.map((value, index) => {
      const value2 = newArr[index];
      if (value === '-' && value2 === '-') {
        return '-';
      } else if (value === '-') {
        return value2;
      } else if (value2 === '-') {
        return value;
      } else {
        return value + value2;
      }
    });
  }



  // merge and create a full report depending on the 'reportedYear'
  // {
  //   buildingName: {
  //     enero: [],
  //     febrero: [],
  //      ...
  //   }
  // }
  const generateFull = (year) => {
    let totalArr = new Array(13).fill('-')
    let dataObj = {total: [...totalArr]}

    buildings.forEach((building) => {
      let testBuilding = new Building(building, year)
      if (testBuilding.isValid(aggregate)) {

        let rentInfo = testBuilding.getTotalRent(aggregate)
        let newRentInfo = rentInfo[building][year]['units']['total']

        dataObj[building] = newRentInfo;
        dataObj['total'] = mergeTotals(dataObj['total'], newRentInfo);

      }
    })

    return dataObj
  }



  return (
    <>
      <StyledH1>Hello from New FullReport</StyledH1>
      <StyledContainer>
      <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReportingYear(e.target.value)}>
        {reportingYear && (
          <option value={reportingYear}>{reportingYear}</option>
        )}
        {years.length > 0 ? years
          .filter((year) => year !== reportingYear)
          .map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          )):null}
      </select>

        {/* FOR TESTS PURPOSES | DELETE ME LATER */}
        {reportingYear ? <div>TESTING {reportingYear}</div> : null}
      </StyledContainer>

      {
        <>
          <StyledTable>
            <StyledHeaderContainer>
              <th>Edificio</th>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>)}
              <StyleMonthsHeaders>annual</StyleMonthsHeaders>
            </StyledHeaderContainer>
            {totalObj ? Object.keys(totalObj).map((item) => {
              if (item === 'total') return null; // skip rendering the 'total' row here
              return (
                <StyledRowUnit key={item}>
                  <StyledCell>{item}</StyledCell>
                  {totalObj[item].map((item) =>
                    <StyledCell>{item}</StyledCell>
                  )}
                </StyledRowUnit>
              );
            }) : null}
            {totalObj && totalObj.total ? (
              <StyledRowUnit key="total">
                <StyledCell>total</StyledCell>
                {totalObj.total.map((item) =>
                  <StyledCell>{item}</StyledCell>
                )}
              </StyledRowUnit>
            ) : null}

          </StyledTable>
        </>
      }
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

const StyledTitle = styled.h2`
  display: flex;
  justify-content: center;
`

const StyledYearArrows = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const StyledRowE = styled.tr`

`
const StyledRowUnit = styled.tr`
`;
const StyledCell = styled.td`
  text-align: center;
`

const StyledTable = styled.table`
  border: thin solid black;
  border-radius: 5px
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
  margin-right: 30px;
  ${StyledRowE}:nth-child(even) {
    background: lightgrey;
  }
  ${StyledRowUnit}:nth-child(even) {
    background: lightgrey;
  }
`
const StyleMonthsHeaders = styled.th`
  border: 1px solid black;
  text-align: center;
  width: 80px;
  padding: 5px;
  background: #82b0f5;
`
const StyledHeaderContainer = styled.tr`
  border: 1px solid black;
  `