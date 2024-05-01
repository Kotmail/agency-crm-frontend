import { PageHeader } from '../../components/PageHeader'
import { OrderList } from '../../components/OrderList'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

export const ArchivePage = () => {
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t('pages.archive')}`)

  return (
    <>
      <PageHeader title="pages.archive" />
      <OrderList filterData={{ isArchived: true }} />
    </>
  )
}
