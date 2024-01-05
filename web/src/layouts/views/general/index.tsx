import { Button, Stack } from "@mantine/core";
import { useState } from "react";
import GeneralMlo from "./components/GeneralMlo";
import GenerationFileOptions from "./components/GeneralFileOptions";
import { useGeneralStore } from "../../../store/general";
import { useRoomsStore } from "../../../store/rooms";
import { fetchNui } from "../../../utils/fetchNui";

const General: React.FC = () => {
  const [mlo, debug, ao, dat151] = useGeneralStore((state) => [state.mlo, state.enableDebug, state.enableAudioOcclusion, state.enableDat151]);
  const roomList = useRoomsStore((state) => state.roomList);
  const [color, setColor] = useState("violet.9");
  const [buttonText, setButtonText] = useState("Generate Audio Occlusion File(s)")

  const setButton = (newColor: string | null, newText: string | null) => {
    if (newColor !== null) setColor(newColor);
    if (newText !== null) setButtonText(newText);
  }

  const resetButton = () => {
    setButton("violet.9", "Generate Audio Occlusion File(s)");
  }

  const handleButtonClick = () => {
    if (dat151 || ao) {
      let combinedMLO = { ...mlo, rooms: roomList }
      fetchNui("ht_mlotool:generateAudioFiles", { mlo: combinedMLO, generateOcclusion: ao, generateDat151: dat151, debug: debug });
      setButton("green.9", "Audio Occlusion File(s) Generated");
      setTimeout(resetButton, 5000);
    } else {
      setButton("red.9", "Either Audio Occlusion or Dat151 Generation Must Be Enabled");
      setTimeout(resetButton, 5000);
    }
  }

  return (
    <Stack justify="space-between" sx={{ height: "100%" }}>
      <GeneralMlo />

      <GenerationFileOptions />

      <Button color={color} uppercase onClick={handleButtonClick}>{buttonText}</Button>
    </Stack>
  );
};

export default General;
