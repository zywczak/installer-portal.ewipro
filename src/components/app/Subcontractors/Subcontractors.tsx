// import React, { useRef, useState, useEffect } from "react";
// import { Box, CircularProgress, Typography, IconButton, Tooltip } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SubcontractorsTable from "./SubcontractorsTable";
// import SubcontractorsCards from "./SubcontractorsCards";
// import { useSubcontractors } from "./useSubcontractors";
// import { User } from "./types";
// import Legend from "../../common/projects&subcontractors/Legend";
// import AddSubcontractorDialog from "./AddSubcontractorDialog";
// import { useTranslation } from "react-i18next";

// interface Props {
//   isMobile: boolean;
//   onSubcontractorClick?: (id: string) => void;
// }

// const Subcontractors: React.FC<Props> = ({ isMobile, onSubcontractorClick }) => {
//   const { t } = useTranslation();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [useTiles, setUseTiles] = useState(false);
//   const [savedWidth, setSavedWidth] = useState<number | null>(null);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);

//   const { users, loading, error, refetch } = useSubcontractors();

//   const getCurrentPage = (): number => {
//     try {
//       const rawHash = globalThis.location.hash || "";
//       const hashWithoutHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
//       const queryPart = hashWithoutHash.includes("?") ? hashWithoutHash.split("?")[1] : "";
//       const params = new URLSearchParams(queryPart);
//       const page = params.get("page");
//       return page ? Number.parseInt(page, 10) : 1;
//     } catch {
//       return 1;
//     }
//   };

//   const [currentPage, setCurrentPage] = useState(getCurrentPage());

//   useEffect(() => {
//     const handleHashChange = () => {
//       setCurrentPage(getCurrentPage());
//     };
//     globalThis.addEventListener("hashchange", handleHashChange);
//     return () => globalThis.removeEventListener("hashchange", handleHashChange);
//   }, []);

//   const handlePageChange = (page: number) => {
//     const rawHash = globalThis.location.hash || "";
//     const hashWithoutHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
//     const basePath = hashWithoutHash.includes("?") ? hashWithoutHash.split("?")[0] : hashWithoutHash;
//     globalThis.location.hash = `${basePath}?page=${page}`;
//     setCurrentPage(page);
//   };

//   const handleRowClick = (user: User) => {
//     if (onSubcontractorClick) onSubcontractorClick(user.id.toString());
//     else globalThis.location.hash = `subcontractors/${user.id}`;
//   };

//   const handleTableOverflow = (isOverflowing: boolean) => {
//     if (isOverflowing && !useTiles) {
//       setUseTiles(true);
//       if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
//     }
//   };

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const resizeObserver = new ResizeObserver((entries) => {
//       for (let entry of entries) {
//         const width = entry.contentRect.width;
//         if (useTiles && savedWidth && width >= savedWidth + 1) {
//           setUseTiles(false);
//           setSavedWidth(null);
//         }
//       }
//     });
//     resizeObserver.observe(containerRef.current);
//     return () => resizeObserver.disconnect();
//   }, [useTiles, savedWidth]);

//   if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;
//   if (error) return <Box textAlign="center" py={4}><Typography color="error">{error}</Typography></Box>;

//   return (
//     <Box sx={{ height: "100%" }} ref={containerRef}>
//       {/* Header row: Legend on the left, + button on the right */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           mb: 1,
//         }}
//       >
//         <Legend type="subcontractor" />

//         <Tooltip title={t("views.subcontractors.addDialog.title", "Add Subcontractor")}>
//           <IconButton
//             onClick={() => setAddDialogOpen(true)}
//             size="small"
//             sx={{
//               backgroundColor: "primary.main",
//               color: "primary.contrastText",
//               "&:hover": {
//                 backgroundColor: "primary.dark",
//               },
//               width: 32,
//               height: 32,
//             }}
//           >
//             <AddIcon fontSize="small" />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       {users.length === 0 ? (
//         <Box textAlign="center" py={4}>
//           <Typography color="text.secondary">
//             {t("views.subcontractors.listEmpty.title")}
//           </Typography>
//         </Box>
//       ) : isMobile || useTiles ? (
//         <SubcontractorsCards
//           users={users}
//           onItemClick={(id) => handleRowClick({ id } as unknown as User)}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       ) : (
//         <SubcontractorsTable
//           users={users}
//           onRowClick={handleRowClick}
//           onOverflow={handleTableOverflow}
//           currentPage={currentPage}
//           onPageChange={handlePageChange}
//         />
//       )}

//       <AddSubcontractorDialog
//         open={addDialogOpen}
//         onClose={() => setAddDialogOpen(false)}
//         onSuccess={refetch}
//       />
//     </Box>
//   );
// };

// export default Subcontractors;



import React, { useRef, useState, useEffect } from "react";
import { Box, CircularProgress, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SubcontractorsTable from "./SubcontractorsTable";
import SubcontractorsCards from "./SubcontractorsCards";
import { useSubcontractors, SubcontractorSortOption } from "./useSubcontractors";
import { User } from "./types";
import Legend from "../../common/projects&subcontractors/Legend";
import AddSubcontractorDialog from "./AddSubcontractorDialog";
import SubcontractorsFilters from "./SubcontractorsFilters";
import { useTranslation } from "react-i18next";

interface Props {
  isMobile: boolean;
  onSubcontractorClick?: (id: string) => void;
}

const DEFAULT_SORT: SubcontractorSortOption = "projectIDDESC";

const Subcontractors: React.FC<Props> = ({ isMobile, onSubcontractorClick }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [useTiles, setUseTiles] = useState(false);
  const [savedWidth, setSavedWidth] = useState<number | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Filter & sort state
  const [sort, setSort] = useState<SubcontractorSortOption>(DEFAULT_SORT);
  const [search, setSearch] = useState("");

  const { users, loading, error, refetch } = useSubcontractors({ sort, search });

  const handleReset = () => {
    setSort(DEFAULT_SORT);
    setSearch("");
  };

  // Page from URL hash
  const getCurrentPage = (): number => {
    try {
      const rawHash = globalThis.location.hash || "";
      const hashWithoutHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
      const queryPart = hashWithoutHash.includes("?") ? hashWithoutHash.split("?")[1] : "";
      const params = new URLSearchParams(queryPart);
      const page = params.get("page");
      return page ? Number.parseInt(page, 10) : 1;
    } catch {
      return 1;
    }
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  useEffect(() => {
    const handleHashChange = () => setCurrentPage(getCurrentPage());
    globalThis.addEventListener("hashchange", handleHashChange);
    return () => globalThis.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Reset to page 1 on filter/sort change
  useEffect(() => {
    handlePageChange(1);
  }, [sort, search]);

  const handlePageChange = (page: number) => {
    const rawHash = globalThis.location.hash || "";
    const hashWithoutHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
    const basePath = hashWithoutHash.includes("?")
      ? hashWithoutHash.split("?")[0]
      : hashWithoutHash;
    globalThis.location.hash = `${basePath}?page=${page}`;
    setCurrentPage(page);
  };

  const handleRowClick = (user: User) => {
    if (onSubcontractorClick) onSubcontractorClick(user.id.toString());
    else globalThis.location.hash = `subcontractors/${user.id}`;
  };

  const handleTableOverflow = (isOverflowing: boolean) => {
    if (isOverflowing && !useTiles) {
      setUseTiles(true);
      if (containerRef.current) setSavedWidth(containerRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (useTiles && savedWidth && width >= savedWidth + 1) {
          setUseTiles(false);
          setSavedWidth(null);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [useTiles, savedWidth]);

  return (
    <Box sx={{ height: "100%" }} ref={containerRef}>
      {/* Header row: Legend on the left, + button on the right */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Legend type="subcontractor" />
        <Tooltip title={t("views.subcontractors.addDialog.title", "Add Subcontractor")}>
          <IconButton
            onClick={() => setAddDialogOpen(true)}
            size="small"
            sx={{
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { backgroundColor: "primary.dark" },
              width: 32,
              height: 32,
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <SubcontractorsFilters
        sort={sort}
        search={search}
        onSortChange={setSort}
        onSearchChange={setSearch}
        onReset={handleReset}
      />

      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Box textAlign="center" py={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !error && users.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            {t("views.subcontractors.listEmpty.title")}
          </Typography>
        </Box>
      )}

      {!loading && !error && users.length > 0 && (
        isMobile || useTiles ? (
          <SubcontractorsCards
            users={users}
            onItemClick={(id) => handleRowClick({ id } as unknown as User)}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <SubcontractorsTable
            users={users}
            onRowClick={handleRowClick}
            onOverflow={handleTableOverflow}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )
      )}

      <AddSubcontractorDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default Subcontractors;