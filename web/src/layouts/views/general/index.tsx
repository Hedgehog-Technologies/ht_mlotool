import { Box, Button, Stack } from "@mantine/core";
import { useState } from "react";
import { GenerationFileOptions, GeneralMlo, MloInfo } from "./components";
import { useLocale } from "@/providers";
import { useEmitterStore, useGeneralStore, useRoomsStore } from "@/stores";
import { fetchNui } from "@/utils";

export const General: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const [mlo, debug, ao, dat151] = useGeneralStore((state) => [state.mlo, state.enableDebug, state.enableAudioOcclusion, state.enableDat151]);
  const roomList = useRoomsStore((state) => state.roomList);
  const [color, setColor] = useState("violet.9");
  const [buttonText, setButtonText] = useState(locale("ui_generate_button_default"))

  const setButton = (newColor: string | null, newText: string | null) => {
    if (newColor !== null) setColor(newColor);
    if (newText !== null) setButtonText(newText);
  }

  const resetButton = () => {
    setButton("violet.9", locale("ui_generate_button_default"));
  }

  const handleButtonClick = () => {
    if (dat151 || ao) {
      let combinedMLO = { ...mlo, rooms: roomList, staticEmitters: useEmitterStore.getState().emitters };
      fetchNui("ht_mlotool:generateAudioFiles", { mlo: combinedMLO, generateOcclusion: ao, generateDat151: dat151, debug: debug });
      setButton("green.9", locale("ui_generate_button_success"));
      setTimeout(resetButton, 5000);
    } else {
      setButton("red.9", locale("ui_generate_button_fail"));
      setTimeout(resetButton, 5000);
    }
  }

  return (
    <Stack sx={{ height: "100%" }}>
      <Stack>
        <GeneralMlo />
        <MloInfo />
      </Stack>

      <GenerationFileOptions />

      <Box w={"100%"} py={"2%"}>
        <Button w={"100%"} color={color} uppercase onClick={handleButtonClick}>{buttonText}</Button>
      </Box>
    </Stack>
  );
};
