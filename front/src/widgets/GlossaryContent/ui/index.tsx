import {
  Accordion,
  AccordionDetails, AccordionSummary,
  Box,
  BoxProps,
  Tab, Tabs,
  Typography
} from "@mui/material"
import React, { FC, useEffect, useMemo, useState } from "react"
import styled from "@mui/material/styles/styled"
import { mainTheme } from "@app/styles/mainTheme"
import { Stub } from "@shared/ui/components/Stub/ui"
import { DocIcon } from "@shared/ui/icons/DocIcon"
import { useAudioFileProvider } from "@shared/context/AudioFileProvider"
import { TabPanel } from "@shared/ui/components/TabPanel"
import { useDownloadGlossary, useGetGlossaryQuery } from "@shared/api/audio"
import { ToggleDownArrow } from "@shared/ui/icons/ToggleDownArrow"

export const GlossaryContentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "40px 0",
  ".glossary-content": {}
}))

export const GlossaryContent: FC<{ glossaryData: any }> = ({ glossaryData }) => {
  const glossaryObj = useMemo(() => glossaryData, [glossaryData])
  const glossaryTitles = glossaryObj ? Object.keys(glossaryObj) : null

  return (
    <GlossaryContentWrapper className="glossary-content">
      {glossaryData && glossaryTitles && (
          glossaryTitles.map((item, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ToggleDownArrow />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{item}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {glossaryObj[item]}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )
      }
      {!glossaryData && (
        <Box sx={{ mt: "40px" }}>
          <Stub title={"Идет обработка файла..."} icon={<DocIcon />} />
        </Box>
      )}
    </GlossaryContentWrapper>
  )
}