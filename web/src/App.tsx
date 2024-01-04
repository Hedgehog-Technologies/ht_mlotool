import { Box, createStyles, Transition } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useNuiEvent } from "./hooks/useNuiEvent";
import { useVisibility } from "./providers/VisibilityProvider";
import { useGeneralStore } from "./store/general";
import { usePortalsStore } from "./store/portals";
import { useRoomsStore } from "./store/rooms";
import { MLODef } from "./types/MLODef";
import { RoomDef } from "./types/RoomDef";
import MloShell from "./layouts";

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  wrapper: {
    width: '37.5%',
    height: '90%',
    position: 'absolute',
    top: '2%',
    left: '2%',
    // bottom: '2%',
    color: theme.colors.violet[1]
  },

  main: {
    position: 'absolute',
    top: '2%',
    left: '1.5%',
    bottom: '2%',
    backgroundColor: theme.colors.dark[8],
    borderRadius: theme.radius.sm,
  }
}));

const App: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useVisibility((state) => [state.visible, state.setVisible]);
  const navigate = useNavigate();
  const mlo = useGeneralStore((state) => state.mlo);

  useNuiEvent('setVisible', (data: any) => {
    setVisible(true);
  });

  useNuiEvent('ht_mlotool:openMLO', (data) => {
    setVisible(true);

    const mloData = new MLODef(data.mloData);
    const roomSelectList =  mloData.rooms.map((room: RoomDef) => { return { value: room.index.toString(), label: `${room.index}. ${room.name}` } });

    useGeneralStore.setState({ mlo: mloData });
    useRoomsStore.setState({
      roomList: mloData.rooms,
      activeRoom: data?.roomIndex ? mloData.rooms[data.roomIndex] : null,
      roomSelectList: roomSelectList,
      selectedRoom: data?.roomIndex ? roomSelectList[data.roomIndex].value : null
    });

    // return navigate('/');
  });

  const setNavigatedPortal = usePortalsStore((state) => state.setNavigatedPortal);
  useNuiEvent('ht_mlotool:cancelNavigation', (data: any) => {
    setNavigatedPortal(null);
  });

  // const handleExit = () => {
  //   setVisible(false);
  //   fetchNui('ht_mlotool:exitMLO', { mloData: mlo });
  // };

  // useHotkeys([
  //   ['Escape', handleExit]
  // ]);

  return (
    <Box className={classes.container}>
      <Transition transition='slide-right' mounted={visible}>
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
