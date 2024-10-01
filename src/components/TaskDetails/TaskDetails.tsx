import { useEffect } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { EditOutlined, DeleteOutlineOutlined } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { useOneTaskQuery } from '../../redux/api/tasksApi'
import { useTranslation } from 'react-i18next'
import { ActionItem, ActionsDropdown } from '../ActionsDropdown'
import { PriorityChip } from '../PriorityChip'
import { formatDate } from '../../utils/helpers/formatDate'
import * as S from './TaskDetails.styles'
import { useTaskBoardContext } from '../../hooks/useTaskBoardContext'
import { getUserFullName } from '../../utils/helpers/getUserFullName'

const actions: ActionItem[] = [
  {
    key: 'edit',
    icon: EditOutlined,
  },
  {
    key: 'delete',
    icon: DeleteOutlineOutlined,
  },
]

export const TaskDetails = () => {
  const {
    onSelectTaskActionHandler,
    taskDrawerOpened,
    toggleTaskDrawer,
    project,
  } = useTaskBoardContext()
  const { taskId } = useParams()
  const { data: task, isLoading: isTaskLoading } = useOneTaskQuery(
    Number(taskId) || 0,
  )
  const { t } = useTranslation()

  useEffect(() => {
    setTimeout(() => toggleTaskDrawer(true), 0)
  }, [])

  return (
    <S.Drawer open={taskDrawerOpened} onClose={() => toggleTaskDrawer(false)}>
      {isTaskLoading && <CircularProgress />}
      {task && (
        <>
          <S.TopLine>
            <S.Crumbs>
              {project.name} / {t(`statuses.${task.status}`)}
            </S.Crumbs>
            <S.Buttons>
              <ActionsDropdown
                actions={actions}
                onSelectHandler={(action) =>
                  onSelectTaskActionHandler(action, task)
                }
                ariaLabel="aria_labels.actions"
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              />
              <S.CloseButton
                aria-label={t('aria_labels.close_task_window')}
                onClick={() => toggleTaskDrawer(false)}
              />
            </S.Buttons>
          </S.TopLine>
          <S.Content>
            <S.Heading>{task.name}</S.Heading>
            <S.Description>{task.description}</S.Description>
            <S.Properties>
              {task.priority && (
                <S.Property>
                  <S.PropertyLabel>{t('task.labels.priority')}</S.PropertyLabel>
                  <PriorityChip priority={task.priority} />
                </S.Property>
              )}
              <S.Property>
                <S.PropertyLabel>{t('task.labels.status')}</S.PropertyLabel>
                <Typography component="span">
                  {t(`statuses.${task.status}`)}
                </Typography>
              </S.Property>
              <S.Property>
                <S.PropertyLabel>{t('task.labels.due_date')}</S.PropertyLabel>
                <Typography component="span">
                  {task.dueDate
                    ? formatDate(task.dueDate)
                    : t('task.no_due_date')}
                </Typography>
              </S.Property>
            </S.Properties>
            {task.responsibleUsers && (
              <S.Avatars>
                {task.responsibleUsers.map((user) => (
                  <S.Avatar
                    key={user.id}
                    user={user}
                    tooltip={getUserFullName(user)}
                  />
                ))}
              </S.Avatars>
            )}
          </S.Content>
        </>
      )}
    </S.Drawer>
  )
}
