import { Box, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";
import { useLocale } from "../../../../providers/LocaleProvider";
import { useRoomsStore } from "../../../../store/rooms";
import { Dat151Fields } from "../../../../types/RoomDef";

const defaultDat151Fields: Dat151Fields = {
  flags: "0xAAAAAAAA",      // Flags
  zone: "",                 // AmbientZone
  unk02: 0,                 // InteriorType
  unk03: 0.35,              // ReverbSmall
  reverb: 0,                // ReverbMedium
  echo: 0,                  // ReverbLarge
  sound: "null_sound",      // RoomToneSound
  unk07: 0,                 // RainType
  unk08: 0,                 // ExteriorAudibility
  unk09: 0,                 // RoomOcclusionDamping
  unk10: 0.7,               // NonMarkedPortalOcclusion
  unk11: 0,                 // DistanceFromPortalForOcclusion
  unk12: 50,                // DistanceFromPortalFadeDistance
  unk13: "",                // WeaponMetrics
  soundSet: "hash_D4855127" // InteriorWallaSoundSet
};

const RoomSettings: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const activeRoom = useRoomsStore((state) => state.activeRoom);
  const [fieldState, setFieldState] = useState<Dat151Fields>(defaultDat151Fields);
  const [disabled, setDisabled] = useState<boolean>(true);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (activeRoom === null) return;

    timer = setTimeout(() => {
      activeRoom.SetDat151Fields(fieldState);
    }, 500);

    return () => clearTimeout(timer);
  }, [fieldState]);

  useEffect(() => {
    if (activeRoom === null) {
      setFieldState(defaultDat151Fields);
    } else {
      setFieldState({
        flags: activeRoom.flags,
        zone: activeRoom.zone,
        unk02: activeRoom.unk02,
        unk03: activeRoom.unk03,
        reverb: activeRoom.reverb,
        echo: activeRoom.echo,
        sound: activeRoom.sound,
        unk07: activeRoom.unk07,
        unk08: activeRoom.unk08,
        unk09: activeRoom.unk09,
        unk10: activeRoom.unk10,
        unk11: activeRoom.unk11,
        unk12: activeRoom.unk12,
        unk13: activeRoom.unk13,
        soundSet: activeRoom.soundSet
      });
    }

    setDisabled(activeRoom === null || activeRoom.index === 0);
  }, [activeRoom]);

  return (
    <Box pt={25}>
      <Title order={5}>{locale("ui_room_dat_settings")}</Title>
      <Group position="apart" grow>
        <MemoStringInput
          label={locale("ui_room_dat_flags")}
          value={fieldState.flags}
          setValue={(value) => setFieldState({ ...fieldState, flags: value })}
          infoCircle={locale("ui_room_dat_flags_info")}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_zone")}
          placeholder={locale("ui_blank")}
          value={fieldState.zone}
          setValue={(value) => setFieldState({ ...fieldState, zone: value })}
          infoCircle={locale("ui_room_dat_zone_info")}
          icWidth={125}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk02")}
          value={fieldState.unk02}
          setValue={(value) => setFieldState({ ...fieldState, unk02: (value ?? defaultDat151Fields.unk02) })}
          min={0}
          max={255}
          infoCircle={locale("ui_room_dat_unk02_info")}
          icWidth={100}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk03")}
          value={fieldState.unk03}
          setValue={(value) => setFieldState({ ...fieldState, unk03: (value ?? defaultDat151Fields.unk03) })}
          precision={6}
          min={0.0}
          max={1.0}
          infoCircle={locale("ui_room_dat_unk03_info")}
          icWidth={125}
          disabled={disabled}
        />
      </Group>

      <Group position="apart" grow>
        <MemoNumberInput
          label={locale("ui_room_dat_reverb")}
          value={fieldState.reverb}
          setValue={(value) => setFieldState({ ...fieldState, reverb: (value ?? defaultDat151Fields.reverb) })}
          precision={6}
          min={0.0}
          max={1.0}
          infoCircle={locale("ui_room_dat_reverb_info")}
          icWidth={150}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_echo")}
          value={fieldState.echo}
          setValue={(value) => setFieldState({ ...fieldState, echo: (value ?? defaultDat151Fields.echo) })}
          precision={6}
          min={0.0}
          max={1.0}
          infoCircle={locale("ui_room_dat_echo_info")}
          icWidth={150}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_sound")}
          value={fieldState.sound}
          setValue={(value) => setFieldState({ ...fieldState, sound: value })}
          infoCircle={locale("ui_room_dat_sound_info")}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk07")}
          value={fieldState.unk07}
          setValue={(value) => setFieldState({ ...fieldState, unk07: (value ?? defaultDat151Fields.unk07) })}
          min={0}
          max={255}
          infoCircle={locale("ui_room_dat_unk07_info")}
          icWidth={100}
          disabled={disabled}
        />
      </Group>

      <Group position="apart" grow>
        <MemoNumberInput
          label={locale("ui_room_dat_unk08")}
          value={fieldState.unk08}
          setValue={(value) => setFieldState({ ...fieldState, unk08: (value ?? defaultDat151Fields.unk08) })}
          infoCircle={locale("ui_room_dat_unk08_info")}
          icWidth={100}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk09")}
          value={fieldState.unk09}
          setValue={(value) => setFieldState({ ...fieldState, unk09: (value ?? defaultDat151Fields.unk09) })}
          infoCircle={locale("ui_room_dat_unk09_info")}
          icWidth={100}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk10")}
          value={fieldState.unk10}
          setValue={(value) => setFieldState({ ...fieldState, unk10: (value ?? defaultDat151Fields.unk10) })}
          precision={6}
          infoCircle={locale("ui_room_dat_unk10_info")}
          icWidth={125}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk11")}
          value={fieldState.unk11}
          setValue={(value) => setFieldState({ ...fieldState, unk11: (value ?? defaultDat151Fields.unk11) })}
          infoCircle={locale("ui_room_dat_unk11_info")}
          icWidth={100}
          disabled={disabled}
        />
      </Group>

      <Group position="center" grow>
        <MemoNumberInput
          label={locale("ui_room_dat_unk12")}
          value={fieldState.unk12}
          setValue={(value) => setFieldState({ ...fieldState, unk12: (value ?? defaultDat151Fields.unk12) })}
          infoCircle={locale("ui_room_dat_unk12_info")}
          icWidth={125}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_unk13")}
          placeholder={locale("ui_blank")}
          value={fieldState.unk13}
          setValue={(value) => setFieldState({ ...fieldState, unk13: value })}
          infoCircle={locale("ui_room_dat_unk13_info")}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_soundset")}
          value={fieldState.soundSet}
          setValue={(value) => setFieldState({ ...fieldState, soundSet: value })}
          infoCircle={locale("ui_room_dat_soundset_info")}
          disabled={disabled}
        />
      </Group>
    </Box>
  );
};

export default RoomSettings;
