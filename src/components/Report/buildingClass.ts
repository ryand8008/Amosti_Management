export class Building {
  buildingName: string;
  year: string;

  constructor(buildingName: string, year: string) {
    this.buildingName = buildingName;
    this.year = year;

    // testing ideas

  }

  hardCodeMonths() {
    return ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre' ]
  }

  // methods
  // getAllMonths => string[]
  // getRent(month) => not sure
  // getTotals | expenses or revenue?


  getUnits(aggregate: any) {
    let temp: string[] = []
    if (aggregate[this.buildingName][this.year]) {
      aggregate[this.buildingName][this.year][Object.keys(aggregate[this.buildingName][this.year])[0]]['unitInfo'].map((item, index) => {
          temp.push(item['Depto'])
      })
      temp.splice(temp.length-1, 1)
      return temp;
    }
  }

  getAllMonths(aggregate: any) {
    // let months: string[] = [];

    return Object.keys(aggregate[this.buildingName][this.year])
  }

  // get rent (single month)
  getRentSingle(aggregate: any, month: string) {
    const units: string[] = this.getUnits(aggregate);
    const hardCodeMonths = this.hardCodeMonths();
    let blob = {[this.buildingName]: {[this.year]: {'units': {}}}};

    // console.log(aggregate[this.buildingName][this.year][month], 'what is this')
    // item in forEach, not sure of type either string or int or '-'
    if (aggregate[this.buildingName][this.year][month]) {
      aggregate[this.buildingName][this.year][month]['unitInfo'].forEach((item: any, index: number) => {
        let tempUnit: string = units[index];

        if (index !== 0 && index !== aggregate[this.buildingName][this.year][month]['unitInfo'].length-1) {

          let tempArr;
          if(!blob[this.buildingName][this.year]['units'][tempUnit])
          {
            tempArr = Array.from({length: 12})
            tempArr.fill('-', 0, tempArr.length)
          }
          else
          {
            tempArr = blob[this.buildingName][this.year]['units'][tempUnit];
          }
          let insertionPoint = hardCodeMonths.indexOf(month)
          tempArr[insertionPoint] = !isNaN(Number(item['Renta'])) ?  Number(item['Renta']) : '-';

          blob[this.buildingName][this.year]['units'][tempUnit] = tempArr;

        }



      })

    } else {
      return 'this is an error in "getRentSingle" function, month not in building and building year'
    }
    return blob
  }


  // merge units + rent
  mergeRent(aggregate, oldArr, newArr) {
    let units = this.getUnits(aggregate)
    let testObj = {}

    units.forEach((unit, index) => {

      if (index !== 0) {
        console.log(unit, 'unit')


        // refactor is O(n^2)
        let mergedArr = []
        for (let i = 0; i < 12; i++) {
          if (Number(oldArr[unit][i])) {
            mergedArr.push(Number(oldArr[unit][i]))
          } else if (Number(newArr[unit][i])) {
            mergedArr.push(Number(newArr[unit][i]))
          } else {
            mergedArr.push('-')
          }
        }
        testObj[unit] = mergedArr;
      }
    })

    console.log(testObj, 'wat dis??')
    return testObj;
  }

  // merge rents for all months
  // get months
  // nested merge objects
  getTotalRent(aggregate) {
    let months = this.getAllMonths(aggregate)
    let units = this.getUnits(aggregate)
    let testing; // change this later
    months.forEach((month, index) => {
      let info: any = this.getRentSingle(aggregate, month)
      console.log(info, 'does this ever become')
      if (!testing) {
        // console.log(info, 'what is this?')
        testing = info;

      } else {
        // console.log(testing, 'why is year undefined here?')
        let oldArr = testing[this.buildingName][this.year]['units'];
        let newArr = info[this.buildingName][this.year]['units']
        console.log(testing[this.buildingName][this.year]['units'], 'testing[this.buildingName]')
        console.log(info[this.buildingName][this.year]['units'], 'info[this.buildingName]')





        // I think this works but need to spread each array in 'units' array
        testing = {
          [this.buildingName]: {
            [this.year]: this.mergeRent(aggregate, oldArr, newArr)
          }
        }
        console.log(testing, 'after spreading HERE')

      }
    })

    console.log(testing, 'this is testing in Class total rent')
    return testing

  }



} // end