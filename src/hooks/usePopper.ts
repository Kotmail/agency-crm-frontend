import { useState, useId, MouseEvent } from 'react'

type PopperState = {
  id?: string
  anchorEl: null | HTMLButtonElement
  open: boolean
}

export const usePopper = () => {
  const initialState = {
    anchorEl: null,
    open: false,
  }
  const popperId = useId()
  const [popperState, setPopperState] = useState<PopperState>(initialState)

  const openPopper = (e: MouseEvent<HTMLButtonElement>) =>
    setPopperState(() => ({
      id: popperId,
      anchorEl: e.currentTarget,
      open: true,
    }))

  const closePopper = () => setPopperState(() => initialState)

  return [popperState, openPopper, closePopper] as const
}
