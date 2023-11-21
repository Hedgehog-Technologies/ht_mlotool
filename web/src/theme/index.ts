import { MantineThemeOverride } from "@mantine/core";

export const customTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  components: {
    Tooltip: {
      defaultProps: {
        transition: 'pop',
      },
    },
  },
  cursorType: 'pointer',
  fontFamily: 'Roboto'
};
