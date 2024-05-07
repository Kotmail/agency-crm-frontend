import { apiSlice } from '.'
import { IUser, UserRole } from '../../models/IUser'
import { RootState } from '../store'
import { updateAuthUser } from '../features/authSlice'

export type UsersFilterParams = {
  role?: UserRole[]
}

type QueryUsersRequest = {
  take?: number
  page?: number
} & UsersFilterParams

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Users'],
})

const usersApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query<[IUser[], number], QueryUsersRequest>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    addUser: builder.mutation<IUser, Omit<IUser, 'id'>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<IUser, Partial<IUser> & Pick<IUser, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
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
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi
