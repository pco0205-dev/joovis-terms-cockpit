import type { ReviewStatus } from './types'

const FAVORITES_KEY = 'joovis_terms_cockpit_favorites'
const REVIEW_STATUS_KEY = 'joovis_terms_cockpit_review_statuses'
const ONBOARDING_DISMISSED_KEY = 'joovis_terms_cockpit_onboarding_dismissed'
const RANDOM_PRACTICE_COUNTS_KEY = 'joovis_terms_cockpit_random_practice_counts'

export function loadFavoriteIds() {
  return new Set(readJson<string[]>(FAVORITES_KEY, []))
}

export function saveFavoriteIds(favoriteIds: Set<string>) {
  writeJson(FAVORITES_KEY, [...favoriteIds])
}

export function loadReviewStatuses() {
  return readJson<Record<string, ReviewStatus>>(REVIEW_STATUS_KEY, {})
}

export function saveReviewStatuses(reviewStatuses: Record<string, ReviewStatus>) {
  writeJson(REVIEW_STATUS_KEY, reviewStatuses)
}

export function loadOnboardingDismissed() {
  return readJson<boolean>(ONBOARDING_DISMISSED_KEY, false)
}

export function saveOnboardingDismissed(dismissed: boolean) {
  writeJson(ONBOARDING_DISMISSED_KEY, dismissed)
}

export function loadRandomPracticeCount(dateKey: string) {
  const counts = readJson<Record<string, number>>(RANDOM_PRACTICE_COUNTS_KEY, {})
  return counts[dateKey] ?? 0
}

export function saveRandomPracticeCount(dateKey: string, count: number) {
  const counts = readJson<Record<string, number>>(RANDOM_PRACTICE_COUNTS_KEY, {})
  writeJson(RANDOM_PRACTICE_COUNTS_KEY, { ...counts, [dateKey]: count })
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? (JSON.parse(rawValue) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private browsing or locked-down webviews.
  }
}
