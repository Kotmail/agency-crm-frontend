import { useEffect, useState } from 'react'
import {
  Alert,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableContainer,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  EditOutlined,
  CopyAllOutlined,
  ArchiveOutlined,
  UnarchiveOutlined,
  DeleteOutlineOutlined,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  OrdersFilterParams,
  useDeleteOrderMutation,
  useOrdersQuery,
  useUpdateOrderMutation,
} from '../../redux/api/ordersApi'
import { IOrder, OrderStatus } from '../../models/IOrder'
import { ConfirmDialog, ConfirmDialogProps } from '../dialogs/ConfirmDialog'
import { enqueueSnackbar } from 'notistack'
import { useDialogs } from '../../hooks/useDialogs'
import {
  OrderFormDialog,
  OrderFormDialogProps,
} from '../dialogs/OrderFormDialog'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'
import { ActionItem, ActionItemKeys } from '../ActionsDropdown'
import { TableBackdropLoader } from '../TableBackdropLoader'
import { SortData } from '../Sorter'
import styles from './OrderTable.styles'
import { OrderTableHead } from './OrderTableHead'
import { OrderTableRow } from './OrderTableRow'

const actions: ActionItem[] = [
  {
    key: 'edit',
    icon: EditOutlined,
  },
  {
    key: 'copy',
    icon: CopyAllOutlined,
  },
  {
    key: 'archive',
    icon: ArchiveOutlined,
  },
  {
    key: 'unarchive',
    icon: UnarchiveOutlined,
  },
  {
    key: 'delete',
    icon: DeleteOutlineOutlined,
  },
]

type DialogVariants = {
  orderForm: OrderFormDialogProps
  confirm: ConfirmDialogProps
}

type OrderTableProps = {
  itemsPerPage?: number
  filterData?: OrdersFilterParams
  sortData?: SortData
}

export const OrderTable = ({
  itemsPerPage,
  filterData,
  sortData,
}: OrderTableProps) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: itemsPerPage || 8,
  })
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersLoadingError,
    isFetching: isOrdersFetching,
  } = useOrdersQuery({
    take: pagination.limit,
    page: pagination.page,
    ...filterData,
    ...sortData,
  })
  const [updateOrder, { isSuccess: isUpdateSuccess, isError: isUpdateError }] =
    useUpdateOrderMutation()
  const [deleteOrder, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteOrderMutation()
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    orderForm: {
      open: false,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteOrder,
      confirmBtnHandler: () => {},
    },
  })
  const theme = useTheme()
  const matchMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()

  const selectActionHandler = (order: IOrder, action: ActionItemKeys) => {
    switch (action) {
      case 'edit':
        openDialog('orderForm', {
          ...DIALOG_BASE_OPTIONS.form.editOrder,
          order,
        })
        break
      case 'copy':
        openDialog('orderForm', {
          ...DIALOG_BASE_OPTIONS.form.copyOrder,
          order: { ...order, id: 0 },
        })
        break
      case 'archive':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.archiveOrder,
          confirmBtnHandler: () => archiveOrderHandler(order.id, true),
        })
        break
      case 'unarchive':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.unarchiveOrder,
          confirmBtnHandler: () => archiveOrderHandler(order.id, false),
        })
        break
      case 'delete':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.deleteOrder,
          confirmBtnHandler: () => deleteOrderHandler(order.id),
        })
        break
    }
  }

  const changeStatusHandler = (id: number, status: OrderStatus) =>
    updateOrder({
      id,
      status,
    })

  const archiveOrderHandler = (id: number, isArchived: boolean) => {
    updateOrder({
      id,
      isArchived,
    })

    closeDialog('confirm')
  }

  const deleteOrderHandler = (id: number) => {
    deleteOrder(id)

    closeDialog('confirm')
  }

  const getDropdownActions = () =>
    actions.filter((action) =>
      filterData && filterData.isArchived
        ? action.key === 'unarchive'
        : action.key !== 'unarchive',
    )

  useEffect(() => {
    if (isUpdateSuccess) {
      enqueueSnackbar(t('notifications.edit_order.success'), {
        variant: 'success',
      })
    }

    if (isUpdateError) {
      enqueueSnackbar(t('notifications.edit_order.fail'), {
        variant: 'error',
      })
    }
  }, [isUpdateSuccess, isUpdateError, t])

  useEffect(() => {
    if (isDeleteSuccess) {
      enqueueSnackbar(t('notifications.delete_order.success'), {
        variant: 'success',
      })
    }

    if (isDeleteError) {
      enqueueSnackbar(t('notifications.delete_order.fail'), {
        variant: 'error',
      })
    }
  }, [isDeleteSuccess, isDeleteError, t])

  if (isOrdersLoading) {
    return <CircularProgress />
  }

  if (isOrdersLoadingError) {
    return <Alert severity="error">{t('alerts.orders.request_error')}</Alert>
  }

  if (ordersData && ordersData.items.length === 0) {
    if (pagination.page > 1) {
      setPagination((data) => ({ ...data, page: --data.page }))
    }

    return <Alert severity="info">{t('alerts.orders.empty_data')}</Alert>
  }

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        className={matchMdBreakpoint ? 'cardView' : ''}
        sx={styles.tableContainer}
      >
        <TableBackdropLoader open={isOrdersFetching} />
        <Table
          size="small"
          aria-label={t('order_list_table.label')}
          sx={styles.table}
        >
          <OrderTableHead />
          <TableBody>
            {ordersData &&
              ordersData.items.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  actionsDropdownItems={getDropdownActions()}
                  onSelectActionHandler={selectActionHandler}
                  onChangeStatusHandler={changeStatusHandler}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {ordersData && ordersData.totalCount > pagination.limit && (
        <Pagination
          disabled={isOrdersFetching}
          count={Math.ceil(ordersData.totalCount / pagination.limit)}
          page={pagination.page}
          onChange={(_, page) => setPagination((data) => ({ ...data, page }))}
          sx={{ marginTop: '25px' }}
        />
      )}
      <OrderFormDialog {...dialogs.orderForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
