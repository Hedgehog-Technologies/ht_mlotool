import { Divider, Stack } from "@mantine/core";
import Generate from "./components/Generate";
import Info from "./components/Info";
import Settings from "./components/Settings";

const General: React.FC = () => {
  return (
    <Stack justify='space-between' sx={{ height: '100%' }}>
      <Info />
      <Divider size='sm' />
      <Settings />
      <Divider size='sm' />
      <Generate />
    </Stack>
  )
};

export default General;
