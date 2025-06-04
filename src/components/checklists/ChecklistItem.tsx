import { useState } from 'react'
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemProps,
  ListItemText,
  styled,
} from '@mui/material'
import { IChecklistItem } from '../../models/IChecklistItem'
import { ChecklistForm } from './ChecklistForm'
import { useTranslation } from 'react-i18next'

type ChecklistItemProps = {
  item: IChecklistItem
  onUpdateHandler: (item: IChecklistItem) => void
  onDeleteHandler: () => void
}

export const ChecklistItem = ({
  item,
  onUpdateHandler,
  onDeleteHandler,
}: ChecklistItemProps) => {
  const [editMode, setEditMode] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState<string | null>(null)
  const labelId = `checklistItem${item.id}Label`
  const { t } = useTranslation()

  const onClickAwayHandler = (fieldValue: string) => {
    if (fieldValue && fieldValue?.trim() !== item.name) {
      setUnsavedChanges(fieldValue)
    } else if (fieldValue) {
      setUnsavedChanges(null)
    }

    setEditMode(false)
  }

  const onCancelFormHandler = () => {
    setEditMode(false)
    setUnsavedChanges(null)
  }

  const updateItemHandler = (item: IChecklistItem) => {
    onUpdateHandler(item)
    onCancelFormHandler()
  }

  return (
    <Item
      key={item.id}
      secondaryAction={
        !editMode ? (
          <Checkbox
            edge="start"
            onChange={(e) =>
              updateItemHandler({ ...item, isDone: e.target.checked })
            }
            checked={item.isDone}
            slotProps={{ input: { 'aria-labelledby': labelId } }}
          />
        ) : undefined
      }
    >
      {editMode ? (
        <ChecklistForm
          label="input_placeholders.checklist_item_name"
          value={unsavedChanges || item.name}
          multiline
          showDeleteBtn
          saveBtnText="buttons.save"
          onSaveHandler={(name) => updateItemHandler({ ...item, name })}
          onCancelHandler={onCancelFormHandler}
          onDeleteHandler={onDeleteHandler}
          onClickAwayHandler={(fieldValue) => onClickAwayHandler(fieldValue)}
        />
      ) : (
        <ItemButton onClick={() => setEditMode(true)}>
          <ItemText
            id={labelId}
            primary={item.name}
            secondary={unsavedChanges ? t('checklist_item_warning') : undefined}
          />
        </ItemButton>
      )}
    </Item>
  )
}

const Item = styled((props: ListItemProps) => (
  <ListItem disablePadding {...props} />
))({
  display: 'block',
  '.MuiListItemSecondaryAction-root': {
    left: 0,
    right: 'unset',
  },
  '> .MuiListItemButton-root': {
    paddingRight: '20px',
  },
})

const ItemButton = styled(ListItemButton)({
  paddingLeft: '52px',
  marginInline: '-20px',
})

const ItemText = styled(ListItemText)({
  overflowWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  '.MuiListItemText-secondary': {
    paddingTop: '4px',
    fontSize: '13px',
    color: '#ed6c02',
  },
})
