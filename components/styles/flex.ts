"use client";

import styled from "styled-components";
import { Box } from ".";

const Flex = styled(Box)<{
  direction?: "column" | "row";
  justify?: "center" | "start" | "end" | "between" | "around";
  align?: "center" | "start" | "end" | "stretch" | "between";
  wrap?: "wrap" | "nowrap";
  css?: any;
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "row"};
  justify-content: ${({ justify }) => {
    switch (justify) {
      case "center":
        return "center";
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "between":
        return "space-between";
      case "around":
        return "space-around";
      default:
        return "flex-start";
    }
  }};
  align-items: ${({ align }) => {
    switch (align) {
      case "center":
        return "center";
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "stretch":
        return "stretch";
      case "between":
        return "space-between";
      default:
        return "stretch";
    }
  }};
  flex-wrap: ${({ wrap }) => (wrap === "nowrap" ? "nowrap" : "wrap")};

  ${({ css }) => css && css}
`;

export default Flex;
