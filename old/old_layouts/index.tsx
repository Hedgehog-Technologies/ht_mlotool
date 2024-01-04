import { Box, Stack, Tabs } from "@mantine/core";
import { TbBox, TbDoor, TbHome } from "react-icons/tb";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { useGeneralStore } from "../store/general";
import { useRoomsStore } from "../store/rooms";
import { LuaRoom } from "../types";
import { MLODef } from "../types/MLODef";
import { RoomDef, RoomDefConstructor } from "../types/RoomDef";
import General from "./views/general";
import Portals from "./views/portals";
import Rooms from "./views/rooms";

const Occlusion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useNuiEvent('setMLO', (data) => {
    useGeneralStore.setState({ mlo: new MLODef(data) });
    useRoomsStore.setState({
      roomList: data.rooms.map((room: RoomDefConstructor) => new RoomDef(room)),
      roomSelectList: data.rooms.map((room: LuaRoom) => { return {value: room.index, label: `${room.index}. ${room.name}`} })
    });
  });

  return (
    <Box sx={{ height: '90%', display: 'flex' }}>
      <Tabs
        orientation='vertical'
        color='blue'
        sx={{ height: '100%' }}
        value={location.pathname.substring(11)}
        onTabChange={(value) => navigate(`/occlusion/${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value='general' icon={<TbHome size={20} />}>General</Tabs.Tab>
          <Tabs.Tab value='rooms' icon={<TbBox size={20} />}>Rooms</Tabs.Tab>
          <Tabs.Tab value='portals' icon={<TbDoor size={20} />}>Portals</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Stack p={16} sx={{ width: '100%' }} justify='space-between'>
        <Routes>
          <Route path='/general' element={<General />} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/portals' element={<Portals />} />
        </Routes>
      </Stack>
    </Box>
  );
};

export default Occlusion;
