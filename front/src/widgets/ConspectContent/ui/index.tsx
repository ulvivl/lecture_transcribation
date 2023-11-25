import {
  Box,
  BoxProps,
  Typography
} from "@mui/material"
import React, { FC, useMemo } from "react"
import styled from "@mui/material/styles/styled"
import { Stub } from "@shared/ui/components/Stub/ui"
import { DocIcon } from "@shared/ui/icons/DocIcon"
import { useAudioFileProvider } from "@shared/context/AudioFileProvider"
import { useGetConspectQuery } from "@shared/api/audio"
import { scrollStyles } from "@app/styles/basic"

export const ConspectContentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "40px 0",
  ".conspect-content": {}
}))

export const ConspectContent: FC<{ conspectData: any}> = ({ conspectData }) => {
  const conspect = useMemo(() => conspectData, [conspectData])

  // const mock = [{
  //   title: "abs",
  //   subtitles: [
  //     {
  //       subtitle: null,
  //       texts: [{ text: "asdas" }, { text: "das" }]
  //     }
  //   ]
  // }, {
  //   title: "abs",
  //   subtitles: [
  //     {
  //       subtitle: "sadasdas",
  //       texts: [{ text: "asdas" }, { text: "das" }]
  //     }
  //   ]
  // },
  //   {
  //     title: "abs",
  //     subtitles: [
  //       {
  //         subtitle: "sadasdas",
  //         texts: []
  //       }
  //     ]
  //   },
  //   {
  //     title: null,
  //     subtitles: [
  //       {
  //         subtitle: null,
  //         texts: [{ text: "asdas" }, { text: "das" }]
  //       }
  //     ]
  //   },
  //   {
  //     title: "abs",
  //     subtitles: [
  //       {
  //         subtitle: null,
  //         texts: [{ text: "asdas" }, { text: "das" }]
  //       }
  //     ]
  //   },
  //   {
  //     title: "abs",
  //     subtitles: [
  //       {
  //         subtitle: null,
  //         texts: [{ text: "asdas" }, { text: "das" }]
  //       }
  //     ]
  //   },
  //   {
  //     title: "abs",
  //     subtitles: [
  //       {
  //         subtitle: null,
  //         texts: [{ text: "asdas" }, { text: "das" }]
  //       }
  //     ]
  //   },
  //   {
  //     title: "abs",
  //     subtitles: [
  //       {
  //         subtitle: null,
  //         texts: [{ text: "asdas" }, { text: "das" }]
  //       }
  //     ]
  //   },
  // ]

  return (
    <ConspectContentWrapper className="conspect-content">
      {Array.isArray(conspect) ? (
        <Box className="overview-container" sx={{
          maxHeight: "calc(100vh - 350px)",
          overflow: "hidden",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          ...scrollStyles,
        }}>
          {conspect.map(item => (
            <Box>
              {item.title && (
                <Typography variant="h1" sx={item.title ? { mb: "20px" } : {}}>
                  {item.title}
                </Typography>
              )}
              {!!item.subtitles?.length && item.subtitles?.map(subtitle => (
                <>
                  <Typography variant="h2" sx={subtitle.subtitle ? { mb: "16px" } : {}}>
                    {subtitle.subtitle}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {!!subtitle.texts?.length && subtitle.texts?.map(text => (
                      <Typography variant="body1">
                        {text.text}
                      </Typography>
                    ))}
                  </Box>
                </>
              ))}
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ mt: "40px" }}>
          <Stub title={"Идет обработка файла..."} icon={<DocIcon />} />
        </Box>
      )}
    </ConspectContentWrapper>
  )
}