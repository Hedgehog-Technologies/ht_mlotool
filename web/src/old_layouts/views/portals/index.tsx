import { Divider, Stack } from "@mantine/core";
import RoomSelect from "../shared/RoomSelect";
import PortalsInfo from "./components/PortalsInfo";
import DebugToggles from "./components/DebugToggles";

const Portals: React.FC = () => {
  return (
    <Stack sx={{ width: '100%' }} justify='space-between'>
      <RoomSelect />
      <Divider size='sm' />
      <DebugToggles />
      <PortalsInfo />
    </Stack>
  )
};

export default Portals;
