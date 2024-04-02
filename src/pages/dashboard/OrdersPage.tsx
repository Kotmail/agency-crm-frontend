import { useState } from 'react'
import { OrderList } from '../../components/OrderList'
import { Hider } from '../../components/Hider'
import { UserRole } from '../../models/IUser'
import { useDialogs } from '../../hooks/useDialogs'
import {
  OrderFormDialog,
  OrderFormDialogProps,
} from '../../components/dialogs/OrderFormDialog'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'
import { PageHeader } from '../../components/PageHeader'
import { CreateEntityButton } from '../../components/CreateEntityButton'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTranslation } from 'react-i18next'
import { SortData, SortOption, Sorter } from '../../components/Sorter'
import { Box } from '@mui/material'

type DialogVariants = {
  orderForm: OrderFormDialogProps
}

const sortOptions: SortOption[] = [
  {
    key: 'createdAt',
    label: 'sorter.options.created_at',
  },
  {
    key: 'deadline',
    label: 'sorter.options.deadline',
  },
  {
    key: 'cost',
    label: 'sorter.options.cost',
  },
]

export const OrdersPage = () => {
  const { t } = useTranslation()
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    orderForm: {
      open: false,
    },
  })
  const [sortData, setSortData] = useState<SortData>({
    sortby: 'createdAt',
    orderby: 'desc',
  })

  useDocumentTitle(`${t('app_name')} — ${t(`page_header.titles.orders`)}`)

  return (
    <>
      <PageHeader title="page_header.titles.orders">
        <Hider roles={[UserRole.EXECUTOR]}>
          <CreateEntityButton
            text="buttons.new_order"
            onClick={() =>
              openDialog('orderForm', DIALOG_BASE_OPTIONS.form.addOrder)
            }
          />
        </Hider>
        <Box marginLeft="auto">
          <Sorter
            options={sortOptions}
            initialData={sortData}
            onSortHandler={setSortData}
          />
        </Box>
      </PageHeader>
      <OrderList sortData={sortData} />
      <OrderFormDialog {...dialogs.orderForm} />
    </>
  )
}
