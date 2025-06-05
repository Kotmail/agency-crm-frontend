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
import { ConfirmDialog, ConfirmDialogProps } from '../dialogs/ConfirmDialog'
import { useDialogs } from '../../hooks/useDialogs'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'

type DialogVariants = {
  confirm: ConfirmDialogProps
}

export const Checklists = ({ taskId }: { taskId: number }) => {
  const { data: checklists, isLoading } = useChecklistsQuery({
    taskId,
  })
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [addChecklist] = useAddChecklistMutation()
  const [updateChecklist] = useUpdateChecklistMutation()
  const [deleteChecklist] = useDeleteChecklistMutation()
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteChecklist,
      confirmBtnHandler: () => {},
    },
  })
  const { t } = useTranslation()

  const onAddHandler = (name: string) => {
    addChecklist({ taskId, name })
    setIsFormVisible(false)
  }

  const onUpdateHandler = (checklist: IChecklist) =>
    updateChecklist({ ...checklist, taskId })

  const onDeleteHandler = (checklistId: number) =>
    openDialog('confirm', {
      ...dialogs.confirm,
      confirmBtnHandler: () => {
        deleteChecklist({ checklistId, taskId })

        closeDialog('confirm')
      },
    })

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
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}
