import { FC, PropsWithChildren } from 'react'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type PageHeaderProps = {
  title: string
}

export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  title,
  children,
}) => {
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
