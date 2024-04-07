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
import { OrderPriority, OrderStatus } from '../../models/IOrder'
import { Filter, FilterGroup } from '../../components/Filter'
import { OrdersFilterParams } from '../../redux/api/ordersApi'

type DialogVariants = {
  orderForm: OrderFormDialogProps
}

const filterOptionGroups: FilterGroup[] = [
  {
    legend: 'order_list_table.headings.priority',
    checkboxes: Object.values(OrderPriority).map((priority) => ({
      label: `priorities.${priority}`,
      name: 'priority',
      value: priority,
    })),
  },
  {
    legend: 'order_list_table.headings.status',
    checkboxes: Object.values(OrderStatus).map((status) => ({
      label: `statuses.${status}`,
      name: 'status',
      value: status,
    })),
  },
]

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
  const [filterData, setFilterData] = useState<OrdersFilterParams>({})
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
        <Box display="flex" gap={2} marginLeft="auto">
          <Filter
            optionGroups={filterOptionGroups}
            filterData={filterData}
            onApplyChangesHandler={setFilterData}
          />
          <Sorter
            options={sortOptions}
            sortData={sortData}
            onChangeSortHandler={setSortData}
          />
        </Box>
      </PageHeader>
      <OrderList filterData={filterData} sortData={sortData} />
      <OrderFormDialog {...dialogs.orderForm} />
    </>
  )
}
