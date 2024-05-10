import { useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Menu as MenuIcon,
  LibraryBooksOutlined,
  Inventory2Outlined,
  PeopleAltOutlined,
} from '@mui/icons-material'
import { UserSnippet } from './UserSnippet'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IUser, UserRole } from '../models/IUser'
import { useAppSelector } from '../hooks/useAppSelector'

const pages = [
  {
    name: 'orders',
    pathname: '/orders',
    icon: LibraryBooksOutlined,
  },
  {
    name: 'archive',
    pathname: '/archive',
    icon: Inventory2Outlined,
  },
  {
    name: 'users',
    pathname: '/users',
    icon: PeopleAltOutlined,
    allowedRoles: [UserRole.ADMIN],
  },
]

const getPagesByUserRole = (user: IUser) =>
  pages.filter(
    (page) => !page.allowedRoles || page.allowedRoles.includes(user.role),
  )

export const Header = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const selectNavPageHandler = (pathname: string) => {
    navigate(pathname)
    handleCloseNavMenu()
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ alignItems: 'stretch' }}>
          <Box display="flex">
            {user && pages.length > 0 && (
              <>
                <IconButton
                  size="large"
                  aria-label={t('aria_labels.list_of_pages')}
                  aria-controls="appBarNavigation"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{
                    display: { md: 'none' },
                    marginLeft: '-12px',
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="appBarNavigation"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: {
                      xs: 'block',
                      md: 'none',
                    },
                  }}
                >
                  {getPagesByUserRole(user).map((page) => (
                    <MenuItem
                      key={page.pathname}
                      dense
                      selected={location.pathname === page.pathname}
                      onClick={() => selectNavPageHandler(page.pathname)}
                    >
                      <ListItemIcon>
                        <page.icon />
                      </ListItemIcon>
                      {t(`pages.${page.name}`)}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
            <Typography
              variant="h5"
              display="flex"
              alignItems="center"
              marginRight={3}
            >
              CRM
            </Typography>
            {user && pages.length > 0 && (
              <>
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'flex',
                      gap: '15px',
                    },
                  }}
                >
                  {getPagesByUserRole(user).map((page) => (
                    <Button
                      key={page.pathname}
                      onClick={() => selectNavPageHandler(page.pathname)}
                      className={
                        location.pathname === page.pathname ? 'current' : ''
                      }
                      startIcon={<page.icon />}
                      sx={{
                        position: 'relative',
                        color: 'white',
                        borderRadius: '0',
                        lineHeight: 'normal',
                        overflow: 'hidden',
                        textTransform: 'none',
                        fontSize: '15px',
                        '::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '-3px',
                          left: 0,
                          width: '100%',
                          height: '3px',
                          transition: 'bottom .2s',
                          backgroundColor: '#fff',
                        },
                        ':hover, :focus, &.current': {
                          '::after': {
                            bottom: 0,
                          },
                        },
                        '&.current': {
                          backgroundColor: 'rgb(0 0 0 / 5%)',
                        },
                        '.MuiButton-startIcon': {
                          marginLeft: 0,
                        },
                      }}
                    >
                      {t(`pages.${page.name}`)}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Box>
          <Box display="flex" alignItems="center" marginLeft="auto">
            <UserSnippet />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
