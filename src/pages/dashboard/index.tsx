import { FC, useEffect } from 'react'
import { Header } from '../../components/Header'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

export const Dashboard: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [, setDocumentTitle] = useDocumentTitle()

  useEffect(() => {
    const locationPathsArray = location.pathname
      .split('/')
      .filter((path) => path)
    const currentPathname = locationPathsArray.pop()

    if (currentPathname === 'dashboard') {
      setDocumentTitle(
        `${t('app_name')} — ${t(`page_header.titles.dashboard`)}`,
      )
    }
  }, [location])

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Box paddingTop="30px">
          <Outlet />
        </Box>
      </Container>
    </>
  )
}
