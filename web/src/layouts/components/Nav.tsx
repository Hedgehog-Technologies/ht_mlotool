import { ActionIconVariant, Divider, Navbar, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaDoorOpen } from "react-icons/fa";
import { FaGun } from "react-icons/fa6";
import { GiMagicPortal } from "react-icons/gi";
import { HiSpeakerWave } from "react-icons/hi2";
import { IoCubeSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { MemoNavIcon } from "./NavIcon";
import { useLocale } from "@/providers";

export const Nav: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const location = useLocation();
  const [generalVariant, setGeneralVariant] = useState<ActionIconVariant>();
  const [roomsVariant, setRoomsVariant] = useState<ActionIconVariant>();
  const [portalsVariant, setPortalsVariant] = useState<ActionIconVariant>();
  const [staticEmitterVariant, setStaticEmitterVariant] = useState<ActionIconVariant>();
  const [doorTuningVariant, setDoorTuningVariant] = useState<ActionIconVariant>();
  const [irpVariant, setIRPVariant] = useState<ActionIconVariant>();

  useEffect(() => {
    let path = location.pathname;
    setGeneralVariant(undefined);
    setRoomsVariant(undefined);
    setPortalsVariant(undefined);
    setStaticEmitterVariant(undefined);
    setDoorTuningVariant(undefined);
    setIRPVariant(undefined);

    if (path === "/") {
      setGeneralVariant("filled");
    }
    else if (path === "/rooms") {
      setRoomsVariant("filled");
    }
    else if (path === "/portals") {
      setPortalsVariant("filled");
    }
    else if (path === "/staticemitters")
    {
      setStaticEmitterVariant("filled");
    }
    else if (path === "/doortuning") {
      setDoorTuningVariant("filled");
    }
    else if (path === "/interiorroomparams") {
      setIRPVariant("filled");
    }
  }, [location]);

  return (
    <Navbar
      height={"75vh"}
      width={{ base: "3.5vw" }}
      p="md"
      fixed={false}
    >
      <Navbar.Section pb={10}>
        <Stack justify="center" align="center" spacing={5}>
          <MemoNavIcon
            label={locale("ui_tab_general")}
            destination={"/"}
            Icon={AiFillHome}
            color={"violet.6"}
            variant={generalVariant}
          />

          <MemoNavIcon 
            label={locale("ui_tab_rooms")}
            destination={"/rooms"}
            Icon={IoCubeSharp}
            color={"violet.6"}
            variant={roomsVariant}
          />

          <MemoNavIcon 
            label={locale("ui_tab_portals")}
            destination={"/portals"}
            Icon={GiMagicPortal}
            color={"violet.6"}
            variant={portalsVariant}
          />
        </Stack>
      </Navbar.Section>

      <Divider />

      <Navbar.Section pt={10}>
        <Stack justify="center" align="center" spacing={5}>
          <MemoNavIcon
            label={"Static Emitters"}
            destination={"/staticemitters"}
            Icon={HiSpeakerWave}
            color={"violet.6"}
            variant={staticEmitterVariant}
          />

          {/* TODO: Re-enable for future weapon occlusion / door tuning features */}
          {/* <MemoNavIcon
            label={"Interior Room Weapon Audio Tuning"}
            destination={"/interiorroomparams"}
            Icon={FaGun}
            color={"violet.6"}
            variant={irpVariant}
          />

          <MemoNavIcon
            label={"Door Tuning"}
            destination={"/doortuning"}
            Icon={FaDoorOpen}
            color={"violet.6"}
            variant={doorTuningVariant}
          /> */}
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
