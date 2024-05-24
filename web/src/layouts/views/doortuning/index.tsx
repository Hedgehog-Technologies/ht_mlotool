import { useLocale } from "@/providers";
import { Stack, Title } from "@mantine/core";

export const DoorTuning: React.FC = () => {
  const locale = useLocale((state) => state.locale);

  return (
    <Stack>
      <Title order={1} align="center">{locale("ui_dt_coming_soon")}</Title>
      <Title order={4} align="center">{locale("ui_dt_pardon_dust")}</Title>
    </Stack>
  );
}
