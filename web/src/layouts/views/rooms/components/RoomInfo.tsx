import { Box, Group, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "@/layouts/shared";
import { useLocale } from "@/providers";
import { useRoomsStore } from "@/stores";

export const RoomInfo: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const activeRoom = useRoomsStore((state) => state.activeRoom);

  return (
    <>
      <Title order={4} pt={20}>{locale("ui_room_info")}</Title>
      <Box>
        <Group position="apart" grow>
          <MemoStringInput
            label={locale("ui_name")}
            value={activeRoom?.name ?? ""}
            infoCircle={locale("ui_name_info")}
            ttOpenDelay={300}
            disabled
          />
          <MemoStringInput
            label={locale("ui_occl_name")}
            value={activeRoom?.occlRoomName ?? ""}
            infoCircle={locale("ui_occl_name_info")}
            ttOpenDelay={300}
            disabled
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label={locale("ui_room_index")}
            value={activeRoom?.index ?? -1}
            infoCircle={locale("ui_room_index_info")}
            disabled
          />
          <MemoNumberInput
            label={locale("ui_number_portals")}
            value={activeRoom?.portalCount ?? -1}
            infoCircle={locale("ui_room_number_portals_info")}
            disabled
          />
        </Group>
      </Box>

      <Box pt={10}>
        <Title order={5}>{locale("ui_name_hash")}</Title>
        <Group position="apart" grow>
          <MemoNumberInput
            label={locale("ui_unsigned")}
            value={activeRoom?.uintNameHash ?? -1}
            infoCircle={locale("ui_room_name_hash_info_unsigned")}
            disabled
          />
          <MemoNumberInput
            label={locale("ui_signed")}
            value={activeRoom?.nameHash ?? -1}
            infoCircle={locale("ui_room_name_hash_info_signed")}
            disabled
          />
        </Group>
      </Box>

      <Box pt={10}>
        <Title order={5}>{locale("ui_room_key")}</Title>
        <Group position="apart" grow>
          <MemoNumberInput
            label={locale("ui_unsigned")}
            value={activeRoom?.uintRoomKey ?? -1}
            infoCircle={locale("ui_room_key_info_unsigned")}
            disabled
          />
          <MemoNumberInput
            label={locale("ui_signed")}
            value={activeRoom?.roomKey ?? -1}
            infoCircle={locale("ui_room_key_info_signed")}
            disabled
          />
        </Group>
      </Box>
    </>
  );
};
