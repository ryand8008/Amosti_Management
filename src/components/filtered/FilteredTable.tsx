import React, { useState } from "react";
import styled from "styled-components";

// interface FilteredTable {
//   info: any
//   building: any
// }

export const FilteredTable = ({info}) => {

  const [buildingName, setBuildingName] = useState<string>()
  // console.log(info[1], 'building')
  const headers = info[1].map((item) => Object.keys(item))
  const values = info[1].map((item) => Object.values(item))

  return (
    <>
      <h1>hello from FilteredTable</h1>
      <h2>{`building: ${info[0]}`}</h2>
      <table>

        <tr>
          {headers[0].map((item) =>
            <th>{item}</th>
          )}
        </tr>
        {values.map((item) =>
          <tr>
            {item.map((item2) =>

              <td>{item2}</td>

            )}
          </tr>
        )
        }
      </table>

    </>
  )
}

const StyledRow = styled.td`
  display: flex;
`