import { FC } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useUsersQuery } from "../../redux/api/userApi";
import { useSnackbar } from "notistack";
import { isQueryError } from "../../redux/api/helpers";
import { OrderPriorities, OrderStatuses } from "../../models/IOrder";
import { CreateOrderRequest, useAddOrderMutation } from "../../redux/api/orderApi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)

const schema = Yup.object({
  deadline: Yup
    .string()
    .transform((value) => dayjs(value).format('YYYY-MM-DD'))
    .required(),
  description: Yup
    .string()
    .required('form_errors.description.required'),
  brand: Yup
    .string()
    .required('form_errors.brand.required'),
  cost: Yup
    .number()
    .transform(value => Number.isNaN(value) ? undefined : value )
    .required('form_errors.cost.required'),
  creatorId: Yup
    .number(),
  executorId: Yup
    .number()
    .required(),
  priority: Yup
    .mixed<OrderPriorities>()
    .oneOf(Object.values(OrderPriorities))
    .defined(),
  status: Yup
    .mixed<OrderStatuses>()
    .oneOf(Object.values(OrderStatuses))
    .defined(),
})

type AddOrderDialogProps = {
  title?: string;
  successMessage?: string;
} & DialogProps

export const AddOrderDialog: FC<AddOrderDialogProps> = ({ onClose, title, successMessage, ...props }) => {
  const { user: authUser } = useAppSelector(state => state.auth)
  const { data: users } = useUsersQuery()
  const { managers, executors } = {
    managers: users ? users.filter(user => user.role === 'manager') : [],
    executors: users ? users.filter(user => user.role === 'executor') : [],
  }
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<CreateOrderRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      deadline: dayjs().format('YYYY-MM-DD'),
      priority: OrderPriorities.LOW,
      status: OrderStatuses.WAITING,
    }
  })
  const [addOrder] = useAddOrderMutation()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  const onSubmit: SubmitHandler<CreateOrderRequest> = async (data) => {
    if (!data.creatorId) {
      data.creatorId = authUser?.id
    }

    try {
      await addOrder(data).unwrap()

      enqueueSnackbar(successMessage || t('notifications.add_order.success'), {
        variant: 'success',
      })

      closeDialogHandler()
      reset()
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
        {title || t('dialogs.add_order_title')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Controller
            render={({ field }) =>
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
                    }
                  }}
                  label="Дата выполнения"
                  value={dayjs.utc(field.value)}
                />
              </LocalizationProvider>
            }
            control={control}
            name="deadline"
          />
          {
            authUser?.role === 'admin'
              &&
            managers.length > 0
              &&
              <FormControl size="small">
                <InputLabel id="executorSelectLabel">{t('input_placeholders.manager')}</InputLabel>
                <Controller
                  render={
                    ({ field }) => <Select labelId="executorSelectLabel" label={t('input_placeholders.manager')} {...field}>
                      {managers.map((manager) =>
                          <MenuItem key={manager.id} value={manager.id}>{manager.fullName}</MenuItem>
                      )}
                    </Select>
                  }
                  control={control}
                  name="creatorId"
                  defaultValue={managers[0].id}
                />
              </FormControl>
          }
          {
            executors.length > 0
              &&
              <FormControl size="small">
                <InputLabel id="executorSelectLabel">{t('input_placeholders.executor')}</InputLabel>
                <Controller
                  render={
                    ({ field }) => <Select labelId="executorSelectLabel" label={t('input_placeholders.executor')} {...field}>
                      {executors.map((executor) =>
                          <MenuItem key={executor.id} value={executor.id}>{executor.fullName}</MenuItem>
                      )}
                    </Select>
                  }
                  control={control}
                  name="executorId"
                  defaultValue={executors[0].id}
                />
              </FormControl>
          }
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
              render={
                ({ field }) => (
                  <RadioGroup {...field}>
                    {Object.values(OrderPriorities).map(priority =>
                      <FormControlLabel
                        control={<Radio size="small" />}
                        value={priority}
                        label={t(`priorities.${priority}`)}
                        key={priority}
                      />
                    )}
                  </RadioGroup>
                )
              }
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{padding: '8px 24px 16px'}}>
        <Button variant="outlined" onClick={closeDialogHandler}>{t('buttons.cancel')}</Button>
        <LoadingButton
          type="submit" 
          loading={isSubmitting}
          variant="contained"
        >
          {t('buttons.add')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}