import { ActionIcon, Button, Group, TextInput, Title } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useIRPStore } from "@/stores";

export const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const toggleAddNew = useIRPStore((state) => state.toggleAddNew);

  const setIrpSearchTerm = useIRPStore((state) => state.setSearchTerm);
  const [searchTerm, setSearchTerm] = useDebouncedState("", 200);

  useEffect(() => {
    setIrpSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <Group position={"apart"}>
      <Title order={4}>Interior Room Params</Title>
      
      <Group>
        <Button onClick={toggleAddNew}>Add New...</Button>

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
  );
}
