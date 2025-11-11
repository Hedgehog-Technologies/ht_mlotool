import { MemoTooltipSwitch } from "@/layouts/shared/Inputs";
import { Group, Stack, Text, Title } from "@mantine/core";

const ToolSettings: React.FC = () => {
  return (
    <Stack w="100%">
      <Title order={3}>Settings</Title>

      <Group position="apart">
        <Text fz="lg">Toggle Expert Mode</Text>

        <MemoTooltipSwitch
          setValue={() => {}}
        />
      </Group>
    </Stack>
  );
}

export default ToolSettings;
