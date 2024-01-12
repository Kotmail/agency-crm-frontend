import { FC, useEffect } from "react";
import { Box, Stack, TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useLoginUserMutation } from "../redux/api/authApi";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

type Fields = {
  email: string;
  password: string;
}

const schema = Yup.object({
  email: Yup
    .string()
    .email('Введён некорректный e-mail')
    .required('Необходимо ввести e-mail'),
  password: Yup
    .string()
    .required('Необходимо ввести пароль')
})

export const LoginForm: FC = () => {
  const [loginUser, { isSuccess: isLoginSuccess, isError: isLoginError }] = useLoginUserMutation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({
    resolver: yupResolver(schema)
  })
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Fields> = async (formData) => await loginUser(formData)
  
  useEffect(() => {
    if (isLoginError) {
      enqueueSnackbar('Введены некорректные данные', {
        variant: 'error',
      })
    }

    if (isLoginSuccess) {
      enqueueSnackbar('Вы успешно вошли в систему', {
        variant: 'success',
      })

      navigate('dashboard')
    }
  }, [isLoginSuccess, isLoginError])

  return (
    <Box
      component='form'
      display='flex'
      flexDirection='column'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2}>
        <TextField
          label='E-mail *'
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          type='password'
          label='Пароль *'
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <LoadingButton loading={isSubmitting} type="submit" size='large' variant='contained'>Войти</LoadingButton>
      </Stack>
    </Box>
  )
}