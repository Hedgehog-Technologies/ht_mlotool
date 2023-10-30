import { Box, Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGeneralStore } from "../../../../store/general";
import { useRoomsStore } from "../../../../store/rooms";
import Input from "../../shared/Input";

const Info: React.FC = () => {
  const mlo = useGeneralStore((state) => state.mlo);
  const dat151 = useGeneralStore((state) => state.enableDat151);
  const roomList = useRoomsStore((state) => state.roomList);
  const [mloSaveName, setMLOSaveName] = useState(mlo?.saveName ?? '');

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (mlo === null) return;

    timer = setTimeout(() => {
      const trimmedName = mloSaveName.trim();
      mlo.saveName = trimmedName;
    }, 1000);

    return () => clearTimeout(timer);
  }, [mloSaveName]);

  useEffect(() => {
    if (mlo === null) return;
    setMLOSaveName(mlo.saveName);
  }, [mlo]);

  return (
    <Box>
      <Grid columns={2} gutter='xs' sx={{ fontSize: 16, overflow: 'auto', maxHeight: 385 }}>
        <Input
          label='MLO Save Name'
          inputType='text'
          span={2}
          value={mloSaveName ?? ''}
          setValue={(value: string) => setMLOSaveName(value)}
          infoCircle='Name of the file to save the MLO information out to'
        />
        <Input
          label='Unsigned Name Hash'
          inputType='number'
          value={mlo?.uintNameHash ?? 0}
          disabled={true}
          infoCircle='MLO Archetype Name represented as an Unsigned Int32'
        />
        <Input
          label='Signed Name Hash'
          inputType='number'
          value={mlo?.nameHash ?? 0}
          disabled={true}
          infoCircle='MLO Archetype Name represented as a Signed Int32'
        />
        <Input
          label='Unsigned Proxy Hash'
          inputType='number'
          value={mlo?.uintProxyHash ?? 0}
          disabled={true}
          infoCircle='Proxy Hash represented as an Unsigned Int32.'
        />
        <Input
          label='Signed Proxy Hash'
          inputType='number'
          value={mlo?.proxyHash ?? 0}
          disabled={true}
          infoCircle='Proxy Hash represented as a Signed Int32.'
        />
        <Input
          label='Interior Id'
          inputType='number'
          value={mlo?.interiorId ?? -1}
          disabled={true}
          infoCircle='Interior Id found for the current MLO'
        />
        <Input
          label='MLO Location'
          inputType='text'
          value={mlo?.locationString === undefined ? '0.0, 0.0, 0.0' : mlo.locationString}
          disabled={true}
          infoCircle='Location found for the current MLO'
        />
        <Input
          label='Number of Rooms'
          inputType='number'
          value={mlo?.rooms.length ?? 0}
          disabled={true}
          infoCircle='Number of rooms found for current MLO'
        />
        <Input
          label='Number of Portals'
          inputType='number'
          value={mlo?.portals.length ?? 0}
          disabled={true}
          infoCircle='Number of portals found for current MLO'
        />
      </Grid>
    </Box>
  );
};

export default Info;
