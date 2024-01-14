import { ActionIcon, Menu } from "@mantine/core";
import { useEffect } from "react";
import { FaGear } from "react-icons/fa6";
import { MemoTooltipSwitch } from "../../../shared/Inputs";
import { useLocale } from "../../../../providers/LocaleProvider";
import { usePortalsStore } from "../../../../store/portals";
import { fetchNui } from "../../../../utils/fetchNui";

const DebugMenu: React.FC = () => {
  const locale = useLocale((state) => state.locale);
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
        <Menu.Label>{locale("ui_portal_debug")}</Menu.Label>
        <Menu.Item
          component={MemoTooltipSwitch}
          closeMenuOnClick={false}
          label={locale("ui_portal_debug_draw_info")}
          value={enableInfo ?? false}
          setValue={() => toggleSwitch("enablePortalInfo")}
        />
        <Menu.Item
          component={MemoTooltipSwitch}
          closeMenuOnClick={false}
          label={locale("ui_portal_debug_draw_outline")}
          value={enableOutline ?? false}
          setValue={() => toggleSwitch("enablePortalOutline")}
        />
        <Menu.Item
          component={MemoTooltipSwitch}
          closeMenuOnClick={false}
          label={locale("ui_portal_debug_draw_fill")}
          value={enableFill ?? false}
          setValue={() => toggleSwitch("enablePortalFill")}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default DebugMenu;
