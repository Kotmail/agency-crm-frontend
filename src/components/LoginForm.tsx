import { Box, Stack, TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useLoginUserMutation } from "../redux/api/authApi";
import { useEffect } from "react";
import { setUser } from "../redux/features/userSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSnackbar } from "notistack";

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

export const LoginForm = () => {
  const [loginUser, { data: loginResponseData, isSuccess: isLoginSuccess, isError: isLoginError }] = useLoginUserMutation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Fields>({
    resolver: yupResolver(schema)
  })
  const dispatch = useAppDispatch()

  const { enqueueSnackbar } = useSnackbar()

  const onSubmit: SubmitHandler<Fields> = async (formData) => {
    await loginUser(formData)
  }

  useEffect(() => { 
    if (isLoginSuccess && loginResponseData) {
      dispatch(setUser(loginResponseData))
      enqueueSnackbar('Вы успешно вошли в систему')
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