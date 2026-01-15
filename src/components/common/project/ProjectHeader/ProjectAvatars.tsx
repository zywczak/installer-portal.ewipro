import { Box } from "@mui/material";
import UserAvatar from "../../UserAvatar";

interface Member {
  id: number;
  name: string;
  avatar?: string | null;
  userID?: number;
}

interface Props {
  ownerId?: number;
  ownerAvatar?: string;
  ownerName?: string;
  members: Member[];
}

const ProjectAvatars: React.FC<Props> = ({ ownerId, ownerAvatar, ownerName, members }) => {
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
      {ownerId && (
        <UserAvatar
          avatarUrl={ownerAvatar}
          size={48}
          tooltip={ownerName}
          onClick={() => {
            globalThis.location.hash = `subcontractors/${ownerId}`;
          }}
        />
      )}

    {members.map((m, index) => (
        <UserAvatar
          key={m.id}
          avatarUrl={m.avatar || undefined}
          size={40}
          tooltip={m.name}
          onClick={() => {
            globalThis.location.hash = `subcontractors/${m.userID || m.id}`;
          }}
          sx={{
            marginLeft: index === 0 && !ownerId ? 0 : -2,
            border: "2px solid white",
          }}
        />
      ))}


    </Box>
  );
};

export default ProjectAvatars;
