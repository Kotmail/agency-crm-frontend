import { apiSlice } from '.'
import { IUser } from '../../models/IUser'
import { RootState } from '../store'
import { updateAuthUser } from '../features/authSlice'

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Users'],
})

const usersApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query<IUser[], void>({
      query: () => ({
        url: '/users',
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
