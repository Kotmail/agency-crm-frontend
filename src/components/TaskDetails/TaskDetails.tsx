import { useEffect, useState } from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { EditOutlined, DeleteOutlineOutlined } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useOneTaskQuery } from '../../redux/api/tasksApi'
import { useTranslation } from 'react-i18next'
import { ActionItem, ActionsDropdown } from '../ActionsDropdown'
import { PriorityChip } from '../PriorityChip'
import { formatDate } from '../../utils/helpers/formatDate'
import * as S from './TaskDetails.styles'

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
  const { taskId } = useParams()
  const { data: task, isLoading: isTaskLoading } = useOneTaskQuery(
    Number(taskId) || 0,
  )
  const navigate = useNavigate()
  const [isOpened, setIsOpened] = useState(false)
  const { t } = useTranslation()

  const toggleDrawer = (flag: boolean) => {
    setIsOpened(flag)

    if (!flag) {
      setTimeout(() => navigate('..'), 225)
    }
  }

  useEffect(() => {
    setTimeout(() => toggleDrawer(true), 0)
  }, [])

  return (
    <S.Drawer open={isOpened} onClose={() => toggleDrawer(false)}>
      {isTaskLoading && <CircularProgress />}
      <S.TopLine>
        <S.Crumbs>
          {task?.project.name} / {t(`statuses.${task?.status}`)}
        </S.Crumbs>
        <S.Buttons>
          <ActionsDropdown
            actions={actions}
            onSelectHandler={() => {}}
            ariaLabel="aria_labels.actions"
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          />
          <S.CloseButton
            aria-label={t('aria_labels.close_task_window')}
            onClick={() => toggleDrawer(false)}
          />
        </S.Buttons>
      </S.TopLine>
      <S.Content>
        <S.Heading>{task?.name}</S.Heading>
        <S.Description>{task?.description}</S.Description>
        <S.Properties>
          {task?.priority && (
            <S.Property>
              <S.PropertyLabel>{t('task.labels.priority')}</S.PropertyLabel>
              <PriorityChip priority={task.priority} />
            </S.Property>
          )}
          <S.Property>
            <S.PropertyLabel>{t('task.labels.status')}</S.PropertyLabel>
            <Typography component="span">
              {t(`statuses.${task?.status}`)}
            </Typography>
          </S.Property>
          <S.Property>
            <S.PropertyLabel>{t('task.labels.due_date')}</S.PropertyLabel>
            <Typography component="span">
              {task?.dueDate ? formatDate(task.dueDate) : '—'}
            </Typography>
          </S.Property>
        </S.Properties>
        {task?.responsibleUsers && (
          <S.Avatars>
            {task.responsibleUsers.map((user) => (
              <S.Avatar key={user.id} user={user} />
            ))}
          </S.Avatars>
        )}
      </S.Content>
    </S.Drawer>
  )
}
