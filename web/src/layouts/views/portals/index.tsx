import { Alert, Box, Group, ScrollArea, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import DebugMenu from "./components/DebugMenu";
import PortalInfo from "./components/PortalInfo";
import { MemoRoomSelect } from "../../shared/RoomSelect";
import { useLocale } from "../../../providers/LocaleProvider";
import { useGeneralStore } from "../../../store/general";
import { usePortalsStore } from "../../../store/portals";
import { useRoomsStore } from "../../../store/rooms";
import { PortalDef } from "../../../types/PortalDef";

const Portals: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const mlo = useGeneralStore((state) => state.mlo);
  const activeRoom = useRoomsStore((state) => state.activeRoom);
  const [scrollPosition, setScrollPosition] = usePortalsStore((state) => [state.scrollPosition, state.setScrollPosition]);
  const [filteredRooms, setFilteredRooms] = useState<Array<PortalDef>>();
  const [shouldScroll, setShouldScroll]  = useState<boolean>(false);
  const viewport = useRef<HTMLDivElement>(null);
  
  const scrollTo = (pos: { x: number, y: number }, timeout: number = 100) => {
    setTimeout(() => viewport.current?.scrollTo({ top: pos.y }), timeout)
  };

  let timer: NodeJS.Timeout;
  const setScrollState = (pos: { x: number, y: number }) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      setScrollPosition(pos);
    }, 500);

    return () => clearTimeout(timer);
  };
  
  useEffect(() => { scrollTo(scrollPosition); }, []);

  useEffect(() => {
    let rooms: Array<PortalDef> | undefined = undefined;

    if (mlo) {
      rooms = mlo.portals.filter((portal) => (!portal.isMirror && (portal.fromRoomIndex === activeRoom?.index || portal.toRoomIndex == activeRoom?.index)));
    }

    setFilteredRooms(rooms);

    if (shouldScroll) {
      scrollTo({ x: 0, y: 0 });
    } else {
      setShouldScroll(true);
    }
  }, [activeRoom]);

  return (
    <Box>
      <MemoRoomSelect />
      <Group position="apart" pt={20}>
        <Title order={4}>{locale("ui_portal_info")}</Title>
        <DebugMenu />
      </Group>

      <ScrollArea style={{ height: 650 }} pt={5} onScrollPositionChange={setScrollState} viewportRef={viewport}>
        {activeRoom?.portalCount
          && filteredRooms?.map((portal) => <PortalInfo key={portal.mloPortalIndex} portal={portal} portalIndex={portal.mloPortalIndex} />)
          || <Alert>{locale("ui_portal_alert")}</Alert>}
      </ScrollArea>
    </Box>
  );
};

export default Portals;
