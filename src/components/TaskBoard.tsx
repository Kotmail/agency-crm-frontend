import { groupBy } from 'lodash'
import { ITask } from '../models/ITask'
import { TasksAccordion } from './TasksAccordion'

export const TaskBoard = ({ tasks }: { tasks: ITask[] }) => {
  const groupedTasksByStatus = groupBy(tasks, ({ status }) => status)

  return <TasksAccordion tasks={groupedTasksByStatus} />
}
