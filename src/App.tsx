import { SnackbarProvider } from 'notistack'
import { LoginPage } from './pages/LoginPage'
import {
  CircularProgress,
  ScopedCssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useVerifyUserQuery } from './redux/api/authApi'
import { useLayoutEffect } from 'react'
import { OrdersPage } from './pages/OrdersPage'
import { UsersPage } from './pages/UsersPage'
import { ArchivePage } from './pages/ArchivePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { AuthGuard } from './components/AuthGuard'
import { UserRole } from './models/IUser'
import { NotFoundPage } from './pages/NotFoundPage'
import { DashboardLayout } from './layouts/DashboardLayout'
import {
  red,
  blue,
  lightBlue,
  purple,
  green,
  orange,
} from '@mui/material/colors'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  components: {
    MuiScopedCssBaseline: {
      styleOverrides: {
        root: {
          height: 'inherit',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        lineHeight: 'normal',
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPagination: {
      defaultProps: {
        variant: 'outlined',
        shape: 'rounded',
        color: 'primary',
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 26,
          borderRadius: 4,
          fontWeight: 600,
          fontSize: 12,
        },
        label: {
          padding: '0 8px',
        },
        filled: ({ ownerState }) => ({
          ...(ownerState.color === 'error' && {
            backgroundColor: red[100],
            color: red[400],
          }),
          ...(ownerState.color === 'primary' && {
            backgroundColor: blue[100],
            color: blue[800],
          }),
          ...(ownerState.color === 'info' && {
            backgroundColor: lightBlue[100],
            color: lightBlue[800],
          }),
          ...(ownerState.color === 'secondary' && {
            backgroundColor: purple[100],
            color: purple[500],
          }),
          ...(ownerState.color === 'success' && {
            backgroundColor: green[100],
            color: green[800],
          }),
          ...(ownerState.color === 'warning' && {
            backgroundColor: orange[100],
            color: orange[800],
          }),
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 28,
          height: 28,
          fontSize: 13,
        },
      },
    },
    MuiLinearProgress: {
      defaultProps: {
        variant: 'determinate',
      },
      styleOverrides: {
        root: {
          height: '6px',
          borderRadius: '10px',
          backgroundColor: '#ddd',
        },
        bar: {
          borderRadius: '10px',
          backgroundColor: green[500],
        },
      },
    },
  },
})

const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoading, isSuccess } = useVerifyUserQuery()

  useLayoutEffect(() => {
    if (isSuccess && location.pathname === '/') {
      navigate('orders')
    }
  }, [isSuccess])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline>
        <SnackbarProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              element={
                <AuthGuard
                  allowedRoles={{
                    users: [UserRole.ADMIN],
                  }}
                />
              }
            >
              <Route element={<DashboardLayout />}>
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SnackbarProvider>
      </ScopedCssBaseline>
    </ThemeProvider>
  )
}

export default App
