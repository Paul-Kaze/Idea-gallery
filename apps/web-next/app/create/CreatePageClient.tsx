'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  Film,
  Heart,
  Star,
} from 'lucide-react'
import PromePromptBox from '../m/PromePromptBox'
import promptStyles from '../m/seedance-2.0/seedance-2.module.css'
import styles from './create.module.css'

type FilterKey = 'all' | 'video' | 'image'

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'video', label: 'Video' },
  { key: 'image', label: 'Image' },
]

export default function CreatePageClient() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const filterLabel = FILTERS.find((item) => item.key === filter)?.label || 'All'
  const visibleHistoryLabel = favoritesOnly ? 'favorite creations' : `${filterLabel.toLowerCase()} creations`

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setFilterOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const emptyCopy = useMemo(() => {
    if (favoritesOnly) return "You haven't favorited any creations yet."
    if (filter === 'video') return "You haven't created any videos yet."
    if (filter === 'image') return "You haven't created any images yet."
    return "Oops! It looks like you haven't created anything yet."
  }, [favoritesOnly, filter])

  return (
    <div className={styles.page}>
      <section className={styles.workspace} aria-label="Create workspace">
        <div className={styles.historyFilters}>
          <div className={styles.filterWrap}>
            <button type="button" className={styles.filterButton} onClick={() => setFilterOpen((value) => !value)}>
              {filterLabel}
              <ChevronDown size={15} />
            </button>
            {filterOpen ? (
              <div className={styles.filterMenu}>
                {FILTERS.map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    className={filter === item.key ? styles.filterOptionActive : ''}
                    onClick={() => {
                      setFilter(item.key)
                      setFilterOpen(false)
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className={`${styles.favoriteButton} ${favoritesOnly ? styles.favoriteButtonActive : ''}`}
            onClick={() => setFavoritesOnly((value) => !value)}
          >
            <Star size={15} />
            Favorites
          </button>
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <Film size={42} />
            <Heart size={20} />
          </div>
          <p>{emptyCopy}</p>
          <span>{visibleHistoryLabel} will appear here after generation.</span>
        </div>

        <div className={styles.composerZone}>
          <div className={styles.promptDock}>
            <PromePromptBox
              styles={promptStyles}
              promptId="createPrompt"
              generatorHref="/tools"
              displayName="Seedance 2.0"
              modelSlug="create"
              analyticsLocation="create_page_prompt_box"
              uploadAccept="image/jpeg,image/jpg,image/png,image/webp"
              category="video"
              generatorLinks={{ text: '/tools', image: '/tools' }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
