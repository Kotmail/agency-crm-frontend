import { ChangeEvent, useState } from 'react'
import {
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  Paper,
  PaperProps,
  TextField,
  styled,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useTranslation } from 'react-i18next'

type ChecklistFormProps = {
  label: string
  value?: string
  multiline?: boolean
  saveBtnText?: string
  showDeleteBtn?: boolean
  onSaveHandler: (name: string) => void
  onCancelHandler: () => void
  onDeleteHandler?: () => void
  onClickAwayHandler: (fieldValue: string) => void
} & PaperProps

export const ChecklistForm = ({
  label,
  value,
  multiline,
  saveBtnText,
  showDeleteBtn,
  onSaveHandler,
  onCancelHandler,
  onDeleteHandler,
  onClickAwayHandler,
  ...props
}: ChecklistFormProps) => {
  const [fieldValue, setFieldValue] = useState(value || '')
  const [fieldError, setFieldError] = useState(false)
  const { t } = useTranslation()

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.replace(/\s/g, '').length) {
      setFieldError(true)
    } else {
      setFieldError(false)
    }

    setFieldValue(e.target.value)
  }

  const onClickAway = () => {
    if (document.activeElement?.nodeName === 'TEXTAREA') {
      return
    }

    onClickAwayHandler(fieldValue)
  }

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Wrapper {...props}>
        <TextField
          error={fieldError}
          helperText={fieldError ? t('form_errors.checklist_field') : undefined}
          label={t(label)}
          multiline={multiline}
          fullWidth
          size="small"
          variant="filled"
          value={fieldValue}
          onChange={onChangeHandler}
        />
        <Box display="flex" gap={1} paddingTop={'10px'}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onSaveHandler(fieldValue)}
            disabled={!fieldValue.trim()}
          >
            {t(saveBtnText || 'buttons.add')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={onCancelHandler}
          >
            {t('buttons.cancel')}
          </Button>
          {showDeleteBtn && (
            <IconButton
              size="small"
              color="error"
              sx={{ marginLeft: 'auto' }}
              onClick={onDeleteHandler}
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>
      </Wrapper>
    </ClickAwayListener>
  )
}

const Wrapper = styled(Paper)({
  padding: '10px 0',
  border: 'none',
})
