import { AggregateContext } from "../context/ProjectContext";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";



// This function should receive a building's information, and only that.
export const ReportBuilding = ({ buildingName, yr }) => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre' ]
  const { aggregate, reportInfo, yearsAvailable, yearPicked, setReportInfo, setYearPicked, setYearsAvailable } = useContext(AggregateContext)
  let stringAgg = JSON.stringify(aggregate)
  let stringReportInfo = JSON.stringify(reportInfo)

  let years = Object.keys(aggregate[buildingName]).sort()
  const [year, setYear] = useState<string>(yr)

  const [months, setMonths] = useState<string[]>(Object.keys(aggregate[buildingName][year]))

  const [units, setUnits] = useState<string[] | any>(() => {
    let temp = []
    aggregate[buildingName][year][Object.keys(aggregate[buildingName][year])[0]]['unitInfo'].map((item) => {
      temp.push(item['Depto'])
    })
    temp.splice(temp.length-1, 1)
    return temp;
  })


  const [annualRent, setAnnualRent] = useState<any>()
  const [annualUnitTotal, setAnnualUnitTotal] = useState<any>()
  // expenses
  const defaultReportRow = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
  const [totalTotal, setTotalTotal] = useState<number[]>()
  const [totalAdmon, setTotalAdmon] = useState<number[] | any[]>()
  const [totalCorretaje, setTotalCorretaje] = useState<number[] | any[]>(defaultReportRow)
  const [totalGastos, setTotalGastos] = useState<number[] | any[]>(defaultReportRow)
  const [totalDevol, setTotalDevol] = useState<number[] | any[]>(defaultReportRow)
  const [totalOtros, setTotalOtros] = useState<number[] | any[]>(defaultReportRow)
  const [totalExpenses, setTotalExpenses] = useState<number[] | any[]>(defaultReportRow)
  const [totalProfit, setTotalProfit] = useState<number[] | any[]>(defaultReportRow)

  useEffect( () => {

    setYear((yr))

    setMonths(() => Object.keys(aggregate[buildingName][year]))

    buildUnitArrays()

    if (annualRent) {
      if (annualRent[buildingName][year]) {
        getAnnualRentTotal()
      }
    }
    if (annualUnitTotal) {
      getMonthCostsTotal(annualUnitTotal)
    }

    if (totalTotal) {
      getTotalProfit(totalTotal, totalExpenses)
      generateFullReport(year)
    }

 }, [JSON.stringify(aggregate), stringReportInfo,  JSON.stringify(annualRent), JSON.stringify(annualUnitTotal), JSON.stringify(totalGastos), JSON.stringify(totalProfit), JSON.stringify(totalExpenses), JSON.stringify(totalOtros), JSON.stringify(totalCorretaje), yr, year, JSON.stringify(months)])

    // build unit array - structure: {buildingname: {year: {units: {[unitname]: [...rent for each month]}}}}
  const buildUnitArrays = useCallback(() => {

    let blob = {[buildingName]: {[year]: {'units': {}}}};
    let monthsContainer = Object.keys(aggregate[buildingName][year])

    monthsContainer.forEach( (month: string) =>{
        aggregate[buildingName][year][month]['unitInfo'].forEach((item, index) => {
        let tempUnit = units[index]

        if (index !== 0 && index !== aggregate[buildingName][year][month]['unitInfo'].length-1) {

          let tempArr;
          if(!blob[buildingName][year]['units'][tempUnit])
          {
            tempArr = Array.from({length: 12})
            tempArr.fill('-', 0, tempArr.length)
          }
          else
          {
            tempArr = blob[buildingName][year]['units'][tempUnit];
          }
          let insertionPoint = hardCodeMonths.indexOf(month)
          tempArr[insertionPoint] = !isNaN(Number(item['Renta'])) ?  Number(item['Renta']) : '-';

          blob[buildingName][year]['units'][tempUnit] = tempArr;

        }
      })
    });
    setAnnualRent(() => blob)
  }, [JSON.stringify(aggregate[buildingName][year])])

  // annual total for a specific unit
  const getAnnualRentTotal = async () => {
    let annualTotal = {}
    let array;
    if (annualRent[buildingName][year]['units']) {
      array = annualRent[buildingName][year]['units']

    }

   units.forEach((unit:string, index) =>{
      if (index !== 0) {
        annualTotal[unit] = 0
        array[unit].forEach((item:any) => {
          if (item !== '-') {
            if (isNaN(item)) {
              annualTotal[unit] = '-'
            } else {
              annualTotal[unit] += item

            }
          }
        })

      }
    })
    // annual total should look like this => {[unit1]: NUMBER, [unit2]: NUMBER, ...}
    setAnnualUnitTotal(() => annualTotal)
  // })
  }

   // TESTING
  const getCorretaje = (file) => {
    let box = 0;
    file.forEach((item) => {
      if (Number(item['Corretaje'])) {
        box += item['Corretaje']
        }
      })
      return box;
    }

  const getMonthCostsTotal =  useCallback(async (annualUnitTotal:{unit: number}) => {
    let total:any[] = Array.from({length: 13}).fill('-',0, 13)
    let totalAdmon:any[] = Array.from({length: 13}).fill('-',0, 13)
    let testGastos:any[] = Array.from({length: 13}).fill('-',0, 13)
    let totalDevolucion:any[] = Array.from({length: 13}).fill('-',0, 13)
    let totalOtros:any[] = Array.from({length: 13}).fill('-',0, 13)
    let totalCorretaje:any[] = Array.from({length: 13}).fill('-',0, 13)

    let admonAnnual = 0;

    let monthsContainer = Object.keys(aggregate[buildingName][year])

    monthsContainer.forEach((month) => {
      let insertionPoint = hardCodeMonths.indexOf(month)
      let fileToCheck = aggregate[buildingName][year][month]['unitInfo']
      let totalRent = fileToCheck[fileToCheck.length-1]['Renta']
      let gastos = aggregate[buildingName][year][month]['costs']

      totalCorretaje[insertionPoint] = getCorretaje(fileToCheck)
      // devol && otros
      gastos.forEach((item) => {
        if (item['Gastos'] === 'Devolución') {
          if (item['Cost'] !== '') {
            totalDevolucion[insertionPoint] = item['Cost']
          }
        }
        if (item['Gastos'] === 'Otros') {
          if (item['Cost'] !== '') {
          totalOtros[insertionPoint] = item['Cost']
          }
        }
      })

      let admonTotal = fileToCheck[fileToCheck.length-1]['Admon']
      // or can iterate through files to add up independently
      admonAnnual += Number(admonTotal)

      // insert value with corresponding month index
      total[insertionPoint] = totalRent
      totalAdmon[insertionPoint] = admonTotal
      testGastos = getGastosInformation(gastos, insertionPoint, testGastos)

    })
    // TESTING
    // setTotalCorretaje(totalCorretaje) // corretaje
    setTotalDevol(totalDevolucion)

    // get total Otros
    let otrosTotal = 0;

    totalOtros.forEach((item) => {
      if (item !== '-') {
        otrosTotal += Number(item)
      }
    })
    totalOtros[12] = otrosTotal;
    setTotalOtros(totalOtros)

    if (annualUnitTotal) {
      let unitTotal = 0
      Object.values(annualUnitTotal).forEach((amount) => {
        unitTotal += Number(amount)
      })
      total[12] = unitTotal
    }
    setTotalTotal(total)

    // set last index position as admonAnnual
    totalAdmon[12] = admonAnnual
    setTotalAdmon(totalAdmon)

    // gastos
    let gastosAnnual = await findGastosTotal(testGastos)
    setTotalGastos(await gastosAnnual)

    // get total expenses
    if (totalAdmon && totalGastos) {
      getTotalExpenses(totalAdmon, totalGastos, totalDevol, totalOtros)
      console.log(' HERE')
    }

    // TEST
    // console.log(corre, 'this is corretaje, should be a value')
  }, [annualUnitTotal, aggregate[buildingName][year]])

  const getGastosInformation = (gastos, insertionPoint, testGastos) => {
    let gastosTotal = 0;
    gastos.forEach((item, index) => {
      if (index !== 0 ) {
        if (item['Gastos'] !== '' && item['Gastos'] !== 'TOTAL' && item['Gastos'] !== 'Devolución' && item['Gastos'] !== 'Otros' ) { // && item['Gastos'] !== 'TOTAL'
          gastosTotal += Number(item['Cost'])
        }
      }
    })
    testGastos[insertionPoint] = gastosTotal
    return testGastos;
  }

  const findGastosTotal = (testGastos) => {
    let annualGastos = 0
    testGastos.forEach((value) => {
      if (!isNaN(value)) {
        annualGastos += Number(value)
      }
    })
    testGastos[12] = annualGastos
    return testGastos

  }

  const getTotalExpenses = useCallback((totalAdmon: number[] | any[], totalGastos:any[], totalDevol:any[], totalOtros:any[]) => {

    let totalExpensesArray = Array.from({length: 13}).fill('-', 0, 13)
    let totalExpenses = 0
    for (let index = 0; index < 12; index++) {
      let totalE = 0;
      totalAdmon[index] && !isNaN(Number(totalAdmon[index])) ? totalE += Number(totalAdmon[index]) : null
      totalGastos[index] && !isNaN(Number(totalGastos[index])) ? totalE += Number(totalGastos[index]) : null
      totalDevol[index] && !isNaN(Number(totalDevol[index])) ? totalE += Number(totalDevol[index]) : null
      totalOtros[index] && !isNaN(Number(totalOtros[index])) ? totalE += Number(totalOtros[index]) : null
      // totalCorretaje[index] && !isNaN(Number(totalCorretaje[index])) ? totalE += Number(totalCorretaje[index]) : null // corretaje
      totalExpenses += totalE
      totalExpensesArray[index] = totalE > 0 ? totalE : '-'
    }
        totalExpensesArray[12] = totalExpenses;
        setTotalExpenses((totalExpenses) => totalExpensesArray)
      },[totalAdmon, totalGastos, totalDevol, totalOtros])

  const getTotalProfit = (totalTotal, totalExpenses) => {
    let totalNet = Array.from({length: 13}).fill('-', 0, 13);

    for (let index = 0; index < 13; index++) {
      if (totalTotal[index] !== '-' && totalExpenses[index] !== '-') {
        totalNet[index] = totalTotal[index] - totalExpenses[index]
      } else {
        totalNet[index] = '-'
      }
    }

    setTotalProfit(totalNet)
  }

  const generateFullReport = (yr) => {
    if (!reportInfo[buildingName]) {
      reportInfo[buildingName] = {}
    }

    // HERE should help determine report generation
    let tempThing = aggregate[buildingName][yr]
    if (tempThing) {
      let monthsContainer = Object.keys(aggregate[buildingName][yr])

      monthsContainer.forEach((month) => {
        let insertionPoint = hardCodeMonths.indexOf(month)

        if (!reportInfo[buildingName][yr]) {
          reportInfo[buildingName][yr] = {
            'revenue': Array.from({length: 13}).fill('-', 0, 13),
            'expense': Array.from({length: 13}).fill('-', 0, 13)
          }

          reportInfo[yr] = {
            'admon': Array.from({length: 13}).fill('-', 0, 13),
            'gastos': Array.from({length: 13}).fill('-', 0, 13),
            'devol': Array.from({length: 13}).fill('-', 0, 13),
            // 'corretaje': Array.from({length: 13}).fill('-', 0, 13), // CORRETAJE
            'otros': Array.from({length: 13}).fill('-', 0, 13),
            'totalProfit': Array.from({length: 13}).fill('-', 0, 13),
          }

          reportInfo[buildingName][yr]['revenue'][insertionPoint] = totalTotal[insertionPoint]
          reportInfo[buildingName][yr]['expense'][insertionPoint] = totalExpenses[insertionPoint]

          // // create {reportInfo: {year: {admon: []}}}
          reportInfo[yr]['admon'][insertionPoint] = 0
          reportInfo[yr]['admon'][insertionPoint] += totalAdmon[insertionPoint]

          reportInfo[yr]['gastos'][insertionPoint] = 0
          reportInfo[yr]['gastos'][insertionPoint] += totalGastos[insertionPoint]

          reportInfo[yr]['devol'][insertionPoint] = 0
          reportInfo[yr]['devol'][insertionPoint] += totalDevol[insertionPoint]

          // reportInfo[yr]['corretaje'][insertionPoint] = 0 // CORRETAJE
          // reportInfo[yr]['corretaje'][insertionPoint] += totalCorretaje[insertionPoint] // CORRETAJE

          reportInfo[yr]['otros'][insertionPoint] = 0
          reportInfo[yr]['otros'][insertionPoint] += totalOtros[insertionPoint]


        } else {
          reportInfo[buildingName][yr]['revenue'][insertionPoint] = totalTotal[insertionPoint]
          reportInfo[buildingName][yr]['expense'][insertionPoint] = totalExpenses[insertionPoint]


          reportInfo[yr]['admon'][insertionPoint] = totalAdmon[insertionPoint]
          reportInfo[yr]['gastos'][insertionPoint] = totalGastos[insertionPoint]
          reportInfo[yr]['devol'][insertionPoint] = totalDevol[insertionPoint]
          // reportInfo[yr]['corretaje'][insertionPoint] = totalCorretaje[insertionPoint] // CORRETAJE
          reportInfo[yr]['otros'][insertionPoint] = totalOtros[insertionPoint]
        }
        reportInfo[buildingName][yr]['revenue'][12] = totalTotal[12]
        setReportInfo(reportInfo)
      })
    }

  }

  const changeYears = (e, change: string, year: string) => {
    e.preventDefault()
    let index = years.indexOf(year)

    if (change === 'decrease'){
      setYear((year) => years[index -1])
      setAnnualRent(null)
      setAnnualUnitTotal(null)

      setYearPicked(years[index -1])
    }

    if (change === 'increase') {
      let newYear = years[index + 1]
      setYear((year) => newYear)
      setAnnualRent(null)
      setAnnualUnitTotal(null)

      setYearPicked(newYear)
    }
  }

  return (
    <>
    <StyledTop>
          {years.length > 1 && years.indexOf(year) !== 0 ? <StyledYearArrows onClick={(e) => { e.preventDefault(); changeYears(e, 'decrease', year); } }>{'<'}</StyledYearArrows> : <StyledInvisible>   </StyledInvisible>}
          <StyledTitle>
            <h2>{buildingName}: {year}</h2>
          </StyledTitle>
          {years.length > 1 && years.indexOf(year) !== years.length - 1 ? <StyledYearArrows onClick={(e) => { e.preventDefault(); changeYears(e, 'increase', year); } }>{'>'}</StyledYearArrows> : <StyledInvisible>   </StyledInvisible>}
        </StyledTop><StyledTable>
            <StyledHeaderContainer>
              <th>Depto</th>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
              )}
              <StyleMonthsHeaders>annual</StyleMonthsHeaders>
            </StyledHeaderContainer>
            {annualRent ? units.map((unit, index) => <StyledRowUnit>
              {unit !== buildingName ? <StyledCell>{unit} </StyledCell> : null}
              {index !== 0 && annualRent[buildingName][year] ? Object.values(annualRent[buildingName][year]['units'][unit]).map((item2: string) => <StyledCell>{item2}</StyledCell>
              )
                : null}
              <StyledCell>{annualUnitTotal && unit !== buildingName ? annualUnitTotal[unit] : null}</StyledCell>
            </StyledRowUnit>
            ) : null}
            <StyledTotal>
              <StyledBold>total r</StyledBold>
              {totalTotal ? totalTotal.map((total) => <StyledCell>{total}</StyledCell>
              ) : null}
            </StyledTotal>
            <tr><td></td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <StyledBold>egresos</StyledBold>
            </tr>
            <StyledRowE>
              <StyledCell>corretaje</StyledCell>
              {totalCorretaje ? totalCorretaje.map((item) => <StyledCell>{item}</StyledCell>
              ) : null}
            </StyledRowE>
            <StyledRowE>
              <StyledCell>admon</StyledCell>
              {totalAdmon ? totalAdmon.map((admon) => <StyledCell>{admon}</StyledCell>
              ) : null}
            </StyledRowE>
            <StyledRowE>
              <StyledCell>gastos</StyledCell>
              {totalGastos ? totalGastos.map((item) => <StyledCell>{item}</StyledCell>
              ) : null}
            </StyledRowE>
            <StyledRowE>
              <StyledCell>devol</StyledCell>
              {totalDevol ? totalDevol.map((item) => <StyledCell>{item}</StyledCell>
              ) : null}
            </StyledRowE>
            <StyledRowE>
              <StyledCell>otros</StyledCell>
              {totalOtros ? totalOtros.map((item) => <StyledCell>{item}</StyledCell>
              ) : null}
            </StyledRowE>
            <StyledRowE>
              <StyledBold>total E</StyledBold>
              {totalExpenses ? totalExpenses.map((item) => <StyledCell>{item}</StyledCell>
              ) : null}
            </StyledRowE>

            <tr>
              <StyledBold>total n</StyledBold>
              {totalProfit ? totalProfit.map((item) => <StyledCell>{item}</StyledCell>
              ) : null}
            </tr>

          </StyledTable>

    </>
  )
}

const StyledTitle = styled.div`
  // display: flex;
  // justify-content: center;
`

const StyledTop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledYearArrows = styled.button`
  // font-weight: bold;
  font-size: 20px;
  background-color: transparent;
  border-radius: 60px;
  height: fit-content;
  // margin-top: 20px;
  justify-content: center;
`
const StyledInvisible = styled.button`
  font-size: 20px;
  background-color: transparent;
  border: none;
  // border-radius: 60px;
  height: fit-content;
  // margin-top: 20px;
`
const StyledRowE = styled.tr`
`
const StyledRowUnit = styled.tr`
`
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

const StyledTotal = styled.tr`
  border-top: 1px solid black;
`

const StyledBold = styled(StyledCell)`
  font-weight: bold;
  text-decoration: underline;
`