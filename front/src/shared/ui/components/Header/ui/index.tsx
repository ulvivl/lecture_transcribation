import React from "react"

import { Box, BoxProps, Button, Link, Typography } from "@mui/material"
import styled from "@mui/material/styles/styled"
import { TPaths } from "@app/paths/paths"
import { NavLink } from "react-router-dom"
import { mainTheme } from "@app/styles/mainTheme"

interface IHeader {
  navLinks: TPaths
}

export const HeaderWrapper = styled(Box)<BoxProps>(() => ({
  position: "relative",
  display: "flex",
  width: "100%",
  height: "90px",
  padding: "16px 24px",
  ...mainTheme.border.r1
}))

export const Header = ({
   navLinks
 }: IHeader): JSX.Element => {
  return (
    <HeaderWrapper className="header">
      <Box as="nav" className="header__nav">
        {navLinks && (
          <Link className="header__nav-link" to={navLinks.root} component={NavLink}>
            <Button
              variant="primary"
              className="header__nav-button button"
            >
              <Typography>Назад</Typography>
            </Button>
          </Link>
        )}
      </Box>
    </HeaderWrapper>
  )
}
