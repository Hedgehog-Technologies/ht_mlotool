import { Button, Collapse, Stack, Title } from "@mantine/core";
import { useIRPStore } from "@/stores";
import { AddNewForm, Header, IRPTable } from "./components";
import { useLocale } from "@/providers";


export const InteriorRoomParams: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const addNew = useIRPStore((state) => state.addNew);
  const toggleEditMode = useIRPStore((state) => state.toggleEditMode);

  return (
    <Stack>
      <Title order={1} align="center">{locale("ui_dt_coming_soon")}</Title>
      <Title order={4} align="center">{locale("ui_dt_pardon_dust")}</Title>
    </Stack>
    // <Stack h={"71vh"}>
    //   <Header />

    //   <Collapse in={addNew}>
    //     <AddNewForm />
    //   </Collapse>

    //   <IRPTable />

    //   <Button onClick={toggleEditMode}>{locale("ui_irp_toggle_edit_mode")}</Button>
    // </Stack>
  );
}
