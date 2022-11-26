import React, { useEffect, useState } from "react";


interface ReportType {
  aggregate: any
  setAggregate: (newInformation) => any;
  reportInfo: (buildingName: any[]) => void;
  setReportInfo: (any) => any;
  yearsAvailable: string[];
  yearPicked: string
  setYearPicked: (string) => any;
  showReport: boolean;
  setShowReport: (bool) => any;
  testingUnit: (uni) => any;

}
// reportInfo = {
//   buildingName = {}
// }

export const AggregateContext = React.createContext<ReportType | null>(null)

const AggregateProvider = ({children}) => {
  // uploaded information
  const [aggregate, setAggregate] = useState<any>()
  const aggregateStringified = JSON.stringify(aggregate)
  const [showReport, setShowReport] = useState<boolean>(false)
  // report information
  const [reportInfo, setReportInfo] = useState<any>({})
  // reportInfo 2
  const [report2, setReport2] = useState<any>()
  const [yearPicked, setYearPicked] = useState<string>()
  const [yearsAvailable, setYearsAvailable] = useState<string[]>([])
  let yearsStringified = JSON.stringify(yearsAvailable)

  const [buildings, setBuildings] = useState<string[]>([])

  let buildingsStringified = JSON.stringify(buildings)

  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([])
  let monthsStringified = JSON.stringify(monthsAvailable)

   const [testReport, setTestReport] = useState<any>({})

   //testing units
   const [buildingUnits, setBuildingUnits] = useState<any>({})

  useEffect(() => {


    if (aggregate) {
      console.log('!boo')
      // let builds = Object.keys(aggregate)
      // setBuildings(builds)
      // findYearsAvailable()
      // createReportInfoBlank()
      // getMonths()
      // console.log(monthsAvailable, 'how many?')
    }

    if (!aggregate) {
      console.log('boo!!')
    }

  }, [ aggregateStringified, buildingsStringified, reportInfo, yearsStringified, monthsStringified])

  // testing building units
  const testingUnit = (uni) => {
    console.log(uni)
  }



  // report logic*****
    //find years
  const findYearsAvailable = () => {
    buildings.forEach((buildingName) => {
      let years = Object.keys(aggregate[buildingName])
      years.forEach((year) => {
        if (!yearsAvailable.includes(year)) {
          setYearsAvailable((yearsAvailable) => [...yearsAvailable, year])
          // yearsAvailable.push(year)
        }
      })
    })
  }

  const createReportInfoBlank = () => {
    buildings.forEach((buildingName) => {
      if (!reportInfo[buildingName]) {
        reportInfo[buildingName] = {}
        // setReportInfo((reportInfo) => ({...reportInfo, ...{[buildingName]: {}}}))
      }
      yearsAvailable.forEach(async (year) => {
        let tempAgg = aggregate[buildingName][year]
        if (await tempAgg) {
          let temp = {[year]: {}}
          reportInfo[buildingName] = {...reportInfo[buildingName], ...temp}
          // setReportInfo((reportInfo) => {reportInfo[buildingName], {...reportInfo[buildingName], ...temp}})
        }
      })
    })
  }

  // create months
  const getMonths = async () => {
    let tempMonths = []
    buildings.forEach(async (buildingName) => {
      yearsAvailable?.forEach(async (year) => {
        let tempAgg = aggregate[buildingName][year]
        if (await tempAgg) {
          let months = Object.keys(await aggregate[buildingName][year])
          try {
          months.forEach(async (month) => {
            let temp = {[month]: {}}
            reportInfo[buildingName][year] = {...reportInfo[buildingName][year], ...temp }
            if (!tempMonths.includes(month)) {
              // setMonthsAvailable((monthsAvailable) => [...monthsAvailable, month])
              setMonthsAvailable(tempMonths)
              tempMonths.push(month)
            }
          })
        }
        catch {
          console.log('err')
        }
        }
      })
    })
  }

  // {buildingName: {unit: []}}
  // build units
  const buildUnits = () => {
    buildings.forEach((building) => {

    })
  }













  return (
    <AggregateContext.Provider value={{aggregate, setAggregate, reportInfo, setReportInfo, yearsAvailable, yearPicked, setYearPicked, showReport, setShowReport, testingUnit}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;
