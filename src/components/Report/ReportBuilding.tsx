import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import { ReportTable } from "./ReportTable";
import styled from "styled-components";


// potentially receive 'buildingName' and 'Year'
// expect to work from Object with 'months' as keys

// This function should receive a building's information, and only that.
export const ReportBuilding = () => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]
  const { aggregate } = useContext(AggregateContext)
  const [buildingNames, setBuildingNames] = useState<string[]>([])
  const [headers, setHeaders ] = useState<string[]>([])

  const [months, setMonths] = useState<string[]>()
  const [ units, setUnits] = useState<string[]>([])
  const [annualRent, setAnnualRent] = useState<any>()

  // hard coded year
  const year = 2022;

  // hard coded building...for now.
  const buildingName = 'Dragón'

  // used to get the months
  // console.log(aggregate[buildingName][year], 'this should have two months ')

  useEffect( () => {

    if (annualRent) {
      console.log(annualRent, 'annual rent')
    }
    const monthkeys = Object.keys(aggregate[buildingName][year])
    setMonths(monthkeys)

    if (months) {
      buildUnits(months)

      console.log(units)
    }

    const building = Object.keys(aggregate)
    setBuildingNames(building)
    if (buildingNames[0]) {

      console.log(aggregate[buildingNames[0]][2022]['enero']['unitInfo'])
    }

    // testing unit array
    if (months && units.length > 0) {
      console.log(units)
      buildUnitArrays();
    }


  }, [Object.keys(aggregate).length, buildingNames.length, months ? months.length: null, units.length, annualRent])

  const buildUnits = async (months: string[]) => {
    let monthToChoose = await months[0]
    let units = [];

    aggregate[buildingName][year][monthToChoose]['unitInfo'].map((item) => {
      units.push(item['Depto'])
    })
    units.splice(units.length-1, 1)
    setUnits(units)
  }

  const buildUnitArrays = () => {

    let blob = {[buildingName]: {[year]: {'units': {}}}};

    months.forEach((month) =>{
      aggregate[buildingName][year][month]['unitInfo'].forEach((item, index) => {
        let tempUnit = units[index]

        if (index !== 0 && index !== aggregate[buildingName][year][month]['unitInfo'].length) {

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
          tempArr[insertionPoint] = item['Renta'];

          blob[buildingName][year]['units'][tempUnit] = tempArr;

        }

      })

    });
    console.log(blob, 'should be {[unit]: [...12 items that are rent costsfor given month, if not available put "-", ]}')
    setAnnualRent(() => blob)
  }


  return (
    <>
   <StyledTable>
        <StyledHeaderContainer>
          <th>leave blank</th>
          { hardCodeMonths.map((item) =>
          <StyleMonthsHeaders>{item}</StyleMonthsHeaders>
          )}
        </StyledHeaderContainer>

        <tr>

        </tr>

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