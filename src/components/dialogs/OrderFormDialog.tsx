import { useEffect } from 'react'
import { IOrder, OrderPriority } from '../../models/IOrder'
import { UserRole } from '../../models/IUser'
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
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import {
  useAddOrderMutation,
  useUpdateOrderMutation,
} from '../../redux/api/ordersApi'
import { useUsersQuery } from '../../redux/api/usersApi'
import { useAppSelector } from '../../hooks/useAppSelector'
import { isQueryError } from '../../redux/api/helpers'
import { enqueueSnackbar } from 'notistack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type OrderFormFields = {
  deadline: string
  creatorId: number
  executorId: number
  description: string
  objectAddress: string
  brand: string
  cost: number
  priority: OrderPriority
}

const createOrderSchema = Yup.object({
  deadline: Yup.string()
    .transform((value) => dayjs(value).format('YYYY-MM-DD'))
    .required(),
  description: Yup.string()
    .required('form_errors.description.required')
    .min(15, 'form_errors.description.min_length'),
  objectAddress: Yup.string()
    .required('form_errors.object_address.required')
    .min(10, 'form_errors.object_address.min_length'),
  brand: Yup.string()
    .required('form_errors.brand.required')
    .min(5, 'form_errors.brand.min_length'),
  cost: Yup.number()
    .transform((value) => (Number.isNaN(value) ? undefined : value))
    .required('form_errors.cost.required')
    .positive('form_errors.cost.positive'),
  creatorId: Yup.number().defined(),
  executorId: Yup.number().required(),
  priority: Yup.mixed<OrderPriority>()
    .oneOf(Object.values(OrderPriority))
    .defined(),
})

export type OrderFormDialogProps = {
  title?: string
  order?: IOrder | null
  successMessage?: string
  submitBtnLabel?: string
} & DialogProps

const defaultValues: DefaultValues<OrderFormFields> = {
  deadline: dayjs().format('YYYY-MM-DD'),
  priority: OrderPriority.LOW,
}

export const OrderFormDialog = ({
  order,
  title,
  successMessage,
  submitBtnLabel,
  onClose,
  ...props
}: OrderFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormFields>({
    resolver: yupResolver(createOrderSchema),
    defaultValues,
  })
  const { user: authUser } = useAppSelector((state) => state.auth)
  const { data: users } = useUsersQuery({
    take: 200,
    role: [UserRole.MANAGER, UserRole.EXECUTOR],
  })
  const { managers, executors } = {
    managers: users ? users[0].filter((user) => user.role === 'manager') : [],
    executors: users ? users[0].filter((user) => user.role === 'executor') : [],
  }
  const [addOrder] = useAddOrderMutation()
  const [updateOrder] = useUpdateOrderMutation()
  const { t } = useTranslation()

  useEffect(() => {
    reset(order || defaultValues)
  }, [order, reset])

  const onSubmit: SubmitHandler<OrderFormFields> = async (data) => {
    try {
      if (!order || (order && !order.id)) {
        await addOrder(data).unwrap()
        reset()
      } else {
        await updateOrder({ id: order.id, ...data }).unwrap()
      }

      closeDialogHandler()

      enqueueSnackbar(t(successMessage || 'notifications.add_order.success'), {
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

  const getDefaultManagerId = () => {
    if (order) {
      return order.creator.id
    }

    if (authUser?.role === UserRole.MANAGER) {
      const currentManagerIdx = managers.findIndex(
        (manager) => manager.id === authUser?.id,
      )

      return managers[currentManagerIdx].id
    }

    return managers[0].id
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
        onSubmit: handleSubmit(onSubmit),
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
        {t(title || 'dialogs.add_order.title')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Controller
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...field}
                  format="DD.MM.YYYY"
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      error: !!errors.deadline,
                      helperText: t(errors.deadline?.message || ''),
                    },
                  }}
                  label="Дата выполнения"
                  value={dayjs.utc(field.value)}
                />
              </LocalizationProvider>
            )}
            control={control}
            name="deadline"
          />
          {managers.length > 0 && (
            <FormControl size="small">
              <InputLabel id="executorSelectLabel">
                {t('input_placeholders.manager')}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="executorSelectLabel"
                    label={t('input_placeholders.manager')}
                    {...field}
                  >
                    {managers.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        {manager.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="creatorId"
                defaultValue={getDefaultManagerId()}
              />
            </FormControl>
          )}
          {executors.length > 0 && (
            <FormControl size="small">
              <InputLabel id="executorSelectLabel">
                {t('input_placeholders.executor')}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId="executorSelectLabel"
                    label={t('input_placeholders.executor')}
                    {...field}
                  >
                    {executors.map((executor) => (
                      <MenuItem key={executor.id} value={executor.id}>
                        {executor.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name="executorId"
                defaultValue={order ? order.executor.id : executors[0].id}
              />
            </FormControl>
          )}
          <TextField
            {...register('description')}
            error={!!errors.description}
            helperText={t(errors.description?.message || '')}
            label={t('input_placeholders.description')}
            size="small"
            multiline
            rows="4"
          />
          <TextField
            {...register('objectAddress')}
            error={!!errors.objectAddress}
            helperText={t(errors.objectAddress?.message || '')}
            label={t('input_placeholders.object_address')}
            size="small"
          />
          <TextField
            {...register('brand')}
            error={!!errors.brand}
            helperText={t(errors.brand?.message || '')}
            label={t('input_placeholders.brand')}
            size="small"
          />
          <TextField
            type="number"
            {...register('cost')}
            error={!!errors.cost}
            helperText={t(errors.cost?.message || '')}
            label={t('input_placeholders.cost')}
            size="small"
          />
          <FormControl>
            <FormLabel>{t('input_placeholders.priority')}</FormLabel>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <RadioGroup {...field}>
                  {Object.values(OrderPriority).map((priority) => (
                    <FormControlLabel
                      control={<Radio size="small" />}
                      value={priority}
                      label={t(`order_priorities.${priority}`)}
                      key={priority}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '8px 24px 16px' }}>
        <Button variant="outlined" onClick={closeDialogHandler}>
          {t('buttons.cancel')}
        </Button>
        <LoadingButton type="submit" loading={isSubmitting} variant="contained">
          {t(submitBtnLabel || (order ? 'buttons.save' : 'buttons.add'))}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
