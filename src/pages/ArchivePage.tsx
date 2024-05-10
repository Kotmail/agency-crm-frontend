import { Header } from '../components/Header'
import { PageHeader } from '../components/PageHeader'
import { Container, Box } from '@mui/material'
import { OrderTable } from '../components/OrderTable'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

export const ArchivePage = () => {
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t('pages.archive')}`)

  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Box paddingTop="30px" paddingBottom="40px">
          <PageHeader title="pages.archive" />
          <OrderTable filterData={{ isArchived: true }} />
        </Box>
      </Container>
    </>
  )
}
