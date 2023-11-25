import React, { FC } from "react"

import { Box } from "@mui/material"

const styles = {
  statusError: {
    fontSize: '11px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '18px',
    display: 'inline-block',
    width: 'fit-content',
    padding: '2px 8px',
    borderRadius: '20px',
    textTransform: 'uppercase',

    color: '#F62434',
    backgroundColor: '#FFE6E7',
  },
  statusActual: {
    fontSize: '11px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '18px',
    display: 'inline-block',
    width: 'fit-content',
    padding: '2px 8px',
    borderRadius: '20px',
    textTransform: 'uppercase',

    color: '#00B956',
    backgroundColor: '#EDFCF4',
  },
}

export const Tag: FC<{ variant: string }> = ({
 variant,
 children
}) => {
  return (
    <Box sx={styles[variant]}>
      {children}
    </Box>
  )
}
