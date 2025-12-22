import React from "react";
import { Box, Typography } from "@mui/material";
import { HelpImage } from "../../../form/types";

interface HelpImagesProps {
  images: HelpImage[];
}

const HelpImages: React.FC<HelpImagesProps> = ({ images }) => {
  const count = images.length;
  const minWidth = 120;
  const minHeight = 120;

  if (count === 1) {
    const img = images[0];
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
          p: "24px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#fafafa",
          }}
        >
          <img
            src={img.image_url}
            alt={img.caption || ""}
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: "60vh",
            }}
          />
        </Box>

        {img.caption && (
          <Typography
            variant="caption"
            display="block"
            align="center"
            sx={{ mt: 1 }}
          >
            {img.caption}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        width: "100%",
        justifyItems: "end",
      }}
    >
      {images.map((img) => (
        <Box
          key={img.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "100%",
            minWidth: `${minWidth}px`,
          }}
        >
          <Box
            sx={{
              width: "100%",
              minHeight: `${minHeight}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src={img.image_url}
              alt={img.caption || ""}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "40vh",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>

          {img.caption && (
            <Typography
              variant="caption"
              display="block"
              align="center"
              sx={{ mt: 0.5 }}
            >
              {img.caption}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default HelpImages;