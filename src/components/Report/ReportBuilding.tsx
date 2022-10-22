import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";


// This function should receive a building's information, and only that.
export const ReportBuilding = ({ buildingName }) => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
  const { aggregate } = useContext(AggregateContext)

  const years = Object.keys(aggregate[buildingName])
  const [year, setYear] = useState<string>(years[0])

  const [months, setMonths] = useState<string[]>()
  const [units, setUnits] = useState<string[] | any>([])
  const [annualRent, setAnnualRent] = useState<any>()
  const [annualUnitTotal, setAnnualUnitTotal] = useState<any>()
  // expenses
  const [totalTotal, setTotalTotal] = useState<number[]>()
  const [totalAdmon, setTotalAdmon] = useState<number[] | any[]>()
  const [totalCorretaje, setTotalCorretaje] = useState<number[] | any[]>(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
  const [totalGastos, setTotalGastos] = useState<number[] | any[]>(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
  const [totalDevol, setTotalDevol] = useState<number[] | any[]>(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
  const [totalOtros, setTotalOtros] = useState<number[] | any[]>(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
  const [totalExpenses, setTotalExpenses] = useState<number[] | any[]>(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])
  const [totalProfit, setTotalProfit] = useState<number[] | any[]>(['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'])

  useEffect( () => {
    if (!months) {
      let monthkeys = Object.keys(aggregate[buildingName][year])
      setMonths(monthkeys)

    }
    if (months) {
      if (units.length === 0) {
        console.log(units)
       buildUnits()
       console.log(units, 'after? ')
      }
    }

    if (months && units.length > 0) {
      try {
        buildUnitArrays()
      }
      catch {
        console.log('error or')
      }
    }

    if (annualRent && units.length > 0) {
      if (annualRent[buildingName][year]) {
        getAnnualRentTotal()
        // console.log(Object.values(annualRent[buildingName][year]['units']))

      }

    }
    if (annualUnitTotal) {
      getMonthCostsTotal(annualUnitTotal)
      // console.log(Object.keys(annualUnitTotal))
    }
    if (totalTotal) {
      getTotalProfit(totalTotal, totalExpenses)
    }

 }, [JSON.stringify(aggregate), months ? months.length : null, units.length, annualRent ? annualRent[buildingName][year]['units'].length : null, annualUnitTotal ? Object.keys(annualUnitTotal).length : null, JSON.stringify(totalGastos), JSON.stringify(totalProfit), JSON.stringify(totalExpenses), year])

  const buildUnits = async () => {
    let units = [];

    aggregate[buildingName][year][months[0]]['unitInfo'].map((item) => {
      units.push(item['Depto'])
    })
    units.splice(units.length-1, 1)
    setUnits(units)
  }

  // build unit array - structure: {buildingname: {year: {units: {[unitname]: [...rent for each month]}}}}
  const buildUnitArrays = async () => {

    let blob = {[buildingName]: {[year]: {'units': {}}}};
    let tempMonths = Object.keys(aggregate[buildingName][year])

    tempMonths.forEach( (month: string) =>{
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
          tempArr[insertionPoint] = Number(item['Renta']);

          blob[buildingName][year]['units'][tempUnit] = tempArr;

        }

      })
    });
    setAnnualRent(() => blob)
  }

  // annual total for a specific unit
  const getAnnualRentTotal = async () => {
    let annualTotal = {}
    let array = annualRent[buildingName][year]['units']

   units.forEach((unit:string, index) =>{
      if (index !== 0) {
        annualTotal[unit] = 0
        array[unit].forEach((item:any) => {
          if (item !== '-') {
            annualTotal[unit] += item
          }
        })

      }
    })
    // annual total should look like this => {[unit1]: NUMBER, [unit2]: NUMBER, ...}
    setAnnualUnitTotal(() => annualTotal)
  }

  const getMonthCostsTotal = async (annualUnitTotal:{unit: number}) => {
    let total:any[] = Array.from({length: 13}).fill('-',0, 13)
    let totalAdmon:any[] = Array.from({length: 13}).fill('-',0, 13)
    let admonAnnual = 0;
    let testGastos:any[] = Array.from({length: 13}).fill('-',0, 13)
    let tempMonths = Object.keys(aggregate[buildingName][year])

    tempMonths.forEach((month) => {
      let insertionPoint = hardCodeMonths.indexOf(month)
      let fileToCheck = aggregate[buildingName][year][month]['unitInfo']
      let totalRent = fileToCheck[fileToCheck.length-1]['Renta']
      let gastos = aggregate[buildingName][year][month]['costs']

      let admonTotal = fileToCheck[fileToCheck.length-1]['Admon']
      // or can iterate through files to add up independently
      admonAnnual += Number(admonTotal)

      // insert value with corresponding month index
      total[insertionPoint] = totalRent
      totalAdmon[insertionPoint] = admonTotal
      // totalGastos[insertionPoint] = gastos;
      testGastos = getGastosInformation(gastos, insertionPoint, testGastos)

    })

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
      console.log(' HERE')
      getTotalExpenses(totalAdmon, totalGastos, totalDevol, totalOtros)
    }
  }

  const getGastosInformation = (gastos, insertionPoint, testGastos) => {
    let gastosTotal = 0;
    gastos.forEach((item, index) => {
      if (index !== 0) {
        if (item['Gastos'] !== '') {
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

  const getTotalExpenses = (totalAdmon: any[], totalGastos:any[], totalDevol:any[], totalOtros:any[]) => {

    let totalExpensesArray = Array.from({length: 13}).fill('-', 0, 13)
    let totalExpenses = 0
    for (let index = 0; index < 12; index++) {
      let totalE = 0;
      totalAdmon[index] && !isNaN(Number(totalAdmon[index])) ? totalE += Number(totalAdmon[index]) : null
      totalGastos[index] && !isNaN(Number(totalGastos[index])) ? totalE += Number(totalGastos[index]) : null
      totalDevol[index] && !isNaN(Number(totalDevol[index])) ? totalE += Number(totalDevol[index]) : null
      totalOtros[index] && !isNaN(Number(totalOtros[index])) ? totalE += Number(totalOtros[index]) : null
      totalExpenses += totalE
      totalExpensesArray[index] = totalE > 0 ? totalE : '-'
    }
  totalExpensesArray[12] = totalExpenses;
  setTotalExpenses((totalExpenses) => totalExpensesArray)
}

const getTotalProfit = (totalTotal, totalExpenses) => {
  let totalNet = Array.from({length: 13}).fill('-', 0, 13);
  let total = 0;
  for (let index = 0; index < 13; index++) {
    if (totalTotal[index] !== '-' && totalExpenses[index] !== '-') {
      totalNet[index] = totalTotal[index] - totalExpenses[index]
    } else {
      totalNet[index] = '-'
    }
  }

  setTotalProfit(totalNet)
}

const changeYears = async (e, change: string, year: string) => {
  e.preventDefault()
  let index = years.indexOf(year)

  if (change === 'decrease'){
    setYear((year) => years[index -1])
    setAnnualRent(null)
    setAnnualUnitTotal(null)
  }

  if (change === 'increase') {
    setYear((year) => newYear)
    setAnnualRent(null)
    setAnnualUnitTotal(null)
    let newYear = years[index + 1]
  }
}

  return (
    <>
    <StyledTop>
      {years.indexOf(year) !== 0 ? <StyledYearArrows onClick={(e) =>  {e.preventDefault(); changeYears(e,'decrease', year)}}>{'<'}</StyledYearArrows> : <StyledInvisible>   </StyledInvisible>}
      <StyledTitle>
          <h1>{buildingName}: {year}</h1>
      </StyledTitle>
      {years.indexOf(year) !== years.length -1 ? <StyledYearArrows onClick={(e) => {e.preventDefault(); changeYears(e,'increase', year)}}>{'>'}</StyledYearArrows> : <StyledInvisible>   </StyledInvisible>}
    </StyledTop>
   <StyledTable>
    <StyledHeaderContainer>
      <th>Depto</th>
      { hardCodeMonths.map((item) =>
      <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
      )}
      <StyleMonthsHeaders>annual</StyleMonthsHeaders>
    </StyledHeaderContainer>
      {annualRent  ? units.map((unit, index) =>
        <tr>
          <StyledCell>{unit !== buildingName ? unit : null}</StyledCell>
          {index !== 0 ? Object.values(annualRent[buildingName][year]['units'][unit]).map((item2: string) =>
            <StyledCell>{item2}</StyledCell>
          )
          :null}
          <StyledCell>{annualUnitTotal && unit !== buildingName ? annualUnitTotal[unit] : null}</StyledCell>
        </tr>
      ) :null
    }
    <StyledTotal>
      <StyledBold>total r</StyledBold>
      {totalTotal ? totalTotal.map((total) =>
        <StyledCell>{total}</StyledCell>
      ):null}
    </StyledTotal>
    <tr>
      <td> </td>
    </tr>
    <tr>
      <StyledBold>egresos</StyledBold>
    </tr>
    <tr>
      <StyledCell>corretaje</StyledCell>
      {totalCorretaje ? totalCorretaje.map((admon) =>
        <StyledCell>{admon}</StyledCell>
      ): null}
    </tr>
    <tr>
      <StyledCell>admon</StyledCell>
      {totalAdmon ? totalAdmon.map((admon) =>
        <StyledCell>{admon}</StyledCell>
      ): null}
    </tr>
    <tr>
      <StyledCell>gastos</StyledCell>
      {totalGastos ? totalGastos.map((item) =>
        <StyledCell>{item}</StyledCell>
      ) : null}
    </tr>
    <tr>
      <StyledCell>devol</StyledCell>
      {totalDevol ? totalDevol.map((item) =>
        <StyledCell>{item}</StyledCell>
      ) : null}
    </tr>
    <tr>
      <StyledCell>otros</StyledCell>
      {totalOtros ? totalOtros.map((item) =>
        <StyledCell>{item}</StyledCell>
      ) : null}
    </tr>
    <tr>
      <StyledBold>total E</StyledBold>
      {totalExpenses ? totalExpenses.map((item) =>
        <StyledCell>{item}</StyledCell>
      ) : null}
    </tr>
    <tr><td> </td></tr>
    <tr>
      <StyledBold>total n</StyledBold>
      {totalProfit ? totalProfit.map((item) =>
        <StyledCell>{item}</StyledCell>
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

const StyledTable = styled.table`
  border: 1px solid red;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
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

const StyledCell = styled.td`
  text-align: center;
`

const StyledTotal = styled.tr`
  border-top: 1px solid black;
`

const StyledBold = styled(StyledCell)`
  font-weight: bold;
  text-decoration: underline;
`

// egresos <bold>
// corretaje
// admon
// gastos
// devol
// otros
// total expenses

// total all

