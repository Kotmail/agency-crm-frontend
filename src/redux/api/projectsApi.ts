import { apiSlice } from '.'
import { IProject, Priority } from '../../models/IProject'

type QueryProjectsRequest = {
  take?: number
  page?: number
}

export interface CreateProjectRequest {
  name: string
  description: string | null
  dueDate: Date | null
  priority: Priority | null
}

interface UpdateProjectRequest
  extends Partial<CreateProjectRequest>,
    Pick<IProject, 'id'> {}

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Projects'],
})

const projectsApi = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    projects: builder.query<
      { items: IProject[]; totalCount: number },
      QueryProjectsRequest
    >({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Projects'],
    }),
    addProject: builder.mutation<IProject, CreateProjectRequest>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation<IProject, UpdateProjectRequest>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation<
      { raw: unknown[]; affected: number },
      number
    >({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
})

export const {
  useProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi
