import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function usePageSection<T>(pageSlug: string, sectionKey: string, fallbackData: T): { data: T; isLoading: boolean } {
  const [data, setData] = useState<T>(fallbackData)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    const fetchSection = async () => {
      try {
        const section = await api.pagesContent.get(pageSlug, sectionKey)
        if (isMounted && section && section.is_active && section.content) {
          setData(section.content as T)
        }
      } catch (err) {
        // Silently fall back to exact default if table doesn't exist or is offline
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSection()

    return () => {
      isMounted = false
    }
  }, [pageSlug, sectionKey])

  return { data, isLoading }
}
