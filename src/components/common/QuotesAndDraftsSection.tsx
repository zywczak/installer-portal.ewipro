import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const infoContent = (
  <Box sx={{ p: 1, maxWidth: 300, textAlign: 'left' }}>
    <Typography variant="subtitle1" fontWeight="bold">
      Quotes and drafts
    </Typography>
   <Typography variant="body2" sx={{ mt: 1 }}>  
    <Typography component="span" fontWeight="bold">
        Drafts
    </Typography>{" "}
    are only visible to you and stored locally for 30 days. After that time they will be automatically removed from the app.
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
    <Typography component="span" fontWeight="bold">
        Quotes
    </Typography>{" "}
    are visible to both you and EWI Store Support therefore it's possible to make some adjustments to a quote by EWI STORE.
    </Typography>
    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
      Need help with a quote? Contact us:
    </Typography>
   <Typography 
  variant="body2" 
  sx={{ 
    mt: 0.5, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 0.5, 
    color: 'green', // kolor tekstu i ikony
  }}
>
  <LocalPhoneIcon fontSize="small" sx={{ color: 'green' }} />
  0203 3974 067
</Typography>

  </Box>
);

const QuotesAndDraftsSection = ({ unsoldQuotesLength }: { unsoldQuotesLength: number }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2
    }}
  >
    {/* LEWA STRONA: Nagłówek */}
    <Typography variant="h6" fontWeight={700}>
      Oferty ({unsoldQuotesLength})
    </Typography>

    {/* PRAWA STRONA: Liczba w kółku + tooltip */}
    <Tooltip 
      title={infoContent} 
      arrow 
      placement="bottom-end"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'white',
            color: 'black',
            boxShadow: 3,
            border: '1px solid #ccc',
          },
        },
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          cursor: "default",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "grey.200",
          },
        }}
      >
        <IconButton size="small" sx={{ p: 0 }}>
          <InfoIcon fontSize="small" color="action" />
        </IconButton>
      </Box>
    </Tooltip>
  </Box>
);


export default QuotesAndDraftsSection;