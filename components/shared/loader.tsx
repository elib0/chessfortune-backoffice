"use client";

import React, { FC } from "react";

interface Props {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Loader: FC<Props> = ({ size = "sm" }) => {
  return (
    <svg
      className={`loader size-${size}`}
      viewBox="0 0 384 384"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="active"
        pathLength="360"
        fill="transparent"
        strokeWidth="32"
        cx="192"
        cy="192"
        r="176"
      ></circle>
      <circle
        className="track"
        pathLength="360"
        fill="transparent"
        strokeWidth="32"
        cx="192"
        cy="192"
        r="176"
      ></circle>
    </svg>
  );
};

export default Loader;
