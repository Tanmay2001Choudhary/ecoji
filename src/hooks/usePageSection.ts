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
          const contentStr = JSON.stringify(section.content)
          const isStaleDraft = 
            contentStr.includes('toothbrushes') ||
            contentStr.includes('toothbrush') ||
            contentStr.includes('oral care') ||
            contentStr.includes('Pure Clean') ||
            contentStr.includes('Reimagining Daily Routines') ||
            contentStr.includes('Every Brush Makes a Difference') ||
            contentStr.includes('We Are Here to Help') ||
            contentStr.includes('bristle') ||
            contentStr.includes('Nature\'s Purest..')

          if (isStaleDraft) {
            setData(fallbackData)
            // Silently repair database row to real Ecoji content so future edits start from clean state
            try {
              await api.pagesContent.upsert({
                page_slug: pageSlug,
                section_key: sectionKey,
                title: section.title || sectionKey,
                content: fallbackData,
                is_active: true
              })
            } catch (e) {}
          } else {
            setData(section.content as T)
          }
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
