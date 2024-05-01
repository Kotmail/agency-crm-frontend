import { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type PageHeaderProps = {
  title: string
  children?: ReactNode
}

export const PageHeader = ({ title, children }: PageHeaderProps) => {
  const { t } = useTranslation()

  return (
    <Box display="flex" alignItems="center" gap={2} marginBottom={3}>
      <Typography component="h1" variant="h5" fontWeight="600">
        {t(title)}
      </Typography>
      {children}
    </Box>
  )
}
