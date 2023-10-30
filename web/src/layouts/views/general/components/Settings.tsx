import { Box, Center, SimpleGrid } from "@mantine/core";
import { useGeneralSetters, useGeneralStore } from "../../../../store/general";
import TooltipSwitch from "./TooltipSwitch";

const Settings: React.FC = () => {
  // const batchEdit = useGeneralStore((state) => state.batchEdit);
  const enableDebug = useGeneralStore((state) => state.enableDebug);
  const enableAudioOcclusion = useGeneralStore((state) => state.enableAudioOcclusion);
  const enableDat151 = useGeneralStore((state) => state.enableDat151);

  const toggleSwitch = useGeneralSetters((setter) => setter.toggleSwitch);

  return (
    <Box>
      <Center pt={8} pb={8}>
        <SimpleGrid cols={2}>
          <TooltipSwitch
            label='Generate Audio Occlusion File'
            infoCircle='Sets whether or not to generate the audio occlusion (.ymt.pso.xml) file'
            value={enableAudioOcclusion ?? true}
            toggle={() => toggleSwitch('enableAudioOcclusion')}
          />
          <TooltipSwitch
            label='Generate Dat151 File'
            infoCircle='Sets whether or not to generate the dat151 (game.dat151.rel.xml) file'
            value={enableDat151 ?? true}
            toggle={() => toggleSwitch('enableDat151')}
          />
        </SimpleGrid>
      </Center>
      <Center pb={8}>
        <TooltipSwitch
          label='Enable Debug Output'
          infoCircle='Sets whether or not to include debug comments in output file(s)'
          value={enableDebug ?? false}
          toggle={() => toggleSwitch('enableDebug')}
        />
      </Center>
    </Box>
  );
};

export default Settings;
