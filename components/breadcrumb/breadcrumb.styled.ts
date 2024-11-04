import styled from "styled-components";
import Link from "next/link"; // Assuming you're using react-router for Link

export const Breadcrumbs = styled.ul<{ css?: any }>`
  list-style: none;
  display: flex;
  gap: 1rem; /* Replace $4 with a suitable rem value */
  padding: 0;
  margin: 0;
  ${({ css }) => css && { ...css }}
`;

export const CrumbLink = styled(Link)<{ css?: any }>`
  color: #6c757d; /* Replace $accents8 with a suitable color code */
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
  ${({ css }) => css && { ...css }}
`;

export const Crumb = styled.li<{ css?: any }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem; /* Replace $2 with a suitable rem value */

  &:last-of-type::after {
    content: "";
    padding: 0;
  }

  &:last-child {
    & > a {
      color: #343a40; /* Replace $accents9 with a suitable color code */
      cursor: default;
      pointer-events: none;
    }
  }
  ${({ css }) => css && { ...css }}
`;
