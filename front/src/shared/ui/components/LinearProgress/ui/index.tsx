import * as React from "react"
import LinearProgress, { LinearProgressProps } from "@mui/material/LinearProgress"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { IProcessingStatuses } from "@pages/main/types"
import { FC, useEffect, useState } from "react"

const colorObject = {
  "0": "secondary",
  "15": "primary",
  "30": "primary",
  "45": "primary",
  "60": "info",
  "75": "info",
  "100": "success"
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: "12px" }}>
        <LinearProgress variant="determinate" color={colorObject[String(props.value)]} {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body3" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

export const LinearWithValueLabel: FC<{ status: IProcessingStatuses }> = ({ status }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    switch (status) {
      case IProcessingStatuses.NOT_STARTED:
        setProgress(5)
        break
      case IProcessingStatuses.TRANCRIBATION:
        setProgress(15)
        break
      case IProcessingStatuses.TRANCRIBATION_DONE:
        setProgress(30)
        break
      case IProcessingStatuses.GLOSARY:
        setProgress(45)
        break
      case IProcessingStatuses.GLOSARY_DONE:
        setProgress(60)
        break
      case IProcessingStatuses.CONSPECT:
        setProgress(75)
        break
      case IProcessingStatuses.CONSPECT_DONE:
        setProgress(100)
        break
    }
  }, [status])

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  )
}