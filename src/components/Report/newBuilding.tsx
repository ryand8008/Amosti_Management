import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Building } from "./buildingClass";

interface NewBuildingProps {
  buildingName: string;
  aggregate: any
}

interface StyledRowUnitProps {
  end: boolean;
}

export const NewBuilding = ({aggregate, buildingName}: NewBuildingProps) => {
  const hardCodeMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre', 'diciembre' ]

  const years = useMemo(() => {
    if (aggregate) {
      return Object.keys(aggregate[buildingName]).sort()
    }
    return []
  }, [aggregate])

  const [selectedYear, setSelectedYear] = useState(years[0])

  const information = new Building(buildingName, selectedYear)
  let units = information.getUnits(aggregate)
  units.push('total')
  const rent = information.getTotalRent(aggregate)
  const rentInfo = rent[buildingName][selectedYear]['units']

  const handleClickYear = (e, num) => {
    e.preventDefault()

    let position = years.indexOf(selectedYear) + num
    setSelectedYear((selectedYear) => years[position])
  }

  return (
    <>
      <StyledTitle>{`building: ${buildingName}`}</StyledTitle>
      {
      <StyledYearArrows>
        { years.indexOf(selectedYear) > 0 ? <button onClick={(e) => handleClickYear(e, -1) }>-</button> : null}
          <span>{selectedYear}</span>
          { years.indexOf(selectedYear) < years.length - 1 ? <button onClick={(e) => handleClickYear(e, 1) }>+</button> : null}
      </StyledYearArrows>
      }

      {
        <>
          <StyledTable>
            <StyledHeaderContainer>
              <th>Depto</th>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>)}
              <StyleMonthsHeaders>annual</StyleMonthsHeaders>
            </StyledHeaderContainer>
            {units.map((unit, index) =>
              <StyledRowUnit end={unit === 'total'}>
                {unit !== buildingName ? <StyledCell>{unit} </StyledCell> : null}
                {unit !== buildingName && rentInfo[unit] &&
                  rentInfo[unit].map((item:any, index:number) =>
                    <StyledCell>{item}</StyledCell>
                )}
              </StyledRowUnit>
            )}
          </StyledTable>
        </>
      }

    </>
  )
}

const StyledTitle = styled.h2`
  display: flex;
  justify-content: center;
`

const StyledYearArrows = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const StyledRowE = styled.tr`

`
const StyledRowUnit = styled.tr<StyledRowUnitProps>`
  border-top: ${props => props.end ? '3px solid black' : 'none'}
`;
const StyledCell = styled.td`
  text-align: center;
`

const StyledTable = styled.table`
  border: thin solid black;
  border-radius: 5px
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
  margin-right: 30px;
  ${StyledRowE}:nth-child(even) {
    background: lightgrey;
  }
  ${StyledRowUnit}:nth-child(even) {
    background: lightgrey;
  }
`
const StyleMonthsHeaders = styled.th`
  border: 1px solid black;
  text-align: center;
  width: 80px;
  padding: 5px;
  background: #82b0f5;
`
const StyledHeaderContainer = styled.tr`
  border: 1px solid black;
  `