import React from "react";
import LogoSvg from "./Ewi.svg";

const EwiproLogo: React.FC<{ height?: number | string }> = ({
  height = 100,
}) => {
  return (
    <svg
      height={height}
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <image
        href={LogoSvg}
        x="0"
        y="0"
        height="110"
        width="90"
      />
      <g transform="translate(100, 0)">
        <text
          x="0"
          y="50"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="60"
          fill="#000"
          dominantBaseline="middle"
        >
          EWI PRO
        </text>

        <text
          x="285"
          y="30"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="20"
          fill="#000000"
          dominantBaseline="middle"
        >
          ®
        </text>

        <text
          x="0"
          y="90"
          fontFamily="Arial, sans-serif"
          fontSize="20"
          fill="#000000"
        >
          External wall insulation systems
        </text>
      </g>
    </svg>
  );
};

export default EwiproLogo;
