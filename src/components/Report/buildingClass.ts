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
      aggregate[this.buildingName][this.year][Object.keys(aggregate[this.buildingName][this.year])[0]]['unitInfo'].map((item) => {
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

    console.log(aggregate[this.buildingName][this.year][month], 'what is this')
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



} // end