import { Alert, Stack, Text } from "@mantine/core";
import { useRoomsStore } from "../../../../store/rooms";
import RoomPortals from "./RoomPortals";

const PortalsInfo: React.FC = () => {
  const activeRoom = useRoomsStore((state) => state.activeRoom);

  return (
    <>
      <Text fw={500} size='md'>Portal Info</Text>
      <Stack p={5} sx={{ width: '100%', overflow:'auto', maxHeight: 390 }}>
        {activeRoom?.portalCount
          && <RoomPortals roomIndex={activeRoom.index}/>
          || <Alert>No Portals Found!</Alert>}
      </Stack>
    </>
  );
};

export default PortalsInfo;
