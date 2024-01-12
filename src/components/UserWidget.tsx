import { Logout, Settings } from "@mui/icons-material";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { clearAuthData } from "../redux/features/authSlice";

const options = [
  {
    key: 'settings',
    icon: Settings,
    text: 'Настройки',
  },
  {
    key: 'logout',
    icon: Logout,
    text: 'Выйти',
  }
]

export const UserWidget: FC = () => {
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
      <Tooltip title='Меню пользователя'>
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
        </MenuItem>
        <Divider />
        {options.map(option =>
          <MenuItem key={option.key} onClick={() => selectOptionHandler(option.key)}>
            <ListItemIcon>
              <option.icon fontSize="small" />
            </ListItemIcon>
            {option.text}
          </MenuItem>
        )}
      </Menu>
    </>
  );
}