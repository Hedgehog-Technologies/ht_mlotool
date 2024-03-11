import { Checkbox, Group, InputVariant, MantineSize, NumberInput, Switch, TextInput, ThemeIcon, Tooltip, createStyles } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import React from "react";
import { BsQuestionCircle } from "react-icons/bs";
import { useLocale, useVisibility } from "@/providers";

interface InputProps {
  label?: string;
  disabled?: boolean;
  inputVariant?: InputVariant
  infoCircle?: string;
  icArrow?: boolean;
  icArrowSize?: number;
  icMultiline?: boolean;
  icWidth?: number;
  iconSize?: number;
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
  placeholder?: string;
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
  const variant = props.inputVariant ?? props.disabled ? "filled" : "default";
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;

  return(
    <NumberInput
      value={props.value ?? -1}
      precision={props.precision}
      min={props.min}
      max={props.max}
      step={props.step}
      // $TECH_DEBT - Revist for debouncing
      onChange={(value) => { if (props.setValue !== undefined) props.setValue(value)}}
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
            width={props.icWidth ?? 200}
          >
            <ThemeIcon color={"violet.6"} variant="outline" mr={10}>
              <BsQuestionCircle size={props.iconSize ?? 18} />
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
  const variant = props.inputVariant ?? props.disabled ? "filled" : "default";
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;

  return (
    <Tooltip
      label={props.ttDisable ?? props.value}
      disabled={props.ttDisable ?? props.value === ""}
      openDelay={props.ttOpenDelay ?? 750}
      withinPortal
    >
      <TextInput
        value={props.value ?? `[${locale("ui_missing_value")}]`}
        // $TECH_DEBT - Revisit for debouncing?
        onChange={(e) => { if (props.setValue !== undefined) props.setValue(e.target.value)}}
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
              width={props.icWidth ?? 200}
            >
              <ThemeIcon color={"violet.6"} variant="outline">
                <BsQuestionCircle size={props.iconSize ?? 18} />
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
            width={props.icWidth ?? 200}
          >
            <ThemeIcon radius="xl" variant="outline" size={16}>
              <BsQuestionCircle size={props.iconSize ?? 14}/>
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
            width={props.icWidth ?? 200}
          >
            <ThemeIcon radius="xl" variant="outline" size={16}>
              <BsQuestionCircle size={props.iconSize ?? 14} />
            </ThemeIcon>
          </Tooltip>
        )
      }
    </Group>
  );
}

export const MemoNumberInput = React.memo(NumInput);
export const MemoStringInput = React.memo(StringInput);
export const MemoTooltipCheckbox = React.memo(TooltipCheckbox);
export const MemoTooltipSwitch = React.memo(TooltipSwitch);
