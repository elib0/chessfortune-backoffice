"use client";

import styled, { css } from "styled-components";

const headingStyles = {
  h1: css`
    font-size: 2rem;
    font-weight: 700;
  `,
  h2: css`
    font-size: 1.75rem;
    font-weight: 600;
  `,
  h3: css`
    font-size: 1.5rem;
    font-weight: 500;
  `,
  h4: css`
    font-size: 1.25rem;
    font-weight: 500;
  `,
};

export const Text = styled.p<{
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  css?: any;
}>`
  line-height: 1.5;

  // Apply heading styles based on props
  ${({ h1, h2, h3, h4 }) => {
    if (h1) return headingStyles.h1;
    if (h2) return headingStyles.h2;
    if (h3) return headingStyles.h3;
    if (h4) return headingStyles.h4;
  }}

  // Support custom css passed via props
  ${({ css }) => css && css}
`;

export default Text;
