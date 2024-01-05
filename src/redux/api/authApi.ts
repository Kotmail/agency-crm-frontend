import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '../../models/IUser'

type LoginResponseData = {
  user: IUser
  access_token: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_BASE_ENDPOINT}/auth`,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      LoginResponseData,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginUserMutation } = authApi
