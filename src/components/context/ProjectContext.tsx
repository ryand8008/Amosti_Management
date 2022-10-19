import React, { useEffect, useState } from "react";


interface ReportType {
  hello: string
  aggregate: any
  setAggregate: (newInformation) => void;
  mergeToAgg: (buildingName: string, year: string, holding2: any) => any;
  gatherInfo: (holding2: any, buildingName: string, year: string) => any;
}


export const AggregateContext = React.createContext<ReportType | null>(null)

const AggregateProvider = ({children}) => {
  const [aggregate, setAggregate] = useState<any>()
  const [checkCount, setCheckCount] = useState<number>(1)

  // container to hold
  const [container, setContainer] = useState<any[]>([])
  const hello = 'world!'
  useEffect(() => {

    if (container.length > 0) {
      container.map(async (item, index) => {
        if (index === 0) {
          setAggregate((aggregate) => ({ ...aggregate, ...item }))

        } else {
          mergeToAgg(item)
        }
      }
      )
    }


  }, [aggregate ? Object.keys(aggregate).length : aggregate, checkCount, container.length])


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
    <AggregateContext.Provider value={{hello, aggregate, setAggregate, mergeToAgg, gatherInfo}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;
