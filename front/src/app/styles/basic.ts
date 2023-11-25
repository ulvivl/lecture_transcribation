import { mainTheme } from "@app/styles/mainTheme"

export const basic = {
  '*, *::before, &::after': {
    wordWrap: 'normal',

    boxSizing: 'border-box',
    '-webkit-tap-highlight-color': 'transparent',
  },
  'html, body': {
    minHeight: '100vh',
  },
}

export const scrollStyles = {
  ":hover": {
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: mainTheme.palette.customGray.gray1
    }
  },
  "&::-webkit-scrollbar": {
    width: "5px",
    height: "5px"
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: 'transparent',
    borderRadius: "10px"
  }
}

