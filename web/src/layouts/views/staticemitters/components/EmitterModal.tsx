import { ActionIcon, Button, Divider, Group, Modal, NumberInput, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { LuLocate } from "react-icons/lu";
import { DefaultStaticEmitter, useEmitterStore, useSharedStore } from "@/stores";
import { fetchNui } from "@/utils";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { Vector3 } from "@/types";

interface Props {
  opened: boolean;
  setOpened: (value: boolean) => void;
}

export const EmitterModal: React.FC<Props> = (props) => {
  const [opacity, setOpacity] = useSharedStore((state) => [state.opacity, state.setOpacity]);
  const [emitters, addEmitter] = useEmitterStore((state) => [state.emitters, state.addEmitter]);
  const [emitterIndex, setEmitterIndex] = useEmitterStore((state) => [state.emitterIndex, state.setEmitterIndex]);
  const [title, setTitle] = useState("Create New Emitter");

  const form = useForm({
    initialValues: DefaultStaticEmitter,
    validate: {
      name: (value) => (!value.length ? "Name is required" : null),
      position: (value) => (/^((-?\d+(\.\d+)?)(, )?){3}$/).test(value) ? null : "Invalid position"
    }
  });

  useEffect(() => {
    if (emitterIndex > -1) {
      setTitle("Edit Emitter");
      form.setValues(emitters[emitterIndex]);
    }
    else {
      setTitle("Create New Emitter");
      form.reset();
    }
  }, [emitterIndex]);

  const handleSubmit = form.onSubmit((values) => {
    if (emitterIndex > -1) {
      emitters[emitterIndex] = values;
    } else {
      addEmitter(values);
    }

    form.reset();
    props.setOpened(false);
    setEmitterIndex(-1);
  });

  const handlePlacement = () => {
    console.log("place emitter");
    setOpacity(0);
    let formPos = form.values.position.split(", ", 3).map((val) => Number(val));
    let position: Vector3 | null;

    if (formPos.length < 3 || (emitterIndex === -1 && !form.isDirty("position"))) {
      position = null;
    }
    else {
      position = { x: formPos[0], y: formPos[1], z: formPos[2] };
    }

    fetchNui("ht_mlotool:setEmitterPosition", { position: position });
  };

  useNuiEvent("ht_mlotool:returnEmitterPosition", (data: { position: Vector3}) => {
    form.setValues({ position: `${data.position.x.toFixed(2)}, ${data.position.y.toFixed(2)}, ${data.position.z.toFixed(2)}`})
    setOpacity(1);
  });

  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      title={title}
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
      overflow={"inside"}
      centered
      styles={{ title: { textAlign: "center", width: "100%", fontSize: 18 } }}
      style={{ opacity: opacity }}
      size={"40%"}
    >
      <Paper p={"md"}>
        <form onSubmit={handleSubmit}>
          <Group mt={"md"} grow>
            <TextInput label={"Name"} {...form.getInputProps("name")} />
            <TextInput label={"Flags"} {...form.getInputProps("flags")} />
          </Group>


          <Group mt={"md"} grow>
            <TextInput label={"Interior"} {...form.getInputProps("interior")} />
            <TextInput label={"Room"} {...form.getInputProps("room")} />
            <TextInput
              label={"Position"}
              {...form.getInputProps("position")}
              rightSection={
                <ActionIcon variant={"filled"} color={"violet.6"} onClick={handlePlacement}>
                  <LuLocate size={20} />
                </ActionIcon>
              }
            />
          </Group>

          <Divider mt={"md"} />

          <Group mt={"md"} grow>
            <TextInput label={"ChildSound"} {...form.getInputProps("childSound")} />
            <TextInput label={"RadioStation"} {...form.getInputProps("radioStation")} />
          </Group>

          <Group mt={"md"} grow>
            <TextInput label={"Alarm"} {...form.getInputProps("alarm")} />
            <TextInput label={"On Break One Shot"} {...form.getInputProps("onBreakOneShot")} />
          </Group>

          <Group mt={"md"} grow>
            <NumberInput label={"Broken Health"} hideControls min={0.0} max={1.0} precision={2} {...form.getInputProps("brokenHealth")} />
            <NumberInput label={"Undamaged Health"} hideControls min={0.0} max={1.0} precision={2} {...form.getInputProps("undamagedHealth")} />
          </Group>

          <Group mt={"md"} grow>
            <NumberInput label={"Start Time (min)"} hideControls min={0} max={1440} {...form.getInputProps("minTimeMinutes")} />
            <NumberInput label={"End Time (min)"} hideControls min={0} max={1440} {...form.getInputProps("maxTimeMinutes")} />
          </Group>

          <Divider mt={"md"} />

          <Group mt={"md"} grow>
            <NumberInput label={"Min Distance"} hideControls {...form.getInputProps("minDistance")} />
            <NumberInput label={"Max Distance"} hideControls {...form.getInputProps("maxDistance")} />
            <NumberInput label={"Emitted Volume"} hideControls {...form.getInputProps("emittedVolume")} />
          </Group>

          <Group mt={"md"} grow>
            <NumberInput label={"LPF Cutoff"} hideControls min={0} {...form.getInputProps("lpfCutoff")} />
            <NumberInput label={"HPF Cutoff"} hideControls min={0} {...form.getInputProps("hpfCutoff")} />
            <NumberInput label={"Rolloff Factor"} hideControls min={0} {...form.getInputProps("rolloffFactor")} />
          </Group>

          <Group mt={"md"} grow>
            <NumberInput label={"Max Leakage"} hideControls min={0.0} max={1.0} precision={2} {...form.getInputProps("maxLeakage")} />
            <NumberInput label={"Min Leakage Dist"} hideControls min={0} {...form.getInputProps("minLeakageDistance")} />
            <NumberInput label={"Max Leakage Dist"} hideControls min={0} {...form.getInputProps("maxLeakageDistance")} />
          </Group>

          <Group mt={"md"} grow>
            <NumberInput label={"Small Reverb"} hideControls min={0} {...form.getInputProps("smallReverbSend")} />
            <NumberInput label={"Medium Reverb"} hideControls min={0} {...form.getInputProps("mediumReverbSend")} />
            <NumberInput label={"Large Reverb"} hideControls min={0} {...form.getInputProps("largeReverbSend")} />
          </Group>

          <Group mt={"lg"} position="right">
            <Button onClick={() => { console.log("cancel!"); props.setOpened(false); setEmitterIndex(-1); }} color={"gray.7"}>Cancel</Button>
            <Button onClick={() => console.log("submit!")} type={"submit"}>Submit</Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  );
}
