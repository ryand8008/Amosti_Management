import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from "../context/ProjectContext";
import { NewBuilding } from "./newBuilding";
import { NewFullReport } from "./NewFullReport";

export const NewReport = () => {
  const { aggregate } = useContext(AggregateContext)

  // boolean to show individual Report
  const [showIndividual, setShowIndividual] = useState(false)
  const [showFullReport, setShowFullReport] = useState(false)

  useEffect(() => {

  }, [showIndividual, showFullReport])

  const buildings = useMemo(() => {
    if (aggregate) {
      return Object.keys(aggregate)
    }
    return []
  }, [aggregate])

  const handleClickFullReport = (e) => {
    e.preventDefault()
    setShowFullReport((showFullReport) => !showFullReport)
    setShowIndividual(() => false)
    // console.log(showFullReport, showIndividual, 'report|individual')
    // if (showFullReport) {
    //   setShowIndividual(() => false)
    // }
  }


  return (
    <>
      {/* <h1>It's me, from NewReport</h1> */}
      {aggregate ?
      <>
        <StyledH2>What do you want to do?</StyledH2>
        <StyledButtonDiv>
          <button onClick={() => setShowIndividual(() => !showIndividual)}>{showIndividual ? 'close individual report' : 'See individual Report'}</button>
          <button onClick={(e) => handleClickFullReport(e)}>{showFullReport ? 'close full report' : 'Generate a full report'}</button>
        </StyledButtonDiv></> : null}
      <p />
      {showIndividual ? buildings.map((building) =>
        <NewBuilding aggregate={aggregate} buildingName={building} />
      ) : null}

      {showFullReport ? <NewFullReport aggregate={aggregate} buildings={buildings}/> : null}
    </>
  )
}

const StyledButtonDiv = styled.div`
  direction: row;
  display: flex;
  justify-content: center;
`

const StyledH2 = styled.h2`
  display: flex;
  justify-content: center;
`
