import { createTheme, Theme, ThemeOptions } from '@mui/material/styles'
import { MuiButton } from './components/MuiButton'

export const mainTheme: Theme = createTheme(<ThemeOptions>{
  palette: {
    primary: {
      main: '#F33041',
    },
    secondary: {
      main: '#6C6C6C',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#6C6C6C',
    },
  },
  typography: {
    fontFamily: '',
    h1: {
      fontSize: '40px',
      fontStyle: 'normal',
      fontWeight: 800,
      lineHeight: '44px',
      color: '#333333',
    },
    h2: {
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '24px',
      color: '#333333',
    },
    h3: {
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '20px',
      color: '#6C6C6C',
    },
    body1: {
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '20px',
      color: '#333333',
    },
    body2: {
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '20px',
      color: '#333333',
    },
  },
  components: {
    MuiButton,
  },
})
