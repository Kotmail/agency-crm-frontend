import { PageHeader } from '../../components/PageHeader'
import { OrderTable } from '../../components/OrderTable'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

export const ArchivePage = () => {
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t('pages.archive')}`)

  return (
    <>
      <PageHeader title="pages.archive" />
      <OrderTable filterData={{ isArchived: true }} />
    </>
  )
}
