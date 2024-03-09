import { FC } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { OrderList } from '../../components/OrderList'

export const ArchivePage: FC = () => {
  return (
    <>
      <PageHeader title="page_header.titles.archive" />
      <OrderList state="closed" />
    </>
  )
}
