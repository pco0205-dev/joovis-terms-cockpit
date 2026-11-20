import { instructionStudyFamilies } from './instructionStudyFamilies'

export type IntentChoice = {
  label: string
  meaning: string
  instruction: string
}

export const intentDomains = ['지시', '개발', '연구'] as const
export const intentLevels = ['기초', '실무', '심화'] as const

export type IntentFamily = {
  id: string
  domain: typeof intentDomains[number]
  level: typeof intentLevels[number]
  label: string
  cues: string[]
  question: string
  choices: IntentChoice[]
  relatedTerms: string[]
  example: { original: string; instruction: string }
}

export const intentFamilies = [
  {
    id: 'check',
    domain: '지시',
    level: '기초',
    label: '확인 · 검토 · 검증',
    cues: ['확인', '검토', '검증', '점검', '봐줘', '맞아', '됐나', '문제없는지'],
    question: '지금 상태만 알고 싶은가요, 문제를 찾고 싶은가요, 기준에 맞는지 증명하고 싶은가요?',
    choices: [
      { label: '확인', meaning: '현재 어떤 상태인지 사실을 알아본다.', instruction: '현재 상태와 그 근거를 확인해서 알려줘.' },
      { label: '검토', meaning: '내용을 살펴 문제, 빠진 점, 개선할 점을 찾는다.', instruction: '문제와 빠진 점을 찾고, 영향이 큰 것부터 근거와 함께 정리해줘.' },
      { label: '검증', meaning: '정해진 기준에 맞는지 실제로 대조하거나 시험한다.', instruction: '제시한 기준에 맞는지 실제로 시험하고, 통과 여부와 근거를 알려줘.' },
    ],
    relatedTerms: ['Source of Truth', 'Finding', 'Acceptance Criteria', 'Validation'],
    example: {
      original: '전체적으로 한 번 봐줘.',
      instruction: '휴대폰 첫 화면을 검토해줘. 첫 학습 카드까지 가는 데 필요한 조작을 세고, 진행을 막거나 헷갈리게 하는 부분부터 근거와 함께 정리해줘.',
    },
  },
  {
    id: 'change',
    domain: '개발',
    level: '기초',
    label: '수정 · 개선 · 단순화',
    cues: ['수정', '개선', '단순화', '정리해줘', '복잡', '불편', '고쳐', '바꿔', '다듬'],
    question: '틀린 동작을 고치는 건가요, 사용성을 높이는 건가요, 선택지를 줄이는 건가요?',
    choices: [
      { label: '수정', meaning: '틀어지거나 깨진 동작을 기대하던 상태로 돌린다.', instruction: '문제의 원인을 확인하고 기대한 동작을 복구해줘.' },
      { label: '개선', meaning: '쓸 수 있는 기능을 더 편하고 명확하게 만든다.', instruction: '불편이 생기는 지점을 찾아 원하는 사용 흐름에 맞게 바꿔줘.' },
      { label: '단순화', meaning: '겹치는 선택이나 불필요한 단계를 줄인다.', instruction: '자주 쓰는 동작을 먼저 보여주고, 겹치는 단계나 선택을 줄여줘.' },
    ],
    relatedTerms: ['Diff', 'Regression', 'Acceptance Criteria', 'Scope'],
    example: {
      original: '기능이 많고 복잡한데 개선해줘.',
      instruction: '첫 화면을 단순화해줘. 오늘 학습을 한 번에 시작할 수 있게 하고, 자주 쓰는 메뉴만 앞에 둬. 기존 학습 기록은 유지해줘.',
    },
  },
  {
    id: 'release',
    domain: '개발',
    level: '실무',
    label: '반영 · 배포 · 적용 확인',
    cues: ['적용', '반영', '배포', '푸시', '푸쉬', '업데이트', '새버전'],
    question: '코드를 바꿀까요, 새 버전을 공개할까요, 실제 앱에서 새 버전이 보이는지 확인할까요?',
    choices: [
      { label: '반영', meaning: '결정한 변경을 정해진 파일이나 저장소에 넣는다.', instruction: '합의한 변경을 지정된 파일에 반영하고 변경 내용을 알려줘.' },
      { label: '배포', meaning: '새 버전을 사용자가 접속하는 환경에서 제공한다.', instruction: '검증된 변경을 배포하고 해당 버전의 배포 상태를 확인해줘.' },
      { label: '적용 확인', meaning: '사용자가 여는 화면에 변경이 실제로 나타났는지 본다.', instruction: '실제 앱 주소를 열어 새 버전인지 화면이나 파일로 확인해줘.' },
    ],
    relatedTerms: ['Commit', 'Deployment', 'Service Worker', 'Acceptance Criteria'],
    example: {
      original: '적용된 거야?',
      instruction: '실제 사용 주소에 접속해서 새 메뉴가 보이는지 확인해줘. 확인된 배포 버전과 휴대폰에서 확인할 방법을 알려줘.',
    },
  },
  {
    id: 'thinking',
    domain: '지시',
    level: '기초',
    label: '의도 · 방향 · 우선순위',
    cues: ['의도', '방향', '우선순위', '머릿속', '정체성', '먼저할', '목표', '생각'],
    question: '왜 원하는지, 어느 쪽으로 갈지, 무엇부터 할지 중 지금 막힌 것은 무엇인가요?',
    choices: [
      { label: '의도 정리', meaning: '겉으로 요청한 방법 뒤에 있는 진짜 목적을 찾아 말한다.', instruction: '내 말에서 원하는 결과와 그 이유를 뽑아줘. 확실하지 않은 부분은 질문해줘.' },
      { label: '방향 잡기', meaning: '앞으로 어떤 기준과 상태를 지향할지 정한다.', instruction: '유지할 기준과 바꾸고 싶은 점을 정리한 뒤 가능한 방향을 제안해줘.' },
      { label: '우선순위 정하기', meaning: '효과와 비용을 보고 무엇부터 할지 정한다.', instruction: '효과, 노력, 위험을 기준으로 나누고 무엇부터 할지 이유와 함께 알려줘.' },
    ],
    relatedTerms: ['User Intent', 'Assumption', 'Clarifying Question', 'Tradeoff'],
    example: {
      original: '방향은 유지하면서 더 좋게 하고 싶어.',
      instruction: '지금 경험에서 꼭 남겨야 할 점과 바꾸고 싶은 점을 먼저 구분해줘. 첫 사용자에게 효과가 큰 변경부터 두 가지 제안하고, 중요한 가정은 질문해줘.',
    },
  },
  {
    id: 'limits',
    domain: '지시',
    level: '실무',
    label: '대상 · 범위 · 경계',
    cues: ['범위', '경계', '읽기전용', '어디까지', '손대지', '유지', '권한', '대상'],
    question: '어떤 대상을 다룰지, 어디까지 할지, 어떤 행동을 금지할지 정해봤나요?',
    choices: [
      { label: '대상 지정', meaning: '확인하거나 바꿀 파일, 화면, 자료를 정확히 가리킨다.', instruction: '지정한 자료를 기준으로 요청을 처리해줘.' },
      { label: '범위 지정', meaning: '이번 작업에 포함할 부분과 뺄 부분을 정한다.', instruction: '적어 둔 범위 안에서 처리하고 추가로 필요한 일은 따로 알려줘.' },
      { label: '경계 설정', meaning: '넘으면 안 되는 행동이나 권한을 명확히 한다.', instruction: '허용한 행동만 진행하고 금지한 경계에 닿으면 멈춰서 이유를 알려줘.' },
    ],
    relatedTerms: ['Scope', 'Boundary', 'Read-only Mode', 'Stop Condition'],
    example: {
      original: '저장소 좀 확인해줘.',
      instruction: '지정한 저장소의 안내 문서만 읽고 주요 용어와 뜻을 요약해줘. 파일 수정이나 배포 없이 읽기 전용으로 진행해줘.',
    },
  },
  {
    id: 'decision',
    domain: '지시',
    level: '실무',
    label: '비교 · 판단 · 결정',
    cues: ['비교', '판단', '결정', '선택', '추천', '장단점', '뭐가좋아', '뭐가나아'],
    question: '차이를 나란히 보고 싶나요, 조건에 맞는지 평가하고 싶나요, 하나를 골라야 하나요?',
    choices: [
      { label: '비교', meaning: '같은 기준으로 여러 선택의 차이를 보여준다.', instruction: '같은 기준으로 선택지를 나란히 비교하고 각각의 득실을 정리해줘.' },
      { label: '판단', meaning: '근거와 기준을 대조해 적합 여부를 가린다.', instruction: '기준과 근거를 대조해 적합한지 판단하고 불확실한 부분을 밝혀줘.' },
      { label: '결정 지원', meaning: '득실을 고려해 다음 행동을 고를 수 있게 돕는다.', instruction: '적합한 선택 하나를 추천하고 그 이유와 결론이 바뀔 조건을 알려줘.' },
    ],
    relatedTerms: ['Tradeoff', 'Rubric', 'Decision Record', 'Counterexample'],
    example: {
      original: '어느 쪽이 나을까?',
      instruction: '두 메뉴 구성을 첫 사용자의 클릭 수와 학습 기능을 다시 찾기 쉬운 정도로 비교해줘. 하나를 추천하고 반대 선택이 나을 조건도 알려줘.',
    },
  },
  {
    id: 'evidence',
    domain: '연구',
    level: '기초',
    label: '사실 · 추정 · 근거',
    cues: ['근거', '추정', '추측', '사실', '확실', '무슨이유', '왜이런'],
    question: '직접 본 것, 그렇게 해석한 이유, 아직 모르는 것을 구분할 수 있나요?',
    choices: [
      { label: '사실 구분', meaning: '직접 확인한 내용과 해석을 나눈다.', instruction: '직접 확인한 사실, 해석, 아직 확인하지 못한 점을 나눠줘.' },
      { label: '근거 요청', meaning: '판단을 뒷받침하는 자료와 확인 방법을 묻는다.', instruction: '각 판단을 뒷받침하는 자료와 확인한 방법을 함께 적어줘.' },
      { label: '반례 확인', meaning: '현재 해석이 틀릴 수 있는 실제 조건을 찾아본다.', instruction: '이 설명을 깨뜨릴 수 있는 반례를 찾고 어떤 근거가 더 필요한지 알려줘.' },
    ],
    relatedTerms: ['Evidence Request', 'Provenance', 'Counterexample', 'Confidence'],
    example: {
      original: '왜 그렇게 본 거야?',
      instruction: '직접 확인한 결과와 원인에 대한 추정을 구분해줘. 각 항목의 근거를 적고, 추가 확인이 필요한 부분은 따로 표시해줘.',
    },
  },
  {
    id: 'design',
    domain: '개발',
    level: '기초',
    label: '설계 · 구현 · 완료 기준',
    cues: ['설계', '구현', '만들어', '어떻게할', '계획', '완료기준'],
    question: '작업 방법을 먼저 그리고 싶은가요, 실제 변경이 필요한가요, 끝났는지 판단할 기준이 필요한가요?',
    choices: [
      { label: '설계', meaning: '만들기 전에 구조, 흐름, 책임을 정한다.', instruction: '입력이 결과로 이어지는 과정과 각 단계의 책임을 먼저 설계해줘.' },
      { label: '구현', meaning: '합의한 설계를 실제로 동작하도록 만든다.', instruction: '정한 범위에서 구현하고 기본 흐름을 실제로 확인해줘.' },
      { label: '완료 기준', meaning: '작업이 끝났다고 판단할 관찰 가능한 조건을 정한다.', instruction: '작업 완료를 판단할 수 있는 구체적인 조건과 확인 방법을 적어줘.' },
    ],
    relatedTerms: ['Plan', 'Interface', 'Acceptance Criteria', 'Smoke Test'],
    example: {
      original: '잘 작동하게 만들어줘.',
      instruction: '검색창에서 한글 발음, 한국어 용어, 영어 원어를 입력하면 같은 카드가 나와야 해. 각 입력으로 검색해서 첫 결과가 맞는지 확인해줘.',
    },
  },
  {
    id: 'errors',
    domain: '개발',
    level: '실무',
    label: '재현 · 원인 분석 · 회귀 확인',
    cues: ['재현', '오류', '안돼', '깨져', '원인분석', '회귀', '버그'],
    question: '같은 문제가 다시 생기는 조건, 문제가 생긴 이유, 고친 뒤의 영향 중 무엇을 알고 싶나요?',
    choices: [
      { label: '재현', meaning: '같은 입력이나 조작으로 문제가 다시 나타나는지 확인한다.', instruction: '문제가 다시 나타나는 입력, 조작 순서, 기대 결과와 실제 결과를 기록해줘.' },
      { label: '원인 분석', meaning: '겉으로 드러난 증상과 그 증상을 만든 원인을 가른다.', instruction: '증상과 원인 후보를 구분하고, 각 원인 후보를 확인하거나 제외할 근거를 제시해줘.' },
      { label: '회귀 확인', meaning: '변경 뒤에도 원래 잘 되던 기능이 유지되는지 확인한다.', instruction: '고친 사례와 변경 전부터 잘되던 관련 사례를 함께 확인해줘.' },
    ],
    relatedTerms: ['Repro Steps', 'Failure Mode', 'Regression', 'Smoke Test'],
    example: {
      original: '이거 고쳤는데 다른 것도 괜찮아?',
      instruction: '한글 발음으로 검색이 안 되던 사례가 해결됐는지 확인해줘. 한국어 이름 검색과 이전 카드 이동도 그대로 동작하는지 시험해줘.',
    },
  },
  {
    id: 'structure',
    domain: '개발',
    level: '실무',
    label: '구조 · 책임 · 연결 규칙',
    cues: ['구조', '모듈', '책임', '연결', '누가맡', '역할', '아키텍처', '구조도'],
    question: '어떻게 나뉘는지, 누가 맡는지, 두 부분이 어떻게 주고받는지 중 어디가 헷갈리나요?',
    choices: [
      { label: '구조 파악', meaning: '구성 요소들이 어떤 관계와 순서로 연결되는지 본다.', instruction: '주요 구성 요소와 입력에서 결과까지 이어지는 흐름을 설명해줘.' },
      { label: '책임 구분', meaning: '어느 부분이 어떤 결정을 내리고 상태를 바꾸는지 가른다.', instruction: '각 구성 요소가 무엇을 읽고 바꾸는지, 최종 결정을 누가 맡는지 나눠줘.' },
      { label: '연결 규칙 확인', meaning: '서로 주고받는 내용과 꼭 지켜야 하는 조건을 확인한다.', instruction: '구성 요소 사이의 입력, 출력, 오류 처리와 서로 지켜야 할 조건을 정리해줘.' },
    ],
    relatedTerms: ['Contract', 'Interface', 'Dependency', 'Capability Unit'],
    example: {
      original: '이 구조가 어떻게 돌아가는지 모르겠어.',
      instruction: '입력 자료를 받는 쪽, 상태를 판단하는 쪽, 결과를 저장하는 쪽으로 나눠 설명해줘. 각 단계가 무엇을 받아 무엇을 넘기는지 예시를 들어줘.',
    },
  },
  {
    id: 'hypothesis',
    domain: '연구',
    level: '기초',
    label: '연구 질문 · 가설 · 반례',
    cues: ['가설', '반례', '연구질문', '원인이', '설명가능', '왜그럴'],
    question: '아직 답을 모르는 질문인가요, 검증해 볼 설명인가요, 그 설명이 틀릴 수 있는 사례인가요?',
    choices: [
      { label: '연구 질문', meaning: '관찰이나 실험으로 어떤 답을 얻을지 정한다.', instruction: '궁금한 점을 관찰할 대상, 비교할 조건, 확인할 결과가 드러나는 질문으로 바꿔줘.' },
      { label: '가설', meaning: '관찰 결과에 대한 잠정 설명으로, 맞거나 틀릴 조건을 적을 수 있다.', instruction: '가능한 설명을 가설로 적고, 맞을 때와 틀릴 때 각각 무엇이 관찰될지 나눠줘.' },
      { label: '반례', meaning: '같은 설명이 성립하지 않는 구체적인 사례를 찾는다.', instruction: '현재 가설이 설명하지 못하는 구체적인 사례를 찾고 가설의 범위를 다시 봐줘.' },
    ],
    relatedTerms: ['Assumption', 'Counterexample', 'Evidence Request', 'Validation'],
    example: {
      original: '메뉴를 줄이면 정말 사용이 편해질까?',
      instruction: '연구 질문을 첫 사용자가 오늘 카드에 도달하는 시간으로 좁혀줘. 메뉴가 적을 때 시간은 줄고 일부 기능은 찾기 어려워질 수 있다는 가설을 각각 확인할 방법을 적어줘.',
    },
  },
  {
    id: 'experiment',
    domain: '연구',
    level: '실무',
    label: '변수 · 통제 조건 · 비교 기준',
    cues: ['실험', '변수', '통제', '비교기준', '측정', '평가방법', '성능차이'],
    question: '무엇을 바꾸고, 무엇을 그대로 두고, 어떤 값으로 변화를 확인할까요?',
    choices: [
      { label: '변수 지정', meaning: '실험에서 바꿀 항목과 결과로 잴 항목을 구분한다.', instruction: '바꿀 항목 하나와 결과로 관찰할 항목을 분리해서 적어줘.' },
      { label: '조건 통제', meaning: '바꿀 항목 외에 결과에 영향을 줄 조건을 맞춘다.', instruction: '비교하는 두 경우에 공통으로 고정할 조건과 예외를 정해줘.' },
      { label: '비교 기준 설정', meaning: '변경 효과를 가늠할 기준 상태와 측정 방법을 정한다.', instruction: '기준으로 삼을 기존 방식과 새 방식에 똑같이 적용할 측정법을 적어줘.' },
    ],
    relatedTerms: ['Experiment Spec', 'Benchmark', 'Fixture', 'Metric'],
    example: {
      original: '어떤 설명이 더 잘 이해되는지 보고 싶어.',
      instruction: '짧은 정의만 있는 카드와 작동 예시가 붙은 카드를 비교해줘. 단어 난이도는 맞추고, 다음 날 각자 예를 들 수 있는지를 같은 방법으로 확인해줘.',
    },
  },
  ...instructionStudyFamilies,
] satisfies IntentFamily[]

export type InstructionDraft = {
  original: string
  level: typeof intentLevels[number] | '전체'
  familyId: string | null
  choiceLabel: string | null
  target: string
  outcome: string
  constraint: string
  improvedKo: string
}

export const emptyInstructionDraft: InstructionDraft = {
  original: '',
  level: '전체',
  familyId: null,
  choiceLabel: null,
  target: '',
  outcome: '',
  constraint: '',
  improvedKo: '',
}

export function findIntentFamily(original: string, families: readonly IntentFamily[] = intentFamilies) {
  const text = original.normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '')
  let bestScore = 0
  let bestPosition = Number.POSITIVE_INFINITY
  let bestMatch = families[0] ?? intentFamilies[0]

  for (const family of families) {
    for (const cue of family.cues) {
      const position = text.indexOf(cue)
      if (position >= 0 && (cue.length > bestScore || (cue.length === bestScore && position < bestPosition))) {
        bestMatch = family
        bestScore = cue.length
        bestPosition = position
      }
    }
  }

  if (bestScore === 0 && text.includes('연구')) {
    return families.find(({ id }) => id === 'hypothesis') ??
      families.find(({ domain }) => domain === '연구') ?? bestMatch
  }
  return bestMatch
}

export function buildInstruction(draft: InstructionDraft, choice: IntentChoice) {
  const target = draft.target.trim()
  const outcome = draft.outcome.trim()
  const constraint = draft.constraint.trim()
  if (!target && !outcome) return ''

  return [
    target && `대상: ${target}`,
    `요청: ${choice.instruction}`,
    outcome && `원하는 결과: ${outcome}`,
    constraint && `지킬 조건: ${constraint}`,
  ].filter(Boolean).join('\n')
}
