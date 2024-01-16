import { Logout, Settings } from "@mui/icons-material";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { clearAuthData } from "../redux/features/authSlice";
import { useTranslation } from "react-i18next";
import { Confirm } from "./dialogs/Confirm";
import { UserSettingsDialog } from "./dialogs/UserSettingsDialog";

const dropdownOptions = [
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
  const [isConfirmOpened, setIsConfirmOpened] = useState(false)
  const [isUserSettingsOpened, setIsUserSettingsOpened] = useState(false)

  const openDropdownHandler = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const closeDropdownHandler = () => setAnchorEl(null)

  const selectOptionHandler = (optionKey: string) => {
    switch (optionKey) {
      case 'settings':
        setIsUserSettingsOpened(true)
        break;
      case 'logout':
        setIsConfirmOpened(true)
        break;
    }

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
      <UserSettingsDialog onClose={() => setIsUserSettingsOpened(false)} open={isUserSettingsOpened} />
      <Confirm
        title={t('dialogs.logout_title')}
        description={t('dialogs.logout_desc')}
        cancelBtnHandler={() => setIsConfirmOpened(false)}
        confirmBtnLabel={t('buttons.logout')}
        confirmBtnHandler={logoutHandler}
        open={isConfirmOpened}
        maxWidth="xs"
        fullWidth
      />
    </>
  );
}