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

interface Test {
  excelData: Sheet
}


export const UploadTable = ({exceldata} ) => {
  const [headers, setHeaders] = useState<string[]>([''])

  useEffect(() => {
    if (exceldata) {
      setHeaders(Object.keys(exceldata[0]))
      console.log(exceldata[0], 'this is excel data')
      console.log(exceldata[1], 'this is excel[1]')
      console.log(headers, 'headers')
    }

  }, [exceldata, headers.length])


  return (
    <>
      <StyledContainer>
        <StyledTitle>Hello from upload table!</StyledTitle>
        <StyledTable>
        <tbody>

        <tr>
          {headers ? headers.map((item: string, index1: React.Key) =>
            <StyledHeader key={index1}>{item}</StyledHeader>
            ): null}
        </tr>
            {exceldata ? exceldata.map((item) =>
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