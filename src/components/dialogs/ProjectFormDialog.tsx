import { useEffect } from 'react'
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
import {
  CreateProjectRequest,
  useAddProjectMutation,
  useUpdateProjectMutation,
} from '../../redux/api/projectsApi'
import { IProject } from '../../models/IProject'
import { Priority } from '../../models/IProject'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

interface ProjectFormFields extends CreateProjectRequest {}

const createProjectSchema = Yup.object({
  name: Yup.string().required('form_errors.name.required'),
  description: Yup.string()
    .defined()
    .trim()
    .transform((value) => value || null)
    .nullable(),
  dueDate: Yup.date()
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
  priority: Yup.mixed<Priority>()
    .defined()
    .transform((value) => value || null)
    .oneOf([...Object.values(Priority), '' as Priority])
    .nullable(),
})

export type ProjectFormDialogProps = {
  title?: string
  project?: IProject | null
  successMessage?: string
  submitBtnLabel?: string
} & DialogProps

const defaultValues: DefaultValues<ProjectFormFields> = {
  dueDate: null,
  priority: '' as Priority,
}

export const ProjectFormDialog = ({
  project,
  title,
  successMessage,
  submitBtnLabel,
  onClose,
  ...props
}: ProjectFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormFields>({
    resolver: yupResolver(createProjectSchema),
  })
  const [addProject] = useAddProjectMutation()
  const [updateProject] = useUpdateProjectMutation()
  const { t } = useTranslation()

  useEffect(() => {
    if (project) {
      reset({
        ...project,
        priority: project.priority || defaultValues.priority,
      })
    } else {
      reset(defaultValues)
    }
  }, [project, reset])

  const onSubmit: SubmitHandler<ProjectFormFields> = async (data) => {
    try {
      if (!project || (project && !project.id)) {
        await addProject(data).unwrap()
        reset()
      } else {
        await updateProject({ id: project.id, ...data }).unwrap()
      }

      closeDialogHandler()

      enqueueSnackbar(
        t(successMessage || 'notifications.add_project.success'),
        {
          variant: 'success',
        },
      )
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
        {t(title || 'dialogs.add_project.title')}
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
            <InputLabel id="projectPrioritySelectLabel">
              {t('input_placeholders.priority')}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId="projectPrioritySelectLabel"
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
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '8px 24px 16px' }}>
        <Button variant="outlined" onClick={closeDialogHandler}>
          {t('buttons.cancel')}
        </Button>
        <LoadingButton type="submit" loading={isSubmitting} variant="contained">
          {t(submitBtnLabel || (project ? 'buttons.save' : 'buttons.add'))}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
