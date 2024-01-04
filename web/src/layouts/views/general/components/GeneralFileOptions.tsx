import { Group, Stack, Title } from "@mantine/core"
import { MemoTooltipCheckbox } from "../../../shared/Inputs";
import { useGeneralStore } from "../../../../store/general";

const GenerationFileOptions: React.FC = () => {
  const [enableAudioOcclusion, enableDat151, enableDebug] = useGeneralStore((state) => [state.enableAudioOcclusion, state.enableDat151, state.enableDebug]);
  const toggleSwitch = useGeneralStore((state) => state.toggleCheck);

  return (
    <Stack>
      <Title order={5}>File Generation Options</Title>
      <Group>
        <MemoTooltipCheckbox
          label={"Generate Audio Occlusion YMT File"}
          infoCircle={"Whether or not the audio occlusion file (*.ymt.pso.xml) will be generated"}
          value={enableAudioOcclusion ?? true}
          setValue={() => toggleSwitch("enableAudioOcclusion")}
        />
        <MemoTooltipCheckbox
          label={"Generate Dat151 File"}
          infoCircle={"Whether or not the dat151 file (*_game.dat151.rel.xml) will be generated"}
          value={enableDat151 ?? true}
          setValue={() => toggleSwitch("enableDat151")}
        />
        <MemoTooltipCheckbox
          label={"Add Debug Comments"}
          infoCircle={"Whether or not add debug comments to output file(s)"}
          value={enableDebug ?? false}
          setValue={() => toggleSwitch("enableDebug")}
        />
      </Group>
    </Stack>
  )
}

export default GenerationFileOptions;
