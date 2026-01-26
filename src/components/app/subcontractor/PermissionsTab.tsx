import React from "react";
import {
  Box,
  List,
  ListItem,
  Divider,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { SubcontractorPermission } from "./types";
import { useTranslation } from "react-i18next";
import MainCard from "../../common/MainCard";

interface PermissionsTabProps {
  permissions: SubcontractorPermission[];
  onToggle: (key: string, enabled: boolean) => void;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ permissions, onToggle }) => {
const { t } = useTranslation();
  return (
    <MainCard
    >
      <List disablePadding sx={{ width: '100%', maxWidth: '800px', m: 'auto' }}>
        {permissions.map((p, index) => (
          <React.Fragment key={p.key}>
            <ListItem
              sx={{ py: 2 }}
              secondaryAction={
                <Switch
                  checked={p.enabled}
                  onChange={(e) => onToggle(p.key, e.target.checked)}
                  color="success"
                />
              }
            >
              <FormControlLabel
                control={<Box />}
                label={
                  <Box>
                    <Typography fontWeight="bold">{t(p.labelKey)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(p.descriptionKey)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < permissions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </MainCard>
  );
};

export default PermissionsTab;