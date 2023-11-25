import React, { FC } from "react"

import { Box } from "@mui/material"
import { TTabPanelProps } from "@shared/ui/components/TabPanel/types/tabPanelProps"

export const TabPanel: FC<TTabPanelProps> = ({ index, value, children }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
    >
      {value === index && <>{children}</>}
    </Box>
  )
}
