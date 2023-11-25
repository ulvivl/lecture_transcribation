import React, { FC } from "react"

import { Box, Typography } from "@mui/material"
import { mainTheme } from "@app/styles/mainTheme"

export const Stub: FC<{ title: string, icon: JSX.Element }> = ({
   title,
   icon
 }) => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      textAlign: "center"
    }}>
      <Box>
        {icon}
      </Box>
      <Typography variant="body3" sx={{ color: mainTheme.palette.customGray.gray2, maxWidth: "200px" }}>
        {title}
      </Typography>
    </Box>
  )
}
