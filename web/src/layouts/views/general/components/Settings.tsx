import { Box, SimpleGrid } from "@mantine/core";
import { useGeneralSetters, useGeneralStore } from "../../../../store/general";
import { MemoTooltipSwitch } from "./TooltipSwitch";

const Settings: React.FC = () => {
  const enableDebug = useGeneralStore((state) => state.enableDebug);
  const enableAudioOcclusion = useGeneralStore((state) => state.enableAudioOcclusion);
  const enableDat151 = useGeneralStore((state) => state.enableDat151);

  const toggleSwitch = useGeneralSetters((setter) => setter.toggleSwitch);

  return (
    <Box>
      <SimpleGrid cols={2}>
        <MemoTooltipSwitch
          label='Generate Audio Occlusion File'
          infoCircle='Sets whether or not to generate the audio occlusion (.ymt.pso.xml) file'
          value={enableAudioOcclusion ?? true}
          toggle={() => toggleSwitch('enableAudioOcclusion')}
        />
        <MemoTooltipSwitch
          label='Enable Debug Comments'
          infoCircle='Sets whether or not to include debug comments in output file(s)'
          value={enableDebug ?? false}
          toggle={() => toggleSwitch('enableDebug')}
        />
        <MemoTooltipSwitch
          label='Generate Dat151 File'
          infoCircle='Sets whether or not to generate the dat151 (game.dat151.rel.xml) file'
          value={enableDat151 ?? true}
          toggle={() => toggleSwitch('enableDat151')}
        />
      </SimpleGrid>
    </Box>
  );
};

export default Settings;
