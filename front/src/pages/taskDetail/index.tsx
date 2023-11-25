import React from "react"
import { useDocumentTitle } from "@shared/hooks/useDocumentTitle"
import styled from "@mui/material/styles/styled"
import { Box } from "@mui/material"

export const Layout = styled(Box)<any>(
  ({ backgroundColor }) => ({
    width: "100%",
    height: "2000px",
    backgroundColor: backgroundColor ?? "white"
  })
)

export const TaskDetailPage = () => {
  useDocumentTitle("Детальная страница таска")

  return (
    <>

    </>
  )
}
