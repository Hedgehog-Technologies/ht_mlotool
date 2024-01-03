import { Checkbox } from "@mantine/core";
import { MemoNumberInput } from "../../../shared/Inputs";

const EntitySettings: React.FC = () => {
  return (
    <tr>
      <td>-2051651622</td>
      <td>
        <MemoNumberInput
          value={0.7}
          precision={3}
          min={0.0}
          max={1.0}
          step={0.1}
        />
      </td>
      <td><Checkbox /></td>
      <td><Checkbox /></td>
    </tr>
  );
};

export default EntitySettings;