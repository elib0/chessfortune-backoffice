"use client";

import styled from "styled-components";

export const IconButton = styled.button<{ css?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  background: transparent;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  ${({ css }) => css && css};
`;

export default IconButton;
