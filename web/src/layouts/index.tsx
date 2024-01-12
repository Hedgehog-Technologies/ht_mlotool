import { AppShell } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import MloHeader from "./components/MloHeader";
import General from "./views/general";
import Portals from "./views/portals";
import Rooms from "./views/rooms";

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
      </Routes>
    </AppShell>
  );
};

export default MloShell;
