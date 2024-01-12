import { Group, Header, Title } from "@mantine/core";
import { AiFillGithub, AiOutlineCloseSquare } from "react-icons/ai";
import { MemoHeaderIcon } from "./HeaderIcon";
import { useLocale } from "../../providers/LocaleProvider";
import { useVisibility } from "../../providers/VisibilityProvider";
import { useGeneralStore } from "../../store/general";

const MloHeader: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const mlo = useGeneralStore((state) => state.mlo);
  const exitUI = useVisibility((state) => state.exitUI);

  const handleGithubClick = () => {
    const gh = "https://github.com/hedgehog-technologies/ht_mlotool";
    let w = window as any;
    w.invokeNative ? w.invokeNative("openUrl", gh) : window.open(gh);
  };

  return (
    // height left as empty string on purpose
    // height needs *some* value, but grows to size of content by default
    <Header height={""}>
      <Group p="1%" px="2.5%" position="apart" sx={{ alignContent: "center" }}>
        <Title order={4} color={"violet.1"}>MLO Tool</Title>
        <Title order={3} color={"violet.1"}>{mlo?.saveName.toUpperCase() ?? locale("ui_save_name_unknown")}</Title>
        <Group>
          <MemoHeaderIcon
            label={locale("ui_open_github")}
            Icon={AiFillGithub}
            iconSize={24}
            color={"violet.6"}
            onClick={handleGithubClick}
          />
          <MemoHeaderIcon
            label={locale("ui_close")}
            Icon={AiOutlineCloseSquare}
            iconSize={24}
            color={"violet.6"}
            onClick={exitUI}
          />
        </Group>
      </Group>
    </Header>
  );
};

export default MloHeader;
