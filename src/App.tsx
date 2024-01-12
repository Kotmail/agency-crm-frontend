import { SnackbarProvider } from "notistack"
import { LoginPage } from "./pages/LoginPage"
import { CircularProgress, ScopedCssBaseline } from "@mui/material"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { Dashboard } from "./pages/dashboard"
import { useVerifyUserQuery } from "./redux/api/authApi"
import { FC, useEffect } from "react"

const App: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoading, isSuccess } = useVerifyUserQuery()

  useEffect(() => {
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
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </SnackbarProvider>
    </ScopedCssBaseline>
  )
}

export default App
