import React, { useEffect, useState } from "react";


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
  const aggregateStringified = JSON.stringify(aggregate)
  const [showReport, setShowReport] = useState<boolean>(false)
  // report information
  const [reportInfo, setReportInfo] = useState<any>({})

  const [yearPicked, setYearPicked] = useState<string>()
  const [yearsAvailable, setYearsAvailable] = useState<string[]>([])
  let yearsStringified = JSON.stringify(yearsAvailable)

  const [buildings, setBuildings] = useState<string[]>([])
  // const [buildings, setBuildings] = useState<string[]>(() => {
  //   if (aggregate) {
  //     return Object.keys(aggregate);
  //   } else {
  //     return [];
  //   }
  // })

  let buildingsStringified = JSON.stringify(buildings)

  const [monthsAvailable, setMonthsAvailable] = useState<string[]>([])
  let monthsStringified = JSON.stringify(monthsAvailable)

   const [testReport, setTestReport] = useState<any>({})

   //testing units
   const [buildingUnits, setBuildingUnits] = useState<any>({})

  useEffect(() => {

    if (aggregate) {
       setBuildings(() => Object.keys(aggregate));
    }

    if (buildings.length > 0) {
      let tempYears = [];
      buildings.forEach((building) => {
        Object.keys(aggregate[building]).forEach((year) => {
          if (tempYears.indexOf(year) === -1) {
            tempYears.push(year)
          }
        })
        setYearsAvailable(() => tempYears)
      })
    }

  }, [ aggregateStringified, buildingsStringified, reportInfo, yearsStringified, monthsStringified, yearPicked])

    return (
    <AggregateContext.Provider value={{aggregate, setAggregate, reportInfo, setReportInfo, yearsAvailable, setYearsAvailable, yearPicked, setYearPicked, showReport, setShowReport}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;
