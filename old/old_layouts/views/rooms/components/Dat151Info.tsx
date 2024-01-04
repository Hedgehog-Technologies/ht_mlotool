import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRoomsStore } from "../../../../store/rooms";
import { Dat151Fields } from "../../../../types/RoomDef";
import { MemoInput } from "../../shared/Input";

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
}

const Dat151Info: React.FC = () => {
  const [fieldState, setFieldState] = useState<Dat151Fields>(defaultDat151Fields);
  const activeRoom = useRoomsStore((state) => state.activeRoom);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (activeRoom === null) return;

    timer = setTimeout(() => {
      activeRoom.SetDat151Fields(fieldState);
    }, 500);

    return () => clearTimeout(timer);
  }, [fieldState])

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
  }, [activeRoom]);

  return (
    <Grid columns={4} gutter='xs' justify='center' sx={{fontSize: 12, overflow: 'auto', maxHeight: 450 }}>
      <MemoInput
        label='Flags'
        inputType='text'
        value={fieldState.flags}
        setValue={(value) => setFieldState({ ...fieldState, flags: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information'
      />
      <MemoInput
        label='Zone'
        inputType='text'
        value={fieldState.zone}
        setValue={(value) => setFieldState({ ...fieldState, zone: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left blank.'
      />
      <MemoInput
        label='Unk02'
        inputType='number'
        value={fieldState.unk02}
        setValue={(value) => setFieldState({ ...fieldState, unk02: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.'
      />
      <MemoInput
        label='Unk03'
        inputType='number'
        precision={6}
        value={fieldState.unk03}
        setValue={(value) => setFieldState({ ...fieldState, unk03: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.35.'
      />
      <MemoInput
        label='Reverb'
        inputType='number'
        precision={6}
        min={0.0}
        max={1.0}
        value={fieldState.reverb}
        setValue={(value) => setFieldState({ ...fieldState, reverb: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='Set level of reverb for the current room. Range: 0.0 - 1.0'
      />
      <MemoInput
        label='Echo'
        inputType='number'
        precision={6}
        min={0.0}
        max={1.0}
        value={fieldState.echo}
        setValue={(value) => setFieldState({ ...fieldState, echo: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='Set level of echo for the current room. Range: 0.0 - 1.0'
      />
      <MemoInput
        label='Sound'
        inputType='text'
        value={fieldState.sound}
        setValue={(value) => setFieldState({ ...fieldState, sound: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='Room sound. Usually left as null_sound'
      />
      <MemoInput
        label='Unk07'
        inputType='number'
        value={fieldState.unk07}
        setValue={(value) => setFieldState({ ...fieldState, unk07: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.'
      />
      <MemoInput
        label='Unk08'
        inputType='number'
        value={fieldState.unk08}
        setValue={(value) => setFieldState({ ...fieldState, unk08: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.'
      />
      <MemoInput
        label='Unk09'
        inputType='number'
        value={fieldState.unk09}
        setValue={(value) => setFieldState({ ...fieldState, unk09: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.'
      />
      <MemoInput
        label='Unk10'
        inputType='number'
        precision={6}
        min={0.0}
        max={1.0}
        value={fieldState.unk10}
        setValue={(value) => setFieldState({ ...fieldState, unk10: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.7.'
      />
      <MemoInput
        label='Unk11'
        inputType='number'
        value={fieldState.unk11}
        setValue={(value) => setFieldState({ ...fieldState, unk11: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 0.'
      />
      <MemoInput
        label='Unk12'
        inputType='number'
        value={fieldState.unk12}
        setValue={(value) => setFieldState({ ...fieldState, unk12: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as 50.'
      />
      <MemoInput
        label='Unk13'
        inputType='text'
        value={fieldState.unk13}
        setValue={(value) => setFieldState({ ...fieldState, unk13: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='Maybe a static emitter hash. Usually left blank.'
      />
      <MemoInput
        label='SoundSet'
        inputType='text'
        value={fieldState.soundSet}
        setValue={(value) => setFieldState({ ...fieldState, soundSet: value })}
        disabled={activeRoom === null || activeRoom.index === 0}
        infoCircle='No additional information. Usually left as hash_D4855127.'
      />
    </Grid>
  );
}

export default Dat151Info;
