import { koreanTermNames } from './koreanTermNames'
import type { DevTerm } from './types'

const categoryNames: Partial<Record<string, string>> = {
  'AI Command': '인공지능 지시',
  'AI Protocols': '인공지능 연결 규약',
  'AI/Data Tools': '인공지능·데이터 도구',
  'Agent Design': '에이전트 설계',
  'Agent Portfolio': '에이전트 후보군',
  'Agent State': '에이전트 상태',
  'Architecture': '시스템 구조',
  'Authority Boundary': '권한 경계',
  'Boundary': '경계',
  'Boundary / Safety': '경계·안전',
  'Browser APIs': '브라우저 기능 연결 규약',
  'Build Tools': '빌드 도구',
  'Candidate Lifecycle': '후보의 단계',
  'Capability Architecture': '기능 구조',
  'Change Control': '변경 통제',
  'Contract Architecture': '계약 구조',
  'Coordination': '조율',
  'Data / Schema': '데이터·구조 명세',
  'Data Contract': '데이터 계약',
  'Data Formats': '데이터 형식',
  'Data Structure': '데이터 구조',
  'Data Surface': '데이터 접점',
  'Data Tools': '데이터 도구',
  'Decision Trace': '판단 추적',
  'Evaluation': '평가',
  'Evidence': '근거',
  'Execution Boundary': '실행 경계',
  'Experiment Control': '실험 통제',
  'Experiment Identity': '실험 식별',
  'Flow': '처리 흐름',
  'Frontend Frameworks': '화면 개발 틀',
  'Git / Change Control': '깃·변경 통제',
  'Governance': '운영 규칙',
  'Hosting Tools': '웹 서비스 게시 도구',
  'Integration Boundary': '통합 경계',
  'JOOVIS-Specific': '주비스 용어',
  'Knowledge': '지식',
  'Languages': '프로그래밍 언어',
  'Loop Architecture': '반복 실행 구조',
  'Observation': '관측',
  'Package Managers': '패키지 관리 도구',
  'Plane Architecture': '책임 계층 구조',
  'Planning': '계획',
  'Programming': '프로그래밍',
  'Prompt Quality': '지시문 품질',
  'Quality Tools': '품질 도구',
  'React': '리액트',
  'Readiness': '준비도',
  'Reality-Synced World': '현실과 맞춘 상태',
  'Resource Control': '자원 제어',
  'Review': '검토',
  'Review / QA': '검토·품질 확인',
  'Runtime': '실행 환경',
  'Runtime / Integration': '실행·통합',
  'Runtime Continuity': '실행 연속성',
  'Safety': '안전',
  'Selection': '선택',
  'Source Health': '원천 건전성',
  'State': '상태',
  'Temporal Safety': '시점 안전성',
  'Terminal Tools': '터미널 도구',
  'Traceability': '추적 가능성',
  'Truth Surface': '기준 사실 조회',
  'World Mode': '관측 환경 모드',
}

export function getKoreanCategory(category: string) {
  return categoryNames[category] ?? category.replace(/^Roblox /u, '로블록스 ')
}

const everydayTerms: Record<string, string> = {
  'agent': '에이전트',
  'agent runtime': '에이전트 실행 환경',
  'actionable': '실행 가능',
  'arena': '평가 환경',
  'asset': '자산',
  'client/server': '클라이언트와 서버',
  'source of truth': '최종 기준 원천',
  'compatibility': '호환성',
  'reconciliation': '대조',
  'availability': '사용 가능 여부',
  'authority': '권한',
  'artifact': '산출물',
  'build': '빌드',
  'capability': '기능',
  'candidate': '후보',
  'canonical': '기준',
  'cadence': '주기',
  'client': '클라이언트',
  'commit': '커밋',
  'confirmed': '확인됨',
  'content': '콘텐츠',
  'context': '맥락',
  'contract': '계약',
  'creator': '창작자',
  'data': '데이터',
  'dataset': '데이터 묶음',
  'deck': '학습장',
  'downstream': '후속 사용처',
  'duplicate': '중복',
  'eval': '평가',
  'event': '사건',
  'execution': '실행',
  'factory': '생성기',
  'foundry lab': '파운드리 연구실',
  'foundry': '파운드리',
  'freshness': '최신성',
  'gate': '통과 조건',
  'graph': '관계도',
  'fingerprint': '내용 지문',
  'harness': '실행 틀',
  'hash': '해시',
  'health': '건전성',
  'input': '입력',
  'integration': '통합',
  'joovis': '주비스',
  'lab': '연구실',
  'ledger': '기록 대장',
  'layer': '계층',
  'loop': '반복 흐름',
  'likely': '추정',
  'log': '실행 기록',
  'mainline': '본선',
  'metadata': '메타데이터',
  'model': '모델',
  'network': '네트워크',
  'output': '출력',
  'owner': '담당 주체',
  'packet': '자료 묶음',
  'payload': '실제 데이터',
  'plane': '책임 계층',
  'policy': '정책',
  'projection': '읽기용 요약',
  'provider': '공급자',
  'ref': '참조',
  'refs': '참조 정보',
  'roblox': '로블록스',
  'robux': '로벅스',
  'runner': '실행기',
  'schema': '구조 명세',
  'server': '서버',
  'shadow': '별도 관측',
  'source': '원천',
  'stale': '오래된',
  'state': '상태',
  'tool': '도구',
  'trace': '추적 기록',
  'truth': '기준 사실',
  'unknown': '미확인',
  'upstream': '선행 입력 쪽',
  'version': '판본',
  'workspace': '작업 공간',
}

const proseTerms = new Map<string, string>()
for (const [name, translation] of Object.entries(koreanTermNames)) {
  if (/^[a-z][a-z0-9 &/-]*$/iu.test(name) && translation) {
    proseTerms.set(name.toLowerCase(), translation)
  }
}
for (const [name, translation] of Object.entries(everydayTerms)) {
  proseTerms.set(name, translation)
}

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
const termPattern = [...proseTerms.keys()].sort((a, b) => b.length - a.length).map(escapePattern).join('|')
const particlePairs = [
  ['으로', '로'], ['이라고', '라고'], ['이라는', '라는'], ['이란', '란'], ['이며', '며'],
  ['이나', '나'], ['은', '는'], ['이', '가'], ['을', '를'], ['과', '와'],
] as const
const particlePattern = particlePairs.flat().sort((a, b) => b.length - a.length).join('|')

// Keep literal commands, code snippets, URLs, and compound identifiers readable as written.
const prosePattern = new RegExp(
  `\`[^\`]*\`|https?://[^\\s]+|\\b(?:git [a-z-]+|npm(?:\\.cmd)? (?:run [a-z0-9:_-]+|[a-z-]+))|(?<![a-z0-9_./:$-])(${termPattern})(?![a-z0-9_/+:$-]|\\.[a-z0-9])(?:(${particlePattern})(?![가-힣]))?`,
  'giu',
)

export function koreanizeTermProse(text: string) {
  return text.replace(prosePattern, (match: string, term?: string, particle?: string) => {
    const translation = term && proseTerms.get(term.toLowerCase())
    if (!translation) return match
    if (!particle) return translation

    const lastLetter = translation.at(-1)!
    const pair = particlePairs.find(([first, second]) => first === particle || second === particle)
    if (!pair || !/[가-힣]/u.test(lastLetter)) return translation + particle

    const finalConsonant = (lastLetter.charCodeAt(0) - '가'.charCodeAt(0)) % 28
    const needsConsonantForm = finalConsonant !== 0 && !(pair[0] === '으로' && finalConsonant === 8)
    return translation + pair[needsConsonantForm ? 0 : 1]
  })
}

const proseFields = [
  'koreanMeaning',
  'simpleMeaning',
  'joovisUsage',
  'checkQuestion',
  'codexPromptExample',
  'badExpression',
  'goodExpression',
  'disputeUsage',
  'evidenceCaution',
  'privacyWarning',
  'mechanism',
  'usagePattern',
  'commonPitfall',
  'expertNote',
  'statusNote',
  'mentalModel',
  'whyItMatters',
  'withoutIt',
  'realWorkflow',
  'selectionReason',
] as const satisfies ReadonlyArray<keyof DevTerm>

export function koreanizeTermDescriptions(term: DevTerm): DevTerm {
  const result = { ...term, domainLabel: koreanizeTermProse(term.domainLabel) }
  for (const field of proseFields) {
    const text = term[field]
    if (!text) continue
    const korean = text.split('\nEN:', 1)[0]
    result[field] = koreanizeTermProse(korean)
  }
  return result
}
