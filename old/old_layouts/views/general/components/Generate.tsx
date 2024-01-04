import { Button, Center } from "@mantine/core";
import { useState } from "react";
import { useGeneralStore } from "../../../../store/general";
import { fetchNui } from "../../../../utils/fetchNui";
import { useRoomsStore } from "../../../../store/rooms";

const Generate: React.FC = () => {
  const mlo = useGeneralStore((state) => state.mlo);
  const roomList = useRoomsStore((state) => state.roomList);
  const debug = useGeneralStore((state) => state.enableDebug);
  const audioOcclusion = useGeneralStore((state) => state.enableAudioOcclusion);
  const data151 = useGeneralStore((state) => state.enableDat151);
  const [color, setColor] = useState('blue');
  const [buttonText, setButtonText] = useState('Generate Audio Occlusion Files')

  const SetButton = (newColor: string | null, newText: string | null) => {
    if (newColor !== null) setColor(newColor);
    if (newText !== null) setButtonText(newText);
  }

  const ResetButton = () => {
    SetButton('blue', 'Generate Audio Occlusion Files');
  }

  const handleSubmit = () => {
    if (data151 || audioOcclusion) {
      let combinedMLO = { ...mlo, rooms: roomList };
      fetchNui('ht_mlotool:generateAudioFiles', { mlo: combinedMLO, generateOcclusion: audioOcclusion, generateDat151: data151, debug: debug });
      SetButton('green', 'Audio Occlusion File(s) Generated');
      setTimeout(ResetButton, 5000);
    } else {
      SetButton('red', 'Either Audio Occlusion or Dat151 Generation Must Be Enabled')
      setTimeout(ResetButton, 5000)
    }
  };

  return (
    <Center p={16}>
      <Button color={color} uppercase onClick={handleSubmit} fullWidth>{buttonText}</Button>
    </Center>
  );
};

export default Generate;
