// import React from "react";
// import { Box, Typography } from "@mui/material";
// import { Project } from "./types";
// import { useTranslation } from "react-i18next";
// import ProjectsCards from "../Projects/ProjectsCards";
// import ProjectsTable from "../Projects/ProjectsTable";
// import Legend from "../../common/projects&subcontractors/Legend";

// interface ProjectsTabProps {
//   projects: Project[];
//   isMobile: boolean;
//   stickyFooter?: boolean;
//   currentPage?: number;
//   onPageChange?: (page: number) => void;
// }

// const ProjectsTab: React.FC<ProjectsTabProps> = ({
//   projects,
//   isMobile,
//   stickyFooter,
//   currentPage,
//   onPageChange,
// }) => {
//   const { t } = useTranslation();

//   const handleProjectClick = (project: Project) => {
//     globalThis.location.hash = `projects/${project.id}/${project.contactID}`;
//   };

//   if (projects.length === 0) {
//     return (
//       <Typography color="text.secondary">
//         {t("views.subcontractors.subViews.projects.listEmpty.title")}
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       <Legend type="project" showAddButton={false} />
//       {isMobile ? (
//         <ProjectsCards
//           projects={projects}
//           stickyFooter={stickyFooter}
//           currentPage={currentPage}
//           onPageChange={onPageChange}
//           onItemClick={handleProjectClick}
//           noFooterOffset
//         />
//       ) : (
//         <ProjectsTable
//           rows={projects}
//           onRowClick={handleProjectClick}
//           onOverflow={() => {}}
//           stickyFooter={stickyFooter}
//           currentPage={currentPage}
//           onPageChange={onPageChange}
//           noFooterOffset
//         />
//       )}
//     </Box>
//   );
// };

// export default ProjectsTab;



import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Project } from "./types";
import { useTranslation } from "react-i18next";
import ProjectsCards from "../Projects/ProjectsCards";
import ProjectsTable from "../Projects/ProjectsTable";
import Legend from "../../common/projects&subcontractors/Legend";
import ProjectsFilters from "../Projects/ProjectsFilters";
import { useProjectFilters } from "./hooks"; // ← nowy import

interface ProjectsTabProps {
  projects: Project[];
  isMobile: boolean;
  stickyFooter?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  isMobile,
  stickyFooter,
  currentPage,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const {
    sort, setSort,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    search, setSearch,
    reset,
    filteredProjects,
  } = useProjectFilters(projects); // ← filtrowanie tutaj

  useEffect(() => {
  onPageChange?.(1);
}, [sort, roleFilter, statusFilter, search]);

  const handleProjectClick = (project: Project) => {
    globalThis.location.hash = `projects/${project.id}/${project.contactID}`;
  };

  if (projects.length === 0) {
    return (
      <Typography color="text.secondary">
        {t("views.subcontractors.subViews.projects.listEmpty.title")}
      </Typography>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Legend type="project" showAddButton={false} />

      {/* ← filtry */}
      <ProjectsFilters
        sort={sort}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        search={search}
        onSortChange={setSort}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
        onSearchChange={setSearch}
        onReset={reset}
      />

      {filteredProjects.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {t("common.noResults", "Brak wyników")}
        </Typography>
      ) : isMobile ? (
        <ProjectsCards
          projects={filteredProjects} // ← przefiltrowane
          stickyFooter={stickyFooter}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onItemClick={handleProjectClick}
          noFooterOffset
        />
      ) : (
        <ProjectsTable
          rows={filteredProjects} // ← przefiltrowane
          onRowClick={handleProjectClick}
          onOverflow={() => {}}
          stickyFooter={stickyFooter}
          currentPage={currentPage}
          onPageChange={onPageChange}
          noFooterOffset
        />
      )}
    </Box>
  );
};

export default ProjectsTab;