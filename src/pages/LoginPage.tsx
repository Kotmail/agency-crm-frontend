import { useLayoutEffect } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { LoginForm } from '../components/LoginForm'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { blue } from '@mui/material/colors'
import { useTranslation } from 'react-i18next'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAppSelector } from '../hooks/useAppSelector'
import { useNavigate } from 'react-router-dom'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)

  useDocumentTitle(`${t('app_name')} — ${t('pages.signin')}`)

  useLayoutEffect(() => {
    if (user) {
      navigate('orders', {
        replace: true,
      })
    }
  }, [])

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={2}
    >
      <Box width="100%" maxWidth={360}>
        <Avatar
          variant="rounded"
          sx={{ margin: '0 auto 6px', bgcolor: blue[700] }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          variant="h5"
          component="h1"
          marginBottom={3}
          textAlign="center"
        >
          {t('pages.signin')}
        </Typography>
        <LoginForm />
      </Box>
    </Box>
  )
}
