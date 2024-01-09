import { Avatar, Box, Typography } from "@mui/material";
import { LoginForm } from "../components/LoginForm";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { blue } from '@mui/material/colors';

export const LoginPage = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
      padding={2}
    >
      <Box width='100%' maxWidth={360}>
        <Avatar variant="rounded" sx={{margin: '0 auto 6px', bgcolor: blue[700]}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          variant='h5'
          component='h1'
          marginBottom={3}
          textAlign='center'
        >
          Вход в систему
        </Typography>
        <LoginForm />
      </Box>
    </Box>
  );
}