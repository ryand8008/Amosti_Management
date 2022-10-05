import e from "cors";
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
  amount: number
  date_paid: Date
  apartment: string
  paid: boolean
}

// TODO: create a way to show the uploaded files
// TODO: delete a file and information
// TODO: batch add files

export const Upload = () => {
  const [excel, setExcel] = useState<Sheet[]>()
  const [filterBy, setFilterBy] = useState<string>('')
  // const [filterValue, setFilterValue] = useState<string>('')

  //testing filtered excel
  const [filteredExcel, setFilteredExcel] = useState()

  // filter by building => create array of array [ [building1], [building2]...]
  const [filterBuilding, setFilterBuilding] = useState<Sheet[]>();
  const [buildings, setBuildings] = useState<string[]>([])

  // generate report (boolean) => create separated tables
  const [generateReport, setGenerateReport] = useState<boolean>(false)
  const [buildingArray, setBuildingArray] = useState<Sheet[][]>([])

  // drag hook
  const [dragActive, setDragActive] = useState<boolean>(false);

  // display file names
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    console.log(excel)

    if (filterBy !== '' && excel) {
      // then use keys to filter and see if 'filterBy' is in the object
      const filterList: any = excel.filter((item) => {
        return item.building === filterBy
      })
      setFilteredExcel(filterList)
    } else {
      setFilteredExcel(null)
    }

    if (excel) {
      building()
    }

  }, [excel, filterBy, buildings.length, buildingArray.length])


  const building = async () => {
    await excel.map((item) => {
      if (!buildings.includes(item.building)) {
        setBuildings(([])=>[...buildings, item.building])
      }
    })
  }

  // filter buildings
  const filterBuildings = (filterWord) => {
    return excel.filter((item) => {
      return item.building === filterWord
    })
  }

  // create array of filtered arrays for individual tables
  const createFilteredBuildings = () => {
    let arrayBuilding = [];
    buildings.map((word) => {
      arrayBuilding.push(filterBuildings(word))
    })
    setBuildingArray(arrayBuilding)
  }

// TODO: check for duplicate file uploads so they do not add
//  -check file name
//  -check content

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const fileName = e.target.files[0]['name']
      if (!files.includes(fileName)) {
        setFiles(files => [...files, fileName])
      }

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

  // testing drag drop
  // XLSX is a global from the standalone script
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }


  return (
    <>
      <Window>

        <StyledTitle>hello from upload!</StyledTitle>
        <button onClick={() => {createFilteredBuildings(), setGenerateReport(!generateReport)}}>{generateReport ? 'return' : 'generate report'}</button>
      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input
          type='file'
          multiple={true}
          name='uploads'
          id='uploads'
          onChange={readUploadFile}
          />
          <label id='label-file-upload' htmlFor="uploads" className={dragActive ? 'drag-active' : ''}/>
          <DragBox id="drop_dom_element">{files.length > 0 ? files.map((item) => <ul>{item}</ul>) : 'upload files' }</DragBox>
      </form>
        {!generateReport ? excel ?
          <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(filterBy =>e.target.value)}>filter by
            <option value=''>{filterBy !== '' ? 'unfiltered' : 'select a filter'}</option>
            {buildings.length > 0 ? buildings.map((item)=>
              <option value={item}>{item}</option>
            )
            : null }
          </select>
          : null
          : null
        }
          {!generateReport ? filteredExcel ? <UploadTable exceldata={filteredExcel} /> : <UploadTable exceldata={excel} /> : null}

          {generateReport && buildingArray.length > 0 ? buildingArray.map((item) => <UploadTable exceldata={item} />) : null}
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

const DragBox = styled.div`
  display: flex;
  margin: auto;
  border: 1px solid black;
  height: 100px;
  width: 300px;
  justify-content: center;
  align-items: center;
`