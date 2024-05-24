import { Button, Collapse, Stack } from "@mantine/core";
import { useIRPStore } from "@/stores";
import { AddNewForm, Header, IRPTable } from "./components";


export const InteriorRoomParams: React.FC = () => {
  const addNew = useIRPStore((state) => state.addNew);
  const toggleEditMode = useIRPStore((state) => state.toggleEditMode);

  return (
    <Stack h={"71vh"}>
      <Header />

      <Collapse in={addNew}>
        <AddNewForm />
      </Collapse>

      <IRPTable />

      <Button onClick={toggleEditMode}>Toggle Edit Mode</Button>
    </Stack>
  );
}
