import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../models/IUser'
import { AuthResponseData } from '../api/authApi'

interface IAuthState {
  user: IUser | null
  access_token: string
}

const initialState: IAuthState = {
  user: null,
  access_token: '',
}

export const authSlice = createSlice({
  initialState,
  name: 'authSlice',
  reducers: {
    setAuthData: (state, action: PayloadAction<AuthResponseData>) => {
      state.user = action.payload.user
      state.access_token = action.payload.access_token

      localStorage.setItem('access_token', action.payload.access_token)
    },
    updateAuthUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
    clearAuthData: () => {
      localStorage.removeItem('access_token')

      return initialState
    },
  },
})

export const { setAuthData, updateAuthUser, clearAuthData } = authSlice.actions

export default authSlice.reducer
