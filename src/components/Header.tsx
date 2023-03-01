import React, { useEffect, useState } from "react";
import styled from "styled-components";

export const Header = () => {

  return (
    <>
    <StyledHeader>
      <StyledTitle> Amosti Management</StyledTitle>
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
  border-radius: 5px;
  align-items: baseline; /* align items to the baseline */
`

const StyledTitle = styled.h1`
  display: relative;
  margin: auto;
  font-family: Copperplate;
  font-size: 2.5rem; /* set font size */
  line-height: 2.5rem; /* set line height equal to font size */
  margin-bottom: 0; /* remove any bottom margin */
`


// background-color: #C9F3BA // slightly darker
// slightly lighter: #e9fae3