import { Box, Checkbox, Grid, NumberInput, TextInput, ThemeIcon, Tooltip } from "@mantine/core";
import { BsQuestionCircle } from "react-icons/bs";

interface Props {
  label: string | undefined;
  inputType: 'text' | 'number' | 'checkbox';
  value: string | number | boolean;
  setValue?: (value: any) => void;
  infoCircle?: string;
  span?: number;
  disabled?: boolean;
  variant?: 'unstyled' | 'default' | 'filled';
  required?: boolean;
  precision?: number;
  min?: number;
  max?: number;
  error?: string | boolean;
}

const Input: React.FC<Props> = ({ label, inputType, infoCircle, span, value, setValue, disabled, variant, required, precision, min, max, error }) => {
  const valueType = typeof value;
  return (
    <Grid.Col span={span || 1}>
      <Box>
        {(valueType === 'string' || inputType === 'text') ? (
          <TextInput
            value={value !== undefined ? value.toString() : 'missing value'}
            onChange={(e) => { if (setValue !== undefined) setValue(e.target.value); }}
            label={label}
            disabled={disabled}
            variant={variant ?? disabled ? 'filled' : 'default'}
            withAsterisk={required || false}
            required={required || false}
            error={error}
            rightSection={
              infoCircle && (
                <Tooltip label={infoCircle} withArrow arrowSize={10} multiline width={200}>
                  <ThemeIcon variant='light'>
                    <BsQuestionCircle size={18} />
                  </ThemeIcon>
                </Tooltip>
              )
            }
          />
        ) : (valueType === 'number' || inputType === 'number') ? (
          <NumberInput
            label={label}
            precision={precision || 0}
            max={max || undefined}
            min={min || undefined}
            value={Number(value)}
            onChange={(value) => { if (setValue !== undefined) setValue(value as number); }}
            disabled={disabled}
            variant={variant ?? disabled ? 'filled' : 'default'}
            withAsterisk={required || false}
            error={error}
            hideControls
            rightSection={
              infoCircle && (
                <Tooltip label={infoCircle} withArrow arrowSize={10} multiline width={200}>
                  <ThemeIcon variant='light' mr={10}>
                    <BsQuestionCircle size={18} />
                  </ThemeIcon>
                </Tooltip>
              )
            }
          />
        ) : (
          <Checkbox
            label={label}
            checked={Boolean(value)}
            onChange={(e) => { if (setValue !== undefined) setValue(e.currentTarget.checked); }}
            disabled={disabled}
          />
        )}
      </Box>
    </Grid.Col>
  )
};

export default Input;
