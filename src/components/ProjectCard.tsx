import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { IProject } from '../models/IProject'
import { Link as Routerlink } from 'react-router-dom'
import { PriorityChip } from './PriorityChip'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../utils/helpers/formatDate'
import { ActionItem, ActionItemKeys, ActionsDropdown } from './ActionsDropdown'

type ProjectCardProps = {
  item: IProject
  actionsList: ActionItem[]
  onSelectActionHandler: (project: IProject, action: ActionItemKeys) => void
}

export const ProjectCard = ({
  item,
  actionsList,
  onSelectActionHandler,
}: ProjectCardProps) => {
  const theme = useTheme()
  const matchXlBreakpoint = useMediaQuery(theme.breakpoints.up('xl'))
  const progressPercentage =
    item.taskTotal &&
    item.taskCompleted &&
    Math.trunc((item.taskCompleted / item.taskTotal) * 100)
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.6}
        >
          <Typography
            display="inline-flex"
            flexWrap="wrap"
            alignItems="center"
            gap="6px"
            variant="h6"
            component="h2"
            fontSize={17}
          >
            <Link
              component={Routerlink}
              to={`/projects/${item.id}`}
              underline="none"
              color="inherit"
            >
              {item.name}
            </Link>
            {item.priority && <PriorityChip priority={item.priority} />}
          </Typography>
          <ActionsDropdown
            actions={actionsList}
            onSelectHandler={(action) => onSelectActionHandler(item, action)}
          />
        </Box>
        {item.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {item.description}
          </Typography>
        )}
        <Box
          display="flex"
          gap={{ xs: '14px', sm: '20px' }}
          marginTop="auto"
          marginBottom={1}
        >
          {item.members.length > 0 && (
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography
                display="flex"
                justifyContent="space-between"
                variant="subtitle2"
                fontSize="12px"
                component="div"
                mb={0.8}
              >
                {t('project.labels.members')}
              </Typography>
              <AvatarGroup
                total={item.members.length}
                max={matchXlBreakpoint ? 4 : 3}
                sx={{
                  marginLeft: '-2px',
                }}
              >
                {item.members.map((member) => (
                  <Avatar key={member.id} />
                ))}
              </AvatarGroup>
            </Box>
          )}
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
              fontSize="12px"
              component="div"
              mb={0.8}
            >
              {t('project.labels.manager')}
            </Typography>
            <Avatar
              sx={{
                marginTop: '2px',
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography
              variant="subtitle2"
              fontSize="12px"
              component="div"
              sx={{
                span: {
                  display: 'block',
                  marginTop: 1.05,
                  fontWeight: 400,
                  fontSize: '13px',
                },
              }}
            >
              {t('project.labels.due_date')}
              <span>
                {item.dueDate
                  ? formatDate(item.dueDate)
                  : t('project.no_due_date')}
              </span>
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2.5}>
          <Box
            sx={{
              flex: '1 1 auto',
            }}
          >
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
              fontSize="12px"
              component="div"
              mb={0.4}
            >
              {t('project.labels.progress')}
              <span>{`${progressPercentage}%`}</span>
            </Typography>
            <LinearProgress color="success" value={progressPercentage} />
          </Box>
          <Button
            component={Routerlink}
            to={`/projects/${item.id}`}
            size="small"
            variant="outlined"
          >
            {t('buttons.view_details')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
