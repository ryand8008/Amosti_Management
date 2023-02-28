import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AggregateContext } from "../context/ProjectContext";
import { NewBuilding } from "./newBuilding";

export const NewReport = () => {
  const { aggregate } = useContext(AggregateContext)

  // boolean to show individual Report
  const [showIndividual, setShowIndividual] = useState(false)
  const [showFullReport, setShowReport] = useState(false)

  const buildings = useMemo(() => {
    if (aggregate) {
      return Object.keys(aggregate)
    }
    return []
  }, [aggregate])

  useEffect(() => {

  }, [showIndividual])

  return (
    <>
      {/* <h1>It's me, from NewReport</h1> */}
      <StyledH2>What do you want to do?</StyledH2>
      <StyledButtonDiv>
        <button onClick={()=>setShowIndividual(() => !showIndividual)}>{showIndividual ? 'close individual report' : 'See individual Report'}</button>
        <button>Generate a full report</button>
      </StyledButtonDiv>
      <p />
      {showIndividual ? buildings.map((building) =>
        <NewBuilding aggregate={aggregate} buildingName={building} />
      ) : null}
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
