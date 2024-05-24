import { AppShell } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { Nav, MloHeader } from "./components";
import { General, DoorTuning, InteriorRoomParams, Portals, Rooms } from "./views";

const MloShell: React.FC = () => {
  return (
    <AppShell
      padding="md"
      fixed={false}
      navbar={<Nav />}
      header={<MloHeader />}
    >
      <Routes>
        <Route path={"/"} element={<General />} />
        <Route path={"/rooms"} element={<Rooms />} />
        <Route path={"/portals"} element={<Portals />} />
        <Route path={"/interiorroomparams"} element={<InteriorRoomParams />} />
        <Route path={"/doortuning"} element={<DoorTuning />} />
      </Routes>
    </AppShell>
  );
};

export default MloShell;
