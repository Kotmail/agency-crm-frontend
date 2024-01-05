import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../models/IUser'

interface IUserState {
  user: IUser | null
}

const initialState: IUserState = {
  user: null,
}

export const userSlice = createSlice({
  initialState,
  name: 'userSlice',
  reducers: {
    logout: () => initialState,
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
  },
})

export const { logout, setUser } = userSlice.actions

export default userSlice.reducer
