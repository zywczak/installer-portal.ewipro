import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { StepInputProps } from "../StepInput";

const RadioStepInput: React.FC<StepInputProps> = ({ step, value, onChange }) => {
  const theme = useTheme();
  const sortedOptions = [...(step.options || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const handleChange = (val: string) => {
    const selectedOpt = sortedOptions.find((o) => o.option_value === val);
    onChange(val, selectedOpt?.id);
  };

  return (
    <Box
          display="grid"
          gap={1.5}
          gridTemplateColumns={{
            xs: "1fr",
            sm: sortedOptions.some((opt) => !!opt.icon_name)
              ? "repeat(auto-fit, minmax(120px, 1fr))"
              : "repeat(2, 1fr)",
          }}
        >
      {sortedOptions.map((opt) => {
        const isSelected = value === opt.option_value;
        const hasIcon = !!opt.icon_name;

        return (
              <Box
                key={opt.id}
                onClick={() => handleChange(opt.option_value)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  border: `2px solid ${
                    isSelected
                      ? "#54A852"
                      : "#757575"
                  }`,
                  backgroundColor: isSelected
                    ? "#c8e6c9"
                    : "#fff",
                  color: isSelected
                    ? "#54A852"
                    : "#757575",
                  p: 1,
                  mt: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                {hasIcon && (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.5,
                    }}
                  >
                    <img
                      src={opt.icon_name}
                      alt={opt.option_value}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        filter: isSelected
                          ? "none"
                          : "grayscale(100%) opacity(0.8)",
                        transition: "filter 0.2s ease",
                      }}
                    />
                  </Box>
                )}

                <Typography
                  variant="body2"
                  fontWeight={isSelected ? "bold" : "normal"}
                  textAlign="center"
                  sx={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {opt.option_value}
                </Typography>
              </Box>
            );
          })}
        </Box>
      );
    }

export default RadioStepInput;