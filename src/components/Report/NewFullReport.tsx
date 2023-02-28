import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Building } from "./buildingClass";

interface NewReportProps {
  buildings: string[];
  aggregate: any
}

var XLSX = require("xlsx");

export const NewFullReport = ({aggregate, buildings}: NewReportProps) => {

  const [reportingYear, setReportingYear] = useState<string | null>(null);
  const hardCodeMonths: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre' ]

  const [totalObj, setTotalObj] = useState(null)

  useEffect(() => {
      setTotalObj((prev) => generateFull(reportingYear))
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
  const generateFull = (year: string) => {
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

  // EXPORT FILE
  const exportToExcel = (e) => {
    const sheetHeaders = ['Edificio', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', 'anual'];

  const headers = sheetHeaders.map(h => ({ v: h }));
  // const dataRows = Object.entries(totalObj).map(([key, value]) => ([{ v: key }, ...(value as unknown[]).map(v => ({ v }))]));
  let dataRows = Object.entries(totalObj).map(([key, value]) => ([{ v: key }, ...(value as unknown[]).map(v => ({ v }))]));

  // Find the row index for 'total'
  const totalRowIndex = dataRows.findIndex(row => row[0].v === 'total');
  // Remove the 'total' row from its current position
  const totalRow = dataRows.splice(totalRowIndex, 1)[0];
  // Add the 'total' row to the end of the dataRows array
  dataRows.push(totalRow);
  // Move the 'total' value to the first column of the row
  totalRow[0] = { v: 'total' };
  totalRow.push({ v: '' }); // add an empty cell at the end




  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Full_Report_${reportingYear}.xlsx`);
  }


  return (
    <>
      <StyledContainer>
        <span>Select a year</span>
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
      </StyledContainer>

      {
        <>
        <StyledContainer>
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
          </StyledContainer>
          <StyledContainer>
            {totalObj ?
              <button onClick={(e) => exportToExcel(e)}>
                <img src={'https://img.icons8.com/ios/32/export.png'}/>
              </button>
            : null}
          </StyledContainer>
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