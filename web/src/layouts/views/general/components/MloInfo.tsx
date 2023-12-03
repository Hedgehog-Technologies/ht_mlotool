import { Box, Group, Stack, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";

const MloInfo: React.FC = () => {
  return (
    <Box p={5}>
      <Title order={5}>Name Hash</Title>
      <Group grow>
        <MemoNumberInput 
          label="Unsigned"
          value={1667328242}
          infoCircle="Some stuff"
          disabled
        />
        <MemoNumberInput
          label="Signed"
          value={-16660101}
          infoCircle="Some Signed Stuff"
        />
      </Group>

      <Title order={5} pt={20}>Proxy Hash</Title>
      <Group grow>
        <MemoNumberInput
          label="Unsigned"
          value={1337}
          infoCircle="stuff"
        />
        <MemoNumberInput
          label="Signed"
          value={7331}
          infoCircle={'ffuts'}
        />
      </Group>

      <Title order={5} pt={20}>Interior Info</Title>
      <Stack>
        <Group grow>
          <MemoNumberInput
            label="Interior Id"
            value={7170}
            infoCircle="interior id"
          />
          <MemoStringInput
            label="Interior World Coords"
            value={"-41.4020, -1097.7750, 25.4230"}
            infoCircle="coords"
          />
        </Group>
        <Group grow>
          <MemoNumberInput
            label="Number of Rooms"
            value={5}
            infoCircle="room count"
          />
          <MemoNumberInput
            label="Number of Portals"
            value={14}
            infoCircle="portal count"
          />
        </Group>
      </Stack>
    </Box>
  );
};

export default MloInfo;
