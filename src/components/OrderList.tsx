import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import {
  EditOutlined,
  CopyAllOutlined,
  ArchiveOutlined,
  UnarchiveOutlined,
  DeleteOutlineOutlined,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  useDeleteOrderMutation,
  useOrdersQuery,
  useUpdateOrderMutation,
} from '../redux/api/ordersApi'
import { IOrder, OrderPriority, OrderStatus } from '../models/IOrder'
import { ConfirmDialog, ConfirmDialogProps } from './dialogs/ConfirmDialog'
import { enqueueSnackbar } from 'notistack'
import { useDialogs } from '../hooks/useDialogs'
import { Hider } from './Hider'
import { UserRole } from '../models/IUser'
import {
  OrderFormDialog,
  OrderFormDialogProps,
} from './dialogs/OrderFormDialog'
import { DIALOG_BASE_OPTIONS } from '../utils/consts'
import { OrderStatusSwitcher } from './OrderStatusSwitcher'
import { ActionItem, ActionItemKeys, ActionsDropdown } from './ActionsDropdown'
import { TableBackdropLoader } from './TableBackdropLoader'
import { OrderPriorityChip } from './OrderPriorityChip'
import { SortData } from './Sorter'

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

type FilterData = {
  priority?: OrderPriority[]
  status?: OrderStatus[]
  isArchived?: boolean
}

type OrderListProps = {
  itemsPerPage?: number
  filterData?: FilterData
  sortData?: SortData
}

export const OrderList = ({
  itemsPerPage,
  filterData,
  sortData,
}: OrderListProps) => {
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
  const [selectedOrder, setSelectedOrder] = useState<null | IOrder>(null)
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    orderForm: {
      open: false,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteOrder,
      confirmBtnHandler: () => deleteOrderHandler(),
    },
  })
  const theme = useTheme()
  const matchMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()

  const selectActionHandler = (optionKey: ActionItemKeys) => {
    switch (optionKey) {
      case 'edit':
        openDialog('orderForm', {
          ...DIALOG_BASE_OPTIONS.form.editOrder,
          order: selectedOrder,
        })
        break
      case 'copy':
        openDialog('orderForm', {
          ...DIALOG_BASE_OPTIONS.form.copyOrder,
          order: { ...selectedOrder!, id: 0 },
        })
        break
      case 'archive':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.archiveOrder,
          confirmBtnHandler: () => archiveOrderHandler(),
        })
        break
      case 'unarchive':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.unarchiveOrder,
          confirmBtnHandler: () => archiveOrderHandler(),
        })
        break
      case 'delete':
        openDialog('confirm')
        break
    }
  }

  const updateStatusHandler = (id: number, status: OrderStatus) =>
    updateOrder({
      id,
      status,
    })

  const archiveOrderHandler = () => {
    if (selectedOrder) {
      updateOrder({
        ...selectedOrder,
        isArchived: !selectedOrder.isArchived,
      })
    }

    closeDialog('confirm')
  }

  const getSpecificActions = () => {
    return actions.filter((action) =>
      filterData && filterData.isArchived
        ? action.key === 'unarchive'
        : action.key !== 'unarchive',
    )
  }

  const deleteOrderHandler = () => {
    if (selectedOrder) {
      deleteOrder(selectedOrder.id)
    }

    closeDialog('confirm')
  }

  useEffect(() => {
    if (isUpdateSuccess) {
      enqueueSnackbar(t('notifications.edit_order.success'), {
        variant: 'success',
      })
    }

    if (isDeleteSuccess) {
      enqueueSnackbar(t('notifications.delete_order.success'), {
        variant: 'success',
      })
    }

    if (isUpdateError) {
      enqueueSnackbar(t('notifications.edit_order.fail'), {
        variant: 'error',
      })
    }

    if (isDeleteError) {
      enqueueSnackbar(t('notifications.delete_order.fail'), {
        variant: 'error',
      })
    }
  }, [isUpdateSuccess, isUpdateError, isDeleteSuccess, isDeleteError])

  if (isOrdersLoading) {
    return <CircularProgress />
  }

  if (isOrdersLoadingError) {
    return <Alert severity="error">{t('alerts.orders.request_error')}</Alert>
  }

  if (ordersData && ordersData[0].length === 0) {
    if (pagination.page > 1) {
      setPagination((data) => ({ ...data, page: --data.page }))
    }

    return (
      <Alert severity="info">
        {t(
          `alerts.orders.empty_data${
            filterData && filterData.isArchived ? '_archive' : ''
          }`,
        )}
      </Alert>
    )
  }

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        className={matchMdBreakpoint ? 'cardView' : ''}
        sx={{
          position: 'relative',
          '&.cardView': {
            border: 'none',
            '.MuiTable-root': {
              width: 'auto',
              border: 'none',
            },
            '.MuiTableHead-root': visuallyHidden,
            '.MuiTableBody-root .MuiTableRow-root': {
              display: 'flex',
              flexWrap: 'wrap',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              '&:not(:last-child)': { marginBottom: '20px' },
            },
            '.MuiTableCell-root': {
              padding: '8px 10px',
              display: 'flex',
              width: '100%',
              borderBottom: '1px solid #e0e0e0',
              fontSize: '13px',
              '&[data-label]::before': {
                content: 'attr(data-label) ":"',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                marginRight: '5px',
              },
            },
            '.cell-meta': {
              display: 'flex',
              alignItems: 'center',
              order: 1,
              width: '62%',
              paddingRight: 0,
            },
            '.order-id': {
              marginRight: '6px',
              fontSize: '15px',
              lineHeight: 'normal',
              letterSpacing: 'normal',
            },
            '.create-datetime': {
              display: 'flex',
              alignItems: 'center',
              marginTop: 0,
              span: {
                paddingLeft: '4px',
              },
              lineHeight: 'normal',
            },
            '.cell-priority': {
              order: 2,
              width: '38%',
              '.MuiChip-root': {
                marginLeft: 'auto',
              },
            },
            '.cell-deadline, .cell-cost': {
              flexDirection: 'column',
              width: 'auto',
              borderBottom: 'none',
              span: { paddingTop: '2px', fontWeight: 700, fontSize: '15px' },
            },
            '.cell-deadline': {
              order: 3,
            },
            '.cell-cost': {
              order: 4,
            },
            '.cell-brand': {
              order: 5,
            },
            '.cell-address': {
              order: 6,
            },
            '.cell-description': {
              order: 7,
            },
            '.cell-creator': {
              order: 8,
              borderBottom: 'none',
            },
            '.cell-executor': {
              order: 9,
              paddingTop: 0,
              borderBottom: 'none',
            },
            '.cell-actions, .cell-status': {
              width: 'auto',
              borderTop: '1px solid #e0e0e0',
              borderBottom: 'none',
            },
            '.cell-actions': {
              order: 10,
            },
            '.cell-status': {
              order: 11,
              flex: '1 1 auto',
              '.MuiButtonBase-root': { marginLeft: 'auto' },
            },
          },
        }}
      >
        <TableBackdropLoader open={isOrdersFetching} />
        <Table
          size="small"
          aria-label={t('order_list_table.label')}
          sx={{
            tableLayout: 'fixed',
            width: 1486,
            'th, td': {
              paddingTop: '14px',
              paddingBottom: '14px',
              lineHeight: 'normal',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <Hider roles={[UserRole.EXECUTOR]}>
                <TableCell width="4%">
                  <Typography component="span" sx={visuallyHidden}>
                    {t('order_list_table.headings.actions')}
                  </Typography>
                </TableCell>
              </Hider>
              <TableCell width="7%">№</TableCell>
              <TableCell width="9%">
                {t('order_list_table.headings.deadline')}
              </TableCell>
              <TableCell width="15%">
                {t('order_list_table.headings.description')}
              </TableCell>
              <TableCell width="12%">
                {t('order_list_table.headings.object_address')}
              </TableCell>
              <TableCell width="9%">
                {t('order_list_table.headings.priority')}
              </TableCell>
              <TableCell width="8%">
                {t('order_list_table.headings.brand')}
              </TableCell>
              <Hider roles={[UserRole.MANAGER]}>
                <TableCell width="9%">
                  {t('order_list_table.headings.creator')}
                </TableCell>
              </Hider>
              <Hider roles={[UserRole.EXECUTOR]}>
                <TableCell width="9%">
                  {t('order_list_table.headings.executor')}
                </TableCell>
              </Hider>
              <TableCell width="7%">
                {t('order_list_table.headings.cost')}
              </TableCell>
              <TableCell width="11%">
                {t('order_list_table.headings.status')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersData &&
              ordersData[0].map((order) => {
                const createdDate = new Date(
                  Date.parse(order.createdAt.toString()),
                )
                const deadlineDate = new Date(Date.parse(order.deadline))

                return (
                  <TableRow
                    key={order.id}
                    sx={{
                      '&:last-child td': { border: 0 },
                      verticalAlign: 'top',
                    }}
                  >
                    <Hider roles={[UserRole.EXECUTOR]}>
                      <TableCell className="cell-actions">
                        <ActionsDropdown
                          actions={getSpecificActions()}
                          onSelectHandler={selectActionHandler}
                          onClick={() => setSelectedOrder(order)}
                          ariaLabel="order_list_table.headings.actions"
                        />
                      </TableCell>
                    </Hider>
                    <TableCell className="cell-meta">
                      <Typography
                        component="span"
                        variant="body2"
                        fontWeight="500"
                        className="order-id"
                      >
                        {order.id}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        marginTop="6px"
                        lineHeight="1.3"
                        className="create-datetime"
                      >
                        {createdDate.toLocaleDateString()}
                        <Box
                          component="span"
                          display="block"
                          color="text.secondary"
                        >
                          {createdDate.toLocaleTimeString()}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell
                      data-label={t('order_list_table.headings.deadline')}
                      className="cell-deadline"
                    >
                      <span>{deadlineDate.toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell
                      data-label={t('order_list_table.headings.description')}
                      className="cell-description"
                    >
                      {order.description}
                    </TableCell>
                    <TableCell
                      data-label={t('order_list_table.headings.object_address')}
                      className="cell-address"
                    >
                      {order.objectAddress}
                    </TableCell>
                    <TableCell className="cell-priority">
                      <OrderPriorityChip priority={order.priority} />
                    </TableCell>
                    <TableCell
                      data-label={t('order_list_table.headings.brand')}
                      className="cell-brand"
                    >
                      {order.brand}
                    </TableCell>
                    <Hider roles={[UserRole.MANAGER]}>
                      <TableCell
                        data-label={t('order_list_table.headings.creator')}
                        className="cell-creator"
                      >
                        {order.creator.fullName}
                      </TableCell>
                    </Hider>
                    <Hider roles={[UserRole.EXECUTOR]}>
                      <TableCell
                        data-label={t('order_list_table.headings.executor')}
                        className="cell-executor"
                      >
                        {order.executor.fullName}
                      </TableCell>
                    </Hider>
                    <TableCell
                      data-label={t('order_list_table.headings.cost')}
                      className="cell-cost"
                    >
                      <span>
                        {new Intl.NumberFormat('ru', {
                          style: 'currency',
                          currency: 'RUB',
                          currencyDisplay: 'symbol',
                          minimumFractionDigits: 0,
                        }).format(order.cost)}
                      </span>
                    </TableCell>
                    <TableCell className="cell-status">
                      <OrderStatusSwitcher
                        order={order}
                        onChangeHandler={updateStatusHandler}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {ordersData && ordersData[1] > pagination.limit && (
        <Pagination
          disabled={isOrdersFetching}
          count={Math.ceil(ordersData[1] / pagination.limit)}
          page={pagination.page}
          onChange={(_, page) => setPagination((data) => ({ ...data, page }))}
          variant="outlined"
          color="primary"
          shape="rounded"
          sx={{ marginTop: '25px', '.MuiPagination-ul': { rowGap: '6px' } }}
        />
      )}
      <OrderFormDialog {...dialogs.orderForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
