import { useMemo, useState } from 'react'
import { datasetStats, devTerms } from './devTerms'
import {
  deckDefinitions,
  type DeckId,
  type DevTerm,
  type ReviewSchedule,
  type ReviewStatus,
} from './types'
import {
  loadFavoriteIds,
  loadOnboardingDismissed,
  loadRandomPracticeCount,
  loadRandomPracticeHistory,
  loadReviewSchedules,
  loadReviewStatuses,
  loadTermMemos,
  saveFavoriteIds,
  saveOnboardingDismissed,
  saveRandomPracticeCount,
  saveRandomPracticeHistory,
  saveReviewSchedules,
  saveReviewStatuses,
  saveTermMemos,
} from './storage'

type Mode = 'today' | 'random' | 'review' | 'search' | 'interpret'
type ViewState = { deck: DeckId; mode: Mode }

const modes: Array<{ id: Mode; label: string; description: string }> = [
  { id: 'today', label: '오늘', description: '하루 1개' },
  { id: 'random', label: '랜덤', description: '새 카드' },
  { id: 'review', label: '다시 보기', description: '모르는 것' },
  { id: 'search', label: '전체 검색', description: '찾아보기' },
  { id: 'interpret', label: '보고서', description: '용어 해석' },
]

const guideItems = [
  { title: '오늘', body: '하루 1개 용어를 봅니다.' },
  { title: '랜덤', body: '버튼을 눌러 새 용어를 연습합니다.' },
  { title: '다시 보기', body: '모르는 용어만 다시 봅니다.' },
  { title: '전체 검색', body: 'Codex 보고서에서 모르는 단어를 찾습니다.' },
  { title: '보고서', body: '긴 문장을 붙여 넣고 앱의 용어와 표현을 찾아봅니다.' },
]

function App() {
  const [activeDeck, setActiveDeck] = useState<DeckId>('ai-command')
  const [activeMode, setActiveMode] = useState<Mode>('today')
  const [viewHistory, setViewHistory] = useState<ViewState[]>([])
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchAllDecks, setSearchAllDecks] = useState(false)
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
  const todayDateKey = useMemo(() => getDateKey(new Date()), [])
  const [randomTermIds, setRandomTermIds] = useState<Partial<Record<DeckId, string>>>({})
  const [randomPracticeCounts, setRandomPracticeCounts] = useState<Record<DeckId, number>>(() =>
    Object.fromEntries(
      deckDefinitions.map((deck) => [
        deck.id,
        loadRandomPracticeCount(getRandomPracticeKey(todayDateKey, deck.id)),
      ]),
    ) as Record<DeckId, number>,
  )
  const [randomPracticeHistories, setRandomPracticeHistories] = useState<Record<DeckId, string[]>>(
    () =>
      Object.fromEntries(
        deckDefinitions.map((deck) => [
          deck.id,
          loadRandomPracticeHistory(getRandomPracticeKey(todayDateKey, deck.id)),
        ]),
      ) as Record<DeckId, string[]>,
  )

  const activeDeckDefinition = deckDefinitions.find((deck) => deck.id === activeDeck)!
  const activeDeckTerms = useMemo(
    () => devTerms.filter((term) => term.deck === activeDeck),
    [activeDeck],
  )
  const selectedDeckTotal = datasetStats.deckCounts[activeDeck]
  const todayTerm = useMemo(
    () => activeDeckTerms[hashString(`${activeDeck}:${todayDateKey}`) % activeDeckTerms.length],
    [activeDeck, activeDeckTerms, todayDateKey],
  )
  const randomTerm = useMemo(() => {
    const selectedId = randomTermIds[activeDeck]
    const unseenTerms = getUnseenTerms(activeDeckTerms, randomPracticeHistories[activeDeck] ?? [])
    return (
      activeDeckTerms.find((term) => term.id === selectedId) ??
      pickRandomTerm(unseenTerms.length > 0 ? unseenTerms : activeDeckTerms, null, `random-${activeDeck}-${todayDateKey}`)
    )
  }, [activeDeck, activeDeckTerms, randomPracticeHistories, randomTermIds, todayDateKey])
  const randomSeenCount = Math.min(
    randomPracticeHistories[activeDeck]?.length ?? 0,
    activeDeckTerms.length,
  )
  const randomRemainingCount = Math.max(activeDeckTerms.length - randomSeenCount, 0)

  const deckFavoriteCount = activeDeckTerms.filter((term) => favoriteIds.has(term.id)).length
  const deckKnownCount = activeDeckTerms.filter(
    (term) => reviewStatuses[term.id] === 'known',
  ).length
  const deckReviewAgainCount = activeDeckTerms.filter(
    (term) => reviewStatuses[term.id] === 'review_again',
  ).length
  const deckDueReviewCount = activeDeckTerms.filter((term) =>
    isReviewDue(reviewSchedules[term.id], todayDateKey, reviewStatuses[term.id]),
  ).length
  const deckMemoCount = activeDeckTerms.filter((term) => termMemos[term.id]?.trim()).length

  const reviewTerms = useMemo(
    () =>
      activeDeckTerms.filter((term) =>
        isReviewDue(reviewSchedules[term.id], todayDateKey, reviewStatuses[term.id]),
      ),
    [activeDeckTerms, reviewSchedules, reviewStatuses, todayDateKey],
  )

  const searchSourceTerms = searchAllDecks ? devTerms : activeDeckTerms
  const availableCategories = useMemo(
    () => ['All', ...Array.from(new Set(searchSourceTerms.map((term) => term.category))).sort()],
    [searchSourceTerms],
  )
  const searchTerms = useMemo(() => {
    const normalizedQuery = normalizeText(query)
    const category = availableCategories.includes(selectedCategory) ? selectedCategory : 'All'

    return searchSourceTerms.filter((term) => {
      const matchesCategory = category === 'All' || term.category === category
      const searchableText = normalizeText(
        [
          term.term,
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
          term.relatedTerms?.join(' '),
          termMemos[term.id],
          term.domainLabel,
        ]
          .filter(Boolean)
          .join(' '),
      )

      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [availableCategories, query, searchSourceTerms, selectedCategory, termMemos])
  const reportMatches = useMemo(
    () => findReportMatches(reportText, searchAllDecks ? devTerms : activeDeckTerms),
    [activeDeckTerms, reportText, searchAllDecks],
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
    setSelectedCategory('All')
    setExpandedTermId(null)
    setQuery('')
  }

  const selectMode = (modeId: Mode) => {
    if (modeId !== activeMode) {
      rememberCurrentView()
      setActiveMode(modeId)
      setExpandedTermId(null)
    }
  }

  const goBack = () => {
    const previousView = viewHistory[viewHistory.length - 1]
    if (!previousView) {
      return
    }
    setViewHistory((current) => current.slice(0, -1))
    setActiveDeck(previousView.deck)
    setActiveMode(previousView.mode)
    setSelectedCategory('All')
    setExpandedTermId(null)
    setQuery('')
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
    setSelectedCategory('All')
    setQuery(matchedTerm.term)
    setExpandedTermId(matchedTerm.id)
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

  const showNextRandomTerm = () => {
    const practiceKey = getRandomPracticeKey(todayDateKey, activeDeck)
    const currentHistory = randomPracticeHistories[activeDeck] ?? []
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
    setRandomTermIds((current) => ({ ...current, [activeDeck]: nextTerm.id }))
    setRandomPracticeHistories((current) => {
      saveRandomPracticeHistory(practiceKey, nextHistory)
      return { ...current, [activeDeck]: nextHistory }
    })
    setRandomPracticeCounts((current) => {
      const nextCount = current[activeDeck] + 1
      saveRandomPracticeCount(practiceKey, nextCount)
      return { ...current, [activeDeck]: nextCount }
    })
  }

  const dismissGuide = () => {
    saveOnboardingDismissed(true)
    setIsGuideOpen(false)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Multi-deck PWA · LocalStorage only</p>
          <h1>JOOVIS Terms Cockpit</h1>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="back-button"
            onClick={goBack}
            disabled={viewHistory.length === 0}
          >
            뒤로
          </button>
          <button type="button" className="help-button" onClick={() => setIsGuideOpen(true)}>
            사용법
          </button>
        </div>
      </header>

      <nav className="deck-nav" aria-label="학습 Deck 선택">
        {deckDefinitions.map((deck) => (
          <button
            key={deck.id}
            type="button"
            className={`deck-button ${activeDeck === deck.id ? 'active' : ''}`}
            aria-pressed={activeDeck === deck.id}
            onClick={() => selectDeck(deck.id)}
          >
            {deck.label}
          </button>
        ))}
      </nav>

      <section className={`deck-intro deck-${activeDeck}`}>
        <div>
          <p className="eyebrow">{activeDeckDefinition.label}</p>
          <h2>{activeDeckDefinition.title}</h2>
          <p>{activeDeckDefinition.helperText}</p>
        </div>
      </section>

      <nav className="mode-nav" aria-label="학습 모드">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`mode-button ${activeMode === mode.id ? 'active' : ''}`}
            aria-pressed={activeMode === mode.id}
            onClick={() => selectMode(mode.id)}
          >
            <span>{mode.label}</span>
            <small>{mode.description}</small>
          </button>
        ))}
      </nav>

      <section className="stats-row" aria-label="선택 Deck 학습 현황">
        <span>전체 {selectedDeckTotal}</span>
        <span>중요 {deckFavoriteCount}</span>
        <span>알고 있음 {deckKnownCount}</span>
        <span>다시 보기 {deckReviewAgainCount}</span>
        <span>오늘 복습 {deckDueReviewCount}</span>
        <span>메모 {deckMemoCount}</span>
      </section>

      {activeMode === 'today' && (
        <ModePanel title="오늘의 용어" subtitle="선택한 Deck 안에서 날짜 기준으로 하루 1개 고정됩니다.">
          <StudyCard
            term={todayTerm}
            isFavorite={favoriteIds.has(todayTerm.id)}
            reviewStatus={reviewStatuses[todayTerm.id]}
            reviewSchedule={reviewSchedules[todayTerm.id]}
            memo={termMemos[todayTerm.id] ?? ''}
            onToggleFavorite={toggleFavorite}
            onUpdateReviewStatus={updateReviewStatus}
            onUpdateMemo={updateTermMemo}
            onOpenRelatedTerm={openRelatedTerm}
          />
        </ModePanel>
      )}

      {activeMode === 'random' && (
        <ModePanel title="랜덤 연습" subtitle="버튼을 누르면 이 Deck 안에서 새 용어로 바뀝니다.">
          <div className="random-controls">
            <span>
              오늘 랜덤 연습: {randomPracticeCounts[activeDeck]}개 · 남은 새 카드:{' '}
              {randomRemainingCount}개
            </span>
            <button type="button" className="primary-action" onClick={showNextRandomTerm}>
              다음 랜덤 용어
            </button>
          </div>
          <p className="random-cycle-note">
            이 Deck의 카드를 한 바퀴 보기 전까지 같은 용어는 다시 나오지 않습니다.
          </p>
          <StudyCard
            term={randomTerm}
            isFavorite={favoriteIds.has(randomTerm.id)}
            reviewStatus={reviewStatuses[randomTerm.id]}
            reviewSchedule={reviewSchedules[randomTerm.id]}
            memo={termMemos[randomTerm.id] ?? ''}
            onToggleFavorite={toggleFavorite}
            onUpdateReviewStatus={updateReviewStatus}
            onUpdateMemo={updateTermMemo}
            onOpenRelatedTerm={openRelatedTerm}
          />
        </ModePanel>
      )}

      {activeMode === 'review' && (
        <ModePanel title="다시 보기" subtitle="선택한 Deck에서 모르는 용어만 모아서 복습합니다.">
          {reviewTerms.length === 0 ? (
            <div className="empty-state-card">
              <p>다시 볼 용어가 없습니다. 랜덤 연습에서 모르는 용어를 '다시 보기'로 표시하세요.</p>
              <button type="button" className="primary-action" onClick={() => selectMode('random')}>
                랜덤 연습으로 가기
              </button>
            </div>
          ) : (
            <div className="review-stack">
              {reviewTerms.map((term) => (
                <StudyCard
                  key={term.id}
                  term={term}
                  isFavorite={favoriteIds.has(term.id)}
                  reviewStatus={reviewStatuses[term.id]}
                  reviewSchedule={reviewSchedules[term.id]}
                  memo={termMemos[term.id] ?? ''}
                  onToggleFavorite={toggleFavorite}
                  onUpdateReviewStatus={updateReviewStatus}
                  onUpdateMemo={updateTermMemo}
                  onOpenRelatedTerm={openRelatedTerm}
                />
              ))}
            </div>
          )}
        </ModePanel>
      )}

      {activeMode === 'search' && (
        <ModePanel
          title="전체 검색"
          subtitle={
            searchAllDecks
              ? '모든 Deck에서 용어를 찾습니다.'
              : '선택한 Deck 안에서 용어를 찾습니다.'
          }
        >
          <section className="search-panel" aria-label="용어 검색">
            <label className="search-label" htmlFor="term-search">
              용어, 뜻, 사용 예, 표현 예시, 프롬프트 예시로 검색
            </label>
            <input
              id="term-search"
              className="search-input"
              type="search"
              value={query}
              placeholder="예: 원본대조, schema, prompt..."
              onChange={(event) => setQuery(event.target.value)}
            />

            <label className="toggle-row">
              <input
                type="checkbox"
                checked={searchAllDecks}
                onChange={(event) => {
                  setSearchAllDecks(event.target.checked)
                  setSelectedCategory('All')
                }}
              />
              전체 Deck 검색
            </label>

            <div className="filter-label">분야 선택</div>
            <div className="chips" aria-label="분야 선택">
              {availableCategories.map((category) => (
                <button
                  type="button"
                  className={`chip ${selectedCategory === category ? 'active' : ''}`}
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'All' ? '전체 분야' : category}
                </button>
              ))}
            </div>
          </section>

          <div className="search-count">{searchTerms.length}개 용어</div>
          <div className="compact-list">
            {searchTerms.map((term) => (
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
              placeholder="예: Review the diff against acceptance criteria, identify boundary risks, and propose a rollback plan..."
              onChange={(event) => setReportText(event.target.value)}
            />
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={searchAllDecks}
                onChange={(event) => setSearchAllDecks(event.target.checked)}
              />
              전체 Deck에서 해석
            </label>
          </section>

          <div className="interpret-summary">
            <span>매칭 용어 {reportMatches.length}개</span>
            <span>{searchAllDecks ? '전체 Deck' : activeDeckDefinition.label}</span>
          </div>

          {reportText.trim() && reportMatches.length === 0 && (
            <p className="empty-state-card">
              아직 매칭되는 용어가 없습니다. 더 긴 문장을 붙여넣거나 전체 Deck 검색을 켜보세요.
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
    </main>
  )
}

type ModePanelProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

function ModePanel({ title, subtitle, children }: ModePanelProps) {
  return (
    <section className="mode-panel">
      <div className="mode-heading">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

type GuideDialogProps = {
  onClose: () => void
}

function GuideDialog({ onClose }: GuideDialogProps) {
  return (
    <div className="guide-backdrop" role="presentation">
      <section
        className="guide-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        <div className="guide-header">
          <div>
            <p className="eyebrow">Quick guide</p>
            <h2 id="guide-title">이 앱은 4개 모드로 씁니다.</h2>
          </div>
          <button type="button" className="close-button" aria-label="사용법 닫기" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="guide-summary">
          먼저 Deck을 고르고, 그 안에서 오늘·랜덤·다시 보기·전체 검색 모드를 사용합니다.
        </p>
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
      </section>
    </div>
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

function StudyCard({
  term,
  isFavorite,
  reviewStatus,
  reviewSchedule,
  memo,
  onToggleFavorite,
  onUpdateReviewStatus,
  onUpdateMemo,
  onOpenRelatedTerm,
}: TermActionProps) {
  return (
    <article className={`study-card deck-${term.deck}`}>
      <div className="card-meta-row">
        <div className="badge-group">
          <span className="category-badge">{term.domainLabel}</span>
          <span className="category-badge">{term.category}</span>
          <span className="category-badge">{getDifficultyLabel(term.difficulty)}</span>
        </div>
        <StatusBadges isFavorite={isFavorite} reviewStatus={reviewStatus} />
      </div>

      <div className="term-title">
        <h3>{term.term}</h3>
        <p>{term.pronunciation}</p>
      </div>

      <p className="korean-meaning">{term.koreanMeaning}</p>
      <p className="simple-meaning">{term.simpleMeaning}</p>

      <DetailBlock label={getUsageLabel(term)} tone="usage">
        {getUsageText(term)}
      </DetailBlock>
      <ConceptMapBlock term={term} />
      <DeepDiveBlock term={term} onOpenRelatedTerm={onOpenRelatedTerm} />
      <DetailBlock label="확인 질문" tone="question">
        {term.checkQuestion}
      </DetailBlock>
      <ExpressionBlock term={term} />
      <PromptBlock term={term} />
      <CautionBlock term={term} />
      <MemoBlock term={term} memo={memo} onUpdateMemo={onUpdateMemo} />

      <TermActions
        term={term}
        isFavorite={isFavorite}
        reviewStatus={reviewStatus}
        reviewSchedule={reviewSchedule}
        onToggleFavorite={onToggleFavorite}
        onUpdateReviewStatus={onUpdateReviewStatus}
      />
    </article>
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
          <div className="badge-group">
            <span className="category-badge">{term.domainLabel}</span>
            <span className="category-badge">{term.category}</span>
          </div>
          <h3>{term.term}</h3>
          <p className="compact-pronunciation">{term.pronunciation}</p>
          <p className="compact-meaning">{term.koreanMeaning}</p>
          {matchReason && <p className="match-reason">{matchReason}</p>}
        </div>
        <StatusBadges isFavorite={isFavorite} reviewStatus={reviewStatus} />
      </div>

      <button type="button" className="detail-toggle" onClick={onToggleExpanded}>
        {isExpanded ? '접기' : '자세히 보기'}
      </button>

      {isExpanded && (
        <div className="compact-details">
          <p className="simple-meaning">{term.simpleMeaning}</p>
          <DetailBlock label={getUsageLabel(term)} tone="usage">
            {getUsageText(term)}
          </DetailBlock>
          <ConceptMapBlock term={term} />
          <DeepDiveBlock term={term} onOpenRelatedTerm={onOpenRelatedTerm} />
          <DetailBlock label="확인 질문" tone="question">
            {term.checkQuestion}
          </DetailBlock>
          <ExpressionBlock term={term} />
          <PromptBlock term={term} />
          <CautionBlock term={term} />
          <MemoBlock term={term} memo={memo} onUpdateMemo={onUpdateMemo} />
          <TermActions
            term={term}
            isFavorite={isFavorite}
            reviewStatus={reviewStatus}
            reviewSchedule={reviewSchedule}
            onToggleFavorite={onToggleFavorite}
            onUpdateReviewStatus={onUpdateReviewStatus}
          />
        </div>
      )}
    </article>
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

type DetailBlockProps = {
  label: string
  tone: 'usage' | 'question' | 'expression' | 'caution' | 'mechanism' | 'mental'
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
    <section className="concept-map-block" aria-label={`${term.term} 개념 지도`}>
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
    <section className="deep-dive-block" aria-label={`${term.term} 심화 설명`}>
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
        <div className="related-terms" aria-label={`${term.term} 관련 용어`}>
          <span>같이 볼 용어</span>
          <div>
            {term.relatedTerms.map((relatedTerm) => (
              <button
                type="button"
                key={relatedTerm}
                onClick={() => onOpenRelatedTerm(relatedTerm, term.deck)}
              >
                {relatedTerm}
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
  const prompt = term.gptPromptExample ?? term.codexPromptExample
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  if (!prompt) {
    return null
  }

  const copyPrompt = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(prompt)
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
        <span>{term.deck === 'dispute-integration' ? 'GPT 프롬프트 예시' : '프롬프트 예시'}</span>
        <button type="button" onClick={copyPrompt}>
          {copyState === 'copied'
            ? '복사됨'
            : copyState === 'failed'
              ? '복사 실패'
              : '프롬프트 복사'}
        </button>
      </div>
      <p>{prompt}</p>
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
    <>
      {reviewSchedule && (
        <p className="review-schedule-note">
          다음 복습: {formatReviewDate(reviewSchedule.nextReviewDate)} · 간격{' '}
          {reviewSchedule.intervalDays}일
        </p>
      )}
      <div className="term-actions" aria-label={`${term.term} 학습 동작`}>
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
    </>
  )
}

function getUsageLabel(term: DevTerm) {
  return term.deck === 'dispute-integration' ? '분쟁통합 사용 예' : '학습 사용 예'
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
        ['영어 용어', term.term],
        ['한국어 의미', term.koreanMeaning],
        ['발음', term.pronunciation],
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
            reason: `${match[0]} 매칭`,
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

function getRandomPracticeKey(dateKey: string, deckId: DeckId) {
  return `${dateKey}:${deckId}`
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase('ko-KR')
}

function hashString(value: string) {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

export default App
