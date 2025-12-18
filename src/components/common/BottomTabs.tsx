import React from "react";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";

export interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomTabsProps {
  value: string;
  tabs: TabItem[];
  onChange: (value: string) => void;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ value, tabs, onChange }) => {
  return (
    <Box sx={{ borderTop: "1px solid #ddd", backgroundColor: "background.paper" }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, v) => onChange(v)}
      >
        {tabs.map((t) => (
          <BottomNavigationAction
            key={t.key}
            value={t.key}
            label={t.label}
            icon={t.icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default BottomTabs;
