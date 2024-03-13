import { useState, useEffect } from 'react'

export const useDocumentTitle = (initialValue?: string) => {
  const [documentTitle, setDocumentTitle] = useState(initialValue)

  useEffect(() => {
    if (documentTitle) {
      document.title = documentTitle
    }
  }, [documentTitle])

  return [documentTitle, setDocumentTitle] as const
}
