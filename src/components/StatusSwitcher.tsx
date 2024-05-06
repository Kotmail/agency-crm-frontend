import { MouseEvent, useId, useState } from 'react'
import { Button, ButtonProps, Menu, MenuItem } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { OrderStatus } from '../models/IOrder'
import { useTranslation } from 'react-i18next'

type StatusColors = {
  [key in OrderStatus]: ButtonProps['color']
}

const statusColors: StatusColors = {
  waiting: 'primary',
  accepted: 'warning',
  done: 'success',
}

type StatusSwitcherProps = {
  entityId: number
  currentStatus: OrderStatus
  onChangeHandler: (id: number, status: OrderStatus) => void
}

export const StatusSwitcher = ({
  entityId,
  currentStatus,
  onChangeHandler,
}: StatusSwitcherProps) => {
  const [anchorStatusMenu, setAnchorStatusMenu] = useState<null | HTMLElement>(
    null,
  )
  const isStatusMenuOpened = Boolean(anchorStatusMenu)
  const buttonId = useId()
  const menuId = useId()
  const { t } = useTranslation()

  const openStatusMenuHandler = (e: MouseEvent<HTMLElement>) =>
    setAnchorStatusMenu(e.currentTarget)
  const closeStatusMenuHandler = () => setAnchorStatusMenu(null)

  return (
    <>
      <Button
        id={buttonId}
        variant="contained"
        color={statusColors[currentStatus]}
        disableElevation
        endIcon={
          isStatusMenuOpened ? <KeyboardArrowUp /> : <KeyboardArrowDown />
        }
        onClick={openStatusMenuHandler}
        aria-haspopup="true"
        aria-controls={isStatusMenuOpened ? menuId : undefined}
        aria-expanded={isStatusMenuOpened ? true : undefined}
        size="small"
        fullWidth
        sx={{
          width: '123px',
          whiteSpace: 'nowrap',
          textTransform: 'none',
          justifyContent: 'space-between',
        }}
      >
        {t(`order_statuses.${currentStatus}`)}
      </Button>
      <Menu
        id={menuId}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
        anchorEl={anchorStatusMenu}
        open={isStatusMenuOpened}
        onClose={closeStatusMenuHandler}
      >
        {Object.values(OrderStatus).map((status) => {
          const isSelectedItem = currentStatus === status

          return (
            <MenuItem
              key={status}
              dense
              selected={isSelectedItem}
              onClick={() => {
                if (!isSelectedItem) {
                  onChangeHandler(entityId, status)
                }

                closeStatusMenuHandler()
              }}
            >
              {t(`order_statuses.${status}`)}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
