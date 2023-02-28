import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { AggregateContext } from "../context/ProjectContext";
import { NewBuilding } from "./newBuilding";
import { NewFullReport } from "./NewFullReport";

export const NewReport = () => {
  const { aggregate } = useContext(AggregateContext)

  // boolean to show individual Report
  const [showIndividual, setShowIndividual] = useState(false)
  const [showFullReport, setShowFullReport] = useState(false)

  // to print things
  const componentToPrint = useRef(null)

  // DO NOT TOUCH
  const handlePrint = useReactToPrint({
    content: () => componentToPrint.current,
  });
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
  }


  return (
    <>
      {/* <h1>It's me, from NewReport</h1> */}
      {aggregate ?
      <>
        <StyledH2>What do you want to do?</StyledH2>
        <StyledButtonDiv>
          <button onClick={() => {setShowIndividual(() => !showIndividual); setShowFullReport(() => false)}}>{showIndividual ? 'close individual report' : 'See individual Report'}</button>
          <button onClick={(e) => handleClickFullReport(e)}>{showFullReport ? 'close full report' : 'Generate a full report'}</button>
        </StyledButtonDiv></> : null}
      <p />
      {showIndividual ? buildings.map((building) =>
        <>
          <div ref={componentToPrint}>
            <NewBuilding aggregate={aggregate} buildingName={building} />
          </div>
            <StyledButton onClick={handlePrint}>{`print building: ${building}`}</StyledButton>
        </>
      ) : null}

      {showFullReport ?
        <>
        <div ref={componentToPrint}>
          <NewFullReport aggregate={aggregate} buildings={buildings} />
        </div>
        <div>
          <StyledButton onClick={handlePrint}>{`print full report`}</StyledButton>

        </div>
        </>
        : null}
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

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
`
