import React from "react";
import styled from "styled-components";

// interface FilteredTable {
//   info: any
//   building: any
// }

export const FilteredTable = ({info}) => {

  // console.log(info[1], 'building')
  // console.log(info[1].map((item) => Object.values(item)))
  const headers = info[1].map((item) => Object.keys(item))
  // console.log(headers, 'this is headers')
  const values = info[1].map((item) => Object.values(item))
console.log(values.map((item) => item.map((item2) => console.log(item2, '2'))))

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