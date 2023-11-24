import { useRef, useEffect } from 'react'

export function useDocumentTitle(title: string, retainOnUnmount = false) {
  const defaultTitle = useRef(document.title)

  useEffect(() => {
    document.title = title

    return () => {
      if (!retainOnUnmount) {
        document.title = defaultTitle.current
      }
    }
  }, [retainOnUnmount, title])
}
