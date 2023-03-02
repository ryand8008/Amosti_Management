import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Building } from "./buildingClass";

interface NewReportProps {
  buildings: string[];
  aggregate: any
}

const XLSX = require("xlsx");

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
    const totalArr = new Array(13).fill('-')
    const dataObj = {total: [...totalArr]}

    buildings.forEach((building) => {
      const testBuilding = new Building(building, year)
      if (testBuilding.isValid(aggregate)) {

        const rentInfo = testBuilding.getTotalRent(aggregate)
        const newRentInfo = rentInfo[building][year]['units']['total']

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
  const dataRows = Object.entries(totalObj).map(([key, value]) => ([{ v: key }, ...(value as unknown[]).map(v => ({ v }))]));

  // Find the row index for 'total'
  const totalRowIndex = dataRows.findIndex(row => row[0].v === 'total');
  // Remove the 'total' row from its current position
  const totalRow = dataRows.splice(totalRowIndex, 1)[0];
  // Add the 'total' row to the end of the dataRows array
  dataRows.push(totalRow);
  // Move the 'total' value to the first column of the row
  totalRow[0] = { v: 'total' };
  totalRow.push({ v: '' }); // add an empty cell at the ends




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
              <StyleMonthsHeaders>Edificio</StyleMonthsHeaders>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>)}
              <StyleMonthsHeaders>annual</StyleMonthsHeaders>
            </StyledHeaderContainer>
            {totalObj ? Object.keys(totalObj).map((item, index) => {
              if (item === 'total') return null; // skip rendering the 'total' row here
              return (
                <StyledRowUnit key={item}>
                  <StyledCellText>{item}</StyledCellText>
                  {totalObj[item].map((item) => {
                    if (!isNaN(item)) {
                      return <StyledCellNum>{item}</StyledCellNum>
                    } else {
                      return <StyledCellHyphen>{item}</StyledCellHyphen>
                    }
                  }
                  )}
                </StyledRowUnit>
              );
            }) : null}
            {totalObj && totalObj.total ? (
              <StyledRowUnitTotal key={"total"}>
                <StyledCellText>total</StyledCellText>
                {totalObj.total.map((item) => {
                  if (!isNaN(item)) {
                    return <StyledCellNum>{item}</StyledCellNum>
                  } else {
                    return <StyledCellHyphen>{item}</StyledCellHyphen>
                  }
                }
                )}
              </StyledRowUnitTotal>
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
const StyledRowUnit = styled.tr`

`
const StyledRowUnitTotal = styled.tr`
  background-color: #4f5e50;
  color: #cde6d5;
  `;

  const StyledCellText = styled.td`
  text-align: left;
  padding: 16px 16px 10px 16px;
  @media only screen and (max-width: 1000px) {
    padding: 8px 8px 5px 8px;
  }
`
const StyledCellNum = styled.td`
  text-align: right;
  padding: 16px;
  @media only screen and (max-width: 1000px) {
    padding: 8px;
  }
`
const StyledCellHyphen = styled.td`
  text-align: center;
  padding: 16px;
  @media only screen and (max-width: 1000px) {
    padding: 8px;
  }`

const StyleMonthsHeaders = styled.th`
  border-bottom: 1px solid black;
  text-align: left;
  width: 125px;
  padding: 16px;
  background: #2b382c;
  color: #cde6d5;
  resize: horizontal; /* Allows the header cell to be resized horizontally */
  overflow: auto; /* Ensures that content is not hidden when the cell is resized */
  @media only screen and (max-width: 1000px) {
    padding: 8px;
  }
`
const StyledHeaderContainer = styled.tr`
  border: 1px solid black;
  border-radius: 10px;
  `

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
  margin-right: 30px;
  ${StyledRowUnit}:nth-child(odd) {
    background: lightgrey;
  }

  th {
    position: relative;
    padding-right: 10px;
  }

  th::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    background-color: transparent;
    z-index: 1;
  }

  th:hover::after {
    background-color: rgba(0, 0, 0, 0.1);
  }

  th::-webkit-resizer {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    z-index: 2;
    background-color: transparent;
  }
  @media only screen and (max-width: 1000px) {
    /* adjust styles for screens with a width of 600px or less */
    flex-direction: column;
    width: auto;
    height: auto;
    padding: 10px;
  }
`;