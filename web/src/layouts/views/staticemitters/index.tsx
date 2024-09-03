import { ActionIcon, Button, Group, Modal, Paper, ScrollArea, Stack, Table, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { useSharedStore, useEmitterStore } from "@/stores";
import { EmitterModal } from "./components";

export const StaticEmitters: React.FC = () => {
  const setIgnoreEscape = useSharedStore((state) => state.setIgnoreEscape);
  const [emitters, removeEmitter] = useEmitterStore((state) => [state.emitters, state.removeEmitter]);
  const setEmitterIndex = useEmitterStore((state) => state.setEmitterIndex);
  const [modalOpened, setModalOpened] = useState(false);

  const [confirmDeleteOpened, setConfirmDeleteOpened] = useState(false);
  const [toBeDeletedEmitter, setToBeDeletedEmitter] = useState({ name: "???", position: "???" });

  const closeConfirmDelete = () => {
    setIgnoreEscape(false);
    setConfirmDeleteOpened (false);
    setToBeDeletedEmitter({ name: "???", position: "???" });
  }

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
  }, [emitters, ...emitters.map(emitter => [emitter.name, emitter.position])]);

  return (
    <>
      <EmitterModal opened={modalOpened} setOpened={setModalOpened} />

      <Modal
        opened={confirmDeleteOpened}
        onClose={closeConfirmDelete}
        title={"Delete Emitter?"}
        withCloseButton={false}
        closeOnClickOutside={false}
        styles={{ title: { textAlign: "center", width: "100%", fontSize: 18 } }}
      >
        <Stack>
          <Text>Are you sure that you want to delete emitter named:</Text>
          <Text fw={700}>{toBeDeletedEmitter.name}</Text>
          <Text>Located At:</Text>
          <Text fw={700}>{toBeDeletedEmitter.position}</Text>
        </Stack>
        <Group position={"right"} spacing={10}>
          <Button onClick={closeConfirmDelete} color={"gray.7"} mr={3}>
            {"Cancel"}
          </Button>
          <Button onClick={() => { removeEmitter(toBeDeletedEmitter.name); closeConfirmDelete(); }}>
            {"Confirm"}
          </Button>
        </Group>
      </Modal>

      <Stack>
        <Group position="apart">
          <Title order={4}>{"Static Emitters"}</Title>
          <Button onClick={() => setModalOpened(true) }>{"Add New"}</Button>
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
                        <ActionIcon
                          size={18}
                          onClick={() => {
                            setEmitterIndex(emitter.name);
                            setModalOpened(true);
                            console.log(`edit ${idx}`);
                          }}
                          children={<MdModeEdit />}
                        />

                        <ActionIcon
                          size={18}
                          onClick={() => {
                            setIgnoreEscape(true);
                            setToBeDeletedEmitter({ name: emitter.name, position: emitter.position });
                            setConfirmDeleteOpened(true);
                            console.log(`delete ${idx}`);
                          }}
                          children={<FaTrashCan />}
                        />
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
