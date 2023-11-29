import { Grid } from "@mantine/core";
import { useRoomsStore } from "../../../../store/rooms";
import { MemoInput } from "../../shared/Input";

const RoomInfo: React.FC = () => {
  const activeRoom = useRoomsStore((state) => state.activeRoom);

  return (
    <Grid columns={4} gutter='xs' justify='center' sx={{ fontSize: 12, overflow: 'auto', maxHeight: 450 }}>
      <MemoInput
        label='Room Name'
        inputType='text'
        span={2}
        value={activeRoom?.name ?? ''}
        disabled={true}
        infoCircle='Room name found for the currently selected room'
      />
      <MemoInput
        label='Occlusion Room Name'
        inputType='text'
        span={2}
        value={activeRoom?.occlRoomName ?? ''}
        disabled={true}
        infoCircle='Room name used by the dat151.rel file'
      />
      <MemoInput
        label='Unsigned Name Hash'
        inputType='number'
        value={activeRoom?.uintNameHash ?? -1}
        disabled={true}
        infoCircle='Room name represented as an Unsigned Int32'
      />
      <MemoInput
        label='Signed Name Hash'
        inputType='number'
        value={activeRoom?.nameHash ?? -1}
        disabled={true}
        infoCircle='Room name represented as a Signed Int32'
      />
      <MemoInput
        label= 'Unsigned Room Key'
        inputType='number'
        value={activeRoom?.uintRoomKey ?? -1}
        disabled={true}
        infoCircle='Room key calculated and represented as an Unsigned Int32'
      />
      <MemoInput
        label= 'Signed Room Key'
        inputType='number'
        value={activeRoom?.roomKey ?? -1}
        disabled={true}
        infoCircle='Room key calculated and represented as an Signed Int32'
      />
      <MemoInput
        label='Room Index'
        inputType='number'
        value={activeRoom?.index ?? -1}
        disabled={true}
        infoCircle='Room index found for the currently selected room'
      />
      <MemoInput
        label='Number of Portals'
        inputType='number'
        value={activeRoom?.portalCount ?? -1}
        disabled={true}
        infoCircle='Number of portals found for the currently selected room'
      />
    </Grid>
  );
};

export default RoomInfo;
