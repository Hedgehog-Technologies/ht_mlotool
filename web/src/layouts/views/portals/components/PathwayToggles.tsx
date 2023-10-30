import { Checkbox, Divider, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGeneralStore } from "../../../../store/general";
import { useRoomsStore } from "../../../../store/rooms";
import { PortalDef } from "../../../../types/PortalDef";

interface Props {
  portal: PortalDef;
}

const PathwayToggles: React.FC<Props> = ({ portal }) => {
  const mlo = useGeneralStore((state) => state.mlo);
  const rooms = useRoomsStore((state) => state.roomList);
  const [enabledState, setEnabledState] = useState<boolean[]>(portal.isEnabled)

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

  return (
    <Group position='center'>
      <Checkbox
        checked={enabledState[0]}
        onChange={(e) => setEnabledState([ e.currentTarget.checked, enabledState[1] ])}
        labelPosition='left'
        label={`${intRoom.displayName} → ${extRoom.displayName} Enabled`}
      />
      <Divider orientation='vertical' />
      <Checkbox
        checked={enabledState[1]}
        onChange={(e) => setEnabledState([ enabledState[0], e.currentTarget.checked ])}
        labelPosition='left'
        label={`${extRoom.displayName} → ${intRoom.displayName} Enabled`}
      />
    </Group>
  );
}

export default PathwayToggles;
