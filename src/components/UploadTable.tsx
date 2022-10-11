import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from './context/ProjectContext'

interface newSheet {
  Depto: string
  Nombre: string
  Renta: number
  Deposito: string
  Corretaje: string
  Admon: number
  Gastos: string
  Cost: number
  Banknotes: number
  Count: number
  Totals: string
  Amount: number
}

type Test = {
  [x: string]: any;
  testing: any
}

// testing param is the split excel => {filename: {unitInfo: [], costs: []}}
export const UploadTable = ({exceldata, testing, fileName, showCosts} ) => {
  const [headers, setHeaders] = useState<string[]>([''])
  const [information, setInformation] = useState<any>([])

  // use context
  const {hello, aggregateW} = useContext(AggregateContext)
  console.log(aggregateW, 'aggre')
  // table month hook
  const [month, setMonth] = useState<string>()

  // running total hook
  const [runningTotal, setRunningTotal] = useState<number>()

  // console.log(Object.values(testing), 'this is values of testing') // Should be array - [filename: {unitInfo: [], costs: []}]

  useEffect(() => {
    // tempTotal +=
    // TODO: display subtotal for all!
    if (fileName === '') {
      const all = [] // remove subtotal for each workbook only for
      let tempTotal = 0;
      // console.log(tempTotal, 'temp total')
      Object.values(testing).map((item: any) => item.unitInfo.map((item2) => all.push(item2))) //working code

      // checks if subtotal contained in row and removes it
      all.map((item, index) => typeof item['Depto'] === 'string' ?
       item['Depto'].toLowerCase() === 'subtotal' ? all.splice(index, 1) : null
        : null)

      setRunningTotal(tempTotal)
      setInformation(([]) => [...all])
      // console.log(information[0], 'information should contain "{Month: <string>}"')
      information[0] ? setMonth(information[0].Month) : null

    }

    if (testing && fileName !== '') {
      // refactored
      // !showCosts ? setInformation(([]) => [...testing[fileName]['unitInfo']]) : setInformation(([]) => [...testing[fileName]['costs']])
      if (!showCosts){
        setInformation(([]) => [...testing[fileName]['unitInfo']])
      } else {

        setInformation(([]) => [...testing[fileName]['costs']])
        console.log(information, 'with costs')
        // setInformation(information.splice(0,1))
        // information.splice(0,1)
        console.log('after splice information: ', information)
      }
    }

    if (information.length > 0) {
      setHeaders(Object.keys(information[0]))
    }
    console.log(information)

  }, [headers.length, testing, fileName, information.length, showCosts, month])

  // TODO: implement running total to end of table, or somehwere else?
  return (
    <>
      {/* {fileName !== '' ? */}
      <StyledContainer>
        <StyledTitle>'Upload data here: '</StyledTitle>
        <StyledTable>
        <tbody>
          <tr><td>{`Month: ${month ? month : 'loading...'}`}</td></tr>
            <tr>
              {headers ? headers.map((item: string, index1: React.Key) =>
                <StyledHeader key={index1}>{item}</StyledHeader>
              ) : null}
            </tr>
            {information.length > 0 ? information.map((item, index) =>
              <tr>
                {
                headers.map((header) =>
                  <td>{item[header]}</td>
                )

            }
              </tr>

            ) :
              null}
            {/* <tr>{runningTotal ? runningTotal : 'borked'}</tr> */}

        </tbody>
        </StyledTable>
      </StyledContainer>
      {/* : null} */}
    </>

  )
}

const StyledContainer = styled.div`
  display: flex;
  border: 1px solid;
  flex-direction: column;
  margin-top: 10px;
  width: fit-content;
  border-radius: 5px;
`

const StyledTitle = styled.h1`
  text-align: center;
`
const StyledTable = styled.table`
  display: flex;
  border: 1px solid;
  // flex-direction: column;
`


const StyledHeader = styled.th`
  text-align: center;
  border: 1px solid black;
`