import React, { FC } from "react"
import { Box, BoxProps, Typography } from "@mui/material"
import styled from "@mui/material/styles/styled"
import { mainTheme } from "@app/styles/mainTheme"

export const SidebarWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  background: mainTheme.palette.common.white,
  [theme.breakpoints.up("md")]: {
    width: "360px",
  },
  ".sidebar": {
    "&__title": {
      display: "inline-block",
      marginBottom: "16px",
      fontWeight: 500,
    },
    "&__body": {
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }
}))

export const Sidebar: FC<{ title: string }> = ({ children, title }) => {
  return (
    <SidebarWrapper className="sidebar">
      <Typography className="sidebar__title" variant="body1">
        {title}
      </Typography>
      <Box className="sidebar__body">
        {children}
      </Box>
    </SidebarWrapper>
  )
}