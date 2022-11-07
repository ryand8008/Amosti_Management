import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from './context/ProjectContext'

export const UploadTable = ({exceldata, testing, fileName, showCosts} ) => {
  const [headers, setHeaders] = useState<string[]>([''])
  const [information, setInformation] = useState<any>([])

  const [month, setMonth] = useState<string>()

  useEffect(() => {
    // TODO: display subtotal for all!
    if (fileName === '') {
      const all = [] // remove subtotal for each workbook only for
      let tempTotal = 0;
      Object.values(testing).map((item: any) => item.unitInfo.map((item2) => all.push(item2))) //working code

      // checks if subtotal contained in row and removes it
      all.map((item, index) => typeof item['Depto'] === 'string' ?
       item['Depto'].toLowerCase() === 'subtotal' ? all.splice(index, 1) : null
        : null)

      setInformation(([]) => [...all])
      information[0] ? setMonth(information[0].Month) : null

    }

    if (testing && fileName !== '') {
      // refactored
      // !showCosts ? setInformation(([]) => [...testing[fileName]['unitInfo']]) : setInformation(([]) => [...testing[fileName]['costs']])
      if (!showCosts){
        setInformation(([]) => [...testing[fileName]['unitInfo']])
      } else {

        setInformation(([]) => [...testing[fileName]['costs']])
      }
    }

    if (information.length > 0) {
      setHeaders(Object.keys(information[0]))
    }
    // console.log(information)
    console.log(testing, 'this is testing and after clearing should be null or something')

  }, [headers.length, testing.length, fileName, information.length, showCosts, month])

  // TODO: implement running total to end of table, or somehwere else?
  return (
    <>
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
  margin-bottom: 10px;
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