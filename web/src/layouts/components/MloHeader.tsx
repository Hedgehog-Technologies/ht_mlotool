import { Group, Header, Title } from "@mantine/core";
import { AiFillGithub, AiOutlineCloseSquare } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { MemoHeaderIcon } from "./HeaderIcon";
import { useLocale, useVisibility } from "@/providers";
import { useGeneralStore } from "@/stores/general";

export const MloHeader: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const mlo = useGeneralStore((state) => state.mlo);
  const exitUI = useVisibility((state) => state.exitUI);

  const openUrl = (url: string) => {
    let w = window as any;
    w.invokeNative ? w.invokeNative("openUrl", url) : window.open(url);
  }

  const handleGithubClick = () => openUrl("https://github.com/hedgehog-technologies/ht_mlotool");
  const handleDiscordClick = () => openUrl("https://discord.gg/zrQvYAuBsk");

  return (
    <Header height={"5vh"}>
      <Group p="1%" px="2.5%" h={"100%"} position="apart" sx={{ alignContent: "center" }}>
        <Title order={4} color={"violet.1"}>MLO Tool</Title>
        <Title order={3} color={"violet.1"}>{mlo?.saveName.toUpperCase() ?? locale("ui_save_name_unknown")}</Title>
        <Group>
          <MemoHeaderIcon
            label={locale("ui_open_discord")}
            Icon={BsDiscord}
            iconSize={24}
            color={"violet.6"}
            onClick={handleDiscordClick}
          />
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
