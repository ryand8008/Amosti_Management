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
 'amount': number
 'date_paid': Date
 apartment: string
 'paid': boolean
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
  const [buildingArray, setBuildingArray] = useState<Sheet[]>()

  // drag hook
  const [dragActive, setDragActive] = useState<boolean>(false);

  // display file names
  const [files, setFiles] = useState<string[]>([])

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

    if (excel) {
      building()
      // console.log(buildings)
      // testfilter()
      // console.log(buildingArray, 'building array')
    }

    console.log(files, 'this is files')

  }, [excel, filterBy, buildings.length])


  const building = async () => {
    await excel.map((item) => {
      if (!buildings.includes(item.building)) {
        setBuildings(([])=>[...buildings, item.building])
      }
    })
  }


  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      console.log(e.target.files.length)
      const testArray = Array.from(e.target.files)
      console.log(testArray, 'test array')
      let array = [];
      testArray.map((item: any, index) => {
        array.push(item.name)
      })
      setFiles(array)
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

  const showFiles = () => {
    console.log( 'this is file list')
  }

  const testfilter = () => {
    buildings.map((entry) => {
      let testing = excel.map((item) => {
        if (item.building === entry) {
          setBuildingArray(([])=>[...buildingArray, item])
        }
      })
      console.log(testing, 'this is testing')
    })
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
        {/* <label>upload file!</label> */}
        {/* <button onClick={(e) => setGenerateReport(!generateReport)}>generate report</button> */}
        {/* <button onClick={}>generate report</button> */}
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
        {excel ?
          <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(filterBy =>e.target.value)}>filter by
            <option value=''>{filterBy !== '' ? 'unfiltered' : 'select a filter'}</option>
            {buildings.length > 0 ? buildings.map((item)=>
              <option value={item}>{item}</option>
            )
            : null }
          </select>
          : null
        }
          {filteredExcel ? <UploadTable exceldata={filteredExcel} /> : <UploadTable exceldata={excel} />}
          {/* {generateReport ? excel.map((item, index) => )        : null} */}
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
  border: 1px solid black;
  height: 300px;
  width: 150px;
`