import { ActionIcon, Button, Group, Paper, ScrollArea, Stack, Table, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { EmitterModal } from "./components";
import { useSharedStore, useEmitterStore } from "@/stores";

export const StaticEmitters: React.FC = () => {
  const setIgnoreEscape = useSharedStore((state) => state.setIgnoreEscape);
  const emitters = useEmitterStore((state) => state.emitters);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    setIgnoreEscape(modalOpened);
  }, [modalOpened]);

  const sortedEmitters = useMemo(() => {
    let sortableEmitters = [...emitters];

    sortableEmitters.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }

      return 0;
    });

    return sortableEmitters;
  }, [emitters]);

  return (
    <>
      <EmitterModal opened={modalOpened} setOpened={setModalOpened} />

      <Stack>
        <Group position="apart">
          <Title order={4}>{"Static Emitters"}</Title>
          <Button onClick={() => setModalOpened(true)}>{"Add New"}</Button>
        </Group>

        <ScrollArea style={{ height: "67vh" }}>
          <Paper>
            <Table striped highlightOnHover withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>{"Name"}</th>
                  <th>{"Location"}</th>
                  <th style={{ width: "15%"}} />
                </tr>
              </thead>
              <tbody>
                {sortedEmitters.map((emitter, idx) => (
                  <tr key={`emitter.${emitter.name}.${idx}`}>
                    <td>{emitter.name}</td>
                    <td>{emitter.position}</td>
                    <td align={"center"}>
                      <Group position={"center"}>
                        <ActionIcon size={18} onClick={() => console.log("edit")}>
                          <MdModeEdit />
                        </ActionIcon>

                        <ActionIcon size={18} onClick={() => console.log("delete")}>
                          <FaTrashCan />
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Paper>
        </ScrollArea>
      </Stack>
    </>
  );
}
