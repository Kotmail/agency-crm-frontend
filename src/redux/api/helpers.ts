import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function isQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error != null && 'status' in error
}
