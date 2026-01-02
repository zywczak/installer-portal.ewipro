import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  breakpoints: {
    // values: {
    //   xs: 0,
    //   sm: 480,
    //   md: 768,
    //   lg: 1024,
    //   xl: 1440,
    // },
  },
  palette: {
    // primary: {
    //   main: "#E2B420",
    //   light: "#EACF78",
    //   dark: "#9E581E",
    //   contrastText: "#FFFFFF",
    // },
    secondary: {
      main: "#418E44",
      light: "#418e446a",
      dark: "#2C612E",
      contrastText: "#fffffF"
    },
    tertiary: {
      main: "#8c969b",
      light: "#bbc8cf7e",
      dark: "#3E4345",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#D32F2F",
      light: "#EF5350",
      dark: "#B71C1C",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    divider: "#BDBDBD",
  },
});
