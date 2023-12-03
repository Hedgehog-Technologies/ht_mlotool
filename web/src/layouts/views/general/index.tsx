import { Button, Stack } from "@mantine/core";
import GeneralMlo from "./components/GeneralMlo";
import GenerationFileOptions from "./components/GeneralFileOptions";

const General: React.FC = () => {
  return (
    <Stack justify="space-between" sx={{ height: '100%' }}>
      <GeneralMlo />

      <GenerationFileOptions />

      <Button>Testing</Button>
    </Stack>
  );
};

export default General;
