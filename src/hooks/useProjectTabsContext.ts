import { useOutletContext } from 'react-router-dom'
import { ProjectTabsContext } from '../components/ProjectDetails'

export const useProjectTabsContext = () =>
  useOutletContext<ProjectTabsContext>()
