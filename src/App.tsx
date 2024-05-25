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
import { AuthGuard } from './components/AuthGuard'
import { UserRole } from './models/IUser'
import { NotFoundPage } from './pages/NotFoundPage'

const theme = createTheme({
  components: {
    MuiScopedCssBaseline: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPagination: {
      defaultProps: {
        variant: 'outlined',
        shape: 'rounded',
        color: 'primary',
      },
      styleOverrides: {
        ul: {
          rowGap: '6px',
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
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/archive" element={<ArchivePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SnackbarProvider>
      </ScopedCssBaseline>
    </ThemeProvider>
  )
}

export default App
