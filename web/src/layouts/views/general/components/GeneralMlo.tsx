import { Box, Stack, Title } from "@mantine/core"
import MloInfo from "./MloInfo"
import { MemoStringInput } from "../../../shared/Inputs"

const GeneralMlo: React.FC = () => {
  return(
    <Stack>
      <Title order={4}>General MLO Information</Title>

      <Box p={5}>
        <Title order={5} pb={10}>Save File Name</Title>
        <MemoStringInput
          infoCircle="Name of the file to save the MLO information out to"
        />
      </Box>

      <MloInfo />
    </Stack>
  )
}

export default GeneralMlo;
