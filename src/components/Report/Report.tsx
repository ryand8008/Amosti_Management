import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { NewBuilding } from "./newBuilding";
import { NewFullReport } from "./NewFullReport";

interface Button {
  active: boolean
}

const Report = ({aggregate, load, setLoad}) => {

  const [showIndividual, setShowIndividual] = useState(false)
  const [showFullReport, setShowFullReport] = useState(false)

  const componentToPrint = useRef(null)

  // DO NOT TOUCH
  const handlePrint = useReactToPrint({
    content: () => componentToPrint.current,
  });

  const buildings = useMemo(() => {
    if (aggregate) {
      return Object.keys(aggregate)
    }
    return []
  }, [aggregate])

  useEffect(() => {
    if (load) {
      setShowFullReport(false);
      setShowIndividual(false);
      setLoad(false)
    }
    if (aggregate && JSON.stringify(aggregate) === '{}' ) {
      setShowFullReport(false);
      setShowIndividual(false);
    }
  }, [showIndividual, showFullReport, buildings, aggregate])


  const handleClickFullReport = (e) => {
    e.preventDefault()
    setShowFullReport((showFullReport) => !showFullReport)
    setShowIndividual(() => false)
  }


  return (
    <>
  {aggregate && JSON.stringify(aggregate) !== '{}' ? (
    <>
      <StyledH2 key="heading">What do you want to do?</StyledH2>
      <StyledButtonDiv key="buttons">
        <TestButton
          key="individual"
          active={showIndividual}
          onClick={() => {
            setShowIndividual(() => !showIndividual);
            setShowFullReport(() => false);
          }}
        >
          {showIndividual ? 'close individual report' : 'See individual Report'}
        </TestButton>
        <TestButton
          key="full"
          active={showFullReport}
          onClick={(e) => handleClickFullReport(e)}
        >
          {showFullReport ? 'close full report' : 'Generate a full report'}
        </TestButton>
      </StyledButtonDiv>
    </>
  ) : null}
  <p key="spacer" />
  {showIndividual
    ? buildings.map((building, index) => (
        <React.Fragment key={index}>
          <div key={index} ref={componentToPrint}>
            <NewBuilding aggregate={aggregate} buildingName={building} />
          </div>
          <StyledTemp key={`button-${index}`}>
            {
              <StyledButton
                key={`print-${index}`}
                onClick={handlePrint}
              >
                <img src={'https://img.icons8.com/ios/32/printer-door-open.png'} />
                {building}
              </StyledButton>
            }
          </StyledTemp>
        </React.Fragment>
      ))
    : null}
  {showFullReport ? (
    <>
      <div key="full-report" ref={componentToPrint}>
        <NewFullReport aggregate={aggregate} buildings={buildings} />
      </div>
      <StyledTemp key="full-report-button">
        <StyledButton key="print-full" onClick={handlePrint}>
          <img src={'https://img.icons8.com/ios/32/printer-door-open.png'} />
        </StyledButton>
      </StyledTemp>
    </>
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

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

const StyledTemp = styled.div`
  display: flex;
  justify-content: center;
`

const TestButton = styled.button<Button>`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  // background-color: #0077cc;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005fa3;
  }
  margin: 5px;
  background-color: ${props => props.active ? '#53f563' : '#0077cc'}
`

export default Report;