import { useMemo, useState } from 'react'
import { datasetStats, devTerms } from './devTerms'
import {
  deckDefinitions,
  type DeckId,
  type DevTerm,
  type ReviewStatus,
} from './types'
import {
  loadFavoriteIds,
  loadOnboardingDismissed,
  loadRandomPracticeCount,
  loadReviewStatuses,
  saveFavoriteIds,
  saveOnboardingDismissed,
  saveRandomPracticeCount,
  saveReviewStatuses,
} from './storage'

type Mode = 'today' | 'random' | 'review' | 'search'

const modes: Array<{ id: Mode; label: string; description: string }> = [
  { id: 'today', label: '오늘', description: '하루 1개' },
  { id: 'random', label: '랜덤', description: '새 카드' },
  { id: 'review', label: '다시 보기', description: '모르는 것' },
  { id: 'search', label: '전체 검색', description: '찾아보기' },
]

const guideItems = [
  { title: '오늘', body: '하루 1개 용어를 봅니다.' },
  { title: '랜덤', body: '버튼을 눌러 새 용어를 연습합니다.' },
  { title: '다시 보기', body: '모르는 용어만 다시 봅니다.' },
  { title: '전체 검색', body: 'Codex 보고서에서 모르는 단어를 찾습니다.' },
]

function App() {
  const [activeDeck, setActiveDeck] = useState<DeckId>('ai-command')
  const [activeMode, setActiveMode] = useState<Mode>('today')
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchAllDecks, setSearchAllDecks] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => loadFavoriteIds())
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, ReviewStatus>>(() =>
    loadReviewStatuses(),
  )
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null)
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
    return (
      activeDeckTerms.find((term) => term.id === selectedId) ??
      pickRandomTerm(activeDeckTerms, null, `random-${activeDeck}-${todayDateKey}`)
    )
  }, [activeDeck, activeDeckTerms, randomTermIds, todayDateKey])

  const deckFavoriteCount = activeDeckTerms.filter((term) => favoriteIds.has(term.id)).length
  const deckKnownCount = activeDeckTerms.filter(
    (term) => reviewStatuses[term.id] === 'known',
  ).length
  const deckReviewAgainCount = activeDeckTerms.filter(
    (term) => reviewStatuses[term.id] === 'review_again',
  ).length

  const reviewTerms = useMemo(
    () => activeDeckTerms.filter((term) => reviewStatuses[term.id] === 'review_again'),
    [activeDeckTerms, reviewStatuses],
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
          term.domainLabel,
        ]
          .filter(Boolean)
          .join(' '),
      )

      return matchesCategory && searchableText.includes(normalizedQuery)
    })
  }, [availableCategories, query, searchSourceTerms, selectedCategory])

  const selectDeck = (deckId: DeckId) => {
    setActiveDeck(deckId)
    setSelectedCategory('All')
    setExpandedTermId(null)
    setQuery('')
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
      const next = { ...current }
      if (next[termId] === nextStatus) {
        delete next[termId]
      } else {
        next[termId] = nextStatus
      }
      saveReviewStatuses(next)
      return next
    })
  }

  const showNextRandomTerm = () => {
    const nextTerm = pickRandomTerm(activeDeckTerms, randomTerm.id)
    setRandomTermIds((current) => ({ ...current, [activeDeck]: nextTerm.id }))
    setRandomPracticeCounts((current) => {
      const nextCount = current[activeDeck] + 1
      saveRandomPracticeCount(getRandomPracticeKey(todayDateKey, activeDeck), nextCount)
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
        <button type="button" className="help-button" onClick={() => setIsGuideOpen(true)}>
          사용법
        </button>
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
            onClick={() => setActiveMode(mode.id)}
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
      </section>

      {activeMode === 'today' && (
        <ModePanel title="오늘의 용어" subtitle="선택한 Deck 안에서 날짜 기준으로 하루 1개 고정됩니다.">
          <StudyCard
            term={todayTerm}
            isFavorite={favoriteIds.has(todayTerm.id)}
            reviewStatus={reviewStatuses[todayTerm.id]}
            onToggleFavorite={toggleFavorite}
            onUpdateReviewStatus={updateReviewStatus}
          />
        </ModePanel>
      )}

      {activeMode === 'random' && (
        <ModePanel title="랜덤 연습" subtitle="버튼을 누르면 이 Deck 안에서 새 용어로 바뀝니다.">
          <div className="random-controls">
            <span>오늘 랜덤 연습: {randomPracticeCounts[activeDeck]}개</span>
            <button type="button" className="primary-action" onClick={showNextRandomTerm}>
              다음 랜덤 용어
            </button>
          </div>
          <StudyCard
            term={randomTerm}
            isFavorite={favoriteIds.has(randomTerm.id)}
            reviewStatus={reviewStatuses[randomTerm.id]}
            onToggleFavorite={toggleFavorite}
            onUpdateReviewStatus={updateReviewStatus}
          />
        </ModePanel>
      )}

      {activeMode === 'review' && (
        <ModePanel title="다시 보기" subtitle="선택한 Deck에서 모르는 용어만 모아서 복습합니다.">
          {reviewTerms.length === 0 ? (
            <div className="empty-state-card">
              <p>다시 볼 용어가 없습니다. 랜덤 연습에서 모르는 용어를 '다시 보기'로 표시하세요.</p>
              <button type="button" className="primary-action" onClick={() => setActiveMode('random')}>
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
                  onToggleFavorite={toggleFavorite}
                  onUpdateReviewStatus={updateReviewStatus}
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
                onToggleExpanded={() =>
                  setExpandedTermId((current) => (current === term.id ? null : term.id))
                }
                onToggleFavorite={toggleFavorite}
                onUpdateReviewStatus={updateReviewStatus}
              />
            ))}
          </div>

          {searchTerms.length === 0 && (
            <p className="empty-state-card">조건에 맞는 용어가 없습니다. 검색어나 분야를 조정해 주세요.</p>
          )}
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
  onToggleFavorite: (termId: string) => void
  onUpdateReviewStatus: (termId: string, status: ReviewStatus) => void
}

function StudyCard({
  term,
  isFavorite,
  reviewStatus,
  onToggleFavorite,
  onUpdateReviewStatus,
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
      <DetailBlock label="확인 질문" tone="question">
        {term.checkQuestion}
      </DetailBlock>
      <ExpressionBlock term={term} />
      <PromptBlock term={term} />
      <CautionBlock term={term} />

      <TermActions
        term={term}
        isFavorite={isFavorite}
        reviewStatus={reviewStatus}
        onToggleFavorite={onToggleFavorite}
        onUpdateReviewStatus={onUpdateReviewStatus}
      />
    </article>
  )
}

type CompactTermCardProps = TermActionProps & {
  isExpanded: boolean
  onToggleExpanded: () => void
}

function CompactTermCard({
  term,
  isExpanded,
  isFavorite,
  reviewStatus,
  onToggleExpanded,
  onToggleFavorite,
  onUpdateReviewStatus,
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
          <DetailBlock label="확인 질문" tone="question">
            {term.checkQuestion}
          </DetailBlock>
          <ExpressionBlock term={term} />
          <PromptBlock term={term} />
          <CautionBlock term={term} />
          <TermActions
            term={term}
            isFavorite={isFavorite}
            reviewStatus={reviewStatus}
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
  tone: 'usage' | 'question' | 'expression' | 'caution'
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

function TermActions({
  term,
  isFavorite,
  reviewStatus,
  onToggleFavorite,
  onUpdateReviewStatus,
}: TermActionProps) {
  return (
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
