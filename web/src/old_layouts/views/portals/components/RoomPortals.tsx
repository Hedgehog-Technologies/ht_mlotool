import { useGeneralStore } from "../../../../store/general";
import PortalTable from "./PortalTable";

interface Props {
  roomIndex: number;
}

const RoomPortals: React.FC<Props> = ({ roomIndex }) => {
  const mlo = useGeneralStore((state) => state.mlo);

  return (
    <>
      {mlo?.portals.filter((portal) => (!portal.isMirror && (portal.fromRoomIndex === roomIndex || portal.toRoomIndex === roomIndex)))
        .map((portal) => <PortalTable key={portal.mloPortalIndex} portal={portal} portalIndex={portal.mloPortalIndex} />)}
    </>
  );
};

export default RoomPortals;
