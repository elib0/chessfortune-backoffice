"use client";

import styled from "styled-components";

const Box = styled("div")<{
  css?: any;
}>`
  box-sizing: border-box;

  ${({ css }) => css && css}
`;

export default Box;
