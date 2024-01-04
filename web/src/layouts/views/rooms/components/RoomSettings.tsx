import { Box, Group, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";
import { Dat151Fields } from "../../../../types/RoomDef";
import { useRoomsStore } from "../../../../store/rooms";

const defaultDat151Fields: Dat151Fields = {
  flags: '0xAAAAAAAA',
  zone: '',
  unk02: 0,
  unk03: 0.35,
  reverb: 0,
  echo: 0,
  sound: 'null_sound',
  unk07: 0,
  unk08: 0,
  unk09: 0,
  unk10: 0.7,
  unk11: 0,
  unk12: 50,
  unk13: '',
  soundSet: 'hash_D4855127'
};

const RoomSettings: React.FC = () => {
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
    <>
      <Box pt={25}>
        <Title order={5}>Settings</Title>
        <Group position="apart" grow>
          <MemoStringInput
            label={"Flags"}
            value={fieldState.flags}
            setValue={(value) => setFieldState({ ...fieldState, flags: value })}
            disabled={disabled}
          />
          <MemoStringInput
            label={"Zone"}
            placeholder={"<Blank>"}
            value={fieldState.zone}
            setValue={(value) => setFieldState({ ...fieldState, zone: value })}
            ttDisable={fieldState.zone === ""}
            infoCircle={"Usually left blank"}
            icWidth={125}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Unk02"}
            value={fieldState.unk02}
            setValue={(value) => setFieldState({ ...fieldState, unk02: (value ?? defaultDat151Fields.unk02) })}
            infoCircle={"Usually left as 0"}
            icWidth={100}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Unk03"}
            value={fieldState.unk03}
            setValue={(value) => setFieldState({ ...fieldState, unk03: (value ?? defaultDat151Fields.unk03) })}
            precision={6}
            infoCircle={"Usually left as 0.35"}
            icWidth={125}
            disabled={disabled}
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label={"Reverb"}
            value={fieldState.reverb}
            setValue={(value) => setFieldState({ ...fieldState, reverb: (value ?? defaultDat151Fields.reverb) })}
            precision={6}
            min={0.0}
            max={1.0}
            infoCircle={"Set level of reverb for the currently selected room. Range: 0.0 - 1.0"}
            icWidth={150}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Echo"}
            value={fieldState.echo}
            setValue={(value) => setFieldState({ ...fieldState, echo: (value ?? defaultDat151Fields.echo) })}
            precision={6}
            min={0.0}
            max={1.0}
            infoCircle={"Set level of echo for the currently selected room. Range: 0.0 - 1.0"}
            icWidth={150}
            disabled={disabled}
          />
          <MemoStringInput
            label={"Sound"}
            value={fieldState.sound}
            setValue={(value) => setFieldState({ ...fieldState, sound: value })}
            infoCircle={"Room sounds. Usually left as null_sound"}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Unk07"}
            value={fieldState.unk07}
            setValue={(value) => setFieldState({ ...fieldState, unk07: (value ?? defaultDat151Fields.unk07) })}
            infoCircle={"Usually left as 0"}
            icWidth={100}
            disabled={disabled}
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label={"Unk08"}
            value={fieldState.unk08}
            setValue={(value) => setFieldState({ ...fieldState, unk08: (value ?? defaultDat151Fields.unk08) })}
            infoCircle={"Usually left as 0"}
            icWidth={100}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Unk09"}
            value={fieldState.unk09}
            setValue={(value) => setFieldState({ ...fieldState, unk09: (value ?? defaultDat151Fields.unk09) })}
            infoCircle={"Usually left as 0"}
            icWidth={100}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Unk10"}
            value={fieldState.unk10}
            setValue={(value) => setFieldState({ ...fieldState, unk10: (value ?? defaultDat151Fields.unk10) })}
            precision={6}
            infoCircle={"Usually left as 0.7"}
            icWidth={125}
            disabled={disabled}
          />
          <MemoNumberInput
            label={"Unk11"}
            value={fieldState.unk11}
            setValue={(value) => setFieldState({ ...fieldState, unk11: (value ?? defaultDat151Fields.unk11) })}
            infoCircle={"Usually left as 0"}
            icWidth={100}
            disabled={disabled}
          />
        </Group>

        <Group position="center" grow>
          <MemoNumberInput
            label={"Unk12"}
            value={fieldState.unk12}
            setValue={(value) => setFieldState({ ...fieldState, unk12: (value ?? defaultDat151Fields.unk12) })}
            infoCircle={"Usually left as 50"}
            icWidth={125}
            disabled={disabled}
          />
          <MemoStringInput
            label={"Unk13"}
            placeholder="<Blank>"
            value={fieldState.unk13}
            setValue={(value) => setFieldState({ ...fieldState, unk13: value })}
            infoCircle={"Maybe a static emitter hash. Usually left blank"}
            disabled={disabled}
          />
          <MemoStringInput
            label="SoundSet"
            value={fieldState.soundSet}
            setValue={(value) => setFieldState({ ...fieldState, soundSet: value })}
            infoCircle={"Usually left as hash_D4855127"}
            disabled={disabled}
          />
        </Group>
      </Box>
    </>
  );
};

export default RoomSettings;
