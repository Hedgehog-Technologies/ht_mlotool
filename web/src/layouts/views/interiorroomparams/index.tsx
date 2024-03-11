import { ActionIcon, Button, Collapse, Grid, Group, NumberInput, Paper, ScrollArea, Stack, Table, Text, TextInput, Title, createStyles, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedState } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp, FaTrashCan } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdModeEdit, MdSave } from "react-icons/md";
import { IRP, useIRPStore } from "@/stores";

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
    "td":{
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
    },
  }
}));

export const InteriorRoomParams: React.FC = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [searchTerm, setSearchTerm] = useDebouncedState("", 200);
  const [searchValue, setSearchValue] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [params, addParam] = useIRPStore((state) => [state.params, state.addParam]);
  const [sortConfig, setSortConfig] = useState<{ key: string, index: number, direction: string } | null>(null);

  const sortedParams = useMemo(() => {
    let sortableParams = [...params];

    if (sortConfig !== null) {
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
  }, [params, sortConfig])

  const requestSort = (key: string, index: number) => {
    let direction = "ascending";

    if (sortConfig !== null) {
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
    }

    setSortConfig({ key, index, direction });
  }

  const getIcon = (index: number) => {
    if (sortConfig !== null && sortConfig.index === index) {
      return sortConfig.direction === "ascending"
        ? <FaSortUp />
        : <FaSortDown />;
    }

    return <FaSort />;
  }

  const checkParam = (param: IRP) => {
    if (editMode) {
      return !param.isDefault;
    } else {
      for (const key in param) {
        let value = param[key].toString().toLowerCase();
        let includesIndex = 0;
  
        if (key === "name" && value.startsWith("hash_")) {
          includesIndex = 5
        }
  
        if (value.includes(searchTerm.toString().toLowerCase(), includesIndex)) {
          return true;
        }
      }
    }

    return false;
  }

  const [formError, setFormError] = useState("");
  const form = useForm({
    initialValues: { name: "", unk01: 1.0, unk02: 1.0, unk03: 24000, unk04: 0, unk05: 0.0 },
    validate: {
      name: (value) => {
        if (!value.length) return "Name too short";
        if (params.find(val => val.name === value)) return "Name already exists";
        return null;
      }
    }
  })

  const handleSubmit = () => {
    const formValues = form.values;
    const nameValid = form.validateField("name");

    if (!nameValid.hasError) {
      var found = params.find(val => (
        val.unk01 === formValues.unk01
        && val.unk02 === formValues.unk02
        && val.unk03 === formValues.unk03
        && val.unk04 === formValues.unk04
        && val.unk05 === formValues.unk05));

      if (found) {
        setFormError(`"${found.name}" already has these values`)
      }
      else {
        addParam({...formValues, isDefault: false });
        setFormError("");
        form.reset();
      }
    }
  }

  const [editMode, setEditMode] = useState(false);
  const [editRow, setEditRow] = useState(-1);

  return (
    <Stack h={"71vh"}>
      <Group position={"apart"}>
        <Title order={4}>Interior Room Params</Title>
        <Group>
          <Button onClick={() => setAddNew((prev) => !prev)}>Add New...</Button>
          <TextInput
            placeholder={"Search..."}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
              setSearchTerm(e.currentTarget.value);
            }}
            rightSection={
              <ActionIcon
                color={"violet.6"}
                onClick={() => {
                  setSearchValue("");
                  setSearchTerm("");
                }}
              >
                <IoClose />
              </ActionIcon>
            }
            w={"8rem"}
          />
        </Group>
      </Group>

      <Collapse in={addNew}>
        <Paper withBorder>
          <Grid p={10}>
            <Grid.Col span={4}>
              <TextInput label="Name" {...form.getInputProps("name")} size="xs" />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Unk01" precision={2} step={0.1} {...form.getInputProps("unk01")} size="xs" />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Unk02" precision={2} step={0.1} {...form.getInputProps("unk02")} size="xs" />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Unk03" {...form.getInputProps("unk03")} size="xs" />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Unk04" {...form.getInputProps("unk04")} size="xs" />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Unk05" precision={2} step={0.1} {...form.getInputProps("unk05")} size="xs" />
            </Grid.Col>
          </Grid>
          <Group p={10} position="right">
            <Text color={"red"}>{formError}</Text>
            <Button w={"6rem"} onClick={handleSubmit}>Save</Button>
            <Button w={"6rem"} onClick={() => { form.reset(); setFormError(""); }}>Cancel</Button>
          </Group>
        </Paper>
      </Collapse>

      <ScrollArea>
        <Paper>
          <Table h={"100%"} fontSize={"xs"} className={classes.Table}>
            <thead className={classes.Header}>
              <tr>
                {editMode && <th style={{ width: "12.5%" }} className={classes.HeaderCell} />}
                <th style={{ width: "20%" }} className={classes.HeaderCell} onClick={() => requestSort("name", 0)}>
                  <Group position={"apart"}>
                    Name
                    {getIcon(0)}
                  </Group>
                </th>
                <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk01", 1)}>
                  <Group position={"apart"}>
                    Unk01
                    {getIcon(1)}
                  </Group>
                </th>
                <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk02", 2)}>
                  <Group position={"apart"}>
                    Unk02
                    {getIcon(2)}
                  </Group>
                </th>
                <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk03", 3)}>
                  <Group position={"apart"}>
                    Unk03
                    {getIcon(3)}
                  </Group>
                </th>
                <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk04", 4)}>
                  <Group position={"apart"}>
                    Unk04
                    {getIcon(4)}
                  </Group>
                </th>
                <th style={{ width: "13.5%" }} className={classes.HeaderCell} onClick={() => requestSort("unk05", 5)}>
                  <Group position={"apart"}>
                    Unk05
                    {getIcon(5)}
                  </Group>
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
                          {editRow === idx
                            ? <Group position="center">
                              <ActionIcon size={15}>
                                <MdSave />
                              </ActionIcon>

                              <ActionIcon size={15} onClick={() => setEditRow(-1)}>
                                <IoClose />
                              </ActionIcon>
                            </Group>
                            : <Group position="center">
                              <ActionIcon size={15} onClick={() => setEditRow(idx)}>
                                <MdModeEdit />
                              </ActionIcon>

                              <ActionIcon size={15}>
                                <FaTrashCan />
                              </ActionIcon>
                            </Group>}
                        </td>}
                    {editRow === idx
                      ? <><td><TextInput value={param.name} size="xs"/></td>
                      <td><NumberInput value={param.unk01} size="xs"/></td>
                      <td><NumberInput value={param.unk02} size="xs"/></td>
                      <td><NumberInput value={param.unk03} size="xs"/></td>
                      <td><NumberInput value={param.unk04} size="xs"/></td>
                      <td><NumberInput value={param.unk05} size="xs"/></td></>
                      : <><td>{param.name}</td>
                      <td>{param.unk01}</td>
                      <td>{param.unk02}</td>
                      <td>{param.unk03}</td>
                      <td>{param.unk04}</td>
                      <td>{param.unk05}</td></>
                    }
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </Paper>
      </ScrollArea>

      <Button onClick={() => setEditMode((prev) => { if (prev) setEditRow(-1); return !prev; })}>Edit Mode</Button>
    </Stack>
  );
}
