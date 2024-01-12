import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '../../models/IUser'
import { setAuthData } from '../features/authSlice'

export type AuthResponseData = {
  user: IUser
  access_token: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_BASE_ENDPOINT}/auth`,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token')

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      AuthResponseData,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: 'login',
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
        url: 'verify',
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
