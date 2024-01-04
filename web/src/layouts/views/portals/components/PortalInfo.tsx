import { Center, Checkbox, Divider, Group, Paper, Space, Switch, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import EntitySettings from "./EntitySettings";
import { PortalDef } from "../../../../types/PortalDef";
import { useRoomsStore } from "../../../../store/rooms";
import { useGeneralStore } from "../../../../store/general";
import { usePortalsStore } from "../../../../store/portals";
import { fetchNui } from "../../../../utils/fetchNui";

interface Props {
  portal: PortalDef;
  portalIndex: number;
}

const PortalInfo: React.FC<Props> = (props) => {
  const mlo = useGeneralStore((state) => state.mlo);
  const rooms = useRoomsStore((state) => state.roomList);
  const intRoom = rooms[props.portal.fromRoomIndex];
  const extRoom = rooms[props.portal.toRoomIndex];

  const [enabledState, setEnabledState] = useState<Array<boolean>>(props.portal.isEnabled);
  const [enableInfo, enableOutline, enableFill, navigatedPortal] = usePortalsStore((state) => [state.enablePortalInfo, state.enablePortalOutline, state.enablePortalFill, state.navigatedPortal]);
  const [navigate, setNavigate] = useState<boolean>(navigatedPortal === props.portal.mloPortalIndex);
  const setNavigatedPortal = usePortalsStore((state) => state.setNavigatedPortal);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (mlo === null) return;

    timer = setTimeout(() => {
      mlo.SetPortalEnabled(props.portal.mloPortalIndex, enabledState);
    }, 500);

    return () => clearTimeout(timer);
  }, [enabledState]);

  useEffect(() => {
    if (navigate && navigatedPortal !== props.portal.mloPortalIndex) {
      setNavigatedPortal(props.portal.mloPortalIndex);
    }
    else if (!navigate && navigatedPortal === props.portal.mloPortalIndex) {
      setNavigatedPortal(null);
      fetchNui("ht_mlotool:debugDrawToggle", { info: enableInfo, outline: enableOutline, fill: enableFill, navigate: null }, "1");
    }
  }, [navigate]);

  useEffect(() => {
    if (navigate && navigatedPortal !== props.portal.mloPortalIndex) {
      setNavigate(false);
    }
    else if (navigatedPortal === props.portal.mloPortalIndex) {
      fetchNui("ht_mlotool:debugDrawToggle", { info: enableInfo, outline: enableOutline, fill: enableFill, navigate: navigatedPortal }, "1");
    }
  }, [navigatedPortal]);

  return (
    <>
      <Paper withBorder>
        <Group pt={5} px={15} align="flex-end" position="apart">
          <Title order={5}>
            {`${props.portal.mloPortalIndex}. ${intRoom.displayName} [${intRoom.index}] ↔ ${extRoom.displayName} [${extRoom.index}]`}
          </Title>
          <Switch
            size={"xs"}
            label={"Point Towards"}
            labelPosition={"left"}
            checked={navigate}
            onChange={() => setNavigate(!navigate)}
          />
        </Group>
        <Center py={10} px={15} >
          <Group>
            <Checkbox
              label={`[${intRoom.index}] → [${extRoom.index}] Enabled`}
              labelPosition={"left"}
              checked={enabledState[0]}
              onChange={(e) => setEnabledState([ e.currentTarget.checked, enabledState[1] ])}
            />
            <Divider orientation="vertical" />
            <Checkbox
              label={`[${extRoom.index}] → [${intRoom.index}] Enabled`}
              labelPosition="left"
              checked={enabledState[1]}
              onChange={(e) => setEnabledState([ enabledState[0], e.currentTarget.checked ])}
            />
          </Group>
        </Center>
        <Center py={5} px={15}>
          <Table striped withColumnBorders withBorder fontSize='xs'>
            <thead>
              <tr>
                <th>Model</th>
                <th style={{ width: '20%' }}>Max Occlusion</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Is Door?</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Is Glass?</th>
              </tr>
            </thead>
            <tbody>
              {props.portal.entities.map((_, entityIndex) => <EntitySettings key={entityIndex} portalIndex={props.portalIndex} entityIndex={entityIndex} />)}
            </tbody>
          </Table>
        </Center>
      </Paper>
      <Space h={10} />
    </>
  );
};

export default PortalInfo;
