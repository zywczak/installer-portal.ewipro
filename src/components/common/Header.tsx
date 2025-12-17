import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";

interface HeaderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showDivider?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  icon,
  title,
  description,
  actions,
  showDivider = true,
}) => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              color: "grey",
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              '& svg': { fontSize: 'inherit' },
            }}
          >
            {icon}
          </Box>
          <Stack direction="column" spacing={0.2} alignItems="flex-start">
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
              >
                {description}
              </Typography>
            )}
          </Stack>
        </Stack>

        {actions && (
          <Box display="flex" alignItems="center" gap={1}>
            {actions}
          </Box>
        )}
      </Stack>
      {showDivider && <Divider sx={{ mb: 2 }} />}
    </>
  );
};

export default Header;
