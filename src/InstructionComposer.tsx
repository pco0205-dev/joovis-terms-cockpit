import { useRef, useState } from 'react'
import {
  buildInstruction,
  findIntentFamily,
  intentDomains,
  intentFamilies,
  type InstructionDraft,
} from './instructionIntents'

type Props = {
  draft: InstructionDraft
  onUpdate: (patch: Partial<InstructionDraft>) => void
  onSave: (original: string, instruction: string) => void
  onOpenRelatedTerm: (name: string) => void
  getTermLabel: (name: string) => string
}

export default function InstructionComposer({
  draft,
  onUpdate,
  onSave,
  onOpenRelatedTerm,
  getTermLabel,
}: Props) {
  const family = intentFamilies.find(({ id }) => id === draft.familyId) ?? findIntentFamily(draft.original)
  const choice = family.choices.find(({ label }) => label === draft.choiceLabel)
  const canCreate = Boolean(choice && (draft.target.trim() || draft.outcome.trim()))
  const [feedback, setFeedback] = useState('')
  const resultRef = useRef<HTMLTextAreaElement>(null)

  const createInstruction = () => {
    if (!choice || !canCreate) return
    onUpdate({ improvedKo: buildInstruction(draft, choice) })
    setFeedback('')
  }

  const copyInstruction = async () => {
    try {
      await navigator.clipboard.writeText(draft.improvedKo.trim())
      setFeedback('지시문을 복사했어요.')
    } catch {
      resultRef.current?.focus()
      resultRef.current?.select()
      setFeedback('선택된 지시문을 직접 복사해 주세요.')
    }
  }

  return (
    <section className="instruction-composer" aria-label="지시문 만들기">
      <div className="composer-field">
        <label htmlFor="intent-original">떠오른 말</label>
        <textarea
          id="intent-original"
          className="training-input"
          rows={2}
          value={draft.original}
          placeholder="예: 화면이 좀 복잡한데 더 편하게 해줘."
          onChange={(event) => {
            onUpdate({ original: event.target.value, familyId: null, choiceLabel: null })
            setFeedback('')
          }}
        />
      </div>

      <div className="composer-field">
        <label htmlFor="intent-family">어떤 표현을 비교할까요?</label>
        <select
          id="intent-family"
          value={family.id}
          onChange={(event) => onUpdate({ familyId: event.target.value, choiceLabel: null })}
        >
          {intentDomains.map((domain) => (
            <optgroup key={domain} label={domain}>
              {intentFamilies.filter((item) => item.domain === domain).map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <fieldset className="intent-choices">
        <legend>어떤 뜻이 가장 가까워요?</legend>
        <p>{family.question}</p>
        {family.choices.map((item) => (
          <label className="intent-choice" key={item.label}>
            <input
              type="radio"
              name="instruction-intent"
              checked={choice === item}
              onChange={() => onUpdate({ familyId: family.id, choiceLabel: item.label })}
            />
            <span>
              <strong>{item.label}</strong>
              <span>{item.meaning}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {choice && (
        <p className="intent-sample">
          <strong>이렇게 써요</strong>
          {choice.instruction}
        </p>
      )}

      <details className="deep-details composer-examples">
        <summary>예시와 같이 볼 단어</summary>
        <dl>
          <dt>처음 떠오른 말</dt>
          <dd>{family.example.original}</dd>
          <dt>구체적인 지시문</dt>
          <dd>{family.example.instruction}</dd>
        </dl>
        <div className="related-terms">
          <span>같이 볼 단어</span>
          <div>
            {family.relatedTerms.map((name) => (
              <button key={name} type="button" onClick={() => onOpenRelatedTerm(name)}>
                {getTermLabel(name)}
              </button>
            ))}
          </div>
        </div>
      </details>

      {choice && (
        <div className="composer-fields">
          <div className="composer-field">
            <label htmlFor="intent-target">무엇을 다룰까요?</label>
            <input
              id="intent-target"
              value={draft.target}
              placeholder="예: 휴대폰 첫 화면"
              onChange={(event) => onUpdate({ target: event.target.value })}
            />
          </div>
          <div className="composer-field">
            <label htmlFor="intent-outcome">어떤 결과가 필요해요?</label>
            <input
              id="intent-outcome"
              value={draft.outcome}
              placeholder="예: 오늘 용어를 한 번에 시작"
              onChange={(event) => onUpdate({ outcome: event.target.value })}
            />
          </div>
          <div className="composer-field">
            <label htmlFor="intent-constraint">지킬 조건이 있어요? <small>(선택)</small></label>
            <input
              id="intent-constraint"
              value={draft.constraint}
              placeholder="예: 기존 학습 기록 유지"
              onChange={(event) => onUpdate({ constraint: event.target.value })}
            />
          </div>
          <button
            type="button"
            className={draft.improvedKo ? 'secondary-action' : 'primary-action'}
            disabled={!canCreate}
            onClick={createInstruction}
          >
            {draft.improvedKo ? '지시문 다시 만들기' : '지시문 만들기'}
          </button>
        </div>
      )}

      {draft.improvedKo && (
        <div className="composer-result">
          <div className="composer-field">
            <label htmlFor="intent-result">내 지시문</label>
            <textarea
              id="intent-result"
              ref={resultRef}
              className="training-input"
              rows={5}
              value={draft.improvedKo}
              onChange={(event) => {
                onUpdate({ improvedKo: event.target.value })
                setFeedback('')
              }}
            />
          </div>
          <div className="training-actions">
            <button type="button" className="primary-action" disabled={!draft.improvedKo.trim()} onClick={copyInstruction}>
              지시문 복사
            </button>
            <button type="button" className="secondary-action" disabled={!draft.improvedKo.trim()} onClick={() => {
              onSave(draft.original.trim() || choice?.label || family.label, draft.improvedKo.trim())
              setFeedback('내 표현에 추가했어요.')
            }}>
              내 표현에 저장
            </button>
          </div>
        </div>
      )}
      {feedback && <p className="composer-feedback" role="status">{feedback}</p>}
    </section>
  )
}
