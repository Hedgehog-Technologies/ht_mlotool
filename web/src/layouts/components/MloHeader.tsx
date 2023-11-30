import { Group, Header, Title } from "@mantine/core";
import { AiFillGithub, AiOutlineClose } from "react-icons/ai";
import { fetchNui } from "../../utils/fetchNui";
import HeaderIcon from "./HeaderIcon";

const MloHeader: React.FC = () => {
  return (
    // height left as empty string on purpose
    // height needs *some* value, but grows to size of content by default
    <Header height={''}>
      <Group p={'1%'} px={'2.5%'} position='apart' sx={{ alignContent: 'center'}}>
        <Title order={4}>MLO Tool</Title>
        <Title order={3}>{'CURRENT MLO'}</Title>
        <HeaderIcon
          label={'Open Github Repo'}
          Icon={AiFillGithub}
          iconSize={24}
          color={'violet.6'}
          onClick={() => fetchNui('ht_mlotool:openBrowser', { url: 'https://github.com/hedgehog-technologies/ht_mlotool' })}
        />
      </Group>
    </Header>
  );
};

export default MloHeader;
