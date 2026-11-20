import type { RawDevTerm } from './types'

type Source = 'coordination' | 'knowledge' | 'main'

const sourceLabels: Record<Source, string> = {
  coordination: '주비스 공통 조율 저장소의 안내 및 운영 규칙',
  knowledge: '주비스 공통 지식 저장소의 장기 지식·목록 읽기 규칙',
  main: '주비스 본선 저장소의 구조 안내와 운영 규약',
}

type StudyEntry = {
  id: string
  term: string
  koreanName: string
  pronunciation: string
  meaning: string
  example: string
  mechanism: string
  question: string
  relatedTerms: string[]
}

function termsFrom(source: Source, entries: StudyEntry[]): RawDevTerm[] {
  return entries.map(({ meaning, example, question, ...entry }) => ({
    ...entry,
    id: `joovis-shared-${entry.id}`,
    deck: 'joovis-architecture',
    category: source === 'main' ? '본선 운영 구조' : '공통 저장소',
    domainLabel: '주비스 구조',
    difficulty: 'intermediate',
    learningPriority: 'core',
    selectionReason: '공통 저장소와 주비스 작업 문서를 읽을 때 반복해서 만나는 구조 용어입니다.',
    koreanMeaning: meaning,
    simpleMeaning: example,
    joovisUsage: example,
    checkQuestion: question,
    researchBasis: sourceLabels[source],
  }))
}

export const joovisSharedTerms: RawDevTerm[] = [
  ...termsFrom('coordination', [
    {
      id: 'coordination-plane', term: 'Shared Coordination Plane', koreanName: '공통 조율 계층', pronunciation: '셰어드 코오디네이션 플레인',
      meaning: '독립된 저장소들이 필요한 상태와 설계 방향을 찾아보고 조율하는 공용 구조입니다.',
      example: '본선과 파운드리가 같은 설계 생각을 검토할 때 공통 기록에서 각자의 의견을 읽습니다.',
      mechanism: '각 저장소가 자기 상태를 요약해 내놓고, 필요한 저장소가 그 요약을 찾아 읽습니다. 중요한 결정은 해당 결정을 맡은 곳에서 확정합니다.',
      question: '공용 조율 기록에 제안이 올라온 뒤 본선 반영을 확정하는 주체는 누구인가요?',
      relatedTerms: ['Shared Idea Registry', 'Producer-Owned Projection', 'Main Adoption'],
    },
    {
      id: 'producer-projection', term: 'Producer-Owned Projection', koreanName: '원천 담당자가 만든 상태 요약', pronunciation: '프로듀서 오운드 프로젝션',
      meaning: '원천 상태를 소유한 곳이 특정 시점의 확인 정보를 추려 제공한 읽기용 자료입니다.',
      example: '파운드리가 자기 저장소의 판본과 발행 시각을 요약해 올리면 본선은 먼저 그 요약을 확인합니다.',
      mechanism: '발행 주체, 원천 판본, 발행 시각, 최신성 허용 범위를 대조합니다. 상태가 바뀌었다면 요약을 발행한 주체가 새 자료를 만듭니다.',
      question: '상태 요약과 원천 저장소의 판본이 어긋나면 어느 쪽에서 다시 확인하나요?',
      relatedTerms: ['Shared Coordination Plane', 'Exact Revision Pinning', 'Freshness Window'],
    },
    {
      id: 'idea-registry', term: 'Shared Idea Registry', koreanName: '공통 아이디어 등록부', pronunciation: '셰어드 아이디어 레지스트리',
      meaning: '여러 작업 공간에서 같은 설계 아이디어를 한곳에서 검토할 수 있도록 모아 둔 등록부입니다.',
      example: '여러 팀이 검토하는 하나의 설계안을 먼저 찾고, 검토 결과를 같은 아이디어에 연결합니다.',
      mechanism: '이미 등록된 제안을 뜻으로 찾고 기존 식별자를 재사용합니다. 반례, 보완 제안, 검토 결과, 결정은 원안에 연결된 개별 기록으로 남깁니다.',
      question: '같은 아이디어에 새 반례가 들어오면 원래 기록과 새 의견은 어떻게 연결되나요?',
      relatedTerms: ['Append-Only Contribution', 'Owner Disposition', 'Counterexample'],
    },
    {
      id: 'append-contribution', term: 'Append-Only Contribution', koreanName: '덧붙이는 기여 기록', pronunciation: '어펜드 온리 컨트리뷰션',
      meaning: '기존 기록을 보존하면서 검토, 근거, 정정을 별도 항목으로 계속 추가하는 방식입니다.',
      example: '두 팀이 한 설계안을 다르게 평가하면 각자 자기 의견을 남기고, 이후 정정도 새 항목으로 연결합니다.',
      mechanism: '기여 대상의 식별자와 작성 주체를 기록하고, 새 내용은 그 주체의 기록 영역에 저장합니다. 읽는 사람은 관련 항목과 순서를 함께 확인합니다.',
      question: '이미 공개한 판단에 오류가 있음을 발견했다면 이전 기록과 정정의 관계를 어떻게 남기나요?',
      relatedTerms: ['Namespace', 'Shared Idea Registry', 'Supersession'],
    },
    {
      id: 'disposition', term: 'Owner Disposition', koreanName: '책임자의 처리 결정', pronunciation: '오너 디스퍼지션',
      meaning: '아이디어를 더 검토할지, 보류할지, 채택할지 책임자가 명시한 결정입니다.',
      example: '참여자가 계획으로 옮기자고 제안한 뒤, 책임자가 그 제안을 보류하기로 결정할 수 있습니다.',
      mechanism: '참여자의 제안은 의견 이력에 남습니다. 공식 상태는 해당 아이디어에 연결된 책임자의 명시적 결정에서 읽습니다. 실제 저장소의 작업 범위는 해당 저장소에서 확인합니다.',
      question: '참여자의 상태 제안과 공식 상태가 다를 때 어떤 기록이 공식 상태를 정하나요?',
      relatedTerms: ['Shared Idea Registry', 'Main Adoption', 'Effect Authorization'],
    },
    {
      id: 'namespace', term: 'Namespace', koreanName: '이름과 쓰기 범위를 나눈 영역', pronunciation: '네임스페이스',
      meaning: '같은 이름을 써도 담당 주체별로 구분하고 쓰기 범위를 식별할 수 있게 만든 영역입니다.',
      example: '두 저장소가 모두 현재 상태라는 이름을 쓰더라도 각자의 영역으로 구분합니다.',
      mechanism: '소속과 이름을 함께 검사합니다. 쓰기 권한은 영역 이름에 더해 실제 작성 주체와 권한 규칙을 확인해야 합니다.',
      question: '파일이 특정 참여자 영역에 있다는 사실만으로 작성자가 인증되나요?',
      relatedTerms: ['Permission', 'Producer-Owned Projection', 'Append-Only Contribution'],
    },
    {
      id: 'freshness-window', term: 'Freshness Window', koreanName: '최신성 인정 시간 범위', pronunciation: '프레시니스 윈도',
      meaning: '발행된 정보가 판단에 쓸 만큼 최근 것이라고 인정하는 시간 범위입니다.',
      example: '어제 만든 상태 요약을 오늘 읽을 때는 허용된 유효 기간과 실제 원천 판본을 함께 확인합니다.',
      mechanism: '발행 시각과 확인 시각의 차이를 허용 구간과 비교하고, 발행자 시계가 지나치게 앞서 있거나 원천 판본이 어긋난 경우를 따로 처리합니다.',
      question: '발행 시각은 최근이지만 원천 판본이 다르면 지금 상태의 증거가 될 수 있나요?',
      relatedTerms: ['Data Freshness', 'Staleness', 'Producer-Owned Projection'],
    },
  ]),
  ...termsFrom('knowledge', [
    {
      id: 'canonical-record', term: 'Canonical Record', koreanName: '정본 기록', pronunciation: '커내니컬 레코드',
      meaning: '해당 지식의 원문과 성립 조건, 근거, 정정 연결을 맡는 기준 기록입니다.',
      example: '목록에서 설계 이름을 찾은 뒤 정본을 열어 이유와 예외 조건을 읽습니다.',
      mechanism: '기록 식별자로 정본을 열고 해당 판본, 근거, 후속 정정을 확인합니다. 제품 적용 여부는 제품 쪽의 담당 기록에서 확인합니다.',
      question: '목록 설명과 정본의 적용 조건이 다르면 어떤 판본과 기록을 읽어야 하나요?',
      relatedTerms: ['Discovery Projection', 'Supersession', 'Source of Truth'],
    },
    {
      id: 'discovery-projection', term: 'Discovery Projection', koreanName: '검색용 파생 목록', pronunciation: '디스커버리 프로젝션',
      meaning: '원문을 빠르게 찾도록 제목, 단서, 식별자 등 필요한 부분만 뽑아 만든 목록입니다.',
      example: '책의 목차처럼 관련 항목을 찾아가게 해 줍니다. 판단에 필요한 세부 조건은 본문에서 봅니다.',
      mechanism: '정본으로부터 목록을 만들어 검색에 사용합니다. 후보가 나오면 같은 판본의 원문을 확인하고, 검색에 걸리지 않으면 원문 검색과 다른 검색어도 확인합니다.',
      question: '목록에서 찾지 못한 사실과 원문 기록이 없다는 주장은 어떻게 다른가요?',
      relatedTerms: ['Canonical Record', 'Source Locator', 'Catalog Generation'],
    },
    {
      id: 'source-locator', term: 'Source Locator', koreanName: '원문 위치 표지', pronunciation: '소스 로케이터',
      meaning: '정확한 원문과 판본을 찾도록 식별자, 위치, 내용 해시 등을 묶은 정보입니다.',
      example: '제목이 비슷한 두 문서 사이에서 정해진 판본의 원문을 고를 수 있게 해줍니다.',
      mechanism: '기록 식별자와 경로로 후보를 찾고, 같은 깃 판본에서 읽은 파일이 예상한 해시와 일치하는지 대조합니다.',
      question: '기록 제목과 경로는 같은데 파일 해시가 다르면 무엇을 더 확인해야 하나요?',
      relatedTerms: ['Exact Revision Pinning', 'File Hash', 'Discovery Projection'],
    },
    {
      id: 'catalog-generation', term: 'Catalog Generation', koreanName: '함께 검증하는 목록 한 판', pronunciation: '캐털로그 제너레이션',
      meaning: '같은 입력 판본으로 만든 목록 설명서와 목록 조각 전체를 한 판으로 묶은 단위입니다.',
      example: '여러 권으로 된 같은 판본의 백과사전을 묶음으로 확인하는 것과 같습니다.',
      mechanism: '대표 파일은 포함할 조각과 각 내용의 해시를 알려줍니다. 모든 조각을 같은 판본에서 읽고 개수, 소속, 해시를 대조합니다.',
      question: '목록 조각 하나가 다른 판에서 왔다면 검색 결과를 어떻게 다뤄야 하나요?',
      relatedTerms: ['Shard', 'Exact Revision Pinning', 'Discovery Projection'],
    },
    {
      id: 'shard', term: 'Shard', koreanName: '나눠 둔 데이터 조각', pronunciation: '샤드',
      meaning: '한 번에 전달하거나 읽는 크기를 제어하기 위해 나눈 자료의 한 부분입니다.',
      example: '큰 지식 목록을 여러 파일로 나누면 연결 도구가 각 파일을 정해진 크기 안에서 읽을 수 있습니다.',
      mechanism: '각 조각은 포함 항목과 자기 위치를 갖습니다. 읽는 쪽은 대표 목록을 기준으로 모든 조각의 누락, 중복, 순서를 검사합니다.',
      question: '첫 번째 조각을 읽어 찾지 못했다면 그 용어가 전체 목록에 없다고 할 수 있나요?',
      relatedTerms: ['Catalog Generation', 'Chunk', 'File Hash'],
    },
    {
      id: 'revision-pinning', term: 'Exact Revision Pinning', koreanName: '정확한 판본에 고정', pronunciation: '이그잭트 리비전 피닝',
      meaning: '관련 파일을 모두 동일하고 변경되지 않는 판본 식별자로 읽는 방식입니다.',
      example: '목록을 읽는 도중 기본 브랜치가 바뀌어도 원문은 처음에 고른 깃 커밋에서 가져옵니다.',
      mechanism: '먼저 깃 커밋의 고유 식별자를 확정하고 모든 목록, 조각, 원문 조회에 그 식별자를 재사용합니다.',
      question: '각 파일을 읽을 때마다 최신 브랜치 이름을 다시 확인하면 어떤 불일치가 생길 수 있나요?',
      relatedTerms: ['Commit', 'Source Locator', 'As-of'],
    },
    {
      id: 'content-addressing', term: 'Content Addressing', koreanName: '내용으로 식별하기', pronunciation: '콘텐트 어드레싱',
      meaning: '같은 내용이면 같은 키가 되도록 내용에서 계산한 해시로 기록을 식별하는 방식입니다.',
      example: '같은 기록을 다시 저장하려고 할 때 같은 키를 계산해서 이미 있는 내용을 알아봅니다.',
      mechanism: '규칙대로 만든 바이트에서 해시를 계산해 키를 만들고, 다시 읽은 내용에서도 해시가 같은지 확인합니다. 작성자 권한과 의미상 동등성은 별도로 판단합니다.',
      question: '같은 뜻을 다른 문장으로 쓰면 언제 같은 키가 되고 언제 다른 키가 되나요?',
      relatedTerms: ['File Hash', 'Dedup Identity', 'Append-Only Contribution'],
    },
    {
      id: 'as-of', term: 'As-of', koreanName: '기준 시점 당시', pronunciation: '애즈 오브',
      meaning: '지정한 시점까지 무엇이 유효했거나 누가 무엇을 알 수 있었는지 따져 보는 기준입니다.',
      example: '월요일 사건이 수요일에 처음 기록됐다면 화요일에 그 기록을 확인할 수 있었는지 따로 물어야 합니다.',
      mechanism: '발생, 공개, 관측, 결정, 기록 시간 중 질문에 맞는 시간을 골라 기준 시점과 비교합니다. 확인할 수 없는 시간은 미확인으로 남깁니다.',
      question: '사건 발생일과 기록 작성일만으로 특정 사람이 언제 알았는지 판단할 수 있나요?',
      relatedTerms: ['Event Time', 'As-of Timestamp', 'Point-in-Time Data'],
    },
    {
      id: 'supersession', term: 'Supersession', koreanName: '후속 기록으로 대체', pronunciation: '수퍼세션',
      meaning: '새 기록이 이전 기록의 어떤 결론을 대신하는지 관계를 명시하는 방식입니다.',
      example: '바뀐 설계 기준은 새 문서로 정하고, 옛 문서는 과거 판단의 근거로 남깁니다.',
      mechanism: '어떤 기록을 어느 범위에서 대체하는지 연결합니다. 현재 기준을 볼 때는 후속 기록을, 당시 판단을 볼 때는 기준 시점에 맞는 판본을 엽니다.',
      question: '후속 문서가 일부 조건만 바꿨다면 나머지 조건을 어디서 확인하나요?',
      relatedTerms: ['Canonical Record', 'As-of', 'Decision Record'],
    },
    {
      id: 'consumer-receipt', term: 'Consumer Receipt', koreanName: '읽은 곳의 확인 기록', pronunciation: '컨슈머 리시트',
      meaning: '자료를 사용한 사람이 어떤 판본을 어느 단계까지 확인하거나 적용했는지 남긴 기록입니다.',
      example: '한 팀이 설계안을 올린 뒤 다른 팀이 실제로 읽었는지는 읽은 팀의 확인 기록으로 판단합니다.',
      mechanism: '자료의 판본과 함께 발행, 열람, 확인, 적용, 검증 중 증거가 있는 단계를 따로 기록합니다. 단계마다 필요한 증거가 다릅니다.',
      question: '자료를 읽었다는 확인과 그 자료를 사용해 제품을 검증했다는 확인에는 각각 무엇이 필요한가요?',
      relatedTerms: ['Canonical Record', 'Exact Revision Pinning', 'Main Adoption'],
    },
  ]),
  ...termsFrom('main', [
    {
      id: 'task-graph', term: 'Durable Task Graph', koreanName: '지속되는 작업 관계도', pronunciation: '듀러블 태스크 그래프',
      meaning: '대화가 끝난 뒤에도 할 일의 상태, 근거, 대체 기록, 다시 시작할 조건을 확인할 수 있는 구조입니다.',
      example: '새 작업자가 첫날에도 이전 결정과 남은 작업을 문서 연결로 따라갈 수 있습니다.',
      mechanism: '각 작업에 고유 식별자를 주고 담당 근거와 상태, 선행 작업, 후속 결정, 재진입 조건을 연결합니다.',
      question: '한 작업이 보류되었다면 다시 시작할 조건을 어느 기록에서 찾나요?',
      relatedTerms: ['Reentry', 'Current State Pointer', 'Supersession'],
    },
    {
      id: 'current-state-pointer', term: 'Current State Pointer', koreanName: '현재 상태를 찾는 기준 표지', pronunciation: '커런트 스테이트 포인터',
      meaning: '현재 무엇을 확인해야 하는지 알려 주고 근거가 있는 다음 문서로 연결하는 진입점입니다.',
      example: '새 세션에서 오래된 인계문을 반복하기 전에 현재 상태 표지와 이어진 작업 기록을 확인합니다.',
      mechanism: '상태 표지의 기준 판본과 연결 근거를 지금의 깃 상태, 순서가 바뀐 결정, 담당 기록과 대조합니다.',
      question: '상태 표지와 새 작업 근거가 충돌하면 어느 판본과 연결 자료부터 대조하나요?',
      relatedTerms: ['Current Truth', 'Durable Task Graph', 'Source Locator'],
    },
    {
      id: 'reentry', term: 'Reentry', koreanName: '작업 재진입', pronunciation: '리엔트리',
      meaning: '중단·보류된 작업을 다시 검토할 조건과 현재 자료를 확인해 이어가는 절차입니다.',
      example: '외부 확인을 기다리던 작업은 답변이 왔는지와 기존 작업 범위가 여전히 유효한지 다시 봅니다.',
      mechanism: '남은 의무, 시작 조건, 가장 최근 근거, 대체된 결정, 현재 작업 권한을 조회한 뒤 가능한 범위를 정합니다.',
      question: '예전 작업이 보류였고 새 자료가 생겼다면 재개 전에 어떤 조건을 대조하나요?',
      relatedTerms: ['Durable Task Graph', 'Open Obligation', 'Effect Authorization'],
    },
    {
      id: 'effect-authorization', term: 'Effect Authorization', koreanName: '영향 범위에 대한 승인', pronunciation: '이펙트 오써러제이션',
      meaning: '작업이 바꿔도 되는 대상과 허용되는 효과를 명시한 승인입니다.',
      example: '같은 기능의 설계 검토와 기능 활성화는 영향을 받는 대상이 달라 승인 범위를 각각 확인합니다.',
      mechanism: '대상, 실제로 변하는 상태, 범위, 시간, 허용 조건을 명시하고 실제 작업과 대조합니다. 범위를 바꾸는 단계에서는 해당 승인을 확인합니다.',
      question: '문서 검토에 대한 승인에서 제품 동작 변경의 권한도 확인할 수 있나요?',
      relatedTerms: ['Boundary', 'Runtime Authority', 'Activation'],
    },
    {
      id: 'workpack', term: 'Workpack', koreanName: '단위 작업 묶음', pronunciation: '워크팩',
      meaning: '하나의 승인 범위에서 목적, 구현, 검증, 결과 근거를 함께 추적하는 작업 단위입니다.',
      example: '규칙 한 가지를 검토할 때 대상, 변경 이유, 확인한 시험, 남은 위험을 한 묶음에서 볼 수 있습니다.',
      mechanism: '작업 범위와 기준 판본을 잡고, 그 안에 필요한 실행과 검증을 연결한 뒤 결과 근거 및 남은 책임을 기록합니다.',
      question: '작업 중 예상보다 넓은 변경이 필요해지면 기존 작업 묶음에서 먼저 무엇을 확인하나요?',
      relatedTerms: ['Effect Authorization', 'Acceptance Criteria', 'Provenance Trace'],
    },
    {
      id: 'serial-integration', term: 'Serial Integration', koreanName: '본선 변경을 한 건씩 통합', pronunciation: '시리얼 인티그레이션',
      meaning: '변경 후보는 각자 준비하되 공동 기준을 바꾸는 반영은 순서를 정해 하나씩 하는 방식입니다.',
      example: '첫 번째 변경을 본선에 반영한 뒤 두 번째 후보가 새 기준에서도 맞는지 다시 검토합니다.',
      mechanism: '반영 담당자가 현재 본선과 변경 후보의 기준 판본을 대조합니다. 한 건을 검토해 반영한 뒤 다음 후보는 바뀐 본선을 기준으로 확인합니다.',
      question: '서로 다른 작업자가 변경을 따로 끝내도 본선에 동시에 반영하면 무엇이 꼬일 수 있나요?',
      relatedTerms: ['Worktree Isolation', 'Compatibility Test', 'Main Adoption'],
    },
    {
      id: 'main-adoption', term: 'Main Adoption', koreanName: '본선 정식 채택', pronunciation: '메인 어답션',
      meaning: '본선 책임 주체가 외부에서 온 변경 후보를 자기 시스템에서 사용하기로 명시적으로 결정하는 단계입니다.',
      example: '파운드리 평가 자료가 전달되고 호환성 확인을 거친 뒤 본선에서 채택 여부를 결정합니다.',
      mechanism: '반환물과 연결 계약, 호환성 근거를 읽고 본선에 어떤 범위로 채택할지 기록합니다. 실제 활성화는 적용 조건과 권한을 따로 확인합니다.',
      question: '호환성 검사를 통과한 후보가 본선의 정식 채택을 받았는지는 어디서 확인하나요?',
      relatedTerms: ['Integration Return', 'Compatibility Test', 'Activation'],
    },
    {
      id: 'activation', term: 'Activation', koreanName: '실제 사용 활성화', pronunciation: '액티베이션',
      meaning: '준비되거나 채택된 기능을 정해진 환경에서 실제 사용하도록 켜는 단계입니다.',
      example: '본선이 후보를 채택한 뒤에도 사용할 환경과 시작 조건을 확인하는 단계가 남을 수 있습니다.',
      mechanism: '채택 근거와 실제 실행 권한, 대상 환경, 적용 조건을 확인하고 활성화 후의 실제 상태를 관측합니다.',
      question: '채택됐다는 기록과 기능이 실제로 사용 중이라는 기록의 근거는 무엇이 다른가요?',
      relatedTerms: ['Main Adoption', 'Runtime Authority', 'Effect Authorization'],
    },
    {
      id: 'open-obligation', term: 'Open Obligation', koreanName: '아직 이행할 의무', pronunciation: '오픈 아블러게이션',
      meaning: '작업이나 관측이 끊겨도 여전히 누군가 완료해야 하는 확인·정리·복구 책임입니다.',
      example: '작업 세션이 종료되어도 검증 결과를 확인하지 못했다면 다음 작업자가 이어서 확인해야 합니다.',
      mechanism: '원래 의무의 식별자, 담당자, 발생 원인, 남은 증거와 종료 조건을 보존합니다. 재개할 때 먼저 그 의무가 이미 해결됐는지 확인합니다.',
      question: '새 세션이 시작된 사실만으로 기존 확인 의무가 끝났다고 할 수 있나요?',
      relatedTerms: ['Reentry', 'Durable Task Graph', 'Reconciliation'],
    },
  ]),
]
