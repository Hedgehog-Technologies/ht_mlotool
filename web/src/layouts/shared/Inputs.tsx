import { Checkbox, createStyles, Group, InputVariant, MantineSize, NumberInput, Select, SelectItem, Switch, TextInput, ThemeIcon, Tooltip } from "@mantine/core";
import { getHotkeyHandler, useDebouncedValue } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { useLocale, useVisibility } from "@/providers";

interface InputProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  inputVariant?: InputVariant
  infoCircle?: string;
  icArrow?: boolean;
  icArrowSize?: number;
  icMultiline?: boolean;
  icWidth?: number | boolean;
  icSize?: number;
};

interface NumberInputProps extends InputProps {
  value?: number;
  setValue?: (value: number | undefined) => void;
  precision?: number;
  min?: number;
  max?: number;
  step?: number;
  hideControls?: boolean;
}

interface StringInputProps extends InputProps {
  value?: string;
  setValue?: (value: string) => void;
  ttDisable?: boolean;
  ttOpenDelay?: number;
}

interface TooltipCheckboxProps extends InputProps {
  value?: boolean;
  setValue?: (value: boolean) => void;
}

interface TooltipSwitchProps extends InputProps {
  value?: boolean;
  setValue: (value: boolean) => void;
  size?: MantineSize;
  labelPosition?: "left" | "right";
}

interface TooltipSelectProps extends InputProps {
  data: ReadonlyArray<string | SelectItem>;
  value?: string | null;
  setValue?: (value: string) => void;
  searchable?: boolean;
  allowDeselect?: boolean;
  clearable?: boolean;
  creatable?: boolean;
  getCreateLabel?: (query: string) => string;
  onCreate?: (query: string) => string;
}

const useInputStyles = createStyles((theme) => ({
  input: {
    "&:disabled, &[data-disabled]": {
      opacity: 1.0,
      color: theme.colors.violet[1],
      borderColor: "transparent",
    }
  }
}));

const NumInput: React.FC<NumberInputProps> = (props) => {
  const exitUi = useVisibility((state) => state.exitUI);
  const { classes } = useInputStyles();
  const [numValue, setNumValue] = useState(props.value ?? -1);
  const [debouncedNum] = useDebouncedValue(numValue, 200);
  const variant = props.inputVariant ?? props.disabled ? "filled" : "default";
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;
  const ttWidth = props.icWidth === true ? 200 : typeof(props.icWidth) === "number" ? props.icWidth : undefined;

  if (props.setValue !== undefined) {
    useEffect(() => {
      props.setValue!(debouncedNum);
    }, [debouncedNum]);
  }

  return(
    <NumberInput
      value={numValue}
      precision={props.precision}
      min={props.min}
      max={props.max}
      step={props.step}
      hideControls={props.hideControls}
      onChange={(val) => setNumValue(val ?? -1)}
      label={props.label}
      disabled={props.disabled}
      variant={variant}
      classNames={{ input: classes.input }}
      rightSection={
        props.infoCircle && (
          <Tooltip
            label={props.infoCircle}
            withArrow={props.icArrow ?? true}
            arrowSize={arrowSize}
            multiline={props.icMultiline ?? true}
            width={ttWidth}
          >
            <ThemeIcon color={"violet.6"} variant="outline" mr={10}>
              <BsQuestionCircle size={props.icSize ?? 18} />
            </ThemeIcon>
          </Tooltip>
        )
      }
      onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
    />
  );
}

const StringInput: React.FC<StringInputProps> = (props) => {
  const locale = useLocale((state) => state.locale);
  const exitUi = useVisibility((state) => state.exitUI);
  const { classes } = useInputStyles();
  const [strValue, setStrValue] = useState(props.value ?? `[${locale("ui_missing_value")}]`);
  const [debouncedStr] = useDebouncedValue(strValue, 200);
  const variant = props.inputVariant ?? props.disabled ? "filled" : "default";
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;
  const ttWidth = props.icWidth === true ? 200 : typeof(props.icWidth) === "number" ? props.icWidth : undefined;

  if (props.setValue !== undefined) {
    useEffect(() => {
      props.setValue!(debouncedStr);
    }, [debouncedStr]);
  }

  return (
    <Tooltip
      label={props.ttDisable ?? props.value}
      disabled={props.ttDisable ?? props.value === ""}
      openDelay={props.ttOpenDelay ?? 750}
      withinPortal
      withArrow={props.icArrow ?? true}
      arrowSize={arrowSize}
    >
      <TextInput
        value={strValue}
        onChange={(e) => { setStrValue(e.target.value)}}
        label={props.label}
        placeholder={props.placeholder}
        disabled={props.disabled}
        variant={variant}
        classNames={{ input: classes.input }}
        rightSection={
          props.infoCircle && (
            <Tooltip
              label={props.infoCircle}
              withArrow={props.icArrow ?? true}
              arrowSize={arrowSize}
              multiline={props.icMultiline ?? true}
              width={ttWidth}
              styles={(theme) => ({
                tooltip: {
                  border: `1px solid ${theme.colors.dark[3]}`
                },
    
                arrow: {
                  border: `1px solid ${theme.colors.dark[3]}`
                }
              })}
            >
              <ThemeIcon color={"violet.6"} variant="outline">
                <BsQuestionCircle size={props.icSize ?? 18} />
              </ThemeIcon>
            </Tooltip>
          )
        }
        onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
      />
    </Tooltip>
  );
};

const TooltipCheckbox: React.FC<TooltipCheckboxProps> = (props) => {
  const exitUi = useVisibility((state) => state.exitUI);
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;
  const ttWidth = props.icWidth === true ? 200 : typeof(props.icWidth) === "number" ? props.icWidth : undefined;

  return (
    <Group spacing={8} align="center">
      <Checkbox
        label={props.label}
        checked={props.value}
        onChange={(e) => { if (props.setValue !== undefined) props.setValue(e.currentTarget.checked) }}
        onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
      />
      {
        props.infoCircle && (
          <Tooltip
            label={props.infoCircle}
            withArrow={props.icArrow ?? true}
            arrowSize={arrowSize}
            multiline={props.icMultiline ?? true}
            width={ttWidth}
          >
            <ThemeIcon radius="xl" variant="outline" size={16}>
              <BsQuestionCircle size={props.icSize ?? 14}/>
            </ThemeIcon>
          </Tooltip>
        )
      }
    </Group>
  );
};

const TooltipSwitch: React.FC<TooltipSwitchProps> = (props) => {
  const exitUi = useVisibility((state) => state.exitUI);
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;
  const ttWidth = props.icWidth === true ? 200 : typeof(props.icWidth) === "number" ? props.icWidth : undefined;

  return (
    <Group spacing={8} align="center" p={5}>
      <Switch
        label={props.label}
        checked={props.value}
        onChange={(e) => { if (props.setValue !== undefined) props.setValue(e.currentTarget.checked) }}
        size={props.size}
        labelPosition={props.labelPosition}
        onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
      />
      {
        props.infoCircle && (
          <Tooltip
            label={props.infoCircle}
            withArrow={props.icArrow ?? true}
            arrowSize={arrowSize}
            multiline={props.icMultiline ?? true}
            width={ttWidth}
          >
            <ThemeIcon radius="xl" variant="outline" size={16}>
              <BsQuestionCircle size={props.icSize ?? 14} />
            </ThemeIcon>
          </Tooltip>
        )
      }
    </Group>
  );
}

const TooltipSelect: React.FC<TooltipSelectProps> = (props) => {
  const exitUi = useVisibility((state) => state.exitUI);
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;
  const ttWidth = props.icWidth === true ? 200 : typeof(props.icWidth) === "number" ? props.icWidth : undefined;

  return (
    <Select
      label={props.label}
      placeholder={props.placeholder}
      data={props.data}
      value={props.value}
      onChange={props.setValue}
      searchable={props.searchable}
      allowDeselect={props.allowDeselect}
      clearable={props.clearable}
      creatable={props.creatable}
      getCreateLabel={props.getCreateLabel}
      onCreate={props.onCreate}
      onKeyDown={getHotkeyHandler([["Escape", exitUi]])}
      rightSection={props.infoCircle && (
        <Tooltip
          label={props.infoCircle}
          withArrow={props.icArrow ?? true}
          arrowSize={arrowSize}
          multiline={props.icMultiline ?? true}
          width={ttWidth}
        >
          <ThemeIcon color={"violet.6"} variant="outline">
            <BsQuestionCircle size={props.icSize ?? 18} />
          </ThemeIcon>
        </Tooltip>
      )}
    />
  );
}

export const MemoNumberInput = React.memo(NumInput);
export const MemoStringInput = React.memo(StringInput);
export const MemoTooltipCheckbox = React.memo(TooltipCheckbox);
export const MemoTooltipSwitch = React.memo(TooltipSwitch);
export const MemoTooltipSelect = React.memo(TooltipSelect);
