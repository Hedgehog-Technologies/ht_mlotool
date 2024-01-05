import { Center, Checkbox, Text, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { MemoNumberInput } from "../../../shared/Inputs";
import { useGeneralStore } from "../../../../store/general";

interface Props {
  portalIndex: number;
  entityIndex: number;
}

const EntitySettings: React.FC<Props> = (props) => {
  const mlo = useGeneralStore((state) => state.mlo);
  const [activeEntity, setActiveEntity] = useState(mlo?.portals[props.portalIndex].entities[props.entityIndex]);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (mlo === null) return;

    timer = setTimeout(() => {
      if (activeEntity !== undefined) {
        mlo.SetPortalEntity(props.portalIndex, props.entityIndex, activeEntity);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeEntity]);

  return (
    <tr>
      <td>
        <Tooltip label={activeEntity?.modelName ?? ""} openDelay={500} disabled={activeEntity === undefined}>
          <Text color={"violet.1"}>{activeEntity?.modelName ?? ""}</Text>
        </Tooltip>
      </td>
      <td>
        <MemoNumberInput
          value={activeEntity?.maxOcclusion ?? 0}
          setValue={(value) => {
            if (activeEntity !== undefined) {
              setActiveEntity({ ...activeEntity, maxOcclusion: (value ?? 0) });
            }
          }}
          precision={3}
          min={0.0}
          max={1.0}
          step={0.1}
        />
      </td>
      <td>
        <Center>
          <Checkbox
            checked={activeEntity?.isDoor ?? false}
            onChange={(e) => {
              if (activeEntity !== undefined) {
                setActiveEntity({ ...activeEntity, isDoor: e.currentTarget.checked });
              }
            }}
          />
        </Center>
      </td>
      <td>
        <Center>
          <Checkbox
            checked={activeEntity?.isGlass ?? false}
            onChange={(e) => {
              if (activeEntity !== undefined) {
                setActiveEntity({ ...activeEntity, isGlass: e.currentTarget.checked });
              }
            }}
          />
        </Center>
      </td>
    </tr>
  );
};

export default EntitySettings;