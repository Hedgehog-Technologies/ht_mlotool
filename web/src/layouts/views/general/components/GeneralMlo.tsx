import { ActionIcon, Box, Flex, Stack, Title, Tooltip } from "@mantine/core"
import { useEffect, useState } from "react"
import { MdSave } from "react-icons/md";
import MloInfo from "./MloInfo"
import { MemoStringInput } from "@/layouts/shared/Inputs"
import { useLocale } from "@/providers/LocaleProvider"
import { useGeneralStore } from "@/store/general"
import { useRoomsStore } from "@/store/rooms";
import { fetchNui } from "@/utils/fetchNui";

const GeneralMlo: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const interior = useGeneralStore((state) => state.interior);
  const roomList = useRoomsStore((state) => state.roomList);
  const updateInteriorSaveName = useGeneralStore((state) => state.updateInteriorSaveName);
  const [mloSaveName, setMLOSaveName] = useState(interior?.saveName ?? "");

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (interior === null) return;

    timer = setTimeout(() => {
      const trimmedName = mloSaveName.trim();
      updateInteriorSaveName(trimmedName);
    }, 1000);

    return () => clearTimeout(timer);
  }, [mloSaveName]);

  useEffect(() => {
    if (interior === null) {
      setMLOSaveName("");
    } else {
      setMLOSaveName(interior.saveName);
    }
  }, [interior]);

  const handleSaveClick = () => {
    let combinedMLO = { ...interior, rooms: roomList };
    fetchNui("ht_mlotool:nui:saveMlo", combinedMLO, "1");
  }

  return(
    <Stack>
      <Title order={4}>{locale("ui_general_info")}</Title>

      <Box p={5}>
        <Title order={5} pb={10}>{locale("ui_save_name")}</Title>

        <Flex>
          <Box style={{ flexGrow: 1 }} pr={15} >
            <MemoStringInput
              value={mloSaveName ?? ""}
              setValue={(value: string) => setMLOSaveName(value)}
              infoCircle={locale("ui_save_name_info")}
            />
          </Box>

          <Tooltip label={locale("ui_save_mlo")} openDelay={250} >
            <ActionIcon variant={"filled"} color={"violet.9"} h={35} w={35} onClick={handleSaveClick}>
              <MdSave size={20} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Box>

      <MloInfo />
    </Stack>
  )
}

export default GeneralMlo;
