import { Box, Typography, Button } from "@mui/material"; 

export default function ProjectRowDetails({ row }: { row: any }) {

  const handleShowProject = () => {
    window.location.hash = `projects/${row.id}/${row.contactID}`;
  };
    
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Typography variant="h6" sx={{ color: "black" }}>
          <Box component="span" sx={{ fontWeight: 700 }}>{row.projectCode}</Box> <Box component="span" sx={{ fontSize: '0.8em' }}>Details</Box>
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleShowProject}
          sx={{ 
            bgcolor: '#e0e0e0',
            color: '#424242',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            padding: '4px 12px',
            '&:hover': {
              bgcolor: '#bdbdbd',
            }
          }}
        >
          Pokaż Projekt
        </Button>
      </Box>

      <Typography sx={{ color: 'black', mt: 1 }}>- Example content inside expanded row</Typography>
      <Typography sx={{ color: 'black' }}>- You can put ANYTHING here</Typography>
    </Box>
  );
}