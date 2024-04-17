import {
  SvgIconComponent,
  ExitToAppOutlined,
  SettingsOutlined,
} from '@mui/icons-material'
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'
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

export const UserWidget = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [dialogs, openDialog] = useDialogs<DialogVariants>({
    userForm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.form.accountSettings,
      user: user,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.logoutUser,
      confirmBtnHandler: () => logoutHandler(),
      maxWidth: 'xs',
      fullWidth: true,
    },
  })

  const openDropdownHandler = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)
  const closeDropdownHandler = () => setAnchorEl(null)

  const selectOptionHandler = (optionKey: DropdownOption['key']) => {
    switch (optionKey) {
      case 'settings':
        openDialog('userForm')
        break
      case 'logout':
        openDialog('confirm')
        break
    }

    closeDropdownHandler()
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
        <IconButton onClick={openDropdownHandler} sx={{ p: 0 }}>
          <Avatar sx={{ width: 34, height: 34 }} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '40px' }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={closeDropdownHandler}
      >
        <MenuItem
          disabled
          dense
          sx={{
            display: 'block',
            paddingTop: 0,
            paddingBottom: 0,
            '&.Mui-disabled': {
              opacity: 1,
            },
          }}
        >
          {user && (
            <Typography fontSize={15} fontWeight={500} lineHeight={1.25}>
              {formatUserFullName(user.fullName)}
            </Typography>
          )}
          <Typography fontSize={14} fontWeight={300} color="gray">
            {t(`user.roles.${user?.role}`)}
          </Typography>
        </MenuItem>
        <Divider />
        {dropdownOptions.map((option) => (
          <MenuItem
            key={option.key}
            dense
            onClick={() => selectOptionHandler(option.key)}
          >
            <ListItemIcon>
              <option.icon fontSize="small" />
            </ListItemIcon>
            {t(option.key)}
          </MenuItem>
        ))}
      </Menu>
      <UserFormDialog {...dialogs.userForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
