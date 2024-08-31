import { ActionIcon, Button, Group, Stack, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { EmitterModal } from "./components";
import { useSharedStore } from "@/stores/shared";

export const StaticEmitters: React.FC = () => {
  const setIgnoreEscape = useSharedStore((state) => state.setIgnoreEscape);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    setIgnoreEscape(modalOpened);
  }, [modalOpened]);

  return (
    <>
      <EmitterModal opened={modalOpened} setOpened={setModalOpened} />

      <Stack>
        <Group position="apart">
          <Title order={4}>{"Static Emitters"}</Title>
          <Button onClick={() => setModalOpened(true)}>{"Add New"}</Button>
        </Group>

        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>{"Name"}</th>
              <th>{"Location"}</th>
              <th style={{ width: "15%"}} />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{"Fake Emitter 1"}</td>
              <td>{"-1, -1, -1"}</td>
              <td align="center">
                <Group position="center" align="center">
                  <ActionIcon size={18} onClick={() => console.log("edit")}>
                    <MdModeEdit />
                  </ActionIcon>

                  <ActionIcon size={18} onClick={() => console.log("delete")}>
                    <FaTrashCan />
                  </ActionIcon>
                </Group>
              </td>
            </tr>
          </tbody>
        </Table>
      </Stack>
    </>
  );
}
