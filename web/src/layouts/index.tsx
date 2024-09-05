import { AppShell } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { Nav, MloHeader } from "./components";
import { General, DoorTuning, InteriorRoomParams, Portals, Rooms, StaticEmitters } from "./views";
import { useSharedStore } from "@/stores";

const MloShell: React.FC = () => {
  const opacity = useSharedStore((state) => state.opacity);

  return (
    <AppShell
      padding="md"
      fixed={false}
      navbar={<Nav />}
      header={<MloHeader />}
      style = {{ opacity: opacity }}
      styles={{
        main: {
          height: "75vh"
        }
      }}
    >
      <Routes>
        <Route path={"/"} element={<General />} />
        <Route path={"/rooms"} element={<Rooms />} />
        <Route path={"/portals"} element={<Portals />} />
        <Route path={"/staticemitters"} element={<StaticEmitters />} />
        {/* TODO: Re-enable for future weapon occlusion / door tuning features */}
        {/* <Route path={"/interiorroomparams"} element={<InteriorRoomParams />} />
        <Route path={"/doortuning"} element={<DoorTuning />} /> */}
      </Routes>
    </AppShell>
  );
};

export default MloShell;
