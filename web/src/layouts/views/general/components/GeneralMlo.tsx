import { Box, Stack, Title } from "@mantine/core"
import { useEffect, useState } from "react"
import MloInfo from "./MloInfo"
import { MemoStringInput } from "../../../shared/Inputs"
import { useLocale } from "../../../../providers/LocaleProvider"
import { useGeneralStore } from "../../../../store/general"

const GeneralMlo: React.FC = () => {
  const locale = useLocale((state) => state.locale);
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
      <Title order={4}>{locale("ui_general_info")}</Title>

      <Box p={5}>
        <Title order={5} pb={10}>{locale("ui_save_name")}</Title>
        <MemoStringInput
          value={mloSaveName ?? ""}
          setValue={(value: string) => setMLOSaveName(value)}
          infoCircle={locale("ui_save_name_info")}
        />
      </Box>

      <MloInfo />
    </Stack>
  )
}

export default GeneralMlo;
