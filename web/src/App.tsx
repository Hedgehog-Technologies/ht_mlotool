import { Box, createStyles, Transition } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useNuiEvent } from "./hooks/useNuiEvent";
import MloShell from "./layouts";
import { useVisibility } from "./providers/VisibilityProvider";
import { SelectData } from "./store";
import { useGeneralStore } from "./store/general";
import { usePortalsStore } from "./store/portals";
import { useRoomsStore } from "./store/rooms";
import { Interior, InteriorRoom } from "./types";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  wrapper: {
    width: "37.5%",
    height: "90%",
    position: "absolute",
    top: "2%",
    left: "2%",
    color: theme.colors.dark[0]
  },

  main: {
    position: "absolute",
    top: "2%",
    left: "1.5%",
    bottom: "2%",
    backgroundColor: theme.colors.dark[8],
    borderRadius: theme.radius.sm,
  }
}));

const App: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible, exitUI] = useVisibility((state) => [state.visible, state.setVisible, state.exitUI]);

  useNuiEvent("ht_mlotool:openTool", (data) => {
    setVisible(true);

    const interiorData: Interior = data.interiorData;
    const roomSelectList: SelectData[] = interiorData.rooms.map((room: InteriorRoom) => ({ value: room.index.toString(), label: `${room.index}. ${room.name}` }));

    useGeneralStore.setState({ interior: interiorData });
    useRoomsStore.setState({
      roomList: interiorData.rooms,
      activeRoom: data?.roomIndex ? interiorData.rooms[data.roomIndex] : null,
      roomSelectList: roomSelectList,
      selectedRoom: data?.roomIndex ? roomSelectList[data.roomIndex].value : null
    });
  });

  const [setNavigatedPortal, resetDebugEntities] = usePortalsStore((state) => [state.setNavigatedPortal, state.resetDebugEntities]);
  useNuiEvent("ht_mlotool:cancelNavigation", () => setNavigatedPortal(null));
  useNuiEvent('ht_mlotool:cancelEntityDebug', resetDebugEntities);

  useHotkeys([
    ["Escape", exitUI]
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

export default App;
