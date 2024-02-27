import { useState } from 'react'

export const useDialogs = <T>(initialValue: T) => {
  const [dialogs, setDialogs] = useState(initialValue)

  const closeDialog = (dialogName: keyof T) => {
    setDialogs((dialogs) => ({
      ...dialogs,
      [dialogName]: {
        ...dialogs[dialogName],
        open: false,
      },
    }))
  }

  const openDialog = (
    dialogName: keyof T,
    dialogOptions?: Partial<T[keyof T]>,
  ) => {
    if (!dialogOptions) {
      dialogOptions = initialValue[dialogName]
    }

    setDialogs((dialogs) => ({
      ...dialogs,
      [dialogName]: {
        ...dialogOptions,
        onClose: !('onClose' in dialogOptions!)
          ? () => closeDialog(dialogName)
          : dialogOptions.onClose,
        open: true,
      },
    }))
  }

  return [dialogs, openDialog, closeDialog] as const
}
