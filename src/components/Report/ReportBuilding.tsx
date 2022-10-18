import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { bindComplete } from "pg-protocol/dist/messages";


// potentially receive 'buildingName' and 'Year'
// expect to work from Object with 'months' as keys

// This function should receive a building's information, and only that.
export const ReportBuilding = ({ buildingName }) => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
  const { aggregate } = useContext(AggregateContext)
  // const [buildingNames, setBuildingNames] = useState<string[]>([])
  // const [headers, setHeaders ] = useState<string[]>([])

  const [months, setMonths] = useState<string[]>()
  const [ units, setUnits] = useState<string[]>([])
  const [annualRent, setAnnualRent] = useState<any>()
  const [annualUnitTotal, setAnnualUnitTotal] = useState<any>()
  const [totalTotal, setTotalTotal] = useState<number[]>()
  const [totalAdmon, setTotalAdmon] = useState<number[]>()
  // hard coded year
  const year = 2022;

  // used to get the months
  // console.log(aggregate[buildingName][year], 'this should have two months ')

  useEffect( () => {
    const monthkeys = Object.keys(aggregate[buildingName][year])
    setMonths(monthkeys)

    if (months) {
      buildUnits(months)
    }

    // testing unit array
    if (months && units.length > 0) {
      buildUnitArrays()
      costs(months)
    }

    if (annualRent && units.length > 0) {
      console.log('neter')
      getAnnualRentTotal()
    }
    if (annualUnitTotal) {
      getMonthRentTotal(months, annualUnitTotal)

    }

  }, [Object.keys(aggregate).length, months ? months.length: null, units.length, annualRent ? annualRent[buildingName][year]['units'].length : null, annualUnitTotal ? Object.values(annualUnitTotal).length : null])

  const buildUnits = async (months: string[]) => {
    let monthToChoose = await months[0]
    let units = [];

    aggregate[buildingName][year][monthToChoose]['unitInfo'].map((item) => {
      units.push(item['Depto'])
    })
    units.splice(units.length-1, 1)
    setUnits(units)
  }

  // build unit array - structure: {buildingname: {year: {units: {[unitname]: [...rent for each month]}}}}
  const buildUnitArrays = () => {

    let blob = {[buildingName]: {[year]: {'units': {}}}};

    months.forEach((month) =>{
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
    console.log(blob, 'should be {[unit]: [...12 items that are rent costsfor given month, if not available put "-", ]}')

    setAnnualRent(() => blob)
  }

  // annual total for a specific unit
  const getAnnualRentTotal = () => {
    let annualTotal = {}
    let array = annualRent[buildingName][year]['units']
    units.forEach((unit, index) =>{
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

  const getMonthRentTotal = (months: string[], annualUnitTotal:{unit: number}) => {
    // {total: [-,-,-,-,-,....]}
    let total:any[] = Array.from({length: 13}).fill('-',0, 13)
    let totalAdmon:any[] = Array.from({length: 13}).fill('-',0, 13)

    months.forEach((month) => {
      let fileToCheck = aggregate[buildingName][year][month]['unitInfo']
      let totalRent = fileToCheck[fileToCheck.length-1]['Renta']
      let admonTotal = fileToCheck[fileToCheck.length-1]['Admon']
      // or can iterate through files to add up independently


      let insertionPoint = hardCodeMonths.indexOf(month)
      total[insertionPoint] = totalRent
      totalAdmon[insertionPoint] = admonTotal

    })
    if (annualUnitTotal) {
      let unitTotal = 0
      Object.values(annualUnitTotal).forEach((amount) => {
        unitTotal += Number(amount)
      })
      total[12] = unitTotal
    }
    setTotalTotal(total)
    setTotalAdmon(totalAdmon)
  }

  const costs = (months: string[]) => {
    // find total of admon (400)

    months.forEach((month) => {

      console.log(aggregate[buildingName][year][month]['costs'], 'should be an array of costs')
    })
  }

  return (
    <>
   <StyledTable>
    <StyledHeaderContainer>
      <th>{buildingName}</th>
      { hardCodeMonths.map((item) =>
      <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
      )}
      <StyleMonthsHeaders>annual</StyleMonthsHeaders>
    </StyledHeaderContainer>
      {annualRent ? units.map((unit, index) =>
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
      <StyledCell>TOTAL RENTA</StyledCell>
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
    </tr>
    <tr>
      <StyledCell>admon</StyledCell>
      {totalAdmon ? totalAdmon.map((admon) =>
        <StyledCell>{admon}</StyledCell>
      ): null}
    </tr>
    <tr>
      <StyledCell>gastos</StyledCell>
    </tr>
    <tr>
      <StyledCell>devol</StyledCell>
    </tr>
    <tr>
      <StyledCell>otros</StyledCell>
    </tr>
    <tr>
      <StyledCell>total E</StyledCell>
    </tr>
    <tr><td> </td></tr>
    <tr>
      <StyledCell>total n</StyledCell>
    </tr>



    </StyledTable>

    </>

  )
}

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