import { Box, Group, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";
import { useRoomsStore } from "../../../../store/rooms";

const RoomInfo: React.FC = () => {
  const activeRoom = useRoomsStore((state) => state.activeRoom);

  return (
    <>
      <Title order={4} pt={20}>Room Information</Title>
      <Box>
        <Group position="apart" grow>
          <MemoStringInput
            label={"Name"}
            value={activeRoom?.name ?? ""}
            infoCircle={"Room name of the currently selected room"}
            ttOpenDelay={300}
            disabled
          />
          <MemoStringInput
            label={"Occlusion Name"}
            value={activeRoom?.occlRoomName ?? ""}
            infoCircle={"Room name used in the dat151.rel file"}
            ttOpenDelay={300}
            disabled
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label={"Room Index"}
            value={activeRoom?.index ?? -1}
            infoCircle={"Room index of the currently selected room"}
            disabled
          />
          <MemoNumberInput
            label={"Number of Portals"}
            value={activeRoom?.portalCount ?? -1}
            infoCircle={"Number of portals for the currently selected room"}
            disabled
          />
        </Group>
      </Box>

      <Box pt={10}>
        <Title order={5}>Name Hash</Title>
        <Group position="apart" grow>
          <MemoNumberInput
            label={"Unsigned"}
            value={activeRoom?.uintNameHash ?? -1}
            infoCircle={"Room name represented as an Unsigned Int32"}
            disabled
          />
          <MemoNumberInput
            label={"Signed"}
            value={activeRoom?.nameHash ?? -1}
            infoCircle={"Room name represented as a Signed Int32"}
            disabled
          />
        </Group>
      </Box>

      <Box pt={10}>
        <Title order={5}>Room Key</Title>
        <Group position="apart" grow>
          <MemoNumberInput
            label={"Unsigned"}
            value={activeRoom?.uintRoomKey ?? -1}
            infoCircle={"Room key calculated and represented as an Unsigned Int32"}
            disabled
          />
          <MemoNumberInput
            label={"Signed"}
            value={activeRoom?.roomKey ?? -1}
            infoCircle={"Room key calculated and represented as a Signed Int32"}
            disabled
          />
        </Group>
      </Box>
    </>
  );
};

export default RoomInfo;
