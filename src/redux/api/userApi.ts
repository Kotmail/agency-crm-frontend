import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser } from '../../models/IUser'
import { RootState } from '../store'
import { updateAuthUser } from '../features/authSlice'

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['Users'],
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
    users: builder.query<IUser[], void>({
      query: () => ({
        url: '/user',
      }),
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<IUser, Partial<IUser> & Pick<IUser, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/user/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Users'],
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled
          const { user: authUser } = (getState() as RootState).auth

          if (updatedUser.id === authUser?.id) {
            dispatch(updateAuthUser(updatedUser))
          }
        } catch (err) {
          console.log(err)
        }
      },
    }),
    deleteUser: builder.mutation<{ raw: unknown[]; affected: number }, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const { useUsersQuery, useUpdateUserMutation, useDeleteUserMutation } =
  userApi
