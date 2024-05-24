import { ActionIcon, Button, Group, Modal, NumberInput, Paper, ScrollArea, Stack, Table, Text, TextInput, Tooltip, createStyles, useMantineTheme } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp, FaTrashCan } from "react-icons/fa6";
import { IRP, isEquivalentIRP, useIRPStore } from "@/stores";
import { MdModeEdit, MdSave } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MemoNumberInput, MemoStringInput } from "@/layouts/shared";

const useStyles = createStyles((theme) => ({
  Table: {
    borderCollapse: "separate",
    borderSpacing: 0
  },

  Header: {
    "th:first-of-type": {
      borderLeft: `1px solid ${theme.colors.dark[4]} !important`
    }
  },

  HeaderCell: {
    borderTop: `1px solid ${theme.colors.dark[4]} !important`,
    borderBottom: `1px solid ${theme.colors.dark[4]} !important`,
    borderRight: `1px solid ${theme.colors.dark[4]} !important`,
    backgroundColor: theme.colors.dark[8],
    position: "sticky",
    top: 0,
    zIndex: 101
  },

  Body: {
    "td": {
      userSelect: "text",
      borderBottom: `1px solid ${theme.colors.dark[4]} !important`,
      borderRight: `1px solid ${theme.colors.dark[4]} !important`
    },

    "td:first-of-type": {
      borderLeft: `1px solid ${theme.colors.dark[4]} !important`
    },

    "tr:nth-of-type(odd)": {
      backgroundColor: theme.colors.dark[6]
    },

    "tr:nth-of-type(even)": {
      backgroundColor: theme.colors.dark[7]
    },

    "tr:hover": {
      backgroundColor: theme.colors.dark[4]
    }
  }
}));

export const IRPTable: React.FC = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const editMode = useIRPStore((state) => state.editMode);
  const params = useIRPStore((state) => state.params);
  const searchTerm = useIRPStore((state) => state.searchTerm);
  const [editParam, removeParam] = useIRPStore((state) => [state.editParam, state.removeParam]);
  const [sortConfig, setSortConfig] = useState<{ key: string, index: number, direction: string } | null>(null);
  const [editRowIndex, setEditRowIndex] = useState(-1);
  const [rowOrigData, setRowOrigData] = useState<IRP | null>(null);
  const [rowEditData, setRowEditData] = useState<IRP | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [toBeDeletedRow, setToBeDeletedRow] = useState<{index: number, name: string}>({ index: -1, name: "" });

  useEffect(() => {
    if (!editMode) {
      setEditRowIndex(-1);
    }
  }, [editMode])

  const sortedParams = useMemo(() => {
    let sortableParams = [...params];

    if (sortConfig !== null){
      sortableParams.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }

        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        return 0;
      });
    }

    return sortableParams;
  }, [params, sortConfig]);

  const checkParam = (param: IRP) => {
    if (editMode) {
      return !param.isDefault;
    }
    else {
      for (const key in param) {
        let value = param[key].toString().toLowerCase();
        let includesIndex = 0;

        if (key === "name" && value.startsWith("hash_")) {
          includesIndex = 5;
        }

        if (value.includes(searchTerm.toString().toLowerCase(), includesIndex)) {
          return true;
        }
      }
    }

    return false;
  }

  const requestSort = (key: string, index: number) => {
    if (editMode) return;

    let direction = "ascending";

    if (sortConfig !== null) {
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
    }

    setSortConfig({ key, index, direction });
  }

  const getIcon = (index: number) => {
    if (editMode) return null;
    if (sortConfig !== null && sortConfig.index === index) {
      return sortConfig.direction === "ascending"
        ? <FaSortUp />
        : <FaSortDown />;
    }

    return <FaSort />;
  }

  const resetRowEdits = () => {
    setRowEditData(null);
    setRowOrigData(null);
    setEditRowIndex(-1);
  }

  const saveRowEdits = () => {
    if (rowOrigData !== null && rowEditData !== null){
      if (!isEquivalentIRP(rowOrigData, rowEditData)) {
        let index = params.findIndex((param) => param.name === rowOrigData.name);
        editParam(index, rowEditData);
      }
    }

    resetRowEdits();
  }

  const editRow = (index: number) => {
    let row = Object.assign({}, params[index]);
    setRowOrigData(row);
    setRowEditData(Object.assign({}, row));
    setEditRowIndex(index);
  }

  const confirmDeleteRow = (index: number) => {
    var baseIndex = params.findIndex((param) => param.name === sortedParams[index].name);
    setToBeDeletedRow({ index: baseIndex, name: sortedParams[index].name });
    setConfirmDeleteOpen(true);
  }

  const deleteRow = () => {
    if (toBeDeletedRow.index >= 0) {
      removeParam(toBeDeletedRow.index);
    }

    closeConfirmDelete();
  }
  
  const closeConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    setToBeDeletedRow({ index: -1, name: "" });
  }

  return (
    <ScrollArea>
      <Paper>
        <Modal
          opened={confirmDeleteOpen}
          onClose={closeConfirmDelete}
          title="Confirm Delete"
        >
          <Stack>
            <Text>Are you sure that you want to delete parameter with name:</Text>
            <Text fw={700}>{toBeDeletedRow.name}</Text>
            <Group position={"right"} spacing={10}>
              <Button uppercase variant={"default"} onClick={closeConfirmDelete} mr={3}>
                Cancel
              </Button>
              <Button uppercase variant={"light"} color={theme.primaryColor} onClick={deleteRow}>
                Confirm
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Table h={"100%"} fontSize={"xs"} className={classes.Table}>
          <thead className={classes.Header}>
            <tr>
              {editMode && <th style={{ width: "12.5%" }} className={classes.HeaderCell} />}
                <th style={{ width: "20%" }} className={classes.HeaderCell} onClick={() => requestSort("name", 0)}>
                  <Tooltip
                    label={"Name of the configuration"}
                    withArrow
                    arrowSize={10}
                    openDelay={500}
                  >
                    <Group position={"apart"}>
                      Name
                      {getIcon(0)}
                    </Group>
                  </Tooltip>
                </th>
              <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk01", 1)}>
                <Tooltip
                  label={"(Wetness) How processed audio will be. Range: 0.0 - 1.0"}
                  withArrow
                  arrowSize={10}
                  openDelay={500}
                >
                  <Group position={"apart"}>
                    Unk01
                    {getIcon(1)}
                  </Group>
                </Tooltip>
              </th>
              <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk02", 2)}>
                <Tooltip
                  label={"(Visibility) Volume level of audio. Range: 0.0 - 1.0"}
                  withArrow
                  arrowSize={10}
                  openDelay={500}
                >
                  <Group position={"apart"}>
                    Unk02
                    {getIcon(2)}
                  </Group>
                </Tooltip>
              </th>
              <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk03", 3)}>
                <Tooltip
                  label={"(LowPassFilter) Filter to remove high-frequency sounds."}
                  withArrow
                  arrowSize={10}
                  openDelay={500}
                >
                  <Group position={"apart"}>
                    Unk03
                    {getIcon(3)}
                  </Group>
                </Tooltip>
              </th>
              <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk04", 4)}>
                <Tooltip
                  label={"(PreDelay) Time between end of initial sound and beginning of first reflection."}
                  withArrow
                  arrowSize={10}
                  openDelay={500}
                >
                  <Group position={"apart"}>
                    Unk04
                    {getIcon(4)}
                  </Group>
                </Tooltip>
              </th>
              <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk05", 5)}>
                <Tooltip
                  label={"(Hold) How long to keep sound effect around once audio is finished."}
                  withArrow
                  arrowSize={10}
                  openDelay={500}
                >
                  <Group position={"apart"}>
                    Unk05
                    {getIcon(5)}
                  </Group>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody className={classes.Body}>
            {sortedParams
              .filter((param) => (!searchTerm.length && !editMode) || checkParam(param))
              .map((param, idx) => (
                <tr key={`irp.${param.name}.${idx}`}>
                  {editMode &&
                    <td>
                      {editRowIndex === idx
                        ? <Group position={"center"} onClick={saveRowEdits}>
                          <ActionIcon size={18}>
                            <MdSave />
                          </ActionIcon>

                          <ActionIcon size={18} onClick={resetRowEdits}>
                            <IoClose />
                          </ActionIcon>
                        </Group>
                        : <Group position={"center"}>
                          <ActionIcon size={18} onClick={() => editRow(idx)}>
                            <MdModeEdit />
                          </ActionIcon>

                          <ActionIcon size={18} onClick={() => confirmDeleteRow(idx)}>
                            <FaTrashCan />
                          </ActionIcon>
                        </Group>}
                    </td>}
                  {editRowIndex === idx
                    ? <>
                      <td>
                        <MemoStringInput
                          value={rowEditData!.name}
                          setValue={(val: string) => setRowEditData({ ...rowEditData!, name: val })}
                        />
                      </td>
                      <td>
                        <MemoNumberInput
                          value={rowEditData!.unk01}
                          setValue={(val: number | undefined) => setRowEditData({ ...rowEditData!, unk01: (val ?? 0) })}
                          precision={2}
                          min={0.0}
                          max={1.0}
                          hideControls
                        />
                      </td>
                      <td>
                        <MemoNumberInput
                          value={rowEditData!.unk02}
                          setValue={(val: number | undefined) => setRowEditData({ ...rowEditData!, unk02: (val ?? 0) })}
                          precision={2}
                          min={0.0}
                          max={1.0}
                          hideControls
                        />
                      </td>
                      <td>
                        <MemoNumberInput
                          value={rowEditData!.unk03}
                          setValue={(val: number | undefined) => setRowEditData({ ...rowEditData!, unk03: (val ?? 0) })}
                          hideControls
                        />
                      </td>
                      <td>
                        <MemoNumberInput
                          value={rowEditData!.unk04}
                          setValue={(val: number | undefined) => setRowEditData({ ...rowEditData!, unk04: (val ?? 0) })}
                          hideControls
                        />
                      </td>
                      <td>
                        <MemoNumberInput
                          value={rowEditData!.unk05}
                          setValue={(val: number | undefined) => setRowEditData({ ...rowEditData!, unk05: (val ?? 0) })}
                          precision={2}
                          hideControls
                        />
                      </td>
                    </>
                    : <>
                      <td>{param.name}</td>
                      <td>{param.unk01}</td>
                      <td>{param.unk02}</td>
                      <td>{param.unk03}</td>
                      <td>{param.unk04}</td>
                      <td>{param.unk05}</td>
                    </>
                  }
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Paper>
    </ScrollArea>
  );
}
