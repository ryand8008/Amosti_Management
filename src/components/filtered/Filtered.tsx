import React, { useState } from "react";
import { FilteredTable } from "./FilteredTable";

export const Filtered = ({data}) => {
  const fileName = 'MultipleTEST.xlsx'
  // headers hook
  const [headers, setHeaders] = useState<string[]>()
  if (data[fileName]) {

    // replace the empty rows with a distinct char like '*
    let holdThis = [] // temp array with replaced char

    data[fileName]['unitInfo'].map((item) => {
      if (item['Depto'] === '') {
        holdThis.push('*')
      } else {
        holdThis.push(item)
      }
    })

    // Then use special char to split array into [{'buildingName': [rows of data]}, ...]
    let container = [];
    let start = holdThis.indexOf('*', 0);
    let end = holdThis.indexOf('*', start + 1);
    while (start < holdThis.length ) {
        let toAdd = holdThis.slice(start + 1, end)
        let objAdd = {}
        if (toAdd.length !== 0) {
            objAdd[toAdd[0]['Depto']] = []
            toAdd?.map((item, index) => {
                // console.log(item)
                if (index !== 0) {
                    objAdd[toAdd[0]['Depto']].push(item)
                }
            })
            container.push(objAdd)
        }
        start = end + 1
        end = holdThis.indexOf('*', start);
}
    console.log(holdThis, 'this is replaced')
    console.log(container, 'this is container')
  }
  return (
    <>
      <h1>hello from Filtered!</h1>
      <FilteredTable />
    </>
  )
}