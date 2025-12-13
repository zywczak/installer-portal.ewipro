import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export const Address: React.FC<{ addr: string }> = ({ addr }) => {
    const parts = addr.split(", ");
    if (parts.length < 2) return <Typography>{addr}</Typography>;

    const postcode = parts.pop();
    const main = parts.join(", ");

    return (
        <Box
            sx={{
                textAlign: "center",
                mt: 1,
                lineHeight: 1.2,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 0.5,
            }}
        >
            <Typography
                sx={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                }}
            >
                {postcode}
            </Typography>
            <Typography
                sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minWidth: 0,
                }}
            >
                {main}
            </Typography>
        </Box>
    );
};