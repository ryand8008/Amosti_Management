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


  // CHECK to see if valid
  isValid(aggregate: any) {
    return aggregate[this.buildingName][this.year] ? true : false;
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
    let totalArr: any[] = Array.from({length: 12}).fill('-', 0, 12);
    let total: number = 0
    aggregate[this.buildingName][this.year][month]['unitInfo'].forEach((item: any, index: number) => {
      const tempUnit = units[index];


      if (index !== 0 && index !== aggregate[this.buildingName][this.year][month]['unitInfo'].length - 1) {
        const tempArr = Array.from({length: 12}).fill('-', 0, 12);
        const val: number = Number(item['Renta'])

        tempArr[insertionPoint] = !isNaN(val) ?  val : '-';
        !isNaN(val) ? total += val : null
        blob[this.buildingName][this.year]['units'][tempUnit] = tempArr;
      }

    });
    totalArr[insertionPoint] = total;
    blob[this.buildingName][this.year]['units']['total'] = totalArr;
    return blob;
  }

  // // TEST
  // getRentSingle(aggregate: any, month: string) {
  //   const units: string[] = this.getUnits(aggregate);
  //   const hardCodeMonths = this.hardCodeMonths();
  //   const insertionPoint = hardCodeMonths.indexOf(month);
  //   const blob = {[this.buildingName]: {[this.year]: {'units': {}}}};

  //   units.forEach((unit: string) => {
  //     if (unit !== this.buildingName) {
  //       const rents = aggregate[this.buildingName][this.year][month]['unitInfo']
  //         .filter((item: any) => item.Unit === unit)
  //         .map((item: any) => Number(item['Renta']))
  //         .filter((rent: number) => !isNaN(rent));
  //       const totalRent = rents.reduce((acc, rent) => acc + rent, 0);
  //       const rentArray = Array.from({length: 12}).fill('-', 0, 12);
  //       rentArray[insertionPoint] = totalRent;
  //       blob[this.buildingName][this.year]['units'][unit] = rentArray;
  //       blob[this.buildingName][this.year]['units'][`${unit}_total`] = totalRent;
  //     }
  //   });

  //   return blob;
  // }



  // merge units + rent
  mergeRent(aggregate: any, oldArr: any, newArr: any): any {
    let units: string[] = this.getUnits(aggregate);
    units.push('total')
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
  getTotalAdmon() {

  }



} // end