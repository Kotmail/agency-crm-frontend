import { FC, useId } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

export type ConfirmDialogProps = {
  title: string
  description?: string
  cancelBtnLabel?: string
  confirmBtnLabel: string
  confirmBtnHandler: () => void
} & DialogProps

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  description,
  cancelBtnLabel,
  confirmBtnLabel,
  confirmBtnHandler,
  onClose,
  ...props
}) => {
  const { t } = useTranslation()
  const confirmTitleId = useId()
  const confirmDescId = useId()

  const closeDialogHandler = () => {
    onClose && onClose({}, 'escapeKeyDown')
  }

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby={confirmTitleId}
      aria-describedby={confirmDescId}
      {...props}
    >
      <DialogTitle id={confirmTitleId}>{t(title)}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText id={confirmDescId}>
            {t(description)}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={closeDialogHandler}>
          {t(cancelBtnLabel || 'buttons.cancel')}
        </Button>
        <Button color="error" onClick={confirmBtnHandler}>
          {t(confirmBtnLabel)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
