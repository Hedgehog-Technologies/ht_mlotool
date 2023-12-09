import { Box, ScrollArea, Title } from "@mantine/core";
import { MemoRoomSelect } from "../../shared/RoomSelect";
import { MemoStringInput } from "../../shared/Inputs";

const Portals: React.FC = () => {
  return (
    <Box>
      <MemoRoomSelect />
      <Title order={4} pt={10}>Portal Information</Title>

      {/* <ScrollArea style={{ height: 665 }} px={5}>
        
      </ScrollArea> */}
    </Box>
  );
};

export default Portals;
