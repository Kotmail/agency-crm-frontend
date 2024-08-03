import { useOutletContext } from 'react-router-dom'
import { ProjectTabsContext } from '../components/ProjectDetail'

export const useProjectTabsContext = () =>
  useOutletContext<ProjectTabsContext>()
