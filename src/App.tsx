import { SnackbarProvider } from 'notistack'
import { LoginPage } from './pages/LoginPage'
import { CircularProgress, ScopedCssBaseline } from '@mui/material'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Dashboard } from './pages/dashboard'
import { useVerifyUserQuery } from './redux/api/authApi'
import { FC, useEffect, useLayoutEffect } from 'react'
import { UsersPage } from './pages/dashboard/UsersPage'
import { OrdersPage } from './pages/dashboard/OrdersPage'
import { AuthGuard } from './components/AuthGuard'
import { UserRole } from './models/IUser'
import { ArchivePage } from './pages/dashboard/ArchivePage'
import { useTranslation } from 'react-i18next'

const App: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoading, isSuccess } = useVerifyUserQuery()
  const { t } = useTranslation()

  useLayoutEffect(() => {
    if (isSuccess && location.pathname === '/') {
      navigate('/dashboard')
    }
  }, [isSuccess])

  useEffect(() => {
    const locationPathsArray = location.pathname
      .split('/')
      .filter((path) => path)
    let currentPathname = locationPathsArray.pop()

    if (!currentPathname) {
      currentPathname = 'signin'
    }

    document.title = `${t('app_name')} — ${t(
      `page_header.titles.${currentPathname}`,
    )}`
  }, [location])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
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
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="orders" element={<OrdersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="archive" element={<ArchivePage />} />
            </Route>
          </Route>
        </Routes>
      </SnackbarProvider>
    </ScopedCssBaseline>
  )
}

export default App
