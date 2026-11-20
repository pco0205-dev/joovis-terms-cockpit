import type { IntentFamily } from './instructionIntents'

export const instructionStudyFamilies = [
  {
    id: 'deliverable', domain: '지시', level: '기초',
    label: '목표 · 결과물 · 완료 기준',
    cues: ['결과물', '산출물', '원하는결과', '끝났는지', '완료조건'],
    question: '무엇을 이루고, 무엇을 받고, 어떤 조건을 만족하면 끝난 걸까요?',
    choices: [
      { label: '목표', meaning: '일을 통해 만들고 싶은 변화다.', instruction: '이번 작업으로 바꾸고 싶은 상태를 한 문장으로 먼저 정리해줘.' },
      { label: '결과물', meaning: '작업 뒤 실제로 받을 문서, 코드, 표, 화면이다.', instruction: '확인할 수 있도록 요청한 형태로 결과물을 제출해줘.' },
      { label: '완료 판정', meaning: '결과가 기대한 일을 하는지 관찰 가능한 조건으로 확인한다.', instruction: '완료 조건을 하나씩 대조하고, 확인 방법과 결과를 적어줘.' },
    ],
    relatedTerms: ['Output Contract', 'Artifact', 'Acceptance Criteria'],
    example: {
      original: '쓸 만하게 정리해줘.',
      instruction: '새 팀원이 헤매지 않게 파일별 역할을 한 페이지 표로 정리해줘. 예시 작업의 시작 파일을 표에서 찾을 수 있으면 완료야.',
    },
  },
  {
    id: 'allowed-action', domain: '지시', level: '실무',
    label: '읽기 · 제안 · 실행 허용',
    cues: ['변경없이', '보기만', '제안만', '실행해', '모의실행'],
    question: '상태만 알아볼까요, 바꿀 방법을 낼까요, 실제로 바꿔도 될까요?',
    choices: [
      { label: '읽기 전용', meaning: '현재 자료와 상태를 읽고 설명하는 선에서 멈춘다.', instruction: '자료를 읽고 확인한 내용만 알려줘. 상태가 바뀌는 조작은 하지 마.' },
      { label: '변경 제안', meaning: '바꿀 방법을 제시하고 실제 적용은 보류한다.', instruction: '바꿀 위치, 예상 효과, 위험을 제안하고 적용 전 상태에서 멈춰줘.' },
      { label: '실행 허용', meaning: '합의한 대상과 행동에 한해 상태를 바꿀 수 있게 한다.', instruction: '허용한 변경만 실행하고 실제로 바뀐 범위와 확인 결과를 알려줘.' },
    ],
    relatedTerms: ['Read-only Mode', 'Dry Run', 'Effect Authorization'],
    example: {
      original: '확인하고 괜찮아 보이면 진행해.',
      instruction: '학습 메뉴만 바꿔도 돼. 저장 기능과 배포 설정은 읽기 전용으로 보고, 거기까지 바꿔야 하면 변경 제안에서 멈춰줘.',
    },
  },
  {
    id: 'assumptions', domain: '지시', level: '심화',
    label: '전제 · 가정 · 불변 조건',
    cues: ['전제', '가정', '불변', '항상유지', '성립조건'],
    question: '먼저 충족될 것, 아직 사실인지 모르는 것, 변경 뒤에도 유지할 것을 구분했나요?',
    choices: [
      { label: '전제 조건', meaning: '작업이나 결론이 성립하려면 먼저 충족돼야 하는 조건이다.', instruction: '이 작업이 성립하려면 어떤 조건을 먼저 만족해야 하는지 확인해줘.' },
      { label: '가정', meaning: '확정할 수 없어 임시로 참이라고 놓는 내용이다.', instruction: '어떤 가정을 썼는지 밝히고, 가정이 틀리면 무엇이 달라지는지 알려줘.' },
      { label: '불변 조건', meaning: '허용된 변경이나 재실행을 거쳐도 지켜야 하는 규칙이다.', instruction: '변경 전후와 재실행 뒤에 항상 유지돼야 할 조건을 확인해줘.' },
    ],
    relatedTerms: ['Assumption', 'Constraint', 'Invariant'],
    example: {
      original: '이대로 이전해도 괜찮겠지?',
      instruction: '이전 전에 기존 데이터를 읽을 수 있는지 확인해줘. 새 구조가 필요한 값을 모두 담는다는 가정은 예시로 시험하고, 사용자별 기록 수는 이전 전후 같아야 해.',
    },
  },
  {
    id: 'receipt', domain: '지시', level: '심화',
    label: '공유 · 수령 확인 · 반영 증거',
    cues: ['수령', '받았는지', '공유했', '실제쓰', '반영증거', '확인기록'],
    question: '올린 사실, 상대가 본 사실, 실제로 쓰인 사실 중 무엇을 확인하려나요?',
    choices: [
      { label: '공유', meaning: '찾아볼 수 있게 자료를 올리고 위치를 알린다.', instruction: '공유한 자료의 위치와 정확한 판본을 알려줘.' },
      { label: '수령 확인', meaning: '받는 쪽이 어떤 판본을 실제로 보았는지 확인한다.', instruction: '받는 쪽이 확인한 자료와 판본을 알려줘. 증거가 없으면 미확인으로 남겨줘.' },
      { label: '반영 증거', meaning: '자료가 판단이나 변경에 실제로 쓰였음을 결과에서 확인한다.', instruction: '자료가 쓰인 변경이나 판단을 찾고, 반영과 검증 결과를 구분해줘.' },
    ],
    relatedTerms: ['Consumer Receipt', 'Exact Revision Pinning', 'Main Adoption', 'Validation'],
    example: {
      original: '공유했으니까 이제 다 적용됐지?',
      instruction: '공유한 판본, 받는 팀이 본 판본, 실제 변경에 쓰인 판본을 각각 확인해줘. 마지막 단계가 미확인이면 어떤 근거가 더 필요한지 알려줘.',
    },
  },
  {
    id: 'handoff', domain: '지시', level: '심화',
    label: '인계 · 남은 의무 · 재진입',
    cues: ['인계', '재진입', '이어받', '남은의무', '다시시작', '다음작업자'],
    question: '다음 사람에게 넘길 것, 남은 일, 다시 시작할 조건은 무엇인가요?',
    choices: [
      { label: '인계', meaning: '판단 근거, 끝낸 일, 다음 작업에 필요한 자료를 넘긴다.', instruction: '다음 작업자가 이어갈 수 있게 완료 결과, 근거 위치, 다음 선택지를 정리해줘.' },
      { label: '남은 의무', meaning: '작업 시간이 끝나도 확인하거나 처리할 책임이 남은 일이다.', instruction: '미완료 항목과 담당자, 완료 조건을 적어줘.' },
      { label: '재진입', meaning: '보류했던 일을 이어가기 전에 자료와 시작 조건을 다시 확인한다.', instruction: '지금 판본에서 재개 조건과 이미 끝난 일을 확인하고 다음 작업을 정리해줘.' },
    ],
    relatedTerms: ['Handoff', 'Open Obligation', 'Reentry'],
    example: {
      original: '나중에 이어서 하게 정리해줘.',
      instruction: '검증한 작업과 아직 안 한 확인을 나눠 인계해줘. 다시 시작할 때 최신 판본과 파일 중 무엇을 먼저 봐야 하는지도 적어줘.',
    },
  },
  {
    id: 'data-flow', domain: '개발', level: '기초',
    label: '입력 · 상태 · 출력',
    cues: ['입력', '상태값', '출력', '결과값', '데이터흐름'],
    question: '들어오는 값, 처리 중 기억하는 값, 밖으로 내보내는 값을 나눌 수 있나요?',
    choices: [
      { label: '입력', meaning: '동작을 시작할 때 받아 처리하는 자료나 신호다.', instruction: '이 기능에 들어오는 정상 입력과 잘못된 입력을 예로 들어줘.' },
      { label: '상태', meaning: '다음 동작에 영향을 주는 현재 값이다.', instruction: '어떤 행동이 현재 값을 바꾸고 그 값이 언제까지 유지되는지 설명해줘.' },
      { label: '출력', meaning: '처리한 뒤 화면이나 다른 기능으로 내보내는 결과다.', instruction: '정상 결과와 오류 결과가 어디로 어떤 모양으로 나가는지 구분해줘.' },
    ],
    relatedTerms: ['State', 'Transition', 'Interface'],
    example: {
      original: '검색이 어떻게 돌아가?',
      instruction: '검색창의 글을 입력, 현재 검색어와 분야를 상태, 표시되는 카드 목록을 출력으로 설명해줘. 검색어가 비어 있을 때도 포함해줘.',
    },
  },
  {
    id: 'compatibility', domain: '개발', level: '심화',
    label: '변경 차이 · 호환성 · 롤백',
    cues: ['호환성', '이전버전', '되돌리', '롤백', '변경차이', '구버전'],
    question: '바뀐 점, 이전 사용 방식의 유지, 이전 상태로 돌아갈 방법 중 무엇이 필요한가요?',
    choices: [
      { label: '변경 차이', meaning: '기준 판본과 바꾼 판본 사이에서 달라진 내용이다.', instruction: '기준 판본과 비교해 동작이나 자료에 영향을 준 변경을 적어줘.' },
      { label: '호환성', meaning: '새 방식이 기존 자료나 사용 방법을 계속 받아들이는 성질이다.', instruction: '예전 자료와 사용 방식이 새 버전에서도 동작하는지 시험해줘.' },
      { label: '롤백', meaning: '문제 발생 시 검증된 이전 상태로 되돌리는 절차다.', instruction: '되돌릴 기준 판본과 복구 뒤 확인할 조건을 적어줘.' },
    ],
    relatedTerms: ['Diff', 'Backward Compatibility', 'Rollback'],
    example: {
      original: '업데이트해도 예전 사용자 괜찮지?',
      instruction: '이전 버전에서 저장한 표현을 새 버전으로 읽을 수 있는지 검증해줘. 실패했을 때 되돌릴 기준도 알려줘.',
    },
  },
  {
    id: 'recovery', domain: '개발', level: '심화',
    label: '재시도 · 멱등성 · 기록 대조',
    cues: ['재시도', '멱등', '중복처리', '두번실행', '기록대조'],
    question: '다시 할 조건, 중복 결과를 막을 규칙, 맞춰 볼 기록을 정했나요?',
    choices: [
      { label: '재시도', meaning: '조건이 달라지면 성공할 수 있는 일시적 실패를 다시 시도한다.', instruction: '다시 할 수 있는 실패와 멈춰야 할 실패를 나누고 시도 한도를 정해줘.' },
      { label: '멱등성', meaning: '같은 요청이 반복돼도 한 번 처리한 것과 효과가 같은 성질이다.', instruction: '같은 요청을 반복해도 결과가 중복해서 생기지 않는지 시험해줘.' },
      { label: '기록 대조', meaning: '서로 다른 곳에 남은 상태나 수량을 비교해 불일치를 찾는다.', instruction: '두 기록을 같은 식별자와 기준 시점으로 비교하고 다른 항목만 알려줘.' },
    ],
    relatedTerms: ['Retry', 'Idempotency', 'Reconciliation'],
    example: {
      original: '저장 실패 같은데 다시 눌러도 돼?',
      instruction: '먼저 첫 요청이 실제 기록에 반영됐는지 확인해줘. 재시도하면 같은 값이 두 번 저장되지 않는지도 시험해줘.',
    },
  },
  {
    id: 'execution-boundary', domain: '개발', level: '심화',
    label: '실행 권한 · 격리 · 영향 없는 관측',
    cues: ['실행권한', '격리', '샌드박스', '운영영향', '영향없는', '관측모드'],
    question: '무엇을 실행할 수 있고, 어디서 시험하며, 결과가 어디까지 영향을 주나요?',
    choices: [
      { label: '실행 권한', meaning: '특정 행동이 실제 상태를 바꿔도 된다는 확인된 허용 범위다.', instruction: '상태를 바꾸는 행동에 현재 필요한 권한과 허용 조건을 확인해줘.' },
      { label: '실행 격리', meaning: '시험 중 생기는 변화가 원래 환경으로 번지지 않게 나눈다.', instruction: '시험 환경을 분리하고 원래 환경을 바꿀 수 있는 경로가 있는지 확인해줘.' },
      { label: '영향 없는 관측', meaning: '결과를 비교하되 실제 운영 판단이나 상태로 되돌려 보내지 않는다.', instruction: '관측 결과만 남기고 실제 운영에 반영되는 경로가 닫혀 있는지 검증해줘.' },
    ],
    relatedTerms: ['Runtime Authority', 'Sandbox', 'Non-Influencing Shadow'],
    example: {
      original: '새 흐름을 넣어서 한번 봐줘.',
      instruction: '새 흐름을 별도 시험 환경에서 실행해 기록만 남겨줘. 그 결과가 기존 화면과 저장 상태를 바꾸는 경로가 없는지 확인해줘.',
    },
  },
  {
    id: 'meaning', domain: '연구', level: '기초',
    label: '정의 · 용례 · 맥락',
    cues: ['정의', '용례', '맥락', '무슨뜻', '어떻게쓰', '뜻풀이', '어휘'],
    question: '말의 뜻, 실제 사용 예, 문장 안에서 왜 쓰였는지 중 무엇이 궁금한가요?',
    choices: [
      { label: '정의', meaning: '다른 말과 구분할 수 있게 뜻의 범위를 정한 설명이다.', instruction: '이 말의 핵심 뜻과 비슷한 말의 차이를 한 문장씩 알려줘.' },
      { label: '용례', meaning: '말이나 문서에서 단어가 실제로 사용된 예다.', instruction: '이 말이 자연스럽게 쓰이는 문장과 어색하게 쓰이는 문장을 비교해줘.' },
      { label: '맥락', meaning: '앞뒤 내용과 사용 상황이 단어의 뜻에 주는 정보다.', instruction: '앞뒤 문장을 읽고 이 말이 어떤 상황과 목적에 쓰였는지 설명해줘.' },
    ],
    relatedTerms: ['Context', 'Source of Truth', 'Reference Text Grounding'],
    example: {
      original: '여기 나온 말을 풀어줘.',
      instruction: '문서에서 ‘기준 시점’이 무엇을 뜻하는지 정의해줘. 현재 상태를 볼 때와 과거 판단을 다시 볼 때 쓰는 예를 하나씩 보여줘.',
    },
  },
  {
    id: 'measurement', domain: '연구', level: '실무',
    label: '지표 · 단위 · 표본',
    cues: ['지표', '단위', '표본', '어떻게잴', '대표성'],
    question: '무엇을 수치로 나타내고, 어떤 단위로 세고, 어떤 사례를 관찰할까요?',
    choices: [
      { label: '지표', meaning: '보고 싶은 성질을 비교 가능한 값으로 나타낸 것이다.', instruction: '목표가 나아졌는지 알 수 있는 지표와 계산법을 정해줘.' },
      { label: '측정 단위', meaning: '값을 같은 기준으로 셀 수 있게 정한 눈금이다.', instruction: '비교하는 수치의 단위와 기간을 통일해줘.' },
      { label: '표본', meaning: '전체를 대신해 관찰 대상으로 고른 사례의 일부다.', instruction: '사례를 고르는 기준과 그 표본이 대표하지 못하는 범위를 설명해줘.' },
    ],
    relatedTerms: ['Metric', 'Benchmark', 'Eval Dataset'],
    example: {
      original: '새 화면이 빨라졌는지 비교해줘.',
      instruction: '첫 카드에 도착하기까지 걸린 시간을 초 단위로 비교해줘. 처음 앱을 여는 사용자와 이미 익숙한 사용자는 나눠서 봐줘.',
    },
  },
  {
    id: 'quotation', domain: '연구', level: '실무',
    label: '인용 · 요약 · 해석',
    cues: ['인용', '요약', '해석', '원문그대로', '핵심만'],
    question: '출처의 말 그대로 보여줄까요, 핵심을 줄일까요, 읽는 쪽이 파악한 뜻을 설명할까요?',
    choices: [
      { label: '인용', meaning: '출처의 말을 그대로 가져오고 위치를 표시한다.', instruction: '핵심 표현을 짧게 직접 인용하고 어디서 읽었는지 알려줘.' },
      { label: '요약', meaning: '원문의 핵심 주장과 단서를 유지하면서 줄여 쓴다.', instruction: '결론과 주요 예외 조건을 유지하며 핵심만 바꿔 써줘.' },
      { label: '해석', meaning: '읽는 사람이 원문을 바탕으로 파악한 뜻이나 원인이다.', instruction: '원문이 실제로 말한 내용과 거기서 해석한 뜻을 따로 적어줘.' },
    ],
    relatedTerms: ['Provenance', 'Evidence Request', 'Reference Text Grounding'],
    example: {
      original: '문서가 무슨 결론인지 정리해줘.',
      instruction: '저자가 직접 내린 결론을 요약해줘. 그 결론이 이번 사례에도 적용된다는 판단은 해석으로 표시하고 적용 조건을 적어줘.',
    },
  },
  {
    id: 'causality', domain: '연구', level: '심화',
    label: '상관 · 교란 요인 · 인과',
    cues: ['인과', '상관', '교란', '원인이라고', '우연인지'],
    question: '두 일이 같이 움직였나요, 다른 조건이 영향을 줬나요, 한쪽이 실제 원인인가요?',
    choices: [
      { label: '상관', meaning: '두 현상이 서로 관련된 방향으로 움직이는 경향이다.', instruction: '두 값의 변동에 관계가 있었는지 확인하고 원인에 관한 주장은 구분해줘.' },
      { label: '교란 요인', meaning: '비교 조건과 결과 모두에 영향을 줘 실제 관계를 흐리는 다른 요인이다.', instruction: '조건을 선택하는 데도 영향을 주고 결과도 바꿀 수 있는 요인을 찾아줘.' },
      { label: '인과', meaning: '어떤 조건을 바꾸면 그 결과가 달라지는 관계다.', instruction: '다른 설명을 가려내고 원인이라고 판단하는 데 필요한 추가 관찰을 적어줘.' },
    ],
    relatedTerms: ['Correlation', 'Counterexample', 'Base Rate'],
    example: {
      original: '화면 바꾸고 복습이 늘었으니 화면 덕분이지?',
      instruction: '화면 변경과 복습 증가가 같이 나타났는지 먼저 확인해줘. 신규 사용자 비율 등 두 시기의 다른 조건을 검토하고 인과 판단에 필요한 비교를 제안해줘.',
    },
  },
  {
    id: 'event-timing', domain: '연구', level: '심화',
    label: '발생 시점 · 관측 시점 · 기록 시점',
    cues: ['발생시점', '관측시점', '기록시점', '기준시점', '당시알', '시간기준'],
    question: '일이 언제 일어났고, 언제 확인됐고, 언제 문서에 남았나요?',
    choices: [
      { label: '발생 시점', meaning: '사건이나 상태 변화가 실제로 일어난 때다.', instruction: '사건이 실제로 일어난 때를 확인하고 추정이면 구분해서 적어줘.' },
      { label: '관측 시점', meaning: '특정 주체가 사건이나 결과를 실제로 확인한 때다.', instruction: '누가 언제 무엇을 확인했는지, 당시 몰랐던 내용과 나눠 적어줘.' },
      { label: '기록 시점', meaning: '관찰하거나 전해 들은 내용을 문서에 남긴 때다.', instruction: '작성 시각을 따로 표시하고 사건이나 관측 시각과 구분해줘.' },
    ],
    relatedTerms: ['Event Time', 'As-of', 'As-of Timestamp'],
    example: {
      original: '그때도 이 사실을 알고 있었지?',
      instruction: '문제가 일어난 때, 담당자가 처음 확인한 때, 보고서를 쓴 때를 나눠줘. 그날 판단을 살필 땐 당시 확인할 수 있었던 자료만 써줘.',
    },
  },
  {
    id: 'revision-source', domain: '연구', level: '심화',
    label: '정본 · 파생 목록 · 대체 기록',
    cues: ['정본', '파생목록', '판본', '대체기록', '원문위치', '후속정정'],
    question: '기준 원문을 보나요, 찾아가기 위한 목록을 보나요, 어떤 결론이 바뀌었는지 보나요?',
    choices: [
      { label: '정본', meaning: '판단과 적용 조건의 기준으로 삼는 원문 기록이다.', instruction: '기준으로 삼을 정본과 정확한 판본을 열어 뜻과 예외를 확인해줘.' },
      { label: '파생 목록', meaning: '원문을 빨리 찾으려고 제목과 단서를 모은 목록이다.', instruction: '목록으로 후보를 찾고, 같은 판본의 원문을 열어 대조해줘.' },
      { label: '대체 기록', meaning: '이전 결론의 어느 부분을 후속 기록이 대신하는지 밝힌 기록이다.', instruction: '어느 결론이 바뀌었고 무엇이 여전히 유효한지 기록 연결을 확인해줘.' },
    ],
    relatedTerms: ['Canonical Record', 'Discovery Projection', 'Supersession', 'Exact Revision Pinning'],
    example: {
      original: '목록에 없으니까 그 결정은 없었던 거지?',
      instruction: '목록 검색에서 못 찾은 경우와 원문 기록이 없는 경우를 구분해줘. 가능한 정본과 후속 정정을 찾아 해당 판본에서 결정 여부를 확인해줘.',
    },
  },
] satisfies IntentFamily[]
