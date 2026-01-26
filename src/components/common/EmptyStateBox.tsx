import { Box, Typography, BoxProps, SxProps, Theme } from '@mui/material';
import React from 'react';

interface EmptyStateBoxProps {
  icon: React.ReactElement;
  text: string;
  size?: { width: number | string; height: number | string };
  isDisabled?: boolean;
  onClick?: () => void;
  boxProps?: BoxProps;
}

const EmptyStateBox: React.FC<EmptyStateBoxProps> = ({
  icon,
  text,
  size = { width: "100%", height: 150 },
  isDisabled = false,
  onClick,
  boxProps,
}) => {
  
  const boxStyles: SxProps<Theme> = {
    width: size.width,
    height: size.height,
    borderRadius: 2,
    p: 1,
    border: `2px dashed #ccc`,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    cursor: isDisabled ? "default" : "pointer",
    transition: "opacity 0.3s",

    "&:hover": {
      bgcolor: isDisabled ? undefined : "#eee",
    },

    ...(boxProps?.sx),
  };

  const styledIcon = React.cloneElement(icon as React.ReactElement<any>, {
    sx: {
      fontSize: 40,
      color: isDisabled ? "#aaa" : "#999",
      mb: 0.5,
    },
  });

  return (
     <Box
      sx={boxStyles}   // ← KLUCZOWA POPRAWKA
      onClick={isDisabled ? undefined : onClick}
      {...boxProps}
    >
      {styledIcon}

      <Typography
        variant="subtitle1"
        sx={{
          color: isDisabled ? "#aaa" : "#999",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default EmptyStateBox;
