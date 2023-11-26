import { Checkbox, Divider, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { MemoTooltipSwitch } from "../../shared/TooltipSwitch";
import { useGeneralStore } from "../../../../store/general";
import { usePortalsSetters, usePortalsStore } from "../../../../store/portals";
import { useRoomsStore } from "../../../../store/rooms";
import { PortalDef } from "../../../../types/PortalDef";
import { fetchNui } from "../../../../utils/fetchNui";

interface Props {
  portal: PortalDef;
}

const PortalToggles: React.FC<Props> = ({ portal }) => {
  const mlo = useGeneralStore((state) => state.mlo);
  const rooms = useRoomsStore((state) => state.roomList);
  const [enabledState, setEnabledState] = useState<boolean[]>(portal.isEnabled);
  
  const enableInfo = usePortalsStore((state) => state.enablePortalInfo);
  const enableOutline = usePortalsStore((state) => state.enablePortalOutline);
  const enableFill = usePortalsStore((state) => state.enablePortalFill);
  const navigatedPortal = usePortalsStore((state) => state.navigatedPortal);
  const [navigate, setNavigate] = useState<boolean>(navigatedPortal === portal.mloPortalIndex);
  const setNavigatedPortal = usePortalsSetters((setter) => setter.setNavigatedPortal)

  const intRoom = rooms[portal.fromRoomIndex];
  const extRoom = rooms[portal.toRoomIndex];

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (mlo === null) return;

    timer = setTimeout(() => {
      mlo.SetPortalEnabled(portal.mloPortalIndex, enabledState);
    }, 500)
  }, [enabledState])

  useEffect(() => {
    if (navigate && navigatedPortal !== portal.mloPortalIndex)
    {
      console.log(portal.mloPortalIndex);
      setNavigatedPortal(portal.mloPortalIndex);
    }
    else if (!navigate && navigatedPortal === portal.mloPortalIndex)
    {
      setNavigatedPortal(null);
      fetchNui('ht_mlotool:debugDrawToggle', { info: enableInfo, outline: enableOutline, fill: enableFill, navigate: null })
    }
  }, [navigate])

  useEffect(() => {
    if (navigate && navigatedPortal !== portal.mloPortalIndex)
    {
      setNavigate(false);
    }
    else if (navigatedPortal === portal.mloPortalIndex)
    {
      fetchNui('ht_mlotool:debugDrawToggle', { info: enableInfo, outline: enableOutline, fill: enableFill, navigate: navigatedPortal })
    }
  }, [navigatedPortal])

  return (
    <Stack align='center'>
      <MemoTooltipSwitch
        label='Navigate to Portal'
        infoCircle='Enables a debug arrow at your feet directing you towards the portal specified'
        value={navigate}
        toggle={() => setNavigate(!navigate)}
      />
      <Group position='center'>
        <Checkbox
          checked={enabledState[0]}
          onChange={(e) => setEnabledState([ e.currentTarget.checked, enabledState[1] ])}
          label={`${intRoom.displayName} → ${extRoom.displayName} Enabled`}
        />
        <Divider orientation='vertical' />
        <Checkbox
          checked={enabledState[1]}
          onChange={(e) => setEnabledState([ enabledState[0], e.currentTarget.checked ])}
          label={`${extRoom.displayName} → ${intRoom.displayName} Enabled`}
        />
      </Group>
    </Stack>
  );
}

export default PortalToggles;
