import { Group, Stack, Title } from "@mantine/core"
import { MemoTooltipCheckbox } from "../../../shared/Inputs";

const GenerationFileOptions: React.FC = () => {
  return (
    <Stack>
      <Title order={5}>File Generation Options</Title>
      <Group>
        <MemoTooltipCheckbox
          label="Generate Audio Occlusion YMT File"
          value={true}
          infoCircle="Gimme AO YMT"
        />
        <MemoTooltipCheckbox
          label="Generate Dat151 File"
          value={true}
          infoCircle="Gimme Dat File"
        />
        <MemoTooltipCheckbox
          label="Add Debug Comments"
          value={false}
          infoCircle="Gimme Debug"
        />
      </Group>
    </Stack>
  )
}

export default GenerationFileOptions;
