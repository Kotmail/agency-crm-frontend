import { Box, TableCell, TableRow, Typography } from '@mui/material'
import { PriorityChip } from '../PriorityChip'
import { Hider } from '../Hider'
import { StatusSwitcher } from '../StatusSwitcher'
import { IOrder, OrderStatus } from '../../models/IOrder'
import { useTranslation } from 'react-i18next'
import { ActionItem, ActionItemKeys, ActionsDropdown } from '../ActionsDropdown'
import { UserRole } from '../../models/IUser'

type OrderTableRowProps = {
  order: IOrder
  actionsDropdownItems: ActionItem[]
  onSelectActionHandler: (order: IOrder, action: ActionItemKeys) => void
  onChangeStatusHandler: (id: number, status: OrderStatus) => void
}

export const OrderTableRow = ({
  order,
  actionsDropdownItems,
  onSelectActionHandler,
  onChangeStatusHandler,
}: OrderTableRowProps) => {
  const { t } = useTranslation()

  const createdDate = new Date(Date.parse(order.createdAt.toString()))
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
            actions={actionsDropdownItems}
            onSelectHandler={(action) => onSelectActionHandler(order, action)}
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
          <Box component="span" display="block" color="text.secondary">
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
      <TableCell className="cell-priority">
        <PriorityChip priority={order.priority} />
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
        <StatusSwitcher
          entityId={order.id}
          currentStatus={order.status!}
          onChangeHandler={(id, status) => onChangeStatusHandler(id, status)}
        />
      </TableCell>
    </TableRow>
  )
}
