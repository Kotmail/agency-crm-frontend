import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { IChecklist } from '../../models/IChecklist'
import {
  useAddChecklistMutation,
  useChecklistsQuery,
  useDeleteChecklistMutation,
  useUpdateChecklistMutation,
} from '../../redux/api/checklistsApi'
import { Checklist } from './Checklist'
import { ChecklistForm } from './ChecklistForm'
import { useTranslation } from 'react-i18next'

export const Checklists = ({ taskId }: { taskId: number }) => {
  const { data: checklists, isLoading } = useChecklistsQuery({
    taskId,
  })
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [addChecklist] = useAddChecklistMutation()
  const [updateChecklist] = useUpdateChecklistMutation()
  const [deleteChecklist] = useDeleteChecklistMutation()
  const { t } = useTranslation()

  const onAddHandler = (name: string) => {
    addChecklist({ taskId, name })
    setIsFormVisible(false)
  }

  const onUpdateHandler = (checklist: IChecklist) =>
    updateChecklist({ ...checklist, taskId })

  const onDeleteHandler = (checklistId: number) => {
    deleteChecklist({ checklistId, taskId })
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      {checklists && checklists.length > 0
        ? checklists.map((checklist) => (
            <Checklist
              key={checklist.id}
              checklist={checklist}
              onUpdateHandler={onUpdateHandler}
              onDeleteHandler={() => onDeleteHandler(checklist.id)}
            />
          ))
        : null}
      {isFormVisible ? (
        <ChecklistForm
          label="input_placeholders.checklist_name"
          onSaveHandler={(name) => onAddHandler(name)}
          onCancelHandler={() => setIsFormVisible(false)}
          onClickAwayHandler={() => setIsFormVisible(false)}
          sx={{
            padding: 0,
          }}
        />
      ) : (
        <Button variant="outlined" onClick={() => setIsFormVisible(true)}>
          {t('buttons.add_checklist')}
        </Button>
      )}
    </>
  )
}
