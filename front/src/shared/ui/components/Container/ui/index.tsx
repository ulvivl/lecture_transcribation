import React, { FC } from "react"

import styled from "@mui/material/styles/styled"

import { Box } from "@mui/material"

const Wrapper = styled(Box)<any>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  margin: "0 auto",
  padding: "0 24px",

  [theme.breakpoints.up("sm")]: {
    maxWidth: "1240px",
    padding: "0 63px"
  },

  [theme.breakpoints.up("lg")]: {
    padding: 0
  },
}))

type IContainer = {
  className?: string
}

export const Container: FC<IContainer> = ({ children, className }) => (
  <Wrapper className={className}>{children}</Wrapper>
)
