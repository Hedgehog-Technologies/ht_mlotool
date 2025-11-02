import { Box, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { MemoNumberInput, MemoStringInput } from "@/layouts/shared/Inputs";
import { useLocale } from "@/providers/LocaleProvider";
import { useRoomsStore } from "@/store/rooms";
import { RoomDat151Fields } from "@/types";

const defaultDat151Fields: RoomDat151Fields = {
  occlRoomName: "",                      // OcclRoomName
  flags: "0xAAAAAAAA",                   // Flags
  ambientZone: "",                       // zone
  interiorType: 0,                       // unk02
  reverbSmall: 0.35,                     // unk03
  reverbMedium: 0,                       // reverb
  reverbLarge: 0,                        // echo
  roomToneSound: "null_sound",           // sound
  rainType: 0,                           // unk07
  exteriorAudibility: 0,                 // unk08
  roomOcclusionDamping: 0,               // unk09
  nonMarkedPortalOcclusion: 0.7,         // unk10
  distanceFromPortalForOcclusion: 0,     // unk11
  distanceFromPortalFadeDistance: 50,    // unk12
  weaponMetrics: "",                     // unk13
  interiorWallaSoundSet: "hash_D4855127" // soundSet
};

const RoomSettings: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const activeRoom = useRoomsStore((state) => state.activeRoom);
  const setDat151Fields = useRoomsStore((state) => state.setDat151Fields);
  const [fieldState, setFieldState] = useState<RoomDat151Fields>(defaultDat151Fields);
  const [disabled, setDisabled] = useState<boolean>(true);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (activeRoom === null) return;

    timer = setTimeout(() => {
      setDat151Fields(fieldState);
    }, 500);

    return () => clearTimeout(timer);
  }, [fieldState]);

  useEffect(() => {
    if (activeRoom === null) {
      setFieldState(defaultDat151Fields);
    } else {
      setFieldState({
        occlRoomName: activeRoom.dat151.occlRoomName,
        flags: activeRoom.dat151.flags,
        ambientZone: activeRoom.dat151.ambientZone,
        interiorType: activeRoom.dat151.interiorType,
        reverbSmall: activeRoom.dat151.reverbSmall,
        reverbMedium: activeRoom.dat151.reverbMedium,
        reverbLarge: activeRoom.dat151.reverbLarge,
        roomToneSound: activeRoom.dat151.roomToneSound,
        rainType: activeRoom.dat151.rainType,
        exteriorAudibility: activeRoom.dat151.exteriorAudibility,
        roomOcclusionDamping: activeRoom.dat151.roomOcclusionDamping,
        nonMarkedPortalOcclusion: activeRoom.dat151.nonMarkedPortalOcclusion,
        distanceFromPortalForOcclusion: activeRoom.dat151.distanceFromPortalForOcclusion,
        distanceFromPortalFadeDistance: activeRoom.dat151.distanceFromPortalFadeDistance,
        weaponMetrics: activeRoom.dat151.weaponMetrics,
        interiorWallaSoundSet: activeRoom.dat151.interiorWallaSoundSet
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
          value={fieldState.ambientZone}
          setValue={(value) => setFieldState({ ...fieldState, ambientZone: value })}
          infoCircle={locale("ui_room_dat_zone_info")}
          icWidth={125}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk02")}
          value={fieldState.interiorType}
          setValue={(value) => setFieldState({ ...fieldState, interiorType: (value ?? defaultDat151Fields.interiorType) })}
          min={0}
          max={255}
          infoCircle={locale("ui_room_dat_unk02_info")}
          icWidth={100}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk03")}
          value={fieldState.reverbSmall}
          setValue={(value) => setFieldState({ ...fieldState, reverbSmall: (value ?? defaultDat151Fields.reverbSmall) })}
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
          value={fieldState.reverbMedium}
          setValue={(value) => setFieldState({ ...fieldState, reverbMedium: (value ?? defaultDat151Fields.reverbMedium) })}
          precision={6}
          min={0.0}
          max={1.0}
          infoCircle={locale("ui_room_dat_reverb_info")}
          icWidth={150}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_echo")}
          value={fieldState.reverbLarge}
          setValue={(value) => setFieldState({ ...fieldState, reverbLarge: (value ?? defaultDat151Fields.reverbLarge) })}
          precision={6}
          min={0.0}
          max={1.0}
          infoCircle={locale("ui_room_dat_echo_info")}
          icWidth={150}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_sound")}
          value={fieldState.roomToneSound}
          setValue={(value) => setFieldState({ ...fieldState, roomToneSound: value })}
          infoCircle={locale("ui_room_dat_sound_info")}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk07")}
          value={fieldState.rainType}
          setValue={(value) => setFieldState({ ...fieldState, rainType: (value ?? defaultDat151Fields.rainType) })}
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
          value={fieldState.exteriorAudibility}
          setValue={(value) => setFieldState({ ...fieldState, exteriorAudibility: (value ?? defaultDat151Fields.exteriorAudibility) })}
          infoCircle={locale("ui_room_dat_unk08_info")}
          icWidth={100}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk09")}
          value={fieldState.roomOcclusionDamping}
          setValue={(value) => setFieldState({ ...fieldState, roomOcclusionDamping: (value ?? defaultDat151Fields.roomOcclusionDamping) })}
          infoCircle={locale("ui_room_dat_unk09_info")}
          icWidth={100}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk10")}
          value={fieldState.nonMarkedPortalOcclusion}
          setValue={(value) => setFieldState({ ...fieldState, nonMarkedPortalOcclusion: (value ?? defaultDat151Fields.nonMarkedPortalOcclusion) })}
          precision={6}
          infoCircle={locale("ui_room_dat_unk10_info")}
          icWidth={125}
          disabled={disabled}
        />
        <MemoNumberInput
          label={locale("ui_room_dat_unk11")}
          value={fieldState.distanceFromPortalForOcclusion}
          setValue={(value) => setFieldState({ ...fieldState, distanceFromPortalForOcclusion: (value ?? defaultDat151Fields.distanceFromPortalForOcclusion) })}
          infoCircle={locale("ui_room_dat_unk11_info")}
          icWidth={100}
          disabled={disabled}
        />
      </Group>

      <Group position="center" grow>
        <MemoNumberInput
          label={locale("ui_room_dat_unk12")}
          value={fieldState.distanceFromPortalFadeDistance}
          setValue={(value) => setFieldState({ ...fieldState, distanceFromPortalFadeDistance: (value ?? defaultDat151Fields.distanceFromPortalFadeDistance) })}
          infoCircle={locale("ui_room_dat_unk12_info")}
          icWidth={125}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_unk13")}
          placeholder={locale("ui_blank")}
          value={fieldState.weaponMetrics}
          setValue={(value) => setFieldState({ ...fieldState, weaponMetrics: value })}
          infoCircle={locale("ui_room_dat_unk13_info")}
          disabled={disabled}
        />
        <MemoStringInput
          label={locale("ui_room_dat_soundset")}
          value={fieldState.interiorWallaSoundSet}
          setValue={(value) => setFieldState({ ...fieldState, interiorWallaSoundSet: value })}
          infoCircle={locale("ui_room_dat_soundset_info")}
          disabled={disabled}
        />
      </Group>
    </Box>
  );
};

export default RoomSettings;
