import { Dictionary, groupBy } from 'lodash'
import { ITask, TaskStatus } from '../models/ITask'
import { ListBoard } from './ListBoard'
import { useEffect, useState } from 'react'
import { KanbanBoard } from './KanbanBoard'
import { useTasksQuery } from '../redux/api/tasksApi'
import { CircularProgress } from '@mui/material'
import { useProjectTabsContext } from '../hooks/useProjectTabsContext'

export type TaskBoardData = {
  groups: TaskStatus[]
  groupedTasks: Dictionary<ITask[]>
}

export type TaskBoardView = 'kanban' | 'list'

export const TaskBoard = () => {
  const { project, view } = useProjectTabsContext()
  const { data: tasks, isLoading: isTasksLoading } = useTasksQuery({
    take: -1,
    projectId: project.id,
  })
  const [boardData, setBoardData] = useState<TaskBoardData>({
    groups: [
      TaskStatus.UNSORTED,
      TaskStatus.IN_PROGRESS,
      TaskStatus.IN_REVIEW,
      TaskStatus.COMPLETED,
    ],
    groupedTasks: {},
  })

  useEffect(() => {
    setBoardData((data) => ({
      ...data,
      groupedTasks: groupBy(tasks?.items, ({ status }) => status),
    }))
  }, [tasks])

  if (isTasksLoading) {
    return <CircularProgress />
  }

  return view === 'kanban' ? (
    <KanbanBoard {...boardData} />
  ) : (
    <ListBoard {...boardData} />
  )
}
