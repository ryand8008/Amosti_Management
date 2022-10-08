import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Sheet {
  filter(arg0: (item: any) => void): unknown;
  corredora: string
  tenant_name: string
  building: string
  month: string
 'amount': number
 'date_paid': Date
 apartment: string
 'paid': boolean
}

interface newSheet {
  Depto: string
  Nombre: string
  Renta: number
  Deposito: string | ''
  Corretaje: string | ''
  Admon: number
  Gastos: string
  Cost: number
  Banknotes: number
  Count: number
  Totals: string
  Amount: number
}

// type Costs = {

// }

type Test = {
  [x: string]: any;
  excelData: Sheet
  testing: any
}

// testing param is the split excel => {filename: {unitInfo: [], costs: []}}
export const UploadTable = ({exceldata, testing, fileName, showCosts} ) => {
  const [headers, setHeaders] = useState<string[]>([''])
  const [information, setInformation] = useState<any>([])

  // unfiltered hook
  const [unfiltered, setUnfiltered] = useState()

  // console.log(Object.values(testing), 'this is values of testing') // Should be array - [filename: {unitInfo: [], costs: []}]

  useEffect(() => {

    if (fileName === '') {
      const all = []
      Object.values(testing).map((item: any) => item.unitInfo.map((item2) => all.push(item2)))
      setInformation(([]) => [...all])

    }

    if (testing && fileName !== '') {
      if (!showCosts){
        setInformation(([]) => [...testing[fileName]['unitInfo']])
      } else {
        setInformation(([]) => [...testing[fileName]['costs']])
      }
    }

    if (information.length > 0) {
      setHeaders(Object.keys(information[0]))
    }
  }, [headers.length, testing, fileName, information.length, showCosts])


  return (
    <>
      {/* {fileName !== '' ? */}
      <StyledContainer>
        <StyledTitle>Hello from upload table!</StyledTitle>
        <StyledTable>
        <tbody>

        <tr>
          {headers ? headers.map((item: string, index1: React.Key) =>
            <StyledHeader key={index1}>{item}</StyledHeader>
            ): null}
        </tr>
            {information.length > 0 ? information.map((item) =>
              <tr>
              {headers.map((header) =>
                <td>{item[header]}</td>
              )}
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
  border: 1px solid red;
  flex-direction: column;
  margin-top: 10px;
  width: fit-content;
`

const StyledTitle = styled.h1`
  text-align: center;
`
const StyledTable = styled.table`
  display: flex;
  border: 1px solid black;
  // flex-direction: column;
`


const StyledHeader = styled.th`
  text-align: center;
  border: 1px solid black;
`