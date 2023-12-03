import { MantineThemeOverride } from "@mantine/core";

const radius = '10px';
const themeBackgroundColor = 'rgba(10, 10, 10, 0.90)';

export const customTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'violet',
  cursorType: 'pointer',
  fontFamily: 'Roboto',
  components: {
    Header: {
      styles: {
        root: {
          backgroundColor: themeBackgroundColor,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius
        }
      }
    },

    AppShell: {
      styles: {
        main: {
          backgroundColor: themeBackgroundColor,
          borderBottomRightRadius: radius
        }
      }
    },

    Navbar: {
      styles: {
        root: {
          backgroundColor: themeBackgroundColor,
          borderBottomLeftRadius: radius
        }
      }
    },

    Tooltip: {
      defaultProps: {
        transition: 'pop',
      },
    },

    Input: {
      styles: {
        input: {
          color: '#E5DBFF',
          borderColor: '#5C5F66'
        }
      }
    },
  }
};
