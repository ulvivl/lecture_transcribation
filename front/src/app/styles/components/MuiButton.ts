import { buttonClasses } from '@mui/material/Button'

export const MuiButton = {
  defaultProps: {
    disableRipple: true,
  },
  styleOverrides: {
    root: {
      fontFamily: ['"Lato"', 'sans-serif'].join(','),
      fontSize: '16px',
      fontWeight: 700,
      fontStyle: 'normal',
      lineHeight: '20px',
      width: 'fit-content',
      padding: '10px 25px',
      boxShadow: 'none',
      textTransform: 'none',
      borderRadius: '20px',
    },
    sizeSmall: {
      padding: '3px 16px',
    },
    primary: {
      color: '#FFFFFF',
      backgroundColor: '#F33041',
      ':hover': {
        backgroundColor: '#A4121F',
      },
      [`&.${buttonClasses.disabled}`]: {
        color: '#FFFFFF',
        backgroundColor: '#9DA6B0',
      },
      [`& .${buttonClasses.endIcon}`]: {
        margin: '0',
        marginLeft: '2px',
      },
    },
    secondary: {
      color: '#10A064',
      backgroundColor: '#EDFCF4',
      ':hover': {
        backgroundColor: '#CBF2DE',
      },
      [`&.${buttonClasses.disabled}`]: {
        color: '#9DA6B0',
        backgroundColor: '#F6F6F6',
      },
    },
    cancel: {
      color: '#333333',
      backgroundColor: '#F6F6F6',
      ':hover': {
        backgroundColor: '#CECECE',
      },
      [`&.${buttonClasses.disabled}`]: {
        color: '#9DA6B0',
        backgroundColor: '#F6F6F6',
      },
    },
  },
}
