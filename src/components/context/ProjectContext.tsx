import React, { useCallback, useEffect, useState } from "react";


interface ReportType {
  aggregate: any
  setAggregate: (newInformation) => any;
  reportInfo: (buildingName: any[]) => void;
  setReportInfo: (any) => any;
  yearsAvailable: string[];
  setYearsAvailable: (any) => any;
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
  let aggregateStringified = JSON.stringify(aggregate)
  const [showReport, setShowReport] = useState<boolean>(false)
  // report information
  const [reportInfo, setReportInfo] = useState<any>({})

  const [yearPicked, setYearPicked] = useState<string>()
  const [yearsAvailable, setYearsAvailable] = useState<string[]>([])
  let yearsStringified = JSON.stringify(yearsAvailable)

  const [buildings, setBuildings] = useState<string[]>([])


  let buildingsStringified;

  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([])
  let monthsStringified = JSON.stringify(monthsAvailable)

   const [testReport, setTestReport] = useState<any>({})

   //testing units
   const [buildingUnits, setBuildingUnits] = useState<any>({})

  useEffect(() => {

    if (aggregate) {
      handleChange()
      aggregateStringified = JSON.stringify(aggregate)
      buildingsStringified = JSON.stringify(buildings)
      yearsStringified = JSON.stringify(yearsAvailable)

      getBuildings()
      getYears()
    }

  }, [ JSON.stringify(aggregate), buildingsStringified, reportInfo, yearsStringified, monthsStringified, yearPicked, buildings.length])


  const handleChange = useCallback(() => {
    setAggregate(aggregate)
  }, [JSON.stringify(aggregate)])

  const getYears = useCallback(() => {
    let tempYears = [];
    buildings.forEach((building) => {
      Object.keys(aggregate[building]).forEach((year) => {
        if (tempYears.indexOf(year) === -1) {
          tempYears.push(year)
        }
      })
      setYearsAvailable(() => tempYears)
    })
  },[buildings.length])

  const getBuildings = useCallback(() => {
    setBuildings(() => Object.keys(aggregate))
  }, [aggregate ? Object.keys(aggregate).length : null])

    return (
    <AggregateContext.Provider value={{aggregate, setAggregate, reportInfo, setReportInfo, yearsAvailable, setYearsAvailable, yearPicked, setYearPicked, showReport, setShowReport}}>
      {children}
    </AggregateContext.Provider>
  )
}

// NEW STUFF

export default AggregateProvider;
