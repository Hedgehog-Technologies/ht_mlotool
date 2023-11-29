import { AppShell } from "@mantine/core";
import Nav from "./components/Nav";
import MloHeader from "./components/MloHeader";

const MloShell: React.FC = () => {
  return (
    <AppShell
      padding='md'
      fixed={false}
      navbar={<Nav />}
      header={<MloHeader />}
    >

    </AppShell>
  );
};

export default MloShell;
