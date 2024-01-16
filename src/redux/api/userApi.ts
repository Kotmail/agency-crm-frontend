import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '../../models/IUser'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_BASE_ENDPOINT,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token')

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    updateUser: builder.mutation<IUser, Partial<IUser> & Pick<IUser, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const { useUpdateUserMutation } = userApi
