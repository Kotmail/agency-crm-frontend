import { apiSlice } from '.'
import { IUser } from '../../models/IUser'
import { setAuthData } from '../features/authSlice'

export type AuthResponseData = {
  user: IUser
  access_token: string
}

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      AuthResponseData,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAuthData(data))
        } catch (err) {
          console.log(err)
        }
      },
    }),
    verifyUser: builder.query<AuthResponseData, void>({
      query: () => ({
        url: '/auth/verify',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAuthData(data))
        } catch (err) {
          console.log(err)
        }
      },
    }),
  }),
})

export const { useLoginUserMutation, useVerifyUserQuery } = authApi
