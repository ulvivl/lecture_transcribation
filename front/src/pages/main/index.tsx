import React from "react"
import styled from "@mui/material/styles/styled"
import { Box } from "@mui/material"
import { LayoutComponent } from "@shared/ui/components/Layout/ui"
import { DropzoneWrapper } from "@pages/main/components/DropzoneWrapper"
import { TasksList } from "@widgets/TasksList/ui"
import { Sidebar } from "@pages/main/components/Sidebar"
import { mainTheme } from "@app/styles/mainTheme"
import { TaskDescription } from "@widgets/TaskDescription/ui"
import { AudioFileProvider } from "@shared/context/AudioFileProvider"

export const Content = styled(Box)<any>(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100vh",
    padding: "40px 0",
    ".content": {
      "&__secondary": {
        [theme.breakpoints.up("md")]: {
          display: "block",
          width: "calc(424 / 1240 * 100%)"
        }
      },
      "&__main": {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "400px",
        padding: "16px",
        borderRadius: "24px",
        background: mainTheme.palette.common.white,
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
        [theme.breakpoints.up("md")]: {
          width: "100%"
        }
      },
      "&__container": {
        display: "flex",
        flexGrow: "1",
        flexDirection: "column",
        gap: "20px",
        [theme.breakpoints.up("md")]: {
          flexDirection: "row"
        }
      }
    }
  })
)

export const MainPage = () => {
  return (
    <AudioFileProvider>
      <LayoutComponent title="Главная страница">
        <Content className="content content--divided">
          <Box className="content__container">
            <Box className="content__main">
              <TaskDescription />
            </Box>
            <Box className="content__secondary">
              <Sidebar title="Добавление аудио-файла">
                <DropzoneWrapper />
                <TasksList />
              </Sidebar>
            </Box>
          </Box>
        </Content>
      </LayoutComponent>
    </AudioFileProvider>
  )
}
