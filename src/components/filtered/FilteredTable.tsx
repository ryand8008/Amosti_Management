import React from "react";

// interface FilteredTable {
//   info: any
//   building: any
// }

export const FilteredTable = ({info}) => {

  console.log(info[0], 'building')

  return (
    <>
      <h1>hello from FilteredTable</h1>
      <h2>{`building: ${info[0]}`}</h2>

    </>
  )
}