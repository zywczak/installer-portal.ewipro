// import React from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Stack,
//   MenuItem,
// } from "@mui/material";
// import { FormData } from "../../app/AddProjectForm";
// import { Box } from "@mui/system";

// interface ProjectTypeStepProps {
//   formData: FormData;
//   setFormData: React.Dispatch<React.SetStateAction<FormData>>;
// }

// export default function ProjectTypeStep({ formData, setFormData }: ProjectTypeStepProps) {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <Box  sx={{ mb: 4 }}>
//         <Typography variant="h6" fontWeight={600} mb={2}>
//           3. Project Type
//         </Typography>
//         <Stack spacing={2}>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//             <TextField
//               select
//               fullWidth
//               label="Build Type"
//               name="buildType"
//               value={formData.buildType}
//               onChange={handleChange}
//             >
//               {[
//                 "New Build",
//                 "Retrofit or Refurbishment",
//               ].map((opt) => (
//                 <MenuItem key={opt} value={opt}>
//                   {opt}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               select
//               fullWidth
//               label="Substrate"
//               name="substrate"
//               value={formData.substrate}
//               onChange={handleChange}
//             >
//               {[
//                 "Standard Brick",
//                 "Block",
//                 "Other Masonry (Cavity, Stone, Clay)",
//                 "Park Home",
//                 "Timber Frame / SIPS",
//                 "Metal Frame",
//                 "ICF",
//                 "Other",
//               ].map((opt) => (
//                 <MenuItem key={opt} value={opt}>
//                   {opt}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Stack>

//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//             <TextField
//               select
//               fullWidth
//               label="System"
//               name="system"
//               value={formData.system}
//               onChange={handleChange}
//             >
//               {[
//                 "EWI EPS",
//                 "EWI Mineral Wool",
//                 "EWI K5",
//                 "Render Only",
//                 "Durashield Pro (Innovation System)",
//               ].map((opt) => (
//                 <MenuItem key={opt} value={opt}>
//                   {opt}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               select
//               fullWidth
//               label="PAS 2035"
//               name="pasRole"
//               value={formData.pasRole}
//               onChange={handleChange}
//             >
//               {["Yes", "No"].map((opt) => (
//                 <MenuItem key={opt} value={opt}>
//                   {opt}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Stack>
//         </Stack>
//       </Box>
//   );
// }



























import React from "react";
import {
  Typography,
  Stack,
  Box,
  MenuItem,
  TextField,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FormData } from "./types";

interface ProjectTypeStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function ProjectTypeStep({ formData, setFormData }: ProjectTypeStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectStyle = {
    '.MuiOutlinedInput-root': {
      borderRadius: '16px',
      backgroundColor: 'white',
      border: '1px solid #e0e0e0',
      boxShadow: 'none',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
      padding: '0 !important',
    },
    '.MuiInputBase-input': {
      padding: '16px 14px',
      height: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
    '.MuiInputLabel-root': { display: 'none' },
    mb: 0,
  };

  const CustomSelectIcon = (props: any) => (
    <ArrowForwardIosIcon 
      {...props} 
      sx={{ fontSize: '1rem', color: 'gray', pointerEvents: 'none', mr: 1 }} 
    />
  );

  const renderValue = (title: string, value: string) => {
    const displayValue = value || 'Choose'; 
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 4 }}>
        <Typography variant="body1" color="text.primary" fontWeight={500}>
          {title}
        </Typography>
        <Typography variant="body1" color={displayValue === 'Choose' ? 'text.secondary' : 'text.primary'}>
          {displayValue}
        </Typography>
      </Box>
    );
  };

  const fields = [
    { label: "Build type", name: "buildType", options: ["New Build", "Retrofit or Refurbishment"] },
    { label: "Substrate", name: "substrate", options: ["Standard Brick","Block","Other Masonry (Cavity, Stone, Clay)","Park Home","Timber Frame / SIPS","Metal Frame","ICF","Other"] },
    { label: "System", name: "system", options: ["EWI EPS","EWI Mineral Wool","EWI K5","Render Only","Durashield Pro (Innovation System)"] },
    { label: "PAS 2035", name: "pasRole", options: ["Yes","No"] },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Project type
      </Typography>

      {/* Elastyczny flex-wrap, pola zawijają się jeśli nie mieszczą się w kontenerze */}
      <Stack
        direction="row"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          gap: 2, // odstęp między polami
        }}
      >
        {fields.map((field) => (
          <TextField
            key={field.name}
            select
            name={field.name}
            value={formData[field.name as keyof FormData]}
            onChange={handleChange}
            SelectProps={{
              IconComponent: CustomSelectIcon,
              displayEmpty: true,
              renderValue: (value) => renderValue(field.label, value as string),
            }}
            sx={{
              ...selectStyle,
              flexGrow: 1,
              minWidth: 200, // minimalna szerokość pola
              maxWidth: "100%",
            }}
          >
            {field.options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        ))}
      </Stack>
    </Box>
  );
}
