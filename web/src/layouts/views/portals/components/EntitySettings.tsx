import { Center, Checkbox, Switch, Text, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { MemoNumberInput } from "@/layouts/shared";
import { useVisibility } from "@/providers";
import { useGeneralStore, usePortalsStore } from "@/stores";
import { fetchNui } from "@/utils";

interface Props {
  portalIndex: number;
  entityIndex: number;
}

export const EntitySettings: React.FC<Props> = (props) => {
  const exitUi = useVisibility((state) => state.exitUI);
  const mlo = useGeneralStore((state) => state.mlo);
  const [debugEntities, addDebugEntity] = usePortalsStore((state) => [state.debugEntities, state.addDebugEntity])
  const [activeEntity, setActiveEntity] = useState(mlo?.portals[props.portalIndex].entities[props.entityIndex]);
  let key = `${props.portalIndex}:${props.entityIndex}`;

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

  const handleDebugToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!debugEntities || !key) return;

    addDebugEntity(key, e.currentTarget.checked);
    fetchNui("ht_mlotool:debugEntityToggle", { portalIndex: props.portalIndex, entityIndex: props.entityIndex, debug: e.currentTarget.checked }, "1")
  }

  return (
    <tr>
      <td>
        <Tooltip
          label={activeEntity?.modelName ?? ""}
          openDelay={500}
          disabled={activeEntity === undefined}
        >
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
            onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
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
            onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
          />
        </Center>
      </td>
      <td>
        <Center>
          <Switch
            size="xs"
            checked={(debugEntities && key) ? debugEntities[key] : false}
            onChange={handleDebugToggle}
            onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
          />
        </Center>
      </td>
    </tr>
  );
};
