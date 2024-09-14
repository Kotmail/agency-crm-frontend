import { apiSlice } from '.'
import { IProject, Priority } from '../../models/IProject'
import { ITask, TaskStatus } from '../../models/ITask'
import { IUser } from '../../models/IUser'

type QueryTasksRequest = {
  take?: number
  page?: number
  projectId?: number
}

export interface CreateTaskRequest {
  name: string
  description: string | null
  project: IProject
  dueDate: Date | null
  status: TaskStatus
  priority: Priority | null
  responsibleUsers: IUser[]
}

interface UpdateTaskRequest
  extends Partial<CreateTaskRequest>,
    Pick<ITask, 'id'> {}

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Tasks', 'Task'],
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
    oneTask: builder.query<ITask, number>({
      query: (id) => ({
        url: `/tasks/${id}`,
      }),
      providesTags: ['Task'],
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
      invalidatesTags: ['Tasks', 'Task'],
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
  useOneTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi
