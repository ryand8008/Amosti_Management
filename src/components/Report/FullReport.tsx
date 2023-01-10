import { AggregateContext } from "../context/ProjectContext";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ExportFile } from './ExportFile';

// TODO: make sure that generated full report fits print screen
// TODO: Create error messages
  // Examples:
    // -wrong file format
    //


export const FullReport = ({yr}) => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre' ]
  const { aggregate, reportInfo, yearPicked, setYearPicked } = useContext(AggregateContext)
  let stringAgg = JSON.stringify(aggregate)
  const [buildings, setBuildings] = useState<string[]>([])

  const [buildingYear, setBuildingYear] = useState<string>(yr)

  // print
  const componentToPrint = useRef(null)

  useEffect(() => {

    setBuildingYear(yr)
    if (aggregate) {
      let tempBuilding = Object.keys(aggregate)
      let temp = [];

      tempBuilding.forEach((building) => {
        if (aggregate[building][buildingYear]) {
          temp.push(building)
        }
      })
      setBuildings(() => temp)

    }

    if (yr === buildingYear) {
      getTotalAdmon()
      getTotalGastos()
      getTotalDevol()
      getTotalOtros()
      getTotalE()
      getTotalProfit()
      getTotalRev()
      getTotalExpenses()
      getMonthNetTotal()
    }

}, [stringAgg, buildingYear, JSON.stringify(buildings), yr])

  // DO NOT TOUCH
  const handlePrint = useReactToPrint({
    content: () => componentToPrint.current,
  });
  // DO NOT TOUCH

  const getTotalAdmon = () => {
    let total = 0;
    reportInfo[buildingYear]['admon'][12] = 0;
    reportInfo[buildingYear]['admon'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['admon'][12] = total;
  }

  const getTotalGastos = () => {
    let total = 0;
    reportInfo[buildingYear]['gastos'][12] = 0;
    reportInfo[buildingYear]['gastos'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['gastos'][12] = total;
  }

  const getTotalDevol = () => {
    let total = 0;
    reportInfo[buildingYear]['devol'][12] = 0;
    reportInfo[buildingYear]['devol'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['devol'][12] = total;
  }

  const getTotalOtros = () => {
    let total = 0;
    reportInfo[buildingYear]['otros'][12] = 0;
    reportInfo[buildingYear]['otros'].forEach((item) => {
      if (typeof item === 'number') {
        total += item
      }
    })
    reportInfo[buildingYear]['otros'][12] = total;
  }

  const getTotalRev = () => {
    let total = 0;

    if (reportInfo[buildingYear]['totalRev']) {
      reportInfo[buildingYear]['totalRev'] = Array.from({length:13}).fill('-',0,13)
    }

    buildings.forEach((building) => {
      if (aggregate[building][buildingYear]) {

        if (!reportInfo[buildingYear]['totalRev']) {
        reportInfo[buildingYear]['totalRev'] = Array.from({length:13}).fill('-',0,13)
      }
        reportInfo[building][buildingYear]['revenue'].forEach((item, index) => {
          if (item !== '-') {
            if (reportInfo[buildingYear]['totalRev'][index] === '-') {
              reportInfo[buildingYear]['totalRev'][index] = item

            } else {
              reportInfo[buildingYear]['totalRev'][index] += item // changed +=
            }
          }
        })
      }
    })
  }

  const getTotalE = () => {
    let total = 0
    let expensesArray = ['admon', 'gastos', 'devol', 'otros']

    reportInfo[buildingYear]['totalE'] = Array.from({length: 13}).fill('-', 0, 13)

    if (reportInfo[buildingYear]['totalE'][12] !== 0) {
      reportInfo[buildingYear]['totalE'] = Array.from({length: 13}).fill('-', 0, 13)
    }

    expensesArray?.forEach((item) => {

      reportInfo[buildingYear][item].forEach((item2, index) => {
        if (typeof item2 === 'number') {
          if (reportInfo[buildingYear]['totalE'][index] === '-') {
            reportInfo[buildingYear]['totalE'][index] = item2
          } else {
            reportInfo[buildingYear]['totalE'][index] += item2
          }
          if (index === 12) {
            total += item2;
          }
        }
      })
    })
    reportInfo[buildingYear]['totalE'][12] = total;

  }

  const getTotalProfit = () => {

    if (reportInfo[buildingYear]['totalProfit'][12] !== 0) {
      reportInfo[buildingYear]['totalProfit'] = Array.from({length: 13}).fill('-',0,13)
    }
    let annual = 0
    buildings.forEach((building) => {
      reportInfo[building][buildingYear]['revenue'].forEach((item, index) => {
        if (typeof item === 'number') {
          if (reportInfo[buildingYear]['totalProfit'][index] === '-') {
            let tempVal = item - reportInfo[building][buildingYear]['expense'][index]
            reportInfo[buildingYear]['totalProfit'][index] = tempVal
          } else {
            let tempVal = item - reportInfo[building][buildingYear]['expense'][index]
            reportInfo[buildingYear]['totalProfit'][index] += tempVal // changed +=
          }
          if (index === 12) {
            annual += item
          }
        }
      })

    })
    reportInfo[buildingYear]['totalProfit'][12] = annual - reportInfo[buildingYear]['totalE'][12] // save this
  }

  const getTotalExpenses = () => {

    reportInfo[buildingYear]['totalExpenses'] = Array.from({length: 13}).fill('-',0,13)

    let annual = 0;
    buildings.forEach((building, index) => {
      reportInfo[building][buildingYear]['expense'][12] = 0;
      let total = 0;
      reportInfo[building][buildingYear]['expense'].forEach((item, index) => {
        if (item !== '-') {
          if (reportInfo[buildingYear]['totalExpenses'][index] === '-') {
            reportInfo[buildingYear]['totalExpenses'][index] = item
            total += item
          } else {
            reportInfo[buildingYear]['totalExpenses'][index] = item // changed +=
            total += item
          }
          annual += item
        }
      })
      reportInfo[building][buildingYear]['expense'][12] = total
    })
    reportInfo[buildingYear]['totalExpenses'][12] = annual;
  }

  const getMonthNetTotal = () => {
    buildings.forEach((building) => {
      let annual = 0;
      if (!reportInfo[building][buildingYear]['totalNet']) {
        reportInfo[building][buildingYear]['totalNet'] = Array.from({length: 13}).fill('-',0,13)
      } else {
        reportInfo[building][buildingYear]['totalNet'] = Array.from({length: 13}).fill('-',0,13)
      }
      // iterate through revenue and expenses
      reportInfo[building][buildingYear]['revenue'].forEach((item,index) => {
        if (item !== '-' && index !== 12) {
          if (reportInfo[building][buildingYear]['totalNet'][index] === '-') {
          reportInfo[building][buildingYear]['totalNet'][index] = reportInfo[building][buildingYear]['revenue'][index] - reportInfo[building][buildingYear]['expense'][index]

          let tempVal = reportInfo[building][buildingYear]['revenue'][index] - reportInfo[building][buildingYear]['expense'][index]
          annual += tempVal
          }
        }
      })
      reportInfo[building][buildingYear]['totalNet'][12] = annual
    })
  }


  return (
    <>

        {aggregate ? <StyledDiv>
        {buildingYear === '' ? <StyledPrintButton onClick={(e) => {e.preventDefault(), setBuildingYear(yearPicked); }}>generate report </StyledPrintButton> : null}
        </StyledDiv>

         : null}

        <StyledSomething ref={componentToPrint}>
      {buildingYear !== '' && aggregate ?
        <>
        <h1>Reporte Completo: {buildingYear}</h1>

          <StyledTable>

            <StyledHeaderContainer>
              <th>Edificio</th>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
              )}
              <StyleMonthsHeaders>anual</StyleMonthsHeaders>
            </StyledHeaderContainer>

            {buildings.length > 0 ? buildings.map((item) =>
            <>
              <StyledRowUnit>
                <StyledCell>{reportInfo[item][buildingYear] ? item : null}</StyledCell>
                {reportInfo[item][buildingYear] ? reportInfo[item][buildingYear]['revenue'].map((item2) => <>
                  <StyledCell>{item2}</StyledCell>
                </>
                ) : null}
              </StyledRowUnit>
            </>
            ) : null}


            <StyledTotal>
              <StyledBold>Los ingresos totales</StyledBold>
              {reportInfo[buildingYear]['totalRev'] ? reportInfo[buildingYear]['totalRev'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledTotal>

            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            {buildings.length % 2 === 0 ? <tr><td> </td> </tr> : null}

              {buildings.map((building) =>
               <StyledRowEx>
                   <StyledCell>{building}</StyledCell>
                   {reportInfo[building][buildingYear]['expense'].map((item) =>
                    <StyledCell>{item}</StyledCell>
                   )}
                </StyledRowEx>
              )}

            <StyledTotal>
            <StyledBold>Gastos totales</StyledBold>
              {reportInfo[buildingYear]['totalExpenses'] ? reportInfo[buildingYear]['totalExpenses'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledTotal>

            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            {buildings.length % 2 !== 0 ? <tr><td> </td> </tr> : null}

            {buildings.map((building) =>
               <StyledRowNet>
                   <StyledCell>{building}</StyledCell>
                   {reportInfo[building][buildingYear]['totalNet'] ? reportInfo[building][buildingYear]['totalNet'].map((item) =>
                    <StyledCell>{item}</StyledCell>
                   ) : null}
                </StyledRowNet>
              )}

            <StyledTotal>
            <StyledBold>Neto total</StyledBold>
              {reportInfo[buildingYear]['totalProfit'] ? reportInfo[buildingYear]['totalProfit'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledTotal>

          </StyledTable></>
        : null}
        </StyledSomething>


         <StyledDiv>
          {buildingYear !== '' ? <StyledPrintButton onClick={handlePrint}>{`print report`}</StyledPrintButton> : null}

         </StyledDiv>
              <ExportFile report={reportInfo} year={buildingYear}/>
    </>
  )
}

const StyledCell = styled.td`
  text-align: center;
  width: fit-content;
`

const StyledTotal = styled.tr`
  background: lightyellow;
  border-top: 1px solid black;
`

const StyledRowEx = styled.tr`
`
const StyledRowUnit = styled.tr`
`
const StyledRowNet = styled.tr`
`
const StyledTable = styled.table`
  border: 1px solid black;
  border-radius: 5px
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
  margin-right: 30px;
  ${StyledRowUnit}:nth-child(odd) {
    background: lightgrey;
  }
  ${StyledRowEx}:nth-child(odd) {
    background: lightgrey;
  }
  ${StyledRowNet}:nth-child(even) {
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
const StyledBold = styled(StyledCell)`
  font-weight: bold;
  text-decoration: underline;
  width: fit-content;
`

const StyledTitle = styled.h1`
  text-align: center;
`

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: auto;
  margin-bottom: 25px;
`

const StyledSomething = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

const StyledPrintButton = styled.button`
  display: flex;
  justify-content: center;
  height: 50px;
  width: fit-content;
  border-radius: 10px;
  margin: auto;
  margin-top: 50px;
  align-items: center;
  padding: 5px;

`