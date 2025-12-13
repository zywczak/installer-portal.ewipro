import { Typography } from "@mui/material";

export const SubcontractorName: React.FC<{ name: string }> = ({ name }) => (
    <Typography
        sx={{
            mt: 1,
            fontWeight: 700,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
        }}
    >
        {name}
    </Typography>
);