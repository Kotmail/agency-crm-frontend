import {
  SvgIconComponent,
  ExitToAppOutlined,
  SettingsOutlined,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
  Typography,
} from '@mui/material'
import { MouseEvent, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { clearAuthData } from '../redux/features/authSlice'
import { useTranslation } from 'react-i18next'
import { useDialogs } from '../hooks/useDialogs'
import { apiSlice } from '../redux/api'
import { UserFormDialog, UserFormDialogProps } from './dialogs/UserFormDialog'
import { ConfirmDialog, ConfirmDialogProps } from './dialogs/ConfirmDialog'
import { DIALOG_BASE_OPTIONS } from '../utils/consts'
import { formatUserFullName } from '../utils/helpers/formatUserFullName'

type DialogVariants = {
  userForm: UserFormDialogProps
  confirm: ConfirmDialogProps
}

type DropdownOption = {
  key: 'settings' | 'logout'
  icon: SvgIconComponent
}

const dropdownOptions: DropdownOption[] = [
  {
    key: 'settings',
    icon: SettingsOutlined,
  },
  {
    key: 'logout',
    icon: ExitToAppOutlined,
  },
]

export const UserSnippet = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    userForm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.form.accountSettings,
      user,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.logoutUser,
      confirmBtnHandler: () => logoutHandler(),
      maxWidth: 'xs',
      fullWidth: true,
    },
  })
  const { t } = useTranslation()
  const [popperAnchor, setAnchorPopper] = useState<null | HTMLButtonElement>(
    null,
  )
  const isPopperOpened = Boolean(popperAnchor)
  const popperId = useId()

  const openPopperHandler = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorPopper(e.currentTarget)

  const closePopperHandler = () => setAnchorPopper(null)

  const selectOptionHandler = (optionKey: DropdownOption['key']) => {
    switch (optionKey) {
      case 'settings':
        openDialog('userForm')
        break
      case 'logout':
        openDialog('confirm')
        break
    }

    closePopperHandler()
  }

  const logoutHandler = () => {
    dispatch(clearAuthData())
    dispatch(apiSlice.util.resetApiState())
    navigate('/', {
      replace: true,
    })
  }

  return (
    <>
      <Tooltip title={t('tooltips.user_menu')}>
        <IconButton onClick={openPopperHandler} sx={{ p: 0 }}>
          <Avatar sx={{ width: 34, height: 34 }} />
        </IconButton>
      </Tooltip>
      <Popper
        id={popperId}
        open={isPopperOpened}
        anchorEl={popperAnchor}
        placement="top-end"
        transition
        sx={{
          zIndex: 5,
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top',
              minWidth: 180,
              marginTop: 10,
            }}
          >
            <Paper elevation={6}>
              <ClickAwayListener onClickAway={closePopperHandler}>
                <Box>
                  {user && (
                    <>
                      <Box sx={{ padding: '7px 16px' }}>
                        <Typography
                          fontSize={15}
                          fontWeight={500}
                          lineHeight={1.25}
                        >
                          {formatUserFullName(user.fullName)}
                        </Typography>
                        <Typography fontSize={14} fontWeight={300} color="gray">
                          {t(`user_roles.${user.role}`)}
                        </Typography>
                      </Box>
                      <Divider />
                    </>
                  )}
                  <MenuList>
                    {dropdownOptions.map((option) => (
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
                    ))}
                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <UserFormDialog {...dialogs.userForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
