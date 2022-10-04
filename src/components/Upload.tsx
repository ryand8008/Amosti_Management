import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isExportDeclaration } from "typescript";
import { UploadTable } from "./UploadTable";

var xlsx = require("xlsx");

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

export const Upload = () => {
  const [excel, setExcel] = useState<Sheet>()


  useEffect(() => {
    if (excel) {
      console.log(excel, 'this is excel')

    }
  }, [excel])

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        // console.log(json); // original line
        setExcel(json)
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }


  return (
    <>
      <Window>

        <StyledTitle>hello from upload!</StyledTitle>
        {/* <label>upload file!</label> */}
        <input
          type='file'
          name='upload'
          id='upload'
          onChange={readUploadFile}
          />
          <UploadTable exceldata={excel} />
      </Window>
    </>
  )
}

const StyledTitle = styled.h1`
  display: flex;
  text-align: center;
`

const Window = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`