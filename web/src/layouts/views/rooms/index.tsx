import { Box } from "@mantine/core";
import { MemoRoomSelect } from "../../shared/RoomSelect";
import RoomInfo from "./components/RoomInfo";
import RoomSettings from "./components/RoomSettings";

const Rooms: React.FC = () => {
  return (
    <Box>
      <MemoRoomSelect />
      <RoomInfo />
      <RoomSettings />
    </Box>
  )
};

export default Rooms;
