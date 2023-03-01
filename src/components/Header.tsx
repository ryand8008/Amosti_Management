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
  border-raduis: 5px;
`

const StyledTitle = styled.h1`
  display: relative;
  margin: auto;
`

// background-color: #C9F3BA // slightly darker
// slightly lighter: #e9fae3