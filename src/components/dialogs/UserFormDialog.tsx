import { useEffect, useRef, useState } from 'react'
import { IUser, UserRole } from '../../models/IUser'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Controller,
  DefaultValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from '../../redux/api/usersApi'
import { useAppSelector } from '../../hooks/useAppSelector'
import { isQueryError } from '../../redux/api/helpers'
import { enqueueSnackbar } from 'notistack'
import { AvatarUploader } from '../AvatarUploader'

type UserFormFields = {
  email: string
  login: string | null
  firstName: string
  lastName: string
  password: string
  passwordConfirm: string
  role: UserRole
  avatar: FileList | null
}

const yupPasswordFieldHandler = (value: unknown, isRequired = true) => {
  if (!value) {
    if (isRequired) {
      return Yup.string().trim().required('form_errors.password.required')
    }

    return Yup.string().trim().defined()
  }

  return Yup.string()
    .trim()
    .defined()
    .min(10, 'form_errors.password.min_length')
    .matches(/^(?=.*[a-z])/, 'form_errors.password.has_lower_case')
    .matches(/^(?=.*[A-Z])/, 'form_errors.password.has_upper_case')
    .matches(/^(?=.*[0-9])/, 'form_errors.password.has_number')
    .matches(/^(?=.*[!@#%&$*~)(?])/, 'form_errors.password.has_special_char')
}

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 524288 // 0.5MB

const createUserSchema = Yup.object({
  login: Yup.string().defined().nullable(),
  email: Yup.string()
    .email('form_errors.email.invalid')
    .required('form_errors.email.required'),
  firstName: Yup.string().required('form_errors.first_name.required'),
  lastName: Yup.string().required('form_errors.last_name.required'),
  password: Yup.lazy((value) => yupPasswordFieldHandler(value)),
  passwordConfirm: Yup.string()
    .defined()
    .oneOf([Yup.ref('password')], 'form_errors.password_confirm.match'),
  role: Yup.mixed<UserRole>().oneOf(Object.values(UserRole)).defined(),
  avatar: Yup.mixed<FileList>()
    .defined()
    .test(
      'fileFormat',
      'form_errors.avatar.file_type',
      (files) =>
        !(files instanceof FileList) ||
        !files.length ||
        ALLOWED_FORMATS.includes(files[0].type),
    )
    .test(
      'fileSize',
      'form_errors.avatar.file_size',
      (files) =>
        !(files instanceof FileList) ||
        !files.length ||
        files[0].size <= MAX_FILE_SIZE,
    )
    .nullable(),
})

const updateUserSchema = createUserSchema.shape({
  password: Yup.lazy((value) => yupPasswordFieldHandler(value, false)),
})

export type UserFormDialogProps = {
  title?: string
  user?: IUser | null
  successMessage?: string
} & DialogProps

const defaultValues: DefaultValues<UserFormFields> = {
  role: UserRole.ADMIN,
}

export const UserFormDialog = ({
  user,
  title,
  successMessage,
  onClose,
  ...props
}: UserFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserFormFields>({
    resolver: yupResolver(user ? updateUserSchema : createUserSchema),
    defaultValues,
  })
  const formRef = useRef<HTMLFormElement | null>(null)
  const { user: authUser } = useAppSelector((state) => state.auth)
  const [addUser] = useAddUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const { t } = useTranslation()
  const isUserSameAuth = authUser?.id == user?.id
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const avatarPreview =
    user && user.avatar ? import.meta.env.VITE_AVATARS_PATH + user.avatar : null

  useEffect(() => {
    if (user) {
      reset({ ...user, avatar: undefined })
    } else {
      reset(defaultValues)
    }
  }, [user, reset])

  const onSubmit: SubmitHandler<UserFormFields> = async (data) => {
    const formData = new FormData(formRef.current || undefined)

    if (avatarFile) {
      formData.set('avatar', avatarFile)
    }

    if (data.avatar === null) {
      formData.set('avatar', 'null')
    }

    try {
      if (!user) {
        await addUser(formData).unwrap()
        reset()
      } else {
        await updateUser({ id: user.id, formData }).unwrap()
      }

      closeDialogHandler()

      enqueueSnackbar(t(successMessage || 'notifications.add_user.success'), {
        variant: 'success',
      })
    } catch (err) {
      if (
        isQueryError(err) &&
        err.data &&
        typeof err.data === 'object' &&
        'message' in err.data
      ) {
        if (Array.isArray(err.data.message)) {
          err.data.message.map((message) =>
            enqueueSnackbar(message, { variant: 'error' }),
          )
        } else {
          enqueueSnackbar(err.data.message as string, { variant: 'error' })
        }
      }
    }
  }

  const onChangeAvatar = (value: File | null) => {
    if (value) {
      setAvatarFile(value)
      return
    }

    setValue('avatar', value)
    setAvatarFile(null)
    clearErrors('avatar')
  }

  const closeDialogHandler = () => {
    onClose && onClose({}, 'escapeKeyDown')
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      slotProps={{
        paper: {
          component: 'form',
          ref: formRef,
          onSubmit: handleSubmit(onSubmit),
        },
      }}
      {...props}
    >
      <DialogTitle
        lineHeight="normal"
        sx={{
          paddingBottom: 0,
          '+ div.MuiDialogContent-root': {
            paddingTop: '20px',
          },
        }}
      >
        {t(title || 'dialogs.add_user.title')}
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
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={t(errors.firstName?.message || '')}
            label={t('input_placeholders.first_name')}
            size="small"
          />
          <TextField
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={t(errors.lastName?.message || '')}
            label={t('input_placeholders.last_name')}
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
          <AvatarUploader
            preview={avatarPreview}
            label={t('input_placeholders.avatar')}
            onChangeHandler={onChangeAvatar}
            error={errors.avatar}
            {...register('avatar')}
          />
          {!isUserSameAuth && (
            <FormControl>
              <FormLabel>{t(`input_placeholders.role`)}</FormLabel>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {Object.values(UserRole).map((role) => (
                      <FormControlLabel
                        control={<Radio size="small" />}
                        value={role}
                        label={t(`user_roles.${role}`)}
                        key={role}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '8px 24px 16px' }}>
        <Button variant="outlined" onClick={closeDialogHandler}>
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting} variant="contained">
          {t(`buttons.${user ? 'save' : 'add'}`)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
