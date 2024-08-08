import { Typography } from '@mui/material'
import { useProjectTabsContext } from '../hooks/useProjectTabsContext'

export const AboutProject = () => {
  const { project } = useProjectTabsContext()

  if (!project.description) {
    return null
  }

  return (
    <Typography sx={{ maxWidth: 700, color: '#4a4a4a' }}>
      {project.description}
    </Typography>
  )
}
