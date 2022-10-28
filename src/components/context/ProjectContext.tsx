import React, { useEffect, useState } from "react";


interface ReportType {
  aggregate: any
  setAggregate: (newInformation) => void;
  mergeToAgg: (buildingName: string, year: string, holding2: any) => any;
  gatherInfo: (holding2: any, buildingName: string, year: string) => any;
  reportInfo: (buildingName: any[]) => void;
  yearsAvailable: string[];
}
// reportInfo = {
//   buildingName = {}
// }

export const AggregateContext = React.createContext<ReportType | null>(null)

const AggregateProvider = ({children}) => {
  // uploaded information
  const [aggregate, setAggregate] = useState<any>()
  const aggregateStringified = JSON.stringify(aggregate)
  // report information
  const [reportInfo, setReportInfo] = useState<any>({})
  const [yearsAvailable, setYearsAvailable] = useState<string[]>([])
  const [buildings, setBuildings] = useState<string[]>([])
  console.log(reportInfo, 'report info')

  // report logic*****
    //find years
  const findYearsAvailable = () => {
    buildings.forEach((buildingName) => {
      let years = Object.keys(aggregate[buildingName])
      years.forEach((year) => {
        if (!yearsAvailable.includes(year)) {
          yearsAvailable.push(year)
        }
      })
    })
  }

  const createReportInfoBlank = () => {
    buildings.forEach((buildingName) => {
      if (!reportInfo[buildingName]) {
        reportInfo[buildingName] = {}
      }
      yearsAvailable.forEach((year) => {
        if (aggregate[buildingName][year]) {
          let temp = {[year]: {}}
          reportInfo[buildingName] = {...reportInfo[buildingName], ...temp}
        }
      })
    })
  }




  // container to hold
  const [container, setContainer] = useState<any[]>([])

  useEffect(() => {
    console.log(aggregateStringified, 'string')
    if (aggregate) {
      setBuildings(Object.keys(aggregate))
      findYearsAvailable()
      createReportInfoBlank()
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

  }, [ aggregateStringified, buildings.length, reportInfo, yearsAvailable.length, container.length])





















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
    <AggregateContext.Provider value={{aggregate, setAggregate, mergeToAgg, gatherInfo, reportInfo, yearsAvailable}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;
