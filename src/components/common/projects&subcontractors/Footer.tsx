import { Box, Typography, IconButton, Select, MenuItem } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

interface Props {
  currentPage: number;
  totalPages: number;
  itemsCount: number;
  onPrev: () => void;
  onNext: () => void;
  onPageSelect: (page: number) => void;
  sticky?: boolean;
}

export default function Footer({
  currentPage,
  totalPages,
  itemsCount,
  onPrev,
  onNext,
  onPageSelect,
  sticky = true,
}: Props) {
  return (
    <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    padding: "8px 16px",
    backgroundColor: "#fff",
    borderTop: "1px solid #ddd",
    position: sticky ? "sticky" : "relative",
    bottom: sticky ? 0 : "auto",
    zIndex: sticky ? 10 : "auto",
  }}
>
  <IconButton onClick={onPrev} disabled={currentPage === 1} size="small">
    <ArrowBackIos fontSize="inherit" />
  </IconButton>

  <Typography variant="body2" color="text.secondary">
    Page
  </Typography>

  <Select
    size="small"
    value={currentPage}
    onChange={(e) => onPageSelect(Number(e.target.value))}
    sx={{
      minWidth: 40,
      height: 28,
      fontSize: "0.8rem",
      "& .MuiSelect-select": {
        padding: "4px 8px",
        textAlign: "center",
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          "& .MuiMenuItem-root": {
            fontSize: "0.8rem",
            minHeight: 24,
            padding: "2px 8px",
            textAlign: "center",
            justifyContent: "center",
          },
        },
      },
    }}
  >
    {Array.from({ length: totalPages }).map((_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>
    ))}
  </Select>

  <Typography variant="body2" color="text.secondary">
    of {totalPages}, {itemsCount} items
  </Typography>

  <IconButton
    onClick={onNext}
    disabled={currentPage === totalPages}
    size="small"
  >
    <ArrowForwardIos fontSize="inherit" />
  </IconButton>
</Box>

  );
}