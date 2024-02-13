import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IOrder } from '../../models/IOrder'

export interface CreateOrderRequest
  extends Omit<IOrder, 'id' | 'creator' | 'executor' | 'createdAt'> {
  creatorId?: number
  executorId: number
}

export interface UpdateOrderRequest
  extends Partial<CreateOrderRequest>,
    Pick<IOrder, 'id'> {}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  tagTypes: ['Orders'],
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
    orders: builder.query<IOrder[], void>({
      query: () => ({
        url: '/order',
      }),
      providesTags: ['Orders'],
    }),
    addOrder: builder.mutation<IOrder, CreateOrderRequest>({
      query: (body) => ({
        url: '/order',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<IOrder, UpdateOrderRequest>({
      query: ({ id, ...body }) => ({
        url: `/order/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation<{ raw: unknown[]; affected: number }, number>(
      {
        query: (id) => ({
          url: `/order/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Orders'],
      },
    ),
  }),
})

export const {
  useOrdersQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi
