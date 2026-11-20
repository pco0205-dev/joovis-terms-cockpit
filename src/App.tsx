import { useEffect, useMemo, useRef, useState } from 'react'
import InstructionComposer from './InstructionComposer'
import { devTerms } from './devTerms'
import { emptyInstructionDraft, type InstructionDraft } from './instructionIntents'
import { getKoreanCategory, koreanizeTermProse } from './koreanTermProse'
import {
  deckDefinitions,
  type ArchitectureStatus,
  type DeckId,
  type DevTerm,
  type Difficulty,
  type LearningPriority,
  type LearningScope,
  type RecallMode,
  type ReviewSchedule,
  type ReviewStatus,
  type SavedExpression,
} from './types'
import {
  loadFavoriteIds,
  loadActiveDeck,
  loadLearningScope,
  loadOnboardingDismissed,
  loadRandomPracticeCount,
  loadRandomPracticeHistory,
  loadRecallMode,
  loadReviewSchedules,
  loadReviewStatuses,
  loadRoutineChecks,
  loadSavedExpressions,
  loadTermMemos,
  loadTrainingPracticeCount,
  loadTrainingPracticeHistory,
  saveFavoriteIds,
  saveActiveDeck,
  saveLearningScope,
  saveOnboardingDismissed,
  saveRandomPracticeCount,
  saveRandomPracticeHistory,
  saveRecallMode,
  saveReviewSchedules,
  saveReviewStatuses,
  saveRoutineChecks,
  saveSavedExpressions,
  saveTermMemos,
  saveTrainingPracticeCount,
  saveTrainingPracticeHistory,
} from './storage'

type Mode = 'routine' | 'today' | 'random' | 'review' | 'training' | 'search' | 'interpret'
type ViewState = { deck: DeckId; mode: Mode }
type DifficultyFilter = 'all' | Difficulty
type PriorityFilter = 'all' | LearningPriority
type UndoAction =
  | {
      kind: 'review'
      termId: string
      message: string
      hadReviewStatus: boolean
      previousReviewStatus?: ReviewStatus
      hadReviewSchedule: boolean
      previousReviewSchedule?: ReviewSchedule
    }
  | {
      kind: 'favorite'
      termId: string
      message: string
      wasFavorite: boolean
    }

type InstructionElementId = 'goal' | 'input' | 'boundary' | 'output' | 'validation'

type InstructionChecklistResult = {
  id: InstructionElementId
  label: string
  passed: boolean
  hint: string
}

const studyModes = [
  { id: 'today', label: '오늘' },
  { id: 'random', label: '랜덤' },
  { id: 'review', label: '복습' },
  { id: 'search', label: '검색' },
] as const

const moreModes = [
  { id: 'routine', label: '오늘 루틴' },
  { id: 'training', label: '어휘·지시 연습' },
  { id: 'interpret', label: '보고서 해석' },
] as const

const guideItems = [
  {
    title: '학습장 고르기',
    body: '상단에서 주비스, 파운드리처럼 공부할 분야를 고릅니다.',
  },
  {
    title: '오늘 한 단어',
    body: '뜻과 발음을 읽고, 익숙하지 않은 용어는 ‘다시 보기’로 표시합니다.',
  },
  {
    title: '연습하거나 찾아보기',
    body: '랜덤은 새 용어, 복습은 다시 볼 용어, 검색은 필요한 용어를 찾는 곳입니다.',
  },
]

const difficultyFilters: Array<{ id: DifficultyFilter; label: string }> = [
  { id: 'all', label: '전체 난이도' },
  { id: 'basic', label: '기본' },
  { id: 'intermediate', label: '중급' },
  { id: 'advanced', label: '고급' },
]

const priorityFilters: Array<{ id: PriorityFilter; label: string }> = [
  { id: 'all', label: '전체 우선순위' },
  { id: 'core', label: '핵심' },
  { id: 'working', label: '실무 확장' },
  { id: 'reference', label: '전문 참고' },
]

const recallModeOptions: Array<{ id: RecallMode; label: string }> = [
  { id: 'english-korean', label: '발음에서 뜻 찾기' },
  { id: 'korean-english', label: '뜻에서 원어 찾기' },
  { id: 'mechanism', label: '작동 원리 설명하기' },
]

const instructionElementDefinitions: Array<{
  id: InstructionElementId
  label: string
  pattern: RegExp
  hint: string
}> = [
  {
    id: 'goal',
    label: '목표',
    pattern:
      /목표|목적|완료|구현|수정|분석|검토|작성|생성|탐색|비교|분류|설명|판정|배포|goal|objective|implement|fix|analy[sz]e|review|create|identify|compare|classify|explain|determine|deploy/i,
    hint: '무엇을 완료해야 하는지 행동으로 적으세요.',
  },
  {
    id: 'input',
    label: '입력',
    pattern:
      /입력|자료|파일|코드|로그|문서|폴더|저장소|현재 상태|참고문|원문|input|material|file|code|log|document|folder|repository|context|source text|reference/i,
    hint: '어떤 파일·문서·상태를 기준으로 볼지 적으세요.',
  },
  {
    id: 'boundary',
    label: '경계',
    pattern:
      /경계|범위|금지|제외|허용|하지\s*마|하지\s*말|오직|안에서만|내에서만|scope|boundary|do not|must not|only|within|exclude|avoid|allowed/i,
    hint: '허용 범위와 하지 말아야 할 일을 적으세요.',
  },
  {
    id: 'output',
    label: '출력',
    pattern:
      /출력|형식|보고|목록|표로|표\s*형식|테이블|요약|단계별|JSON|CSV|Markdown|output|format|report|list|table|summary|respond|return/i,
    hint: '원하는 답변 형식과 포함 항목을 적으세요.',
  },
  {
    id: 'validation',
    label: '검증',
    pattern:
      /검증|확인|테스트|빌드|린트|근거|판정|통과|실패|verify|validate|test|build|lint|evidence|acceptance|pass|fail/i,
    hint: '완료를 무엇으로 확인할지 적으세요.',
  },
]

const instructionTemplateFields: Record<InstructionElementId, string> = {
  goal: '목표',
  input: '입력 자료',
  boundary: '허용/금지 경계',
  output: '출력 형식',
  validation: '검증 기준',
}

const instructionTemplate = Object.values(instructionTemplateFields)
  .map((label) => `${label}:`)
  .join('\n')

function App() {
  const [activeDeck, setActiveDeck] = useState<DeckId>(loadActiveDeck)
  const [activeMode, setActiveMode] = useState<Mode>('today')
  const morePanelRef = useRef<HTMLDivElement>(null)
  const [viewHistory, setViewHistory] = useState<ViewState[]>([])
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [learningScope, setLearningScope] = useState<LearningScope>(() => loadLearningScope())
  const [recallMode, setRecallMode] = useState<RecallMode>(() => loadRecallMode())
  const [searchAllDecks, setSearchAllDecks] = useState(false)
  const [searchFavoritesOnly, setSearchFavoritesOnly] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => loadFavoriteIds())
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, ReviewStatus>>(() =>
    loadReviewStatuses(),
  )
  const [reviewSchedules, setReviewSchedules] = useState<Record<string, ReviewSchedule>>(() =>
    loadReviewSchedules(),
  )
  const [termMemos, setTermMemos] = useState<Record<string, string>>(() => loadTermMemos())
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null)
  const [reportText, setReportText] = useState('')
  const [isGuideOpen, setIsGuideOpen] = useState(() => !loadOnboardingDismissed())
  const [todayDateKey, setTodayDateKey] = useState(() => getDateKey(new Date()))
  const [visibleSearchCount, setVisibleSearchCount] = useState(30)
  const [reviewIndexes, setReviewIndexes] = useState<Record<DeckId, number>>(() =>
    Object.fromEntries(deckDefinitions.map((deck) => [deck.id, 0])) as Record<DeckId, number>,
  )
  const [routineChecksByKey, setRoutineChecksByKey] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      deckDefinitions.map((deck) => [
        getRoutineKey(todayDateKey, deck.id),
        loadRoutineChecks(getRoutineKey(todayDateKey, deck.id)),
      ]),
    ),
  )
  const [randomTermIds, setRandomTermIds] = useState<Partial<Record<DeckId, string>>>({})
  const [randomPracticeCounts, setRandomPracticeCounts] = useState<Record<DeckId, number>>(() =>
    Object.fromEntries(
      deckDefinitions.map((deck) => {
        const key = getRandomPracticeKey(todayDateKey, deck.id, learningScope)
        return [
          deck.id,
          Math.max(loadRandomPracticeCount(key), loadRandomPracticeHistory(key).length),
        ]
      }),
    ) as Record<DeckId, number>,
  )
  const [randomPracticeHistories, setRandomPracticeHistories] = useState<Record<DeckId, string[]>>(
    () =>
      Object.fromEntries(
        deckDefinitions.map((deck) => [
          deck.id,
          loadRandomPracticeHistory(getRandomPracticeKey(todayDateKey, deck.id, learningScope)),
        ]),
      ) as Record<DeckId, string[]>,
  )
  const [randomHistoryIndexes, setRandomHistoryIndexes] = useState<Record<DeckId, number>>(() =>
    Object.fromEntries(
      deckDefinitions.map((deck) => {
        const history = loadRandomPracticeHistory(
          getRandomPracticeKey(todayDateKey, deck.id, learningScope),
        )
        return [deck.id, Math.max(history.length - 1, 0)]
      }),
    ) as Record<DeckId, number>,
  )
  const [trainingTermIds, setTrainingTermIds] = useState<Partial<Record<DeckId, string>>>({})
  const [trainingPracticeCounts, setTrainingPracticeCounts] = useState<Record<DeckId, number>>(() =>
    Object.fromEntries(
      deckDefinitions.map((deck) => [
        deck.id,
        loadTrainingPracticeCount(getTrainingPracticeKey(todayDateKey, deck.id, learningScope)),
      ]),
    ) as Record<DeckId, number>,
  )
  const [trainingPracticeHistories, setTrainingPracticeHistories] = useState<
    Record<DeckId, string[]>
  >(
    () =>
      Object.fromEntries(
        deckDefinitions.map((deck) => [
          deck.id,
          loadTrainingPracticeHistory(getTrainingPracticeKey(todayDateKey, deck.id, learningScope)),
        ]),
      ) as Record<DeckId, string[]>,
  )
  const [trainingAnswer, setTrainingAnswer] = useState('')
  const [trainingView, setTrainingView] = useState<'compose' | 'cards'>('compose')
  const [isTrainingSolutionVisible, setIsTrainingSolutionVisible] = useState(false)
  const [savedExpressions, setSavedExpressions] = useState<SavedExpression[]>(() =>
    loadSavedExpressions(),
  )
  const [expressionDraft, setExpressionDraft] = useState<InstructionDraft>(emptyInstructionDraft)
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null)

  useEffect(() => {
    const updateOnlineState = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateOnlineState)
    window.addEventListener('offline', updateOnlineState)
    return () => {
      window.removeEventListener('online', updateOnlineState)
      window.removeEventListener('offline', updateOnlineState)
    }
  }, [])

  useEffect(() => {
    if (!undoAction) {
      return
    }
    const timeoutId = window.setTimeout(() => setUndoAction(null), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [undoAction])

  useEffect(() => {
    const updateDate = () => setTodayDateKey(getDateKey(new Date()))
    const intervalId = window.setInterval(updateDate, 60_000)
    window.addEventListener('focus', updateDate)
    document.addEventListener('visibilitychange', updateDate)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', updateDate)
      document.removeEventListener('visibilitychange', updateDate)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRoutineChecksByKey(
        Object.fromEntries(
          deckDefinitions.map((deck) => {
            const key = getRoutineKey(todayDateKey, deck.id)
            return [key, loadRoutineChecks(key)]
          }),
        ),
      )
      const nextRandomHistories = Object.fromEntries(
        deckDefinitions.map((deck) => {
          const key = getRandomPracticeKey(todayDateKey, deck.id, learningScope)
          return [deck.id, loadRandomPracticeHistory(key)]
        }),
      ) as Record<DeckId, string[]>
      setRandomPracticeCounts(
        Object.fromEntries(
          deckDefinitions.map((deck) => {
            const key = getRandomPracticeKey(todayDateKey, deck.id, learningScope)
            const storedCount = loadRandomPracticeCount(key)
            const normalizedCount = Math.max(storedCount, nextRandomHistories[deck.id].length)
            if (normalizedCount !== storedCount) {
              saveRandomPracticeCount(key, normalizedCount)
            }
            return [deck.id, normalizedCount]
          }),
        ) as Record<DeckId, number>,
      )
      setRandomPracticeHistories(nextRandomHistories)
      setRandomHistoryIndexes(
        Object.fromEntries(
          deckDefinitions.map((deck) => [
            deck.id,
            Math.max(nextRandomHistories[deck.id].length - 1, 0),
          ]),
        ) as Record<DeckId, number>,
      )
      setRandomTermIds({})

      setTrainingPracticeCounts(
        Object.fromEntries(
          deckDefinitions.map((deck) => {
            const key = getTrainingPracticeKey(todayDateKey, deck.id, learningScope)
            return [deck.id, loadTrainingPracticeCount(key)]
          }),
        ) as Record<DeckId, number>,
      )
      setTrainingPracticeHistories(
        Object.fromEntries(
          deckDefinitions.map((deck) => {
            const key = getTrainingPracticeKey(todayDateKey, deck.id, learningScope)
            return [deck.id, loadTrainingPracticeHistory(key)]
          }),
        ) as Record<DeckId, string[]>,
      )
      setTrainingTermIds({})
      setTrainingAnswer('')
      setIsTrainingSolutionVisible(false)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [learningScope, todayDateKey])

  const activeDeckDefinition = deckDefinitions.find((deck) => deck.id === activeDeck)!
  const deckTerms = useMemo(() => devTerms.filter((term) => term.deck === activeDeck), [activeDeck])
  const activeDeckTerms = useMemo(
    () =>
      deckTerms.filter(
        (term) => learningScope === 'all' || term.learningPriority === 'core',
      ),
    [deckTerms, learningScope],
  )
  const routineKey = getRoutineKey(todayDateKey, activeDeck)
  const routineChecks = routineChecksByKey[routineKey] ?? []
  const todayTerm = useMemo(
    () =>
      activeDeckTerms.length > 0
        ? activeDeckTerms[
            hashString(`${activeDeck}:${learningScope}:${todayDateKey}`) % activeDeckTerms.length
          ]
        : undefined,
    [activeDeck, activeDeckTerms, learningScope, todayDateKey],
  )
  const currentRandomHistory = randomPracticeHistories[activeDeck] ?? []
  const randomHistoryIndex = Math.min(
    randomHistoryIndexes[activeDeck] ?? Math.max(currentRandomHistory.length - 1, 0),
    Math.max(currentRandomHistory.length - 1, 0),
  )
  const randomHistoryTermId = currentRandomHistory[randomHistoryIndex]
  const randomTerm = useMemo(() => {
    if (activeDeckTerms.length === 0) {
      return undefined
    }
    const selectedId = randomHistoryTermId ?? randomTermIds[activeDeck]
    const unseenTerms = getUnseenTerms(activeDeckTerms, randomPracticeHistories[activeDeck] ?? [])
    return (
      activeDeckTerms.find((term) => term.id === selectedId) ??
      pickRandomTerm(
        unseenTerms.length > 0 ? unseenTerms : activeDeckTerms,
        null,
        `random-${activeDeck}-${learningScope}-${todayDateKey}`,
      )
    )
  }, [activeDeck, activeDeckTerms, learningScope, randomHistoryTermId, randomPracticeHistories, randomTermIds, todayDateKey])

  useEffect(() => {
    if (
      activeMode !== 'random' ||
      !randomTerm ||
      activeDeckTerms.length === 0 ||
      currentRandomHistory.length > 0
    ) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const practiceKey = getRandomPracticeKey(todayDateKey, activeDeck, learningScope)
      const nextHistory = [randomTerm.id]
      saveRandomPracticeHistory(practiceKey, nextHistory)
      setRandomTermIds((current) => ({ ...current, [activeDeck]: randomTerm.id }))
      setRandomHistoryIndexes((current) => ({ ...current, [activeDeck]: 0 }))
      setRandomPracticeHistories((current) => ({ ...current, [activeDeck]: nextHistory }))
      setRandomPracticeCounts((current) => {
        const nextCount = Math.max(current[activeDeck] ?? 0, 1)
        saveRandomPracticeCount(practiceKey, nextCount)
        return { ...current, [activeDeck]: nextCount }
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [
    activeDeck,
    activeDeckTerms.length,
    activeMode,
    currentRandomHistory.length,
    learningScope,
    randomTerm,
    todayDateKey,
  ])

  const randomSeenCount = Math.min(
    currentRandomHistory.length,
    activeDeckTerms.length,
  )
  const randomRemainingCount = Math.max(activeDeckTerms.length - randomSeenCount, 0)
  const canGoPreviousRandomTerm = currentRandomHistory.length > 1 && randomHistoryIndex > 0
  const reviewTerms = useMemo(
    () => deckTerms.filter((term) =>
      isReviewDue(reviewSchedules[term.id], todayDateKey, reviewStatuses[term.id]),
    ),
    [deckTerms, reviewSchedules, reviewStatuses, todayDateKey],
  )
  const deckReviewedTodayCount = deckTerms.filter(
    (term) => reviewSchedules[term.id]?.lastReviewedDate === todayDateKey,
  ).length
  const trainingTerms = useMemo(
    () => activeDeckTerms.filter((term) => term.badExpression && term.goodExpression),
    [activeDeckTerms],
  )
  const trainingTerm = useMemo(() => {
    if (trainingTerms.length === 0) {
      return undefined
    }
    const selectedId = trainingTermIds[activeDeck]
    const unseenTerms = getUnseenTerms(trainingTerms, trainingPracticeHistories[activeDeck] ?? [])
    return (
      trainingTerms.find((term) => term.id === selectedId) ??
      pickRandomTerm(unseenTerms.length > 0 ? unseenTerms : trainingTerms, null, `training-${activeDeck}-${todayDateKey}`)
    )
  }, [activeDeck, todayDateKey, trainingPracticeHistories, trainingTermIds, trainingTerms])
  const trainingSeenCount = Math.min(
    trainingPracticeHistories[activeDeck]?.length ?? 0,
    trainingTerms.length,
  )
  const trainingRemainingCount = Math.max(trainingTerms.length - trainingSeenCount, 0)
  const instructionChecklist = useMemo(
    () => analyzeInstructionDraft(trainingAnswer),
    [trainingAnswer],
  )
  const instructionChecklistScore = instructionChecklist.filter((item) => item.passed).length
  const todayDone = todayTerm ? Boolean(reviewStatuses[todayTerm.id]) : false
  const randomDone = (randomPracticeCounts[activeDeck] ?? 0) >= 5
  const reviewGoal = Math.min(5, Math.max(reviewTerms.length, deckReviewedTodayCount))
  const reviewDone = reviewGoal === 0 || deckReviewedTodayCount >= reviewGoal
  const deckTrainingDone = (trainingPracticeCounts[activeDeck] ?? 0) >= 2
  const searchDone = routineChecks.includes('search')

  const reviewIndex = Math.min(
    reviewIndexes[activeDeck] ?? 0,
    Math.max(reviewTerms.length - 1, 0),
  )
  const reviewTerm = reviewTerms[reviewIndex]
  const canGoPreviousReviewTerm = reviewIndex > 0
  const canGoNextReviewTerm = reviewIndex < reviewTerms.length - 1
  const searchSourceTerms = useMemo(() => {
    const sourceTerms = searchAllDecks ? devTerms : deckTerms
    return sourceTerms.filter(
      (term) =>
        (difficultyFilter === 'all' || term.difficulty === difficultyFilter) &&
        (priorityFilter === 'all' || term.learningPriority === priorityFilter) &&
        (!searchFavoritesOnly || favoriteIds.has(term.id)),
    )
  }, [deckTerms, difficultyFilter, favoriteIds, priorityFilter, searchAllDecks, searchFavoritesOnly])
  const hasSearchFilters =
    selectedCategory !== 'All' || difficultyFilter !== 'all' ||
    priorityFilter !== 'all' || searchFavoritesOnly || searchAllDecks
  const reportSourceTerms = searchAllDecks ? devTerms : deckTerms
  const availableCategories = useMemo(
    () => ['All', ...Array.from(new Set(searchSourceTerms.map((term) => term.category))).sort()],
    [searchSourceTerms],
  )
  const searchTerms = useMemo(() => {
    const normalizedQuery = normalizeText(query)
    const nameQuery = normalizeTermKey(normalizedQuery)
    const category = availableCategories.includes(selectedCategory) ? selectedCategory : 'All'
    const matchingTerms: Array<{ term: DevTerm; rank: number }> = []

    for (const term of searchSourceTerms) {
      if (category !== 'All' && term.category !== category) continue
      if (!normalizedQuery) {
        matchingTerms.push({ term, rank: 0 })
        continue
      }

      const names = getTermNameKeys(term)
      if (nameQuery && names.some((name) => name.includes(nameQuery))) {
        matchingTerms.push({ term, rank: names.includes(nameQuery) ? 0 : 1 })
        continue
      }
      const searchableText = normalizeText(
        [
          term.term,
          term.koreanName,
          term.pronunciation,
          term.koreanMeaning,
          term.simpleMeaning,
          term.joovisUsage,
          term.disputeUsage,
          term.badExpression,
          term.goodExpression,
          term.gptPromptExample,
          term.codexPromptExample,
          term.checkQuestion,
          term.mentalModel,
          term.whyItMatters,
          term.withoutIt,
          term.realWorkflow,
          term.mechanism,
          term.usagePattern,
          term.commonPitfall,
          term.expertNote,
          term.researchBasis,
          term.architectureStatus,
          term.statusNote,
          term.selectionReason,
          term.learningPriority,
          term.relatedTerms?.join(' '),
          termMemos[term.id],
          term.domainLabel,
          getKoreanCategory(term.category),
        ]
          .filter(Boolean)
          .join(' '),
      )

      if (searchableText.includes(normalizedQuery)) matchingTerms.push({ term, rank: 2 })
    }
    return matchingTerms.sort((first, second) => first.rank - second.rank).map(({ term }) => term)
  }, [availableCategories, query, searchSourceTerms, selectedCategory, termMemos])
  const visibleSearchTerms = searchTerms.slice(0, visibleSearchCount)
  const reportMatches = useMemo(
    () => findReportMatches(reportText, reportSourceTerms),
    [reportSourceTerms, reportText],
  )

  const rememberCurrentView = () => {
    setViewHistory((current) => {
      const nextView = { deck: activeDeck, mode: activeMode }
      const previousView = current[current.length - 1]
      if (previousView?.deck === nextView.deck && previousView.mode === nextView.mode) {
        return current
      }
      return [...current, nextView].slice(-20)
    })
  }

  const selectDeck = (deckId: DeckId) => {
    if (deckId !== activeDeck) {
      rememberCurrentView()
    }
    setActiveDeck(deckId)
    saveActiveDeck(deckId)
    setSelectedCategory('All')
    setExpandedTermId(null)
    setQuery('')
    setVisibleSearchCount(30)
    setTrainingAnswer('')
    setIsTrainingSolutionVisible(false)
  }

  const closeMorePanel = () => {
    const panel = morePanelRef.current
    if (panel?.hidePopover && panel.matches(':popover-open')) panel.hidePopover()
  }

  const selectMode = (modeId: Mode) => {
    if (modeId !== activeMode) {
      rememberCurrentView()
      setActiveMode(modeId)
      setExpandedTermId(null)
      window.scrollTo(0, 0)
    }
  }

  const goBack = () => {
    const previousView = viewHistory[viewHistory.length - 1]
    if (!previousView) {
      return
    }
    setViewHistory((current) => current.slice(0, -1))
    setActiveDeck(previousView.deck)
    saveActiveDeck(previousView.deck)
    setActiveMode(previousView.mode)
    setSelectedCategory('All')
    setExpandedTermId(null)
    setQuery('')
    window.scrollTo(0, 0)
  }

  const changeLearningScope = (scope: LearningScope) => {
    saveLearningScope(scope)
    setLearningScope(scope)
  }

  const changeRecallMode = (mode: RecallMode) => {
    saveRecallMode(mode)
    setRecallMode(mode)
  }

  const openRelatedTerm = (relatedTerm: string, sourceDeck: DeckId) => {
    const matchedTerm = findTermByName(relatedTerm, sourceDeck)
    if (!matchedTerm) {
      setQuery(relatedTerm)
      selectMode('search')
      return
    }
    rememberCurrentView()
    setActiveDeck(matchedTerm.deck)
    setActiveMode('search')
    setSearchAllDecks(false)
    setSearchFavoritesOnly(false)
    setSelectedCategory('All')
    setDifficultyFilter('all')
    setPriorityFilter('all')
    setVisibleSearchCount(30)
    setQuery(matchedTerm.term)
    setExpandedTermId(matchedTerm.id)
    window.scrollTo(0, 0)
  }

  const updateTermMemo = (termId: string, memo: string) => {
    setTermMemos((current) => {
      const next = { ...current }
      if (memo.trim()) {
        next[termId] = memo
      } else {
        delete next[termId]
      }
      saveTermMemos(next)
      return next
    })
  }

  const toggleFavorite = (termId: string) => {
    const wasFavorite = favoriteIds.has(termId)
    setUndoAction({
      kind: 'favorite',
      termId,
      message: wasFavorite ? '중요 저장을 해제했습니다.' : '중요 용어로 저장했습니다.',
      wasFavorite,
    })
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (next.has(termId)) {
        next.delete(termId)
      } else {
        next.add(termId)
      }
      saveFavoriteIds(next)
      return next
    })
  }

  const updateReviewStatus = (termId: string, nextStatus: ReviewStatus) => {
    setUndoAction({
      kind: 'review',
      termId,
      message: nextStatus === 'known' ? '알고 있음으로 기록했습니다.' : '다시 보기로 기록했습니다.',
      hadReviewStatus: Object.prototype.hasOwnProperty.call(reviewStatuses, termId),
      previousReviewStatus: reviewStatuses[termId],
      hadReviewSchedule: Object.prototype.hasOwnProperty.call(reviewSchedules, termId),
      previousReviewSchedule: reviewSchedules[termId],
    })
    setReviewStatuses((current) => {
      const next = { ...current, [termId]: nextStatus }
      saveReviewStatuses(next)
      return next
    })
    setReviewSchedules((current) => {
      const next = {
        ...current,
        [termId]: buildNextReviewSchedule(current[termId], nextStatus, todayDateKey),
      }
      saveReviewSchedules(next)
      return next
    })
  }

  const undoLastAction = () => {
    if (!undoAction) {
      return
    }

    if (undoAction.kind === 'favorite') {
      setFavoriteIds((current) => {
        const next = new Set(current)
        if (undoAction.wasFavorite) {
          next.add(undoAction.termId)
        } else {
          next.delete(undoAction.termId)
        }
        saveFavoriteIds(next)
        return next
      })
    } else {
      setReviewStatuses((current) => {
        const next = { ...current }
        if (undoAction.hadReviewStatus && undoAction.previousReviewStatus) {
          next[undoAction.termId] = undoAction.previousReviewStatus
        } else {
          delete next[undoAction.termId]
        }
        saveReviewStatuses(next)
        return next
      })
      setReviewSchedules((current) => {
        const next = { ...current }
        if (undoAction.hadReviewSchedule && undoAction.previousReviewSchedule) {
          next[undoAction.termId] = undoAction.previousReviewSchedule
        } else {
          delete next[undoAction.termId]
        }
        saveReviewSchedules(next)
        return next
      })
    }

    setUndoAction(null)
  }

  const toggleRoutineCheck = (checkId: string) => {
    setRoutineChecksByKey((current) => {
      const currentChecks = current[routineKey] ?? []
      const nextSet = new Set(currentChecks)
      if (nextSet.has(checkId)) {
        nextSet.delete(checkId)
      } else {
        nextSet.add(checkId)
      }
      const next = [...nextSet]
      saveRoutineChecks(routineKey, next)
      return { ...current, [routineKey]: next }
    })
  }

  const showNextRandomTerm = () => {
    if (!randomTerm || activeDeckTerms.length === 0) {
      return
    }
    const practiceKey = getRandomPracticeKey(todayDateKey, activeDeck, learningScope)
    const currentHistory = randomPracticeHistories[activeDeck] ?? []
    const currentIndex = Math.min(
      randomHistoryIndexes[activeDeck] ?? Math.max(currentHistory.length - 1, 0),
      Math.max(currentHistory.length - 1, 0),
    )

    if (currentHistory.length > 0 && currentIndex < currentHistory.length - 1) {
      const nextIndex = currentIndex + 1
      const nextTermId = currentHistory[nextIndex]
      setRandomHistoryIndexes((current) => ({ ...current, [activeDeck]: nextIndex }))
      setRandomTermIds((current) => ({ ...current, [activeDeck]: nextTermId }))
      return
    }

    const historyWithCurrent = currentHistory.includes(randomTerm.id)
      ? currentHistory
      : [...currentHistory, randomTerm.id]
    const unseenTerms = getUnseenTerms(activeDeckTerms, historyWithCurrent)
    const nextCycleStarted = unseenTerms.length === 0
    const nextPool = nextCycleStarted
      ? activeDeckTerms.filter((term) => term.id !== randomTerm.id)
      : unseenTerms
    const nextTerm = pickRandomTerm(nextPool.length > 0 ? nextPool : activeDeckTerms, randomTerm.id)
    const nextHistory = nextCycleStarted ? [nextTerm.id] : [...historyWithCurrent, nextTerm.id]
    const nextIndex = nextHistory.length - 1
    setRandomTermIds((current) => ({ ...current, [activeDeck]: nextTerm.id }))
    setRandomHistoryIndexes((current) => ({ ...current, [activeDeck]: nextIndex }))
    setRandomPracticeHistories((current) => {
      saveRandomPracticeHistory(practiceKey, nextHistory)
      return { ...current, [activeDeck]: nextHistory }
    })
    setRandomPracticeCounts((current) => {
      const nextCount = (current[activeDeck] ?? 0) + 1
      saveRandomPracticeCount(practiceKey, nextCount)
      return { ...current, [activeDeck]: nextCount }
    })
  }

  const showPreviousRandomTerm = () => {
    const currentHistory = randomPracticeHistories[activeDeck] ?? []
    if (currentHistory.length < 2) {
      return
    }
    const currentIndex = Math.min(
      randomHistoryIndexes[activeDeck] ?? currentHistory.length - 1,
      currentHistory.length - 1,
    )
    if (currentIndex <= 0) {
      return
    }
    const previousIndex = currentIndex - 1
    const previousTermId = currentHistory[previousIndex]
    setRandomHistoryIndexes((current) => ({ ...current, [activeDeck]: previousIndex }))
    setRandomTermIds((current) => ({ ...current, [activeDeck]: previousTermId }))
  }

  const showPreviousReviewTerm = () => {
    setReviewIndexes((current) => ({
      ...current,
      [activeDeck]: Math.max(reviewIndex - 1, 0),
    }))
  }

  const showNextReviewTerm = () => {
    setReviewIndexes((current) => ({
      ...current,
      [activeDeck]: Math.min(reviewIndex + 1, Math.max(reviewTerms.length - 1, 0)),
    }))
  }

  const revealTrainingSolution = () => {
    if (!trainingTerm) {
      return
    }
    setTrainingTermIds((current) => ({ ...current, [activeDeck]: trainingTerm.id }))
    setIsTrainingSolutionVisible(true)
    const practiceKey = getTrainingPracticeKey(todayDateKey, activeDeck, learningScope)
    const currentHistory = trainingPracticeHistories[activeDeck] ?? []
    if (currentHistory.includes(trainingTerm.id)) {
      return
    }
    const nextHistory = [...currentHistory, trainingTerm.id]
    setTrainingPracticeHistories((current) => {
      saveTrainingPracticeHistory(practiceKey, nextHistory)
      return { ...current, [activeDeck]: nextHistory }
    })
    setTrainingPracticeCounts((current) => {
      const nextCount = (current[activeDeck] ?? 0) + 1
      saveTrainingPracticeCount(practiceKey, nextCount)
      return { ...current, [activeDeck]: nextCount }
    })
  }

  const showNextTrainingTerm = () => {
    if (!trainingTerm || trainingTerms.length === 0) {
      return
    }
    const practiceKey = getTrainingPracticeKey(todayDateKey, activeDeck, learningScope)
    const currentHistory = trainingPracticeHistories[activeDeck] ?? []
    const historyWithCurrent = currentHistory.includes(trainingTerm.id)
      ? currentHistory
      : [...currentHistory, trainingTerm.id]
    const unseenTerms = getUnseenTerms(trainingTerms, historyWithCurrent)
    const nextCycleStarted = unseenTerms.length === 0
    const nextPool = nextCycleStarted
      ? trainingTerms.filter((term) => term.id !== trainingTerm.id)
      : unseenTerms
    const nextTerm = pickRandomTerm(nextPool.length > 0 ? nextPool : trainingTerms, trainingTerm.id)
    const nextHistory = nextCycleStarted ? [] : historyWithCurrent
    setTrainingTermIds((current) => ({ ...current, [activeDeck]: nextTerm.id }))
    setTrainingPracticeHistories((current) => {
      saveTrainingPracticeHistory(practiceKey, nextHistory)
      return { ...current, [activeDeck]: nextHistory }
    })
    setTrainingAnswer('')
    setIsTrainingSolutionVisible(false)
  }

  const addInstructionTemplate = () => {
    setTrainingAnswer((current) => appendMissingInstructionFields(current))
  }

  const saveExpressionDraft = (original: string, improvedKo: string) => {
    const now = new Date().toISOString()
    const nextExpression: SavedExpression = {
      id: `expression-${Date.now()}`,
      original,
      improvedKo,
      improvedEn: '',
      createdAt: now,
      updatedAt: now,
    }
    setSavedExpressions((current) => {
      const next = [nextExpression, ...current].slice(0, 60)
      saveSavedExpressions(next)
      return next
    })
    setExpressionDraft(emptyInstructionDraft)
  }

  const deleteSavedExpression = (expressionId: string) => {
    setSavedExpressions((current) => {
      const next = current.filter((expression) => expression.id !== expressionId)
      saveSavedExpressions(next)
      return next
    })
  }

  const dismissGuide = () => {
    saveOnboardingDismissed(true)
    setIsGuideOpen(false)
  }

  const routineItems = [
    {
      id: 'today',
      title: '오늘의 용어 1개',
      progress: todayDone ? '완료' : '카드에서 알고 있음/다시 보기 선택',
      done: todayDone,
      actionLabel: '오늘 보기',
      action: () => selectMode('today'),
    },
    {
      id: 'random',
      title: '랜덤 용어 5개',
      progress: `${Math.min(randomPracticeCounts[activeDeck] ?? 0, 5)} / 5`,
      done: randomDone,
      actionLabel: '랜덤 연습',
      action: () => selectMode('random'),
    },
    {
      id: 'review',
      title: '다시 보기 최대 5개',
      progress:
        reviewGoal === 0
          ? '복습 대기 없음'
          : `${Math.min(deckReviewedTodayCount, reviewGoal)} / ${reviewGoal}`,
      done: reviewDone,
      actionLabel: '복습하기',
      action: () => selectMode('review'),
    },
    {
      id: 'training',
      title: '질문 훈련 2개',
      progress: `${Math.min(trainingPracticeCounts[activeDeck] ?? 0, 2)} / 2`,
      done: deckTrainingDone,
      actionLabel: '질문 훈련',
      action: () => {
        setTrainingView('cards')
        selectMode('training')
      },
    },
    {
      id: 'search',
      title: '검색/보고서 용어 찾기',
      progress: searchDone ? '완료' : 'Codex 보고서 용어 1개 찾기',
      done: searchDone,
      actionLabel: searchDone ? '완료 취소' : '검색 완료',
      action: () => toggleRoutineCheck('search'),
    },
  ]
  const routineCompletedCount = routineItems.filter((item) => item.done).length
  const isRoutineComplete = routineCompletedCount === routineItems.length

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          {viewHistory.length > 0 && (
            <button type="button" className="back-button" onClick={goBack} aria-label="뒤로" title="뒤로">
              <span aria-hidden="true">←</span>
            </button>
          )}
          <h1>주비스 용어 콕핏</h1>
        </div>
        <div className="header-actions">
          {!isOnline && <span className="offline-status offline">오프라인</span>}
          <button
            type="button"
            className="more-button"
            popoverTarget="more-panel"
            aria-label="더보기"
            title="더보기"
          >
            <span aria-hidden="true">···</span>
          </button>
        </div>
      </header>

      <div id="more-panel" className="more-panel" popover="auto" ref={morePanelRef}>
        <div className="more-links">
          {moreModes.map((mode) => (
            <button
              type="button"
              key={mode.id}
              aria-pressed={activeMode === mode.id}
              onClick={() => {
                closeMorePanel()
                if (mode.id === 'training') setTrainingView('compose')
                selectMode(mode.id)
              }}
            >
              {mode.label}
            </button>
          ))}
          <button type="button" onClick={() => {
            closeMorePanel()
            setIsGuideOpen(true)
          }}>
            사용법
          </button>
        </div>
        <div className="more-settings">
          <label htmlFor="learning-scope">학습 범위</label>
          <select
            id="learning-scope"
            value={learningScope}
            onChange={(event) => changeLearningScope(event.target.value as LearningScope)}
          >
            <option value="core">핵심 용어</option>
            <option value="all">전체 용어</option>
          </select>
          <label htmlFor="recall-mode">퀴즈 방식</label>
          <select
            id="recall-mode"
            value={recallMode}
            onChange={(event) => changeRecallMode(event.target.value as RecallMode)}
          >
            {recallModeOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="deck-picker">
        <label htmlFor="active-deck">학습장</label>
        <select id="active-deck" value={activeDeck} onChange={(event) => selectDeck(event.target.value as DeckId)}>
          {deckDefinitions.map((deck) => (
            <option key={deck.id} value={deck.id}>{deck.label}</option>
          ))}
        </select>
      </div>

      <nav className="mode-nav" aria-label="학습 모드">
        {studyModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`mode-button ${activeMode === mode.id ? 'active' : ''}`}
            aria-pressed={activeMode === mode.id}
            onClick={() => selectMode(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </nav>

      {activeMode === 'routine' && (
        <ModePanel title="오늘 루틴">
          <section className={`routine-summary ${isRoutineComplete ? 'complete' : ''}`}>
            <div>
              <h3>{isRoutineComplete ? '오늘 완료' : `${routineCompletedCount} / ${routineItems.length}`}</h3>
            </div>
            <span>{activeDeckDefinition.label}</span>
          </section>

          <div className="routine-list">
            {routineItems.map((item) => (
              <article className={`routine-item ${item.done ? 'done' : ''}`} key={item.id}>
                <div>
                  <span>{item.done ? '완료' : '대기'}</span>
                  <h3>{item.title}</h3>
                  <p>{item.progress}</p>
                </div>
                <button type="button" className="secondary-action" onClick={item.action}>
                  {item.actionLabel}
                </button>
              </article>
            ))}
          </div>
        </ModePanel>
      )}

      {activeMode === 'today' && (
        <ModePanel title="오늘의 용어">
          {todayTerm ? (
            <StudyCard
              key={todayTerm.id}
              term={todayTerm}
              startRevealed
              recallMode={recallMode}
              isFavorite={favoriteIds.has(todayTerm.id)}
              reviewStatus={reviewStatuses[todayTerm.id]}
              reviewSchedule={reviewSchedules[todayTerm.id]}
              memo={termMemos[todayTerm.id] ?? ''}
              onToggleFavorite={toggleFavorite}
              onUpdateReviewStatus={updateReviewStatus}
              onUpdateMemo={updateTermMemo}
              onOpenRelatedTerm={openRelatedTerm}
            />
          ) : (
            <EmptyStateCard message="이 학습 범위에 용어가 없습니다. 더보기에서 전체 용어를 선택해 주세요." />
          )}
        </ModePanel>
      )}

      {activeMode === 'random' && (
        <ModePanel title="랜덤 연습">
          {randomTerm ? (
            <StudyCard
              key={randomTerm.id}
              term={randomTerm}
              recallMode={recallMode}
              isFavorite={favoriteIds.has(randomTerm.id)}
              reviewStatus={reviewStatuses[randomTerm.id]}
              reviewSchedule={reviewSchedules[randomTerm.id]}
              memo={termMemos[randomTerm.id] ?? ''}
              onToggleFavorite={toggleFavorite}
              onUpdateReviewStatus={updateReviewStatus}
              onUpdateMemo={updateTermMemo}
              onOpenRelatedTerm={openRelatedTerm}
              navigation={
                <CardNavigation
                  progress={`새 카드 ${randomRemainingCount}개 남음`}
                  onPrevious={canGoPreviousRandomTerm ? showPreviousRandomTerm : undefined}
                  onNext={showNextRandomTerm}
                />
              }
            />
          ) : (
            <EmptyStateCard message="이 학습 범위에 용어가 없습니다. 더보기에서 전체 용어를 선택해 주세요." />
          )}
        </ModePanel>
      )}

      {activeMode === 'review' && (
        <ModePanel title="복습">
          {reviewTerms.length === 0 ? (
            <div className="empty-state-card">
              <p>오늘 복습할 용어가 없습니다.</p>
              <button type="button" className="primary-action" onClick={() => selectMode('random')}>
                랜덤 연습으로 가기
              </button>
            </div>
          ) : reviewTerm && (
            <StudyCard
              key={reviewTerm.id}
              term={reviewTerm}
              recallMode={recallMode}
              isFavorite={favoriteIds.has(reviewTerm.id)}
              reviewStatus={reviewStatuses[reviewTerm.id]}
              reviewSchedule={reviewSchedules[reviewTerm.id]}
              memo={termMemos[reviewTerm.id] ?? ''}
              onToggleFavorite={toggleFavorite}
              onUpdateReviewStatus={updateReviewStatus}
              onUpdateMemo={updateTermMemo}
              onOpenRelatedTerm={openRelatedTerm}
              navigation={
                <CardNavigation
                  progress={`복습 ${reviewIndex + 1} / ${reviewTerms.length}`}
                  onPrevious={canGoPreviousReviewTerm ? showPreviousReviewTerm : undefined}
                  onNext={canGoNextReviewTerm ? showNextReviewTerm : undefined}
                />
              }
            />
          )}
        </ModePanel>
      )}

      {activeMode === 'training' && (
        <ModePanel
          title={trainingView === 'compose' ? '어휘·지시 연습' : getTrainingTitle(activeDeck)}
          subtitle={trainingView === 'cards' ? getTrainingSubtitle(activeDeck) : undefined}
        >
          <div className="training-view-options" aria-label="지시 훈련 방식">
            <button type="button" aria-pressed={trainingView === 'compose'} onClick={() => setTrainingView('compose')}>
              내 말 정리
            </button>
            <button type="button" aria-pressed={trainingView === 'cards'} onClick={() => setTrainingView('cards')}>
              카드 훈련
            </button>
          </div>
          {trainingView === 'cards' ? (
            <div>
              <div className="training-summary">
                <span>오늘 훈련 {trainingPracticeCounts[activeDeck] ?? 0}개</span>
                <span>남은 새 표현 {trainingRemainingCount}개</span>
                <span>{activeDeckDefinition.label}</span>
              </div>

              {trainingTerm ? (
                <section className={`training-card deck-${trainingTerm.deck}`}>
                  <div className="card-meta-row">
                    <div className="badge-group">
                      <span className="category-badge">{trainingTerm.domainLabel}</span>
                      <span className="category-badge">{getKoreanCategory(trainingTerm.category)}</span>
                      <span className="category-badge">{getDifficultyLabel(trainingTerm.difficulty)}</span>
                      <span className={`priority-badge priority-${trainingTerm.learningPriority}`}>
                        {getPriorityLabel(trainingTerm.learningPriority)}
                      </span>
                      <ArchitectureStatusBadge term={trainingTerm} />
                    </div>
                    <StatusBadges
                      isFavorite={favoriteIds.has(trainingTerm.id)}
                      reviewStatus={reviewStatuses[trainingTerm.id]}
                    />
                  </div>

                  <TermHeading term={trainingTerm} />
                  <p className="korean-meaning">{trainingTerm.koreanMeaning}</p>

                  <DetailBlock label="나쁜 지시문" tone="expression">
                    {trainingTerm.badExpression ?? '이거 좀 봐줘.'}
                  </DetailBlock>

                  <div className="training-input-heading">
                    <label className="search-label" htmlFor="training-answer">
                      내가 바꿔본 지시문
                    </label>
                    <button type="button" onClick={addInstructionTemplate}>
                      5요소 틀 넣기
                    </button>
                  </div>
                  <textarea
                    id="training-answer"
                    className="training-input"
                    rows={5}
                    value={trainingAnswer}
                    placeholder="목표, 입력 자료, 금지 경계, 출력 형식, 검증 기준을 넣어서 다시 써보세요."
                    onChange={(event) => setTrainingAnswer(event.target.value)}
                  />

                  <InstructionChecklist
                    items={instructionChecklist}
                    score={instructionChecklistScore}
                  />

                  <div className="training-actions">
                    <button type="button" className="primary-action" onClick={revealTrainingSolution}>
                      모범 표현 보기
                    </button>
                    <button type="button" className="secondary-action" onClick={showNextTrainingTerm}>
                      다음 훈련 카드
                    </button>
                  </div>

                  {isTrainingSolutionVisible && (
                    <div className="training-solution">
                      <ExpressionBlock term={trainingTerm} />
                      <PromptBlock term={trainingTerm} />
                      <TermActions
                        term={trainingTerm}
                        isFavorite={favoriteIds.has(trainingTerm.id)}
                        reviewStatus={reviewStatuses[trainingTerm.id]}
                        reviewSchedule={reviewSchedules[trainingTerm.id]}
                        onToggleFavorite={toggleFavorite}
                        onUpdateReviewStatus={updateReviewStatus}
                      />
                    </div>
                  )}
                </section>
              ) : (
                <EmptyStateCard message="현재 학습 범위에 질문 훈련 카드가 없습니다. 전체 학습으로 바꾸거나 다른 학습장을 골라 주세요." />
              )}
            </div>
          ) : (
            <>
              <InstructionComposer
                draft={expressionDraft}
                onUpdate={(patch) => setExpressionDraft((current) => ({ ...current, ...patch }))}
                onSave={saveExpressionDraft}
                onOpenRelatedTerm={(name) => openRelatedTerm(name, 'ai-command')}
                getTermLabel={(name) => findTermByName(name, 'ai-command')?.koreanName ?? name}
              />
              {savedExpressions.length > 0 && (
                <details className="deep-details saved-expressions">
                  <summary>저장한 내 표현 {savedExpressions.length}개</summary>
                  <div className="saved-expression-list">
                    {savedExpressions.map((expression) => (
                      <article className="saved-expression-card" key={expression.id}>
                        <div>
                          <span>원래 표현</span>
                          <p>{expression.original}</p>
                        </div>
                        <div>
                          <span>한국어 지시문</span>
                          <p className="saved-instruction">{expression.improvedKo}</p>
                        </div>
                        {expression.improvedEn && (
                          <details className="optional-expression">
                            <summary>저장한 영어 표현 보기</summary>
                            <p lang="en">{expression.improvedEn}</p>
                          </details>
                        )}
                        <button
                          type="button"
                          className="secondary-action"
                          onClick={() => deleteSavedExpression(expression.id)}
                        >
                          삭제
                        </button>
                      </article>
                    ))}
                  </div>
                </details>
              )}
            </>
          )}
        </ModePanel>
      )}

      {activeMode === 'search' && (
        <ModePanel title="용어 검색">
          <section className="search-panel" aria-label="용어 검색">
            <input
              id="term-search"
              className="search-input"
              type="search"
              aria-label="한국어 이름, 한글 발음, 원어 또는 뜻으로 검색"
              value={query}
              placeholder="예: 정본 기록, 리엔트리, schema"
              onChange={(event) => {
                setQuery(event.target.value)
                setVisibleSearchCount(30)
              }}
            />

            <details className="search-filters">
              <summary>{hasSearchFilters ? '필터 · 적용 중' : '필터'}</summary>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={searchAllDecks}
                  onChange={(event) => {
                    setSearchAllDecks(event.target.checked)
                    setSelectedCategory('All')
                    setVisibleSearchCount(30)
                  }}
                />
                모든 학습장 검색
              </label>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={searchFavoritesOnly}
                  onChange={(event) => {
                    setSearchFavoritesOnly(event.target.checked)
                    setSelectedCategory('All')
                    setVisibleSearchCount(30)
                  }}
                />
                중요 저장만 보기
              </label>
              <div className="filter-selects">
                <label>
                  분야
                  <select
                    value={availableCategories.includes(selectedCategory) ? selectedCategory : 'All'}
                    onChange={(event) => {
                      setSelectedCategory(event.target.value)
                      setVisibleSearchCount(30)
                    }}
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'All' ? '전체 분야' : getKoreanCategory(category)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  난이도
                  <select
                    value={difficultyFilter}
                    onChange={(event) => {
                      setDifficultyFilter(event.target.value as DifficultyFilter)
                      setSelectedCategory('All')
                      setVisibleSearchCount(30)
                    }}
                  >
                    {difficultyFilters.map((filter) => (
                      <option key={filter.id} value={filter.id}>{filter.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  우선순위
                  <select
                    value={priorityFilter}
                    onChange={(event) => {
                      setPriorityFilter(event.target.value as PriorityFilter)
                      setSelectedCategory('All')
                      setVisibleSearchCount(30)
                    }}
                  >
                    {priorityFilters.map((filter) => (
                      <option key={filter.id} value={filter.id}>{filter.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              {hasSearchFilters && (
                <button type="button" className="secondary-action" onClick={() => {
                  setSelectedCategory('All')
                  setDifficultyFilter('all')
                  setPriorityFilter('all')
                  setSearchAllDecks(false)
                  setSearchFavoritesOnly(false)
                  setVisibleSearchCount(30)
                }}>
                  필터 초기화
                </button>
              )}
            </details>
          </section>

          <div className="search-count">
            {searchAllDecks ? '모든 학습장' : activeDeckDefinition.label} · {searchTerms.length}개
          </div>
          <div className="compact-list">
            {visibleSearchTerms.map((term) => (
              <CompactTermCard
                key={term.id}
                term={term}
                isExpanded={expandedTermId === term.id}
                isFavorite={favoriteIds.has(term.id)}
                reviewStatus={reviewStatuses[term.id]}
                reviewSchedule={reviewSchedules[term.id]}
                memo={termMemos[term.id] ?? ''}
                onToggleExpanded={() =>
                  setExpandedTermId((current) => (current === term.id ? null : term.id))
                }
                onToggleFavorite={toggleFavorite}
                onUpdateReviewStatus={updateReviewStatus}
                onUpdateMemo={updateTermMemo}
                onOpenRelatedTerm={openRelatedTerm}
              />
            ))}
          </div>

          {visibleSearchTerms.length < searchTerms.length && (
            <button
              type="button"
              className="secondary-action load-more-button"
              onClick={() => setVisibleSearchCount((current) => current + 30)}
            >
              30개 더 보기 · 남은 {searchTerms.length - visibleSearchTerms.length}개
            </button>
          )}

          {searchTerms.length === 0 && (
            <p className="empty-state-card">조건에 맞는 용어가 없습니다. 검색어나 분야를 조정해 주세요.</p>
          )}
        </ModePanel>
      )}

      {activeMode === 'interpret' && (
        <ModePanel
          title="보고서 해석"
          subtitle="Codex 보고서나 개발 문장을 붙여 넣고, 앱 안의 용어와 표현을 로컬에서 찾아봅니다."
        >
          <section className="interpret-panel" aria-label="보고서 해석 입력">
            <label className="search-label" htmlFor="report-text">
              보고서 / 지시문 / 리뷰 문장 붙여넣기
            </label>
            <textarea
              id="report-text"
              className="report-input"
              value={reportText}
              rows={8}
              placeholder="예: 완료 기준과 변경분을 대조하고, 위험한 변경과 되돌리는 방법을 찾아줘."
              onChange={(event) => setReportText(event.target.value)}
            />
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={searchAllDecks}
                onChange={(event) => setSearchAllDecks(event.target.checked)}
              />
              모든 학습장에서 해석
            </label>
          </section>

          <div className="interpret-summary">
            <span>찾은 용어 {reportMatches.length}개</span>
            <span>{searchAllDecks ? '모든 학습장' : activeDeckDefinition.label}</span>
          </div>

          {reportText.trim() && reportMatches.length === 0 && (
            <p className="empty-state-card">
              일치하는 용어가 없습니다. 다른 문장을 붙여넣거나 모든 학습장에서 찾아보세요.
            </p>
          )}

          <div className="compact-list">
            {reportMatches.map(({ term, reason }) => (
              <CompactTermCard
                key={term.id}
                term={term}
                isExpanded={expandedTermId === term.id}
                isFavorite={favoriteIds.has(term.id)}
                reviewStatus={reviewStatuses[term.id]}
                reviewSchedule={reviewSchedules[term.id]}
                memo={termMemos[term.id] ?? ''}
                onToggleExpanded={() =>
                  setExpandedTermId((current) => (current === term.id ? null : term.id))
                }
                onToggleFavorite={toggleFavorite}
                onUpdateReviewStatus={updateReviewStatus}
                onUpdateMemo={updateTermMemo}
                onOpenRelatedTerm={openRelatedTerm}
                matchReason={reason}
              />
            ))}
          </div>
        </ModePanel>
      )}

      {isGuideOpen && <GuideDialog onClose={dismissGuide} />}
      {undoAction && (
        <div className="undo-toast" role="status" aria-live="polite">
          <span>{undoAction.message}</span>
          <button type="button" onClick={undoLastAction}>
            되돌리기
          </button>
        </div>
      )}
    </main>
  )
}

type ModePanelProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

function ModePanel({ title, subtitle, children }: ModePanelProps) {
  return (
    <section className="mode-panel">
      <div className="mode-heading">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function EmptyStateCard({ message }: { message: string }) {
  return (
    <div className="empty-state-card">
      <p>{message}</p>
    </div>
  )
}

type GuideDialogProps = {
  onClose: () => void
}

function GuideDialog({ onClose }: GuideDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="guide-dialog"
      aria-labelledby="guide-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
        <div className="guide-header">
          <h2 id="guide-title">콕핏 사용법</h2>
          <button type="button" className="close-button" aria-label="사용법 닫기" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="guide-list">
          {guideItems.map((item, index) => (
            <article key={item.title} className="guide-item">
              <span>{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>

        <button type="button" className="primary-action guide-action" onClick={onClose}>
          시작하기
        </button>
    </dialog>
  )
}

type TermActionProps = {
  term: DevTerm
  isFavorite: boolean
  reviewStatus?: ReviewStatus
  reviewSchedule?: ReviewSchedule
  memo: string
  onToggleFavorite: (termId: string) => void
  onUpdateReviewStatus: (termId: string, status: ReviewStatus) => void
  onUpdateMemo: (termId: string, memo: string) => void
  onOpenRelatedTerm: (relatedTerm: string, sourceDeck: DeckId) => void
}

type StudyCardProps = TermActionProps & {
  recallMode: RecallMode
  startRevealed?: boolean
  navigation?: React.ReactNode
}

function TermHeading({
  term,
  pronunciationFirst = false,
}: {
  term: DevTerm
  pronunciationFirst?: boolean
}) {
  const heading = pronunciationFirst ? term.pronunciation : term.koreanName
  const hasOriginal = term.term !== heading
  const pronunciationIsHeading = heading === term.pronunciation && hasOriginal

  return (
    <div className="term-title">
      {pronunciationIsHeading && <span className="pronunciation-label">한글 발음</span>}
      <h3>{heading}</h3>
      {heading !== term.pronunciation && term.pronunciation !== term.term && (
        <p className="term-pronunciation">
          <span className="pronunciation-label">한글 발음</span> {term.pronunciation}
        </p>
      )}
      {hasOriginal && (
        <p className="term-original">
          원어 <span lang={/[가-힣]/u.test(term.term) ? undefined : 'en'}>{term.term}</span>
        </p>
      )}
    </div>
  )
}

function StudyCard({
  term,
  recallMode,
  startRevealed = false,
  navigation,
  isFavorite,
  reviewStatus,
  reviewSchedule,
  memo,
  onToggleFavorite,
  onUpdateReviewStatus,
  onUpdateMemo,
  onOpenRelatedTerm,
}: StudyCardProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(startRevealed)

  return (
    <article className={`study-card deck-${term.deck}`}>
      <div className="study-context">
        <span>{getKoreanCategory(term.category)}</span>
        {isAnswerVisible && (
          <button type="button" onClick={() => setIsAnswerVisible(false)}>
            {startRevealed ? '퀴즈로 보기' : '다시 가리기'}
          </button>
        )}
      </div>

      {!isAnswerVisible ? (
        <RecallFront term={term} recallMode={recallMode} onReveal={() => setIsAnswerVisible(true)} />
      ) : (
        <>
          <TermHeading term={term} />

          <p className="korean-meaning">{term.koreanMeaning}</p>
          <p className="simple-meaning">{term.simpleMeaning}</p>

          <TermActions
            term={term}
            isFavorite={isFavorite}
            reviewStatus={reviewStatus}
            reviewSchedule={reviewSchedule}
            onToggleFavorite={onToggleFavorite}
            onUpdateReviewStatus={onUpdateReviewStatus}
          />
        </>
      )}
      {navigation}
      {isAnswerVisible && (
        <TermDetails
          term={term}
          memo={memo}
          onUpdateMemo={onUpdateMemo}
          onOpenRelatedTerm={onOpenRelatedTerm}
        />
      )}
    </article>
  )
}

function CardNavigation({
  progress,
  onPrevious,
  onNext,
}: {
  progress: string
  onPrevious?: () => void
  onNext?: () => void
}) {
  return (
    <div className="card-navigation" aria-label="카드 이동">
      <button type="button" className="secondary-action" disabled={!onPrevious} onClick={onPrevious}>
        이전 카드
      </button>
      <p>{progress}</p>
      <button type="button" className="secondary-action" disabled={!onNext} onClick={onNext}>
        다음 카드
      </button>
    </div>
  )
}

function RecallFront({
  term,
  recallMode,
  onReveal,
}: {
  term: DevTerm
  recallMode: RecallMode
  onReveal: () => void
}) {
  const isKoreanToEnglish = recallMode === 'korean-english'
  const isMechanismRecall = recallMode === 'mechanism'

  return (
    <section className={`recall-front recall-${recallMode}`} aria-live="polite">
      {isKoreanToEnglish ? (
        <>
          <h3>이 뜻에 해당하는 원어와 발음은?</h3>
          <p className="recall-korean-clue">{term.koreanMeaning}</p>
        </>
      ) : (
        <TermHeading term={term} pronunciationFirst={!isMechanismRecall} />
      )}

      {isMechanismRecall && <p className="recall-korean-clue">{term.koreanMeaning}</p>}
      <p className="recall-question">
        {isKoreanToEnglish
          ? '원어와 발음을 소리 내어 말해보세요.'
          : isMechanismRecall
            ? '필요한 이유와 작동 방식을 떠올려보세요.'
            : '어떤 뜻인지 떠올려보세요.'}
      </p>
      <button type="button" className="primary-action recall-reveal" onClick={onReveal}>
        {recallMode === 'english-korean' ? '뜻 보기' : '정답 보기'}
      </button>
    </section>
  )
}

function InstructionChecklist({
  items,
  score,
}: {
  items: InstructionChecklistResult[]
  score: number
}) {
  return (
    <section className="instruction-checklist" aria-label="지시문 5요소 점검">
      <div className="instruction-checklist-heading">
        <div>
          <span>지시문 5요소</span>
          <strong>{score} / 5</strong>
        </div>
        <p>문장 안에서 판단 가능한 단서를 확인합니다.</p>
      </div>
      <div className="instruction-checklist-grid">
        {items.map((item) => (
          <div className={item.passed ? 'passed' : 'missing'} key={item.id}>
            <span>{item.passed ? '포함' : '보완'}</span>
            <div>
              <strong>{item.label}</strong>
              <p>{item.passed ? '관련 단서가 있습니다.' : item.hint}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="instruction-checklist-note">
        로컬 키워드 점검이므로 의미의 정확성은 모범 표현과 직접 비교하세요.
      </p>
    </section>
  )
}

type CompactTermCardProps = TermActionProps & {
  isExpanded: boolean
  onToggleExpanded: () => void
  matchReason?: string
}

function CompactTermCard({
  term,
  isExpanded,
  isFavorite,
  reviewStatus,
  reviewSchedule,
  memo,
  onToggleExpanded,
  onToggleFavorite,
  onUpdateReviewStatus,
  onUpdateMemo,
  onOpenRelatedTerm,
  matchReason,
}: CompactTermCardProps) {
  return (
    <article className={`compact-card ${isExpanded ? 'expanded' : ''} deck-${term.deck}`}>
      <div className="compact-main">
        <div>
          <p className="term-list-context">{term.domainLabel} · {getKoreanCategory(term.category)}</p>
          <TermHeading term={term} />
          <p className="compact-meaning">{term.koreanMeaning}</p>
          {matchReason && <p className="match-reason">{matchReason}</p>}
        </div>
        <StatusBadges isFavorite={isFavorite} reviewStatus={reviewStatus} />
      </div>

      <button type="button" className="detail-toggle" aria-expanded={isExpanded} onClick={onToggleExpanded}>
        {isExpanded ? '접기' : '자세히 보기'}
      </button>

      {isExpanded && (
        <div className="compact-details">
          <p className="simple-meaning">{term.simpleMeaning}</p>
          <TermActions
            term={term}
            isFavorite={isFavorite}
            reviewStatus={reviewStatus}
            reviewSchedule={reviewSchedule}
            onToggleFavorite={onToggleFavorite}
            onUpdateReviewStatus={onUpdateReviewStatus}
          />
          <TermDetails
            term={term}
            memo={memo}
            onUpdateMemo={onUpdateMemo}
            onOpenRelatedTerm={onOpenRelatedTerm}
          />
        </div>
      )}
    </article>
  )
}

function TermDetails({
  term,
  memo,
  onUpdateMemo,
  onOpenRelatedTerm,
}: Pick<TermActionProps, 'term' | 'memo' | 'onUpdateMemo' | 'onOpenRelatedTerm'>) {
  const usage = getUsageText(term)

  return (
    <>
      <details className="deep-details">
        <summary>작동 원리와 활용</summary>
        <div className="badge-group term-details-meta">
          <span className="category-badge">{getDifficultyLabel(term.difficulty)}</span>
          <span className={`priority-badge priority-${term.learningPriority}`}>
            {getPriorityLabel(term.learningPriority)}
          </span>
          <ArchitectureStatusBadge term={term} />
        </div>
        <ArchitectureStatusBlock term={term} />
        {usage && usage !== term.simpleMeaning && (
          <DetailBlock label={getUsageLabel(term)} tone="usage">
            {usage}
          </DetailBlock>
        )}
        <ConceptMapBlock term={term} />
        <DeepDiveBlock term={term} onOpenRelatedTerm={onOpenRelatedTerm} />
        <CautionBlock term={term} />
        <DetailBlock label="확인 질문" tone="question">
          {term.checkQuestion}
        </DetailBlock>
        <ExpressionBlock term={term} />
        <PromptBlock term={term} />
        <p className="selection-reason">{term.selectionReason}</p>
      </details>
      <details className="deep-details">
        <summary>{memo.trim() ? '내 메모 · 저장됨' : '내 메모'}</summary>
        <MemoBlock term={term} memo={memo} onUpdateMemo={onUpdateMemo} />
      </details>
    </>
  )
}

type StatusBadgesProps = {
  isFavorite: boolean
  reviewStatus?: ReviewStatus
}

function StatusBadges({ isFavorite, reviewStatus }: StatusBadgesProps) {
  if (!isFavorite && !reviewStatus) {
    return null
  }

  return (
    <div className="status-badges" aria-label="용어 상태">
      {isFavorite && <span className="status-badge favorite">중요 저장됨</span>}
      {reviewStatus === 'known' && <span className="status-badge known">알고 있음</span>}
      {reviewStatus === 'review_again' && <span className="status-badge review">다시 보기</span>}
    </div>
  )
}

function ArchitectureStatusBadge({ term }: { term: DevTerm }) {
  if (!term.architectureStatus) {
    return null
  }

  return (
    <span className={`architecture-status-badge architecture-${term.architectureStatus}`}>
      {getArchitectureStatusLabel(term.architectureStatus)}
    </span>
  )
}

function ArchitectureStatusBlock({ term }: { term: DevTerm }) {
  if (!term.architectureStatus || !term.statusNote) {
    return null
  }

  return (
    <DetailBlock
      label={`구조 상태 · ${getArchitectureStatusLabel(term.architectureStatus)}`}
      tone="status"
    >
      {term.statusNote}
    </DetailBlock>
  )
}

type DetailBlockProps = {
  label: string
  tone: 'usage' | 'question' | 'expression' | 'caution' | 'mechanism' | 'mental' | 'status'
  children: string
}

function DetailBlock({ label, tone, children }: DetailBlockProps) {
  return (
    <div className={`detail-block ${tone}`}>
      <span>{label}</span>
      <p>{children}</p>
    </div>
  )
}

function ConceptMapBlock({ term }: { term: DevTerm }) {
  if (!term.mentalModel && !term.whyItMatters && !term.withoutIt && !term.realWorkflow) {
    return null
  }

  return (
    <section className="concept-map-block" aria-label={`${term.koreanName} 개념 지도`}>
      {term.mentalModel && (
        <DetailBlock label="머릿속 그림" tone="mental">
          {term.mentalModel}
        </DetailBlock>
      )}
      {term.whyItMatters && (
        <DetailBlock label="왜 필요한가" tone="mental">
          {term.whyItMatters}
        </DetailBlock>
      )}
      {term.withoutIt && (
        <DetailBlock label="없으면 생기는 문제" tone="mental">
          {term.withoutIt}
        </DetailBlock>
      )}
      {term.realWorkflow && (
        <DetailBlock label="현장 흐름" tone="mental">
          {term.realWorkflow}
        </DetailBlock>
      )}
    </section>
  )
}

function DeepDiveBlock({
  term,
  onOpenRelatedTerm,
}: {
  term: DevTerm
  onOpenRelatedTerm: (relatedTerm: string, sourceDeck: DeckId) => void
}) {
  return (
    <section className="deep-dive-block" aria-label={`${term.koreanName} 심화 설명`}>
      {term.mechanism && (
        <DetailBlock label="작동 원리" tone="mechanism">
          {term.mechanism}
        </DetailBlock>
      )}
      {term.usagePattern && (
        <DetailBlock label="실전 활용" tone="mechanism">
          {term.usagePattern}
        </DetailBlock>
      )}
      {term.commonPitfall && (
        <DetailBlock label="자주 하는 오해" tone="mechanism">
          {term.commonPitfall}
        </DetailBlock>
      )}
      {term.expertNote && (
        <DetailBlock label="전문가 메모" tone="mechanism">
          {term.expertNote}
        </DetailBlock>
      )}
      {term.researchBasis && (
        <DetailBlock label="검증 근거" tone="mechanism">
          {term.researchBasis}
        </DetailBlock>
      )}
      {term.relatedTerms && term.relatedTerms.length > 0 && (
        <div className="related-terms" aria-label={`${term.koreanName} 관련 용어`}>
          <span>같이 볼 용어</span>
          <div>
            {term.relatedTerms.map((relatedTerm) => (
              <button
                type="button"
                key={relatedTerm}
                onClick={() => onOpenRelatedTerm(relatedTerm, term.deck)}
              >
                {findTermByName(relatedTerm, term.deck)?.koreanName ?? relatedTerm}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ExpressionBlock({ term }: { term: DevTerm }) {
  if (!term.badExpression && !term.goodExpression) {
    return null
  }

  return (
    <div className="expression-grid">
      {term.badExpression && (
        <DetailBlock label="나쁜 표현" tone="expression">
          {term.badExpression}
        </DetailBlock>
      )}
      {term.goodExpression && (
        <DetailBlock label="좋은 표현" tone="expression">
          {term.goodExpression}
        </DetailBlock>
      )}
    </div>
  )
}

function PromptBlock({ term }: { term: DevTerm }) {
  const example = [term.codexPromptExample, term.gptPromptExample, term.goodExpression].find(
    (value): value is string => value !== undefined && /[가-힣]/u.test(value),
  )
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  if (!example) return null
  const text = koreanizeTermProse(example.split('\nEN:', 1)[0])
  const copyPrompt = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    } finally {
      window.setTimeout(() => setCopyState('idle'), 1500)
    }
  }

  return (
    <div className="prompt-block">
      <div className="prompt-header">
        <span>지시문 예시</span>
        <button type="button" onClick={copyPrompt}>
          {copyState === 'copied'
            ? '복사됨'
            : copyState === 'failed'
              ? '복사 실패'
              : '프롬프트 복사'}
        </button>
      </div>
      <p>{text}</p>
    </div>
  )
}

function CautionBlock({ term }: { term: DevTerm }) {
  if (!term.evidenceCaution && !term.privacyWarning) {
    return null
  }

  return (
    <div className="caution-stack">
      {term.evidenceCaution && (
        <DetailBlock label="증거 주의" tone="caution">
          {term.evidenceCaution}
        </DetailBlock>
      )}
      {term.privacyWarning && (
        <DetailBlock label="개인정보 주의" tone="caution">
          {term.privacyWarning}
        </DetailBlock>
      )}
    </div>
  )
}

function MemoBlock({
  term,
  memo,
  onUpdateMemo,
}: {
  term: DevTerm
  memo: string
  onUpdateMemo: (termId: string, memo: string) => void
}) {
  return (
    <div className="memo-block">
      <label htmlFor={`memo-${term.id}`}>내 메모</label>
      <textarea
        id={`memo-${term.id}`}
        value={memo}
        rows={3}
        placeholder="헷갈린 이유, 내 표현, 실제로 써먹을 문장을 적어두세요."
        onChange={(event) => onUpdateMemo(term.id, event.target.value)}
      />
    </div>
  )
}

function TermActions({
  term,
  isFavorite,
  reviewStatus,
  reviewSchedule,
  onToggleFavorite,
  onUpdateReviewStatus,
}: Pick<
  TermActionProps,
  'term' | 'isFavorite' | 'reviewStatus' | 'reviewSchedule' | 'onToggleFavorite' | 'onUpdateReviewStatus'
>) {
  return (
    <div className="study-actions">
      <div className="term-actions" aria-label={`${term.koreanName} 학습 동작`}>
        <button
          type="button"
          className={reviewStatus === 'known' ? 'active known' : ''}
          aria-pressed={reviewStatus === 'known'}
          onClick={() => onUpdateReviewStatus(term.id, 'known')}
        >
          알고 있음
        </button>
        <button
          type="button"
          className={reviewStatus === 'review_again' ? 'active review' : ''}
          aria-pressed={reviewStatus === 'review_again'}
          onClick={() => onUpdateReviewStatus(term.id, 'review_again')}
        >
          다시 보기
        </button>
        <button
          type="button"
          className={isFavorite ? 'active favorite' : ''}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(term.id)}
        >
          중요 저장
        </button>
      </div>
      {reviewSchedule && (
        <p className="review-schedule-note">
          다음 복습 {formatReviewDate(reviewSchedule.nextReviewDate)}
        </p>
      )}
    </div>
  )
}

function analyzeInstructionDraft(value: string): InstructionChecklistResult[] {
  const meaningfulText = value
    .split(/\r?\n/)
    .filter(
      (line) =>
        !/^(목표|입력 자료|허용\/금지 경계|출력 형식|검증 기준|goal|input material|scope|output format|validation criteria)\s*:\s*$/i.test(
          line.trim(),
        ),
    )
    .join(' ')

  return instructionElementDefinitions.map((item) => ({
    id: item.id,
    label: item.label,
    passed: item.pattern.test(meaningfulText),
    hint: item.hint,
  }))
}

function appendMissingInstructionFields(value: string) {
  const current = value.trimEnd()
  if (!current.trim()) {
    return instructionTemplate
  }

  const currentLines = current.split(/\r?\n/).map((line) => line.trim())
  const missingLines = analyzeInstructionDraft(current)
    .filter(
      (item) =>
        !item.passed &&
        !currentLines.some((line) => line.startsWith(instructionTemplateFields[item.id])),
    )
    .map((item) => `${instructionTemplateFields[item.id]}:`)

  return missingLines.length > 0 ? `${current}\n\n${missingLines.join('\n')}` : current
}

function getUsageLabel(term: DevTerm) {
  if (term.deck === 'dispute-integration') {
    return '분쟁통합 사용 예'
  }
  if (term.deck === 'investment-analysis') {
    return '투자 구조에서 쓰는 법'
  }
  if (term.deck === 'roblox') {
    return '로블록스에서 쓰는 법'
  }
  if (term.deck === 'foundry-lab') {
    return '파운드리에서 쓰는 법'
  }
  return '학습 사용 예'
}

function getTrainingTitle(deck: DeckId) {
  if (deck === 'ai-command') {
    return 'AI 지휘 훈련'
  }
  if (deck === 'dispute-integration') {
    return '표현 판정 훈련'
  }
  if (deck === 'investment-analysis') {
    return '투자 구조 질문 훈련'
  }
  if (deck === 'roblox') {
    return '로블록스 구조 질문 훈련'
  }
  if (deck === 'foundry-lab') {
    return '파운드리 구조 질문 훈련'
  }
  if (deck === 'development') {
    return '개발 구조 질문 훈련'
  }
  if (deck === 'libraries-tools') {
    return '도구 활용 질문 훈련'
  }
  return '주비스 구조 질문 훈련'
}

function getTrainingSubtitle(deck: DeckId) {
  if (deck === 'ai-command') {
    return '모호한 표현을 한국어 지시문으로 바꾸고, 목표·경계·출력·검증 조건을 채워 봅니다.'
  }
  if (deck === 'dispute-integration') {
    return '자료, 주장, 원본대조, 인용 가능 범위와 민감정보 조건을 분리해 안전한 검토 질문으로 바꿉니다.'
  }
  if (deck === 'investment-analysis') {
    return '용어를 데이터 입력, 변환, 상태, 검증, 실행 경계로 나눠 시스템 안의 위치를 묻는 질문으로 바꿉니다.'
  }
  if (deck === 'roblox') {
    return '클라이언트·서버, 복제, 저장 기간, 실패 처리, 관측 지표를 묻는 질문을 만들어 봅니다.'
  }
  if (deck === 'foundry-lab') {
    return '맥락, 모델, 실행 환경, 도구, 상태, 평가와 복구를 누가 맡는지 묻는 질문을 만들어 봅니다.'
  }
  if (deck === 'development') {
    return '입력, 처리, 상태, 출력, 오류 경계로 나눠 코드와 시스템의 작동 원리를 묻는 질문으로 바꿉니다.'
  }
  if (deck === 'libraries-tools') {
    return '도구의 책임, 입력·출력, 실행 시점, 대체 수단과 실패 조건을 구분해 실제 활용 질문으로 바꿉니다.'
  }
  return '담당 주체, 상태, 경계, 상태 변화와 검증 책임을 묻는 질문을 만들어 봅니다.'
}

function getUsageText(term: DevTerm) {
  return term.deck === 'dispute-integration'
    ? term.disputeUsage ?? term.joovisUsage ?? ''
    : term.joovisUsage ?? term.disputeUsage ?? ''
}

function getDifficultyLabel(difficulty: DevTerm['difficulty']) {
  if (difficulty === 'basic') {
    return '기초'
  }
  if (difficulty === 'intermediate') {
    return '중급'
  }
  return '고급'
}

function getArchitectureStatusLabel(status: ArchitectureStatus) {
  if (status === 'current') {
    return '현재 확인'
  }
  if (status === 'target') {
    return '목표 구조'
  }
  return '개념 모델'
}

function getPriorityLabel(priority: DevTerm['learningPriority']) {
  if (priority === 'core') {
    return '핵심'
  }
  if (priority === 'working') {
    return '실무 확장'
  }
  return '전문 참고'
}

function isReviewDue(
  schedule: ReviewSchedule | undefined,
  todayDateKey: string,
  reviewStatus?: ReviewStatus,
) {
  if (reviewStatus === 'review_again') {
    return true
  }
  if (!schedule) {
    return false
  }
  return dateKeyToNumber(schedule.nextReviewDate) <= dateKeyToNumber(todayDateKey)
}

function buildNextReviewSchedule(
  current: ReviewSchedule | undefined,
  status: ReviewStatus,
  todayDateKey: string,
): ReviewSchedule {
  if (status === 'review_again') {
    return {
      nextReviewDate: todayDateKey,
      intervalDays: 1,
      repetitions: 0,
      lastReviewedDate: todayDateKey,
    }
  }

  const nextRepetitions = (current?.repetitions ?? 0) + 1
  const nextInterval = [1, 3, 7, 14, 30, 60][Math.min(nextRepetitions - 1, 5)]
  return {
    nextReviewDate: addDaysToDateKey(todayDateKey, nextInterval),
    intervalDays: nextInterval,
    repetitions: nextRepetitions,
    lastReviewedDate: todayDateKey,
  }
}

function formatReviewDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-')
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return getDateKey(date)
}

function dateKeyToNumber(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return year * 10000 + month * 100 + day
}

function findTermByName(termName: string, preferredDeck: DeckId) {
  const target = normalizeTermKey(termName)
  return (
    devTerms.find((term) => term.deck === preferredDeck && normalizeTermKey(term.term) === target) ??
    devTerms.find((term) => normalizeTermKey(term.term) === target) ??
    devTerms.find((term) => term.deck === preferredDeck && getTermNameKeys(term).includes(target)) ??
    devTerms.find((term) => getTermNameKeys(term).includes(target)) ??
    devTerms.find((term) => term.deck === preferredDeck && normalizeTermKey(term.koreanMeaning) === target) ??
    devTerms.find((term) => normalizeTermKey(term.koreanMeaning) === target)
  )
}

function findReportMatches(reportText: string, terms: DevTerm[]) {
  const normalizedReport = normalizeTermKey(reportText)
  if (!normalizedReport) {
    return []
  }

  return terms
    .map((term) => {
      const candidates = [
        ['원어', term.term],
        ['한국어 이름', term.koreanName],
        ['한국어 의미', term.koreanMeaning],
        ['한글 발음', term.pronunciation],
        ['좋은 표현', term.goodExpression],
        ['프롬프트', term.gptPromptExample],
        ['Codex 예시', term.codexPromptExample],
        ['검증 근거', term.researchBasis],
        ['관련 용어', term.relatedTerms?.join(' ')],
      ] as Array<[string, string | undefined]>
      const match = candidates.find(([, value]) => {
        const normalizedValue = normalizeTermKey(value ?? '')
        return normalizedValue.length >= 3 && normalizedReport.includes(normalizedValue)
      })

      return match
        ? {
            term,
            reason: `${match[0]} 일치`,
            weight: normalizeTermKey(match[1] ?? '').length + getDifficultyWeight(term.difficulty),
          }
        : null
    })
    .filter((match): match is { term: DevTerm; reason: string; weight: number } => Boolean(match))
    .sort((first, second) => second.weight - first.weight)
    .slice(0, 50)
}

function getDifficultyWeight(difficulty: DevTerm['difficulty']) {
  if (difficulty === 'advanced') {
    return 8
  }
  if (difficulty === 'intermediate') {
    return 4
  }
  return 1
}

function normalizeTermKey(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]+/gu, '')
}

function getTermNameKeys(term: DevTerm) {
  return [term.term, term.koreanName, term.pronunciation].map(normalizeTermKey)
}

function pickRandomTerm(terms: DevTerm[], currentId: string | null, seed?: string) {
  if (terms.length < 2) {
    return terms[0]
  }

  if (seed) {
    return terms[hashString(seed) % terms.length]
  }

  let nextTerm = terms[Math.floor(Math.random() * terms.length)]
  while (nextTerm.id === currentId) {
    nextTerm = terms[Math.floor(Math.random() * terms.length)]
  }
  return nextTerm
}

function getUnseenTerms(terms: DevTerm[], seenTermIds: string[]) {
  const seen = new Set(seenTermIds)
  return terms.filter((term) => !seen.has(term.id))
}

function getRandomPracticeKey(dateKey: string, deckId: DeckId, scope: LearningScope) {
  return `${dateKey}:${deckId}:${scope}`
}

function getTrainingPracticeKey(dateKey: string, deckId: DeckId, scope: LearningScope) {
  return `${dateKey}:${deckId}:${scope}`
}

function getRoutineKey(dateKey: string, deckId: DeckId) {
  return `${dateKey}:${deckId}`
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function normalizeText(value: string) {
  return value.normalize('NFKC').trim().toLocaleLowerCase('ko-KR')
}

function hashString(value: string) {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

export default App
