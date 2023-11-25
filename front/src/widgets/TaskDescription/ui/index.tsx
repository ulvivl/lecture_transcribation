import {
  Box,
  BoxProps, Button,
  Tab, Tabs,
  Typography
} from "@mui/material"
import React, { FC, useState } from "react"
import styled from "@mui/material/styles/styled"
import { mainTheme } from "@app/styles/mainTheme"
import { Stub } from "@shared/ui/components/Stub/ui"
import { DocIcon } from "@shared/ui/icons/DocIcon"
import { useAudioFileProvider } from "@shared/context/AudioFileProvider"
import { TabPanel } from "@shared/ui/components/TabPanel"
import { ConspectContent } from "@widgets/ConspectContent"
import { GlossaryContent } from "@widgets/GlossaryContent"
import { useDownloadConspect, useDownloadGlossary, useGetConspectQuery, useGetGlossaryQuery } from "@shared/api/audio"

export const TaskDescriptionWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flexGrow: 1,
  ".task-description": {
    "&__title": {
      display: "inline-block",
      marginBottom: "16px",
      fontWeight: 500
    },
    "&__content": {
      flexGrow: 1
    },
    "&__footer": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: "16px",
      padding: "10px 20px",
      borderRadius: "8px",
      background: mainTheme.palette.common.white,
      boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.10)"
    }
  }
}))

enum TabNames {
  "glossary" = 0,
  "conspect" = 1,
}

export const TaskDescription: FC<{}> = () => {
  const { currentFileId } = useAudioFileProvider()
  const { isLoading: isLoadingGlossary, data: glossaryData } = useGetGlossaryQuery({ id: currentFileId }, !!currentFileId)
  const { isLoading: isLoadingConspect, data: conspectData } = useGetConspectQuery({ id: currentFileId }, !!currentFileId)
  const { isLoading: isLoadingUrlGlossary, data: glossaryUrl, isSuccess: successUrlGlossary } = useDownloadGlossary({ id: currentFileId }, !!glossaryData)
  const { isLoading: isLoadingUrlConspect, data: conspectUrl, isSuccess: successUrlConspect } = useDownloadConspect({ id: currentFileId }, !!conspectData)
  const [tabIndex, setTabIndex] = useState(TabNames["conspect"])

  const handleChangeTab = (event: React.SyntheticEvent, value: number) => {
    setTabIndex(value)
  }

  return (
    <TaskDescriptionWrapper className="task-description">
      <Typography className="task-description__title" variant="body1">
        Рабочее пространство
      </Typography>
      {currentFileId ? (
        <>
          <Box className="task-description__content">
            <Tabs value={tabIndex} onChange={handleChangeTab}>
              <Tab label="Глоссарий" />
              <Tab label="Конспект" />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
              <GlossaryContent glossaryData={glossaryData} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <ConspectContent conspectData={conspectData} />
            </TabPanel>
          </Box>
          <Box className="task-description__footer">
            <Box sx={{ display: "flex", gap: "20px" }}>
              {conspectUrl && successUrlConspect && (
                <Button sx={{textDecoration: 'none'}} variant="primary" as={"a"} download href={conspectUrl}>Скачать конспект</Button>
              )}
              {glossaryUrl && successUrlGlossary && (
                <Button sx={{textDecoration: 'none'}} variant="primary" as={"a"} download href={glossaryUrl}>Скачать глоссарий</Button>
              )}
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ display: "flex", height: "100%", flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Stub title={"Загрузите файл и откройте его после обработки"} icon={<DocIcon />} />
        </Box>
      )}
    </TaskDescriptionWrapper>
  )
}