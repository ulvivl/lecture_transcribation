import { createTheme, Theme, ThemeOptions } from "@mui/material/styles"
import { MuiButton } from "./components/MuiButton"

export const mainTheme: Theme = createTheme(<ThemeOptions & { border: { r1: Record<string, string> } }>{
  breakpoints: {
    values: {
      xx: 0,
      xs: 560,
      sm: 768,
      md: 1040,
      lg: 1440,
      xl: 1920
    }
  },
  palette: {
    primary: {
      main: "#6f64e9"
    },
    secondary: {
      main: "#e1e1e9"
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
    customGray: {
      gray1: "#E1E1E9",
      gray2: "#8f93a3",
    },
    success: {
      main: '#50C878',
    },
    text: {
      primary: "#3F5368",
      secondary: "#8f93a3"
    }
  },
  typography: {
    fontFamily: "Onest",
    h1: {
      fontSize: "40px",
      fontStyle: "normal",
      fontWeight: 800,
      lineHeight: "44px",
      color: "#3F5368"
    },
    h2: {
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "24px",
      color: "#3F5368"
    },
    h3: {
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "20px",
      color: "#3F5368"
    },
    body1: {
      fontSize: "16px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "20px",
      color: "#3F5368"
    },
    body2: {
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "20px",
      color: "#3F5368"
    },
    body3: {
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "20px",
      color: "#3F5368"
    }
  },
  border: {
    r1: {
      borderRadius: "16px"
    }
  },
  components: {
    MuiButton
  }
})

declare module "@mui/material/styles" {
  interface PaletteColor {
    darkest?: string
    lightest?: string
    lightest2?: string
    gray1?: string
    gray2?: string
    heavyMetal?: string
  }

  interface Palette {
    customGray: Palette["primary"]
  }

  interface PaletteOptions {
    customGray: PaletteOptions["primary"]
  }
}
