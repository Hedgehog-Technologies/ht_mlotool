import { Box, Group, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";

const RoomInfo: React.FC = () => {
  return (
    <>
      <Title order={4} pt={10}>Room Information</Title>
      <Box>
        <Group position="apart" grow>
          <MemoStringInput
            label="Name"
            value="test_room"
            disabled
            infoCircle="other information"
            ttOpenDelay={300}
          />
          <MemoStringInput
            label="Occlusion Name"
            value="DEADBEEF_test_room_asdfkljasd;lfkjas;dlfkj asdfas"
            disabled
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label="Room Index"
            value={1}
            infoCircle="index"
            disabled
          />
          <MemoNumberInput
            label="Number of Portals"
            value={4}
            infoCircle="portals"
            disabled
          />
        </Group>
      </Box>

      <Box pt={10}>
        <Title order={5}>Name Hash</Title>
        <Group position="apart" grow>
          <MemoNumberInput
            label="Unsigned"
            value={4243272858}
            infoCircle="stuff"
            disabled
          />
          <MemoNumberInput
            label="Signed"
            value={-51694438}
            infoCircle="signed sutff"
            disabled
          />
        </Group>
      </Box>

      <Box pt={10}>
        <Title order={5}>Room Key</Title>
        <Group position="apart" grow>
          <MemoNumberInput
            label="Unsigned"
            value={2676746621}
            infoCircle="sjiasdf"
            disabled
          />
          <MemoNumberInput
            label="Signed"
            value={-1618220675}
            infoCircle="askdjf"
            disabled
          />
        </Group>
      </Box>
    </>
  );
};

export default RoomInfo;
