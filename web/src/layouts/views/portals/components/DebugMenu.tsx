import { ActionIcon, Menu, Switch } from "@mantine/core";
import { useEffect } from "react";
import { FaGear } from "react-icons/fa6";
import { usePortalsStore } from "../../../../store/portals";
import { fetchNui } from "../../../../utils/fetchNui";

const DebugMenu: React.FC = () => {
  const [enableOutline, enableFill, enableInfo, navigatedPortal] = usePortalsStore((state) => [state.enablePortalOutline, state.enablePortalFill, state.enablePortalInfo, state.navigatedPortal]);
  const toggleSwitch = usePortalsStore((state) => state.toggleSwitch);

  useEffect(() => {
    fetchNui("ht_mlotool:debugDrawToggle", { info: enableInfo, outline: enableOutline, fill: enableFill, navigate: navigatedPortal }, "1");
  }, [enableInfo, enableOutline, enableFill]);

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <FaGear fontSize={20}/>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Debug Toggles</Menu.Label>
        <Menu.Item
          component={Switch}
          closeMenuOnClick={false}
          label={"Draw Portal Info"}
          checked={enableInfo ?? false}
          onChange={() => toggleSwitch("enablePortalInfo")}
        />
        <Menu.Item
          component={Switch}
          closeMenuOnClick={false}
          label={"Draw Portal Outline"}
          checked={enableOutline ?? false}
          onChange={() => toggleSwitch("enablePortalOutline")}
        />
        <Menu.Item
          component={Switch}
          closeMenuOnClick={false}
          label={"Draw Portal Fill"}
          checked={enableFill ?? false}
          onChange={() => toggleSwitch("enablePortalFill")}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default DebugMenu;
