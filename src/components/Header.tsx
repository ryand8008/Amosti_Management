import React from "react";
import styled from "styled-components";

export const Header = () => {

  return (
    <>
    <StyledHeader>
      <h1> Amosti Management </h1>
    </StyledHeader>
    </>

  )
}

const StyledHeader = styled.header`
  background-color: #C9F3BA;
  width: 100%;
  height: 100px;
  top: 0px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  border-raduis: 5px;
`
// background-color: #C9F3BA // slightly darker
// slightly lighter: #e9fae3