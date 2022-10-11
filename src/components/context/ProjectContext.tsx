import React, { useState } from "react";


interface ReportType {
  hello: string
  aggregateW: any
  setAggregateW: (newInformation) => void;
}


export const AggregateContext = React.createContext<ReportType | null>(null)

const AggregateProvider = ({children}) => {
  const [aggregateW, setAggregateW] = useState<any>(null)
  const hello = 'world!'
  return (
    <AggregateContext.Provider value={{hello, aggregateW, setAggregateW}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;

// shape of things to come
// const report = {
//   'buildingName':
//   {
//     2022:
//     {
//       'enero':
//       {
//         'unitInfo': ['pumpkin'],
//         'costs': [],
//       },

//       'febrero':
//       {
//         'unitInfo': [],
//         'costs': []
//       }
//     }
//   },

// }

// console.log(report.buildingName[2022]['enero']['unitInfo'][0], 'should be pumpkin')