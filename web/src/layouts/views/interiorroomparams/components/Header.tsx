import { ActionIcon, Button, Group, TextInput, Title } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useLocale } from "@/providers";
import { useIRPStore } from "@/stores";

export const Header: React.FC = () => {
  const locale = useLocale((state) => state.locale);
  const [searchValue, setSearchValue] = useState("");
  const toggleAddNew = useIRPStore((state) => state.toggleAddNew);

  const setIrpSearchTerm = useIRPStore((state) => state.setSearchTerm);
  const [searchTerm, setSearchTerm] = useDebouncedState("", 200);

  useEffect(() => {
    setIrpSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <Group position={"apart"}>
      <Title order={4}>{locale("ui_irp_header_title")}</Title>
      
      <Group>
        <Button onClick={toggleAddNew}>{locale("ui_irp_header_add_new")}</Button>

        <TextInput
          placeholder={locale("ui_irp_header_search_placeholder")}
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
