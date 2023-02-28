interface MonthlyData {
  units: {
    [key: string]: Array<number | "-">;
  };
}


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

  getAllYears(aggregate: any) {
    return Object.keys(aggregate[this.buildingName])
  }
  // methods
  // getAllMonths => string[]
  // getRent(month) => not sure
  // getTotals | expenses or revenue?


  // Validation
  isValid(aggregate: any) {
    if(aggregate[this.buildingName][this.year]){
      return true;
    }else{
      console.log(`Validation error: [${this.buildingName}][${this.year}] does not exist in aggregate`)
      return false;
    }
  }

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

  // CLEAN
  // getUnits(aggregate: any): string[] {
  //   if (!aggregate[this.buildingName]?.[this.year]) return [];

  //   return aggregate[this.buildingName][this.year][Object.keys(aggregate[this.buildingName][this.year])[0]]['unitInfo']
  //     .map(item => item['Depto'])
  //     .slice(0, -1);
  // }


  getAllMonths(aggregate: any) {
    return Object.keys(aggregate[this.buildingName][this.year])
  }

  // get rent (single month)
  getRentSingle(aggregate: any, month: string) {
    const units: string[] = this.getUnits(aggregate);
    const hardCodeMonths = this.hardCodeMonths();
    const insertionPoint = hardCodeMonths.indexOf(month);
    const blob = {[this.buildingName]: {[this.year]: {'units': {}}}};
    let totalArr: any[] = Array.from({length: 13}).fill('-', 0, 13);
    totalArr[12] = 0;

    aggregate[this.buildingName][this.year][month]['unitInfo'].forEach((item: any, index: number) => {
      const tempUnit = units[index];
      const tempArr = Array.from({length: 13}).fill('-', 0, 13);
      const val: number = Number(item['Renta'])

      if (index !== 0 && index !== aggregate[this.buildingName][this.year][month]['unitInfo'].length - 1) {
        tempArr[insertionPoint] = !isNaN(val) ? val : '-';
        tempArr[12] = val || 0;
        blob[this.buildingName][this.year]['units'][tempUnit] = tempArr;

        if (!isNaN(val)) {
          totalArr[12] += val;
        }
      }
    });

    totalArr[insertionPoint] = totalArr[12];
    blob[this.buildingName][this.year]['units']['total'] = totalArr;
    return blob;
  }


  // merge units + rent
  mergeRent(aggregate: any, oldArr: any, newArr: any): any {
    let units: string[] = this.getUnits(aggregate);
    units.push('total');
    const testObj: any = {};

    for (let i = 1; i < units.length; i++) {
      const unit: string = units[i];
      let total = 0;

      let mergedArr: (number | string)[] = [];
      for (let j = 0; j < 12; j++) {
        const oldVal: number = +oldArr[unit][j];
        const newVal: number = +newArr[unit][j];
        mergedArr.push(oldVal || newVal || '-');
        total += +oldVal || 0;
        total += +newVal || 0;
      }
      mergedArr.push(total);
      testObj[unit] = mergedArr;
    }

    return testObj;
  }




  // merge rents for all months
  // get months
  // nested merge objects
  getTotalRent(aggregate) {
    const months = this.getAllMonths(aggregate);
    let container;

    months.forEach(month => {
      const info = this.getRentSingle(aggregate, month);

      if (!container) {
        container = info;
      } else {
        const oldUnits = container[this.buildingName][this.year]['units'];
        const newUnits = info[this.buildingName][this.year]['units'];
        const mergedUnits = this.mergeRent(aggregate, oldUnits, newUnits);

        container = {
          [this.buildingName]: {
            [this.year]: { units: mergedUnits }
          }
        };
      }
    });

    return container;
  }

  // COSTS methods
  // used for Amon, Corretaje, Devol or anything that is un 'unitInfo" like Rent
  getStuff(aggregate: any, month: string, thing: string) {
    let units: string[] = this.getUnits(aggregate);
    units.push('total')
    const hardCodeMonths = this.hardCodeMonths();
    const insertionPoint = hardCodeMonths.indexOf(month);
    let tempObj = {units: {}}
    let total = 0;

    for (let i = 1; i < units.length - 1; i++) {
      const tempUnit = units[i];
      const val = Number(aggregate[this.buildingName][this.year][month].unitInfo[i][thing]);
      total += val || 0;
      tempObj.units[tempUnit] = new Array(13).fill('-');
      tempObj.units[tempUnit][insertionPoint] = !isNaN(val) ? val : '-';
      tempObj.units[tempUnit][tempObj.units[tempUnit].length - 1] = !isNaN(val) ? val : '-';
    }
      tempObj.units['total'] = Array.from({length: 13}).fill('-', 0, 13);
      tempObj.units['total'][insertionPoint] = total;
      tempObj.units['total'][tempObj.units['total'].length - 1]  = total;
      return tempObj;
  }

  mergeStuff(aggregate, oldUnits, newUnits) {
    const units: string[] = this.getUnits(aggregate);
    units.push('total')
    const testObj: any = {};

    for (let i = 1; i < units.length; i++) {
      const unit: string = units[i];

      const mergedArr: (number | string)[] = [];
      let total = 0;
      for (let j = 0; j < 13; j++) {
        const oldVal: number = +oldUnits[unit][j];
        const newVal: number = +newUnits[unit][j];
        const value = oldVal || newVal || '-';
        mergedArr.push(value);

        if (j === 12) {
          total += +oldUnits[unit][j] || 0;
          total += +newUnits[unit][j] || 0;
        }
      }

      mergedArr[12] = total;
      testObj[unit] = mergedArr;
    }

    return testObj;
  }


  // TESTING
  getStuffTotal(aggregate: any, thing: string) {
    const months = this.getAllMonths(aggregate);
    let container = null;

    months.forEach((month) => {
      const info = this.getStuff(aggregate, month, thing);

      if (!container) {
        container = {
          [this.buildingName]: {
            [this.year]: {
              [thing]: {
                units: info.units,
              },
            },
          },
        };
      } else {
        const oldUnits = container[this.buildingName][this.year][thing].units;
        const newUnits = info.units;
        const mergedUnits = this.mergeStuff(aggregate, oldUnits, newUnits);

        container[this.buildingName][this.year][thing].units = mergedUnits;
      }
    });

    return container;
  }

  // save for later
  getCosts() {
    console.log()
  }
















} // end
