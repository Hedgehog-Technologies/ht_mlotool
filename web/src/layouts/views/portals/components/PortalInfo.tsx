import { Center, Checkbox, Divider, Group, Paper, Switch, Table, Title } from "@mantine/core";
import { MemoNumberInput } from "../../../shared/Inputs";
import EntitySettings from "./EntitySettings";

const PortalInfo: React.FC = () => {
  return (
    <Paper withBorder>
      <Group pt={5} px={15} align="flex-end" position="apart">
        <Title order={5}>{"0. Rm_garage [1] ↔ Rm_showroom [4]"}</Title>
        <Switch size={"xs"} label={"Point Towards"} labelPosition="left" />
      </Group>
      <Center py={10} px={15} >
        <Group>
          <Checkbox labelPosition="left" label={"[1] → [4] Enabled"} />
          <Divider orientation="vertical" />
          <Checkbox labelPosition="left" label={"[4] → [1] Enabled"} />
        </Group>
      </Center>
      <Center py={5} px={15}>
        <Table striped withColumnBorders withBorder fontSize='xs'>
          <thead>
            <tr>
              <th>Model</th>
              <th style={{ width: '20%' }}>Max Occlusion</th>
              <th style={{ width: '15%' }}>Is Door?</th>
              <th style={{ width: '15%' }}>Is Glass?</th>
            </tr>
          </thead>
          <tbody>
            <EntitySettings />
          </tbody>
        </Table>
      </Center>
    </Paper>
  );
};

export default PortalInfo;
