import { Box, Group, Stack, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "@/layouts/shared/Inputs";
import { useLocale } from "@/providers/LocaleProvider";
import { useGeneralStore } from "@/store/general";

const MloInfo: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const interior = useGeneralStore((state) => state.interior);

  return (
    <Box p={5}>
      <Title order={5}>{locale("ui_name_hash")}</Title>
      <Group grow>
        <MemoNumberInput 
          label={locale("ui_unsigned")}
          value={interior?.uintNameHash ?? 0}
          infoCircle={locale("ui_name_hash_info_unsigned")}
          disabled
        />
        <MemoNumberInput
          label={locale("ui_signed")}
          value={interior?.nameHash ?? 0}
          infoCircle={locale("ui_name_hash_info_signed")}
          disabled
        />
      </Group>

      <Title order={5} pt={20}>{locale("ui_proxy_hash")}</Title>
      <Group grow>
        <MemoNumberInput
          label={locale("ui_unsigned")}
          value={interior?.uintProxyHash ?? 0}
          infoCircle={locale("ui_proxy_hash_info_signed")}
          disabled
        />
        <MemoNumberInput
          label={locale("ui_signed")}
          value={interior?.proxyHash ?? 0}
          infoCircle={locale("ui_proxy_hash_info_unsigned")}
          disabled
        />
      </Group>

      <Title order={5} pt={20}>{locale("ui_interior_info")}</Title>
      <Stack>
        <Group grow>
          <MemoNumberInput
            label={locale("ui_interior_info_id")}
            value={interior?.interiorId ?? -1}
            infoCircle={locale("ui_interior_info_id_info")}
            disabled
          />
          <MemoStringInput
            label={locale("ui_interior_info_world_coords")}
            value={
              interior?.location
                ? `${interior.location.x.toFixed(6)}, ${interior.location.y.toFixed(6)}, ${interior.location.z.toFixed(6)}`
                : "0.0, 0.0, 0.0"
            }
            infoCircle={locale("ui_interior_info_world_coords_info")}
            disabled
          />
        </Group>
        <Group grow>
          <MemoNumberInput
            label={locale("ui_number_rooms")}
            value={interior?.rooms.length ?? 0}
            infoCircle={locale("ui_interior_info_number_rooms_info")}
            disabled
          />
          <MemoNumberInput
            label={locale("ui_number_portals")}
            value={interior?.portals.length ?? 0}
            infoCircle={locale("ui_interior_info_number_portals_info")}
            disabled
          />
        </Group>
      </Stack>
    </Box>
  );
};

export default MloInfo;
