import { Box } from "@mantine/core";
import RoomInfo from "./components/RoomInfo";
import RoomSettings from "./components/RoomSettings";
import { MemoRoomSelect } from "../../shared/RoomSelect";

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
