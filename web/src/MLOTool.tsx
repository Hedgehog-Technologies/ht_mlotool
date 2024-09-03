import { Box, createStyles, Transition } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import MloShell from "@/layouts";
import { useVisibility } from "@/providers";
import { useGeneralStore } from "@/stores/general";
import { usePortalsStore } from "@/stores/portals";
import { useRoomsStore } from "@/stores/rooms";
import { MLODef } from "@/types/MLODef";
import { RoomDef } from "@/types/RoomDef";
import { useEmitterStore } from "./stores";
import { useSharedStore } from "./stores/shared";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  wrapper: {
    width: "37.5vw",
    height: "80vh",
    position: "absolute",
    top: "2vh",
    left: "2vw",
    color: theme.colors.dark[0]
  }
}));

const MLOTool: React.FC = () => {
  const { classes } = useStyles();
  const ignoreEscape = useSharedStore((state) => state.ignoreEscape);
  const [visible, setVisible, exitUI] = useVisibility((state) => [state.visible, state.setVisible, state.exitUI]);

  useNuiEvent("ht_mlotool:openMLO", (data) => {
    setVisible(true);

    const mloData = new MLODef(data.mloData);
    const roomSelectList =  mloData.rooms.map((room: RoomDef) => { return { value: room.index.toString(), label: `${room.index}. ${room.name}` } });
    const emitters = Object.keys(data.mloData.staticEmitters).map((key: string) => data.mloData.staticEmitters[key]);

    useGeneralStore.setState({ mlo: mloData });
    useRoomsStore.setState({
      roomList: mloData.rooms,
      activeRoom: data?.roomIndex ? mloData.rooms[data.roomIndex] : null,
      roomSelectList: roomSelectList,
      selectedRoom: data?.roomIndex ? roomSelectList[data.roomIndex].value : null
    });
    useEmitterStore.setState({ emitters: emitters ?? [] });
  });

  const [setNavigatedPortal, resetDebugEntities] = usePortalsStore((state) => [state.setNavigatedPortal, state.resetDebugEntities]);
  useNuiEvent("ht_mlotool:cancelNavigation", () => setNavigatedPortal(null));
  useNuiEvent('ht_mlotool:cancelEntityDebug', resetDebugEntities);

  const tryExitUI = () => {
    if (!ignoreEscape) {
      exitUI();
    }
  }

  useHotkeys([
    ["Escape", tryExitUI]
  ]);

  return (
    <Box className={classes.container}>
      <Transition transition="slide-right" mounted={visible}>
        {(style) => (
          <Box style={style} className={classes.wrapper}>
            <MloShell />
          </Box>
        )}
      </Transition>
    </Box>
  );
};

export default MLOTool;
