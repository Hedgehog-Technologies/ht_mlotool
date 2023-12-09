import { Select } from "@mantine/core";
import React from "react";

const RoomSelect: React.FC = () => {
  return (
    <Select
        label="Room Select"
        value={"1"}
        placeholder="Pick a room"
        searchable
        nothingFound="No room found"
        data={[ { value: '0', label: '0. Room Zero'}, {value: '1', label: '1. Room One'}, {value: '2', label: '2. Room Two' } ]}
      />
  )
};

export default RoomSelect;
export const MemoRoomSelect = React.memo(RoomSelect);
