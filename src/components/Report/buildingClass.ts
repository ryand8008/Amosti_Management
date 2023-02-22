export class Building {
  buildingName: string;
  year: string;
  aggregate: any;

  constructor(buildingName: string, year: string) {
    this.buildingName = buildingName;
    this.year = year;

    // testing ideas

  }

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
}