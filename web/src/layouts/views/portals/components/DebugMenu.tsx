import { ActionIcon, Menu, Switch } from "@mantine/core";
import { FaGear } from "react-icons/fa6";

const DebugMenu: React.FC = () => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <FaGear fontSize={20}/>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Debug Toggles</Menu.Label>
        <Menu.Item component={Switch} label='Draw Portal Info' closeMenuOnClick={false} />
        <Menu.Item component={Switch} label='Draw Portal Outline' closeMenuOnClick={false} />
        <Menu.Item component={Switch} label='Draw Portal Fill' closeMenuOnClick={false} />
      </Menu.Dropdown>
    </Menu>
  );
};

export default DebugMenu;
