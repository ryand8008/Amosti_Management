// testing without React

import { Building } from "./buildingClass";


export const Individual = (aggregate,  building = null, year = null) => {
  console.log('when does this execute?')
  //   // get buildings
    let buildings: string[] = Object.keys(aggregate)
    // get years
    let yearsArray:string[] = [];


    buildings.forEach((building) => {
      yearsArray = [...yearsArray, ...Object.keys(aggregate[building])]
    })

    console.log(yearsArray, 'what values are here?')
    let yearSet = new Set(yearsArray)

    if (buildings.length > 0 && yearsArray.length > 0) {
      let testClass = new Building(buildings[0], yearsArray[1])

      console.log(testClass, 'this is new testclass ')

      console.log(testClass.getUnits(aggregate), 'this should return the units')

      console.log(testClass.getAllMonths(aggregate), 'this should be a months array')

      console.log(testClass.getRentSingle(aggregate, testClass.getAllMonths(aggregate)[0]))

      console.log(testClass.getTotalRent(aggregate), 'total rent???')

      // TESTING TO MERGE MULTIPLE MONTHS
      // let testing;

      // const months = testClass.getAllMonths(aggregate);



      // months.forEach((month, index) => {
      //   let info: any = testClass.getRentSingle(aggregate, month)
      //   if (!testing) {
      //     testing = {...info}

      //   } else {

      //     testing = {...testing, ...info}

      //   }
      // })

      // console.log(testing, 'what does this look like?')





      // let testArray = []
      // months.forEach((month, index) => {
      //   let info: any = testClass.getRentSingle(aggregate, month);

      // })





}






    // methods

    // 1. create units object in context => [buildingName]: [array of units]
    // 2. information is pulled from ReportInfo, so we need to recreate that functionally without React.
      // i. use reducer or something for comparing objects




  return 'this is individual or something'
}