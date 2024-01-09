import { SnackbarProvider } from "notistack"
import { LoginPage } from "./pages/LoginPage"
import { ScopedCssBaseline } from "@mui/material"

function App() {
  return (
    <ScopedCssBaseline>
      <SnackbarProvider>
        <LoginPage />
      </SnackbarProvider>
    </ScopedCssBaseline>
  )
}

export default App
