import { Box, Button, Typography } from '@mui/material'
import { ErrorOutlineOutlined } from '@mui/icons-material'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t(`page_header.titles.error_404`)}`)

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
    >
      <Box>
        <ErrorOutlineOutlined
          color="info"
          sx={{
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            marginBottom: '5px',
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          marginBottom={{ xs: 1.3, md: 1 }}
          fontWeight="600"
          fontSize={{ sm: '26px', md: '30px' }}
          lineHeight="normal"
        >
          {t('page_404.title')}
        </Typography>
        <Typography
          marginBottom={{ xs: 2, sm: 2.5 }}
          fontSize={{ xs: '16px', sm: '17px', md: '18px' }}
          lineHeight="normal"
        >
          {t('page_404.desc')}
        </Typography>
        <Button component={Link} to="/" replace variant="contained">
          {t('buttons.return_to_main_page')}
        </Button>
      </Box>
    </Box>
  )
}
