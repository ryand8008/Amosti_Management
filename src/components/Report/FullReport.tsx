import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactToPrint, { useReactToPrint } from "react-to-print";

// it requires:
// total for each month (not netprofit)
  // make annual
// total expenses
  // make annual
// sum them all up

export const FullReport = () => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
  const { aggregate, reportInfo, yearsAvailable, yearPicked, setYearPicked } = useContext(AggregateContext)
  const [buildings, setBuildings] = useState<string[]>([])
  const [buildingYear, setBuildingYear] = useState<string>('')

  // print
  const componentToPrint = useRef(null)

  useEffect(() => {
    if (aggregate) {
      let tempBuilding = Object.keys(aggregate)
      setBuildings(tempBuilding)
      if (yearPicked) {
        setBuildingYear(yearPicked)
      }
    }
    if (reportInfo[buildingYear]) {
      getTotalAdmon()
      getTotalGastos()
      getTotalDevol()
      getTotalOtros()
      getTotalE()
    }
    console.log(aggregate, 'agg')
    console.log(buildingYear, 'building year')
  }, [aggregate, buildings.length, buildingYear, reportInfo, yearPicked])

  const handlePrint = useReactToPrint({
    content: () => componentToPrint.current,
  });

  const getTotalAdmon = () => {
    let total = 0;
    reportInfo[buildingYear]['admon'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['admon'][12] = total;
  }

  const getTotalGastos = () => {
    let total = 0;
    reportInfo[buildingYear]['gastos'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['gastos'][12] = total;
  }

  const getTotalDevol = () => {
    let total = 0;
    reportInfo[buildingYear]['devol'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['devol'][12] = total;
  }

  const getTotalOtros = () => {
    let total = 0;
    reportInfo[buildingYear]['otros'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['otros'][12] = total;
  }

  const getTotalE = () => {
    let total = 0
    let expensesArray = ['admon', 'gastos', 'devol', 'otros']
    reportInfo[buildingYear]['totalE'] = Array.from({length: 13}).fill('-', 0, 13)

    expensesArray.forEach((item) => {
      reportInfo[buildingYear][item].forEach((item2, index) => {
        if (typeof item2 === 'number') {
          if (reportInfo[buildingYear]['totalE'][index] === '-') {
            reportInfo[buildingYear]['totalE'][index] = 0;
            reportInfo[buildingYear]['totalE'][index] += item2
            total += item2
          } else {
            reportInfo[buildingYear]['totalE'][index] += item2
            total += item2
          }
        }
      })
    })
    reportInfo[buildingYear]['totalE'][12] = total;

  }

  return (
    <>
      <h1>Full Report</h1>
      <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {e.preventDefault(), setYearPicked(e.target.value)}}>
        <option>select a year</option>
        {yearsAvailable.map((item) =>
          <option>{item}</option>
        )}
        </select>
    <div ref={componentToPrint}>
      { buildingYear !== '' ?
       <StyledTable>
        <StyledHeaderContainer>
        <th>Depto</th>
        { hardCodeMonths.map((item) =>
        <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
        )}
        <StyleMonthsHeaders>annual</StyleMonthsHeaders>

        </StyledHeaderContainer>

          {buildings.length > 0 ? buildings.map((item) =>
        <><StyledRowUnit>
              <StyledCell>{reportInfo[item][buildingYear] ? item : null}</StyledCell>
              {reportInfo[item][buildingYear]['profit'] ? reportInfo[item][buildingYear]['profit'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledRowUnit>
            </>
            ): null}

            <StyledRowUnit></StyledRowUnit>
            <StyledRowUnit>egresos</StyledRowUnit>

            <StyledRowUnit>
            <StyledCell>admon</StyledCell>
            {reportInfo[buildingYear]['admon'] ? reportInfo[buildingYear]['admon'].map((item2) => <>
            <StyledCell>{item2}</StyledCell>
          </>
            ) : null}
            </StyledRowUnit>

            <StyledRowUnit>
            <StyledCell>gastos</StyledCell>
            {reportInfo[buildingYear]['gastos'] ? reportInfo[buildingYear]['gastos'].map((item2) => <>
            <StyledCell>{item2}</StyledCell>
          </>
            ) : null}
            </StyledRowUnit>

            <StyledRowUnit>
            <StyledCell>devol</StyledCell>
            {reportInfo[buildingYear]['devol'] ? reportInfo[buildingYear]['devol'].map((item2) => <>
            <StyledCell>{item2}</StyledCell>
          </>
            ) : null}
            </StyledRowUnit>

            <StyledRowUnit>
            <StyledCell>otros</StyledCell>
            {reportInfo[buildingYear]['otros'] ? reportInfo[buildingYear]['otros'].map((item2) => <>
            <StyledCell>{item2}</StyledCell>
          </>
            ) : null}
            </StyledRowUnit>

            <StyledRowUnit>
            <StyledCell>Total E</StyledCell>
            {reportInfo[buildingYear]['totalE'] ? reportInfo[buildingYear]['totalE'].map((item2) => <>
            <StyledCell>{item2}</StyledCell>
          </>
            ) : null}
            </StyledRowUnit>








      </StyledTable>
       : null}
       </div>
       <button onClick={handlePrint}>{`print report`}</button>
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
  margin: 10px;
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