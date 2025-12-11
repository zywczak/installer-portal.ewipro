import React from "react";
import LogoSvg from "./Ewipro.svg";

const EwiproLogo: React.FC<{ width?: number | string; height?: number | string }> = ({
  width = 400,
  height = 100,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Logo po lewej */}
      <image
        href={LogoSvg}
        x="0"
        y="0"
        height="110"
        width="90"
      />

      {/* Grupa tekstowa po prawej */}
      <g transform="translate(100, 0)">
        {/* Tekst EWI PRO */}
        <text
          x="0"
          y="50"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="60" // większy font
          fill="#ffffff"
          dominantBaseline="middle"
        >
          EWI PRO
        </text>

        {/* Znak ® po prawej od O, lekko w górę */}
        <text
          x="285"
          y="30" // wyżej
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="20" // większy, żeby pasował do większego napisu
          fill="#ffffff"
          dominantBaseline="middle"
        >
          ®
        </text>

        {/* Podtytuł */}
        <text
          x="0"
          y="90" // trochę niżej, żeby pasował do większego fontu
          fontFamily="Arial, sans-serif"
          fontSize="20" // większy font
          fill="#ffffff"
        >
          External wall insulation systems
        </text>
      </g>
    </svg>
  );
};

export default EwiproLogo;
