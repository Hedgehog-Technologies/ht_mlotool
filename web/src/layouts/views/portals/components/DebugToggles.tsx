import { Group, Stack, Switch, Text } from "@mantine/core";
import { usePortalsDebugSetters, usePortalsDebugStore } from "../../../../store/portals";

const DebugToggles: React.FC = () => {
  const enableInfo = usePortalsDebugStore((state) => state.enablePortalInfo);
  const enableOutline = usePortalsDebugStore((state) => state.enablePortalOutline);
  const enableFill = usePortalsDebugStore((state) => state.enablePortalFill);

  const toggleSwitch = usePortalsDebugSetters((setter) => setter.toggleSwitch);

  return (
    <Stack>
      <Text fw={500} size='md'>Portal Debug</Text>
      <Group position='apart'>
        <Switch label='Draw Portal Info' size='md' checked={enableInfo ?? false} onChange={() => toggleSwitch('enablePortalInfo')} />
        <Switch label='Draw Portal Outline' size='md' checked={enableOutline ?? false} onChange={() => toggleSwitch('enablePortalOutline')} />
        <Switch label='Draw Portal Fill' size='md' checked={enableFill ?? false} onChange={() => toggleSwitch('enablePortalFill')} />
      </Group>
    </Stack>
  );
};

export default DebugToggles;