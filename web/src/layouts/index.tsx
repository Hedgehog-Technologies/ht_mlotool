import { AppShell } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { Nav, MloHeader } from "./components";
import { General, DoorTuning, InteriorRoomParams, Portals, Rooms, StaticEmitters } from "./views";
import { useFocusWithin } from "@mantine/hooks";
import { useEffect } from "react";
import { useGeneralStore } from "@/stores";

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
        <Route path={"/staticemitters"} element={<StaticEmitters />} />
        {/* TODO: Re-enable for future weapon occlusion / door tuning features */}
        {/* <Route path={"/interiorroomparams"} element={<InteriorRoomParams />} />
        <Route path={"/doortuning"} element={<DoorTuning />} /> */}
      </Routes>
    </AppShell>
  );
};

export default MloShell;
