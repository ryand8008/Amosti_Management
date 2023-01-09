import React, { useCallback, useContext, useEffect, useState } from "react";
import { AggregateContext } from "../context/ProjectContext";

var xlsx = require("xlsx");

export const ExportFile = ({report, year}) => {
  // can have aggregatecontext as children props instead
  const {reportInfo, yearPicked} = useContext(AggregateContext)

  const hardCodeHeaders = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre', 'anual' ]

  const sheetHeaders = ['Edificio', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre', 'anual']
  const buildings = Object.keys(report).filter((item) => isNaN(Number(item)) === true)

  const [rows, setRows] = useState([])


  useEffect(() => {
    if (report[year]['totalRev']) {

      createWorkBook()

    }
  }, [report, rows.length, year])


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
      report[building][year][header].forEach((item, index) => {
        tempObj = { ...tempObj, ...{ [hardCodeHeaders[index]]: item } }
      })
      tempArray.push(tempObj)
    })
    let totalToAdd = getTotal(totalHeader)
              tempArray.push(totalToAdd)
              tempArray.push([])
    return tempArray;
  }

  const createWorkBook = () => {
    let testRow = []

      for (let i = 0; i <= 2; i++ ) {
        testRow.push(...getInfo(i))
      }

      setRows(testRow)

  }

const exportExcel = async () => {
    const worksheet = xlsx.utils.json_to_sheet(rows)
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "TESTING");
    xlsx.utils.sheet_add_aoa(worksheet, [sheetHeaders], { origin: "A1" });

    xlsx.writeFile(workbook, `FullReport${yearPicked}.xlsx`, {compression: true})
}

  return (
    <>
      {rows.length > 0 ? <button onClick={() => {exportExcel()}}>EXPORT FILE</button> : null}
    </>
  )
}
