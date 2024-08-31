import { ActionIcon, Button, Divider, Group, InputBase, Modal, NumberInput, Paper, RangeSlider, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { LuLocate } from "react-icons/lu";
import { DefaultStaticEmitter, StaticEmitter, useEmitterStore } from "@/stores";

interface Props {
  opened: boolean;
  setOpened: (value: boolean) => void;
}

export const EmitterModal: React.FC<Props> = (props) => {
  const modalIndex = useEmitterStore((state) => state.modalIndex);
  const addEmitter = useEmitterStore((state) => state.addEmitter);
  let title = "Create New Emitter";

  const form = useForm({
    initialValues: DefaultStaticEmitter,
    validate: {
      name: (value) => (!value.length ? "Name is required" : null),
      position: (value) => (/^((-?\d+(\.\d+)?)(,? *)){3}$/).test(value) ? null : "Invalid position"
    }
  });

  useEffect(() => {
    if (modalIndex > -1) {
      title = "Edit Emitter";
    }
    else {
      title = "Create New Emitter";
    }
  }, [modalIndex]);

  const handleSubmit = form.onSubmit((values) => {
    addEmitter(values);
    form.reset();
    props.setOpened(false);
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
      size={"40%"}
    >
      <Paper p={"md"}>
        <form onSubmit={handleSubmit}>
          <Group mt={"md"} grow>
            <TextInput label={"Name"} {...form.getInputProps("name")} />
            <TextInput label={"Flags"} {...form.getInputProps("flags")} />
          </Group>

          <TextInput
            mt={"md"}
            label={"Position"}
            {...form.getInputProps("position")}
            rightSection={
              <ActionIcon variant={"filled"} color={"violet.6"} onClick={() => console.log("place emitter")}>
                <LuLocate size={20} />
              </ActionIcon>
            }
          />

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
            <Button onClick={() => { console.log("cancel!"); props.setOpened(false) }} color={"gray.7"}>Cancel</Button>
            <Button onClick={() => console.log("submit!")} type={"submit"}>Submit</Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  );
}
