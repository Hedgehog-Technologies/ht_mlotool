import { ActionIconVariant, Navbar, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaDoorOpen } from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { MemoNavIcon } from "./NavIcon";

const Nav: React.FC = () => {
  const location = useLocation();
  const [generalVariant, setGeneralVariant] = useState<ActionIconVariant>();
  const [roomsVariant, setRoomsVariant] = useState<ActionIconVariant>();
  const [portalsVariant, setPortalsVariant] = useState<ActionIconVariant>();

  useEffect(() => {
    let path = location.pathname;
    setGeneralVariant(undefined);
    setRoomsVariant(undefined);
    setPortalsVariant(undefined);

    if (path === '/') {
      setGeneralVariant('filled');
    }
    else if (path === '/rooms') {
      setRoomsVariant('filled');
    }
    else if (path === '/portals') {
      setPortalsVariant('filled');
    }
  }, [location]);

  return (
    <Navbar
      height={800}
      width={{ base: '10%' }}
      p='md'
      fixed={false}
    >
      <Navbar.Section grow>
        <Stack justify='center' align='center' spacing={5}>
          <MemoNavIcon
            label={'General'}
            destination={'/'}
            Icon={AiFillHome}
            color={'violet.6'}
            variant={generalVariant}
          />

          <MemoNavIcon 
            label={'Rooms'}
            destination={'/rooms'}
            Icon={IoCubeSharp}
            color={'violet.6'}
            variant={roomsVariant}
          />

          <MemoNavIcon 
            label={'Portals'}
            destination={'/portals'}
            Icon={FaDoorOpen}
            color={'violet.6'}
            variant={portalsVariant}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
