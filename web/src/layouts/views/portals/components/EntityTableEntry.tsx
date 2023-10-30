import { Checkbox, NumberInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGeneralStore } from "../../../../store/general";

interface Props {
  portalIndex: number;
  entityIndex: number;
}

// $TODO - Edit to use mlo portal list instead of room portal lists

const EntityTableEntry: React.FC<Props> = ({ portalIndex, entityIndex }) => {
  const mlo = useGeneralStore((state) => state.mlo);
  const [activeEntity, setActiveEntity] = useState(mlo?.portals[portalIndex].entities[entityIndex]);

  let timer: NodeJS.Timeout;
  useEffect(() => {
    clearTimeout(timer);
    if (mlo === null) return;

    timer = setTimeout(() => {
      if (activeEntity !== undefined) {
        mlo.SetPortalEntity(portalIndex, entityIndex, activeEntity);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeEntity])

  return (
    <tr key={`${portalIndex}.${entityIndex}`}>
      <td>{activeEntity?.modelName ?? ''}</td>
      <td>
        <NumberInput
          value={activeEntity?.maxOcclusion ?? 0}
          onChange={(value) => {
            if (activeEntity !== undefined) { 
              setActiveEntity({ ...activeEntity, maxOcclusion: (value as number) });
            }
          }}
          precision={3}
          min={0.0}
          max={1.0}
          step={0.1}
        />
      </td>
      <td>
        <Checkbox
          checked={activeEntity?.isDoor ?? false}
          onChange={(e) => {
            if (activeEntity !== undefined) {
              setActiveEntity({ ...activeEntity, isDoor: e.currentTarget.checked });
            }
          }}
        />
      </td>
      <td>
        <Checkbox
          checked={activeEntity?.isGlass ?? false}
          onChange={(e) => {
            if (activeEntity !== undefined) {
              setActiveEntity({ ...activeEntity, isGlass: e.currentTarget.checked });
            }
          }}
        />
      </td>
    </tr>
  );
};

export default EntityTableEntry;