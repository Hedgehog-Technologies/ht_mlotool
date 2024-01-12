import { Group, Stack, Title } from "@mantine/core"
import { MemoTooltipCheckbox } from "../../../shared/Inputs";
import { useLocale } from "../../../../providers/LocaleProvider";
import { useGeneralStore } from "../../../../store/general";

const GenerationFileOptions: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const [enableAudioOcclusion, enableDat151, enableDebug] = useGeneralStore((state) => [state.enableAudioOcclusion, state.enableDat151, state.enableDebug]);
  const toggleSwitch = useGeneralStore((state) => state.toggleCheck);

  return (
    <Stack>
      <Title order={5}>{locale("ui_file_options")}</Title>
      <Group>
        <MemoTooltipCheckbox
          label={locale("ui_generate_ymt")}
          infoCircle={locale("ui_generate_ymt_info")}
          value={enableAudioOcclusion ?? true}
          setValue={() => toggleSwitch("enableAudioOcclusion")}
        />
        <MemoTooltipCheckbox
          label={locale("ui_generate_dat151")}
          infoCircle={locale("ui_generate_dat151_info")}
          value={enableDat151 ?? true}
          setValue={() => toggleSwitch("enableDat151")}
        />
        <MemoTooltipCheckbox
          label={locale("ui_debug_comments")}
          infoCircle={locale("ui_debug_comments_info")}
          value={enableDebug ?? false}
          setValue={() => toggleSwitch("enableDebug")}
        />
      </Group>
    </Stack>
  )
}

export default GenerationFileOptions;
