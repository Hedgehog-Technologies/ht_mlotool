import { Divider, Stack } from "@mantine/core";
import RoomSelect from "../shared/RoomSelect";
import PortalsInfo from "./components/PortalsInfo";

const Portals: React.FC = () => {
  return (
    <Stack sx={{ width: '100%' }} justify='space-between'>
      <RoomSelect />
      <Divider size='sm' />
      <PortalsInfo />
    </Stack>
  )
};

export default Portals;
