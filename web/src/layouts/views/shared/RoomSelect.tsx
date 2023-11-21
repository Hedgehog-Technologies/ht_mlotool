import { Select, Text } from '@mantine/core';
import { RoomsStoreState, useRoomsSetters, useRoomsStore } from '../../../store/rooms';

const RoomSelect: React.FC = () => {
  const roomSelectList = useRoomsStore((state) => state.roomSelectList);
  const selectedRoom = useRoomsStore((state) => state.selectedRoom);
  const roomList = useRoomsStore((state) => state.roomList);

  const setSelectedRoom = useRoomsSetters((setter) => setter.setSelectedRoom);
  const setActiveRoom = useRoomsSetters((setter) => setter.setActiveRoom);

  const handleSelect = (room: string | null) => {
    let activeRoom: RoomsStoreState['activeRoom'] = null;
    
    if (room !== null) {
      let roomNumber: number = +room;
      activeRoom = roomList[roomNumber] ?? null;
    }
    
    setActiveRoom(activeRoom);
    setSelectedRoom(room);
  }

  return (
    <Select
      label='Room Select'
      value={selectedRoom}
      onChange={handleSelect}
      placeholder='Pick a room'
      searchable
      nothingFound='No room found'
      maxDropdownHeight={200}
      data={roomSelectList}
    />
  );
};

export default RoomSelect;
