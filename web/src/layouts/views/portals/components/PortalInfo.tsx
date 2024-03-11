import { Alert, Center, Checkbox, Divider, Group, Paper, Space, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { EntitySettings } from "./EntitySettings";
import { MemoTooltipSwitch } from "@/layouts/shared";
import { useLocale } from "@/providers";
import { useGeneralStore, usePortalsStore, useRoomsStore } from "@/stores";
import { PortalDef } from "@/types";
import { fetchNui } from "@/utils";

interface Props {
  portal: PortalDef;
  portalIndex: number;
}

export const PortalInfo: React.FC<Props> = (props) => {
  const locale = useLocale((state) => state.locale);
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
          <MemoTooltipSwitch
            size={"xs"}
            label={locale("ui_portal_debug_point")}
            labelPosition={"left"}
            value={navigate}
            setValue={() => setNavigate(!navigate)}
          />
        </Group>
        <Center py={10} px={15} >
          <Group>
            <Checkbox
              label={`[${intRoom.index}] → [${extRoom.index}] ` + locale("ui_portal_enabled")}
              labelPosition={"left"}
              checked={enabledState[0]}
              onChange={(e) => setEnabledState([ e.currentTarget.checked, enabledState[1] ])}
            />
            <Divider orientation="vertical" />
            <Checkbox
              label={`[${extRoom.index}] → [${intRoom.index}] ` + locale("ui_portal_enabled")}
              labelPosition="left"
              checked={enabledState[1]}
              onChange={(e) => setEnabledState([ enabledState[0], e.currentTarget.checked ])}
            />
          </Group>
        </Center>
        <Center py={5} px={15}>
          {props.portal.entities.length > 0
            ? <Table striped withColumnBorders withBorder fontSize="xs">
                <thead>
                  <tr>
                    <th>{locale("ui_portal_entity_model")}</th>
                    <th style={{ width: "20%" }}>{locale("ui_portal_entity_max_occl")}</th>
                    <th style={{ width: "15%", textAlign: "center" }}>{locale("ui_portal_entity_door")}</th>
                    <th style={{ width: "15%", textAlign: "center" }}>{locale("ui_portal_entity_glass")}</th>
                    <th style={{ width: "10%", textAlign: "center" }}>{locale("ui_debug")}</th>
                  </tr>
                </thead>
                <tbody>
                  {props.portal.entities.map((_, entityIndex) => <EntitySettings key={entityIndex} portalIndex={props.portalIndex} entityIndex={entityIndex} />)}
                </tbody>
              </Table>
            : <Alert w={"100%"}><Center>{locale("ui_portal_no_entities")}</Center></Alert>}
        </Center>
      </Paper>
      <Space h={10} />
    </>
  );
};
