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

  // drop down, should remove when picking a year
  const [dropDown, setDropDown] = useState<boolean>(false)
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
      getTotalProfit()
      getTotalRev()
      getTotalExpenses()
      getMonthNetTotal()
    }
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

  const getTotalRev = () => {
    let total = 0;
    if (!reportInfo[buildingYear]['totalRev']) {
      reportInfo[buildingYear]['totalRev'] = Array.from({length:13}).fill('-',0,13)
    }
    buildings.forEach((building) => {
      reportInfo[building][buildingYear]['revenue'].forEach((item, index) => {
        if (item !== '-') {
          if (reportInfo[buildingYear]['totalRev'][index] === '-') {
            reportInfo[buildingYear]['totalRev'][index] = item

          } else {
            reportInfo[buildingYear]['totalRev'][index] += item
          }
        }
      })
    })
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

  const getTotalProfit = () => {
    buildings.forEach((building) => {
      let annual = 0
      let total = 0
      reportInfo[building][buildingYear]['revenue'].forEach((item, index) => {
        if (typeof item === 'number') {
          if (reportInfo[buildingYear]['totalProfit'][index] === '-') {
            let tempVal = item - reportInfo[building][buildingYear]['expense'][index]
            reportInfo[buildingYear]['totalProfit'][index] = tempVal
          } else {
            let tempVal = item - reportInfo[building][buildingYear]['expense'][index]
            reportInfo[buildingYear]['totalProfit'][index] += tempVal
          }
          if (index === 12) {
            annual += item
          } else {
            total += item
           }
        }
      })
      reportInfo[buildingYear]['totalProfit'][12] = annual - reportInfo[buildingYear]['totalE'][12]
    })
  }

  const getTotalExpenses = () => {
    if (!reportInfo[buildingYear]['totalExpenses']) {
      reportInfo[buildingYear]['totalExpenses'] = Array.from({length: 13}).fill('-',0,13)
    }
    let annual = 0;
    buildings.forEach((building) => {
      let total = 0;
      reportInfo[building][buildingYear]['expense'].forEach((item, index) => {
        if (item !== '-') {
          if (reportInfo[buildingYear]['totalExpenses'][index] === '-') {
            reportInfo[buildingYear]['totalExpenses'][index] = item
            total += item
          } else {
            reportInfo[buildingYear]['totalExpenses'][index] += item
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
      {/* {aggregate && dropDown ? <StyledDiv>
        <div>generate a report </div>
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { e.preventDefault(), setYearPicked(e.target.value), setDropDown(false) } }>
          <option>select a year</option>
          {yearsAvailable.map((item) => <option>{item}</option>
          )}
        </select>
        </StyledDiv> : null} */}

        {aggregate ? <StyledDiv>
        {buildingYear === '' ? <StyledPrintButton onClick={(e) => {e.preventDefault(), setYearPicked('2022'); }}>generate a report </StyledPrintButton> : null}
        </StyledDiv>

         : null}

        <StyledSomething ref={componentToPrint}>
      {buildingYear !== '' ?
        <>
        {/* <StyledTitle>Full Report</StyledTitle> */}
        <h1>Full Report: {buildingYear}</h1>

          <StyledTable>

            <StyledHeaderContainer>
              <th>Depto</th>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
              )}
              <StyleMonthsHeaders>annual</StyleMonthsHeaders>
            </StyledHeaderContainer>

            {buildings.length > 0 ? buildings.map((item) => <><StyledRowUnit>
              <StyledCell>{reportInfo[item][buildingYear] ? item : null}</StyledCell>
              {reportInfo[item][buildingYear]['revenue'] ? reportInfo[item][buildingYear]['revenue'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledRowUnit>
            </>
            ) : null}

            <StyledRowUnit>
              <StyledBold>Total Rev</StyledBold>
              {reportInfo[buildingYear]['totalRev'] ? reportInfo[buildingYear]['totalRev'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledRowUnit>

            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>
            <tr><td> </td> </tr>

              {buildings.map((building) =>
               <StyledRowUnit>
                   <StyledCell>{building}</StyledCell>
                   {reportInfo[building][buildingYear]['expense'].map((item) =>
                    <StyledCell>{item}</StyledCell>
                   )}
                </StyledRowUnit>
              )}

            <StyledRowUnit>
            <StyledBold>Total E</StyledBold>
              {reportInfo[buildingYear]['totalExpenses'] ? reportInfo[buildingYear]['totalExpenses'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledRowUnit>

            {buildings.map((building) =>
               <StyledRowUnit>
                   <StyledCell>{building}</StyledCell>
                   {reportInfo[building][buildingYear]['totalNet'] ? reportInfo[building][buildingYear]['totalNet'].map((item) =>
                    <StyledCell>{item}</StyledCell>
                   ) : null}
                </StyledRowUnit>
              )}

            <StyledRowUnit>
            <StyledBold>Total net</StyledBold>
              {reportInfo[buildingYear]['totalProfit'] ? reportInfo[buildingYear]['totalProfit'].map((item2) => <>
                <StyledCell>{item2}</StyledCell>
              </>
              ) : null}
            </StyledRowUnit>

          </StyledTable></>
        : null}
        </StyledSomething>


         <StyledDiv>
          {buildingYear !== '' ? <StyledPrintButton onClick={handlePrint}>{`print report`}</StyledPrintButton> : null}

         </StyledDiv>

    </>
  )
}

const StyledCell = styled.td`
  text-align: center;
  width: fit-content;
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
  margin-left: 30px;
  margin-right: 30px;
  ${StyledRowE}:nth-child(odd) {
    background: lightgrey;
  }
  ${StyledRowUnit}:nth-child(odd) {
    background: lightgrey;
  }

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
`

const StyledSomething = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

const StyledPrintButton = styled.button`
  display: flex;
  justify-content: center;

`