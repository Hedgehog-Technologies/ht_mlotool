import { Group, Header, Title } from "@mantine/core";
import { AiFillGithub } from "react-icons/ai";
import { MemoHeaderIcon } from "./HeaderIcon";
import { useGeneralStore } from "../../store/general";
import { useEffect } from "react";

const MloHeader: React.FC = () => {
  const mlo = useGeneralStore((state) => state.mlo);

  const handleGithubClick = () => {
    const gh = "https://github.com/hedgehog-technologies/ht_mlotool";
    let w = window as any;
    w.invokeNative ? w.invokeNative('openUrl', gh) : window.open(gh);
  };

  return (
    // height left as empty string on purpose
    // height needs *some* value, but grows to size of content by default
    <Header height={''}>
      <Group p={'1%'} px={'2.5%'} position='apart' sx={{ alignContent: 'center'}}>
        <Title order={4}>MLO Tool</Title>
        <Title order={3}>{mlo?.saveName ?? 'UNKNOWN'}</Title>
        <MemoHeaderIcon
          label={'Open Github Repo'}
          Icon={AiFillGithub}
          iconSize={24}
          color={'violet.6'}
          onClick={handleGithubClick}
        />
      </Group>
    </Header>
  );
};

export default MloHeader;
