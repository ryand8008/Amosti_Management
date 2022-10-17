import { AggregateContext } from "../context/ProjectContext";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";


// will receive just the month's information, so "{month: {'unitInfo': [], 'costs': []} }"
export const ReportTable = () => {
  // for testing purposes
  const building = 'Dragón'
  const year = 2022
  const month = 'enero'
  const classification = 'unitInfo'
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'junio', 'julio', 'agosto', 'sept', 'octubre',' noviem', 'diciem' ]


  //_______________________________________________________//
  const { aggregate } = useContext(AggregateContext)
  const [information, setInformation] = useState<string[]>(aggregate[building][year][month]) // will contain either unit information or costs info
  const [headers, setHeaders] = useState<string[]>([])
  const [units, setUnits] = useState<string[]>([])
  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([])
  useEffect(() => {

    // check how many months are recorded
    if (Object.keys(aggregate[building][year]).length !== 0) {
      setMonthsAvailable(Object.keys(aggregate[building][year]))
    }

    if (Object.keys(information).length > 0) {
      let bike = []
      information['unitInfo'].map((item) => {
            bike.push(item['Depto'])
        }
      )
      if (bike.indexOf('SUBTOTAL') > -1) {
        // slice the last element in array because it has 'subtotal' (hard coded for now)
        bike.splice(bike.length - 1, 1)

      }

      setUnits((units) => bike)
      console.log(bike)
    }

    // information check
    if (Object.values(information).length > 0) {
      console.log(information, 'info')
      // Object.values(information).map((item) => console.log(item, 'information map'))
    }
  }, [Object.values(aggregate).length, headers.length, Object.values(information).length, units.length, Object.keys(aggregate[building][year]).length])


console.log(information['unitInfo'], 'unitinfo')



  return (
    <>
      <h1>Report table</h1>
      <StyledTable>
        <>
        <tr>
          <th></th>
          { hardCodeMonths ? hardCodeMonths.map((mont) =>
            <th>{mont}</th>

            )
            : null
          }
          </tr>
        {/* <tr><td>leave blank</td></tr> */}
          {
            units.length > 0 ? units.map((item) =>
              <tr>
                <td>{item}</td>
              </tr>
            ) : null
          }


            {/* /* does not work, Won't show any moneys */ }

          {/* {information? information['unitInfo'] ? information['unitInfo'].map((item) =>
            <tr>
              <td>{item['Renta']}</td>
            </tr>
            ) : null : null} */}



              {/* {information['unitInto'] ? information['unitInfo'].map((item2) =>

               <tr>
                <td>{item2['Renta']}</td>
               </tr>
              )
                : null
              } */}











          {/* {aggregate[building][year] ? hardCodeMonths.map((month) =>
          {aggregate[building][year][month] ? aggregate[building][year][month].map((item) =>
              <tr>
                <td>{item['Depto']}</td>
              </tr>
            ) : null
          }

        ) :null
      } */}
        </>
      </StyledTable>
    </>
  )
}


const StyledTable = styled.table`
  display: flex;
`







// get table like UploadTable

// {
//   Object.values(information).length > 0 ?
//   information.map((item) =>
//     <tr>
//       {
//         Object.values(item).map((item2) => <td>{item2}</td>)
//       }
//     </tr>
//   )
//   :null
// }



//  Did not create one instance of dept, it was repeating...
{/* <tr>
          {
            hardCodeMonths ? hardCodeMonths.map((month) =>
            <>
              <tr><th>{month}</th></tr>

               { aggregate[building][year][month] ? aggregate[building][year][month]['unitInfo'].map((item =>
                <tr>
                  <td>{item['Depto']}</td>
                  <td>{item['Renta']}</td>
                </tr>
                ))
                : null
                }
              </>
            )

            : '...loading'
          }
        </tr> */}