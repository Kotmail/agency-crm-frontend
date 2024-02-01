import { FC, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateUserMutation } from "../../redux/api/userApi";
import { useSnackbar } from "notistack";
import { isQueryError } from "../../redux/api/helpers";
import { IUser } from "../../models/IUser";

type Fields = {
  login: string;
  email: string;
  fullName: string;
  password: string;
  passwordConfirm: string;
}

const schema = Yup.object({
  login: Yup
    .string()
    .defined(),
  email: Yup
    .string()
    .email('form_errors.email.invalid')
    .required('form_errors.email.required'),
  fullName: Yup
    .string()
    .required('form_errors.full_name.required'),
  password: Yup.lazy((value) => {
    const defaultRules = Yup.string().defined().trim()

    if (!value) {
      return defaultRules;
    }

    return defaultRules
      .min(10, 'form_errors.password.min_length')
      .matches(/^(?=.*[a-z])/, 'form_errors.password.has_lower_case')
      .matches(/^(?=.*[A-Z])/, 'form_errors.password.has_upper_case')
      .matches(/^(?=.*[0-9])/, 'form_errors.password.has_number')
      .matches(/^(?=.*[!@#%&$*~)(?])/, 'form_errors.password.has_special_char')
  }),
  passwordConfirm: Yup
    .string()
    .defined()
    .oneOf([Yup.ref('password')], 'form_errors.password_confirm.match')
})

type EditUserDialogProps = {
  user: IUser;
} & DialogProps

export const EditUserDialog: FC<EditUserDialogProps> = ({ onClose, user, ...props }) => {
  const { t } = useTranslation()
  const [updateUser] = useUpdateUserMutation()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Fields>({
    resolver: yupResolver(schema),
    defaultValues: {
      login: user.login,
      email: user.email,
      fullName: user.fullName,
      password: '',
      passwordConfirm: '',
    },
  })
  const { enqueueSnackbar } = useSnackbar()

  useEffect(()=> {
    reset(user)
  }, [user])

  const onSubmit: SubmitHandler<Fields> = async (data) => {
    try {
      const updatedUser = await updateUser({
        id: user.id,
        ...data
      }).unwrap()

      enqueueSnackbar(t('notifications.account_settings.success'), {
        variant: 'success',
      })

      closeDialogHandler()
      reset(updatedUser)
    } catch (err) {
      if (isQueryError(err) && err.data && typeof err.data === 'object' && 'message' in err.data) {
        if (Array.isArray(err.data.message)) {
          err.data.message.map(message => 
            enqueueSnackbar(message, { variant: 'error' })
          )
        } else {
          enqueueSnackbar(err.data.message as string, { variant: 'error' })
        }
      }
    }
  }

  const closeDialogHandler = () => {
    onClose && onClose({}, 'escapeKeyDown')
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit(onSubmit)
      }}
      {...props}
    >
      <DialogTitle lineHeight="normal" sx={{
        paddingBottom: 0,
        '+ div.MuiDialogContent-root': {
          paddingTop: '20px'
        }
      }}>
        {t('dialogs.account_settings_title')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            {...register('login')}
            label={t('input_placeholders.login')}
            size="small"
          />
          <TextField
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={t(errors.email?.message || '')}
            label={t('input_placeholders.email')}
            size="small"
          />
          <TextField
            {...register('fullName')}
            error={!!errors.fullName}
            helperText={t(errors.fullName?.message || '')}
            label={t('input_placeholders.full_name')}
            size="small"
          />
          <TextField
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={t(errors.password?.message || '')}
            label={t('input_placeholders.password')}
            size="small"
          />
          <TextField
            type="password"
            {...register('passwordConfirm')}
            error={!!errors.passwordConfirm}
            helperText={t(errors.passwordConfirm?.message || '')}
            label={t('input_placeholders.password_confirm')}
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{padding: '8px 24px 16px'}}>
        <Button variant="outlined" onClick={closeDialogHandler}>{t('buttons.cancel')}</Button>
        <LoadingButton
          type="submit" 
          loading={isSubmitting}
          variant="contained"
        >
          {t('buttons.save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}