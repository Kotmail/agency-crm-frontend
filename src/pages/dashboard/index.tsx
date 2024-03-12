import { FC } from 'react'
import { Header } from '../../components/Header'
import { Outlet } from 'react-router-dom'
import { Box, Container } from '@mui/material'

export const Dashboard: FC = () => {
  return (
    <>
      <Header />
      <Container maxWidth="xl">
        <Box paddingTop="30px">
          <Outlet />
        </Box>
      </Container>
    </>
  )
}
