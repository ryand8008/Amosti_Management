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
  // justify-content: center;
  // align-items: flex-end;
  border-raduis: 5px;
`

const StyledTabHolder = styled.div`
  position: absolute;
  top: 18%;
  display: flex;
  flex-direction: row;
`

const StyledTitle = styled.h1`
  display: relative;
  margin: auto;
`

const StyledTab = styled.button`
  height: fit-content;
  align-self: flex-end;

  // border-left: 1px solid black;
  // border-top: 1px solid black;
  // border-right: 1px solid black;
  border-bottom: 0px;

  // border-radius: 3px;

  // margin-left: 2px;
  // margin-right: 2px;

`
// background-color: #C9F3BA // slightly darker
// slightly lighter: #e9fae3