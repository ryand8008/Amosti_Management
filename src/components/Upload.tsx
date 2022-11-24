import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from "./context/ProjectContext";
import { Filtered } from "./filtered/Filtered";
import { FullReport } from "./Report/FullReport";
import { Report } from "./Report/Report";
import { UploadTable } from "./UploadTable";

var xlsx = require("xlsx");

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: boolean | undefined
    webkitdirectory?: string;
  }
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
  const { aggregate, setAggregate, gatherInfo, showReport, setShowReport, reportInfo, setReportInfo } = useContext(AggregateContext)

  // stringified aggre
  let stringAgg = JSON.stringify(aggregate)
  const [excel, setExcel] = useState<newSheet[]>()

  // testing SPLIT EXCEL
  const [splitExcel, setSplitExcel] = useState<any>({})

  // new sheet
  const [newExcel, setNewExcel] = useState<any>({})

  const [showCosts, setShowCosts] = useState<boolean>(false)

  const [filterBy, setFilterBy] = useState<string>('')

  //testing filtered excel
  const [filteredExcel, setFilteredExcel] = useState()

  // generate report (boolean) => create separated tables
  const [generateReport, setGenerateReport] = useState<boolean>(false)

  // drag hook
  const [dragActive, setDragActive] = useState<boolean>(false);

  // display file names
  const [files, setFiles] = useState<string[]>([])

  // two buttons
  const [showIndividual, setShowIndividual] = useState<boolean>(false)

  const [showFull, setShowFull] = useState<boolean>(false)
  let stringSplitExcel = JSON.stringify(splitExcel)
  // // checking aggregate
  const [testing, setTesting] = useState<any>({})

  useEffect(() => {
    if (Object.keys(splitExcel).length > 0) {
      splittingFunction(splitExcel)
      // console.log(testing, 'this is testing in useeffect')
      setAggregate(testing)
    }

  }, [stringAgg, Object.keys(splitExcel).length, files.length, showFull, showIndividual])


  const splittingFunction = async (splitExcel) => {
    const filesNames = Object.keys(splitExcel)

    filesNames.forEach((file, index) => {
      let fileInfo = splitExcel[file]['unitInfo'];
      let [year, month, buildingName] =  [fileInfo[0]['Año'], fileInfo[0]['Mes'].toLowerCase(), fileInfo[0]['Depto']]

      try {

        if (Object.keys(testing).length === 0) {
          setTesting(current => {
            let temp = {}
            temp[buildingName] = {[year]: {}}
            temp[buildingName][year] = {[month]: {}}
            temp[buildingName][year][month] = splitExcel[file]
            return temp;
          })
        } else if (!testing[buildingName]) {
          setTesting(current => {
          let temp = {...current}
            temp[buildingName] = {[year]: {}}
            temp[buildingName][year] = {[month]: {}}
            temp[buildingName][year][month] = splitExcel[file]
            return temp;
          })
        } else if (testing[buildingName][year]) {
          setTesting(current => {
            let temp = {...current}
            temp[buildingName] = testing[buildingName]
            temp[buildingName][year] = {...temp[buildingName][year], ...{[month]: splitExcel[file]}}

            return temp;
          })
        }
      } catch {
        console.log('testing')
      }
    })
  }


// find the location of key = Month: 'Gastos'
const findGastos = (json)=>{
  let gastosIndex;

  json.map((item,index)=>{
      if (item['Año'] === 'Gastos') {
          gastosIndex = index
      }
  }
  )
  return gastosIndex

}

  // TODO: handle multiple file upload
  const readUploadFile = async (e) => {
    e.preventDefault();


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

          // skip first two rows to read file correctly for key pointers
          var range = xlsx.utils.decode_range(worksheet['!ref']);
          range.s.r = 2;

          var newRange = xlsx.utils.encode_range(range);

          const jsonMaster = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, blankrows: true});

          // how to handle error for invalid file format or type
          if (!Object.keys(jsonMaster[0]).includes('Año')) {
            alert('invalid file')
            // throw new Error ('invalid file type')

            files.splice(files.indexOf(fileName), 1)
          } else {
          // raw data sheet

          // if entry doesn't exist make it using aggregate for use context
          [year, month, buildingName] =  [jsonMaster[0]['Año'], jsonMaster[0]['Mes'].toLowerCase(), jsonMaster[0]['Depto']]
          holding2 = {
            [buildingName]: {
              [year]: {
                [month]: {
                  'unitInfo': [],
                  'costs': []
                }
              }
            }
          }
          // await gatherInfo(holding2, buildingName, year, month)

          //check file type
          // console.log(jsonMaster, 'this is master')

          // create two arrays, [units info] | [total costs] => refactor later****
          for (let i = 0; i < 2; i++) {
            if (i === 0) {
              var range = xlsx.utils.decode_range(worksheet['!ref']);

              range.s.r = 2;
              range.e.r = findGastos(jsonMaster)+1;

              var newRange = xlsx.utils.encode_range(range);
              const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, blankrows: true});
              holding[fileName].unitInfo.push(...json)
              holding2[buildingName][year][month]['unitInfo'] = [...json]
            } else if (i === 1) {
              var range = xlsx.utils.decode_range(worksheet['!ref']);
              range.s.r = findGastos(jsonMaster)+1;
              range.e.r = jsonMaster.length+1;
              var newRange = xlsx.utils.encode_range(range);
              const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, header: ['Gastos', 'Cost', 'Notas', 'Billetes o Moneda', 'Cantidad', 'TOTALS']});
              let newJson = json.slice(1, json.length)
              holding[fileName].costs.push(...newJson)
              holding2[buildingName][year][month]['costs'].push(...newJson)
            }
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

      console.log(splitExcel, 'this is split excel')
      console.log(Object.entries(splitExcel), 'this should have a 0 length')
      // setSplitExcel({})
      // setSplitExcel(null)

      setShowCosts(false)
      // setAggregate({})
      // setReportInfo(null)
      console.log(aggregate, 'should be null')
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

  const handleRemoveFile = (file) => {



    let year = splitExcel[file]['unitInfo'][0]['Año'];
    let month = splitExcel[file]['unitInfo'][0]['Mes'].toLowerCase();
    let buildingName = splitExcel[file]['unitInfo'][0]['Depto']

    console.log(aggregate, 'this is aggregate in handleRemove')


    setAggregate(current => {
      const copy = {...current};
      delete copy[buildingName][year][month]
      return copy
    })

    setFiles( current => {
      const copy = [...current]
      copy.splice(copy.indexOf(file), 1)
      return copy
    })

    setSplitExcel(current => {
      const copy = {...current};
      delete copy[file];
      return copy;
    })

    setTesting({})


  }

  return (
    <>
      <Window>

        {/* <StyledTitle>Amosti Management</StyledTitle> */}

      <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input
          type='file'
          multiple={true}
          name='uploads'
          id='uploads'
          onChange={readUploadFile}
          // webkitdirectory="" // will allow file upload, but not single files
          />
        <label id='label-file-upload' htmlFor="uploads" className={dragActive ? 'drag-active' : ''}/>
        <DragBox id="drop_dom_element">{files.length >= 1 ? files.map((item) => <ul>{item}<span onClick={() => handleRemoveFile(item)}> X</span></ul>) : 'upload files' }</DragBox>
        {/* {Object.entries(splitExcel).length > 0 && aggregate ? */}
        {/* {aggregate ?
        <>
          <button onClick={(e) => handleClear(e)}>
            clear files
          </button>
        </>
         : null} */}
      </form>

         {/* Make both visible but not functional when one view is active over the other */}
      <button onClick={() => setShowIndividual(!showIndividual)}>{showIndividual ? 'close' : 'show Individual'}</button>
      <button onClick={() => setShowFull(!showFull)}>show full</button>
      {showIndividual ? <Report /> : null}
      {showFull ? <FullReport /> : null}
      {/* {aggregate ? <Report /> : null} */}
      {/* {aggregate ? <Report /> : null} */}
      {aggregate ?
        <>
          <ContentsButton onClick={() => setGenerateReport(!generateReport)}>{!generateReport ? 'show uploaded file contents' : 'close'}</ContentsButton>
        </>
          : null}
      {generateReport ? <div>
        { files.length > 0 ?
          <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterBy(filterBy =>e.target.value)}>filter by
            <option value=''>{filterBy !== '' ? 'show all files' : 'select a file'}</option>
            {files.length > 0 ? files.map((file) =>
              <option value={file}>{file}</option>
            )
            : null
          }
          </select>
          : null
        }
          {Object.values(splitExcel).length > 0?
           filteredExcel ? <UploadTable exceldata={filteredExcel} testing={splitExcel} fileName={filterBy} showCosts={showCosts}/> : <UploadTable exceldata={newExcel} testing={splitExcel} fileName={filterBy} showCosts={showCosts} />
           : null}

          {filterBy !== '' ? <button onClick={() => setShowCosts(() => !showCosts)}>{showCosts ? 'show unit info' : 'show costs'}</button> : null}

          </div> : null}
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
  padding-top: 10px;
  margin-bottom: 25px;
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

const ContentsButton = styled.button`
  margin-top: 25px;
`
