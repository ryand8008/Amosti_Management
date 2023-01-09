import React, { useCallback, useContext, useEffect } from "react";
import { AggregateContext } from "../context/ProjectContext";

var xlsx = require("xlsx");

export const ExportFile = ({report}) => {
  // can have aggregatecontext as children props instead
  const {reportInfo, yearPicked} = useContext(AggregateContext)

  const hardCodeHeaders = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre', 'anual' ]

  const buildings = Object.keys(report).filter((item) => isNaN(Number(item)) === true)
// example:
// [
//   { C: 2, D: 3 },
//   { D: 1, C: 4 } // different key order
// ]

// should be =>
// [
//  {hardCodeHeaders[num]: item },
//  {...the rest}
// ]
let x = 0
  useEffect(() => {
    console.log(reportInfo, 'reportInfo')
    if (report[yearPicked]['totalRev']) {
      x = x + 1;
      console.log('how many times will it render? ', x)

      createWorkBook()

    }
  }, [JSON.stringify(report)])


  const getTotal = (totalHeader) => {
    let tempTotal = {'Edificio': ''}

        if (totalHeader === 'totalRev') {
          tempTotal = {'Edificio': 'Los ingresos totales'}
        } else if (totalHeader === 'totalExpenses') {
          tempTotal = {'Edificio': 'Gastos totales'}
        } else if (totalHeader === 'totalProfit') {
          tempTotal = {'Edificio': 'Neto Total'}
        }
        report[yearPicked][totalHeader].forEach((item, index) => {
          // console.log(item, 'there should be bunch')
          tempTotal = {...tempTotal, ...{[hardCodeHeaders[index]]: item}}

        })

        return tempTotal;
  }

  const getInfo = (ind) => {
    let fullReportHeaders = ['revenue', 'expense', 'totalNet']
      let totalHeaders = ['totalRev', 'totalExpenses', 'totalProfit']
    let [header, totalHeader] = [fullReportHeaders[ind], totalHeaders[ind]]
    let tempArray = [];

    buildings.forEach((building) => {
      let tempObj = { 'Edificio': building }
      report[building][yearPicked][header].forEach((item, index) => {
        tempObj = { ...tempObj, ...{ [hardCodeHeaders[index]]: item } }
      })
      tempArray.push(tempObj)
    })
    let totalToAdd = getTotal(totalHeader)
              tempArray.push(totalToAdd)
              tempArray.push([])
    console.log(tempArray, 'this should be [{}, {}]')
    return tempArray;
  }

  // reportInfo[buildingName][year]
    const createWorkBook = () => {

      let testRow = []
      for (let i = 0; i <= 2; i++ ) {
        testRow.push(getInfo(i))
      }

    // create rows from Report Info
    // const rows = hardCodeHeaders.map((item) =>
    //   item:
    // )

// this is the total of the buildings
// reportInfo[year]['totalRev']
// reportInfo[year]['totalExpenses']
// reportInfo[year]['totalProfit']


    // const worksheet = xlsx.utils.json_to_sheet()
    // const workbook = xlsx.utils.book_new();
    // XLSX.utils.sheet_add_aoa(worksheet, [hardCodeHeaders], { origin: "A1" });
  }



  return (
    <>
      <h1>Hello from ExportFile</h1>
      <button onClick={(e) => {e.preventDefault(), alert('you clicked me')}}>EXPORT ME</button>
    </>
  )
}


// buildings.forEach((building, buildingIndex) => {
//   let temp = { 'Edificio': building }

//   report[building][yearPicked][header].forEach((item, index) => {
//     temp = { ...temp, ...{ [hardCodeHeaders[index]]: item } }
//   })


//   testRow.push(temp)