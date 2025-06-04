import { useState } from 'react'
import {
  Box,
  IconButton,
  styled,
  Typography,
  TypographyProps,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { IChecklist } from '../../models/IChecklist'
import { ChecklistForm } from './ChecklistForm'
import { ChecklistItems } from './ChecklistItems'
import { useTranslation } from 'react-i18next'

type ChecklistProps = {
  checklist: IChecklist
  onUpdateHandler: (checklist: IChecklist) => void
  onDeleteHandler: () => void
}

export const Checklist = ({
  checklist,
  onUpdateHandler,
  onDeleteHandler,
}: ChecklistProps) => {
  const [editMode, setEditMode] = useState(false)
  const { t } = useTranslation()

  const onUpdateChecklistHandler = (checklist: IChecklist) => {
    onUpdateHandler(checklist)
    onCancelFormHandler()
  }

  const onCancelFormHandler = () => setEditMode(false)

  return (
    <Wrapper className={`${checklist.id}`}>
      {editMode ? (
        <ChecklistForm
          label="input_placeholders.checklist_name"
          value={checklist.name}
          showDeleteBtn
          saveBtnText="buttons.save"
          onSaveHandler={(name) =>
            onUpdateChecklistHandler({ ...checklist, name })
          }
          onDeleteHandler={onDeleteHandler}
          onCancelHandler={onCancelFormHandler}
          onClickAwayHandler={onCancelFormHandler}
          sx={{
            paddingTop: 0,
          }}
        />
      ) : (
        <Header>
          <Name>{checklist.name}</Name>
          <IconButton
            aria-label={t('aria_labels.edit')}
            size="small"
            onClick={() => setEditMode(true)}
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
        </Header>
      )}
      <ChecklistItems checklistId={checklist.id} />
    </Wrapper>
  )
}

const Wrapper = styled(Box)({
  '&:not(:last-child)': {
    marginBottom: 20,
  },
})

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  paddingBottom: '8px',
})

const Name = styled((props: TypographyProps) => (
  <Typography component="h3" {...props} />
))({
  fontWeight: 500,
  fontSize: 17,
})
