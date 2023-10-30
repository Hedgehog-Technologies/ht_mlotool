import { Divider, Stack } from "@mantine/core";
import Dat151Info from "./components/Dat151Info";
import RoomInfo from "./components/RoomInfo";
import RoomSelect from "../shared/RoomSelect";

const Rooms: React.FC = () => {
  return (
    <Stack sx={{ width: '100%' }} justify='space-between'>
      <RoomSelect />
      <Divider size="sm" />
      <RoomInfo />
      <Divider size='sm' />
      <Dat151Info />
    </Stack>
  );
};

export default Rooms;
