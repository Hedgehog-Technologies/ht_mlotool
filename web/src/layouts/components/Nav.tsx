import { ActionIconVariant, Navbar, Stack } from "@mantine/core";
import { AiFillHome } from "react-icons/ai";
import { FaDoorOpen } from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import NavIcon from "./NavIcon";
import { useState } from "react";

const Nav: React.FC = () => {
  const [generalVariant, setGeneralVariant] = useState<ActionIconVariant>();
  const [roomsVariant, setRoomsVariant] = useState<ActionIconVariant>();
  const [portalsVariant, setPortalsVariant] = useState<ActionIconVariant>();

  const onNavPress = (dest: 'general' | 'rooms' | 'portals') => {
    setGeneralVariant(undefined);
    setRoomsVariant(undefined);
    setPortalsVariant(undefined);

    if (dest === 'general') {
      setGeneralVariant('filled');
    }
    else if (dest === 'rooms') {
      setRoomsVariant('filled');
    }
    else if (dest === 'portals') {
      setPortalsVariant('filled');
    }
  }

  return (
    <Navbar
      height={800}
      width={{ base: '10%' }}
      p='md'
      fixed={false}
    >
      <Navbar.Section grow>
        <Stack justify='center' align='center' spacing={5}>
          <NavIcon
            label={'General'}
            destination={'/'}
            Icon={AiFillHome}
            color={'violet.6'}
            variant={generalVariant}
            onClick={() => { console.log('go home'); onNavPress('general') }}
          />

          <NavIcon 
            label={'Rooms'}
            destination={'/rooms'}
            Icon={IoCubeSharp}
            color={'violet.6'}
            variant={roomsVariant}
            onClick={() => { console.log('go rooms'); onNavPress('rooms') }}
          />

          <NavIcon 
            label={'Portals'}
            destination={'/portals'}
            Icon={FaDoorOpen}
            color={'violet.6'}
            variant={portalsVariant}
            onClick={() => { console.log('go portals'); onNavPress('portals') }}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
