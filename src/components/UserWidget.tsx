import { Logout, Settings } from "@mui/icons-material";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { clearAuthData } from "../redux/features/authSlice";
import { useTranslation } from "react-i18next";

const options = [
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
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {user} = useAppSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const openOptionsHandler = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const closeOptionsHandler = () => setAnchorEl(null)

  const selectOptionHandler = (optionKey: string) => {
    switch (optionKey) {
      case 'logout':
        dispatch(clearAuthData())
        navigate('/')
        break;
    }

    closeOptionsHandler()
  }

  return (
    <>
      <Tooltip title={t('tooltips.user_menu')}>
        <IconButton onClick={openOptionsHandler} sx={{p: 0}}>
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
        onClose={closeOptionsHandler}
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
        {options.map(option =>
          <MenuItem key={option.key} onClick={() => selectOptionHandler(option.key)}>
            <ListItemIcon>
              <option.icon fontSize="small" />
            </ListItemIcon>
            {t(option.key)}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}