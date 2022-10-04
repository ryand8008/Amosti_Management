import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isExportDeclaration } from "typescript";
import { UploadTable } from "./UploadTable";

var xlsx = require("xlsx");

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

export const Upload = () => {
  const [excel, setExcel] = useState<Sheet[]>()
  const [filterBy, setFilterBy] = useState<string>('')
  // const [filterValue, setFilterValue] = useState<string>('')

  //testing filtered excel
  const [filteredExcel, setFilteredExcel] = useState()

  // filter by building => create array of array [ [building1], [building2]...]
  const [filterBuilding, setFilterBuilding] = useState<Sheet[]>();
  const [buildings, setBuildings] = useState<string[]>([])

  useEffect(() => {

    if (filterBy !== '' && excel) {

      // then use keys to filter and see if 'filterBy' is in the object
      const filterList: any = excel.filter((item) => {
        return item.building === filterBy
      })
      setFilteredExcel(filterList)

    } else {
      setFilteredExcel(null)
    }

    console.log(filterBy, 'this is filter')
    console.log(excel, 'excel')
  }, [excel, filterBy])


  // const building = () => {
  //   const
  // }


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
        if (!excel) {
          setExcel(json)
        } else {
          setExcel(([]) => [...excel, ...json])
        }
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
          multiple
          name='uploads'
          id='uploads'
          onChange={readUploadFile}
          />
        {excel ?
          <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(filterBy =>e.target.value)}>filter by
            <option value=''>{filterBy !== '' ? 'unfiltered' : 'select a filter'}</option>
            <option value='Building One'>Building One</option>
            <option value='Building Two'>Building Two</option>
            <option value='Building Three'>Building Three</option>
            <option value='Building Four'>Building Four</option>
          </select>
          : null
        }
          {filteredExcel ? <UploadTable exceldata={filteredExcel} /> : <UploadTable exceldata={excel} />}
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