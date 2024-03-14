import { apiSlice } from '.'
import { IOrder } from '../../models/IOrder'

type QueryOrdersRequest = {
  state?: 'opened' | 'closed'
  take?: number
  page?: number
}

export interface CreateOrderRequest
  extends Omit<IOrder, 'id' | 'creator' | 'executor' | 'createdAt'> {
  creatorId?: number
  executorId: number
}

export interface UpdateOrderRequest
  extends Partial<CreateOrderRequest>,
    Pick<IOrder, 'id'> {}

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Orders'],
})

const ordersApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    orders: builder.query<[IOrder[], number], QueryOrdersRequest>({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),
    addOrder: builder.mutation<IOrder, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<IOrder, UpdateOrderRequest>({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
    deleteOrder: builder.mutation<{ raw: unknown[]; affected: number }, number>(
      {
        query: (id) => ({
          url: `/orders/${id}`,
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
} = ordersApi
