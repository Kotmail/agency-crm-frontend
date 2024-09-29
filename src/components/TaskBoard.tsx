import { Dictionary, groupBy } from 'lodash'
import { ITask, TaskStatus } from '../models/ITask'
import { ListBoard } from './ListBoard'
import { useEffect, useState } from 'react'
import { KanbanBoard } from './KanbanBoard'
import { useDeleteTaskMutation, useTasksQuery } from '../redux/api/tasksApi'
import { CircularProgress } from '@mui/material'
import { useProjectTabsContext } from '../hooks/useProjectTabsContext'
import { Outlet, useNavigate } from 'react-router-dom'
import { TaskFormDialog, TaskFormDialogProps } from './dialogs/TaskFormDialog'
import { ConfirmDialog, ConfirmDialogProps } from './dialogs/ConfirmDialog'
import { useDialogs } from '../hooks/useDialogs'
import { DIALOG_BASE_OPTIONS } from '../utils/consts'
import { enqueueSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { IProject } from '../models/IProject'
import { ActionItemKeys } from './ActionsDropdown'

export type TaskBoardData = {
  taskData: {
    statuses: TaskStatus[]
    groupedTasks: Dictionary<ITask[]>
  }
  onAddTaskHandler: (statusFieldValue: TaskStatus) => void
}

export type TaskBoardView = 'kanban' | 'list'

type Dialogs = {
  taskForm: TaskFormDialogProps
  confirm: ConfirmDialogProps
}

export type TaskBoardContext = {
  project: IProject
  taskDrawerOpened: boolean
  toggleTaskDrawer: (is_opened: boolean) => void
  onSelectTaskActionHandler: (action: ActionItemKeys, task: ITask) => void
}

export const TaskBoard = () => {
  const { project, view } = useProjectTabsContext()
  const { data: tasks, isLoading: isTasksLoading } = useTasksQuery({
    take: -1,
    projectId: project.id,
  })
  const [deleteTask, { isSuccess: isDeleteSuccess, isError: isDeleteError }] =
    useDeleteTaskMutation()
  const [taskData, setTaskData] = useState<TaskBoardData['taskData']>({
    statuses: [
      TaskStatus.UNSORTED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.COMPLETED,
    ],
    groupedTasks: {},
  })
  const [taskDrawerOpened, setTaskDrawerOpened] = useState(false)
  const [dialogs, openDialog, closeDialog] = useDialogs<Dialogs>({
    taskForm: {
      open: false,
      project,
    },
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteTask,
      confirmBtnHandler: () => {},
    },
  })
  const navigate = useNavigate()
  const { t } = useTranslation()

  const toggleTaskDrawer = (is_opened: boolean) => {
    setTaskDrawerOpened(is_opened)

    if (!is_opened) {
      setTimeout(() => navigate('.'), 225)
    }
  }

  const onAddTaskHandler = (statusFieldValue: TaskStatus) => {
    openDialog('taskForm', {
      ...DIALOG_BASE_OPTIONS.form.addTask,
      statusFieldValue,
      project,
    })
  }

  const onSelectTaskActionHandler = (action: ActionItemKeys, task: ITask) => {
    switch (action) {
      case 'edit':
        openDialog('taskForm', {
          ...DIALOG_BASE_OPTIONS.form.editTask,
          task,
          project,
        })
        break
      case 'delete':
        openDialog('confirm', {
          ...DIALOG_BASE_OPTIONS.confirm.deleteTask,
          confirmBtnHandler: () => {
            deleteTask(task.id)
            closeDialog('confirm')
            toggleTaskDrawer(false)
          },
        })
        break
    }
  }

  useEffect(() => {
    setTaskData((data) => ({
      ...data,
      groupedTasks: groupBy(tasks?.items, ({ status }) => status),
    }))
  }, [tasks])

  useEffect(() => {
    if (isDeleteSuccess) {
      enqueueSnackbar(t('notifications.delete_task.success'), {
        variant: 'success',
      })
    }

    if (isDeleteError) {
      enqueueSnackbar(t('notifications.delete_task.fail'), {
        variant: 'error',
      })
    }
  }, [isDeleteSuccess, isDeleteError, t])

  if (isTasksLoading) {
    return <CircularProgress />
  }

  return (
    <>
      {view === 'kanban' ? (
        <KanbanBoard taskData={taskData} onAddTaskHandler={onAddTaskHandler} />
      ) : (
        <ListBoard taskData={taskData} onAddTaskHandler={onAddTaskHandler} />
      )}
      <Outlet
        context={
          {
            project,
            taskDrawerOpened,
            toggleTaskDrawer,
            onSelectTaskActionHandler,
          } satisfies TaskBoardContext
        }
      />
      <TaskFormDialog {...dialogs.taskForm} />
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
