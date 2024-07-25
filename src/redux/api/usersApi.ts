import { apiSlice } from '.'
import { IUser, UserRole } from '../../models/IUser'
import { RootState } from '../store'
import { updateAuthUser } from '../features/authSlice'

export type UsersFilterParams = {
  q?: string
  role?: UserRole[]
}

type QueryUsersRequest = {
  take?: number
  page?: number
} & UsersFilterParams

type UpdateUserRequest = {
  id: number
  formData: FormData
}

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Users'],
})

const usersApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query<
      { items: IUser[]; totalCount: number },
      QueryUsersRequest
    >({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['Users'],
    }),
    addUser: builder.mutation<IUser, FormData>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation<IUser, UpdateUserRequest>({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: formData,
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
