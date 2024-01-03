import { Box, Group, ScrollArea, Space, Title } from "@mantine/core";
import { MemoRoomSelect } from "../../shared/RoomSelect";
import DebugMenu from "./components/DebugMenu";
import PortalInfo from "./components/PortalInfo";

const Portals: React.FC = () => {
  return (
    <Box>
      <MemoRoomSelect />
      <Group position="apart" pt={20}>
        <Title order={4}>Portal Information</Title>
        <DebugMenu />
      </Group>

      <ScrollArea style={{ height: 650 }} pt={5}>
        <PortalInfo />
        <Space h={10} />
      </ScrollArea>
    </Box>
  );
};

export default Portals;
