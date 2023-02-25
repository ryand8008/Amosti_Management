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

    // console.log(yearsArray, 'what values are here?')
    let yearSet = new Set(yearsArray)

    if (buildings.length > 0 && yearsArray.length > 0) {

      let testYear: string = yearsArray[0]
      let classContainer: any[] = [];

      buildings.forEach((building) => {
        let buildTest = new Building(building, testYear)

        if (buildTest.isValid(aggregate)) {
          classContainer.push(buildTest)
        }
      })




}






    // methods

    // 1. create units object in context => [buildingName]: [array of units]
    // 2. information is pulled from ReportInfo, so we need to recreate that functionally without React.
      // i. use reducer or something for comparing objects




  return 'this is individual or something'
}