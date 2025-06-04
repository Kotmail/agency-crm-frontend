import { useState } from 'react'
import { Button, styled } from '@mui/material'
import MuiList from '@mui/material/List'
import AddIcon from '@mui/icons-material/Add'
import {
  useAddChecklistItemMutation,
  useChecklistItemsQuery,
  useDeleteChecklistItemMutation,
  useUpdateChecklistItemMutation,
} from '../../redux/api/checklistsApi'
import { IChecklistItem } from '../../models/IChecklistItem'
import { ChecklistItem } from './ChecklistItem'
import { ChecklistForm } from './ChecklistForm'
import { ConfirmDialog, ConfirmDialogProps } from '.././dialogs/ConfirmDialog'
import { useDialogs } from '../../hooks/useDialogs'
import { useTranslation } from 'react-i18next'
import { DIALOG_BASE_OPTIONS } from '../../utils/consts'

type DialogVariants = {
  confirm: ConfirmDialogProps
}

type ChecklistItemsProps = {
  checklistId: number
}

export const ChecklistItems = ({ checklistId }: ChecklistItemsProps) => {
  const { data: items } = useChecklistItemsQuery(
    {
      checklistId,
    },
    {
      skip: checklistId.toString().length > 10,
    },
  )
  const [addChecklistItem] = useAddChecklistItemMutation()
  const [updateChecklistItem] = useUpdateChecklistItemMutation()
  const [deleteChecklistItem] = useDeleteChecklistItemMutation()
  const { t } = useTranslation()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [dialogs, openDialog, closeDialog] = useDialogs<DialogVariants>({
    confirm: {
      open: false,
      ...DIALOG_BASE_OPTIONS.confirm.deleteChecklistItem,
      confirmBtnHandler: () => {},
    },
  })

  const onAddHandler = (name: string) => {
    addChecklistItem({ checklistId, name })
    setIsFormVisible(false)
  }

  const onUpdateHandler = (item: IChecklistItem) =>
    updateChecklistItem({
      checklistId,
      ...item,
    })

  const onDeleteHandler = (item: IChecklistItem) =>
    openDialog('confirm', {
      ...dialogs.confirm,
      confirmBtnHandler: () => {
        deleteChecklistItem({
          checklistId,
          ...item,
        })

        closeDialog('confirm')
      },
    })

  return (
    <>
      {items && items.length > 0 ? (
        <List dense>
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onUpdateHandler={(item) => onUpdateHandler(item)}
              onDeleteHandler={() => onDeleteHandler(item)}
            />
          ))}
        </List>
      ) : null}
      {isFormVisible ? (
        <ChecklistForm
          label="input_placeholders.checklist_item_name"
          multiline
          onSaveHandler={(name) => onAddHandler(name)}
          onCancelHandler={() => setIsFormVisible(false)}
          onClickAwayHandler={() => setIsFormVisible(false)}
          sx={{
            marginTop: '-8px',
            paddingBottom: 0,
          }}
        />
      ) : (
        <Button
          size="small"
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => setIsFormVisible(true)}
        >
          {t('buttons.add_checklist_item')}
        </Button>
      )}
      <ConfirmDialog {...dialogs.confirm} />
    </>
  )
}

const List = styled(MuiList)({
  paddingTop: 0,
  '.MuiListItem-root:first-of-type .MuiPaper-root': {
    paddingTop: 0,
  },
  '.MuiListItem-root::after': {
    content: '""',
    display: 'block',
    height: '1px',
    marginInline: '-20px',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
})
