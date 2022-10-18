import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import { ReportTable } from "./ReportTable";
import styled from "styled-components";
import { bindComplete } from "pg-protocol/dist/messages";


// potentially receive 'buildingName' and 'Year'
// expect to work from Object with 'months' as keys

// This function should receive a building's information, and only that.
export const ReportBuilding = ({ buildingName }) => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'may', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
  const { aggregate } = useContext(AggregateContext)
  const [buildingNames, setBuildingNames] = useState<string[]>([])
  const [headers, setHeaders ] = useState<string[]>([])

  const [months, setMonths] = useState<string[]>()
  const [ units, setUnits] = useState<string[]>([])
  const [annualRent, setAnnualRent] = useState<any>()
  const [annualUnitTotal, setAnnualUnitTotal] = useState<any>()
  const [totalTotal, setTotalTotal] = useState<number[]>()
  // hard coded year
  const year = 2022;

  // hard coded building...for now.
  // const buildingName = 'Dragón'

  // used to get the months
  // console.log(aggregate[buildingName][year], 'this should have two months ')

  useEffect( () => {

    if (annualRent) {
      console.log(annualRent, 'annual rent')
      console.log(Object.entries(annualRent[buildingName][year]['units']), 'units')
      // annualRent[buildingName][year]['units'].map((item) => console.log(item))
    }
    const monthkeys = Object.keys(aggregate[buildingName][year])
    setMonths(monthkeys)

    if (months) {
      buildUnits(months)
    }

    const building = Object.keys(aggregate)
    setBuildingNames(building)
    if (buildingNames[0]) {

      console.log(aggregate[buildingNames[0]][2022]['enero']['unitInfo'])
    }

    // testing unit array
    if (months && units.length > 0) {
      console.log(units)
      buildUnitArrays()
      // getMonthRentTotal(months)
    }

    if (annualRent && units.length > 0) {
      console.log('neter')
      getAnnualRentTotal()
    }
    if (annualUnitTotal) {
      getMonthRentTotal(months, annualUnitTotal)

    }

  }, [Object.keys(aggregate).length, buildingNames.length, months ? months.length: null, units.length, annualRent ? annualRent[buildingName][year]['units'].length : null, annualUnitTotal ? Object.values(annualUnitTotal).length : null])

  const buildUnits = async (months: string[]) => {
    let monthToChoose = await months[0]
    let units = [];

    aggregate[buildingName][year][monthToChoose]['unitInfo'].map((item) => {
      units.push(item['Depto'])
    })
    units.splice(units.length-1, 1)
    console.log(units, 'units')
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
    // create array of values
    // {total: [-,-,-,-,-,....]}
    let total:any[] = Array.from({length: 13}).fill('-',0, 13)
    console.log(months, 'should be 4')
    // iterate through the months and get the total
    // find index for insertion point
    months.forEach((month) => {
      let fileToCheck = aggregate[buildingName][year][month]['unitInfo']
      let totalRent = fileToCheck[fileToCheck.length-1]['Renta']
      let insertionPoint = hardCodeMonths.indexOf(month)
      total[insertionPoint] = totalRent

    })
    if (annualUnitTotal) {
      let unitTotal = 0
      Object.values(annualUnitTotal).forEach((amount) => {
        unitTotal += Number(amount)
      })
      total[12] = unitTotal
    }
    console.log(total, 'total')
    setTotalTotal(total)


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
      <StyledCell>TOTAL</StyledCell>
      {totalTotal ? totalTotal.map((total) =>
        <StyledCell>{total}</StyledCell>
      ):null}

    </StyledTotal>


    </StyledTable>

    </>

  )
}

const StyledTable = styled.table`
  border: 1px solid red;
  margin: auto;
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


// works but units are out of order
// {annualRent ? Object.entries(annualRent[buildingName][year]['units']).map((item: [string, string[]]) =>
//         <tr>
//           <StyledCell>{item[0]}</StyledCell>
//           {item[1].map((item2) =>
//             <StyledCell>{item2}</StyledCell>
//           )}
//         </tr>
//       ) :null
//     }