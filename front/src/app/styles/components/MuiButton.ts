import { buttonClasses } from "@mui/material/Button"

export const MuiButton = {
  defaultProps: {
    disableRipple: true
  },
  styleOverrides: {
    root: {
      fontFamily: "Onest",
      fontSize: "14px",
      fontWeight: 500,
      fontStyle: "normal",
      lineHeight: "20px",
      width: "fit-content",
      padding: "10px 25px",
      boxShadow: "none",
      textTransform: "none",
      borderRadius: "20px"
    },
    sizeSmall: {
      padding: "3px 16px"
    },
    primary: {
      color: "#3c4144",
      backgroundColor: "#e1e1e9",
      ":hover": {
        backgroundColor: "#d4d4dd"
      },
      [`&.${buttonClasses.disabled}`]: {
        color: "#FFFFFF",
        backgroundColor: "#9DA6B0"
      },
      [`& .${buttonClasses.endIcon}`]: {
        margin: "0",
        marginLeft: "2px"
      }
    },
    secondary: {
      color: "#10A064",
      backgroundColor: "#EDFCF4",
      ":hover": {
        backgroundColor: "#CBF2DE"
      },
      [`&.${buttonClasses.disabled}`]: {
        color: "#9DA6B0",
        backgroundColor: "#F6F6F6"
      }
    },
    cancel: {
      color: "#333333",
      backgroundColor: "#F6F6F6",
      ":hover": {
        backgroundColor: "#CECECE"
      },
      [`&.${buttonClasses.disabled}`]: {
        color: "#9DA6B0",
        backgroundColor: "#F6F6F6"
      }
    }
  }
}
