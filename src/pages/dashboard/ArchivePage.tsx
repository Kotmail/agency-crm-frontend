import { PageHeader } from '../../components/PageHeader'
import { OrderList } from '../../components/OrderList'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'

export const ArchivePage = () => {
  const { t } = useTranslation()

  useDocumentTitle(`${t('app_name')} — ${t(`page_header.titles.archive`)}`)

  return (
    <>
      <PageHeader title="page_header.titles.archive" />
      <OrderList filterData={{ isArchived: true }} />
    </>
  )
}
