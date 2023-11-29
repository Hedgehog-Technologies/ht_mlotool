import { Navbar, Stack } from "@mantine/core";
import TooltipIcon from "./shared/TooltipIcon";
import { AiFillHome } from "react-icons/ai";

const Nav: React.FC = () => {
  return (
    <Navbar
      width={{ base: '12%' }}
      p='md'
      fixed={false}
      sx = {{ height: '80%' }}
    >
      <Navbar.Section grow>
        <Stack justify='center' align='center' spacing={5}>
          <TooltipIcon
            label='General'
            Icon={AiFillHome}
            color={'violet.6'}
            onClick={() => console.log('go home')}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
