import { Checkbox, Group, InputVariant, NumberInput, TextInput, ThemeIcon, Tooltip, createStyles } from "@mantine/core";
import React from "react";
import { BsQuestionCircle } from "react-icons/bs";

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
  hideControls?: boolean;
}

interface StringInputProps extends InputProps {
  value?: string;
  setValue?: (value: string) => void;
}

interface TooltipCheckboxProps extends InputProps {
  value?: boolean;
  setValue?: (value: boolean) => void;
}

const useInputStyles = createStyles((theme) => ({
  disabledInput: {
    '&:disabled, &[data-disabled]': {
      opacity: 1.0,
      color: theme.colors.violet[1],
      borderColor: 'transparent',
    }
  }
}));

const NumInput: React.FC<NumberInputProps> = (props) => {
  const { classes } = useInputStyles();
  const variant = props.inputVariant ?? props.disabled ? 'filled' : 'default';
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;

  return(
    <NumberInput
      value={props.value ?? -1}
      precision={props.precision}
      min={props.min}
      max={props.max}
      // $TECH_DEBT - Revist for debouncing
      onChange={(value) => { if (props.setValue !== undefined) props.setValue(value)}}
      label={props.label}
      disabled={props.disabled}
      variant={variant}
      classNames={{ input: classes.disabledInput }}
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
    />
  );
}

const StringInput: React.FC<StringInputProps> = (props) => {
  const { classes } = useInputStyles();
  const variant = props.inputVariant ?? props.disabled ? 'filled' : 'default';
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;

  return (
    <TextInput
      value={props.value ?? '[missing value]'}
      // $TECH_DEBT - Revisit for debouncing?
      onChange={(e) => { if (props.setValue !== undefined) props.setValue(e.target.value)}}
      label={props.label}
      disabled={props.disabled}
      variant={variant}
      classNames={{ input: classes.disabledInput }}
      rightSection={
        props.infoCircle && (
          <Tooltip
            label={props.infoCircle}
            withArrow={props.icArrow ?? true}
            arrowSize={arrowSize}
            multiline={props.icMultiline ?? true}
            width={props.icWidth ?? 200}
          >
            <ThemeIcon color={'violet.6'} variant="outline">
              <BsQuestionCircle size={props.iconSize ?? 18} />
            </ThemeIcon>
          </Tooltip>
        )
      }
    />
  );
};

const TooltipCheckbox: React.FC<TooltipCheckboxProps> = (props) => {
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;

  return (
    <Group spacing={8} align='center'>
      <Checkbox
        label={props.label}
        checked={props.value}
        onChange={(e) => { if (props.setValue !== undefined) props.setValue(e.currentTarget.checked) }}
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

export const MemoNumberInput = React.memo(NumInput);
export const MemoStringInput = React.memo(StringInput);
export const MemoTooltipCheckbox = React.memo(TooltipCheckbox);
