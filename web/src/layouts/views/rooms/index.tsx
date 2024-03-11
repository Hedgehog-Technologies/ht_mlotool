import { Box } from "@mantine/core";
import { RoomInfo, RoomSettings } from "./components";
import { MemoRoomSelect } from "@/layouts/shared";

export const Rooms: React.FC = () => {
  return (
    <Box>
      <MemoRoomSelect />
      <RoomInfo />
      <RoomSettings />
    </Box>
  )
};
