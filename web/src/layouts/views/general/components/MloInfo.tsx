import { Box, Group, Stack, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";
import { useGeneralStore } from "../../../../store/general";

const MloInfo: React.FC = () => {
  const mlo = useGeneralStore((state) => state.mlo);

  return (
    <Box p={5}>
      <Title order={5}>Name Hash</Title>
      <Group grow>
        <MemoNumberInput 
          label={"Unsigned"}
          value={mlo?.uintNameHash ?? 0}
          infoCircle={"MLO Archetype Name represented as an Unsigned Int32"}
          disabled
        />
        <MemoNumberInput
          label={"Signed"}
          value={mlo?.nameHash ?? 0}
          infoCircle={"MLO Archetype Name represented as a Signed Int32"}
          disabled
        />
      </Group>

      <Title order={5} pt={20}>Proxy Hash</Title>
      <Group grow>
        <MemoNumberInput
          label={"Unsigned"}
          value={mlo?.uintProxyHash ?? 0}
          infoCircle={"Proxy Hash represented as an Unsigned Int32"}
          disabled
        />
        <MemoNumberInput
          label={"Signed"}
          value={mlo?.proxyHash ?? 0}
          infoCircle={"Proxy Hash represented as a Signed Int32"}
          disabled
        />
      </Group>

      <Title order={5} pt={20}>Interior Info</Title>
      <Stack>
        <Group grow>
          <MemoNumberInput
            label={"Interior Id"}
            value={mlo?.interiorId ?? -1}
            infoCircle={"Interior Id for the current MLO"}
            disabled
          />
          <MemoStringInput
            label={"Interior World Coords"}
            value={mlo?.locationString ? mlo.locationString : "0.0, 0.0, 0.0"}
            infoCircle={"Location of the current MLO in the world"}
            disabled
          />
        </Group>
        <Group grow>
          <MemoNumberInput
            label={"Number of Rooms"}
            value={mlo?.rooms.length ?? 0}
            infoCircle={"Number of rooms in the current MLO, including Limbo"}
            disabled
          />
          <MemoNumberInput
            label="Number of Portals"
            value={mlo?.portals.length ?? 0}
            infoCircle={"Number of portals in the current MLO"}
            disabled
          />
        </Group>
      </Stack>
    </Box>
  );
};

export default MloInfo;
