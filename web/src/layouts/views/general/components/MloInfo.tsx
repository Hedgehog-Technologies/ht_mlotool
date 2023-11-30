import { Box, Title } from "@mantine/core";
import { MemoStringInput } from "../../../shared/Inputs";

const MloInfo: React.FC = () => {
  return (
    <Box>
      <Title order={4}>General MLO Info</Title>
      <Box py={5}>
        <MemoStringInput 
          label="MLO Save File Name"
          infoCircle="Name of the file to save the MLO information out to"
        />
      </Box>
    </Box>
  );
};

export default MloInfo;
