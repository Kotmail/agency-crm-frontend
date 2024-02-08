import { SnackbarProvider } from "notistack"
import { LoginPage } from "./pages/LoginPage"
import { CircularProgress, ScopedCssBaseline } from "@mui/material"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { Dashboard } from "./pages/dashboard"
import { useVerifyUserQuery } from "./redux/api/authApi"
import { FC, useLayoutEffect } from "react"
import { UsersPage } from "./pages/dashboard/UsersPage"
import { OrdersPage } from "./pages/dashboard/OrdersPage"

const App: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoading, isSuccess } = useVerifyUserQuery()

  useLayoutEffect(() => {
    if (isSuccess && location.pathname === '/') {
      navigate('/dashboard')
    }
  }, [isSuccess])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <ScopedCssBaseline>
      <SnackbarProvider>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path='users' element={<UsersPage />} />
            <Route path='orders' element={<OrdersPage />} />
          </Route>
        </Routes>
      </SnackbarProvider>
    </ScopedCssBaseline>
  )
}

export default App
