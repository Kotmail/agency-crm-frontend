import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
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
  endpoints: () => ({}),
})
