// import React, { useState, useRef } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   MenuItem,
//   Paper,
//   Popper,
//   Grow,
//   ClickAwayListener,
//   MenuList,
// } from "@mui/material";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import GroupIcon from "@mui/icons-material/Group";
// import ArchiveIcon from "@mui/icons-material/Archive";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import ProjectAvatars from "./ProjectAvatars";
// import { useWrapDetection } from "./useWrapDetection";
// import { Address } from "../../../common/address";
// import ApprovedWarrantyBox from "./ApprovedWarrantyBox";
// import StageBar from "../StageBar/StageBar";
// import AcceptButton from "../../../common/AcceptButton";

// interface Member {
//   id: number;
//   name: string;
//   avatar?: string | null;
//   userID?: number;
// }

// interface ApprovedWarranty {
//   number: string;
//   warrantyType: number;
//   period: number;
//   status: string;
//   downloadURI?: string;
// }

// interface ProjectWarranty {
//   approved: ApprovedWarranty | null;
//   others: {
//     status: string;
//   }[];
// }

// interface ProjectHeaderProps {
//   contactId?: number;
//   installer?: string;
//   startDate?: string;
//   finishDate?: string;
//   currentStage: number;
//   stagingSystemID: number;
//   projectCode?: string;
//   address1?: string;
//   address2?: string;
//   address3?: string;
//   postcode?: string;
//   access_type_name?: string;
//   ownerAvatar?: string;
//   ownerId?: number;
//   projectMembers?: Member[];
//   projectMaxStage?: number;
//   projectStatusName?: string;
//   approvedWarranty?: ApprovedWarranty | null;
//   projectWarranty?: ProjectWarranty | null;
//   onEditTeamMembers?: () => void;
//   onArchiveProject?: () => void;
//   onRemoveProject?: () => void;
// }

// const ProjectHeader: React.FC<ProjectHeaderProps> = ({
//   contactId,
//   installer,
//   startDate,
//   finishDate,
//   currentStage,
//   stagingSystemID,
//   projectCode,
//   address1,
//   address2,
//   address3,
//   postcode,
//   access_type_name,
//   ownerAvatar,
//   ownerId,
//   projectMembers = [],
//   projectMaxStage,
//   projectStatusName,
//   approvedWarranty,
//   projectWarranty,
//   onEditTeamMembers,
//   onArchiveProject,
//   onRemoveProject,
// }) => {
//   const projectAddress = [address1, address2, address3, postcode]
//     .filter(Boolean)
//     .join(", ");

//   const { containerRef, isWrapped } = useWrapDetection();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const anchorRef = useRef<HTMLButtonElement>(null);

//   const handleMenuToggle = () => setMenuOpen((prev) => !prev);

//   const handleMenuClose = (event: Event | React.SyntheticEvent) => {
//     if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
//       return;
//     }
//     setMenuOpen(false);
//   };

//   const handleMenuItemClick = (action: (() => void) | undefined) => {
//     setMenuOpen(false);
//     action?.();
//   };

//   const rejectedWarrantiesCount =
//     projectWarranty?.others?.filter((w) => w.status === "Rejected").length || 0;

//   const hasApprovedWarranty =
//     approvedWarranty?.status === "Approved" ||
//     projectWarranty?.approved?.status === "Approved";

//   const canApplyForWarranty =
//     !hasApprovedWarranty &&
//     typeof projectMaxStage === "number" &&
//     typeof currentStage === "number" &&
//     currentStage >= projectMaxStage;

//   const showWarrantyButton = canApplyForWarranty;
//   const warrantyButtonText =
//     rejectedWarrantiesCount > 0 ? "REAPPLY FOR WARRANTY" : "APPLY FOR WARRANTY";

//   const avatars = (
//     <ProjectAvatars
//       ownerId={ownerId}
//       ownerAvatar={ownerAvatar}
//       ownerName={installer}
//       members={projectMembers}
//     />
//   );

//   const warrantyToDisplay = approvedWarranty || projectWarranty?.approved;

//   const menuItems = [
//     {
//       label: "Edit team members",
//       icon: <GroupIcon fontSize="small" />,
//       onClick: onEditTeamMembers,
//     },
//     {
//       label: "Archive project",
//       icon: <ArchiveIcon fontSize="small" />,
//       onClick: onArchiveProject,
//     },
//     {
//       label: "Remove project",
//       icon: <DeleteOutlineIcon fontSize="small" />,
//       onClick: onRemoveProject,
//       color: "error.main",
//     },
//   ];

//   // Three-dot button + dropdown — sits inline right after the address text
//   const menuButton = (
//     <Box sx={{ position: "relative", display: "inline-flex" }}>
//       <IconButton
//         ref={anchorRef}
//         size="small"
//         onClick={handleMenuToggle}
//         aria-label="Project options"
//         aria-controls={menuOpen ? "project-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={menuOpen ? "true" : undefined}
//         sx={{ color: "text.secondary", "&:hover": { backgroundColor: "action.hover" } }}
//       >
//         <MoreHorizIcon fontSize="small" />
//       </IconButton>

//       <Popper
//         open={menuOpen}
//         anchorEl={anchorRef.current}
//         placement="bottom-start"
//         transition
//         disablePortal
//         style={{ zIndex: 1300 }}
//       >
//         {({ TransitionProps }) => (
//           <Grow {...TransitionProps} style={{ transformOrigin: "left top" }}>
//             <Paper elevation={3} sx={{ borderRadius: 2, minWidth: 200, overflow: "hidden" }}>
//               <ClickAwayListener onClickAway={handleMenuClose}>
//                 <MenuList id="project-menu" dense>
//                   {menuItems.map((item) => (
//                     <MenuItem
//                       key={item.label}
//                       onClick={() => handleMenuItemClick(item.onClick)}
//                       sx={{
//                         gap: 1.5,
//                         py: 1,
//                         px: 2,
//                         color: item.color ?? "text.primary",
//                         "&:hover": {
//                           backgroundColor: item.color ? "error.lighter" : "action.hover",
//                         },
//                       }}
//                     >
//                       <Box
//                         component="span"
//                         sx={{ color: item.color ?? "text.secondary", display: "flex" }}
//                       >
//                         {item.icon}
//                       </Box>
//                       <Typography variant="body2">{item.label}</Typography>
//                     </MenuItem>
//                   ))}
//                 </MenuList>
//               </ClickAwayListener>
//             </Paper>
//           </Grow>
//         )}
//       </Popper>
//     </Box>
//   );

//   return (
//     <Box p={3} pb={0} pt={2} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
//       {warrantyToDisplay?.status === "Approved" ? (
//         <>
//           {/* Address line with three-dot menu at the end */}
//           <Box display="flex" alignItems="center" gap={1} mb={2}>
//             <Address addr={projectAddress} />
//             {menuButton}
//           </Box>

//           <Box
//             ref={containerRef}
//             display="flex"
//             flexWrap="wrap"
//             alignItems="center"
//             justifyContent={isWrapped ? "center" : "space-between"}
//             gap={2}
//             mb={2}
//           >
//             {avatars}
//             <ApprovedWarrantyBox approvedWarranty={warrantyToDisplay} />
//           </Box>
//         </>
//       ) : (
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           flexWrap="wrap"
//           mb={2}
//         >
//           {/* Address + three-dot menu inline */}
//           <Box display="flex" alignItems="center" gap={1}>
//             <Address addr={projectAddress} />
//             {menuButton}
//           </Box>
//           {avatars}
//         </Box>
//       )}

//       <StageBar
//         currentStage={currentStage}
//         stagingSystemID={stagingSystemID}
//         projectMaxStage={projectMaxStage}
//         projectStatusName={projectStatusName}
//       />

//       {showWarrantyButton && (
//         <Box display="flex" justifyContent="center" mt={3} mb={2}>
//           <AcceptButton
//             label={warrantyButtonText}
//             onClick={() => {}} // handleWarrantyClick
//             size="medium"
//           />
//         </Box>
//       )}

//       <Box display="flex" alignItems="center" justifyContent="center" pb={1} gap={2}>
//         <Box width={50} height="1px" bgcolor="#b0b0b0" />
//         <Typography variant="caption" color="text.secondary">
//           Project ID: {projectCode}
//         </Typography>
//         <Box width={50} height="1px" bgcolor="#b0b0b0" />
//       </Box>
//     </Box>
//   );
// };

// export default ProjectHeader;


import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GroupIcon from "@mui/icons-material/Group";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ProjectAvatars from "./ProjectAvatars";
import { useWrapDetection } from "./useWrapDetection";
import { Address } from "../../../common/address";
import ApprovedWarrantyBox from "./ApprovedWarrantyBox";
import StageBar from "../StageBar/StageBar";
import AcceptButton from "../../../common/AcceptButton";
import useArchiveProject from "./Usearchiveproject";
import useDeleteProject from "./Usedeleteproject";
import useProjectMembers from "./Useprojectmembers";

interface Member {
  id: number;
  name: string;
  avatar?: string | null;
  userID?: number;
}

interface ApprovedWarranty {
  number: string;
  warrantyType: number;
  period: number;
  status: string;
  downloadURI?: string;
}

interface ProjectWarranty {
  approved: ApprovedWarranty | null;
  others: {
    status: string;
  }[];
}

interface ProjectHeaderProps {
  contactId?: number;
  projectID?: number;
  installer?: string;
  startDate?: string;
  finishDate?: string;
  currentStage: number;
  stagingSystemID: number;
  projectCode?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  postcode?: string;
  access_type_name?: string;
  ownerAvatar?: string;
  ownerId?: number;
  projectMembers?: Member[];
  projectMaxStage?: number;
  projectStatusName?: string;
  approvedWarranty?: ApprovedWarranty | null;
  projectWarranty?: ProjectWarranty | null;
  onArchiveSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onMembersChanged?: () => void;
}

const MEMBER_TYPE = 4;

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  contactId,
  projectID,
  installer,
  startDate,
  finishDate,
  currentStage,
  stagingSystemID,
  projectCode,
  address1,
  address2,
  address3,
  postcode,
  access_type_name,
  ownerAvatar,
  ownerId,
  projectMembers = [],
  projectMaxStage,
  projectStatusName,
  approvedWarranty,
  projectWarranty,
  onArchiveSuccess,
  onDeleteSuccess,
  onMembersChanged,
}) => {
  const projectAddress = [address1, address2, address3, postcode]
    .filter(Boolean)
    .join(", ");

  const { containerRef, isWrapped } = useWrapDetection();

  // ─── Dropdown menu ───────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
    setMenuOpen(false);
  };
  const handleMenuItemClick = (action: (() => void) | undefined) => {
    setMenuOpen(false);
    action?.();
  };

  // ─── Archive ─────────────────────────────────────────────────────────────
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const { archiveProject, isLoading: isArchiving } = useArchiveProject();

  const handleArchiveClick = () => { setArchiveError(null); setArchiveDialogOpen(true); };
  const handleArchiveCancel = () => { if (isArchiving) return; setArchiveDialogOpen(false); setArchiveError(null); };
  const handleArchiveConfirm = async () => {
    if (!projectID || !contactId) { setArchiveError("Missing project or contact information."); return; }
    try {
      await archiveProject({ projectID, contactID: contactId });
      setArchiveDialogOpen(false);
      onArchiveSuccess?.();
    } catch { setArchiveError("Something went wrong. Please try again."); }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { deleteProject, isLoading: isDeleting } = useDeleteProject();

  const handleDeleteClick = () => { setDeleteError(null); setDeleteDialogOpen(true); };
  const handleDeleteCancel = () => { if (isDeleting) return; setDeleteDialogOpen(false); setDeleteError(null); };
  const handleDeleteConfirm = async () => {
    if (!projectID || !contactId) { setDeleteError("Missing project or contact information."); return; }
    try {
      await deleteProject({ projectID, contactID: contactId });
      setDeleteDialogOpen(false);
      onDeleteSuccess?.();
    } catch { setDeleteError("Something went wrong. Please try again."); }
  };

  // ─── Edit Members ─────────────────────────────────────────────────────────
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRemove, setPendingRemove] = useState<number | null>(null); // subcontractorID being removed

  const {
    subcontractors,
    isFetchingSubcontractors,
    fetchSubcontractors,
    addMember,
    isAdding,
    removeMember,
    isRemoving,
    error: membersError,
    clearError: clearMembersError,
  } = useProjectMembers();

  const handleEditMembersClick = async () => {
    clearMembersError();
    setSearchQuery("");
    setMembersDialogOpen(true);
    await fetchSubcontractors(ownerId);
  };

  const handleMembersDialogClose = () => {
    if (isAdding || isRemoving) return;
    setMembersDialogOpen(false);
  };

  // IDs of current project members for quick lookup
  const currentMemberIds = new Set(projectMembers.map((m) => m.id));

  const handleAddMember = async (subcontractorID: number) => {
    if (!projectID) return;
    try {
      await addMember({ subcontractorID, projectID, memberType: MEMBER_TYPE });
      onMembersChanged?.();
    } catch { /* error shown via membersError */ }
  };

  const handleRemoveMember = async (subcontractorID: number) => {
    if (!projectID || !contactId) return;
    setPendingRemove(subcontractorID);
    try {
      await removeMember({ subcontractorID, projectID, contactID: contactId });
      onMembersChanged?.();
    } catch { /* error shown via membersError */ }
    setPendingRemove(null);
  };

  const filteredSubcontractors = subcontractors.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Warranty logic ───────────────────────────────────────────────────────
  const rejectedWarrantiesCount =
    projectWarranty?.others?.filter((w) => w.status === "Rejected").length || 0;
  const hasApprovedWarranty =
    approvedWarranty?.status === "Approved" ||
    projectWarranty?.approved?.status === "Approved";
  const canApplyForWarranty =
    !hasApprovedWarranty &&
    typeof projectMaxStage === "number" &&
    typeof currentStage === "number" &&
    currentStage >= projectMaxStage;
  const showWarrantyButton = canApplyForWarranty;
  const warrantyButtonText =
    rejectedWarrantiesCount > 0 ? "REAPPLY FOR WARRANTY" : "APPLY FOR WARRANTY";

  const avatars = (
    <ProjectAvatars
      ownerId={ownerId}
      ownerAvatar={ownerAvatar}
      ownerName={installer}
      members={projectMembers}
    />
  );
  const warrantyToDisplay = approvedWarranty || projectWarranty?.approved;

  // ─── Menu items ───────────────────────────────────────────────────────────
  const menuItems = [
    { label: "Edit team members", icon: <GroupIcon fontSize="small" />, onClick: handleEditMembersClick },
    { label: "Archive project",   icon: <ArchiveIcon fontSize="small" />, onClick: handleArchiveClick },
    { label: "Remove project",    icon: <DeleteOutlineIcon fontSize="small" />, onClick: handleDeleteClick, color: "error.main" },
  ];

  // ─── Three-dot button ─────────────────────────────────────────────────────
  const menuButton = (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <IconButton
        ref={anchorRef}
        size="small"
        onClick={handleMenuToggle}
        aria-label="Project options"
        aria-controls={menuOpen ? "project-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        sx={{ color: "text.secondary", "&:hover": { backgroundColor: "action.hover" } }}
      >
        <MoreHorizIcon fontSize="small" />
      </IconButton>

      <Popper open={menuOpen} anchorEl={anchorRef.current} placement="bottom-start" transition disablePortal style={{ zIndex: 1300 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "left top" }}>
            <Paper elevation={3} sx={{ borderRadius: 2, minWidth: 200, overflow: "hidden" }}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList id="project-menu" dense>
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => handleMenuItemClick(item.onClick)}
                      sx={{
                        gap: 1.5, py: 1, px: 2,
                        color: item.color ?? "text.primary",
                        "&:hover": { backgroundColor: item.color ? "error.lighter" : "action.hover" },
                      }}
                    >
                      <Box component="span" sx={{ color: item.color ?? "text.secondary", display: "flex" }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2">{item.label}</Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box p={3} pb={0} pt={2} mb={3} borderRadius={3} boxShadow={2} bgcolor="#fff">
      {warrantyToDisplay?.status === "Approved" ? (
        <>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Address addr={projectAddress} />
            {menuButton}
          </Box>
          <Box ref={containerRef} display="flex" flexWrap="wrap" alignItems="center"
            justifyContent={isWrapped ? "center" : "space-between"} gap={2} mb={2}>
            {avatars}
            <ApprovedWarrantyBox approvedWarranty={warrantyToDisplay} />
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Address addr={projectAddress} />
            {menuButton}
          </Box>
          {avatars}
        </Box>
      )}

      <StageBar currentStage={currentStage} stagingSystemID={stagingSystemID} projectMaxStage={projectMaxStage} projectStatusName={projectStatusName} />

      {showWarrantyButton && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <AcceptButton label={warrantyButtonText} onClick={() => {}} size="medium" />
        </Box>
      )}

      <Box display="flex" alignItems="center" justifyContent="center" pb={1} gap={2}>
        <Box width={50} height="1px" bgcolor="#b0b0b0" />
        <Typography variant="caption" color="text.secondary">Project ID: {projectCode}</Typography>
        <Box width={50} height="1px" bgcolor="#b0b0b0" />
      </Box>

      {/* ── Edit Members dialog ── */}
      <Dialog open={membersDialogOpen} onClose={handleMembersDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Edit team members
          <IconButton size="small" onClick={handleMembersDialogClose} disabled={isAdding || isRemoving}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 1 }}>
          {/* Current members */}
          {projectMembers.length > 0 && (
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Current members
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {projectMembers.map((member) => (
                  <Chip
                    key={member.id}
                    label={member.name}
                    avatar={
                      <Avatar src={member.avatar ?? undefined}>
                        {member.name?.[0]}
                      </Avatar>
                    }
                    onDelete={
                      pendingRemove === member.id
                        ? undefined
                        : () => handleRemoveMember(member.id)
                    }
                    deleteIcon={
                      pendingRemove === member.id
                        ? <CircularProgress size={14} />
                        : undefined
                    }
                    disabled={pendingRemove === member.id}
                    variant="outlined"
                    size="medium"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search subcontractors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />

          {/* Error */}
          {membersError && (
            <Typography color="error" variant="body2" mb={1}>
              {membersError}
            </Typography>
          )}

          {/* Subcontractors list */}
          {isFetchingSubcontractors ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={32} />
            </Box>
          ) : filteredSubcontractors.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              No subcontractors found.
            </Typography>
          ) : (
            <List dense disablePadding sx={{ maxHeight: 320, overflowY: "auto" }}>
              {filteredSubcontractors.map((sub) => {
                const isMember = currentMemberIds.has(sub.id);
                return (
                  <ListItem
                    key={sub.id}
                    secondaryAction={
                      isMember ? (
                        <IconButton
                          edge="end"
                          size="small"
                          color="error"
                          disabled={pendingRemove === sub.id || isRemoving}
                          onClick={() => handleRemoveMember(sub.id)}
                          aria-label={`Remove ${sub.name}`}
                        >
                          {pendingRemove === sub.id
                            ? <CircularProgress size={16} />
                            : <CloseIcon fontSize="small" />}
                        </IconButton>
                      ) : (
                        <IconButton
                          edge="end"
                          size="small"
                          color="primary"
                          disabled={isAdding}
                          onClick={() => handleAddMember(sub.id)}
                          aria-label={`Add ${sub.name}`}
                        >
                          {isAdding
                            ? <CircularProgress size={16} />
                            : <PersonAddIcon fontSize="small" />}
                        </IconButton>
                      )
                    }
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      bgcolor: isMember ? "action.selected" : "transparent",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={sub.avatar ?? undefined} sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {sub.name?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={sub.name}
                      primaryTypographyProps={{ variant: "body2" }}
                      secondary={isMember ? "Already in project" : undefined}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleMembersDialogClose} disabled={isAdding || isRemoving} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Archive confirmation dialog ── */}
      <Dialog open={archiveDialogOpen} onClose={handleArchiveCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Archive project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to archive this project? This action can be undone later by contacting support.
          </DialogContentText>
          {archiveError && <Typography color="error" variant="body2" mt={1}>{archiveError}</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleArchiveCancel} disabled={isArchiving} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleArchiveConfirm} disabled={isArchiving} variant="contained" color="warning"
            startIcon={isArchiving ? <CircularProgress size={16} color="inherit" /> : <ArchiveIcon />}>
            {isArchiving ? "Archiving..." : "Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete confirmation dialog ── */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Remove project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently remove this project? This action <strong>cannot be undone</strong>.
          </DialogContentText>
          {deleteError && <Typography color="error" variant="body2" mt={1}>{deleteError}</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} disabled={isDeleting} variant="outlined" color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} disabled={isDeleting} variant="contained" color="error"
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}>
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectHeader;