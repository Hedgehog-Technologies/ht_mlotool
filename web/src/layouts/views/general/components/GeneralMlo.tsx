import { Box, Stack, Title } from "@mantine/core"
import MloInfo from "./MloInfo"
import { MemoStringInput } from "../../../shared/Inputs"
import { useGeneralStore } from "../../../../store/general"
import { useEffect, useState } from "react"

const GeneralMlo: React.FC = () => {
  const mlo = useGeneralStore((state) => state.mlo);
  const updateMLOSaveName = useGeneralStore((state) => state.updateMLOSaveName)
  const [mloSaveName, setMLOSaveName] = useState(mlo?.saveName ?? "");

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (mlo === null) return;

    timer = setTimeout(() => {
      const trimmedName = mloSaveName.trim();
      updateMLOSaveName(trimmedName);
    }, 1000);

    return () => clearTimeout(timer);
  }, [mloSaveName]);

  useEffect(() => {
    if (mlo === null) {
      setMLOSaveName("");
    } else {
      setMLOSaveName(mlo.saveName);
    }
  }, [mlo]);

  return(
    <Stack>
      <Title order={4}>General MLO Information</Title>

      <Box p={5}>
        <Title order={5} pb={10}>Save File Name</Title>
        <MemoStringInput
          value={mloSaveName ?? ""}
          setValue={(value: string) => setMLOSaveName(value)}
          infoCircle="Name of the file to save the MLO information out to"
        />
      </Box>

      <MloInfo />
    </Stack>
  )
}

export default GeneralMlo;
