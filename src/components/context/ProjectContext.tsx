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
    if (aggregate) {
      let lengthAgg = Object.values(aggregate).length || null
      console.log(aggregate, 'not null')
      console.log(lengthAgg)
    }
    if (!aggregate) {
      console.log(aggregate, ' is null')
    }

    console.log(container, 'effect')
    if (container.length > 0) {
      container.map(async (item, index) => {
        let buildingName = Object.keys(item)[0]
        let year = Object.keys(item[buildingName])[0]
        if (index === 0) {
          await setAggregate((aggregate) => ({ ...aggregate, ...item }))

        } else {
          // this ends up with {2022: {}, september: {}, octover: {}}
          // setAggregate((aggregate) => ({...aggregate['Dragón'], ...{...aggregate['Dragón'][2022], ...item['Dragón'][2022]}}))
          // // this works as intended but hard coded to 'Dragon'
          // setAggregate((aggregate) => ({['Dragón']: {[2022]: {...aggregate['Dragón'][2022], ...{...aggregate['Dragón'][2022], ...item['Dragón'][2022]}}}}))
          await mergeToAgg(buildingName, year, item)
        }
      }
      )
      console.log(aggregate, 'effect ag')
    }


  }, [aggregate ? Object.keys(aggregate).length : aggregate, checkCount, container.length])


  const gatherInfo = async (holding2, buildingName, year) => {
    await setContainer((container) => [...container, {...holding2}])
  }

  const mergeToAgg = async (buildingName, year, item) => {
    console.log(aggregate, 'merge agg')
    if (await aggregate) {

      console.log(await aggregate?.buildingName?.year, 'here?')
    }
    // if (aggregate[buildingName][year]) {

      await setAggregate((aggregate) => ({[buildingName]: {[year]: {...aggregate[buildingName][year], ...{...aggregate[buildingName][year], ...item[buildingName][year]}}}}))
    // }

    // if (!aggregate[buildingName]) {
    //   console.log('borked')
    // }
  }



  return (
    <AggregateContext.Provider value={{hello, aggregate, setAggregate, mergeToAgg, gatherInfo}}>
      {children}
    </AggregateContext.Provider>
  )
}

export default AggregateProvider;


// const aggregate = {
//   'buildingName':
//   {
//     year:
//     {
//       'month':
//       {
//         'unitInfo': [],
//         'costs': [],
//       }

// }



// shape of things to come
// const aggregate = {
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


// if (!aggregate) {
//   setAggregate({...aggregate, ...holding2 })
// } else if (aggregate[buildingName]) {
//   let thing = await holding2[buildingName][year]
//     setAggregate({...{ ...aggregate[buildingName][year], ...thing }}
//       )
//   }



// something works here:
// why does it not work???
// TODO: figure out why aggregate does not change, need to make shallow copy, but still doesnt'work well

// const mergeToAgg = async (buildingName, year, holding2) => {
//   if (!aggregate) {
//     await setAggregate(aggregate => ({...aggregate, ...holding2}))
//   } else if (!aggregate[buildingName]) {
//     setAggregate(aggregate => ({...aggregate, ...{[buildingName]: {[year]:{...holding2[buildingName][year]}}}})
//       )
//   } else if (aggregate[buildingName]) {

//     setAggregate( aggregate => ({
//     ...aggregate, [buildingName]: {[year]: {...aggregate[buildingName][year], ...holding2[buildingName][year]}}
//     }))
//   }


//   //end
// }
