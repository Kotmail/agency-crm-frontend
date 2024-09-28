import { useEffect } from 'react'
import { string, number, object, date, mixed, array, ObjectSchema } from 'yup'
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
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useTranslation } from 'react-i18next'
import { isQueryError } from '../../redux/api/helpers'
import { enqueueSnackbar } from 'notistack'
import { ITask, TaskStatus } from '../../models/ITask'
import {
  CreateTaskRequest,
  useAddTaskMutation,
  useUpdateTaskMutation,
} from '../../redux/api/tasksApi'
import { IProject, Priority } from '../../models/IProject'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { IUser, UserRole } from '../../models/IUser'
import { RHFUserAutocompleteField } from '../RHFUserAutocompleteField'

interface TaskFormFields extends CreateTaskRequest {}

const userObjectSchema: ObjectSchema<IUser> = object({
  id: number().defined(),
  email: string().defined(),
  login: string().nullable().defined(),
  firstName: string().defined(),
  lastName: string().defined(),
  role: mixed<UserRole>().oneOf(Object.values(UserRole)).defined(),
  avatar: string().nullable().defined(),
})

const projectObjectSchema: ObjectSchema<IProject> = object({
  id: number().defined(),
  name: string().defined(),
  description: string().defined().nullable(),
  dueDate: date().defined().nullable(),
  priority: mixed<Priority>()
    .oneOf(Object.values(Priority))
    .defined()
    .nullable(),
  creator: object().concat(userObjectSchema).defined(),
  members: array<IUser>().defined(),
  createdAt: date().defined(),
  taskTotal: number().optional(),
  taskCompleted: number().optional(),
})

const createTaskSchema = object({
  name: string().required('form_errors.name.required'),
  description: string()
    .defined()
    .trim()
    .transform((value) => value || null)
    .nullable(),
  project: object().concat(projectObjectSchema).defined(),
  dueDate: date()
    .defined()
    .transform((value: Date) => {
      if (!value) {
        return null
      }

      const date = new Date(value)

      date.setHours(0, 0, 0, 0)

      return date
    })
    .nullable(),
  status: mixed<TaskStatus>().defined().oneOf(Object.values(TaskStatus)),
  priority: mixed<Priority>()
    .defined()
    .transform((value) => value || null)
    .oneOf([...Object.values(Priority), '' as Priority])
    .nullable(),
  responsibleUsers: array<IUser>().defined(),
})

export type TaskFormDialogProps = {
  title?: string
  task?: ITask | null
  project: IProject
  successMessage?: string
  submitBtnLabel?: string
} & DialogProps

const defaultValues: DefaultValues<TaskFormFields> = {
  dueDate: null,
  status: TaskStatus.UNSORTED,
  priority: '' as Priority,
  responsibleUsers: [],
}

export const TaskFormDialog = ({
  task,
  project,
  title,
  successMessage,
  submitBtnLabel,
  onClose,
  ...props
}: TaskFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormFields>({
    resolver: yupResolver(createTaskSchema),
  })
  const [addTask] = useAddTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const { t } = useTranslation()
  const hasProjectMembers = project.members.length > 0

  useEffect(() => {
    const values = task || defaultValues

    reset({
      ...values,
      priority: values.priority || defaultValues.priority,
      project,
    })
  }, [task, project, reset])

  const onSubmit: SubmitHandler<TaskFormFields> = async (data) => {
    try {
      if (!task || (task && !task.id)) {
        await addTask(data).unwrap()
        reset()
      } else {
        await updateTask({ id: task.id, ...data }).unwrap()
      }

      closeDialogHandler()

      enqueueSnackbar(t(successMessage || 'notifications.add_task.success'), {
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
        {t(title || 'dialogs.add_task.title')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            {...register('name')}
            error={!!errors.name}
            helperText={t(errors.name?.message || '')}
            label={t('input_placeholders.name')}
            size="small"
          />
          <TextField
            {...register('description')}
            error={!!errors.description}
            helperText={t(errors.description?.message || '')}
            label={t('input_placeholders.description')}
            size="small"
            multiline
            rows="4"
          />
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
                      error: !!errors.dueDate,
                      helperText: t(errors.dueDate?.message || ''),
                    },
                  }}
                  label={t('input_placeholders.due_date')}
                  value={(field.value && dayjs(field.value)) || null}
                />
              </LocalizationProvider>
            )}
            control={control}
            name="dueDate"
          />
          <FormControl size="small">
            <InputLabel id="taskPrioritySelectLabel">
              {t('input_placeholders.priority')}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="taskPrioritySelectLabel"
                  label={t('input_placeholders.priority')}
                  {...field}
                >
                  <MenuItem value="">—</MenuItem>
                  {Object.values(Priority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {t(`priorities.${priority}`)}
                    </MenuItem>
                  ))}
                </Select>
              )}
              control={control}
              name="priority"
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel id="taskStatusSelectLabel">
              {t('input_placeholders.status')}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="taskStatusSelectLabel"
                  label={t('input_placeholders.status')}
                  {...field}
                >
                  {Object.values(TaskStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {t(`statuses.${status}`)}
                    </MenuItem>
                  ))}
                </Select>
              )}
              control={control}
              name="status"
            />
          </FormControl>
          <RHFUserAutocompleteField
            control={control}
            name="responsibleUsers"
            options={project.members}
            multiple
            disabled={!hasProjectMembers}
            helperText={
              (!hasProjectMembers &&
                'input_helpers.responsibleUsers.assign_users') ||
              undefined
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '8px 24px 16px' }}>
        <Button variant="outlined" onClick={closeDialogHandler}>
          {t('buttons.cancel')}
        </Button>
        <LoadingButton type="submit" loading={isSubmitting} variant="contained">
          {t(submitBtnLabel || (task ? 'buttons.save' : 'buttons.add'))}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
