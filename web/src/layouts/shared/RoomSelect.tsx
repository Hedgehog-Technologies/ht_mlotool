import { Select } from "@mantine/core";
import React from "react";
import { RoomsStoreState, useRoomsStore } from "../../store/rooms";

const RoomSelect: React.FC = () => {
  const [roomSelectList, selectedRoom, roomList] = useRoomsStore((state) => [state.roomSelectList, state.selectedRoom, state.roomList]);
  const [setSelectedRoom, setActiveRoom] = useRoomsStore((state) => [state.setSelectedRoom, state.setActiveRoom]);

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
        label="Room Select"
        value={selectedRoom}
        onChange={handleSelect}
        placeholder={"Pick a room"}
        searchable
        nothingFound={"No room found"}
        data={roomSelectList}
        maxDropdownHeight={200}
      />
  )
};

export default RoomSelect;
export const MemoRoomSelect = React.memo(RoomSelect);
