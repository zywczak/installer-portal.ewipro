import React from "react";
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTranslation } from "react-i18next";
import { SubcontractorSortOption } from "./useSubcontractors";

interface SubcontractorsFiltersProps {
  sort: SubcontractorSortOption;
  search: string;
  onSortChange: (value: SubcontractorSortOption) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const SubcontractorsFilters: React.FC<SubcontractorsFiltersProps> = ({
  sort,
  search,
  onSortChange,
  onSearchChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const isModified = sort !== "projectIDDESC" || search !== "";

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 2 }}>
      {/* Search */}
      <TextField
        size="small"
        placeholder={t("common.search", "Szukaj...")}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 200, flex: "1 1 200px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Sort */}
      <ToggleButtonGroup
        size="small"
        exclusive
        value={sort}
        onChange={(_, val) => val && onSortChange(val)}
      >
        <ToggleButton value="projectIDDESC">
          <Tooltip title={t("common.newestFirst", "Najnowsze")}>
            <ArrowDownwardIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="projectIDASC">
          <Tooltip title={t("common.oldestFirst", "Najstarsze")}>
            <ArrowUpwardIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Reset */}
      {isModified && (
        <Tooltip title={t("common.reset", "Resetuj")}>
          <IconButton size="small" onClick={onReset}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default SubcontractorsFilters;