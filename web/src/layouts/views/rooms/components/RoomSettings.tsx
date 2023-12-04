import { Box, Group, Title } from "@mantine/core";
import { MemoNumberInput, MemoStringInput } from "../../../shared/Inputs";

const RoomSettings: React.FC = () => {
  return (
    <>
      <Box pt={25}>
        <Title order={5}>Settings</Title>
        <Group position="apart" grow>
          <MemoStringInput
            label="Flags"
            value={"0xAAAAAAAA"}
            infoCircle="flags"
          />
          <MemoStringInput
            label="Zone"
            value={""}
            infoCircle="Zone"
          />
          <MemoNumberInput
            label="Unk02"
            value={0}
            infoCircle="Unk02"
          />
          <MemoNumberInput
            label="Unk03"
            value={0.35}
            precision={6}
            infoCircle="Unk03"
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label="Reverb"
            value={0.5}
            precision={6}
            infoCircle="reverb"
          />
          <MemoNumberInput
            label="Echo"
            value={0.5}
            precision={6}
            infoCircle="echo"
          />
          <MemoStringInput
            label="Sound"
            value={"null_sound"}
            infoCircle="sound"
          />
          <MemoNumberInput
            label="Unk07"
            value={0}
            infoCircle="unk07"
          />
        </Group>

        <Group position="apart" grow>
          <MemoNumberInput
            label="Unk08"
            value={0}
            infoCircle="unk08"
          />
          <MemoNumberInput
            label="Unk09"
            value={0}
            infoCircle="unk09"
          />
          <MemoNumberInput
            label="Unk10"
            value={0.7}
            precision={6}
            infoCircle="unk10"
          />
          <MemoNumberInput
            label="Unk11"
            value={0}
            infoCircle="unk11"
          />
        </Group>

        <Group position="center" grow>
          <MemoNumberInput
            label="Unk12"
            value={50}
            infoCircle="unk12"
          />
          <MemoStringInput
            label="Unk13"
            value={""}
            infoCircle="unk13"
          />
          <MemoStringInput
            label="SoundSet"
            value={"hash_D4855127"}
            infoCircle="soundset"
          />
        </Group>
      </Box>
    </>
  );
};

export default RoomSettings;
