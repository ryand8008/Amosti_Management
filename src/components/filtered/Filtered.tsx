import React, { useEffect, useState } from "react";
import { FilteredTable } from "./FilteredTable";


interface FilteredTable {
  data: any
}

export const Filtered = ({data}) => {


  const fileName = Object.keys(data)[0]

//   // headers hook
  const [cup, setCup] = useState<any[]>([])
  const [entries, setEntries] = useState<any[]>([])

  useEffect(() => {
    if (data[fileName]) {
      parse()
      createEntries()

    }

  }, [cup.length, data[fileName], entries.length])

  const createEntries = () => {
    let temp = []
      cup.map((item) => {
        temp.push(...Object.entries(item))
      })
      setEntries(temp)
  }

  const parse = () => {

    // replace the empty rows with a distinct char like '*
    let holdThis = [] // temp array with replaced char

    data[fileName]['unitInfo'].map((item) => {
      if (item['Depto'] === '') {
        holdThis.push('*')
      } else {
        holdThis.push(item)
      }
    })

    console.log(holdThis)

    // Then use special char to split array into [{'buildingName': [rows of data]}, ...]
    let container = [];
    let start = 0
    let end = holdThis.indexOf('*', start + 1);
    while (start < holdThis.length) {
      let toAdd = holdThis.slice(start, end)
      let objAdd = {}
      if (toAdd.length !== 0) {
          objAdd[toAdd[0]['Depto']] = []
          toAdd.map((item, index) => {
              if (index !== 0) {
                  objAdd[toAdd[0]['Depto']].push(item)
              }
          })
          container.push(objAdd)
      }
      start = end + 1
      end = holdThis.indexOf('*', start) !== -1 ? holdThis.indexOf('*', start) : holdThis.length - 1;
}
console.log(container, 'this is container')
    setCup(container)
  }

  return (
    <>
      <h1>hello from Filtered!</h1>

      { entries.length > 0 ? entries.map((entry) =>
        <FilteredTable info={entry} />) : null}
    </>
  )
}