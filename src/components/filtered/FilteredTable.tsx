import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";

// interface FilteredTable {
//   info: any
//   building: any
// }

export const FilteredTable = ({info}) => {
  const [filterInfo, setFilterInfo] = useState<any>(info)
  const { aggregate } = useContext(AggregateContext)

  useEffect(() => {
    setFilterInfo(info)
    // console.log(info, 'this is info')

  }, [info])

  const [buildingName, setBuildingName] = useState<string>()
  // console.log(info[1], 'building')
  const headers = filterInfo[1].map((item) => Object.keys(item))
  const values = filterInfo[1].map((item) => Object.values(item))

  const building = Object.keys(aggregate)
  // console.log(building, 'this is grouped')
// Object.values(aggregate).map((item, index) => {
//     console.log(item)
//   })



  return (
    <>
    <Container>
      {/* <h1>hello from FilteredTable</h1> */}
      <h2>{`building: ${filterInfo[0]}`}</h2>
      <h2>{}</h2>
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
      </Container>
    </>
  )
}

const StyledRow = styled.td`
  display: flex;
`

const Container = styled.div`
  border-bottom: 1px solid black;
  // border-radius: 3px;
`