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
    const insertionPoint = hardCodeMonths.indexOf(month);
    const blob = {[this.buildingName]: {[this.year]: {'units': {}}}};

    aggregate[this.buildingName][this.year][month]['unitInfo'].forEach((item: any, index: number) => {
      const tempUnit = units[index];

      if (index !== 0 && index !== aggregate[this.buildingName][this.year][month]['unitInfo'].length - 1) {
        const tempArr = Array.from({length: 12}).fill('-', 0, 12);

        tempArr[insertionPoint] = !isNaN(Number(item['Renta'])) ?  Number(item['Renta']) : '-';
        blob[this.buildingName][this.year]['units'][tempUnit] = tempArr;
      }
    });

    return blob;
  }
  //end


  // merge units + rent
  mergeRent(aggregate: any, oldArr: any, newArr: any): any {
    const units: string[] = this.getUnits(aggregate);
    const testObj: any = {};

    for (let i = 1; i < units.length; i++) {
      const unit: string = units[i];

      const mergedArr: (number | string)[] = [];
      for (let j = 0; j < 12; j++) {
        const oldVal: number = +oldArr[unit][j];
        const newVal: number = +newArr[unit][j];
        mergedArr.push(oldVal || newVal || '-');
      }

      testObj[unit] = mergedArr;
    }

    console.log(testObj, 'wat dis??');
    return testObj;
  }



  // merge rents for all months
  // get months
  // nested merge objects
  getTotalRent(aggregate) {
    const months = this.getAllMonths(aggregate);
    let testing;

    months.forEach(month => {
      const info = this.getRentSingle(aggregate, month);

      if (!testing) {
        testing = info;
      } else {
        const oldUnits = testing[this.buildingName][this.year]['units'];
        const newUnits = info[this.buildingName][this.year]['units'];
        const mergedUnits = this.mergeRent(aggregate, oldUnits, newUnits);

        testing = {
          [this.buildingName]: {
            [this.year]: { units: mergedUnits }
          }
        };
      }
    });

    return testing;
  }




} // end