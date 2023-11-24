import React from "react"
import { paths } from "@app/paths/paths"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { mainTheme } from "@app/styles/mainTheme"
import { MainPage } from "@pages/main"
import { Routes, Route } from "react-router-dom"

export const App = () => {
  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          overflowX: "hidden",
          height: "100%",
          width: "100%"
        }}
      >
        <Routes>
          <Route path={paths.root} element={<MainPage />} />
        </Routes>
      </Box>
    </ThemeProvider>
  )
}
