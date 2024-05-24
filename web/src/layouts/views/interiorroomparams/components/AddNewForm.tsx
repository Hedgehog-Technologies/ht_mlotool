import { Button, Grid, Group, NumberInput, Paper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useLocale } from "@/providers";
import { useIRPStore } from "@/stores";

export const AddNewForm: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const [params, addParam] = useIRPStore((state) => [state.params, state.addParam]);
  const setAddNew = useIRPStore((state) => state.setAddNew);
  const [formError, setFormError] = useState("");

  const form = useForm({
    initialValues: { name: "", unk01: 1.0, unk02: 1.0, unk03: 24000, unk04: 0, unk05: 0.0 },
    validate: {
      name: (value) => {
        if (!value.length) return locale("ui_irp_form_error_name_too_short");
        if (params.find(val => val.name === value)) return locale("ui_irp_form_error_name_exists");
        return null;
      }
    }
  });

  const handleSubmit = () => {
    const formValues = form.values;
    const nameValid = form.validateField("name");

    if (!nameValid.hasError) {
      var found = params.find(val => (
        val.unk01 === formValues.unk01
        && val.unk02 === formValues.unk02
        && val.unk03 === formValues.unk03
        && val.unk04 === formValues.unk04
        && val.unk05 === formValues.unk05));

      if (found) {
        setFormError(locale("ui_irp_form_error_values_exist", [ found.name ]));
      }
      else {
        addParam({ ...formValues, isDefault: false });
        setFormError("");
        form.reset();
        setAddNew(false);
      }
    }
  }

  return (
    <Paper withBorder>
      <Grid p ={10}>
        <Grid.Col span={4}>
          <TextInput label={locale("ui_irp_form_name")} {...form.getInputProps("name")} size="xs" />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={locale("ui_irp_form_unk01")} precision={2} step={0.1} min={0.0} max={1.0} {...form.getInputProps("unk01")} size="xs" />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={locale("ui_irp_form_unk02")} precision={2} step={0.1} min={0.0} max={1.0} {...form.getInputProps("unk02")} size="xs" />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={locale("ui_irp_form_unk03")} {...form.getInputProps("unk03")} size="xs" />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={locale("ui_irp_form_unk04")} {...form.getInputProps("unk04")} size="xs" />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput label={locale("ui_irp_form_unk05")} precision={2} step={0.1} {...form.getInputProps("unk05")} size="xs" />
        </Grid.Col>
      </Grid>

      <Group p={10} position="right">
        <Text color={"red"}>{formError}</Text>
        <Button w={"6rem"} onClick={handleSubmit}>Save</Button>
        <Button w={"6rem"} onClick={() => { form.reset(); setFormError(""); setAddNew(false); }}>Cancel</Button>
      </Group>
    </Paper>
  );
}
