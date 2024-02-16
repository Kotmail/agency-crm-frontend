import { useState } from 'react'

export const useDialogs = <T>(initialValue: T) => {
  const [openedDialogs, setOpenedDialogs] = useState(initialValue)

  const dialogChangeState = (dialogName: keyof T, isOpened: boolean) =>
    setOpenedDialogs({
      ...openedDialogs,
      [dialogName]: isOpened,
    })

  return [openedDialogs, dialogChangeState] as const
}
