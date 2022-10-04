import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Sheet {
  corredora: string
  tenant_name: string
  building: string
  month: string
 'amount (if false left over balance)': number
 'date_paid (mm/dd/yyyy)': Date
 apartment: string
 'paid (boolean)': boolean
}

interface Test {
  excelData: Sheet
}


export const UploadTable = ({exceldata} ) => {
  const [headers, setHeaders] = useState<string[]>([''])
  const [filterBy, setFilterBy] = useState<string>('')
  console.log(exceldata, 'uploadtable exceldata TESTING')

  useEffect(() => {
    console.log(exceldata, 'this is exceldata' )
    if (exceldata) {
      setHeaders(Object.keys(exceldata[0]))

      console.log(headers)
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
        <tr>

        </tr>

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