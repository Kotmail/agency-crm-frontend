import { FC, MouseEvent, useState } from "react";
import { Box, Button, ButtonProps, Chip, CircularProgress, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { visuallyHidden } from '@mui/utils';
import { KeyboardArrowDown, MoreHoriz } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useOrdersQuery } from "../redux/api/orderApi";
import { lightBlue, orange, teal } from '@mui/material/colors';
import { IOrder, OrderStatuses } from "../models/IOrder";

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

const statusColors: {[key in OrderStatuses]: ButtonProps['color'] } = {
  waiting: 'primary',
  accepted: 'warning',
  done: 'success',
}

export const OrderList: FC = () => {
  const { data: orders, isLoading: isOrdersLoading, isError: isOrdersLoadingError } = useOrdersQuery()
  const [anchorStatusMenu, setAnchorStatusMenu] = useState<null | HTMLElement>(null)
  const isOpenedStatusMenu = Boolean(anchorStatusMenu)
  const [selectedOrder, setSelectedOrder] = useState<null | IOrder>(null)
  const { t } = useTranslation()

  const openStatusMenuHandler = (e: MouseEvent<HTMLElement>, order: IOrder) => {
    setAnchorStatusMenu(e.currentTarget)
    setSelectedOrder(order)
  }

  const closeStatusMenuHandler = () => {
    setAnchorStatusMenu(null)
    setSelectedOrder(null)
  }

  if (isOrdersLoading) {
    return <CircularProgress />
  }

  if (isOrdersLoadingError) {
    return <Typography>Error...</Typography>
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          size="small"
          aria-label={t('order_list_table.label')}
          sx={{
            minWidth: 1300,
            '& .MuiTableCell-head': {
              lineHeight: 'normal'
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography component="span" sx={visuallyHidden}>{t('order_list_table.headings.actions')}</Typography>
              </TableCell>
              <TableCell>№</TableCell>
              <TableCell>{t('order_list_table.headings.deadline')}</TableCell>
              <TableCell>{t('order_list_table.headings.description')}</TableCell>
              <TableCell>{t('order_list_table.headings.priority')}</TableCell>
              <TableCell>{t('order_list_table.headings.brand')}</TableCell>
              <TableCell>{t('order_list_table.headings.creator')}</TableCell>
              <TableCell>{t('order_list_table.headings.executor')}</TableCell>
              <TableCell>{t('order_list_table.headings.cost')}</TableCell>
              <TableCell>{t('order_list_table.headings.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders && orders.map(order => {
              const createdDate = new Date(Date.parse(order.createdAt.toString()))
              const deadlineDate = new Date(Date.parse(order.deadline.toString()))

              return (
                <TableRow
                  key={order.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {<IconButton
                      id="orderActionsBtn"
                      aria-label={t('order_list_table.headings.actions')}
                      size="small"
                      aria-haspopup="true"
                    >
                      <MoreHoriz fontSize="small" />
                    </IconButton>}
                    </TableCell>
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
                  <TableCell>{order.creator.fullName}</TableCell>
                  <TableCell>{order.executor.fullName}</TableCell>
                  <TableCell>
                    {
                      new Intl.NumberFormat('ru', {
                        style: 'currency',
                        currency: 'RUB',
                        currencyDisplay: 'symbol',
                        minimumFractionDigits: 0,
                      }).format(order.cost)
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      id="orderStatusMenuButton"
                      variant="contained"
                      color={statusColors[order.status]}
                      disableElevation
                      endIcon={<KeyboardArrowDown />}
                      onClick={(e, ) => openStatusMenuHandler(e, order)}
                      aria-haspopup="true"
                      aria-controls={isOpenedStatusMenu ? 'orderStatusMenu' : undefined}
                      aria-expanded={isOpenedStatusMenu ? true : undefined}
                      size="small"
                      fullWidth
                      sx={{
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
        open={isOpenedStatusMenu}
        onClose={closeStatusMenuHandler}
      >
        {
          Object.values(OrderStatuses).map((status) => 
            <MenuItem
              key={status}
              dense
              selected={selectedOrder?.status === status}
              onClick={closeStatusMenuHandler}
            >
              {t(`statuses.${status}`)}
            </MenuItem>
          )
        }
      </Menu>
    </>
  );
}