import React, { FC } from "react"
import { Dropzone } from "@features/Dropzone/ui"
import { FileFormat } from "@features/Dropzone/types"

export const DropzoneWrapper: FC<{}> = () => {
  return (
    <Dropzone
      maxSize={200}
      fileFormat={FileFormat.AUDIO}
    />
  )
}