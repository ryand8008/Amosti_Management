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
          { years.indexOf(selectedYear) > 0 ? (
            <StyledArrowButton onClick={(e) => handleClickYear(e, -1)}>
              <img src={'https://img.icons8.com/ios-glyphs/32/left--v1.png'}/>
            </StyledArrowButton>
          ) : (
            <StyledArrowButton style={{ visibility: "hidden" }}><img src={'https://img.icons8.com/ios-glyphs/32/left--v1.png'}/></StyledArrowButton>
          )}
          <YearSpan>{selectedYear}</YearSpan>
          { years.indexOf(selectedYear) < years.length - 1 ? (
            <StyledArrowButton onClick={(e) => handleClickYear(e, 1)}>
              <img src={'https://img.icons8.com/ios-glyphs/32/right--v1.png'}/>
            </StyledArrowButton>
          ) : (
            <StyledArrowButton style={{ visibility: "hidden" }}><img src={'https://img.icons8.com/ios-glyphs/32/right--v1.png'}/></StyledArrowButton>
          )}
        </StyledYearArrows>
      }

      {
        <>
        <StyledContainer>
          <StyledTable>
            <StyledHeaderContainer>
              <StyleMonthsHeaders>Depto</StyleMonthsHeaders>
              {hardCodeMonths.map((item) => <StyleMonthsHeaders>{item}</StyleMonthsHeaders>)}
              <StyleMonthsHeaders>annual</StyleMonthsHeaders>
            </StyledHeaderContainer>
            {units.map((unit, index) =>
              <StyledRowUnit end={unit === 'total'}>
                {unit !== buildingName ? <StyledCellText>{unit} </StyledCellText> : null}
                {unit !== buildingName && rentInfo[unit] &&
                  rentInfo[unit].map((item:any, index:number) => {
                    if (!isNaN(item)) {
                      return <StyledCellNum>{item}</StyledCellNum>
                    } else {
                      return <StyledCellHyphen>{item}</StyledCellHyphen>
                    }
                  }
                )}
              </StyledRowUnit>
            )}
          </StyledTable>
          </StyledContainer>
        </>
      }

    </>
  )
}

const YearSpan = styled.span`
  font-size: 25px;
`
const StyledArrowButton = styled.button`
  background: none;
  border: none;
  display: ${({ hidden }) => (hidden ? "none" : "block")};
`;

const StyledTitle = styled.h2`
  display: flex;
  justify-content: center;
`

const StyledYearArrows = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
`
const StyledRowUnit = styled.tr<StyledRowUnitProps>`
  background-color: ${props => props.end ? '#4f5e50' : 'none'};
  color: ${props => props.end ? '#cde6d5' : 'none'};
`;

const StyledCellText = styled.td`
  text-align: left;
  padding: 16px 16px 10px 16px;
`
const StyledCellNum = styled.td`
  text-align: right;
  padding: 16px;
`
const StyledCellHyphen = styled.td`
  text-align: center;
  padding: 16px;
`

const StyleMonthsHeaders = styled.th`
  border-bottom: 1px solid black;
  text-align: left;
  width: 125px;
  padding: 16px;
  background: #2b382c;
  color: #cde6d5;
  resize: horizontal; /* Allows the header cell to be resized horizontally */
  overflow: auto; /* Ensures that content is not hidden when the cell is resized */
`
const StyledHeaderContainer = styled.tr`
  border: 1px solid black;
  `

  const StyledContainer = styled.div`
    display: flex;
    justify-content: center;
`

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 30px;
  margin-right: 30px;
  ${StyledRowUnit}:nth-child(even) {
    background: lightgrey;
  }

  th {
    position: relative;
    // padding-right: 10px;
  }

  th::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    background-color: transparent;
    z-index: 1;
  }

  th:hover::after {
    background-color: rgba(0, 0, 0, 0.1);
  }

  th::-webkit-resizer {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    z-index: 2;
    background-color: transparent;
  }
`;
