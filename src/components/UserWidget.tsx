import { SvgIconComponent, Logout, Settings } from "@mui/icons-material";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { clearAuthData } from "../redux/features/authSlice";
import { useTranslation } from "react-i18next";
import { Confirm } from "./dialogs/Confirm";
import { EditUserDialog } from "./dialogs/EditUserDialog";

type dropdownOption = {
  key: dialogVariantsEnum;
  icon: SvgIconComponent;
}

type dialogVariants = {
  settings: boolean;
  logout: boolean;
}

type dialogVariantsEnum = keyof dialogVariants

const dropdownOptions: dropdownOption[] = [
  {
    key: 'settings',
    icon: Settings,
  },
  {
    key: 'logout',
    icon: Logout,
  }
]

export const UserWidget: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const {user} = useAppSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [openedDialogs, setOpenedDialogs] = useState<dialogVariants>({
    settings: false,
    logout: false,
  })

  const openDropdownHandler = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const closeDropdownHandler = () => setAnchorEl(null)

  const dialogStateHandler = (dialogName: dialogVariantsEnum, isOpened: boolean) => {
    setOpenedDialogs({
      ...openedDialogs,
      [dialogName]: isOpened,
    })
  }

  const selectOptionHandler = (optionKey: dialogVariantsEnum) => {
    dialogStateHandler(optionKey, true)

    closeDropdownHandler()
  }

  const logoutHandler = () => {
    dispatch(clearAuthData())
    navigate('/')
  }

  return (
    <>
      <Tooltip title={t('tooltips.user_menu')}>
        <IconButton onClick={openDropdownHandler} sx={{p: 0}}>
          <Avatar sx={{width: 34, height: 34}} />
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
        <MenuItem disabled sx={{
          display: 'block',
          paddingTop: 0,
          paddingBottom: 0,
          '&.Mui-disabled': {
            opacity: 1
          }
        }}>
          <Typography fontSize={15} fontWeight={500} lineHeight={1.25}>{user?.fullName}</Typography>
          <Typography fontSize={14} fontWeight={300} color="gray">{t(`user.roles.${user?.role}`)}</Typography>
        </MenuItem>
        <Divider />
        {dropdownOptions.map(option =>
          <MenuItem key={option.key} onClick={() => selectOptionHandler(option.key)}>
            <ListItemIcon>
              <option.icon fontSize="small" />
            </ListItemIcon>
            {t(option.key)}
          </MenuItem>
        )}
      </Menu>
      {
        user &&
        <EditUserDialog
          open={openedDialogs.settings}
          onClose={() => dialogStateHandler('settings', false)}
          title={t('dialogs.account_settings_title')}
          successMessage={t('notifications.account_settings.success')}
          user={user}
        />
      }
      <Confirm
        title={t('dialogs.logout_title')}
        description={t('dialogs.logout_desc')}
        cancelBtnHandler={() => dialogStateHandler('logout', false)}
        confirmBtnLabel={t('buttons.logout')}
        confirmBtnHandler={logoutHandler}
        open={openedDialogs.logout}
        maxWidth="xs"
        fullWidth
      />
    </>
  );
}