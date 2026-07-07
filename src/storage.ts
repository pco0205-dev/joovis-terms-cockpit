import type { ReviewSchedule, ReviewStatus } from './types'

const FAVORITES_KEY = 'joovis_terms_cockpit_favorites'
const REVIEW_STATUS_KEY = 'joovis_terms_cockpit_review_statuses'
const ONBOARDING_DISMISSED_KEY = 'joovis_terms_cockpit_onboarding_dismissed'
const RANDOM_PRACTICE_COUNTS_KEY = 'joovis_terms_cockpit_random_practice_counts'
const RANDOM_PRACTICE_HISTORY_KEY = 'joovis_terms_cockpit_random_practice_history'
const TERM_MEMOS_KEY = 'joovis_terms_cockpit_term_memos'
const REVIEW_SCHEDULES_KEY = 'joovis_terms_cockpit_review_schedules'

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

export function loadReviewSchedules() {
  return readJson<Record<string, ReviewSchedule>>(REVIEW_SCHEDULES_KEY, {})
}

export function saveReviewSchedules(reviewSchedules: Record<string, ReviewSchedule>) {
  writeJson(REVIEW_SCHEDULES_KEY, reviewSchedules)
}

export function loadTermMemos() {
  return readJson<Record<string, string>>(TERM_MEMOS_KEY, {})
}

export function saveTermMemos(termMemos: Record<string, string>) {
  writeJson(TERM_MEMOS_KEY, termMemos)
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

export function loadRandomPracticeHistory(dateKey: string) {
  const histories = readJson<Record<string, string[]>>(RANDOM_PRACTICE_HISTORY_KEY, {})
  return histories[dateKey] ?? []
}

export function saveRandomPracticeHistory(dateKey: string, termIds: string[]) {
  const histories = readJson<Record<string, string[]>>(RANDOM_PRACTICE_HISTORY_KEY, {})
  writeJson(RANDOM_PRACTICE_HISTORY_KEY, { ...histories, [dateKey]: termIds })
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
