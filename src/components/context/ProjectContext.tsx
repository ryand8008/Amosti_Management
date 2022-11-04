import React, { useEffect, useState } from "react";


interface ReportType {
  aggregate: any
  setAggregate: (newInformation) => any;
  mergeToAgg: (buildingName: string, year: string, holding2: any) => any;
  gatherInfo: (holding2: any, buildingName: string, year: string) => any;
  reportInfo: (buildingName: any[]) => void;
  yearsAvailable: string[];
  yearPicked: string
  setYearPicked: (string) => any;
  showReport: boolean;
  setShowReport: (bool) => any;
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
  const [yearPicked, setYearPicked] = useState<string>()
  const [yearsAvailable, setYearsAvailable] = useState<string[]>([])
  let yearsStringified = JSON.stringify(yearsAvailable)

  const [buildings, setBuildings] = useState<string[]>([])

  let buildingsStringified = JSON.stringify(buildings)

  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([])
  let monthsStringified = JSON.stringify(monthsAvailable)


   // container to hold
   const [container, setContainer] = useState<any[]>([])

  useEffect(() => {
    if (aggregate) {
      // let builds = Object.keys(aggregate)
      // setBuildings(builds)
      // findYearsAvailable()
      // createReportInfoBlank()
      // getMonths()
      // console.log(monthsAvailable, 'how many?')
    }

    // DO NOT TOUCH
    if (container.length > 0) {
      container.map(async (item, index) => {
        if (index === 0) {
          setAggregate((aggregate) => ({ ...aggregate, ...item }))

        } else {
          mergeToAgg(item)
        }
      })
    }
    // DO NOT TOUCH

  }, [ aggregateStringified, buildingsStringified, reportInfo, yearsStringified, monthsStringified, container.length])



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


























  const gatherInfo = async (holding2) => {
    setContainer((container) => [...container, {...holding2}])
  }

  const mergeToAgg = async (item) => {
    let buildingName = Object.keys(await item)[0]
    let year =  Object.keys(await item[buildingName])[0]

    try {
      if (aggregate[buildingName]) {

        if (aggregate[buildingName][year]) {
          aggregate[buildingName][year] = {...aggregate[buildingName][year], ...item[buildingName][year]}
        } else {
          aggregate[buildingName][year] = item[buildingName][year]

        }

        // setAggregate( (aggregate) => ({...aggregate, ...{[buildingName]: {[year]: {...aggregate[buildingName][year], ...{...aggregate[buildingName][year], ...item[buildingName][year]}}}}}))
      }
      else {
        setAggregate((aggregate) => ({...aggregate,[buildingName]: {...item[buildingName]}}))
      }

    }
    catch {
      console.log('...loading')
    }
  }

  return (
    <AggregateContext.Provider value={{aggregate, setAggregate, mergeToAgg, gatherInfo, reportInfo, yearsAvailable, yearPicked, setYearPicked, showReport, setShowReport}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;
