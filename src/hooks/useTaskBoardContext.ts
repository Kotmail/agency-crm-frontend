import { useOutletContext } from 'react-router-dom'
import { TaskBoardContext } from '../components/TaskBoard'

export const useTaskBoardContext = () => useOutletContext<TaskBoardContext>()
