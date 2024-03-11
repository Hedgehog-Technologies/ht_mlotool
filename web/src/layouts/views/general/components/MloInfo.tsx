import { Box, Group, Stack, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "@/layouts/shared";
import { useLocale } from "@/providers";
import { useGeneralStore } from "@/stores";

export const MloInfo: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const mlo = useGeneralStore((state) => state.mlo);

  return (
    <Box p={5}>
      <Title order={5}>{locale("ui_name_hash")}</Title>
      <Group grow>
        <MemoNumberInput 
          label={locale("ui_unsigned")}
          value={mlo?.uintNameHash ?? 0}
          infoCircle={locale("ui_name_hash_info_unsigned")}
          disabled
        />
        <MemoNumberInput
          label={locale("ui_signed")}
          value={mlo?.nameHash ?? 0}
          infoCircle={locale("ui_name_hash_info_signed")}
          disabled
        />
      </Group>

      <Title order={5} pt={20}>{locale("ui_proxy_hash")}</Title>
      <Group grow>
        <MemoNumberInput
          label={locale("ui_unsigned")}
          value={mlo?.uintProxyHash ?? 0}
          infoCircle={locale("ui_proxy_hash_info_signed")}
          disabled
        />
        <MemoNumberInput
          label={locale("ui_signed")}
          value={mlo?.proxyHash ?? 0}
          infoCircle={locale("ui_proxy_hash_info_unsigned")}
          disabled
        />
      </Group>

      <Title order={5} pt={20}>{locale("ui_interior_info")}</Title>
      <Stack>
        <Group grow>
          <MemoNumberInput
            label={locale("ui_interior_info_id")}
            value={mlo?.interiorId ?? -1}
            infoCircle={locale("ui_interior_info_id_info")}
            disabled
          />
          <MemoStringInput
            label={locale("ui_interior_info_world_coords")}
            value={mlo?.locationString ? mlo.locationString : "0.0, 0.0, 0.0"}
            infoCircle={locale("ui_interior_info_world_coords_info")}
            disabled
          />
        </Group>
        <Group grow>
          <MemoNumberInput
            label={locale("ui_number_rooms")}
            value={mlo?.rooms.length ?? 0}
            infoCircle={locale("ui_interior_info_number_rooms_info")}
            disabled
          />
          <MemoNumberInput
            label={locale("ui_number_portals")}
            value={mlo?.portals.length ?? 0}
            infoCircle={locale("ui_interior_info_number_portals_info")}
            disabled
          />
        </Group>
      </Stack>
    </Box>
  );
};
