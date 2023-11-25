import { Box, CloseButton, createStyles, Divider, Group, Title, Transition } from "@mantine/core";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useNuiEvent } from "./hooks/useNuiEvent";
import Occlusion from "./layouts";
import { useVisibility } from "./providers/VisibilityProvider";
import { useGeneralStore } from "./store/general";
import { useRoomsStore } from "./store/rooms";
import { MLODef } from "./types/MLODef";
import { RoomDef } from "./types/RoomDef";
import { fetchNui } from "./utils/fetchNui";
import { useHotkeys } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  main: {
    width: 800,
    height: 700,
    backgroundColor: theme.colors.dark[8],
    borderRadius: theme.radius.sm,
  },

  search: {
    width: '40%',
    transition: '300ms',
    '&:focus-within': {
      width: '50%',
    },
  },
}));

const App: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useVisibility((state) => [state.visible, state.setVisible]);
  const navigate = useNavigate();
  const mlo = useGeneralStore((state) => state.mlo);

  useNuiEvent('setVisible', (data: any) => {
    setVisible(true);
    if (data === undefined) return navigate('/occlusion/general');
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

    return navigate('/occlusion/general');
  });

  const handleExit = () => {
    setVisible(false);
    fetchNui('ht_mlotool:exitMLO', { mloData: mlo });
  };

  useHotkeys([
    ['Escape', handleExit]
  ])

  return (
    <Box className={classes.container}>
      <Transition transition="slide-up" mounted={visible}>
        {(style) => (
          <Box className={classes.main} style={style}>
            <Group position='apart' p={10}>
              <Title order={3}>MLO Audio Occlusion Generator</Title>
              <CloseButton
                size='xl'
                onClick={handleExit}
              />
            </Group>
            <Divider size='sm' />
            <Routes>
              <Route path="/occlusion/*" element={<Occlusion />} />
            </Routes>
          </Box>
        )}
      </Transition>
    </Box>
  );
};

export default App;
