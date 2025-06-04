import { apiSlice } from '.'
import { IChecklist } from '../../models/IChecklist'
import { IChecklistItem } from '../../models/IChecklistItem'

type QueryChecklistsRequest = {
  taskId: number
}

interface CreateChecklistRequest {
  name: string
  taskId: number
}

interface DeleteChecklistRequest {
  checklistId: number
  taskId: number
}

interface CreateChecklistItemRequest {
  name: string
  checklistId: number
}

interface UpdateChecklistRequest
  extends Partial<CreateChecklistRequest>,
    Pick<IChecklist, 'id'> {
  taskId: number
}

interface UpdateChecklistItemRequest
  extends Partial<Omit<IChecklistItem, 'id'>> {
  id: number
  checklistId: number
}

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['Checklists'],
})

const checklistsApi = apiWithTag
  .injectEndpoints({
    endpoints: (builder) => ({
      checklists: builder.query<IChecklist[], QueryChecklistsRequest>({
        query: (params) => ({
          url: '/checklists',
          params,
        }),
      }),
      addChecklist: builder.mutation<IChecklist, CreateChecklistRequest>({
        query: (body) => ({
          url: '/checklists',
          method: 'POST',
          body,
        }),
        async onQueryStarted({ name, taskId }, { dispatch, queryFulfilled }) {
          const id = Date.now()

          const addResult = dispatch(
            checklistsApi.util.updateQueryData(
              'checklists',
              { taskId },
              (checklists) => {
                checklists.push({
                  id,
                  name,
                })
              },
            ),
          )

          try {
            const { data } = await queryFulfilled

            dispatch(
              checklistsApi.util.updateQueryData(
                'checklists',
                { taskId },
                (draftItems) => {
                  let checklist = draftItems.find(
                    (draftItem) => draftItem.id === id,
                  )

                  if (checklist) {
                    checklist = Object.assign(checklist, data)
                  }
                },
              ),
            )
          } catch {
            addResult.undo()
          }
        },
      }),
      updateChecklist: builder.mutation<IChecklist, UpdateChecklistRequest>({
        query: ({ id, ...body }) => ({
          url: `/checklists/${id}`,
          method: 'PUT',
          body,
        }),
        async onQueryStarted(
          { taskId, ...checklist },
          { dispatch, queryFulfilled },
        ) {
          const updateResult = dispatch(
            checklistsApi.util.updateQueryData(
              'checklists',
              { taskId },
              (items) => {
                let updatedChecklist = items.find(
                  (itemData) => itemData.id === checklist.id,
                )

                if (updatedChecklist) {
                  updatedChecklist = Object.assign(updatedChecklist, checklist)
                }
              },
            ),
          )

          try {
            await queryFulfilled
          } catch {
            updateResult.undo()
          }
        },
      }),
      deleteChecklist: builder.mutation<
        { raw: unknown[]; affected: number },
        DeleteChecklistRequest
      >({
        query: ({ checklistId }) => ({
          url: `/checklists/${checklistId}`,
          method: 'DELETE',
        }),
        async onQueryStarted(
          { checklistId, taskId },
          { dispatch, queryFulfilled },
        ) {
          const deleteResult = dispatch(
            checklistsApi.util.updateQueryData(
              'checklists',
              { taskId },
              (draftItems) => {
                const deletedItemIdx = draftItems.findIndex(
                  (draftItem) => draftItem.id === checklistId,
                )

                if (deletedItemIdx !== -1) {
                  draftItems.splice(deletedItemIdx, 1)
                }
              },
            ),
          )

          try {
            await queryFulfilled
          } catch {
            deleteResult.undo()
          }
        },
      }),
    }),
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      addChecklistItem: builder.mutation<
        IChecklistItem,
        CreateChecklistItemRequest
      >({
        query: ({ checklistId, ...body }) => ({
          url: `/checklists/${checklistId}/items`,
          method: 'POST',
          body,
        }),
        async onQueryStarted(
          { checklistId, name },
          { dispatch, queryFulfilled },
        ) {
          const id = Date.now()

          const addResult = dispatch(
            checklistsApi.util.updateQueryData(
              'checklistItems',
              { checklistId },
              (items) => {
                items.push({
                  id,
                  name,
                  isDone: false,
                })
              },
            ),
          )

          try {
            const { data } = await queryFulfilled

            dispatch(
              checklistsApi.util.updateQueryData(
                'checklistItems',
                { checklistId },
                (draftItems) => {
                  let item = draftItems.find((draftItem) => draftItem.id === id)

                  if (item) {
                    item = Object.assign(item, data)
                  }
                },
              ),
            )
          } catch {
            addResult.undo()
          }
        },
      }),
      checklistItems: builder.query<IChecklistItem[], { checklistId: number }>({
        query: ({ checklistId, ...params }) => ({
          url: `/checklists/${checklistId}/items`,
          params,
        }),
      }),
      updateChecklistItem: builder.mutation<
        IChecklistItem,
        UpdateChecklistItemRequest
      >({
        query: ({ checklistId, id, ...body }) => ({
          url: `/checklists/${checklistId}/items/${id}`,
          method: 'PUT',
          body,
        }),
        async onQueryStarted(
          { checklistId, ...item },
          { dispatch, queryFulfilled },
        ) {
          const updateResult = dispatch(
            checklistsApi.util.updateQueryData(
              'checklistItems',
              { checklistId },
              (items) => {
                let updatedItem = items.find(
                  (itemData) => itemData.id === item.id,
                )

                if (updatedItem) {
                  updatedItem = Object.assign(updatedItem, item)
                }
              },
            ),
          )

          try {
            await queryFulfilled
          } catch {
            updateResult.undo()
          }
        },
      }),
      deleteChecklistItem: builder.mutation<
        { raw: unknown[]; affected: number },
        { checklistId: number; id: number }
      >({
        query: ({ checklistId, id }) => ({
          url: `/checklists/${checklistId}/items/${id}`,
          method: 'DELETE',
        }),
        async onQueryStarted(
          { checklistId, id },
          { dispatch, queryFulfilled },
        ) {
          const deleteResult = dispatch(
            checklistsApi.util.updateQueryData(
              'checklistItems',
              { checklistId },
              (items) => {
                const deletedItemIdx = items.findIndex((item) => item.id === id)

                if (deletedItemIdx !== -1) {
                  items.splice(deletedItemIdx, 1)
                }
              },
            ),
          )

          try {
            await queryFulfilled
          } catch {
            deleteResult.undo()
          }
        },
      }),
    }),
  })

export const {
  useChecklistsQuery,
  useAddChecklistMutation,
  useUpdateChecklistMutation,
  useDeleteChecklistMutation,
  useAddChecklistItemMutation,
  useChecklistItemsQuery,
  useUpdateChecklistItemMutation,
  useDeleteChecklistItemMutation,
} = checklistsApi
