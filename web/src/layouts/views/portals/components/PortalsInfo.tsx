import { Alert, Stack } from "@mantine/core";
import { useRoomsStore } from "../../../../store/rooms";
import RoomPortals from "./RoomPortals";

const PortalsInfo: React.FC = () => {
  const activeRoom = useRoomsStore((state) => state.activeRoom);

  return (
    <Stack p={5} sx={{ width: '100%', overflow:'auto', maxHeight: 485 }}>
      {activeRoom?.portalCount
        && <RoomPortals roomIndex={activeRoom.index}/>
        || <Alert>No Portals Found!</Alert>}
    </Stack>
  );
};

export default PortalsInfo;
