import { FC, MouseEvent, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  Chip,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import {
  Archive,
  Delete,
  Edit,
  KeyboardArrowDown,
  MoreHoriz,
  SvgIconComponent,
  Unarchive,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  useDeleteOrderMutation,
  useOrdersQuery,
  useUpdateOrderMutation,
} from '../redux/api/ordersApi'
import { lightBlue, orange, teal } from '@mui/material/colors'
import { IOrder, OrderStatus } from '../models/IOrder'
import { Confirm } from './dialogs/Confirm'
import { enqueueSnackbar } from 'notistack'
import { useDialogs } from '../hooks/useDialogs'
import { Hider } from './Hider'
import { UserRole } from '../models/IUser'
import { OrderFormDialog } from './dialogs/OrderFormDialog'

const priorityColors = {
  low: {
    borderColor: teal[300],
    color: teal[400],
  },
  medium: {
    borderColor: lightBlue[400],
    color: lightBlue[600],
  },
  high: {
    borderColor: orange[800],
    color: orange[900],
  },
}

const statusColors: { [key in OrderStatus]: ButtonProps['color'] } = {
  waiting: 'primary',
  accepted: 'warning',
  done: 'success',
}

type DialogVariants = {
  add: boolean
  edit: boolean
  archive: boolean
  unarchive: boolean
  delete: boolean
}

type DropdownOption = {
  key: keyof DialogVariants
  icon: SvgIconComponent
}

const dropdownOptions: DropdownOption[] = [
  {
    key: 'edit',
    icon: Edit,
  },
  {
    key: 'archive',
    icon: Archive,
  },
  {
    key: 'unarchive',
    icon: Unarchive,
  },
  {
    key: 'delete',
    icon: Delete,
  },
]

type OrderListProps = {
  state?: 'opened' | 'closed'
}

export const OrderList: FC<OrderListProps> = ({ state }) => {
  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersLoadingError,
  } = useOrdersQuery({ state })
  const [updateOrder, { isSuccess: isUpdateSuccess, isError: isUpdateError }] =
    useUpdateOrderMutation()
  const [deleteOrder, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteOrderMutation()
  const [anchorActionsMenu, setAnchorActionsMenu] =
    useState<null | HTMLElement>(null)
  const [anchorStatusMenu, setAnchorStatusMenu] = useState<null | HTMLElement>(
    null,
  )
  const isActionsMenuOpened = Boolean(anchorActionsMenu)
  const isStatusMenuOpened = Boolean(anchorStatusMenu)
  const [selectedOrder, setSelectedOrder] = useState<null | IOrder>(null)
  const [openedDialogs, setOpenedDialogs] = useDialogs<DialogVariants>({
    add: false,
    edit: false,
    archive: false,
    unarchive: false,
    delete: false,
  })
  const { t } = useTranslation()

  const openActionsMenuHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    order: IOrder,
  ) => {
    setSelectedOrder(order)
    setAnchorActionsMenu(event.currentTarget)
  }
  const closeActionsMenuHandler = () => setAnchorActionsMenu(null)

  const openStatusMenuHandler = (e: MouseEvent<HTMLElement>, order: IOrder) => {
    setAnchorStatusMenu(e.currentTarget)
    setSelectedOrder(order)
  }
  const closeStatusMenuHandler = () => setAnchorStatusMenu(null)

  const selectOptionHandler = (optionKey: keyof DialogVariants) => {
    setOpenedDialogs(optionKey, true)

    closeActionsMenuHandler()
  }

  const updateOrderHandler = (status: OrderStatus) => {
    if (selectedOrder && selectedOrder.status !== status) {
      updateOrder({
        id: selectedOrder.id,
        status,
      })
    }

    closeStatusMenuHandler()
  }

  const archiveOrderHandler = () => {
    if (selectedOrder) {
      updateOrder({
        ...selectedOrder,
        isArchived: !selectedOrder.isArchived,
      })
    }

    setOpenedDialogs('archive', false)
    setOpenedDialogs('unarchive', false)
  }

  const deleteOrderHandler = () => {
    if (selectedOrder) {
      deleteOrder(selectedOrder.id)
    }

    setOpenedDialogs('delete', false)
  }

  useEffect(() => {
    if (isUpdateSuccess) {
      enqueueSnackbar(t('notifications.update_order.success'), {
        variant: 'success',
      })
    }

    if (isDeleteSuccess) {
      enqueueSnackbar(t('notifications.delete_order.success'), {
        variant: 'success',
      })
    }

    if (isUpdateError) {
      enqueueSnackbar(t('notifications.update_order.fail'), {
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
    return <Typography>Error...</Typography>
  }

  if (!orders?.length) {
    return <Alert severity="info">Заказы отсутствуют</Alert>
  }

  return (
    <>
      <Hider roles={[UserRole.EXECUTOR]}>
        <Box paddingBottom={3}>
          <Button
            variant="contained"
            onClick={() => setOpenedDialogs('add', true)}
          >
            Добавить заказ
          </Button>
        </Box>
      </Hider>
      <TableContainer component={Paper}>
        <Table
          size="small"
          aria-label={t('order_list_table.label')}
          sx={{
            minWidth: 1300,
            '& .MuiTableCell-head': {
              lineHeight: 'normal',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <Hider roles={[UserRole.EXECUTOR]}>
                <TableCell>
                  <Typography component="span" sx={visuallyHidden}>
                    {t('order_list_table.headings.actions')}
                  </Typography>
                </TableCell>
              </Hider>
              <TableCell>№</TableCell>
              <TableCell>{t('order_list_table.headings.deadline')}</TableCell>
              <TableCell>
                {t('order_list_table.headings.description')}
              </TableCell>
              <TableCell>{t('order_list_table.headings.priority')}</TableCell>
              <TableCell>{t('order_list_table.headings.brand')}</TableCell>
              <Hider roles={[UserRole.MANAGER]}>
                <TableCell>{t('order_list_table.headings.creator')}</TableCell>
              </Hider>
              <Hider roles={[UserRole.EXECUTOR]}>
                <TableCell>{t('order_list_table.headings.executor')}</TableCell>
              </Hider>
              <TableCell>{t('order_list_table.headings.cost')}</TableCell>
              <TableCell>{t('order_list_table.headings.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders &&
              orders.map((order) => {
                const createdDate = new Date(
                  Date.parse(order.createdAt.toString()),
                )
                const deadlineDate = new Date(Date.parse(order.deadline))

                return (
                  <TableRow
                    key={order.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <Hider roles={[UserRole.EXECUTOR]}>
                      <TableCell>
                        <IconButton
                          id="orderActionsBtn"
                          aria-label={t('order_list_table.headings.actions')}
                          size="small"
                          aria-haspopup="true"
                          aria-controls={
                            isActionsMenuOpened ? 'orderActionsMenu' : undefined
                          }
                          aria-expanded={
                            isActionsMenuOpened ? 'true' : undefined
                          }
                          onClick={(e) => openActionsMenuHandler(e, order)}
                        >
                          <MoreHoriz fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </Hider>
                    <TableCell>
                      <Typography
                        component="span"
                        variant="body2"
                        fontWeight="500"
                      >
                        {order.id}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        marginTop="6px"
                        lineHeight="1.3"
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
                    <TableCell>{deadlineDate.toLocaleDateString()}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>
                      <Chip
                        variant="outlined"
                        label={t(`priorities.${order.priority}`)}
                        sx={{
                          minWidth: '83px',
                          borderWidth: '2px',
                          borderRadius: '4px',
                          fontWeight: 500,
                          ...priorityColors[order.priority],
                        }}
                      />
                    </TableCell>
                    <TableCell>{order.brand}</TableCell>
                    <Hider roles={[UserRole.MANAGER]}>
                      <TableCell>{order.creator.fullName}</TableCell>
                    </Hider>
                    <Hider roles={[UserRole.EXECUTOR]}>
                      <TableCell>{order.executor.fullName}</TableCell>
                    </Hider>
                    <TableCell>
                      {new Intl.NumberFormat('ru', {
                        style: 'currency',
                        currency: 'RUB',
                        currencyDisplay: 'symbol',
                        minimumFractionDigits: 0,
                      }).format(order.cost)}
                    </TableCell>
                    <TableCell>
                      <Button
                        id="orderStatusMenuButton"
                        variant="contained"
                        color={statusColors[order.status!]}
                        disableElevation
                        endIcon={<KeyboardArrowDown />}
                        onClick={(e) => openStatusMenuHandler(e, order)}
                        aria-haspopup="true"
                        aria-controls={
                          isStatusMenuOpened ? 'orderStatusMenu' : undefined
                        }
                        aria-expanded={isStatusMenuOpened ? true : undefined}
                        size="small"
                        fullWidth
                        sx={{
                          minWidth: '123px',
                          whiteSpace: 'nowrap',
                          textTransform: 'none',
                          justifyContent: 'space-between',
                        }}
                      >
                        {t(`statuses.${order.status}`)}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        id="orderStatusMenu"
        MenuListProps={{
          'aria-labelledby': 'orderStatusMenuButton',
        }}
        anchorEl={anchorStatusMenu}
        open={isStatusMenuOpened}
        onClose={closeStatusMenuHandler}
      >
        {Object.values(OrderStatus).map((status) => (
          <MenuItem
            key={status}
            dense
            selected={selectedOrder?.status === status}
            onClick={() => updateOrderHandler(status)}
          >
            {t(`statuses.${status}`)}
          </MenuItem>
        ))}
      </Menu>
      <Menu
        id="orderActionsMenu"
        anchorEl={anchorActionsMenu}
        open={isActionsMenuOpened}
        onClose={closeActionsMenuHandler}
        MenuListProps={{
          'aria-labelledby': 'orderActionsBtn',
        }}
      >
        {dropdownOptions.map((option) => {
          if (
            (state === 'closed' && option.key !== 'unarchive') ||
            (state !== 'closed' && option.key === 'unarchive')
          ) {
            return
          }

          return (
            <MenuItem
              key={option.key}
              dense
              onClick={() => selectOptionHandler(option.key)}
            >
              <ListItemIcon>
                <option.icon fontSize="small" />
              </ListItemIcon>
              {t(`actions.${option.key}`)}
            </MenuItem>
          )
        })}
      </Menu>
      <OrderFormDialog
        open={openedDialogs.add}
        onClose={() => setOpenedDialogs('add', false)}
      />
      <OrderFormDialog
        open={openedDialogs.edit}
        onClose={() => setOpenedDialogs('edit', false)}
        title="dialogs.edit_order.title"
        successMessage="notifications.update_order.success"
        order={selectedOrder}
      />
      <Confirm
        title={t('dialogs.move_to_archive.title')}
        description={t('dialogs.move_to_archive.desc')}
        cancelBtnHandler={() => setOpenedDialogs('archive', false)}
        confirmBtnLabel={t('buttons.move')}
        confirmBtnHandler={archiveOrderHandler}
        open={openedDialogs.archive}
        maxWidth="xs"
        fullWidth
      />
      <Confirm
        title={t('dialogs.move_from_archive.title')}
        description={t('dialogs.move_from_archive.desc')}
        cancelBtnHandler={() => setOpenedDialogs('unarchive', false)}
        confirmBtnLabel={t('buttons.move')}
        confirmBtnHandler={archiveOrderHandler}
        open={openedDialogs.unarchive}
        maxWidth="xs"
        fullWidth
      />
      <Confirm
        title={t('dialogs.delete_order.title')}
        description={t('dialogs.delete_order.desc')}
        cancelBtnHandler={() => setOpenedDialogs('delete', false)}
        confirmBtnLabel={t('buttons.delete')}
        confirmBtnHandler={deleteOrderHandler}
        open={openedDialogs.delete}
        maxWidth="xs"
        fullWidth
      />
    </>
  )
}
