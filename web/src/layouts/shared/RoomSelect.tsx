import { Select } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import React from "react";
import { useLocale, useVisibility } from "@/providers";
import { RoomsStoreState, useRoomsStore } from "@/stores";

const RoomSelect: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const exitUi = useVisibility((state) => state.exitUI);
  const [roomSelectList, selectedRoom, roomList] = useRoomsStore((state) => [state.roomSelectList, state.selectedRoom, state.roomList]);
  const [setSelectedRoom, setActiveRoom] = useRoomsStore((state) => [state.setSelectedRoom, state.setActiveRoom]);

  const handleSelect = (room: string | null) => {
    let activeRoom: RoomsStoreState["activeRoom"] = null;

    if (room !== null) {
      let roomNumber: number = +room;
      activeRoom = roomList[roomNumber] ?? null;
    }

    setActiveRoom(activeRoom);
    setSelectedRoom(room);
  }

  return (
    <Select
        label={locale("ui_room_select_label")}
        value={selectedRoom}
        onChange={handleSelect}
        placeholder={locale("ui_room_select_placeholder")}
        searchable
        nothingFound={locale("ui_room_select_nothing_found")}
        data={roomSelectList}
        maxDropdownHeight={200}
        onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
      />
  )
};

export const MemoRoomSelect = React.memo(RoomSelect);
