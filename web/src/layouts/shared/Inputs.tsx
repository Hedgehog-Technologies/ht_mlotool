import { InputVariant, TextInput, ThemeIcon, Tooltip } from "@mantine/core";
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
  setValue?: (value: number) => void;
  precision?: number;
  min?: number;
  max?: number;
  hideControls?: boolean;
}

interface StringInputProps extends InputProps {
  value?: string;
  setValue?: (value: string) => void;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  return(<></>)
}

const StringInput: React.FC<StringInputProps> = (props) => {
  const variant = props.inputVariant ?? props.disabled ? 'filled' : 'default';
  const arrowSize = props.icArrow !== false ? (props.icArrowSize ?? 10) : undefined;
  const multiline = props.icMultiline ?? true;

  return (
    <TextInput
      value={props.value ?? '[missing value]'}
      // $TECH_DEBT - Revisit for debouncing?
      onChange={(e) => { if (props.setValue !== undefined) props.setValue(e.target.value)}}
      label={props.label}
      disabled={props.disabled}
      variant={variant}
      rightSection={
        props.infoCircle && (
          <Tooltip
            label={props.infoCircle}
            withArrow={props.icArrow ?? true}
            arrowSize={arrowSize}
            multiline={multiline}
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

export const MemoNumberInput = React.memo(NumberInput);
export const MemoStringInput = React.memo(StringInput);
