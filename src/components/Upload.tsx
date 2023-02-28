import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from "./context/ProjectContext";

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

// TODO: create a way to show the uploaded files => DONE
// TODO: delete a file and information => DONE
// TODO: batch add files
// TODO: Handle multiple years

export const Upload = () => {
  const { aggregate, setAggregate,  showReport, setShowReport, reportInfo, setReportInfo, yearsAvailable, setYearPicked, yearPicked } = useContext(AggregateContext)

  // stringified aggre
  let stringAgg = JSON.stringify(aggregate)
  const [excel, setExcel] = useState<newSheet[]>()

  // testing SPLIT EXCEL
  const [splitExcel, setSplitExcel] = useState<any>({})

  // drag hook
  const [dragActive, setDragActive] = useState<boolean>(false);

  // display file names
  const [files, setFiles] = useState<string[]>([])

  // // checking aggregate
   const [parsedInfo, setParsedInfo] = useState<any>({})

   const showIndividual = false; // temp DELETE AFTER REFACTOR
   const showFull = false; // temp DELETE AFTER REFACTOR

  useEffect(() => {

    if (Object.keys(splitExcel).length > 0) {
      splittingFunction(splitExcel)

      setAggregate(() => parsedInfo)

    }

  }, [JSON.stringify(parsedInfo).length, JSON.stringify(aggregate), stringAgg, Object.keys(splitExcel).length, files.length, yearsAvailable, yearPicked])

  // parses aggregate information
  const splittingFunction = async (splitExcel) => {

    const filesNames = Object.keys(splitExcel)

    filesNames.forEach((file, index) => {
      let fileInfo = splitExcel[file]['unitInfo'];
      let [year, month, buildingName] =  [fileInfo[0]['Año'], fileInfo[0]['Mes'].toLowerCase(), fileInfo[0]['Depto']]

      try {

        if (Object.keys(parsedInfo).length === 0) {
          setParsedInfo(current => {
            let temp = {}
            temp[buildingName] = {[year]: {}}
            temp[buildingName][year] = {[month]: {}}
            temp[buildingName][year][month] = splitExcel[file]
            return temp;
          })
        } else if (!parsedInfo[buildingName]) {
          setParsedInfo(current => {
          let temp = {...current}
            temp[buildingName] = {[year]: {}}
            temp[buildingName][year] = {[month]: {}}
            temp[buildingName][year][month] = splitExcel[file]
            return temp;
          })
        } else if (parsedInfo[buildingName]) {
          if (!parsedInfo[buildingName][year]) {
            setParsedInfo(current => {
              let temp = {...current}
              temp[buildingName] = {...temp[buildingName], ...{[year]: {[month]: splitExcel[file]}}}
              parsedInfo[buildingName] = temp[buildingName]
              return temp;
            })

          }
          else if (parsedInfo[buildingName][year]) {
            setParsedInfo(current => {
              let temp = {...current}
              temp[buildingName] = parsedInfo[buildingName]
              temp[buildingName][year] = {...temp[buildingName][year], ...{[month]: splitExcel[file]}}

              return temp;
            })
          }
        }
      } catch {
        console.log('ERROR: UPLOAD ISSUE')
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
      })
    return gastosIndex
  }

  // TODO: handle multiple file upload
  const readUploadFile = async (e) => {
    e.preventDefault();


    // test newSheet array
    let holding: any = {}

    if (e.target.files) {
      const filesToRead = Object.values(e.target.files)

      // ADD POP UP TO CONFIRM

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

          // create two arrays, [units info] | [total costs] => refactor later****
          for (let i = 0; i < 2; i++) {
            if (i === 0) {
              var range = xlsx.utils.decode_range(worksheet['!ref']);

              range.s.r = 2;
              range.e.r = findGastos(jsonMaster)+1;

              var newRange = xlsx.utils.encode_range(range);
              const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, blankrows: true});
              holding[fileName].unitInfo.push(...json)
            } else if (i === 1) {
              var range = xlsx.utils.decode_range(worksheet['!ref']);
              range.s.r = findGastos(jsonMaster)+1;
              range.e.r = jsonMaster.length+1;
              var newRange = xlsx.utils.encode_range(range);
              const json = xlsx.utils.sheet_to_json((worksheet), {defval:"", range: newRange, header: ['Gastos', 'Cost', 'Notas', 'Billetes o Moneda', 'Cantidad', 'TOTALS']});
              let newJson = json.slice(1, json.length)
              holding[fileName].costs.push(...newJson)
            }
          }
        }
          // ADD HERE A POP UP
            setSplitExcel({...splitExcel, ...holding})
        };
        reader.readAsArrayBuffer(file);

      })

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

    if (JSON.stringify(aggregate) === '{}') {
      delete parsedInfo[buildingName][year][month]
      setAggregate(parsedInfo)
    }
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

    // need to handle if reportInfo is {} or not
    if (Object.keys(reportInfo).length > 0) {
      setReportInfo({})
    }

    // needed to reset and re-render based off new raw data
    setParsedInfo({})

  }


  return (
    <>
      <Window>

      { !showFull ? <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      { !showIndividual ? <><input
            type='file'
            multiple={true}
            name='uploads'
            id='uploads'
            onChange={readUploadFile} /><label id='label-file-upload' htmlFor="uploads" className={dragActive ? 'drag-active' : ''} /><DragBox id="drop_dom_element">{files.length >= 1 ? files.map((item) => <StyledTest>{item}<span><DeleteButton onClick={() => handleRemoveFile(item)}>delete</DeleteButton></span></StyledTest>) : 'upload files'}</DragBox></> : null}
      </form> : null}
      </Window>
    </>
  )
}


const StyledTest = styled.div`
  display: flex;
`
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

const DeleteButton = styled.button`
  background-color: #e65555;
  margin-left: 8px;
`

const Confirm = styled.button`
  background-color: #c8f5b8;
  background-image: linear-gradient(#37ADB2, #329CA0);
  border: 1px solid #2A8387;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px;
  color: #FFFFFF;
  cursor: pointer;
  display: block;
  font-family: -apple-system,".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 17px;
  line-height: 100%;
  margin: 0;
  outline: 0;
  padding: 11px 15px 12px;
  text-align: center;
  transition: box-shadow .05s ease-in-out,opacity .05s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100%;
`

const Verify = styled.div`
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
`

const VerifyButton = styled.button`

  background-color: #c8f5b8;
  background-image: linear-gradient(#37ADB2, #329CA0);
  border: 1px solid #2A8387;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px;
  color: #FFFFFF;
  cursor: pointer;
  display: block;
  font-family: -apple-system,".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size: 17px;
  line-height: 100%;
  margin: 0;
  outline: 0;
  padding: 11px 15px 12px;
  text-align: center;
  transition: box-shadow .05s ease-in-out,opacity .05s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100%;
  margin-bottom: 10px;
`