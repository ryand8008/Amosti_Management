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
  const [globalObj, setGlobal] = useState<any>({})

  // hard coded year
  const year = 2022;

  // hard coded building...for now.
  const buildingName = 'Dragón'

  // used to get the months
  // console.log(aggregate[buildingName][year], 'this should have two months ')

  useEffect( () => {
    // console.log(aggregate[buildingName][year], 'this should have two months ')
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


  }, [Object.keys(aggregate).length, buildingNames.length, months ? months.length: null, units.length])

  const buildUnits = async (months) => {
    let monthToChoose = await months[0]
    let units = [];

    aggregate[buildingName][year][monthToChoose]['unitInfo'].map((item) => {
      units.push(item['Depto'])
    })
    units.splice(units.length-1, 1)
    setUnits(units)
  }

  const buildUnitArrays = () => {
    // map months =>
    // map unit: [...]
    let monthUnitArray = ['-', 0, 11]

    // general format of data
    // {buildingName:
    //   {year: {
    //     units: {
    //       unit1: [],
    //       unit2: []
    //     }}}}



    let blob = {[buildingName]: {[year]: {'units': {}}}};

    months.forEach((month) =>{
      aggregate[buildingName][year][month]['unitInfo'].forEach((item, index) => {
        let tempUnit = units[index]
        console.log(units, 'here')
        console.log(index, 'here: index')
        console.log(units[index], 'unitIndex')

        if (index !== 0 && index !== aggregate[buildingName][year][month]['unitInfo'].length) {

          let tempArr;
          let temp;
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
//          temp = {[buildingName]: {[year]: {units: {[tempUnit]: tempArr}}}}

          blob[buildingName][year]['units'][tempUnit] = tempArr;
//          console.log(temp, 'this is temp')

          //const test = temp[buildingName][year]['units'][tempUnit][monthindex] = item['Renta'];
          //test.splice(insertionPoint, 1, Number(item['Renta']) ? item['Renta'] : null )
//          console.log(test, 'this is test, should be []')

//          console.log(tempUnit, 'temp unit')
          //blob[buildingName][year] = {...blob[buildingName][year], ...{[units[index]]: [...test]}}
//          console.log(blob, 'after')
          //  setGlobal((globalObj) => ({...globalObj[buildingName][year], ...{...globalObj[buildingName][year], ...{['units']: {[tempUnit]: [...test]}}}}))
          //  console.log(globalObj, 'after')
        }
        // console.log(temp[buildingName][year][month], 'could be undefined')
        var a ;
        a = 1;
      })
      var b ;
      b=1;
    });
    console.log(blob, 'should be {[unit]: [...12 items that are rent costsfor given month, if not available put "-", ]}')
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