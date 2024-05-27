import { Box, Container } from '@mui/material'
import { Header } from '../components/Header'
import { Outlet } from 'react-router-dom'

export const DashboardLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100%',
        backgroundColor: '#f3f5f7',
      }}
    >
      <Header />
      <Container maxWidth="lg">
        <Box paddingTop="30px" paddingBottom="40px">
          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}
