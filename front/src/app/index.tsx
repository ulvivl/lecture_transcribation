import React from "react"
import { paths } from "@app/paths/paths"
import { Box, CssBaseline, ThemeProvider } from "@mui/material"
import { mainTheme } from "@app/styles/mainTheme"
import { MainPage } from "@pages/main"
import { Routes, Route } from "react-router-dom"
import { TaskDetailPage } from "@pages/taskDetail"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 5 * 1000,
      retry: 0,
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={mainTheme}>
      <QueryClientProvider client={queryClient}>
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
            <Route path={paths.taskDetail} element={<TaskDetailPage />} />
          </Routes>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
