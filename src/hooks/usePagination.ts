import { useSearchParams } from 'react-router-dom'

type PaginationParams = {
  page: number
  take: number
}

type InitialData = {
  take: number | undefined
}

export const usePagination = (initialData: InitialData) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = searchParams.get('page')
  const paginationData: PaginationParams = {
    page: (currentPage && +currentPage) || 1,
    take: initialData.take || 8,
  }

  const setPage = (page: number) => {
    setSearchParams((data) => {
      if (page === 1) {
        data.delete('page')

        return data
      }

      return { ...data, page }
    })
  }

  return [paginationData, setPage] as const
}
