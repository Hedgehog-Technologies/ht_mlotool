import { AppShell, Box, Title } from "@mantine/core";
import Nav from "./components/Nav";
import MloHeader from "./components/MloHeader";
import { Route, Routes } from "react-router-dom";
import General from "./views/general";

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
        <Route path={'/rooms'} element={<Box><Title>Rooms</Title></Box>} />
        <Route path={'/portals'} element={<Box><Title>Portals</Title></Box>} />
      </Routes>
    </AppShell>
  );
};

export default MloShell;
