import { Navbar, Stack } from "@mantine/core";
import { AiFillHome } from "react-icons/ai";
import { FaDoorOpen } from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import NavIcon from "./NavIcon";

const Nav: React.FC = () => {
  return (
    <Navbar
      height={800}
      width={{ base: '12%' }}
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
            onClick={() => console.log('go home')}
          />

          <NavIcon 
            label={'Rooms'}
            destination={'/rooms'}
            Icon={IoCubeSharp}
            color={'violet.6'}
            onClick={() => console.log('go rooms')}
          />

          <NavIcon 
            label={'Portals'}
            destination={'/portals'}
            Icon={FaDoorOpen}
            color={'violet.6'}
            onClick={() => console.log('go portals')}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
