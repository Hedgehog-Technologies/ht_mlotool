import { Group, Header, Title } from "@mantine/core";
import { AiFillGithub, AiOutlineClose } from "react-icons/ai";
import { fetchNui } from "../../utils/fetchNui";
import TooltipIcon from "./shared/TooltipIcon";

const MloHeader: React.FC = () => {
  return (
    <Header height='5%'>
      <Group p={'0.5%'} px={'2.5%'} position='apart'>
        <Title order={4}>MLO Tool</Title>
        <Title order={3}>{'CURRENT MLO'}</Title>
        <TooltipIcon
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
