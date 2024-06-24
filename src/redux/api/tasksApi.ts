import { apiSlice } from '.'
import { Priority } from '../../models/IProject'
import { ITask, TaskStatus } from '../../models/ITask'

type QueryTasksRequest = {
  take?: number
  page?: number
}

export interface CreateTaskRequest {
  name: string
  description: string | null
  dueDate: Date | null
  priority: Priority | null
  status: TaskStatus
}

interface UpdateTaskRequest
  extends Partial<CreateTaskRequest>,
    Pick<ITask, 'id'> {}

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Tasks'],
})

const tasksApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    tasks: builder.query<
      { items: ITask[]; totalCount: number },
      QueryTasksRequest
    >({
      query: (params) => ({
        url: '/tasks',
        params,
      }),
      providesTags: ['Tasks'],
    }),
    addTask: builder.mutation<ITask, CreateTaskRequest>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: builder.mutation<ITask, UpdateTaskRequest>({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<{ raw: unknown[]; affected: number }, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
})

export const {
  useTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi
