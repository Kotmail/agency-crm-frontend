import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../models/IUser'
import { LoginResponseData } from '../api/authApi'

interface IUserState {
  user: IUser | null
  access_token: string
}

const initialState: IUserState = {
  user: null,
  access_token: '',
}

export const userSlice = createSlice({
  initialState,
  name: 'userSlice',
  reducers: {
    logout: () => initialState,
    setUser: (state, action: PayloadAction<LoginResponseData>) => {
      state.user = action.payload.user
      state.access_token = action.payload.access_token
    },
  },
})

export const { logout, setUser } = userSlice.actions

export default userSlice.reducer
