import type { DevTerm } from './types'

type DepthInput = Pick<
  DevTerm,
  | 'term'
  | 'deck'
  | 'category'
  | 'koreanMeaning'
  | 'simpleMeaning'
  | 'checkQuestion'
  | 'relatedTerms'
>

type DepthProfile = {
  spatialModel: string
  why: string
  failure: string
  mechanism: string
  workflow: string
  usage: string
  pitfall: string
}

const deckProfiles: Record<DevTerm['deck'], DepthProfile> = {
  'ai-command': {
    spatialModel:
      'AI의 작업 공간에서 목표, 자료, 금지 경계, 출력 기준이 서로 다른 칸을 차지한다고 상상하면 위치가 잡힙니다.',
    why: 'AI가 채워야 할 빈칸과 멈춰야 할 지점을 줄여 결과를 검증하기 쉽게 만듭니다.',
    failure: '모델이 평균적인 답을 만들기 위해 누락된 조건을 스스로 추측하고, 그 추측이 사실처럼 이어질 수 있습니다.',
    mechanism:
      '지시와 자료가 context 안에서 우선순위와 관계를 만들고, 모델은 그 조건에 맞는 다음 행동이나 출력을 선택합니다.',
    workflow:
      '목표를 한 문장으로 고정한 뒤 입력 자료, 허용 범위, 금지 범위, 출력 형식, 검증 기준을 차례로 배치합니다.',
    usage: 'AI에게 작업을 맡기기 전과 결과를 검토할 때 판단 기준으로 사용합니다.',
    pitfall: '전문용어를 프롬프트에 넣는 것 자체보다 그 용어가 통제할 입력, 행동, 출력과 중단 조건을 써야 합니다.',
  },
  development: {
    spatialModel:
      '입력이 들어오는 지점, 상태가 바뀌는 지점, 결과가 나가는 지점 사이에서 이 개념이 어느 위치를 담당하는지 그려보면 이해가 빨라집니다.',
    why: '버그의 원인 위치와 변경 영향 범위를 좁혀 작은 수정과 재현 가능한 검증을 가능하게 합니다.',
    failure: '겉으로 보이는 증상만 고치고 실제 상태 변화, 의존성, 실패 경로를 남길 수 있습니다.',
    mechanism:
      '프로그램은 입력을 구조로 읽고 상태를 바꾸며 결과나 오류를 냅니다. 이 개념은 그 흐름의 한 책임과 규칙을 분리합니다.',
    workflow:
      '재현 조건을 만든 뒤 입력, 제어 흐름, 상태 변화, 출력, 오류 경로를 따라가고 가장 작은 수정으로 검증합니다.',
    usage: '설계, 구현, 디버깅, 코드 리뷰에서 입력과 출력 사이의 책임을 정확히 말할 때 사용합니다.',
    pitfall: '정의만 외우고 실제 코드에서 어느 파일·함수·상태가 그 역할을 하는지 찾지 않으면 지식이 연결되지 않습니다.',
  },
  'libraries-tools': {
    spatialModel:
      '소스 작성, 타입 검사, 빌드, 실행, 브라우저 표시, 품질 검사로 이어지는 작업대에서 이 도구가 끼어드는 칸을 찾으면 됩니다.',
    why: '문제에 맞는 도구를 선택하고 오류가 설정, 빌드, 런타임, 데이터 중 어디서 생겼는지 구분하게 합니다.',
    failure: '설치 여부와 명령 이름만 알고 내부 역할을 몰라 버전 충돌이나 설정 오류를 전부 도구 탓으로 돌릴 수 있습니다.',
    mechanism:
      '도구는 입력 파일이나 데이터를 받아 정해진 변환·검사·실행을 수행하고 산출물, 화면, 진단 결과 중 하나를 냅니다.',
    workflow:
      '공식 역할과 프로젝트 안의 사용 위치를 확인하고, 입력 설정과 버전을 본 뒤 실제 산출물이나 실행 결과로 효과를 검증합니다.',
    usage: '새 도구를 선택하거나 빌드·실행·품질 문제의 책임 구간을 좁힐 때 사용합니다.',
    pitfall: '이름이 비슷한 도구도 실행 시점과 책임이 다릅니다. 설치 도구, 빌드 도구, 런타임, 라이브러리를 구분해야 합니다.',
  },
  'joovis-architecture': {
    spatialModel:
      '관제실 지도에서 현재 진실, 변경 경계, 검증 대기, 인수인계, 복구 지점 중 이 개념이 어느 구역을 관리하는지 보면 됩니다.',
    why: '작업자의 기억이 아니라 외부에 남은 상태와 판정 기준으로 다음 작업이 이어지게 합니다.',
    failure: '현재 상태와 계획, 사실과 추정, 완료와 미검증이 섞여 다음 작업자가 같은 판단을 재현하기 어렵습니다.',
    mechanism:
      '현재 상태를 구조화해 저장하고 변경 가능한 경계를 잠근 뒤, 검증 결과와 다음 행동을 별도 전달 단위로 이어 붙입니다.',
    workflow:
      'Current Truth를 읽고 경계를 확인한 뒤 변경을 실행합니다. Review Gate를 통과한 결과만 다음 상태와 handoff에 반영합니다.',
    usage: '긴 작업의 상태, 책임, 검토, 인수인계를 같은 언어로 통제할 때 사용합니다.',
    pitfall: '이름을 붙이는 것만으로 구조가 생기지 않습니다. 실제 파일, 상태 필드, 판정 규칙, 소유자를 함께 지정해야 합니다.',
  },
  'dispute-integration': {
    spatialModel:
      '원본 보관함, 검토 대기함, 쟁점 연결표, 인용 가능 구역, 민감정보 제한 구역 중 어디에 놓이는 정보인지 구분하면 됩니다.',
    why: '자료 자체와 사람의 해석을 분리하고, 출처·원본성·인용 가능성·민감정보 위험을 나중에도 다시 확인하게 합니다.',
    failure: '중요해 보인다는 감상만 남아 원본대조 여부, 주장과의 연결, 직접인용 가능성을 재현할 수 없습니다.',
    mechanism:
      '자료를 고유 항목으로 등록하고 원본과 파생본, 사실과 주장, 직접인용과 요약, 공개 가능 정보와 민감정보를 별도 필드로 관리합니다.',
    workflow:
      '원본을 보존하고 식별값을 부여한 뒤 출처, 쟁점, 인용 안전, 민감정보, 확인 필요 상태를 기록하고 사람이 확정합니다.',
    usage: '일반적인 증거·문서 검토 흐름을 안전하게 설명하고 자료 상태를 분리할 때 사용합니다.',
    pitfall: '최근파일, OCR, 요약, 기억 같은 간접 단서만으로 복사·제출·사실관계를 확정하면 안 됩니다.',
  },
}

const categoryProfiles: Record<string, Partial<DepthProfile>> = {
  'ai-command:AI Command': {
    mechanism:
      '목적, 입력, 우선순위, 종료 조건을 자연어 계약으로 고정해 모델이 선택할 수 있는 행동 공간을 줄입니다.',
    workflow:
      '원하는 결과를 먼저 쓰고, 필요한 자료와 하지 말아야 할 일을 붙인 뒤 출력 형식과 확인 방법으로 닫습니다.',
  },
  'ai-command:Prompt Quality': {
    mechanism: '같은 목표라도 정보의 순서, 구체성, 예시, 잡음 비율을 조절해 모델이 핵심 조건에 주의를 배분하게 합니다.',
    pitfall: '프롬프트가 길수록 좋다고 생각하면 중요한 지시가 중간에 묻히고 서로 충돌할 수 있습니다.',
  },
  'ai-command:Review / QA': {
    mechanism: '결과를 기준표, 반례, 근거, 재실행 가능한 검사와 비교해 생성 단계와 판정 단계를 분리합니다.',
    workflow: '판정 기준을 먼저 고정하고 사실과 추정을 나눈 뒤 반례와 누락을 찾고 최종 통과 여부를 기록합니다.',
  },
  'ai-command:Boundary / Safety': {
    mechanism: '허용 행동과 금지 행동을 분리하고 불확실성·권한·부작용이 임계값을 넘으면 실행 대신 정지나 확인으로 전환합니다.',
    pitfall: '“조심해” 같은 추상 경고보다 금지 대상, 멈출 조건, 승인 주체를 명시해야 실제 경계가 됩니다.',
  },
  'development:Data / Schema': {
    spatialModel: '데이터가 들어오는 문, 내부 보관함, 밖으로 나가는 문마다 어떤 모양을 지켜야 하는지 표시한 설계도로 보면 됩니다.',
    mechanism: '필드, 타입, 관계, 제약을 구조로 정의하고 입력·저장·전송 경계에서 그 구조를 검사하거나 변환합니다.',
    workflow: 'source of truth가 되는 schema를 확인하고 정상·누락·잘못된 입력을 각각 통과시켜 저장과 복원 결과를 비교합니다.',
    pitfall: 'TypeScript 타입은 런타임 외부 입력을 자동 검증하지 않습니다. 신뢰 경계에서는 별도 validation이 필요합니다.',
  },
  'development:Architecture': {
    spatialModel: '기능을 방으로 나누고 방 사이 문과 책임을 설계하는 일로 보면 됩니다. 변경이 어느 벽을 넘어가는지가 핵심입니다.',
    mechanism: '책임을 모듈로 나누고 interface와 dependency 방향을 정해 한 부분의 변화가 퍼지는 경로를 통제합니다.',
    workflow: '변경 이유와 데이터 흐름을 그린 뒤 책임이 가장 가까운 모듈을 고르고 공개 contract와 dependency 방향을 검토합니다.',
    pitfall: '파일을 많이 나누는 것과 좋은 구조는 다릅니다. 함께 바뀌는 책임과 경계가 실제 기준입니다.',
  },
  'development:Git / Change Control': {
    spatialModel: '현재 작업대, 저장된 checkpoint, 공유된 변경 기록을 구분하는 시간축으로 이해하면 됩니다.',
    mechanism: '내용 주소화된 기록과 branch·diff를 사용해 변경 전후와 작성 의도를 추적하고 선택적으로 통합합니다.',
    workflow: '작업 전 상태를 확인하고 관련 diff만 만들며 검증 후 의도가 분명한 단위로 기록하고 통합 충돌을 해결합니다.',
    pitfall: 'commit이 존재한다고 검증된 것은 아니며, 작은 diff도 contract를 바꾸면 큰 회귀를 만들 수 있습니다.',
  },
  'development:Runtime / Integration': {
    spatialModel: '실행 중인 여러 부품 사이로 요청, 이벤트, 상태가 이동하는 배관과 대기열로 보면 됩니다.',
    mechanism: '시간과 순서가 있는 실행 환경에서 상태, 네트워크, 저장소, 다른 서비스가 contract를 통해 상호작용합니다.',
    workflow: '호출 시작점부터 downstream 결과까지 시간순 로그를 따라가며 timeout, retry, 중복 실행, stale state를 확인합니다.',
    pitfall: '로컬에서 한 번 성공한 결과만으로 순서 변화, 중복 요청, 네트워크 실패를 다뤘다고 볼 수 없습니다.',
  },
  'development:Runtime': {
    mechanism: '실행 엔진이 메모리, 작업 대기열, 비동기 완료, 자원 수명을 관리하며 코드의 실제 시간 순서를 만듭니다.',
    workflow: '재현 중 상태와 시간 순서를 기록하고 자원 생성·사용·해제, 비동기 경계, 오류 전파를 확인합니다.',
    pitfall: '소스 코드에 적힌 순서와 실제 비동기 완료 순서가 같다고 가정하면 원인을 놓칠 수 있습니다.',
  },
  'development:Review / QA': {
    spatialModel: '요구사항을 통과 기준으로 바꾸고 변경 결과를 그 기준에 대는 검사대라고 생각하면 됩니다.',
    mechanism: '예상 결과와 실제 결과를 비교하고 실패를 재현 가능한 증거로 남겨 회귀 여부와 심각도를 판정합니다.',
    workflow: 'acceptance criteria를 읽고 위험 경로부터 테스트한 뒤 발견사항을 증거, 영향, 재현 절차, 권장 수정으로 기록합니다.',
    pitfall: '취향성 의견과 실제 버그를 섞거나 실행하지 않은 테스트를 통과했다고 보고하면 리뷰 신뢰도가 무너집니다.',
  },
  'development:Programming': {
    mechanism: '문법 구조가 제어 흐름과 데이터 변환으로 해석되어 실행되며 조건과 오류가 실제 경로를 갈라놓습니다.',
    workflow: '작은 입력으로 함수의 각 분기와 반환·오류 경로를 따라가고 상태 변화와 side effect를 표시합니다.',
    pitfall: '코드 한 줄의 뜻만 읽고 호출 순서와 입력 범위를 보지 않으면 실제 동작을 오해합니다.',
  },
  'libraries-tools:React': {
    spatialModel: 'UI를 component 나무로 보고 위에서 입력이 내려오고 상태 변화가 다시 render를 일으키는 구조로 보면 됩니다.',
    mechanism: 'props와 state가 바뀌면 React가 component를 다시 계산하고 이전 결과와 비교해 필요한 DOM 변경을 반영합니다.',
    workflow: '상태 소유자를 찾고 이벤트가 state를 바꾸는 경로와 render 결과를 확인한 뒤 불필요한 공유 상태를 줄입니다.',
    pitfall: 'render와 DOM 변경을 같은 것으로 보거나 파생 가능한 값을 중복 state로 저장하면 동기화 버그가 생깁니다.',
  },
  'libraries-tools:Frontend Frameworks': {
    mechanism: '상태와 UI 선언을 연결하고 화면 갱신, 이벤트 처리, component 수명 같은 반복 작업을 공통 규칙으로 제공합니다.',
    workflow: 'framework가 소유하는 단계와 브라우저가 직접 수행하는 단계를 나누고 build 결과와 runtime 동작을 각각 확인합니다.',
  },
  'libraries-tools:Build Tools': {
    spatialModel: '사람이 쓰는 소스를 브라우저가 받을 작은 산출물로 바꾸는 조립 라인으로 보면 됩니다.',
    mechanism: 'module graph를 읽고 문법을 변환하며 dependency를 묶고 사용하지 않는 코드를 제거해 배포 artifact를 만듭니다.',
    workflow: 'entry에서 dependency graph를 따라가고 설정·환경별 build를 실행해 asset 경로, chunk, source map, 오류를 확인합니다.',
    pitfall: '개발 서버 성공은 production build 성공과 같지 않으며, base path와 캐시된 asset 차이도 따로 확인해야 합니다.',
  },
  'libraries-tools:Languages': {
    mechanism: '문법과 타입·실행 규칙이 소스의 의미를 정하고 compiler나 runtime이 그 규칙을 실제 동작으로 바꿉니다.',
    workflow: '입력 타입과 실행 환경을 먼저 확인하고 작은 예제로 문법, 오류 처리, 표준 라이브러리 동작을 검증합니다.',
  },
  'libraries-tools:Package Managers': {
    mechanism: 'dependency 선언과 version constraint를 해석해 package를 설치하고 lockfile로 실제 선택 결과를 고정합니다.',
    workflow: 'manifest와 lockfile을 함께 확인하고 clean install, script 실행, 변경된 dependency graph를 검증합니다.',
    pitfall: 'manifest만 바꾸고 lockfile을 무시하거나 전역 설치 결과에 의존하면 다른 환경에서 재현되지 않습니다.',
  },
  'libraries-tools:Quality Tools': {
    mechanism: '소스·빌드·실행 결과를 정적 규칙이나 실행 시나리오와 비교해 사람이 놓치기 쉬운 오류를 자동으로 찾습니다.',
    workflow: '가장 빠른 정적 검사부터 실행하고 실패를 수정한 뒤 실제 사용자 흐름과 접근성·성능 검사를 확장합니다.',
    pitfall: '도구 점수 하나를 품질 전체로 보지 말고 무엇을 검사하지 못하는지 함께 알아야 합니다.',
  },
  'libraries-tools:Data Tools': {
    mechanism: '행·열 또는 relation 단위로 데이터를 읽고 filter, join, aggregate, type conversion을 실행해 새 결과를 만듭니다.',
    workflow: 'schema와 row count를 먼저 확인하고 변환 단계마다 개수, null, 중복, key 보존 여부를 검사합니다.',
    pitfall: '작은 샘플에서 맞는 변환도 전체 데이터의 type, memory, duplicate key에서 실패할 수 있습니다.',
  },
  'libraries-tools:Data Formats': {
    mechanism: '데이터 구조와 타입을 파일의 byte·text 배치 규칙으로 표현해 저장과 교환을 가능하게 합니다.',
    workflow: '작성자와 독자가 합의한 schema, encoding, null 표현을 확인하고 round-trip 후 값과 타입을 비교합니다.',
    pitfall: '파일 확장자만 보고 실제 encoding, schema version, 압축 방식을 가정하면 손상이나 오해가 생깁니다.',
  },
  'libraries-tools:Terminal Tools': {
    mechanism: '명령 문자열과 인자를 process에 전달하고 표준 입력·출력·오류와 exit code로 결과를 돌려줍니다.',
    workflow: '현재 디렉터리와 대상 경로를 확인하고 읽기 명령부터 실행한 뒤 exit code와 실제 변경 범위를 검증합니다.',
    pitfall: 'shell마다 quoting과 wildcard 규칙이 다르므로 복사한 명령이 같은 대상을 가리킨다고 가정하면 안 됩니다.',
  },
  'libraries-tools:Hosting Tools': {
    mechanism: 'build artifact를 전 세계 edge나 origin에 배치하고 domain, TLS, cache, 배포 version을 연결합니다.',
    workflow: 'production build를 만들고 output directory와 base path를 확인한 뒤 새 배포의 asset, route, cache, rollback을 검사합니다.',
    pitfall: 'Git push 성공과 배포 성공, 브라우저 cache 갱신은 서로 다른 단계입니다.',
  },
  'libraries-tools:Browser APIs': {
    mechanism: '브라우저가 보안 정책 안에서 저장소, network, clipboard, cache 같은 기능을 JavaScript interface로 제공합니다.',
    workflow: '지원 여부와 권한·보안 context를 확인하고 실패 시 사용자 흐름이 유지되는 fallback을 둡니다.',
    pitfall: 'API 존재 여부만 확인하지 말고 HTTPS, 사용자 gesture, storage quota 같은 실행 조건을 봐야 합니다.',
  },
  'libraries-tools:AI Protocols': {
    spatialModel: 'AI host와 외부 server 사이에서 누가 연결을 소유하고 무엇이 읽기 자료이며 무엇이 실제 행동인지 나눈 통신 지도입니다.',
    mechanism: 'capability negotiation과 구조화된 메시지를 통해 tool, resource, prompt와 client 기능을 발견하고 호출합니다.',
    workflow: '연결 주체와 trust boundary를 확인하고 capability를 협상한 뒤 최소 권한으로 목록 조회와 호출을 검증합니다.',
    pitfall: '표준 프로토콜은 연결 형식을 맞출 뿐 server의 안전성, 데이터 정확성, 사용자 승인을 대신 보장하지 않습니다.',
  },
  'joovis-architecture:Boundary': {
    mechanism: '허용 범위, 금지 범위, 책임 소유자, 승인 조건을 기록해 작업이 넘을 수 있는 선을 명시적으로 집행합니다.',
    workflow: '작업 전 ledger를 읽고 대상 경로와 능력을 대조한 뒤 열린 경계만 사용하고 예외는 승인 기록으로 남깁니다.',
  },
  'joovis-architecture:Planning': {
    mechanism: '큰 목표를 독립 작업, dependency, 완료 기준, 검증 지점으로 분해해 실행 순서를 만듭니다.',
    workflow: '최종 outcome에서 역으로 필요한 산출물을 나누고 blocker와 parallel 가능 구간을 표시합니다.',
  },
  'joovis-architecture:Flow': {
    mechanism: '작업 결과와 현재 상태를 다음 책임자에게 명시적 packet으로 전달해 연속성을 만듭니다.',
    workflow: '보내는 쪽이 변경, 근거, 검증, 열린 문제를 묶고 받는 쪽이 source와 boundary를 확인한 뒤 이어받습니다.',
  },
  'joovis-architecture:Truth Surface': {
    mechanism: '확인된 현재 상태를 하나의 읽기 표면에 투영하고 갱신 시점과 출처를 함께 관리합니다.',
    pitfall: '최신이라는 표시 없이 오래된 snapshot을 현재 진실로 사용하면 판단이 어긋납니다.',
  },
  'joovis-architecture:State': {
    mechanism: '현재 값, 직전 검증, 열린 문제, 다음 전이를 묶어 중단과 재개 사이에도 작업 상태를 보존합니다.',
    workflow: '전이 전후 snapshot을 남기고 invariant와 review result를 통과한 상태만 current로 승격합니다.',
  },
  'joovis-architecture:Review': {
    mechanism: '변경이 다음 상태로 넘어가기 전에 사실, 경계, 테스트, 위험 기준을 통과해야 하는 gate를 둡니다.',
    workflow: '검토 입력과 rubric을 고정하고 blocker를 해결한 뒤 통과·보류·반려와 근거를 기록합니다.',
  },
  'joovis-architecture:Agent Design': {
    mechanism: '에이전트가 사용할 지시, 도구, 상태, 검증, handoff contract를 재사용 가능한 작업 단위로 묶습니다.',
    pitfall: '역할 이름만 다른 agent를 늘리기보다 독립 책임과 검증 가능한 output이 있는지 먼저 확인해야 합니다.',
  },
  'joovis-architecture:Knowledge': {
    mechanism: '사실, 해석, 출처, 유효 범위를 연결하고 갱신 규칙을 둬 지식이 어느 판단에 쓰일 수 있는지 관리합니다.',
    pitfall: '요약을 원문과 같은 신뢰도로 승격하거나 scope가 다른 지식을 섞으면 오염이 누적됩니다.',
  },
  'dispute-integration:원본/출처': {
    mechanism: '원본 byte, 식별자, 생성·수집 경로, hash, 파생 관계를 연결해 자료의 계보를 추적합니다.',
    workflow: '원본을 read-only로 보존하고 hash와 metadata를 기록한 뒤 검토용 사본과 모든 파생본을 별도 연결합니다.',
    pitfall: '파일명과 화면 모양이 같다는 이유만으로 동일 원본이라고 판단하면 안 됩니다.',
  },
  'dispute-integration:인용안전': {
    mechanism: '원문 구간, 화자, 앞뒤 문맥, 변환 여부를 확인해 직접인용·간접인용·인용금지 상태를 나눕니다.',
    workflow: 'OCR이나 요약문에서 원문 위치를 찾고 앞뒤 문장을 대조한 뒤 사람 검수와 민감정보 확인 후 등급을 확정합니다.',
    pitfall: '뜻이 비슷한 요약을 따옴표 안에 넣으면 직접인용처럼 보이는 요약오염이 됩니다.',
  },
  'dispute-integration:증거관리': {
    mechanism: '각 자료를 고유 evidence item으로 만들고 상태, 소유, 출처, 쟁점, 검수 이력을 별도 필드로 연결합니다.',
    workflow: '등록, 중복 확인, 원본대조, 쟁점 연결, 인용 안전, 검토 상태 순서로 처리합니다.',
  },
  'dispute-integration:쟁점정리': {
    mechanism: '주장과 반박을 쟁점 단위로 분리하고 각 문장을 지지·반박하는 evidence item과 양방향으로 연결합니다.',
    workflow: '쟁점을 질문 형태로 정의하고 양쪽 주장, 필요한 입증 요소, 연결 자료, 비어 있는 근거를 표로 만듭니다.',
    pitfall: '자료가 흥미롭다는 이유만으로 쟁점과 연결하면 정보량만 늘고 입증 구조는 흐려집니다.',
  },
  'dispute-integration:기록정리': {
    mechanism: '날짜, 작성 주체, 기관, 문서 종류, 출처, 상태를 정규화해 시간축과 목록에서 같은 항목을 재현합니다.',
    workflow: '문서 자체의 날짜와 수집 날짜를 구분하고 불명확한 값은 추정하지 않은 채 확인 필요로 남깁니다.',
  },
  'dispute-integration:판단정리': {
    mechanism: '사실인정, 적용 기준, 판단 이유, 결론을 분리해 어느 전제가 어느 결론을 만들었는지 추적합니다.',
    workflow: '기관별 문서에서 주문·결론과 이유를 따로 추출하고 동일 쟁점의 사실·법률 판단 차이를 대조합니다.',
    pitfall: '결론만 읽고 이유를 추정하거나 서로 다른 절차 단계의 판단을 같은 효력으로 비교하면 안 됩니다.',
  },
  'dispute-integration:프라이버시': {
    mechanism: '식별 가능 정보와 업무상 필요한 정보를 분리하고 masking, 접근권한, 공개본·원본 분리로 노출을 줄입니다.',
    workflow: '민감정보 유형을 탐지하고 필요성을 판단한 뒤 가림본을 만들고 redaction log와 원본 접근권한을 보존합니다.',
    pitfall: '화면에서 가린 것처럼 보여도 원본 layer나 metadata에 값이 남을 수 있어 파생본을 다시 검사해야 합니다.',
  },
  'dispute-integration:검수': {
    mechanism: '자동 추출과 사람 확인을 별도 상태로 두고 일치 여부와 확인자를 기록해 추정이 확정으로 승격되는 조건을 통제합니다.',
    workflow: '낮은 신뢰도와 고위험 항목을 queue에 넣고 원문과 대조한 뒤 확인·수정·보류 상태를 기록합니다.',
  },
  'dispute-integration:OCR/검수': {
    mechanism: '이미지의 글자 모양을 문자 후보와 confidence로 변환한 뒤 사람이 원본 이미지와 대조해 확정합니다.',
    workflow: '낮은 confidence, 숫자, 고유명사, 인용 예정 문장을 우선 검수하고 수정 전 OCR 결과도 이력으로 남깁니다.',
    pitfall: 'OCR confidence는 글자 인식 확률이지 문장의 사실성이나 법적 의미의 정확도가 아닙니다.',
  },
  'dispute-integration:문서버전': {
    mechanism: '원본과 파생본 사이의 생성 순서, 변환 작업, hash, 변경자를 기록해 어느 버전이 어떤 목적에 쓰였는지 구분합니다.',
    workflow: '원본은 고정하고 작업마다 새 파생본을 만들며 변경 이유와 이전 버전을 연결합니다.',
  },
  'dispute-integration:문서유형': {
    mechanism: '문서의 작성 주체, 목적, 절차상 위치, 서명·확인 방식에 따라 읽어야 할 필드와 신뢰 한계를 구분합니다.',
    pitfall: '문서 제목만으로 작성 경위, 진정성, 증명력을 자동 확정하면 안 됩니다.',
  },
  'dispute-integration:절차': {
    mechanism: '요청, 접수, 보정, 회신, 판단, 제출 같은 단계와 기한·담당·필요 문서를 상태 전이로 관리합니다.',
    workflow: '현재 단계와 다음 마감, 완료 조건, 누락 자료를 확인하고 실제 문서의 접수·회신 기록으로 갱신합니다.',
  },
  'dispute-integration:문서구조': {
    mechanism: '문서 안의 주문·결론, 이유, 사실, 기준을 구조 필드로 분리해 부분 인용과 비교가 가능하게 합니다.',
    workflow: '문서 목차와 표제를 기준으로 구간을 나누고 원문 위치를 유지한 채 필요한 부분을 연결합니다.',
  },
  'dispute-integration:검토': {
    mechanism: '검토 기준과 표본 추출 규칙을 먼저 정하고 사람의 판단, 오류 유형, 재검수 결과를 기록해 품질을 측정합니다.',
    workflow: '대표 표본과 고위험 표본을 나눠 검토하고 불일치 원인을 기준·자료·판단 오류로 분류합니다.',
  },
}

export function buildFallbackDepth(term: DepthInput) {
  const profile = {
    ...deckProfiles[term.deck],
    ...categoryProfiles[`${term.deck}:${term.category}`],
  }
  const related = term.relatedTerms?.slice(0, 4).join(', ')

  return {
    mentalModel: `‘${term.term}’은 ${term.koreanMeaning}을 뜻합니다. ${profile.spatialModel}`,
    whyItMatters: `${term.simpleMeaning} ${profile.why}`,
    withoutIt: `${term.term}을 구분하지 않으면 ${profile.failure}`,
    realWorkflow: `${profile.workflow} 이때 ${term.term}이 실제로 어느 입력과 상태를 바꾸는지 확인합니다.`,
    mechanism: `${profile.mechanism} 이 흐름에서 ${term.term}은 “${term.koreanMeaning}”을 담당합니다.`,
    usagePattern: `${profile.usage} 확인할 질문은 “${term.checkQuestion}”입니다.`,
    commonPitfall: profile.pitfall,
    expertNote: related
      ? `${term.term}을 ${related}와 연결해 입력 → 처리 → 상태 변화 → 실패 → 검증 순서로 설명해보세요.`
      : `${term.term}을 정의만 말하지 말고 입력 → 처리 → 상태 변화 → 실패 → 검증 순서로 설명해보세요.`,
  }
}
