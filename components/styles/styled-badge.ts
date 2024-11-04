"use client";

import styled from "styled-components";

const StyledBadge = styled.span<{
  type?: "active" | "paused" | "vacation";
  css?: any;
}>`
  display: inline-block;
  text-transform: uppercase;
  padding: 0.5rem 0.75rem;
  margin: 0 2px;
  font-size: 10px;
  font-weight: bold;
  border-radius: 14px;
  letter-spacing: 0.6px;
  line-height: 1;
  box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.05);
  align-items: center;
  align-self: center;
  color: white;

  background: ${({ type }) => {
    switch (type) {
      case "active":
        return "#d4edda"; // successLight
      case "paused":
        return "#f8d7da"; // errorLight
      case "vacation":
        return "#fff3cd"; // warningLight
      default:
        return "#d4edda"; // default active
    }
  }};

  color: ${({ type }) => {
    switch (type) {
      case "active":
        return "#155724"; // successLightContrast
      case "paused":
        return "#721c24"; // errorLightContrast
      case "vacation":
        return "#856404"; // warningLightContrast
      default:
        return "#155724"; // default active
    }
  }};

  ${({ css }) => css && css};
`;

export default StyledBadge;
