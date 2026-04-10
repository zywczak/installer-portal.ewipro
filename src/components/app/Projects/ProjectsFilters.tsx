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
import { SortOption, RoleFilter, StatusFilter } from "./useProjects";

interface ProjectsFiltersProps {
  sort: SortOption;
  roleFilter: RoleFilter;
  statusFilter: StatusFilter;
  search: string;
  onSortChange: (value: SortOption) => void;
  onRoleFilterChange: (value: RoleFilter) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({
  sort,
  roleFilter,
  statusFilter,
  search,
  onSortChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onReset,
}) => {
  const { t } = useTranslation();

  const isModified =
    sort !== "projectIDDESC" ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    search !== "";

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        alignItems: "center",
        mb: 2,
      }}
    >
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

      {/* Role filter */}
      <ToggleButtonGroup
        size="small"
        exclusive
        value={roleFilter}
        onChange={(_, val) => val && onRoleFilterChange(val)}
      >
        <ToggleButton value="all">{t("common.all", "Wszystkie")}</ToggleButton>
        <ToggleButton value="owner">{t("common.owner", "Właściciel")}</ToggleButton>
        <ToggleButton value="member">{t("common.member", "Członek")}</ToggleButton>
      </ToggleButtonGroup>

      {/* Status filter */}
      <ToggleButtonGroup
        size="small"
        exclusive
        value={statusFilter}
        onChange={(_, val) => val && onStatusFilterChange(val)}
      >
        <ToggleButton value="all">{t("common.all", "Wszystkie")}</ToggleButton>
        <ToggleButton value="ongoing">{t("common.ongoing", "Aktywne")}</ToggleButton>
        <ToggleButton value="archived">{t("common.archived", "Archiwum")}</ToggleButton>
      </ToggleButtonGroup>

      {/* Reset */}
      {isModified && (
        <Tooltip title={t("common.reset", "Resetuj filtry")}>
          <IconButton size="small" onClick={onReset} color="default">
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ProjectsFilters;