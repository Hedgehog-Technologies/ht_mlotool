import { AppShell, Box } from "@mantine/core";
import Nav from "./components/Nav";
import MloHeader from "./components/MloHeader";
import { Route, Routes } from "react-router-dom";
import General from "./views/general";
import Rooms from "./views/rooms";
import Portals from "./views/portals";

const MloShell: React.FC = () => {
  return (
    <AppShell
      padding='md'
      fixed={false}
      navbar={<Nav />}
      header={<MloHeader />}
    >
      <Routes>
        <Route path={'/'} element={<General />} />
        <Route path={'/rooms'} element={<Rooms />} />
        <Route path={'/portals'} element={<Portals />} />
      </Routes>
    </AppShell>
  );
};

export default MloShell;
