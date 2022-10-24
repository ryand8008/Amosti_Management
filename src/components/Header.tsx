import React from "react";
import styled from "styled-components";

export const Header = () => {

  return (
    <>
    <StyledHeader>
      <h1> it's me </h1>
    </StyledHeader>
    </>

  )
}

const StyledHeader = styled.header`
  background-color: white;
  width: 100%;
  height: 100px;
`