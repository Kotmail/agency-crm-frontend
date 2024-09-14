import { useState } from 'react'

export type DialogVariants<T> = keyof T
export type DialogOptions<T> = Partial<T[keyof T]>

export const useDialogs = <T>(initialValue: T) => {
  const [dialogs, setDialogs] = useState(initialValue)

  const closeDialog = (dialogName: DialogVariants<T>) => {
    setDialogs((dialogs) => ({
      ...dialogs,
      [dialogName]: {
        ...dialogs[dialogName],
        open: false,
      },
    }))
  }

  const openDialog = (
    dialogName: DialogVariants<T>,
    dialogOptions?: DialogOptions<T>,
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
