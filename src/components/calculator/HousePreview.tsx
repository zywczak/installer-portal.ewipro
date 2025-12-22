import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import defaultImage from "../../assets/default.png";

interface StepOptionImage {
  id: number;
  layer:
    | "main"
    | "second"
    | "third"
    | "fourth"
    | "fifth"
    | "sixth"
    | "seventh"
    | "eighth";
  image_url: string;
  options: number[];
}

interface OverlayImages {
  main: string | null;
  second: string | null;
  third: string | null;
  fourth: string | null;
  fifth: string | null;
  sixth: string | null;
  seventh: string | null;
  eighth: string | null;
}

interface HousePreviewProps {
  selectedOptions: number[];
  colour: string;
  isMobile?: boolean;
}

const HousePreview: React.FC<HousePreviewProps> = ({ selectedOptions, colour, isMobile = false }) => {
  const [allImages, setAllImages] = useState<StepOptionImage[]>([]);
  const [overlayImages, setOverlayImages] = useState<OverlayImages>({
    main: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
    sixth: null,
    seventh: null,
    eighth: null,
  });

  useEffect(() => {
    axios
      .get<StepOptionImage[]>("http://localhost:8000/api/step-option-images/")
      .then((res) => setAllImages(res.data))
      .catch((err) => console.error("Error fetching images:", err));
  }, []);

  useEffect(() => {
    if (allImages.length === 0) return;

    setOverlayImages(() => {
      const updated: OverlayImages = {
        main: null,
        second: null,
        third: null,
        fourth: null,
        fifth: null,
        sixth: null,
        seventh: null,
        eighth: null,
      };

      (
        [
          "main",
          "second",
          "third",
          "fourth",
          "fifth",
          "sixth",
          "seventh",
          "eighth",
        ] as const
      ).forEach((layer) => {
        const matched = allImages
          .filter((img) => img.layer === layer)
          .filter((img) =>
            img.options.every((optId) => selectedOptions.includes(optId))
          );

        if (matched.length > 0) {
          const bestMatch = matched.reduce((prev, curr) => {
            const prevMax = Math.max(...prev.options);
            const currMax = Math.max(...curr.options);
            return currMax > prevMax ? curr : prev;
          });
          updated[layer] = bestMatch.image_url;
        }
      });

      return updated;
    });
  }, [selectedOptions, allImages]);

  const layerZIndex: Record<keyof OverlayImages, number> = {
    main: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        width: isMobile ? "100%" : "600px",
        height: isMobile ? "auto" : "450px",
        aspectRatio: isMobile ? "4/3" : undefined,
      }}
    >
      <Box
        component="img"
        src={defaultImage}
        alt="default"
        sx={{
          width: "100%",
          height: "100%",
          margin: 0,
          borderRadius: isMobile ? 2 : 3,
          objectFit: "contain",
          zIndex: 0,
        }}
      />

      {(
        [
          "main",
          "second",
          "third",
          "fourth",
          "fifth",
          "sixth",
          "seventh",
          "eighth",
        ] as const
      )
        .filter((layer) => overlayImages[layer] !== null)
        .map((layer) => (
          <Box
            key={layer}
            component="img"
            src={overlayImages[layer]!}
            alt={layer}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "opacity 0.4s ease-in-out",
              opacity: 1,
              zIndex: layerZIndex[layer],
            }}
          />
        ))}
        
      {overlayImages.fifth && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: layerZIndex.fifth,
            backgroundColor: colour,
            WebkitMaskImage: `url(${overlayImages.fifth})`,
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            WebkitMaskPosition: "center",
            maskImage: `url(${overlayImages.fifth})`,
            maskRepeat: "no-repeat",
            maskSize: "contain",
            maskPosition: "center",
            transition: "opacity 0.4s ease-in-out",
          }}
        />
      )}
    </Box>
  );
};

export default HousePreview;