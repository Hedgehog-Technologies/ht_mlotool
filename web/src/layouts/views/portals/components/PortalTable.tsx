import { Paper, Space, Table, Title } from "@mantine/core";
import EntityTableEntry from "./EntityTableEntry";
import PortalToggles from "./PortalToggles";
import { useRoomsStore } from "../../../../store/rooms";
import { PortalDef } from "../../../../types/PortalDef";

interface Props {
  portal: PortalDef;
  portalIndex: number;
}

const PortalTable: React.FC<Props> = ({ portal, portalIndex: index }) => {
  const rooms = useRoomsStore((state) => state.roomList);
  const intRoom = rooms[portal.fromRoomIndex];
  const extRoom = rooms[portal.toRoomIndex];

  return (
    <Paper withBorder p={5}>
      <Title order={4} align='center'>
        {portal.mloPortalIndex}. {intRoom.displayName} [{intRoom.index}] ↔ {extRoom.displayName} [{extRoom.index}]
      </Title>
      <Space h={10} />
      <PortalToggles portal={portal}/>
      <Table striped withColumnBorders fontSize='xs'>
        <thead>
          <tr>
            <th>Model</th>
            <th style={{ width: '20%' }}>Max Occlusion</th>
            <th style={{ width: '15%' }}>Is Door?</th>
            <th style={{ width: '15%' }}>Is Glass?</th>
          </tr>
        </thead>
        <tbody>
          {portal.entities.map((value, entityIndex) => <EntityTableEntry key={entityIndex} portalIndex={index} entityIndex={entityIndex} />)}
        </tbody>
      </Table>
    </Paper>
  );
};

export default PortalTable;
