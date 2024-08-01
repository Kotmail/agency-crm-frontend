import { Dictionary, groupBy } from 'lodash'
import { ITask, TaskStatus } from '../models/ITask'
import { ListBoard } from './ListBoard'
import { useEffect, useState } from 'react'
import { KanbanBoard } from './KanbanBoard'

export type TaskBoardData = {
  groups: TaskStatus[]
  groupedTasks: Dictionary<ITask[]>
}

export type TaskBoardView = 'kanban' | 'list'

type TaskBoardProps = {
  tasks: ITask[]
  view: TaskBoardView
}

export const TaskBoard = ({ tasks, view }: TaskBoardProps) => {
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
      groupedTasks: groupBy(tasks, ({ status }) => status),
    }))
  }, [tasks])

  return view === 'kanban' ? (
    <KanbanBoard {...boardData} />
  ) : (
    <ListBoard {...boardData} />
  )
}
