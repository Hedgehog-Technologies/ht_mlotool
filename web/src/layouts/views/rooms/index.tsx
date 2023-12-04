import { Box } from "@mantine/core";
import RoomSelect from "../../shared/RoomSelect";
import RoomInfo from "./components/RoomInfo";
import RoomSettings from "./components/RoomSettings";

const Rooms: React.FC = () => {
  return (
    <Box>
      <RoomSelect />
      <RoomInfo />
      <RoomSettings />
    </Box>
  )
};

export default Rooms;
