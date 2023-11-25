import React from "react"
import { FileFormat, StatusDropzone } from "@features/Dropzone/types"
import { Box, BoxProps, IconButton, LinearProgress, Typography } from "@mui/material"
import { FC, useEffect, useState } from "react"
import { mainTheme } from "@app/styles/mainTheme"
import { Accept, useDropzone } from "react-dropzone"
import styled from "@mui/material/styles/styled"
import { PlusCircleIcon } from "@shared/ui/icons/PlusCircleIcon"
import { Tag } from "@shared/ui/components/Tag/ui"
import { UploadIcon } from "@shared/ui/icons/UploadIcon"
import { useAudioAddFile } from "@shared/api/audio"

interface IBasicDropzoneBoxProps extends BoxProps {
  drag: boolean
}

const DropzoneBox = styled(Box)<IBasicDropzoneBoxProps>(({ drag, theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",

  width: "100%",
  minHeight: "140px",

  cursor: "pointer",
  textAlign: "center",

  border: `2px dashed`,
  borderRadius: "24px",
  borderColor: drag ? mainTheme.palette.primary.main : mainTheme.palette.customGray.gray1,
  background: mainTheme.palette.common.white,
  "&:hover": {
    borderColor: mainTheme.palette.primary.main
  }
}))

export const Dropzone: FC<{
  fileFormat: FileFormat
  maxSize: number
}> = ({
  fileFormat = FileFormat.AUDIO,
  maxSize
}) => {
  const { mutateAsync: addFile, error: addFileError, isSuccess: isAddFileSuccess } = useAudioAddFile();

  const [fileName, setFileName] = useState<string | null>()
  const [uploadStatus, setUploadStatus] = useState<StatusDropzone | null>()

  const handleOnDrop = (file: File) => {
    console.log('[file]', file)
    addFile(file)
    setUploadStatus(StatusDropzone.SUCCESS)
  }

  const formatConfig = (fileFormat: FileFormat): Accept => {
    switch (fileFormat) {
      case FileFormat.AUDIO:
        return { "audio/mp3": [".mp3"] }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: formatConfig(fileFormat),
    maxSize: maxSize * 1024 * 1024,
    onDrop: (acceptedFiles, fileRejections) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFileName(acceptedFiles[0].name)
        setUploadStatus(StatusDropzone.LOADING)
      }

      if (fileRejections && fileRejections.length > 0) {
        setUploadStatus(StatusDropzone.REJECTED)
        setFileName(fileRejections[0].file.name)
      }
    },
    onDropAccepted: (acceptedFiles: any) => {
      handleOnDrop(acceptedFiles)
    }
  })

  return (
    <>
      {uploadStatus === StatusDropzone.SUCCESS && isAddFileSuccess && (
        <Tag variant="statusActual">Загружен</Tag>
      )}
      {uploadStatus === StatusDropzone.REJECTED && (
        <>
          <Tag variant="statusError">
            Импорт завершен с ошибкой
          </Tag>
        </>
      )}
      <DropzoneBox {...getRootProps()} drag={isDragActive}>
          <input {...getInputProps()} />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px" }}>
            <UploadIcon />
            <Box sx={{ mt: "12px" }}>
              <Typography
                variant="body2"
              >
                <Box as="span" style={{ color: mainTheme.palette.primary.main }}>Нажмите</Box> или перетащите файл
              </Typography>
              <Typography
                variant="body3"
                sx={{ mt: "4px" }}
              >
                (Макс. размер .mp3 файла: {maxSize} MB)
              </Typography>
            </Box>
          </Box>
        </DropzoneBox>
      {uploadStatus === StatusDropzone.LOADING && (
        <Box sx={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress color="primary" />
          </Box>
        </Box>
      )}
    </>
  )
}
