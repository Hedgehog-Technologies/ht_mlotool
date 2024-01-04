import { Group, Stack, Switch, Text } from "@mantine/core";
import { useEffect } from "react";
import { usePortalsSetters, usePortalsStore } from "../../../../store/portals";
import { fetchNui } from "../../../../utils/fetchNui";

const DebugToggles: React.FC = () => {
  const enableInfo = usePortalsStore((state) => state.enablePortalInfo);
  const enableOutline = usePortalsStore((state) => state.enablePortalOutline);
  const enableFill = usePortalsStore((state) => state.enablePortalFill);
  const navigatedPortal = usePortalsStore((state) => state.navigatedPortal);

  const toggleSwitch = usePortalsSetters((setter) => setter.toggleSwitch);

  useEffect(() => {
    fetchNui('ht_mlotool:debugDrawToggle', { info: enableInfo, outline: enableOutline, fill: enableFill, navigate: navigatedPortal });
  }, [enableInfo, enableOutline, enableFill])

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
