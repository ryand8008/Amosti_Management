import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from "./context/ProjectContext";
import { Filtered } from "./filtered/Filtered";
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

interface Testing {
  testing: any
}

// TODO: create a way to show the uploaded files
// TODO: delete a file and information
// TODO: batch add files

export const Upload = () => {
  const { aggregate, setAggregate, mergeToAgg, gatherInfo } = useContext(AggregateContext)

  const [excel, setExcel] = useState<newSheet[]>()

  // testing SPLIT EXCEL
  const [splitExcel, setSplitExcel] = useState<any>({})

  // new sheet
  const [newExcel, setNewExcel] = useState<any>({})

  const [showCosts, setShowCosts] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string>('')
  // const [filterValue, setFilterValue] = useState<string>('')

  //testing filtered excel
  const [filteredExcel, setFilteredExcel] = useState()

  // generate report (boolean) => create separated tables
  const [generateReport, setGenerateReport] = useState<boolean>(false)

  // drag hook
  const [dragActive, setDragActive] = useState<boolean>(false);

  // display file names
  const [files, setFiles] = useState<string[]>([])

  // checking aggregate
  useEffect(() => {


  }, [aggregate, newExcel])



// find the location of key = Month: 'Gastos'
const findGastos = (json)=>{
  let gastosIndex;

  json.map((item,index)=>{
      if (item.Year === 'Gastos') {
          gastosIndex = index
      }
  }
  )
  return gastosIndex

}



  // TODO: handle multiple file upload
// TODO: need to figure out how to access fileList and update synchonously ***
  const readUploadFile = async (e) => {
    e.preventDefault();

    let arrayyyy = [];

    // test newSheet array
    let holding: any = {}
    let holding2: any = {}
    let buildingName;
    let year;
    let month;

    if (e.target.files) {
      const filesToRead = Object.values(e.target.files)

      filesToRead.map((file: any, index) => {
        const fileName = file['name']
        holding[fileName] = {'unitInfo': [], 'costs': []}
        // console.log(holding, 'test object') // should be {MultipleTEST.xslx : {unitinfo: [], costs: []}}
        if (!files.includes(fileName)) {
          setFiles(files => [...files, fileName])
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target.result
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // raw data sheet
          const jsonMaster = xlsx.utils.sheet_to_json((worksheet));
          // if entry doesn't exist make it using aggregate for use context
          [year, month ,buildingName] =  [jsonMaster[0]['Year'], jsonMaster[0]['Month'], jsonMaster[0]['Depto']]

          holding2 = {
            [buildingName]: {
              [year]: {
                [month]:
                  {
                    'unitInfo': [],
                    'costs': []
                  }
              }
            }
          }
          gatherInfo(holding2, buildingName, year)



          // create two arrays, [units info] | [total costs] => refactor later****
          for (let i = 0; i < 2; i++) {
            if (i === 0) {
              var range = xlsx.utils.decode_range(worksheet['!ref']);
              range.s.r = 0;
              range.e.r = findGastos(jsonMaster);

              var newRange = xlsx.utils.encode_range(range);
              // const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, blankrows: false});
              const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, blankrows: true});
              holding[fileName].unitInfo.push(...json)
              holding2[buildingName][year][month]['unitInfo'] = [...json]
            } else if (i === 1) {
              var range = xlsx.utils.decode_range(worksheet['!ref']);
              range.s.r = findGastos(jsonMaster)+1;
              range.e.r = jsonMaster.length+1;
              var newRange = xlsx.utils.encode_range(range);
              const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, header: ['Gastos', 'Cost', 'Banknotes', 'Count', 'Totals', 'Amount']});
              let newJson = json.slice(1, json.length)
              holding[fileName].costs.push(...newJson)
              holding2[buildingName][year][month]['costs'].push(...newJson)
            }
          }

            setSplitExcel({...splitExcel, ...holding})
        };
        reader.readAsArrayBuffer(file);
      })
    }
  }


  // handle clear fileList
  const handleClear = (e) => {
    const element: any = document.getElementById("uploads")
    if (element.files.length > 0) {
      element.value = ''
      setExcel(null)
      setFiles([])
      setFilteredExcel(null)
      setSplitExcel({})
      setShowCosts(false)
      setAggregate(null)
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

        <StyledTitle>Insert Title Here (main)</StyledTitle>

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
        {Object.entries(splitExcel).length > 0 ?
        <>
          {/* <button onClick={() => { setGenerateReport(!generateReport); } }>
            {generateReport ? 'return' : 'generate report'}
          </button> */}
          <button onClick={(e) => handleClear(e)}>
            clear files
          </button>
        </>
         : null}
      </form>
        {!generateReport ? files.length > 0 ?
          <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(filterBy =>e.target.value)}>filter by
            <option value=''>{filterBy !== '' ? 'show all files' : 'select a file'}</option>
            {files.length > 0 ? files.map((file) =>
              <option value={file}>{file}</option>
            )
            : null
          }
          </select>
          : null
          : null
        }
          {/* {!generateReport && splitExcel && filterBy !== '' ? */}
          {!generateReport &&  Object.values(splitExcel).length > 0?
           filteredExcel ? <UploadTable exceldata={filteredExcel} testing={splitExcel} fileName={filterBy} showCosts={showCosts}/> : <UploadTable exceldata={newExcel} testing={splitExcel} fileName={filterBy} showCosts={showCosts} />
           : null}

          {filterBy !== '' ? <button onClick={() => setShowCosts(() => !showCosts)}>{showCosts ? 'show unit info' : 'show costs'}</button> : null}
          {/* {Object.values(splitExcel).length > 0 && filterBy !== '' ? <button onClick={() => setShowCosts(() => !showCosts)}>{showCosts ? 'show unit info' : 'show costs'}</button> : null} */}
          {/* <Filtered  data={splitExcel}/> */}
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
  min-width: 300px;
  width: fit-content;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  flex-direction: column;
  height: fit-content;
`
const listitem = styled.ul`
  margin: auto;
  flex-direction: column;
  height: fit-content;
`

