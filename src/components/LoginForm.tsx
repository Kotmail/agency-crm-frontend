import { useEffect } from 'react'
import { Box, Stack, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useLoginUserMutation } from '../redux/api/authApi'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type Fields = {
  email: string
  password: string
}

const schema = Yup.object({
  email: Yup.string()
    .email('form_errors.email.invalid')
    .required('form_errors.email.required'),
  password: Yup.string().required('form_errors.password.required'),
})

export const LoginForm = () => {
  const { t } = useTranslation()
  const [loginUser, { isSuccess: isLoginSuccess, isError: isLoginError }] =
    useLoginUserMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: yupResolver(schema),
  })
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<Fields> = async (formData) =>
    await loginUser(formData)

  useEffect(() => {
    if (isLoginError) {
      enqueueSnackbar(t('notifications.login.fail'), {
        variant: 'error',
      })
    }

    if (isLoginSuccess) {
      enqueueSnackbar(t('notifications.login.success'), {
        variant: 'success',
      })

      navigate('dashboard')
    }
  }, [isLoginSuccess, isLoginError])

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2}>
        <TextField
          label={`${t('input_placeholders.email')} *`}
          {...register('email')}
          error={!!errors.email}
          helperText={t(errors.email?.message || '')}
        />
        <TextField
          type="password"
          label={`${t('input_placeholders.password')} *`}
          {...register('password')}
          error={!!errors.password}
          helperText={t(errors.password?.message || '')}
        />
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          size="large"
          variant="contained"
        >
          {t('buttons.login')}
        </LoadingButton>
      </Stack>
    </Box>
  )
}
