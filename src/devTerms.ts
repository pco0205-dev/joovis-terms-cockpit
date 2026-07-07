import type { DeckId, DevTerm, Difficulty, RawDevTerm } from './types'

const legacyTerms = [
  {
    id: 'context',
    term: 'Context',
    pronunciation: '컨텍스트',
    koreanMeaning: '현재 판단에 필요한 배경 정보와 주변 조건',
    simpleMeaning: 'AI가 요청을 제대로 이해하도록 붙여 주는 상황 설명입니다.',
    joovisUsage: '이 학습 앱에서는 현재 폴더, 사용자 요청, 용어 데이터가 context입니다.',
    checkQuestion: '지금 판단에 꼭 필요한 배경은 무엇인가요?',
    codexPromptExample: 'Context는 독립형 학습 PWA입니다. 다른 JOOVIS 저장소는 보지 마세요.',
    category: 'AI Command',
  },
  {
    id: 'scope',
    term: 'Scope',
    pronunciation: '스코프',
    koreanMeaning: '작업에 포함되는 범위와 제외되는 범위',
    simpleMeaning: '무엇을 하고 무엇을 하지 않을지 정한 선입니다.',
    joovisUsage: '이 앱의 scope는 정적 용어 학습 UI와 로컬 저장 기능입니다.',
    checkQuestion: '이번 작업에서 명시적으로 제외해야 하는 것은 무엇인가요?',
    codexPromptExample: 'Scope를 현재 폴더의 static PWA로 제한하고 백엔드는 만들지 마세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'boundary',
    term: 'Boundary',
    pronunciation: '바운더리',
    koreanMeaning: '넘어가면 안 되는 시스템, 파일, 책임의 경계',
    simpleMeaning: '안전하게 작업하기 위한 울타리입니다.',
    joovisUsage: 'JOOVIS Terms Cockpit은 다른 JOOVIS 프로젝트와 분리된 boundary 안에서 동작합니다.',
    checkQuestion: '이 작업이 넘어가면 안 되는 경계는 어디인가요?',
    codexPromptExample: 'Boundary를 C:\\dev\\joovis-terms-cockpit 안으로 제한해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'source-of-truth',
    term: 'Source of Truth',
    pronunciation: '소스 오브 트루스',
    koreanMeaning: '여러 정보 중 최종 기준이 되는 단일 원천',
    simpleMeaning: '헷갈릴 때 믿고 따르는 기준 데이터입니다.',
    joovisUsage: '용어 설명의 source of truth는 src/devTerms.ts입니다.',
    checkQuestion: '충돌하는 정보가 있을 때 무엇을 최종 기준으로 삼나요?',
    codexPromptExample: '용어 목록의 source of truth를 src/devTerms.ts로 두고 UI는 이 데이터만 읽게 하세요.',
    category: 'Data / Schema',
  },
  {
    id: 'capability-state',
    term: 'Capability State',
    pronunciation: '케이퍼빌리티 스테이트',
    koreanMeaning: '현재 사용할 수 있는 기능과 제한의 상태',
    simpleMeaning: '지금 가능한 일과 불가능한 일을 나타냅니다.',
    joovisUsage: '이 앱의 capability state는 React, Vite, TypeScript, PWA, localStorage입니다.',
    checkQuestion: '현재 환경에서 가능한 기능과 금지된 기능은 무엇인가요?',
    codexPromptExample: 'Capability state를 확인하고 외부 연동 없이 구현 가능한 방식만 사용하세요.',
    category: 'AI Command',
  },
  {
    id: 'contract',
    term: 'Contract',
    pronunciation: '컨트랙트',
    koreanMeaning: '모듈이나 데이터가 반드시 지켜야 하는 약속',
    simpleMeaning: '입력과 출력의 형태를 약속하는 규칙입니다.',
    joovisUsage: 'DevTerm 타입은 모든 용어 카드가 지켜야 하는 contract입니다.',
    checkQuestion: '이 데이터나 함수가 반드시 보장해야 하는 약속은 무엇인가요?',
    codexPromptExample: 'DevTerm contract를 깨지 말고 모든 항목이 같은 필드를 갖게 해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'interface',
    term: 'Interface',
    pronunciation: '인터페이스',
    koreanMeaning: '두 부분이 서로 만나는 접점과 사용 방법',
    simpleMeaning: '서로 다른 코드가 대화하는 표면입니다.',
    joovisUsage: 'TermCard props는 카드 컴포넌트와 앱 상태가 만나는 interface입니다.',
    checkQuestion: '이 컴포넌트나 함수는 어떤 값으로 연결되나요?',
    codexPromptExample: 'TermCard interface를 작게 유지하고 필요한 props만 전달해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'schema',
    term: 'Schema',
    pronunciation: '스키마',
    koreanMeaning: '데이터가 가져야 하는 구조와 필드 정의',
    simpleMeaning: '데이터의 모양을 정해 둔 설계도입니다.',
    joovisUsage: '용어 schema는 id, term, pronunciation, koreanMeaning 등으로 고정됩니다.',
    checkQuestion: '필수 필드가 빠지면 어떤 화면이 깨질까요?',
    codexPromptExample: 'Schema에 맞지 않는 용어 항목이 있는지 TypeScript로 확인해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'artifact',
    term: 'Artifact',
    pronunciation: '아티팩트',
    koreanMeaning: '작업 결과로 남는 파일, 빌드 산출물, 문서',
    simpleMeaning: '만들어 낸 결과물입니다.',
    joovisUsage: '빌드 후 dist 폴더의 정적 파일은 배포 가능한 artifact입니다.',
    checkQuestion: '이번 작업의 최종 산출물은 어떤 파일인가요?',
    codexPromptExample: '빌드 artifact가 정적 파일만 포함하는지 확인해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'provenance',
    term: 'Provenance',
    pronunciation: '프로버넌스',
    koreanMeaning: '정보나 변경이 어디에서 왔는지에 대한 출처 기록',
    simpleMeaning: '데이터와 변경의 출신을 추적하는 개념입니다.',
    joovisUsage: '용어 설명은 이 독립 학습 앱을 위해 작성되었다는 provenance를 가집니다.',
    checkQuestion: '이 정보가 어디서 왔는지 설명할 수 있나요?',
    codexPromptExample: '새 용어를 추가할 때 provenance가 모호한 추측 설명은 피하세요.',
    category: 'Data / Schema',
  },
  {
    id: 'diff',
    term: 'Diff',
    pronunciation: '디프',
    koreanMeaning: '이전 상태와 현재 상태의 차이',
    simpleMeaning: '무엇이 바뀌었는지 보여 주는 변경 목록입니다.',
    joovisUsage: '리뷰에서는 이 PWA 파일 diff만 확인합니다.',
    checkQuestion: '이 변경에서 실제로 달라진 줄은 어디인가요?',
    codexPromptExample: '현재 workspace 안의 diff만 요약하고 범위 밖 파일은 언급하지 마세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'runtime',
    term: 'Runtime',
    pronunciation: '런타임',
    koreanMeaning: '앱이 실제로 실행되는 시간과 환경',
    simpleMeaning: '사용자가 앱을 열어 사용하는 순간의 상태입니다.',
    joovisUsage: '이 PWA runtime은 브라우저이며 상태는 localStorage에만 남습니다.',
    checkQuestion: '이 동작은 빌드 시점인가요, 실행 시점인가요?',
    codexPromptExample: 'Runtime 동작은 브라우저와 localStorage로만 처리하고 서버는 만들지 마세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'static',
    term: 'Static',
    pronunciation: '스태틱',
    koreanMeaning: '서버 계산 없이 미리 만들어진 파일로 제공되는 방식',
    simpleMeaning: 'HTML, CSS, JS 파일만으로 실행되는 구조입니다.',
    joovisUsage: 'JOOVIS Terms Cockpit은 static-only 앱입니다.',
    checkQuestion: '이 기능이 정적 파일만으로 가능한가요?',
    codexPromptExample: 'Static PWA로 유지하고 데이터는 번들된 TypeScript 파일에 넣어 주세요.',
    category: 'Architecture',
  },
  {
    id: 'guard',
    term: 'Guard',
    pronunciation: '가드',
    koreanMeaning: '잘못된 입력이나 위험한 흐름을 막는 보호 조건',
    simpleMeaning: '문제가 생기기 전에 막는 조건문이나 규칙입니다.',
    joovisUsage: 'workspace path 확인은 잘못된 폴더 작업을 막는 guard입니다.',
    checkQuestion: '위험한 작업 전에 어떤 조건을 확인해야 하나요?',
    codexPromptExample: '파일을 수정하기 전에 workspace guard를 확인하고 결과를 보고해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'checker',
    term: 'Checker',
    pronunciation: '체커',
    koreanMeaning: '규칙 위반이나 오류를 찾아내는 검사 도구나 로직',
    simpleMeaning: '틀린 부분을 찾아 주는 검사기입니다.',
    joovisUsage: 'TypeScript 빌드는 용어 데이터와 컴포넌트 contract를 확인하는 checker입니다.',
    checkQuestion: '이 변경을 어떤 검사로 확인할 수 있나요?',
    codexPromptExample: '구현 후 checker 역할로 npm run build를 실행해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'smoke-test',
    term: 'Smoke Test',
    pronunciation: '스모크 테스트',
    koreanMeaning: '핵심 기능이 크게 깨지지 않았는지 빠르게 보는 검사',
    simpleMeaning: '앱이 기본적으로 켜지고 주요 버튼이 보이는지 확인합니다.',
    joovisUsage: '빌드 성공과 홈 화면 렌더링은 이 앱의 smoke test입니다.',
    checkQuestion: '가장 먼저 확인해야 할 기본 동작은 무엇인가요?',
    codexPromptExample: '검색, 랜덤 용어, 즐겨찾기 버튼이 보이는지 smoke test 관점으로 확인해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'regression',
    term: 'Regression',
    pronunciation: '리그레션',
    koreanMeaning: '예전에 되던 기능이 변경 후 깨지는 문제',
    simpleMeaning: '고치다가 멀쩡하던 것을 망가뜨린 상황입니다.',
    joovisUsage: '검색을 수정했는데 즐겨찾기 저장이 깨지면 regression입니다.',
    checkQuestion: '이번 변경으로 기존 기능 중 무엇이 깨질 수 있나요?',
    codexPromptExample: '새 필터를 추가하면서 기존 search와 review status에 regression이 없는지 봐 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'acceptance-criteria',
    term: 'Acceptance Criteria',
    pronunciation: '억셉턴스 크라이테리아',
    koreanMeaning: '작업 완료를 판단하는 구체적인 조건',
    simpleMeaning: '끝났다고 말할 수 있는 체크리스트입니다.',
    joovisUsage: '80개 이상 용어, PWA manifest, service worker, 빌드 성공이 acceptance criteria입니다.',
    checkQuestion: '무엇을 만족해야 PASS라고 할 수 있나요?',
    codexPromptExample: '요구사항을 acceptance criteria로 바꾸고 완료 여부를 하나씩 검증해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'handoff',
    term: 'Handoff',
    pronunciation: '핸드오프',
    koreanMeaning: '다음 사람이 이어서 할 수 있도록 전달하는 정리',
    simpleMeaning: '작업 상태와 남은 일을 넘겨주는 것입니다.',
    joovisUsage: '최종 보고서는 바뀐 파일과 검증 결과를 handoff합니다.',
    checkQuestion: '다음 사람이 이어서 보려면 어떤 정보가 필요할까요?',
    codexPromptExample: '완료 후 commands run, validation, risks를 포함해 handoff 형식으로 보고해 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'telemetry',
    term: 'Telemetry',
    pronunciation: '텔레메트리',
    koreanMeaning: '시스템 상태나 사용 현황을 관찰하기 위한 측정 정보',
    simpleMeaning: '앱이 어떻게 쓰이는지 보는 신호입니다.',
    joovisUsage: '이 앱은 외부 telemetry를 보내지 않고 로컬 카운트만 보여 줍니다.',
    checkQuestion: '측정 정보가 외부로 나가도 되는 조건인가요?',
    codexPromptExample: 'Telemetry는 추가하지 말고 localStorage 기반 카운트만 표시해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'upstream',
    term: 'Upstream',
    pronunciation: '업스트림',
    koreanMeaning: '현재 작업보다 앞단에서 입력이나 기준을 제공하는 쪽',
    simpleMeaning: '내 코드가 받는 원천입니다.',
    joovisUsage: 'devTerms 데이터는 카드 UI의 upstream 입력입니다.',
    checkQuestion: '이 화면은 어떤 데이터나 결정에 의존하나요?',
    codexPromptExample: 'UI를 고치기 전에 upstream 데이터 구조를 먼저 확인해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'downstream',
    term: 'Downstream',
    pronunciation: '다운스트림',
    koreanMeaning: '현재 작업의 결과를 받아 쓰는 뒤쪽 흐름',
    simpleMeaning: '내 변경의 영향을 받는 곳입니다.',
    joovisUsage: 'DevTerm 필드명을 바꾸면 downstream 카드 렌더링과 검색이 영향을 받습니다.',
    checkQuestion: '이 변경을 받아 쓰는 화면이나 함수는 어디인가요?',
    codexPromptExample: '필드명을 바꾸면 downstream 컴포넌트까지 함께 업데이트해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'dependency',
    term: 'Dependency',
    pronunciation: '디펜던시',
    koreanMeaning: '코드나 기능이 동작하기 위해 의존하는 대상',
    simpleMeaning: '없으면 작동하지 않는 필요 요소입니다.',
    joovisUsage: '이 프로젝트의 앱 의존성은 React와 React DOM뿐입니다.',
    checkQuestion: '이 기능을 위해 새 의존성이 꼭 필요한가요?',
    codexPromptExample: '새 dependency를 추가하지 말고 React 기본 기능으로 구현해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'coupling',
    term: 'Coupling',
    pronunciation: '커플링',
    koreanMeaning: '두 부분이 서로 강하게 묶여 있는 정도',
    simpleMeaning: '한쪽을 바꾸면 다른 쪽도 쉽게 흔들리는 상태입니다.',
    joovisUsage: '검색 로직이 카드 UI에 과하게 섞이면 coupling이 커집니다.',
    checkQuestion: '이 코드는 다른 부분을 너무 많이 알고 있지 않나요?',
    codexPromptExample: '상태 저장 로직과 화면 렌더링의 coupling을 낮게 유지해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'decoupling',
    term: 'Decoupling',
    pronunciation: '디커플링',
    koreanMeaning: '서로 묶인 부분을 느슨하게 분리하는 설계',
    simpleMeaning: '한쪽 변경이 다른 쪽에 덜 퍼지게 만드는 것입니다.',
    joovisUsage: 'storage.ts를 분리하면 localStorage 접근과 화면 로직이 decoupling됩니다.',
    checkQuestion: '어떤 책임을 분리하면 변경이 쉬워질까요?',
    codexPromptExample: 'localStorage 코드는 storage.ts로 decoupling해서 App.tsx를 단순하게 유지해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'adapter',
    term: 'Adapter',
    pronunciation: '어댑터',
    koreanMeaning: '서로 다른 형태를 맞춰 주는 변환 계층',
    simpleMeaning: '한쪽 형식을 다른 쪽이 이해하는 형식으로 바꿉니다.',
    joovisUsage: 'storage.ts는 localStorage 문자열과 앱 상태 사이의 adapter 역할을 합니다.',
    checkQuestion: '형식 차이를 어디에서 흡수하나요?',
    codexPromptExample: '브라우저 저장소 접근은 adapter 함수로 감싸서 컴포넌트가 직접 파싱하지 않게 해 주세요.',
    category: 'Architecture',
  },
  {
    id: 'port',
    term: 'Port',
    pronunciation: '포트',
    koreanMeaning: '핵심 로직이 외부와 만나는 추상 접점',
    simpleMeaning: '바깥과 연결되는 교체 가능한 입구입니다.',
    joovisUsage: '저장소 helper 함수는 앱이 localStorage에 접근하는 port처럼 볼 수 있습니다.',
    checkQuestion: '외부 세부 구현을 바꿔도 핵심 로직이 유지되나요?',
    codexPromptExample: '저장 port를 작게 두고 외부 서비스 연결은 만들지 마세요.',
    category: 'Architecture',
  },
  {
    id: 'pipeline',
    term: 'Pipeline',
    pronunciation: '파이프라인',
    koreanMeaning: '여러 처리를 순서대로 통과하는 흐름',
    simpleMeaning: '입력에서 결과까지 이어지는 단계 묶음입니다.',
    joovisUsage: '검색어 정규화, 카테고리 필터, 즐겨찾기 필터가 카드 목록 pipeline입니다.',
    checkQuestion: '이 데이터는 어떤 순서로 처리되나요?',
    codexPromptExample: '목록 pipeline을 query, category, favorites 순서로 읽기 쉽게 정리해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'orchestration',
    term: 'Orchestration',
    pronunciation: '오케스트레이션',
    koreanMeaning: '여러 작업을 적절한 순서로 조율하는 것',
    simpleMeaning: '각 기능이 언제 어떻게 실행될지 묶어 관리합니다.',
    joovisUsage: 'App.tsx는 검색, 필터, 저장 상태를 조율하는 orchestration 지점입니다.',
    checkQuestion: '여러 상태 변경이 어디에서 조율되나요?',
    codexPromptExample: '상태 orchestration은 App.tsx 안에 두고 외부 런타임 시스템은 추가하지 마세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'fixture',
    term: 'Fixture',
    pronunciation: '픽스처',
    koreanMeaning: '테스트나 검증에 쓰는 고정 입력 데이터',
    simpleMeaning: '항상 같은 결과를 기대할 수 있는 샘플 데이터입니다.',
    joovisUsage: 'devTerms 일부 항목은 검색 동작을 확인하는 fixture처럼 사용할 수 있습니다.',
    checkQuestion: '검증에 사용할 안정적인 샘플은 무엇인가요?',
    codexPromptExample: '검색 검증용 fixture로 Schema와 Fail-closed 항목을 확인해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'mock',
    term: 'Mock',
    pronunciation: '목',
    koreanMeaning: '실제 대상을 흉내 내는 테스트용 대체물',
    simpleMeaning: '진짜 대신 쓰는 가짜 객체입니다.',
    joovisUsage: '이 앱은 외부 연동이 없으므로 네트워크 mock이 필요 없습니다.',
    checkQuestion: '실제 대상 없이 테스트하려면 무엇을 흉내 내야 하나요?',
    codexPromptExample: '외부 mock을 만들지 말고 정적 데이터로만 UI를 검증해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'stub',
    term: 'Stub',
    pronunciation: '스텁',
    koreanMeaning: '간단한 고정 응답만 돌려주는 대체 코드',
    simpleMeaning: '복잡한 동작 없이 자리만 채우는 간단한 함수입니다.',
    joovisUsage: '초기 UI 확인에는 고정 용어 배열이 stub 데이터처럼 쓰일 수 있습니다.',
    checkQuestion: '임시 구현이 실제 요구를 가리고 있지는 않나요?',
    codexPromptExample: 'Stub으로 끝내지 말고 실제 80개 이상 용어 데이터를 채워 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'sandbox',
    term: 'Sandbox',
    pronunciation: '샌드박스',
    koreanMeaning: '영향 범위를 제한한 안전한 실행 공간',
    simpleMeaning: '실수해도 밖으로 번지지 않게 만든 공간입니다.',
    joovisUsage: '현재 workspace 폴더가 이 독립 앱을 만드는 sandbox입니다.',
    checkQuestion: '작업이 sandbox 밖으로 나가지 않도록 무엇을 확인하나요?',
    codexPromptExample: 'Sandbox를 C:\\dev\\joovis-terms-cockpit으로 제한하고 다른 프로젝트를 보지 마세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'dry-run',
    term: 'Dry Run',
    pronunciation: '드라이 런',
    koreanMeaning: '실제 변경 없이 결과를 미리 확인하는 실행',
    simpleMeaning: '실행하면 어떻게 될지 먼저 보는 연습입니다.',
    joovisUsage: '삭제나 대량 변경 전에는 대상 파일을 먼저 확인하는 dry run 사고방식이 필요합니다.',
    checkQuestion: '실제 변경 전에 확인할 수 있는 방법이 있나요?',
    codexPromptExample: '파일을 지우기 전에 대상 목록을 먼저 확인하는 dry run 단계를 거쳐 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'idempotent',
    term: 'Idempotent',
    pronunciation: '아이뎀포턴트',
    koreanMeaning: '여러 번 실행해도 결과가 더 변하지 않는 성질',
    simpleMeaning: '같은 일을 반복해도 같은 상태로 남는 것입니다.',
    joovisUsage: '같은 용어를 여러 번 즐겨찾기해도 Set 구조라 결과가 하나로 유지됩니다.',
    checkQuestion: '이 동작을 반복 실행하면 상태가 중복되나요?',
    codexPromptExample: '즐겨찾기 저장은 idempotent하게 만들어 중복 id가 생기지 않게 해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'side-effect',
    term: 'Side Effect',
    pronunciation: '사이드 이펙트',
    koreanMeaning: '함수 밖의 상태를 바꾸는 부수 효과',
    simpleMeaning: '계산 결과 외에 저장소나 화면 상태를 바꾸는 일입니다.',
    joovisUsage: 'localStorage 저장은 이 앱에서 의도된 side effect입니다.',
    checkQuestion: '이 함수가 외부 상태를 바꾸나요?',
    codexPromptExample: 'Side effect는 localStorage 저장으로만 제한하고 외부 호출은 추가하지 마세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'invariant',
    term: 'Invariant',
    pronunciation: '인베리언트',
    koreanMeaning: '어떤 변경 후에도 항상 유지되어야 하는 조건',
    simpleMeaning: '절대 깨지면 안 되는 약속입니다.',
    joovisUsage: '모든 용어는 DevTerm 필드를 빠짐없이 가진다는 조건이 invariant입니다.',
    checkQuestion: '항상 참이어야 하는 조건은 무엇인가요?',
    codexPromptExample: '80개 이상 용어와 DevTerm field invariant를 깨지 않는지 확인해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'fail-closed',
    term: 'Fail-closed',
    pronunciation: '페일 클로즈드',
    koreanMeaning: '실패하면 허용하지 않고 안전한 쪽으로 닫히는 방식',
    simpleMeaning: '불확실하면 멈추는 안전 원칙입니다.',
    joovisUsage: 'workspace가 맞지 않으면 작업을 멈추는 것이 fail-closed입니다.',
    checkQuestion: '불확실할 때 계속 진행하나요, 안전하게 멈추나요?',
    codexPromptExample: '경로 확인이 실패하면 fail-closed로 멈추고 BLOCKED를 보고해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'rollback',
    term: 'Rollback',
    pronunciation: '롤백',
    koreanMeaning: '변경을 이전의 안전한 상태로 되돌리는 것',
    simpleMeaning: '문제가 생기면 전 상태로 복구합니다.',
    joovisUsage: 'PWA 변경이 빌드를 깨면 해당 변경만 되돌릴 수 있어야 합니다.',
    checkQuestion: '문제가 생겼을 때 어떤 변경을 되돌리면 되나요?',
    codexPromptExample: '불필요한 파일 변경을 섞지 말고 rollback이 쉬운 작은 변경으로 유지해 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'migration',
    term: 'Migration',
    pronunciation: '마이그레이션',
    koreanMeaning: '데이터나 구조를 새 형태로 옮기는 작업',
    simpleMeaning: '기존 상태를 새 규칙에 맞게 바꾸는 과정입니다.',
    joovisUsage: 'localStorage 키 구조를 바꾸면 기존 사용자 상태 migration을 고려해야 합니다.',
    checkQuestion: '이 변경이 기존 저장 데이터를 어떻게 다루나요?',
    codexPromptExample: '저장 schema를 바꿀 때 migration 없이 기존 즐겨찾기를 잃지 않게 해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'prompt',
    term: 'Prompt',
    pronunciation: '프롬프트',
    koreanMeaning: 'AI에게 원하는 작업을 설명하는 입력 문장',
    simpleMeaning: 'Codex에게 일을 부탁하는 문장입니다.',
    joovisUsage: '좋은 prompt는 목표, 범위, 금지사항, 검증 방법을 함께 말합니다.',
    checkQuestion: '요청 문장에 목표와 제한이 충분히 들어 있나요?',
    codexPromptExample: 'Prompt에 작업 폴더와 금지 범위를 명시하고 구현 후 build를 실행해 주세요.',
    category: 'AI Command',
  },
  {
    id: 'instruction',
    term: 'Instruction',
    pronunciation: '인스트럭션',
    koreanMeaning: '반드시 따라야 하는 지시나 규칙',
    simpleMeaning: 'AI나 사람이 지켜야 하는 명령입니다.',
    joovisUsage: '외부 연동 금지 instruction은 구현 선택을 제한합니다.',
    checkQuestion: '이 작업에서 가장 우선순위가 높은 지시는 무엇인가요?',
    codexPromptExample: 'Instruction을 우선순위대로 읽고 충돌이 있으면 더 안전한 쪽을 선택해 주세요.',
    category: 'AI Command',
  },
  {
    id: 'system-instruction',
    term: 'System Instruction',
    pronunciation: '시스템 인스트럭션',
    koreanMeaning: '대화나 도구 사용의 최상위 동작 규칙',
    simpleMeaning: 'AI가 항상 지켜야 하는 운영 규칙입니다.',
    joovisUsage: '파일 수정 방식이나 보고 형식은 system instruction의 영향을 받습니다.',
    checkQuestion: '사용자 요청보다 먼저 지켜야 하는 상위 규칙이 있나요?',
    codexPromptExample: 'System instruction과 사용자 요구를 모두 만족하는 최소 구현을 해 주세요.',
    category: 'AI Command',
  },
  {
    id: 'user-intent',
    term: 'User Intent',
    pronunciation: '유저 인텐트',
    koreanMeaning: '사용자가 실제로 달성하려는 목적',
    simpleMeaning: '문장 뒤에 있는 진짜 목표입니다.',
    joovisUsage: '이 앱의 user intent는 용어를 빠르게 배우고 복습하는 것입니다.',
    checkQuestion: '사용자가 원하는 최종 결과는 무엇인가요?',
    codexPromptExample: 'User intent를 학습용 모바일 PWA로 보고 기능을 단순하게 유지해 주세요.',
    category: 'AI Command',
  },
  {
    id: 'constraint',
    term: 'Constraint',
    pronunciation: '컨스트레인트',
    koreanMeaning: '선택지를 제한하는 조건',
    simpleMeaning: '반드시 지켜야 하는 제약입니다.',
    joovisUsage: '백엔드, DB, 로그인 금지는 이 앱의 핵심 constraint입니다.',
    checkQuestion: '이 설계에서 절대 하지 말아야 할 일은 무엇인가요?',
    codexPromptExample: 'Constraint를 지켜서 외부 서비스 없이 localStorage만 사용해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'assumption',
    term: 'Assumption',
    pronunciation: '어섬션',
    koreanMeaning: '명시되지 않았지만 임시로 참이라고 두는 전제',
    simpleMeaning: '확실하지 않지만 진행을 위해 둔 가정입니다.',
    joovisUsage: '명시가 없으면 mobile-first 레이아웃을 기본 assumption으로 둡니다.',
    checkQuestion: '지금 내가 가정하고 있는 것은 무엇인가요?',
    codexPromptExample: '불명확한 부분은 안전한 assumption으로 처리하고 최종 보고에 남겨 주세요.',
    category: 'AI Command',
  },
  {
    id: 'clarifying-question',
    term: 'Clarifying Question',
    pronunciation: '클래리파잉 퀘스천',
    koreanMeaning: '모호한 요구를 분명히 하기 위해 묻는 질문',
    simpleMeaning: '잘못 구현하기 전에 확인하는 질문입니다.',
    joovisUsage: '경로가 불분명하면 구현 전에 clarifying question이 필요합니다.',
    checkQuestion: '지금 묻지 않으면 위험한 모호함이 있나요?',
    codexPromptExample: '위험한 선택지가 있으면 한 가지 clarifying question만 묻고 기다려 주세요.',
    category: 'AI Command',
  },
  {
    id: 'plan',
    term: 'Plan',
    pronunciation: '플랜',
    koreanMeaning: '작업을 어떤 순서로 할지 정한 실행 흐름',
    simpleMeaning: '무엇을 먼저 하고 다음에 할지 정리한 것입니다.',
    joovisUsage: 'scaffold, data, UI, PWA, build 순서가 간단한 plan입니다.',
    checkQuestion: '검증까지 포함한 순서가 있나요?',
    codexPromptExample: '작업 plan을 세운 뒤 각 단계가 끝날 때 상태를 업데이트해 주세요.',
    category: 'AI Command',
  },
  {
    id: 'checklist',
    term: 'Checklist',
    pronunciation: '체크리스트',
    koreanMeaning: '빠뜨리지 않기 위해 확인할 항목 목록',
    simpleMeaning: '끝내기 전에 보는 확인표입니다.',
    joovisUsage: '최종 보고의 boundary confirmation은 안전 checklist입니다.',
    checkQuestion: '완료 전에 반드시 확인할 항목은 무엇인가요?',
    codexPromptExample: '요구사항을 checklist로 보고 누락된 기능이 있으면 채워 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'checkpoint',
    term: 'Checkpoint',
    pronunciation: '체크포인트',
    koreanMeaning: '긴 작업 중 중간 상태를 확인하는 지점',
    simpleMeaning: '여기까지 맞는지 확인하는 멈춤점입니다.',
    joovisUsage: 'npm install 성공, 빌드 성공, PWA 파일 존재가 checkpoint입니다.',
    checkQuestion: '다음 단계로 가기 전에 무엇을 확인해야 하나요?',
    codexPromptExample: '파일 편집 후 build를 checkpoint로 삼아 오류를 바로 수정해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'token-budget',
    term: 'Token Budget',
    pronunciation: '토큰 버짓',
    koreanMeaning: 'AI가 한 번에 읽고 쓸 수 있는 문맥의 사용량 한도',
    simpleMeaning: '대화와 코드 설명에 쓸 수 있는 공간입니다.',
    joovisUsage: '필요한 파일만 읽는 것이 token budget 관리입니다.',
    checkQuestion: '지금 필요한 정보만 읽고 있나요?',
    codexPromptExample: 'Token budget을 아끼기 위해 관련 파일만 읽고 요약해 주세요.',
    category: 'AI Command',
  },
  {
    id: 'state',
    term: 'State',
    pronunciation: '스테이트',
    koreanMeaning: '현재 화면이나 기능이 기억하고 있는 값',
    simpleMeaning: '앱의 현재 상태입니다.',
    joovisUsage: '검색어, 선택 카테고리, 즐겨찾기, 복습 상태가 React state입니다.',
    checkQuestion: '이 값은 화면 상태인가요, 저장해야 하는 사용자 상태인가요?',
    codexPromptExample: 'State를 검색 필터와 저장 데이터로 나누어 관리해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'reducer',
    term: 'Reducer',
    pronunciation: '리듀서',
    koreanMeaning: '현재 상태와 action으로 다음 상태를 만드는 함수',
    simpleMeaning: '상태 변경 규칙을 한곳에 모으는 방식입니다.',
    joovisUsage: '이 앱은 작아서 reducer 없이 useState로 충분합니다.',
    checkQuestion: '상태 변경이 복잡해서 규칙을 모을 필요가 있나요?',
    codexPromptExample: 'Reducer가 필요할 만큼 복잡하지 않으면 단순한 useState로 유지해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'selector',
    term: 'Selector',
    pronunciation: '셀렉터',
    koreanMeaning: '큰 상태나 데이터에서 필요한 값만 골라내는 함수',
    simpleMeaning: '보여 줄 데이터만 추려내는 필터입니다.',
    joovisUsage: 'visibleTerms 계산은 검색과 카테고리를 적용하는 selector입니다.',
    checkQuestion: '화면에 필요한 값은 어디서 계산하나요?',
    codexPromptExample: 'Term list selector를 useMemo로 만들고 검색 필드를 모두 포함해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'validation',
    term: 'Validation',
    pronunciation: '밸리데이션',
    koreanMeaning: '값이 정해진 규칙에 맞는지 확인하는 것',
    simpleMeaning: '입력이나 데이터가 올바른지 검사합니다.',
    joovisUsage: 'TypeScript 타입과 빌드는 용어 데이터 validation 역할을 합니다.',
    checkQuestion: '이 데이터가 올바른지 어떤 규칙으로 확인하나요?',
    codexPromptExample: 'Validation 오류가 생기면 데이터 shape를 고쳐 build가 통과하게 해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'normalization',
    term: 'Normalization',
    pronunciation: '노멀라이제이션',
    koreanMeaning: '비교와 저장이 쉽도록 값을 일정한 형태로 바꾸는 것',
    simpleMeaning: '검색하기 좋게 소문자나 공백 처리 등을 맞춥니다.',
    joovisUsage: '검색어를 소문자로 바꾸는 과정이 normalization입니다.',
    checkQuestion: '비교 전에 같은 기준으로 값을 맞췄나요?',
    codexPromptExample: 'Search normalization을 적용해서 영어와 한국어 검색이 안정적으로 되게 해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'serialization',
    term: 'Serialization',
    pronunciation: '시리얼라이제이션',
    koreanMeaning: '객체를 저장 가능한 문자열 형태로 바꾸는 것',
    simpleMeaning: '저장소에 넣기 위해 JSON 문자열로 바꾸는 과정입니다.',
    joovisUsage: '즐겨찾기 Set을 배열로 바꾼 뒤 JSON으로 저장하는 것이 serialization입니다.',
    checkQuestion: '이 값은 저장 가능한 형태로 변환되나요?',
    codexPromptExample: 'localStorage 저장 전에 Set을 serialization 가능한 배열로 바꿔 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'versioning',
    term: 'Versioning',
    pronunciation: '버저닝',
    koreanMeaning: '변경 이력을 구분하기 위해 버전을 붙이는 것',
    simpleMeaning: '어떤 버전의 구조인지 표시합니다.',
    joovisUsage: 'service worker cache 이름에 versioning을 쓰면 새 빌드 반영이 쉬워집니다.',
    checkQuestion: '이 저장 구조나 캐시는 버전 구분이 필요한가요?',
    codexPromptExample: 'Service worker cache 이름에 versioning을 넣어 오래된 캐시를 정리해 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'backward-compatibility',
    term: 'Backward Compatibility',
    pronunciation: '백워드 컴패터빌리티',
    koreanMeaning: '새 코드가 기존 데이터나 사용 방식과 계속 맞는 성질',
    simpleMeaning: '예전 상태를 새 버전에서도 읽을 수 있는 것입니다.',
    joovisUsage: 'localStorage 키를 바꿀 때 기존 즐겨찾기를 잃지 않는 것이 backward compatibility입니다.',
    checkQuestion: '기존 사용자의 저장 상태가 계속 읽히나요?',
    codexPromptExample: '기존 localStorage 값을 고려해 backward compatibility를 유지해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'forward-compatibility',
    term: 'Forward Compatibility',
    pronunciation: '포워드 컴패터빌리티',
    koreanMeaning: '미래 구조 일부를 만나도 크게 깨지지 않는 성질',
    simpleMeaning: '새로운 값이 와도 안전하게 무시하거나 처리합니다.',
    joovisUsage: '알 수 없는 review status가 있어도 앱이 기본 상태로 보이면 forward compatibility가 좋습니다.',
    checkQuestion: '알 수 없는 값이 와도 화면이 안전하게 동작하나요?',
    codexPromptExample: 'Forward compatibility를 위해 모르는 상태값은 new처럼 표시해 주세요.',
    category: 'Data / Schema',
  },
  {
    id: 'fallback',
    term: 'Fallback',
    pronunciation: '폴백',
    koreanMeaning: '기본 방법이 실패했을 때 쓰는 대체 방법',
    simpleMeaning: '안 될 때 대신 쓰는 안전한 선택지입니다.',
    joovisUsage: 'localStorage 읽기에 실패하면 빈 즐겨찾기 목록으로 fallback합니다.',
    checkQuestion: '실패했을 때 사용자에게 안전한 기본값이 있나요?',
    codexPromptExample: 'Storage 접근이 실패하면 fallback으로 빈 상태를 사용하게 해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'timeout',
    term: 'Timeout',
    pronunciation: '타임아웃',
    koreanMeaning: '정해진 시간 안에 끝나지 않으면 중단하는 제한',
    simpleMeaning: '너무 오래 걸리면 멈추는 시간 제한입니다.',
    joovisUsage: '이 앱에는 외부 요청이 없어서 runtime timeout 처리가 거의 필요 없습니다.',
    checkQuestion: '끝나지 않을 수 있는 작업이 있나요?',
    codexPromptExample: '외부 요청을 만들지 말고 timeout이 필요한 흐름 자체를 추가하지 마세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'retry',
    term: 'Retry',
    pronunciation: '리트라이',
    koreanMeaning: '실패한 작업을 다시 시도하는 것',
    simpleMeaning: '한 번 더 해 보는 복구 방식입니다.',
    joovisUsage: 'service worker 등록 실패는 앱 사용을 막지 않으므로 복잡한 retry UI를 만들지 않습니다.',
    checkQuestion: '다시 시도하면 실제로 성공 가능성이 높아지나요?',
    codexPromptExample: 'Retry 로직을 복잡하게 만들지 말고 정적 앱으로 단순하게 유지해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'cache',
    term: 'Cache',
    pronunciation: '캐시',
    koreanMeaning: '다시 쓰기 위해 임시로 저장해 둔 데이터나 파일',
    simpleMeaning: '빠르고 오프라인에 쓰기 위해 보관하는 복사본입니다.',
    joovisUsage: 'service worker cache는 앱 shell 파일을 저장해 홈 화면 실행을 돕습니다.',
    checkQuestion: '오래된 cache가 새 변경을 가리지 않나요?',
    codexPromptExample: 'Cache 이름을 버전으로 관리하고 오래된 cache를 activate 단계에서 지워 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'offline-first',
    term: 'Offline-first',
    pronunciation: '오프라인 퍼스트',
    koreanMeaning: '네트워크가 없어도 먼저 동작하도록 설계하는 방식',
    simpleMeaning: '인터넷 없이도 기본 기능이 되는 앱입니다.',
    joovisUsage: '이 학습 PWA는 정적 데이터와 localStorage로 offline-first에 가깝게 동작합니다.',
    checkQuestion: '네트워크 없이도 핵심 학습 기능이 되나요?',
    codexPromptExample: 'Offline-first를 위해 모든 용어 데이터를 번들 안에 포함해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'least-privilege',
    term: 'Least Privilege',
    pronunciation: '리스트 프리빌리지',
    koreanMeaning: '필요한 최소 권한만 사용하는 원칙',
    simpleMeaning: '할 일에 꼭 필요한 접근만 허용합니다.',
    joovisUsage: '이 앱은 계정 권한 없이 브라우저 저장소만 씁니다.',
    checkQuestion: '이 기능에 이 권한이 정말 필요한가요?',
    codexPromptExample: 'Least privilege 원칙으로 localStorage 외 권한을 요구하지 않게 해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'redaction',
    term: 'Redaction',
    pronunciation: '리댁션',
    koreanMeaning: '민감한 정보를 가리거나 제거하는 것',
    simpleMeaning: '보이면 안 되는 값을 숨기는 처리입니다.',
    joovisUsage: '이 앱은 비밀값을 쓰지 않지만 보고 전 민감 정보가 없는지 redaction 관점으로 봅니다.',
    checkQuestion: '공개하면 안 되는 정보가 출력에 포함되어 있나요?',
    codexPromptExample: '보고 전 redaction이 필요한 값이 있는지 확인하고 비밀값은 만들지 마세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'secret',
    term: 'Secret',
    pronunciation: '시크릿',
    koreanMeaning: '노출되면 안 되는 인증 정보나 민감한 값',
    simpleMeaning: '코드에 넣으면 안 되는 비밀 정보입니다.',
    joovisUsage: 'JOOVIS Terms Cockpit은 secret이나 .env 없이 동작해야 합니다.',
    checkQuestion: '이 값이 코드나 브라우저에 저장되어도 안전한가요?',
    codexPromptExample: 'Secret, .env, 토큰을 만들지 말고 정적 데이터만 사용해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'audit-trail',
    term: 'Audit Trail',
    pronunciation: '오딧 트레일',
    koreanMeaning: '누가 무엇을 언제 바꿨는지 따라갈 수 있는 기록',
    simpleMeaning: '변경의 흔적을 추적할 수 있게 남긴 것입니다.',
    joovisUsage: 'git diff와 최종 보고는 이번 작업의 audit trail로 볼 수 있습니다.',
    checkQuestion: '이 변경을 나중에 추적할 수 있나요?',
    codexPromptExample: 'Audit trail이 흐려지지 않게 관련 없는 파일 변경은 만들지 마세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'read-only-mode',
    term: 'Read-only Mode',
    pronunciation: '리드 온리 모드',
    koreanMeaning: '읽기만 허용하고 쓰기는 막는 상태',
    simpleMeaning: '확인만 하고 변경하지 않는 방식입니다.',
    joovisUsage: '기존 프로젝트 접근 금지는 read-only보다 더 강한 boundary입니다.',
    checkQuestion: '지금은 읽어도 되는가요, 아예 접근하면 안 되나요?',
    codexPromptExample: '다른 JOOVIS 저장소는 read-only로도 접근하지 말고 현재 폴더만 사용해 주세요.',
    category: 'Boundary / Safety',
  },
  {
    id: 'no-op',
    term: 'No-op',
    pronunciation: '노옵',
    koreanMeaning: '아무 변화도 만들지 않는 동작',
    simpleMeaning: '실행해도 상태가 바뀌지 않는 일입니다.',
    joovisUsage: '저장 실패는 앱이 멈추지 않도록 no-op처럼 안전하게 처리합니다.',
    checkQuestion: '이 동작이 실제로 무엇을 바꾸나요?',
    codexPromptExample: '필요 없는 클릭은 no-op으로 안전하게 처리되게 해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'edge-case',
    term: 'Edge Case',
    pronunciation: '엣지 케이스',
    koreanMeaning: '자주 생기지는 않지만 오류를 만들 수 있는 경계 상황',
    simpleMeaning: '끝부분에서 발생하는 특수한 경우입니다.',
    joovisUsage: '검색 결과가 0개일 때 메시지를 보여 주는 것은 edge case 처리입니다.',
    checkQuestion: '빈 목록, 긴 텍스트, 저장 실패 상황은 처리되나요?',
    codexPromptExample: 'Edge case로 검색 결과 0개와 localStorage 실패를 확인해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'happy-path',
    term: 'Happy Path',
    pronunciation: '해피 패스',
    koreanMeaning: '모든 입력과 조건이 정상일 때의 기본 흐름',
    simpleMeaning: '사용자가 기대대로 사용하는 가장 평범한 길입니다.',
    joovisUsage: '앱 열기, 오늘의 용어 보기, 검색하기, 즐겨찾기 저장이 happy path입니다.',
    checkQuestion: '정상 사용 흐름이 빠르고 분명하게 보이나요?',
    codexPromptExample: 'Happy path를 모바일 화면에서 먼저 완성하고 예외 처리를 더해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'repro-steps',
    term: 'Repro Steps',
    pronunciation: '리프로 스텝스',
    koreanMeaning: '문제를 다시 재현하기 위한 단계',
    simpleMeaning: '버그를 똑같이 보이게 하는 순서입니다.',
    joovisUsage: '검색이 안 된다면 어떤 단어를 입력했고 어떤 필터였는지 repro steps가 필요합니다.',
    checkQuestion: '다른 사람이 같은 문제를 다시 볼 수 있나요?',
    codexPromptExample: '버그를 고치기 전에 repro steps를 짧게 정리해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'finding',
    term: 'Finding',
    pronunciation: '파인딩',
    koreanMeaning: '리뷰에서 발견한 문제나 위험',
    simpleMeaning: '고쳐야 할 가능성이 있는 지적 사항입니다.',
    joovisUsage: '카드가 모바일에서 겹치면 review finding으로 남깁니다.',
    checkQuestion: '이 발견은 실제 사용자 영향이 있나요?',
    codexPromptExample: 'Review finding은 파일과 증상을 함께 쓰고 추측만으로 단정하지 마세요.',
    category: 'Review / QA',
  },
  {
    id: 'severity',
    term: 'Severity',
    pronunciation: '시비어리티',
    koreanMeaning: '문제의 심각도',
    simpleMeaning: '얼마나 위험하거나 급한 문제인지 나타냅니다.',
    joovisUsage: '빌드 실패는 높고, 작은 문구 오타는 낮은 severity입니다.',
    checkQuestion: '이 문제가 사용을 막나요, 아니면 개선 사항인가요?',
    codexPromptExample: 'Findings를 severity 순서로 정렬하고 빌드 실패를 최우선으로 다뤄 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'review-thread',
    term: 'Review Thread',
    pronunciation: '리뷰 스레드',
    koreanMeaning: '하나의 코드 리뷰 의견과 그 답변 흐름',
    simpleMeaning: '리뷰 대화 묶음입니다.',
    joovisUsage: '여러 의견이 있으면 각 review thread의 실제 요청을 분리해 처리합니다.',
    checkQuestion: '이 스레드가 요구하는 행동은 무엇인가요?',
    codexPromptExample: 'Review thread마다 actionable한 요청만 뽑아 구현 여부를 표시해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'test-coverage',
    term: 'Test Coverage',
    pronunciation: '테스트 커버리지',
    koreanMeaning: '테스트가 코드의 어느 범위를 확인하는지 나타내는 정도',
    simpleMeaning: '테스트가 얼마나 넓게 보호하는지 보는 지표입니다.',
    joovisUsage: '이 작은 앱에서는 build와 수동 smoke 확인이 최소 coverage 역할을 합니다.',
    checkQuestion: '위험한 로직을 검증하는 테스트나 확인이 있나요?',
    codexPromptExample: '변경 위험이 크면 test coverage를 늘리고 작으면 build 검증을 우선해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'typecheck',
    term: 'Typecheck',
    pronunciation: '타입체크',
    koreanMeaning: 'TypeScript 타입 규칙에 맞는지 확인하는 검사',
    simpleMeaning: '값의 형태가 약속과 맞는지 보는 검사입니다.',
    joovisUsage: 'npm run build의 tsc 단계가 이 앱의 typecheck입니다.',
    checkQuestion: '타입 오류 없이 데이터와 컴포넌트가 연결되나요?',
    codexPromptExample: '구현 후 typecheck가 포함된 npm run build를 실행해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'lint',
    term: 'Lint',
    pronunciation: '린트',
    koreanMeaning: '코드 스타일과 잠재 오류를 자동으로 검사하는 것',
    simpleMeaning: '코드를 깔끔하고 안전하게 보는 검사입니다.',
    joovisUsage: 'Vite scaffold의 lint는 React hook 규칙 등을 확인합니다.',
    checkQuestion: '자동 검사에서 경고나 오류가 남아 있나요?',
    codexPromptExample: 'Lint script가 있으면 실행하고 실패하면 범위 안에서 수정해 주세요.',
    category: 'Review / QA',
  },
  {
    id: 'build',
    term: 'Build',
    pronunciation: '빌드',
    koreanMeaning: '소스 코드를 배포 가능한 정적 파일로 만드는 과정',
    simpleMeaning: '브라우저가 실행할 파일로 묶는 작업입니다.',
    joovisUsage: 'npm run build는 TypeScript와 Vite 번들을 모두 확인합니다.',
    checkQuestion: '배포 가능한 결과물이 실제로 생성되나요?',
    codexPromptExample: '마지막에 npm run build를 실행하고 실패하면 고쳐 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'commit',
    term: 'Commit',
    pronunciation: '커밋',
    koreanMeaning: '변경 내용을 버전 관리 기록으로 저장하는 단위',
    simpleMeaning: '작업을 하나의 기록으로 묶는 것입니다.',
    joovisUsage: '작은 기능 단위로 commit하면 변경 이유를 이해하기 쉽습니다.',
    checkQuestion: '이 변경은 하나의 의미 있는 묶음인가요?',
    codexPromptExample: 'Commit은 요청받은 경우에만 만들고 이번 구현 범위만 포함해 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'branch',
    term: 'Branch',
    pronunciation: '브랜치',
    koreanMeaning: '버전 관리에서 독립적으로 변경을 진행하는 흐름',
    simpleMeaning: '다른 작업과 분리된 변경 줄기입니다.',
    joovisUsage: '이 새 프로젝트는 기존 JOOVIS repo branch와 관계없이 독립적으로 작업합니다.',
    checkQuestion: '현재 작업이 어떤 branch나 폴더에서 진행되나요?',
    codexPromptExample: 'Branch 상태를 확인하되 현재 workspace 밖 저장소는 접근하지 마세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'pull-request',
    term: 'Pull Request',
    pronunciation: '풀 리퀘스트',
    koreanMeaning: '변경을 검토하고 합치기 위해 올리는 요청',
    simpleMeaning: '코드를 합치기 전 리뷰받는 단위입니다.',
    joovisUsage: '독립 앱 변경은 별도 PR로 다룰 수 있지만 이 작업은 로컬 생성에 집중합니다.',
    checkQuestion: '리뷰어가 이해할 수 있는 변경 설명이 있나요?',
    codexPromptExample: 'Pull request 설명이 필요하면 구현 범위와 검증 결과만 간결하게 적어 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'merge-conflict',
    term: 'Merge Conflict',
    pronunciation: '머지 컨플릭트',
    koreanMeaning: '서로 다른 변경이 같은 부분을 바꿔 자동 병합이 안 되는 상태',
    simpleMeaning: '어떤 변경을 살릴지 사람이 골라야 하는 충돌입니다.',
    joovisUsage: '빈 폴더에서 새로 만든 앱은 기존 파일과 merge conflict가 없습니다.',
    checkQuestion: '같은 파일 같은 줄을 여러 변경이 건드렸나요?',
    codexPromptExample: 'Merge conflict가 생기면 양쪽 의도를 읽고 필요한 변경만 남겨 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'release-note',
    term: 'Release Note',
    pronunciation: '릴리즈 노트',
    koreanMeaning: '사용자에게 전달할 변경 사항 요약',
    simpleMeaning: '이번 버전에 무엇이 들어갔는지 적은 글입니다.',
    joovisUsage: '이 앱은 문서 생성을 요구하지 않으므로 별도 release note는 만들지 않습니다.',
    checkQuestion: '사용자에게 알려야 할 변경이 있나요?',
    codexPromptExample: 'Release note 파일은 만들지 말고 최종 보고에 구현 기능만 요약해 주세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'changelog',
    term: 'Changelog',
    pronunciation: '체인지로그',
    koreanMeaning: '버전별 변경 이력을 모아 둔 기록',
    simpleMeaning: '무엇이 언제 바뀌었는지 쌓아 둔 목록입니다.',
    joovisUsage: '요청이 없으면 이 작은 독립 앱에는 changelog 파일을 만들지 않습니다.',
    checkQuestion: '변경 이력을 별도 파일로 남길 필요가 있나요?',
    codexPromptExample: 'Changelog는 만들지 말고 final report 형식만 따르세요.',
    category: 'Git / Change Control',
  },
  {
    id: 'feature-flag',
    term: 'Feature Flag',
    pronunciation: '피처 플래그',
    koreanMeaning: '기능을 켜고 끄는 설정 스위치',
    simpleMeaning: '기능 노출을 조절하는 스위치입니다.',
    joovisUsage: '이 앱은 단순 정적 앱이므로 원격 feature flag가 필요 없습니다.',
    checkQuestion: '이 기능은 별도 스위치가 필요한가요?',
    codexPromptExample: 'Feature flag 시스템을 추가하지 말고 요청된 기능을 바로 구현해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'localstorage',
    term: 'LocalStorage',
    pronunciation: '로컬스토리지',
    koreanMeaning: '브라우저 안에 작은 문자열 데이터를 저장하는 공간',
    simpleMeaning: '기기 브라우저에 즐겨찾기 같은 값을 저장합니다.',
    joovisUsage: '즐겨찾기와 review status는 localStorage에만 저장됩니다.',
    checkQuestion: '이 데이터는 로컬 기기 안에만 있어도 되나요?',
    codexPromptExample: 'Favorites와 review status는 localStorage만 사용하고 동기화는 만들지 마세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'service-worker',
    term: 'Service Worker',
    pronunciation: '서비스 워커',
    koreanMeaning: '브라우저가 캐시와 오프라인 동작을 돕는 스크립트',
    simpleMeaning: 'PWA 설치와 오프라인 실행을 돕는 브라우저 기능입니다.',
    joovisUsage: 'public/service-worker.js는 정적 파일 캐시를 담당합니다.',
    checkQuestion: '서비스 워커가 외부 작업을 하거나 알림을 보내지는 않나요?',
    codexPromptExample: 'Service worker는 캐시만 담당하게 하고 push notification은 추가하지 마세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'manifest',
    term: 'Manifest',
    pronunciation: '매니페스트',
    koreanMeaning: 'PWA 이름, 아이콘, 표시 방식 등을 정의하는 파일',
    simpleMeaning: '홈 화면 설치에 필요한 앱 정보 파일입니다.',
    joovisUsage: 'manifest.webmanifest는 앱 이름을 JOOVIS Terms Cockpit으로 제공합니다.',
    checkQuestion: '앱 이름, 아이콘, display 설정이 manifest에 들어 있나요?',
    codexPromptExample: 'Manifest에 name, short_name, display, theme_color, icons를 넣어 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'installability',
    term: 'Installability',
    pronunciation: '인스톨러빌리티',
    koreanMeaning: '웹앱이 홈 화면에 설치될 수 있는 조건을 만족하는 정도',
    simpleMeaning: '브라우저가 앱처럼 설치할 수 있다고 판단하는 상태입니다.',
    joovisUsage: 'manifest와 service worker가 있으면 Android 홈 화면 설치 조건에 가까워집니다.',
    checkQuestion: 'PWA 설치에 필요한 기본 파일이 모두 있나요?',
    codexPromptExample: 'Installability를 위해 manifest와 service worker를 추가하고 build 결과를 확인해 주세요.',
    category: 'Runtime / Integration',
  },
  {
    id: 'pwa',
    term: 'PWA',
    pronunciation: '피더블유에이',
    koreanMeaning: '설치형 앱처럼 동작할 수 있는 웹앱',
    simpleMeaning: '브라우저 앱이지만 홈 화면에 설치해 쓸 수 있습니다.',
    joovisUsage: 'JOOVIS Terms Cockpit은 Android 홈 화면 설치를 목표로 한 PWA입니다.',
    checkQuestion: '이 웹앱은 설치형 경험에 필요한 최소 조건을 갖췄나요?',
    codexPromptExample: 'PWA 요구사항을 만족하되 네이티브 Android 코드는 만들지 마세요.',
    category: 'JOOVIS-Specific',
  },
  {
    id: 'cockpit',
    term: 'Cockpit',
    pronunciation: '콕핏',
    koreanMeaning: '중요 정보를 한 화면에서 조작하고 확인하는 작업 공간',
    simpleMeaning: '학습 상태와 용어를 빠르게 보는 조종석 같은 화면입니다.',
    joovisUsage: 'Terms Cockpit은 오늘의 용어, 검색, 필터, 복습 상태를 한곳에 모읍니다.',
    checkQuestion: '핵심 행동이 첫 화면에서 바로 가능한가요?',
    codexPromptExample: 'Cockpit처럼 첫 화면에 오늘의 용어와 검색, 필터를 모두 배치해 주세요.',
    category: 'JOOVIS-Specific',
  },
  {
    id: 'learning-loop',
    term: 'Learning Loop',
    pronunciation: '러닝 루프',
    koreanMeaning: '보고, 확인하고, 다시 복습하는 반복 학습 흐름',
    simpleMeaning: '알기와 다시 보기 사이를 반복하는 학습 습관입니다.',
    joovisUsage: 'known과 review_again 버튼은 개인 learning loop를 만듭니다.',
    checkQuestion: '사용자가 다음에 무엇을 복습해야 하는지 표시되나요?',
    codexPromptExample: 'Learning loop를 위해 known/review_again 상태를 localStorage에 저장해 주세요.',
    category: 'JOOVIS-Specific',
  },
  {
    id: 'term-card',
    term: 'Term Card',
    pronunciation: '텀 카드',
    koreanMeaning: '하나의 용어 설명과 복습 조작을 담은 카드',
    simpleMeaning: '단어 하나를 공부하는 최소 화면 단위입니다.',
    joovisUsage: 'TermCard 컴포넌트는 의미, 사용 예, 확인 질문, 프롬프트 예시를 표시합니다.',
    checkQuestion: '카드 하나만 봐도 용어를 이해하고 복습 처리할 수 있나요?',
    codexPromptExample: 'Term card에 모든 필수 필드를 표시하고 모바일에서 읽기 좋게 해 주세요.',
    category: 'JOOVIS-Specific',
  },
  {
    id: 'review-queue',
    term: 'Review Queue',
    pronunciation: '리뷰 큐',
    koreanMeaning: '다시 볼 항목을 모아 둔 목록',
    simpleMeaning: '복습해야 할 것들이 기다리는 줄입니다.',
    joovisUsage: 'review_again 상태인 용어들은 사용자의 review queue 역할을 합니다.',
    checkQuestion: '다시 볼 항목을 구분할 수 있나요?',
    codexPromptExample: 'Review queue를 별도 서버 없이 localStorage 상태로 표현해 주세요.',
    category: 'JOOVIS-Specific',
  },
  {
    id: 'command-hygiene',
    term: 'Command Hygiene',
    pronunciation: '커맨드 하이진',
    koreanMeaning: '명령을 안전하고 재현 가능하게 쓰는 습관',
    simpleMeaning: '명령을 실행하기 전에 위치와 영향을 확인하는 태도입니다.',
    joovisUsage: '현재 폴더 확인 후 npm 명령을 실행하는 것이 command hygiene입니다.',
    checkQuestion: '명령이 어느 폴더에서 무엇을 바꾸는지 분명한가요?',
    codexPromptExample: 'Command hygiene을 지켜 현재 workspace에서만 npm install과 build를 실행해 주세요.',
    category: 'JOOVIS-Specific',
  },
] satisfies RawDevTerm[]

const aiCommandTerms = [
  makeAiTerm({
    term: 'Task Boundary Prompt',
    pronunciation: '태스크 바운더리 프롬프트',
    koreanMeaning: 'AI에게 작업 경계와 금지 경계를 함께 알려 주는 지시',
    simpleMeaning: '무엇을 할지와 하지 않을지를 한 번에 말하는 프롬프트입니다.',
    category: 'Prompt Quality',
    difficulty: 'basic',
    badExpression: '이거 해줘.',
    goodExpression: '현재 폴더 안에서만 수정하고, 금지 경계와 검증 결과를 마지막에 분리해서 보고해줘.',
    relatedTerms: ['Scope', 'Boundary', 'Constraint'],
  }),
  makeAiTerm({
    term: 'Ambiguity Budget',
    pronunciation: '앰비규이티 버짓',
    koreanMeaning: '요청 안에 남겨도 되는 모호함의 허용량',
    simpleMeaning: 'AI가 추측해도 되는 부분과 물어봐야 하는 부분을 나누는 기준입니다.',
    category: 'Prompt Quality',
    difficulty: 'intermediate',
    badExpression: '적당히 알아서 해.',
    goodExpression: '명확한 요구는 바로 실행하고, 위험한 모호함은 작업 전에 질문해줘.',
    relatedTerms: ['Assumption', 'Clarifying Question'],
  }),
  makeAiTerm({
    term: 'Output Contract',
    pronunciation: '아웃풋 컨트랙트',
    koreanMeaning: 'AI 답변이 따라야 하는 출력 형식 약속',
    simpleMeaning: '마지막 보고서나 분석 결과의 모양을 미리 정하는 것입니다.',
    category: 'Prompt Quality',
    difficulty: 'basic',
    badExpression: '결과 알려줘.',
    goodExpression: 'STATUS, 변경 파일, 검증, 남은 위험 순서로만 보고해줘.',
    relatedTerms: ['Contract', 'Acceptance Criteria'],
  }),
  makeAiTerm({
    term: 'Evidence Request',
    pronunciation: '에비던스 리퀘스트',
    koreanMeaning: 'AI에게 주장만 말하지 말고 근거를 함께 요구하는 지시',
    simpleMeaning: '왜 그렇게 판단했는지 확인 가능한 근거를 요구합니다.',
    category: 'Review / QA',
    difficulty: 'intermediate',
    badExpression: '괜찮은지 봐줘.',
    goodExpression: '문제라고 판단한 근거 파일, 줄, 재현 조건을 함께 제시해줘.',
    relatedTerms: ['Finding', 'Repro Steps'],
  }),
  makeAiTerm({
    term: 'Stop Condition',
    pronunciation: '스톱 컨디션',
    koreanMeaning: 'AI가 계속 진행하지 말고 멈춰야 하는 조건',
    simpleMeaning: '위험하거나 정보가 부족할 때 멈추는 규칙입니다.',
    category: 'Boundary / Safety',
    difficulty: 'basic',
    badExpression: '막히면 알아서 해.',
    goodExpression: '경로가 맞지 않거나 외부 repo 접근이 필요하면 즉시 멈추고 BLOCKED로 보고해줘.',
    relatedTerms: ['Fail-closed', 'Guard'],
  }),
  makeAiTerm({
    term: 'Review Lens',
    pronunciation: '리뷰 렌즈',
    koreanMeaning: 'AI가 어떤 관점으로 코드를 볼지 정하는 기준',
    simpleMeaning: '버그, UX, 보안, 성능 중 무엇을 우선 볼지 지정합니다.',
    category: 'Review / QA',
    difficulty: 'intermediate',
    badExpression: '전체적으로 리뷰해줘.',
    goodExpression: '버그와 회귀 위험을 먼저 보고, 스타일 의견은 마지막에 분리해줘.',
    relatedTerms: ['Finding', 'Severity'],
  }),
  makeAiTerm({
    term: 'Context Compression',
    pronunciation: '컨텍스트 컴프레션',
    koreanMeaning: '긴 맥락을 핵심 판단 정보로 압축하는 것',
    simpleMeaning: 'AI가 놓치지 않게 중요한 사실만 구조화합니다.',
    category: 'AI Command',
    difficulty: 'advanced',
    badExpression: '이 대화 전체 기억해서 해.',
    goodExpression: '목표, 금지사항, 현재 상태, 마지막 결정만 요약해서 다음 작업 기준으로 삼아줘.',
    relatedTerms: ['Context', 'Token Budget'],
  }),
  makeAiTerm({
    term: 'Verification Prompt',
    pronunciation: '베리피케이션 프롬프트',
    koreanMeaning: '완료 전에 검증을 요구하는 지시',
    simpleMeaning: 'AI가 구현 후 빌드, 테스트, 수동 확인을 하게 만듭니다.',
    category: 'Review / QA',
    difficulty: 'basic',
    badExpression: '끝나면 말해.',
    goodExpression: '구현 후 build와 lint를 실행하고 실패하면 고친 뒤 결과를 보고해줘.',
    relatedTerms: ['Validation', 'Checker'],
  }),
] satisfies RawDevTerm[]

const librariesToolTerms = [
  makeToolTerm('React', '리액트', 'UI를 컴포넌트 단위로 만드는 JavaScript 라이브러리', '화면을 작은 부품으로 나누어 조립합니다.', 'Frontend Frameworks'),
  makeToolTerm('Component', '컴포넌트', '재사용 가능한 UI 또는 기능 단위', '버튼, 카드, 화면 조각처럼 독립된 부품입니다.', 'React'),
  makeToolTerm('Hook', '훅', 'React에서 상태와 생명주기 기능을 쓰는 함수 패턴', 'useState, useMemo처럼 컴포넌트에 기능을 붙입니다.', 'React'),
  makeToolTerm('Vite', '비트', '빠른 개발 서버와 빌드 도구', 'React 앱을 빠르게 실행하고 dist로 빌드합니다.', 'Build Tools'),
  makeToolTerm('TypeScript', '타입스크립트', 'JavaScript에 타입 검사를 더한 언어', '데이터 shape와 함수 계약을 빌드 전에 확인합니다.', 'Languages'),
  makeToolTerm('Node.js', '노드 제이에스', '브라우저 밖에서 JavaScript를 실행하는 런타임', 'npm, Vite, 빌드 도구가 주로 Node.js에서 실행됩니다.', 'Runtime'),
  makeToolTerm('npm', '엔피엠', 'Node.js 패키지 설치와 스크립트 실행 도구', 'npm.cmd run build처럼 프로젝트 명령을 실행합니다.', 'Package Managers'),
  makeToolTerm('package.json', '패키지 제이슨', '프로젝트 스크립트와 의존성을 적는 파일', 'build, lint 같은 명령과 React 의존성을 관리합니다.', 'Package Managers'),
  makeToolTerm('ESLint', '이에스린트', '코드 스타일과 잠재 오류를 검사하는 도구', 'React hook 규칙과 위험한 패턴을 자동으로 확인합니다.', 'Quality Tools'),
  makeToolTerm('Python', '파이썬', '자동화, 데이터 처리, 분석에 자주 쓰는 언어', '간단한 스크립트나 데이터 점검에 유용합니다.', 'Languages'),
  makeToolTerm('pandas', '판다스', '표 형태 데이터를 다루는 Python 라이브러리', 'CSV, 엑셀, 데이터프레임 처리에 자주 쓰입니다.', 'Data Tools'),
  makeToolTerm('DuckDB', '덕디비', '파일 기반 분석 SQL 엔진', '로컬 parquet/CSV를 빠르게 질의할 때 유용합니다.', 'Data Tools'),
  makeToolTerm('JSON', '제이슨', '웹과 설정 파일에서 널리 쓰는 구조화 데이터 형식', 'manifest와 localStorage serialization에 자주 등장합니다.', 'Data Formats'),
  makeToolTerm('Parquet', '파케이', '분석용 컬럼 기반 데이터 파일 형식', '대용량 표 데이터를 효율적으로 읽고 저장합니다.', 'Data Formats'),
  makeToolTerm('CLI', '씨엘아이', '터미널에서 명령어로 쓰는 도구', 'npm.cmd, git, gh 같은 명령형 도구를 뜻합니다.', 'Terminal Tools'),
  makeToolTerm('PowerShell', '파워셸', 'Windows에서 자주 쓰는 셸과 자동화 환경', '현재 workspace에서 명령 실행과 파일 확인에 사용됩니다.', 'Terminal Tools'),
  makeToolTerm('GitHub', '깃허브', 'Git 저장소를 원격으로 관리하는 서비스', 'push된 코드를 Vercel이나 Cloudflare Pages가 배포할 수 있습니다.', 'Hosting Tools'),
  makeToolTerm('Vercel', '버셀', '프론트엔드 정적 앱 배포 플랫폼', 'GitHub push를 감지해 Vite 앱을 자동 배포합니다.', 'Hosting Tools'),
  makeToolTerm('Cloudflare Pages', '클라우드플레어 페이지스', '정적 웹앱 배포 플랫폼', 'dist 산출물을 전 세계 CDN에서 제공할 수 있습니다.', 'Hosting Tools'),
  makeToolTerm('Service Worker API', '서비스 워커 에이피아이', '브라우저에서 캐시와 오프라인 동작을 제어하는 API', 'PWA 설치성과 오프라인 앱 shell에 관여합니다.', 'Browser APIs'),
] satisfies RawDevTerm[]

const joovisArchitectureTerms = [
  makeJoovisTerm('LOCK', '락', '변경 가능 범위를 잠그는 JOOVIS식 보호 개념', '건드리면 안 되는 상태나 파일 경계를 명확히 표시합니다.', 'Boundary'),
  makeJoovisTerm('WBS', '더블유비에스', '작업을 작은 단위로 나누는 구조화 목록', '큰 목표를 검증 가능한 작업 단위로 쪼개는 기준입니다.', 'Planning'),
  makeJoovisTerm('Relay', '릴레이', '한 단계의 판단이나 산출물을 다음 단계로 넘기는 연결 방식', '작업 흐름에서 맥락과 결과가 끊기지 않게 전달합니다.', 'Flow'),
  makeJoovisTerm('Current Truth', '커런트 트루스', '현재 시점에서 기준으로 삼는 최신 정리 상태', '오래된 가정보다 지금 확인된 사실을 우선합니다.', 'Truth Surface'),
  makeJoovisTerm('Data Block', '데이터 블록', '의미 단위로 묶은 독립 데이터 조각', '검색, 검증, 인용을 쉽게 하도록 정보를 블록화합니다.', 'Data Structure'),
  makeJoovisTerm('Dynamic Knowledge Surface', '다이내믹 날리지 서피스', '상황에 따라 갱신되는 지식 표시 면', '정적인 문서가 아니라 현재 판단 가능한 지식면으로 봅니다.', 'Knowledge'),
  makeJoovisTerm('Agent Foundry', '에이전트 파운드리', '목적별 에이전트 역할을 설계하고 찍어내는 작업장 개념', '반복 작업을 역할 단위로 분리해 재사용합니다.', 'Agent Design'),
  makeJoovisTerm('Replay', '리플레이', '과거 실행이나 판단 흐름을 다시 재생해 보는 것', '왜 그런 결과가 나왔는지 되짚는 검증 방식입니다.', 'Review'),
  makeJoovisTerm('Autopsy', '오톱시', '실패한 흐름을 사후 분석하는 절차', '문제가 생긴 원인을 감정 없이 구조적으로 분해합니다.', 'Review'),
  makeJoovisTerm('Boundary Ledger', '바운더리 레저', '허용 경계와 금지 경계를 기록하는 목록', 'AI나 사람이 어디까지 작업했는지 추적합니다.', 'Boundary'),
  makeJoovisTerm('Truth Packet', '트루스 패킷', '현재 사실, 출처, 판단을 함께 묶은 전달 단위', '다음 작업자가 같은 기준으로 이어갈 수 있게 합니다.', 'Truth Surface'),
  makeJoovisTerm('Command Surface', '커맨드 서피스', '사용자가 AI에게 명령을 주고 결과를 받는 접점', '프롬프트와 피드백이 만나는 작업면입니다.', 'AI Command'),
  makeJoovisTerm('Review Cockpit', '리뷰 콕핏', '검토 대상, 상태, 다음 행동을 한 화면에서 보는 공간', '긴 흐름을 조작 가능한 검토 화면으로 바꿉니다.', 'Review'),
  makeJoovisTerm('State Capsule', '스테이트 캡슐', '현재 상태를 나중에 복원할 수 있게 묶은 요약', '작업 중단 후 다시 시작할 때 기준점이 됩니다.', 'State'),
  makeJoovisTerm('Handoff Packet', '핸드오프 패킷', '다음 작업에 필요한 상태와 검증 결과 묶음', '보고서보다 실행 가능한 인계 단위에 가깝습니다.', 'Change Control'),
] satisfies RawDevTerm[]

const disputeSeedTerms = [
  ['원본대조', '원본과 파생본의 내용이 같은지 확인하는 절차', '원본 자료와 인용·요약본을 나란히 확인합니다.', '원본/출처', 'basic'],
  ['직접인용', '원문 표현을 그대로 따옴표 안에 옮기는 방식', '문장을 바꾸지 않고 필요한 부분만 그대로 씁니다.', '인용안전', 'basic'],
  ['간접인용', '원문의 뜻을 자기 문장으로 바꾸어 전달하는 방식', '원뜻을 유지하되 표현은 새로 씁니다.', '인용안전', 'basic'],
  ['요약오염', '요약 과정에서 원문의 의미가 달라지는 문제', '줄이다가 뜻이 바뀌는 위험입니다.', '인용안전', 'intermediate'],
  ['증거목록', '자료의 제목, 출처, 상태, 연결 쟁점을 정리한 목록', '증거를 찾고 제출 흐름을 관리하는 표입니다.', '증거관리', 'basic'],
  ['쟁점', '다투거나 판단해야 하는 핵심 질문', '무엇을 판단해야 하는지 정리한 질문입니다.', '쟁점정리', 'basic'],
  ['주장', '한쪽이 사실 또는 권리관계에 대해 내세우는 말', '입증하거나 반박해야 하는 핵심 문장입니다.', '쟁점정리', 'basic'],
  ['반박', '상대 주장이나 해석에 맞서는 설명', '왜 그 주장이 부족하거나 틀렸는지 밝힙니다.', '쟁점정리', 'basic'],
  ['입증', '주장을 자료와 논리로 증명하는 것', '주장을 뒷받침하는 자료 연결입니다.', '쟁점정리', 'basic'],
  ['소명', '엄격한 증명 전 단계에서 그럴 가능성을 설명하는 것', '충분한 개연성을 보여 주는 설명입니다.', '쟁점정리', 'intermediate'],
  ['타임라인', '사건이나 문서 흐름을 시간 순서로 정리한 목록', '언제 무엇이 있었는지 순서대로 봅니다.', '기록정리', 'basic'],
  ['기관별 판단', '기관마다 내린 판단을 분리해 비교하는 방식', '판단 주체별 결론과 이유를 따로 봅니다.', '판단정리', 'intermediate'],
  ['판단 괴리', '같은 자료나 사안에 대해 판단이 서로 달라지는 상태', '기관이나 단계별 결론 차이를 포착합니다.', '판단정리', 'advanced'],
  ['출처추적', '자료가 어디서 왔고 어떻게 가공됐는지 따라가는 것', '출처와 이동 경로를 확인합니다.', '원본/출처', 'basic'],
  ['인용안전등급', '자료를 직접 인용해도 되는지 표시하는 등급', '인용 가능성, 위험, 확인 필요를 구분합니다.', '인용안전', 'intermediate'],
  ['민감정보', '공개되면 안 되는 개인·계정·식별 정보', '가리거나 분리해서 다뤄야 하는 정보입니다.', '프라이버시', 'basic'],
  ['비식별화', '개인을 알아볼 수 없도록 정보를 제거하거나 바꾸는 처리', '이름, 주소, 번호 등을 가립니다.', '프라이버시', 'basic'],
  ['append-only', '기존 기록을 덮어쓰지 않고 새 기록만 추가하는 방식', '변경 흔적을 보존하는 기록 원칙입니다.', '기록정리', 'intermediate'],
  ['verification queue', '확인이 필요한 자료를 모아 둔 대기열', '수기검수나 원문대조가 필요한 항목 목록입니다.', '검수', 'basic'],
  ['evidence item', '하나의 증거 자료 단위', '파일 하나나 문서 한 건을 독립 항목으로 봅니다.', '증거관리', 'basic'],
  ['claim-issue link', '주장과 쟁점을 연결한 관계', '어떤 주장이 어떤 쟁점에 속하는지 표시합니다.', '쟁점정리', 'intermediate'],
  ['OCR confidence', 'OCR 결과를 신뢰할 수 있는 정도', '문자 인식 결과의 확실성 점수입니다.', 'OCR/검수', 'intermediate'],
  ['manual confirmation', '사람이 직접 확인했다는 표시', '자동 판독 결과를 수기로 검수합니다.', 'OCR/검수', 'basic'],
  ['원본성', '자료가 원본 또는 원본에 가까운 상태인지의 성질', '가공되지 않은 자료인지 확인합니다.', '원본/출처', 'intermediate'],
  ['증거능력', '자료가 절차상 증거로 쓰일 수 있는지의 성질', '제출 가능성과 절차 요건을 따져 봅니다.', '증거관리', 'advanced'],
  ['증명력', '자료가 실제 판단에 얼마나 설득력을 갖는지의 정도', '증거로서 무게가 얼마나 있는지 봅니다.', '증거관리', 'advanced'],
  ['제출본', '기관이나 상대방에게 제출하기 위해 정리한 버전', '원본과 구분되는 제출용 문서입니다.', '문서버전', 'basic'],
  ['원본파일', '처음 확보한 변경 전 파일', '가공 전 기준 파일입니다.', '문서버전', 'basic'],
  ['파생파일', '원본을 복사, 변환, 편집해 만든 파일', 'PDF 변환본, OCR본, 요약본 등이 포함됩니다.', '문서버전', 'basic'],
  ['변경이력', '자료가 언제 어떻게 바뀌었는지의 기록', '수정과 가공 흔적을 추적합니다.', '기록정리', 'basic'],
  ['메타데이터', '파일 생성일, 작성자, 형식 같은 부가 정보', '자료 자체 밖의 설명 정보입니다.', '원본/출처', 'basic'],
  ['진술서', '사실관계나 입장을 문서로 진술한 자료', '사람의 설명을 정리한 문서입니다.', '문서유형', 'basic'],
  ['사실확인서', '특정 사실을 확인하는 취지의 문서', '사실 여부를 별도로 정리한 확인 문서입니다.', '문서유형', 'basic'],
  ['반박서', '상대 주장에 대한 반박을 정리한 문서', '쟁점별 반박과 근거를 묶습니다.', '문서유형', 'basic'],
  ['보정명령', '기관이 부족한 부분을 고치거나 보완하라고 요구하는 명령', '빠진 자료나 형식을 보완하라는 절차 신호입니다.', '절차', 'intermediate'],
  ['정보공개청구', '기관 보유 정보를 공개해 달라고 요청하는 절차', '자료 확보를 위한 공식 요청입니다.', '절차', 'intermediate'],
  ['회신자료', '요청이나 청구에 대해 받은 답변 자료', '기관이나 상대가 보내온 응답 문서입니다.', '문서유형', 'basic'],
  ['기록목록', '보유하거나 제출된 기록의 항목 목록', '자료 전체를 빠짐없이 확인하기 위한 목록입니다.', '기록정리', 'basic'],
  ['녹취록', '녹음 내용을 글로 옮긴 문서', '음성 자료의 텍스트 버전입니다.', '문서유형', 'basic'],
  ['녹음파일', '대화나 소리를 저장한 음성 파일', '원본성과 편집 여부 확인이 중요합니다.', '문서유형', 'basic'],
  ['캡처자료', '화면을 이미지로 저장한 자료', '원본 화면과 맥락 확인이 필요합니다.', '문서유형', 'basic'],
  ['파일해시', '파일 내용을 대표하는 고유한 계산값', '파일이 바뀌었는지 확인하는 지문입니다.', '원본/출처', 'intermediate'],
  ['중복파일', '내용이 같거나 거의 같은 파일', '증거목록에서 중복 제출을 줄이기 위해 표시합니다.', '기록정리', 'basic'],
  ['쟁점태그', '자료를 쟁점별로 분류하는 태그', '증거와 쟁점을 빠르게 연결합니다.', '쟁점정리', 'basic'],
  ['절차단계', '현재 문서나 사건이 놓인 진행 단계', '제출 전, 검토 중, 보정 중처럼 구분합니다.', '절차', 'basic'],
  ['기관명칭', '판단하거나 회신한 기관의 이름 정보', '실제 표기와 약칭을 구분해 기록합니다.', '판단정리', 'basic'],
  ['판단근거', '결론을 뒷받침한 이유나 자료', '왜 그런 판단이 나왔는지의 기반입니다.', '판단정리', 'intermediate'],
  ['사실인정', '기관이나 문서가 사실로 본 내용', '무엇을 사실로 받아들였는지 구분합니다.', '판단정리', 'intermediate'],
  ['법률판단', '사실을 규범이나 법리에 적용해 내린 판단', '사실과 법적 결론을 분리합니다.', '판단정리', 'advanced'],
  ['결론부', '문서의 최종 결론이 담긴 부분', '핵심 결과가 적힌 위치입니다.', '문서구조', 'basic'],
  ['주문', '결정이나 판정의 최종 명령 부분', '결론을 공식 문구로 적은 부분입니다.', '문서구조', 'intermediate'],
  ['이유', '결론에 이른 근거와 설명 부분', '왜 그런 결론인지 설명하는 부분입니다.', '문서구조', 'basic'],
  ['누락자료', '있어야 하지만 목록이나 제출본에서 빠진 자료', '보완하거나 확인해야 할 빈칸입니다.', '검수', 'basic'],
  ['확인필요', '자동 판단만으로 확정할 수 없어 사람이 봐야 하는 상태', '아직 결론 내리면 안 되는 표시입니다.', '검수', 'basic'],
  ['인용금지', '그대로 인용하면 위험하거나 부정확한 상태', '원본대조 전에는 쓰지 말아야 한다는 표시입니다.', '인용안전', 'basic'],
  ['직접인용 가능', '원문과 대조되어 그대로 인용할 수 있는 상태', '문장 변경 없이 인용해도 되는 표시입니다.', '인용안전', 'basic'],
  ['수기검수', '사람이 직접 읽고 확인하는 검수', '자동 처리 결과를 사람이 확정합니다.', 'OCR/검수', 'basic'],
  ['OCR 오류', '문자인식 과정에서 글자가 잘못 읽힌 문제', '원문 이미지와 대조해야 하는 오류입니다.', 'OCR/검수', 'basic'],
  ['원문대조 필요', '요약이나 OCR 결과를 원문과 다시 비교해야 하는 상태', '그대로 믿기 전에 원문 확인이 필요합니다.', '검수', 'basic'],
  ['증거-주장 연결', '증거 자료가 어떤 주장에 쓰이는지 연결하는 것', '자료가 주장과 따로 놀지 않게 묶습니다.', '쟁점정리', 'intermediate'],
  ['인용문맥', '인용한 문장이 놓인 앞뒤 의미 관계', '문장만 떼어내 오해가 생기지 않게 확인합니다.', '인용안전', 'intermediate'],
  ['자료봉인', '확정된 자료를 더 이상 수정하지 않도록 묶는 처리', '제출본이나 원본을 보존 상태로 둡니다.', '원본/출처', 'advanced'],
  ['접근권한', '자료를 볼 수 있는 사람과 범위', '민감한 자료의 열람 범위를 제한합니다.', '프라이버시', 'intermediate'],
  ['검토메모', '자료를 읽으며 남기는 검토용 메모', '증거 자체와 의견을 구분해 기록합니다.', '기록정리', 'basic'],
] as const

const disputeTerms = disputeSeedTerms.map(([term, koreanMeaning, simpleMeaning, category, difficulty], index) =>
  makeDisputeTerm({
    id: `dispute-${String(index + 1).padStart(2, '0')}`,
    term,
    pronunciation: term,
    koreanMeaning,
    simpleMeaning,
    category,
    difficulty: difficulty as Difficulty,
  }),
)

const expertSeedTerms = [
  ['ai-command', 'Intent Framing', '인텐트 프레이밍', '요청의 목적과 성공 기준을 먼저 고정하는 지휘 방식', 'AI가 무엇을 위해 판단하는지부터 맞추는 명령 설계입니다.', 'AI Command', 'intermediate', ['Scope', 'Acceptance Criteria', 'Output Contract']],
  ['ai-command', 'Constraint Stack', '컨스트레인트 스택', '금지사항, 허용범위, 검증조건을 층처럼 쌓은 지시 구조', 'AI가 넘어가면 안 되는 경계를 우선순위로 묶습니다.', 'Boundary / Safety', 'advanced', ['Boundary', 'Guard', 'Fail-closed']],
  ['ai-command', 'Output Contract', '아웃풋 컨트랙트', '응답 형식과 포함해야 할 항목을 계약처럼 고정한 기준', '보고서, 표, JSON, 판정 문구가 흔들리지 않게 만듭니다.', 'AI Command', 'intermediate', ['Contract', 'Schema', 'Acceptance Criteria']],
  ['ai-command', 'Rubric', '루브릭', '좋고 나쁨을 판단하는 채점 기준표', '리뷰나 답변 품질을 감으로 보지 않고 기준별로 봅니다.', 'Review / QA', 'intermediate', ['Review Lens', 'Severity', 'Acceptance Probe']],
  ['ai-command', 'Grounding', '그라운딩', '답변을 실제 근거, 파일, 로그, 문서에 묶는 방식', 'AI가 상상으로 말하지 않고 확인 가능한 근거에 붙어 있게 합니다.', 'Boundary / Safety', 'intermediate', ['Source of Truth', 'Provenance', 'Evidence Ladder']],
  ['ai-command', 'Evidence Ladder', '에비던스 래더', '추정, 정황, 직접근거를 단계별로 구분하는 판단 구조', '확신도를 높이기 전에 근거 수준을 먼저 분리합니다.', 'Review / QA', 'advanced', ['Grounding', 'Provenance', 'Confidence']],
  ['ai-command', 'Ambiguity Budget', '앰비규어티 버짓', '모호함을 어디까지 허용할지 정하는 한도', '불확실한 부분이 많으면 구현보다 질문이나 보류로 전환합니다.', 'AI Command', 'advanced', ['Assumption', 'Clarifying Question', 'Stop Condition']],
  ['ai-command', 'Decision Record', '디시전 레코드', '왜 그렇게 결정했는지 남기는 짧은 판단 기록', '나중에 같은 결정을 되짚거나 되돌릴 수 있게 합니다.', 'Review / QA', 'intermediate', ['Handoff', 'Provenance', 'Rollback']],
  ['ai-command', 'Counterexample', '카운터익잼플', '주장이나 설계를 깨뜨릴 수 있는 반례', '그럴듯한 답을 믿기 전에 안 되는 경우를 일부러 찾습니다.', 'Review / QA', 'intermediate', ['Regression', 'Invariant', 'Failure Mode']],
  ['ai-command', 'Acceptance Probe', '억셉턴스 프로브', '완료 기준을 실제로 찔러보는 확인 질문이나 테스트', '작업이 끝났다는 말을 검증 가능한 조건으로 바꿉니다.', 'Review / QA', 'intermediate', ['Acceptance Criteria', 'Smoke Test', 'Checker']],
  ['ai-command', 'Failure Mode', '페일러 모드', '시스템이나 지시가 실패하는 전형적인 방식', '무엇이 깨질 수 있는지 먼저 알면 검증 포인트가 선명해집니다.', 'Boundary / Safety', 'intermediate', ['Fail-closed', 'Rollback', 'Counterexample']],
  ['ai-command', 'Escalation Criteria', '에스컬레이션 크라이테리아', '언제 멈추고 사용자 확인이나 전문가 판단으로 넘길지 정한 기준', '애매한 상태에서 AI가 계속 밀고 나가지 않게 합니다.', 'Boundary / Safety', 'advanced', ['Stop Condition', 'Boundary', 'Risk Gate']],
  ['ai-command', 'Stop Condition', '스톱 컨디션', '작업을 즉시 멈춰야 하는 조건', '권한, 경로, 개인정보, 법적 위험처럼 넘으면 안 되는 선을 만듭니다.', 'Boundary / Safety', 'intermediate', ['Fail-closed', 'Escalation Criteria', 'Guard']],
  ['ai-command', 'Instruction Priority', '인스트럭션 프라이어리티', '여러 지시가 충돌할 때 어느 지시가 우선인지 정하는 질서', '시스템, 개발자, 사용자, 파일 지시의 우선순위를 구분합니다.', 'AI Command', 'advanced', ['System Instruction', 'Boundary', 'Contract']],
  ['ai-command', 'Prompt Injection', '프롬프트 인젝션', '입력 데이터가 AI의 지시 체계를 흔들려는 공격 또는 위험 패턴', '문서나 웹페이지 내용이 명령처럼 행동하지 못하게 분리합니다.', 'Boundary / Safety', 'advanced', ['Tool Boundary', 'Guard', 'Sandbox']],
  ['ai-command', 'Tool Boundary', '툴 바운더리', 'AI가 도구로 실제 변경을 할 수 있는 범위', '읽기, 쓰기, 실행, 네트워크 같은 능력 경계를 명확히 합니다.', 'Boundary / Safety', 'advanced', ['Capability State', 'Sandbox', 'Side Effect']],
  ['development', 'Control Flow', '컨트롤 플로우', '코드가 어떤 순서와 조건으로 실행되는지의 흐름', 'if, loop, return, error path를 따라 실제 실행 경로를 봅니다.', 'Programming', 'basic', ['Invariant', 'State Machine', 'Side Effect']],
  ['development', 'State Machine', '스테이트 머신', '상태와 상태 전환 규칙으로 동작을 설명하는 모델', '로그인됨, 로딩중, 실패 같은 상태가 어떤 조건에서 바뀌는지 봅니다.', 'Architecture', 'advanced', ['Invariant', 'Transition', 'Guard']],
  ['development', 'Transition', '트랜지션', '한 상태에서 다른 상태로 넘어가는 변화', '상태 변화가 언제 허용되고 어떤 부작용을 만드는지 확인합니다.', 'Architecture', 'intermediate', ['State Machine', 'Invariant', 'Side Effect']],
  ['development', 'Transaction', '트랜잭션', '여러 작업을 하나의 성공/실패 단위로 묶는 처리', '중간에 실패하면 일부만 반영되지 않도록 경계를 만듭니다.', 'Data / Schema', 'advanced', ['Atomicity', 'Rollback', 'ACID']],
  ['development', 'Atomicity', '아토믹시티', '작업이 전부 성공하거나 전부 실패해야 한다는 성질', '부분 적용으로 데이터가 어긋나는 것을 막습니다.', 'Data / Schema', 'advanced', ['Transaction', 'Rollback', 'Invariant']],
  ['development', 'Consistency', '컨시스턴시', '처리 전후에 데이터 규칙이 유지되는 성질', '스키마, 제약조건, 비즈니스 규칙이 깨지지 않는지 봅니다.', 'Data / Schema', 'advanced', ['Invariant', 'Schema', 'Validation']],
  ['development', 'Isolation', '아이솔레이션', '동시에 실행되는 작업들이 서로를 깨뜨리지 않게 분리되는 성질', '동시성 문제와 레이스 컨디션을 줄입니다.', 'Runtime / Integration', 'advanced', ['Concurrency', 'Race Condition', 'Transaction']],
  ['development', 'Durability', '듀러빌리티', '성공한 변경이 장애 후에도 사라지지 않는 성질', '저장소에 확정된 기록이 재시작 후에도 남는지 봅니다.', 'Runtime / Integration', 'advanced', ['Transaction', 'Persistence', 'Rollback']],
  ['development', 'Serialization', '시리얼라이제이션', '객체나 상태를 저장/전송 가능한 문자열 또는 바이트로 바꾸는 과정', 'localStorage, JSON, API 요청에서 구조를 납작하게 만듭니다.', 'Data / Schema', 'intermediate', ['JSON', 'Deserialization', 'Schema']],
  ['development', 'Deserialization', '디시리얼라이제이션', '저장/전송된 데이터를 다시 객체나 구조로 복원하는 과정', '외부 입력을 복원할 때 검증이 반드시 필요합니다.', 'Data / Schema', 'intermediate', ['Serialization', 'Validation', 'Parser']],
  ['development', 'Validation', '밸리데이션', '입력이 요구 조건과 형식에 맞는지 확인하는 절차', '데이터를 믿기 전에 타입, 범위, 필수값을 확인합니다.', 'Review / QA', 'basic', ['Schema', 'Checker', 'Acceptance Probe']],
  ['development', 'Normalization', '노멀라이제이션', '비교나 저장을 쉽게 하려고 표현을 표준 형태로 맞추는 처리', '대소문자, 공백, 구두점 차이 때문에 중복이 생기지 않게 합니다.', 'Data / Schema', 'intermediate', ['Deduplication', 'Schema', 'Parser']],
  ['development', 'Parser', '파서', '문자열을 의미 있는 구조로 읽어내는 코드', '명령, 파일, JSON, CSV를 프로그램이 이해할 수 있게 바꿉니다.', 'Programming', 'intermediate', ['AST', 'Validation', 'Schema']],
  ['development', 'AST', '에이에스티', '코드를 트리 구조로 표현한 추상 구문 트리', '린터, 포매터, 컴파일러가 코드를 구조적으로 분석할 때 씁니다.', 'Programming', 'advanced', ['Parser', 'Transpilation', 'Type Inference']],
  ['development', 'Type Inference', '타입 인퍼런스', '명시하지 않은 타입을 도구가 문맥으로 추론하는 기능', 'TypeScript가 변수와 반환값의 형태를 자동으로 좁혀 봅니다.', 'Programming', 'intermediate', ['TypeScript', 'Type Narrowing', 'Schema']],
  ['development', 'Type Narrowing', '타입 내로잉', '조건문이나 검사로 넓은 타입을 더 구체적인 타입으로 줄이는 기법', 'null, union type, optional field를 안전하게 다룹니다.', 'Programming', 'intermediate', ['Type Inference', 'Guard', 'Validation']],
  ['development', 'Concurrency', '컨커런시', '여러 작업이 겹쳐 진행되는 실행 모델', '동시에 보이지만 순서와 공유 상태 때문에 버그가 생길 수 있습니다.', 'Runtime / Integration', 'advanced', ['Race Condition', 'Isolation', 'Mutex']],
  ['development', 'Race Condition', '레이스 컨디션', '실행 순서 차이로 결과가 달라지는 버그', '빠른 클릭, 중복 요청, 비동기 저장에서 자주 발생합니다.', 'Runtime / Integration', 'advanced', ['Concurrency', 'Mutex', 'Invariant']],
  ['development', 'Deadlock', '데드락', '작업들이 서로가 가진 자원을 기다리며 멈추는 상태', '락 순서와 타임아웃 설계로 예방합니다.', 'Runtime / Integration', 'advanced', ['Mutex', 'Timeout', 'Concurrency']],
  ['development', 'Mutex', '뮤텍스', '한 번에 하나의 작업만 자원에 접근하게 하는 잠금', '공유 상태를 안전하게 바꾸기 위한 동시성 도구입니다.', 'Runtime / Integration', 'advanced', ['Lock', 'Race Condition', 'Deadlock']],
  ['development', 'Cache Invalidation', '캐시 인밸리데이션', '오래된 캐시를 언제 버릴지 정하는 문제', '데이터는 빨리 보이게 하되 틀린 값이 오래 남지 않게 합니다.', 'Runtime / Integration', 'advanced', ['Cache', 'Source of Truth', 'Staleness']],
  ['development', 'Retry Policy', '리트라이 폴리시', '실패한 작업을 언제 몇 번 다시 시도할지 정한 규칙', '일시적 실패와 영구 실패를 구분해서 재시도합니다.', 'Runtime / Integration', 'intermediate', ['Backoff', 'Idempotent', 'Circuit Breaker']],
  ['development', 'Backoff', '백오프', '재시도 간격을 점점 늘리는 방식', '서버나 시스템이 회복할 시간을 주고 폭주를 막습니다.', 'Runtime / Integration', 'intermediate', ['Retry Policy', 'Rate Limit', 'Circuit Breaker']],
  ['development', 'Circuit Breaker', '서킷 브레이커', '반복 실패 시 호출을 잠시 끊어 시스템을 보호하는 패턴', '문제가 있는 의존성에 계속 요청을 보내지 않게 합니다.', 'Runtime / Integration', 'advanced', ['Dependency', 'Fail-closed', 'Retry Policy']],
  ['development', 'Rate Limit', '레이트 리밋', '일정 시간에 허용되는 요청 수 제한', '서비스 보호와 비용 통제를 위해 호출량을 제한합니다.', 'Runtime / Integration', 'intermediate', ['Backoff', 'Quota', 'Retry Policy']],
  ['development', 'Pagination', '페이지네이션', '많은 데이터를 페이지 단위로 나눠 가져오는 방식', '리스트가 커져도 화면과 네트워크를 가볍게 유지합니다.', 'Runtime / Integration', 'basic', ['Cursor', 'Limit', 'Offset']],
  ['development', 'Idempotency Key', '아이덴포턴시 키', '같은 요청이 중복 실행되어도 한 번만 처리되게 하는 식별자', '결제, 저장, 생성 요청의 중복 부작용을 막습니다.', 'Runtime / Integration', 'advanced', ['Idempotent', 'Side Effect', 'Retry Policy']],
  ['development', 'Webhook', '웹훅', '이벤트가 생겼을 때 다른 시스템으로 보내는 HTTP 알림', '폴링 대신 변화가 발생한 순간 downstream을 깨웁니다.', 'Runtime / Integration', 'intermediate', ['Event', 'Downstream', 'Contract']],
  ['development', 'Event Loop', '이벤트 루프', '비동기 작업과 콜백을 순서대로 처리하는 실행 메커니즘', 'JavaScript 런타임에서 화면 반응과 비동기 처리가 돌아가는 핵심입니다.', 'Runtime', 'advanced', ['Async', 'Queue', 'Concurrency']],
  ['development', 'Memory Leak', '메모리 리크', '더 이상 필요 없는 메모리가 해제되지 않고 남는 문제', '앱이 오래 켜질수록 느려지거나 죽을 수 있습니다.', 'Runtime', 'intermediate', ['Garbage Collection', 'Lifecycle', 'Resource']],
  ['development', 'Garbage Collection', '가비지 컬렉션', '사용하지 않는 메모리를 런타임이 자동 회수하는 기능', '개발자가 직접 해제하지 않아도 되지만 참조가 남으면 회수되지 않습니다.', 'Runtime', 'intermediate', ['Memory Leak', 'Reference', 'Runtime']],
  ['development', 'Primary Key', '프라이머리 키', '테이블의 각 행을 고유하게 식별하는 값', '중복 없이 한 레코드를 정확히 가리킵니다.', 'Data / Schema', 'basic', ['Foreign Key', 'Index', 'Schema']],
  ['development', 'Foreign Key', '포린 키', '다른 테이블의 행을 참조하는 연결 키', '데이터 관계가 끊어지지 않게 참조 무결성을 만듭니다.', 'Data / Schema', 'intermediate', ['Primary Key', 'Referential Integrity', 'Schema']],
  ['development', 'Index', '인덱스', '데이터를 빠르게 찾기 위한 보조 구조', '검색은 빨라지지만 쓰기 비용과 저장 공간이 늘 수 있습니다.', 'Data / Schema', 'intermediate', ['Query Plan', 'Database', 'Performance']],
  ['development', 'Query Plan', '쿼리 플랜', 'DB가 SQL을 실행하기 위해 선택한 접근 경로', '왜 느린지 보려면 실제 실행 계획을 확인합니다.', 'Data / Schema', 'advanced', ['Index', 'SQL Query', 'Optimizer']],
  ['development', 'CORS', '코스', '브라우저가 다른 출처 요청을 제한하는 보안 정책', '프론트엔드 API 호출 실패 원인을 판단할 때 자주 봅니다.', 'Runtime / Integration', 'intermediate', ['Origin', 'Browser', 'HTTP']],
  ['development', 'TLS', '티엘에스', '네트워크 통신을 암호화하고 서버 신원을 확인하는 프로토콜', 'HTTPS 보안 연결의 기반입니다.', 'Runtime / Integration', 'intermediate', ['Certificate', 'HTTPS', 'Security']],
  ['libraries-tools', 'JSX', '제이에스엑스', 'JavaScript 안에서 UI 구조를 태그처럼 쓰는 문법', 'React 컴포넌트의 화면 구조를 표현합니다.', 'React', 'basic', ['React', 'Component', 'Transpilation']],
  ['libraries-tools', 'Props', '프롭스', '부모 컴포넌트가 자식 컴포넌트에 전달하는 입력값', '컴포넌트를 재사용 가능하게 만드는 외부 입력입니다.', 'React', 'basic', ['Component', 'State', 'Interface']],
  ['libraries-tools', 'State', '스테이트', '컴포넌트가 기억하고 변화시키는 내부 값', '사용자 입력, 선택 모드, 열림 상태처럼 화면을 바꾸는 값입니다.', 'React', 'basic', ['Hook', 'Reducer', 'State Machine']],
  ['libraries-tools', 'Context Provider', '컨텍스트 프로바이더', '여러 컴포넌트가 공통 값을 내려받게 하는 React 구조', '깊은 props 전달을 줄이지만 남용하면 결합도가 커집니다.', 'React', 'intermediate', ['Context', 'Props', 'Coupling']],
  ['libraries-tools', 'Reducer', '리듀서', '현재 상태와 액션을 받아 다음 상태를 계산하는 함수', '복잡한 상태 전환을 한곳에서 예측 가능하게 만듭니다.', 'React', 'intermediate', ['State', 'Action', 'State Machine']],
  ['libraries-tools', 'Memoization', '메모이제이션', '같은 입력의 계산 결과를 재사용하는 최적화', '비싼 계산이나 불필요한 렌더링을 줄입니다.', 'React', 'intermediate', ['Cache', 'Performance', 'Dependency']],
  ['libraries-tools', 'Reconciliation', '리컨실리에이션', 'React가 이전 UI와 새 UI 차이를 비교해 실제 DOM 변경을 줄이는 과정', '상태가 바뀌어도 필요한 부분만 갱신하려는 메커니즘입니다.', 'React', 'advanced', ['Virtual DOM', 'Render', 'Diff']],
  ['libraries-tools', 'Hydration', '하이드레이션', '서버에서 만든 HTML에 브라우저 JavaScript 동작을 붙이는 과정', '정적 HTML이 상호작용 가능한 앱으로 살아나는 단계입니다.', 'Frontend Frameworks', 'advanced', ['SSR', 'React', 'Runtime']],
  ['libraries-tools', 'Bundle', '번들', '브라우저가 읽도록 여러 코드 파일을 묶은 결과물', '배포 시 다운로드되는 JavaScript/CSS 덩어리입니다.', 'Build Tools', 'basic', ['Vite', 'Tree Shaking', 'Chunk']],
  ['libraries-tools', 'Transpilation', '트랜스파일레이션', '한 문법의 코드를 다른 문법의 코드로 변환하는 과정', 'TypeScript나 JSX가 브라우저용 JavaScript로 바뀝니다.', 'Build Tools', 'intermediate', ['TypeScript', 'JSX', 'Source Map']],
  ['libraries-tools', 'Tree Shaking', '트리 셰이킹', '사용하지 않는 코드를 번들에서 제거하는 최적화', '앱 크기를 줄이고 로딩을 빠르게 합니다.', 'Build Tools', 'intermediate', ['Bundle', 'Dependency', 'Vite']],
  ['libraries-tools', 'Source Map', '소스맵', '변환된 코드와 원본 코드를 연결하는 디버깅 지도', '브라우저 오류를 원래 TypeScript 위치로 추적합니다.', 'Build Tools', 'intermediate', ['Transpilation', 'Debugging', 'Stack Trace']],
  ['libraries-tools', 'Hot Module Replacement', '핫 모듈 리플레이스먼트', '개발 중 전체 새로고침 없이 바뀐 모듈만 교체하는 기능', 'Vite 개발 서버가 빠르게 화면을 갱신하게 합니다.', 'Build Tools', 'basic', ['Vite', 'Module', 'Dev Server']],
  ['libraries-tools', 'Lockfile', '락파일', '설치된 패키지의 정확한 버전을 고정하는 파일', '다른 환경에서도 같은 의존성 조합으로 설치되게 합니다.', 'Package Managers', 'intermediate', ['Dependency', 'npm', 'Reproducibility']],
  ['libraries-tools', 'Semantic Versioning', '시맨틱 버저닝', '버전을 major.minor.patch 의미로 관리하는 규칙', '업데이트 위험도를 버전 숫자로 대략 판단합니다.', 'Package Managers', 'basic', ['Dependency', 'Breaking Change', 'package.json']],
  ['libraries-tools', 'DataFrame', '데이터프레임', '행과 열로 구성된 표 형태 데이터 구조', 'pandas에서 CSV나 분석 데이터를 다룰 때 핵심 단위입니다.', 'Data Tools', 'basic', ['pandas', 'Series', 'Schema']],
  ['libraries-tools', 'Series', '시리즈', 'DataFrame의 한 열처럼 1차원으로 정렬된 데이터', '컬럼 단위 계산과 필터링에 자주 사용됩니다.', 'Data Tools', 'basic', ['DataFrame', 'pandas', 'Column']],
  ['libraries-tools', 'SQL Query', '에스큐엘 쿼리', '데이터베이스에 원하는 데이터를 요청하는 문장', 'SELECT, WHERE, JOIN으로 필요한 데이터를 추립니다.', 'Data Tools', 'basic', ['DuckDB', 'Query Plan', 'Schema']],
  ['libraries-tools', 'Browser DevTools', '브라우저 데브툴즈', '브라우저에서 DOM, 네트워크, 콘솔, 성능을 확인하는 도구', '프론트엔드 문제를 실제 실행 환경에서 분석합니다.', 'Quality Tools', 'basic', ['Console', 'Network Tab', 'Source Map']],
  ['libraries-tools', 'Lighthouse', '라이트하우스', '웹 성능, 접근성, PWA 품질을 점검하는 도구', '배포 전 앱의 사용성과 설치 가능성을 확인합니다.', 'Quality Tools', 'intermediate', ['PWA', 'Performance', 'Accessibility']],
  ['libraries-tools', 'Playwright', '플레이라이트', '브라우저를 자동 조작해 화면과 흐름을 테스트하는 도구', '실제 사용자처럼 클릭하고 스크린샷을 검증합니다.', 'Quality Tools', 'intermediate', ['Smoke Test', 'Regression', 'Browser']],
  ['libraries-tools', 'Vitest', '바이테스트', 'Vite 환경에 잘 맞는 JavaScript/TypeScript 테스트 러너', '함수와 컴포넌트 동작을 빠르게 검증합니다.', 'Quality Tools', 'intermediate', ['Unit Test', 'Vite', 'Regression']],
  ['libraries-tools', 'Prettier', '프리티어', '코드 형식을 자동으로 맞추는 포매터', '스타일 논쟁보다 일관된 형식 유지에 집중합니다.', 'Quality Tools', 'basic', ['Formatting', 'ESLint', 'Diff']],
  ['joovis-architecture', 'Control Plane', '컨트롤 플레인', '정책, 명령, 상태 전환을 결정하는 제어 영역', '실제 데이터 처리와 지휘 판단을 분리해서 봅니다.', 'Architecture', 'advanced', ['Data Plane', 'Command Surface', 'Guard']],
  ['joovis-architecture', 'Data Plane', '데이터 플레인', '실제 데이터가 흐르고 처리되는 실행 영역', '제어 결정이 적용되는 데이터 흐름을 의미합니다.', 'Architecture', 'advanced', ['Control Plane', 'Pipeline', 'Data Block']],
  ['joovis-architecture', 'Truth Graph', '트루스 그래프', '사실, 출처, 판단, 상태를 노드와 관계로 연결한 지식 구조', '단편 기록이 아니라 연결된 현재 진실을 봅니다.', 'Truth Surface', 'advanced', ['Current Truth', 'Provenance', 'Knowledge Boundary']],
  ['joovis-architecture', 'State Ledger', '스테이트 레저', '중요 상태 변화와 판단을 시간순으로 남기는 기록장', '왜 현재 상태가 되었는지 되짚을 수 있게 합니다.', 'State', 'intermediate', ['State Capsule', 'Decision Record', 'Immutable Log']],
  ['joovis-architecture', 'Replay Harness', '리플레이 하니스', '과거 입력과 상태를 다시 실행해 결과를 확인하는 검증 장치', '재현 가능한 실패 분석과 회귀 검증에 씁니다.', 'Review', 'advanced', ['Replay', 'Regression', 'Fixture']],
  ['joovis-architecture', 'Autopsy Trail', '오톱시 트레일', '실패 분석에서 원인, 증거, 조치가 이어진 추적 기록', '감정적 해석보다 재현 가능한 실패 경로를 남깁니다.', 'Review', 'advanced', ['Autopsy', 'Provenance', 'Decision Record']],
  ['joovis-architecture', 'Capability Matrix', '케이퍼빌리티 매트릭스', '각 모듈이나 에이전트가 할 수 있는 일과 금지된 일을 표로 정리한 것', '권한과 책임 경계를 명확히 합니다.', 'Boundary', 'advanced', ['Capability State', 'Tool Boundary', 'Contract']],
  ['joovis-architecture', 'Risk Gate', '리스크 게이트', '위험이 큰 변경을 통과시키기 전에 검증하는 관문', '실행 전 멈춤, 검토, 승인 조건을 둡니다.', 'Boundary', 'intermediate', ['Guard', 'Fail-closed', 'Escalation Criteria']],
  ['joovis-architecture', 'Review Gate', '리뷰 게이트', '다음 단계로 넘기기 전 품질과 경계를 확인하는 관문', '검증 없는 릴레이를 막습니다.', 'Review', 'intermediate', ['Review Cockpit', 'Acceptance Probe', 'Checker']],
  ['joovis-architecture', 'Snapshot', '스냅샷', '특정 시점의 상태를 고정해 저장한 것', '비교, 복원, 재현의 기준점이 됩니다.', 'State', 'basic', ['Checkpoint', 'Rollback', 'State Capsule']],
  ['joovis-architecture', 'Checkpoint', '체크포인트', '긴 작업 중 되돌아갈 수 있도록 잡아 둔 중간 기준점', '실패해도 처음부터 다시 하지 않게 합니다.', 'State', 'basic', ['Snapshot', 'Rollback', 'Migration']],
  ['joovis-architecture', 'Golden Path', '골든 패스', '가장 정상적이고 권장되는 기본 흐름', '예외 처리보다 먼저 표준 동선을 분명히 합니다.', 'Flow', 'intermediate', ['Pipeline', 'Acceptance Criteria', 'Invariant']],
  ['joovis-architecture', 'Degraded Mode', '디그레이디드 모드', '일부 기능이 제한된 상태로 안전하게 계속 동작하는 모드', '완전 실패 대신 핵심 기능만 유지합니다.', 'Runtime', 'advanced', ['Fail-closed', 'Fallback', 'Guard']],
  ['joovis-architecture', 'Operator Loop', '오퍼레이터 루프', '사람이 상태를 보고 결정하고 다시 시스템에 반영하는 운영 순환', '자동화와 사람 판단이 만나는 반복 구조입니다.', 'Runtime', 'intermediate', ['Human-in-the-loop', 'Telemetry', 'Review Cockpit']],
  ['joovis-architecture', 'Human-in-the-loop', '휴먼 인 더 루프', '자동 판단 사이에 사람 검토를 넣는 설계', '위험하거나 애매한 판단은 사람에게 넘깁니다.', 'Boundary', 'intermediate', ['Escalation Criteria', 'Review Gate', 'Manual Confirmation']],
  ['joovis-architecture', 'Work Queue', '워크 큐', '처리할 일을 순서와 상태로 쌓아 둔 대기열', '검토, 재시도, 병렬 처리의 기준이 됩니다.', 'Flow', 'basic', ['Queue', 'Pipeline', 'Verification Queue']],
  ['joovis-architecture', 'Knowledge Boundary', '날리지 바운더리', '시스템이 알고 있는 것과 모르는 것을 구분하는 지식 경계', '추정과 확인된 사실을 섞지 않게 합니다.', 'Knowledge', 'advanced', ['Grounding', 'Source of Truth', 'Current Truth']],
  ['joovis-architecture', 'Immutable Log', '이뮤터블 로그', '기존 기록을 수정하지 않고 새 기록만 추가하는 로그', '감사 가능성과 재현성을 높입니다.', 'State', 'advanced', ['append-only', 'State Ledger', 'Provenance']],
  ['joovis-architecture', 'Drift Monitor', '드리프트 모니터', '기준 상태와 현재 상태가 얼마나 달라졌는지 감시하는 장치', '모델, 데이터, 정책이 조용히 달라지는 문제를 찾습니다.', 'Runtime', 'advanced', ['Invariant', 'Telemetry', 'Regression']],
  ['dispute-integration', 'Chain of Custody', '체인 오브 커스터디', '증거가 누구 손을 거쳐 어떻게 보관되었는지의 관리 이력', '원본성과 변경 가능성을 판단할 때 중요한 추적 구조입니다.', '원본/출처', 'advanced', ['원본성', '변경이력', 'Audit Trail']],
  ['dispute-integration', 'Exhibit', '엑시빗', '주장이나 쟁점을 뒷받침하기 위해 붙이는 증거 첨부물', '자료를 제출 단위로 정리할 때 사용합니다.', '문서버전', 'basic', ['제출본', '증거목록', 'Bates Number']],
  ['dispute-integration', 'Bates Number', '베이츠 넘버', '문서 제출본의 각 페이지나 파일에 붙이는 고유 번호', '대량 자료에서 인용 위치를 흔들리지 않게 합니다.', '문서버전', 'intermediate', ['Exhibit', '인용문맥', '기록목록']],
  ['dispute-integration', 'Redaction', '리댁션', '민감정보를 보이지 않게 가리는 처리', '공개나 제출 전에 개인정보와 비공개 정보를 보호합니다.', '프라이버시', 'basic', ['민감정보', '비식별화', 'Redaction Log']],
  ['dispute-integration', 'Redaction Log', '리댁션 로그', '어떤 정보를 왜 가렸는지 남기는 기록', '가림 처리의 이유와 범위를 나중에 설명할 수 있게 합니다.', '프라이버시', 'intermediate', ['Redaction', '민감정보', '접근권한']],
  ['dispute-integration', 'Privilege Review', '프리빌리지 리뷰', '보호되거나 비공개로 유지해야 할 자료인지 검토하는 절차', '제출 전 공개 위험이 있는 자료를 분리합니다.', '검토', 'advanced', ['접근권한', 'Confidentiality Designation', '인용금지']],
  ['dispute-integration', 'Relevance', '렐러번스', '자료가 쟁점 판단과 관련 있는 정도', '자료가 많을 때 주장과 무관한 것을 걸러냅니다.', '쟁점정리', 'basic', ['쟁점', '증거-주장 연결', 'Materiality']],
  ['dispute-integration', 'Materiality', '머티리얼리티', '판단 결과에 영향을 줄 만큼 중요한 정도', '관련은 있지만 결정에 별 영향이 없는 자료와 구분합니다.', '쟁점정리', 'advanced', ['Relevance', '증명력', '판단근거']],
  ['dispute-integration', 'Admissibility', '어드미서빌리티', '자료가 절차에서 증거로 받아들여질 수 있는지의 문제', '증거능력과 제출 조건을 분리해서 봅니다.', '증거관리', 'advanced', ['증거능력', '원본성', 'Authentication']],
  ['dispute-integration', 'Authentication', '오센티케이션', '자료가 주장하는 바로 그 자료인지 확인하는 과정', '원본대조, 출처추적, 파일해시로 뒷받침합니다.', '원본/출처', 'advanced', ['원본대조', '파일해시', 'Chain of Custody']],
  ['dispute-integration', 'Foundation', '파운데이션', '증거를 이해하고 받아들이기 위한 기본 설명과 전제', '누가 만들었고 어떤 맥락인지 먼저 세웁니다.', '증거관리', 'advanced', ['진술서', '출처추적', 'Authentication']],
  ['dispute-integration', 'Custodian', '커스터디언', '자료를 보유하거나 관리하던 사람 또는 시스템 역할', '출처와 보관 경로를 설명할 때 쓰는 일반 용어입니다.', '원본/출처', 'intermediate', ['Chain of Custody', 'Source System', '접근권한']],
  ['dispute-integration', 'Production Set', '프로덕션 셋', '제출하거나 공유하기 위해 묶은 자료 세트', '원본, 제출본, 파생파일을 구분해서 관리합니다.', '문서버전', 'intermediate', ['제출본', 'Native File', 'Load File']],
  ['dispute-integration', 'Native File', '네이티브 파일', '원래 프로그램 형식 그대로의 파일', 'PDF 변환본과 달리 원본 속성이나 메타데이터가 남을 수 있습니다.', '문서버전', 'intermediate', ['원본파일', '메타데이터', '파생파일']],
  ['dispute-integration', 'Load File', '로드 파일', '대량 문서 검토 시스템에 자료와 메타데이터를 불러오기 위한 색인 파일', '전문 검토 도구에서 문서 묶음을 재현할 때 사용합니다.', '문서버전', 'advanced', ['Production Set', '메타데이터', 'Bates Number']],
  ['dispute-integration', 'Deduplication', '디듀플리케이션', '같거나 실질적으로 같은 자료를 중복 제거하는 과정', '증거목록이 부풀거나 같은 자료가 여러 번 검토되는 것을 줄입니다.', '기록정리', 'intermediate', ['중복파일', '파일해시', 'Near-Duplicate']],
  ['dispute-integration', 'Near-Duplicate', '니어 듀플리케이트', '거의 같지만 일부만 다른 자료', '본문은 비슷해도 날짜, 서명, 첨부가 다를 수 있어 별도 확인합니다.', '기록정리', 'advanced', ['Deduplication', '변경이력', '확인필요']],
  ['dispute-integration', 'Threading', '스레딩', '메일이나 대화를 주고받은 흐름 단위로 묶는 정리 방식', '단일 메시지보다 앞뒤 맥락을 함께 봅니다.', '기록정리', 'intermediate', ['타임라인', '인용문맥', 'Source System']],
  ['dispute-integration', 'Legal Hold', '리걸 홀드', '관련 자료를 삭제하거나 변경하지 말고 보존하도록 하는 조치', '자료 보존 필요성이 생긴 시점부터 변경을 막는 개념입니다.', '절차', 'advanced', ['Preservation Notice', 'append-only', '자료봉인']],
  ['dispute-integration', 'Preservation Notice', '프리저베이션 노티스', '자료 보존 필요성을 알리는 통지', '삭제 방지와 보관 범위를 명확히 하는 일반 용어입니다.', '절차', 'advanced', ['Legal Hold', 'Collection Scope', '원본성']],
  ['dispute-integration', 'Collection Scope', '컬렉션 스코프', '수집할 자료의 기간, 출처, 종류, 범위', '너무 좁으면 누락되고 너무 넓으면 검토 비용이 커집니다.', '절차', 'intermediate', ['Scope', 'Source System', '누락자료']],
  ['dispute-integration', 'Review Protocol', '리뷰 프로토콜', '자료 검토 기준, 태그, 품질확인 절차를 정한 규칙', '검토자마다 다른 판단을 줄입니다.', '검토', 'advanced', ['Issue Coding', 'Quality Control Sample', '수기검수']],
  ['dispute-integration', 'Issue Coding', '이슈 코딩', '문서에 쟁점 태그나 판단 코드를 붙이는 작업', '검색과 쟁점별 묶음을 빠르게 만듭니다.', '쟁점정리', 'intermediate', ['쟁점태그', 'Review Protocol', '증거-주장 연결']],
  ['dispute-integration', 'Quality Control Sample', '퀄리티 컨트롤 샘플', '전체 검토 품질을 확인하기 위해 뽑은 표본', '자동 처리나 사람 검토의 오류율을 점검합니다.', '검토', 'advanced', ['수기검수', 'OCR 오류', 'manual confirmation']],
  ['dispute-integration', 'Hot Document', '핫 도큐먼트', '쟁점 판단에 특히 중요한 문서', '중요하지만 원본대조와 인용안전을 별도로 확인해야 합니다.', '증거관리', 'intermediate', ['Materiality', '직접인용 가능', '인용안전등급']],
  ['dispute-integration', 'Chronology', '크로놀로지', '사건이나 자료를 시간순으로 배열한 흐름표', '타임라인보다 판단 근거와 출처까지 붙여 정리할 때 씁니다.', '기록정리', 'intermediate', ['타임라인', '출처추적', '쟁점']],
  ['dispute-integration', 'Source System', '소스 시스템', '자료가 원래 생성되거나 보관된 시스템', '파일이 어디서 왔는지와 메타데이터 신뢰도를 판단합니다.', '원본/출처', 'intermediate', ['출처추적', '메타데이터', 'Custodian']],
  ['dispute-integration', 'Access Log', '액세스 로그', '누가 언제 자료나 시스템에 접근했는지의 기록', '자료 변경이나 열람 가능성을 판단하는 보조 단서입니다.', '기록정리', 'intermediate', ['Audit Trail', '접근권한', '변경이력']],
  ['dispute-integration', 'Audit Trail', '오딧 트레일', '작업, 접근, 변경의 순서를 남긴 추적 기록', '나중에 왜 그렇게 되었는지 되짚는 근거가 됩니다.', '기록정리', 'advanced', ['Access Log', 'Chain of Custody', '변경이력']],
  ['dispute-integration', 'Hash Verification', '해시 베리피케이션', '파일 해시를 다시 계산해 동일성을 확인하는 절차', '원본과 제출본이 같은지 검증하는 데 씁니다.', '원본/출처', 'intermediate', ['파일해시', '원본대조', 'Authentication']],
  ['dispute-integration', 'Confidentiality Designation', '컨피덴셜리티 디자인네이션', '자료의 공개 제한 수준을 표시하는 분류', '민감도와 공유 범위를 분리해서 관리합니다.', '프라이버시', 'advanced', ['민감정보', '접근권한', 'Privilege Review']],
  ['ai-command', 'Confidence', '컨피던스', '판단이나 답변을 얼마나 믿을 수 있는지의 확신도', '근거 수준과 검증 여부를 분리해서 말할 때 씁니다.', 'Review / QA', 'intermediate', ['Evidence Ladder', 'Grounding', 'Provenance']],
  ['development', 'ACID', '애시드', '트랜잭션 안정성을 설명하는 Atomicity, Consistency, Isolation, Durability 묶음', 'DB 변경이 안전하게 처리되는지 판단할 때 쓰는 핵심 약어입니다.', 'Data / Schema', 'advanced', ['Transaction', 'Atomicity', 'Consistency']],
  ['development', 'Action', '액션', '상태를 바꾸라고 전달하는 의도나 명령 객체', 'Reducer나 상태 머신에서 다음 상태를 결정하는 입력입니다.', 'Programming', 'basic', ['Reducer', 'State', 'Transition']],
  ['development', 'Async', '어싱크', '작업이 끝날 때까지 기다리지 않고 나중에 결과를 받는 실행 방식', '네트워크, 파일, 타이머처럼 시간이 걸리는 작업에서 중요합니다.', 'Runtime', 'intermediate', ['Event Loop', 'Queue', 'Concurrency']],
  ['development', 'Browser', '브라우저', '웹 앱을 실행하고 렌더링하는 사용자 환경', 'React 앱, PWA, 서비스 워커가 실제로 동작하는 무대입니다.', 'Runtime', 'basic', ['Runtime', 'CORS', 'Service Worker API']],
  ['development', 'Certificate', '서티피킷', '서버 신원과 암호화 연결을 증명하는 디지털 인증서', 'TLS/HTTPS 연결이 신뢰 가능한지 확인하는 데 쓰입니다.', 'Runtime / Integration', 'intermediate', ['TLS', 'HTTPS', 'Security']],
  ['development', 'Cursor', '커서', '페이지네이션에서 다음 위치를 가리키는 기준값', 'Offset보다 안정적으로 다음 묶음을 가져올 때 자주 씁니다.', 'Runtime / Integration', 'intermediate', ['Pagination', 'Limit', 'Offset']],
  ['development', 'Database', '데이터베이스', '구조화된 데이터를 저장하고 조회하는 시스템', '스키마, 인덱스, 쿼리 플랜이 함께 작동합니다.', 'Data / Schema', 'basic', ['Schema', 'Index', 'Query Plan']],
  ['development', 'Event', '이벤트', '시스템 안에서 발생한 의미 있는 일', '클릭, 저장 완료, 웹훅 수신처럼 흐름을 시작하는 신호입니다.', 'Runtime / Integration', 'basic', ['Webhook', 'Event Loop', 'Queue']],
  ['development', 'HTTP', '에이치티티피', '웹 클라이언트와 서버가 요청/응답을 주고받는 프로토콜', 'API, 웹훅, 정적 파일 전송의 기본 언어입니다.', 'Runtime / Integration', 'basic', ['Webhook', 'CORS', 'HTTPS']],
  ['development', 'HTTPS', '에이치티티피에스', 'HTTP에 TLS 암호화를 적용한 보안 통신 방식', '배포된 웹앱과 PWA에서 기본적으로 요구됩니다.', 'Runtime / Integration', 'basic', ['HTTP', 'TLS', 'Certificate']],
  ['development', 'Lifecycle', '라이프사이클', '객체, 컴포넌트, 프로세스가 생성되고 동작하고 정리되는 흐름', '초기화와 정리 시점을 놓치면 누수나 중복 실행이 생깁니다.', 'Runtime', 'intermediate', ['Memory Leak', 'State', 'Hook']],
  ['development', 'Limit', '리밋', '한 번에 처리하거나 가져올 수 있는 최대 개수', '페이지네이션과 Rate Limit에서 범위를 제한합니다.', 'Runtime / Integration', 'basic', ['Pagination', 'Cursor', 'Rate Limit']],
  ['development', 'Offset', '오프셋', '목록에서 몇 번째 위치부터 가져올지 나타내는 숫자', '간단한 페이지네이션에 쓰지만 데이터 변경에 취약할 수 있습니다.', 'Runtime / Integration', 'basic', ['Pagination', 'Cursor', 'Limit']],
  ['development', 'Optimizer', '옵티마이저', 'DB나 빌드 도구가 더 효율적인 실행 방식을 고르는 구성요소', '쿼리 플랜과 번들 최적화에서 성능을 좌우합니다.', 'Runtime', 'advanced', ['Query Plan', 'Index', 'Performance']],
  ['development', 'Origin', '오리진', '프로토콜, 도메인, 포트로 정의되는 웹 출처', 'CORS와 브라우저 보안 정책의 기준입니다.', 'Runtime / Integration', 'intermediate', ['CORS', 'Browser', 'Security']],
  ['development', 'Persistence', '퍼시스턴스', '데이터나 상태가 재시작 후에도 유지되는 성질', '메모리 상태와 저장된 상태를 구분할 때 씁니다.', 'Runtime', 'intermediate', ['Durability', 'LocalStorage', 'Database']],
  ['development', 'Queue', '큐', '처리할 일을 순서대로 쌓아 두는 대기열', '비동기 작업, 이벤트 루프, 워크 큐의 기본 구조입니다.', 'Runtime', 'basic', ['Event Loop', 'Work Queue', 'Async']],
  ['development', 'Quota', '쿼터', '사용 가능한 용량이나 호출량의 제한', 'API 호출, 저장소, 사용자별 사용량 제한을 설명합니다.', 'Runtime / Integration', 'intermediate', ['Rate Limit', 'Limit', 'Backoff']],
  ['development', 'Reference', '레퍼런스', '값 자체가 아니라 값을 가리키는 연결', '참조가 남아 있으면 가비지 컬렉션이 메모리를 회수하지 못할 수 있습니다.', 'Programming', 'intermediate', ['Garbage Collection', 'Memory Leak', 'Resource']],
  ['development', 'Referential Integrity', '레퍼런셜 인테그리티', '참조 관계가 깨지지 않도록 유지하는 데이터 무결성', 'Foreign Key가 존재하지 않는 레코드를 가리키지 않게 합니다.', 'Data / Schema', 'advanced', ['Foreign Key', 'Primary Key', 'Consistency']],
  ['development', 'Resource', '리소스', '메모리, 파일, 네트워크 연결처럼 제한된 실행 자원', '열었으면 닫고, 잡았으면 해제해야 누수를 막습니다.', 'Runtime', 'basic', ['Memory Leak', 'Lifecycle', 'Garbage Collection']],
  ['development', 'Security', '시큐리티', '시스템과 데이터를 허용된 방식으로만 쓰게 보호하는 성질', 'TLS, CORS, 권한, 입력 검증이 함께 작동합니다.', 'Boundary / Safety', 'basic', ['TLS', 'CORS', 'Validation']],
  ['development', 'Staleness', '스테일니스', '데이터가 최신 Source of Truth보다 오래된 상태', '캐시와 화면 상태가 실제 값과 어긋날 때 발생합니다.', 'Runtime', 'intermediate', ['Cache Invalidation', 'Source of Truth', 'Current Truth']],
  ['libraries-tools', 'Accessibility', '액세서빌리티', '다양한 사용자가 앱을 이해하고 조작할 수 있게 하는 품질', '색 대비, 키보드 이동, 스크린리더 의미를 확인합니다.', 'Quality Tools', 'basic', ['Lighthouse', 'Browser', 'UI']],
  ['libraries-tools', 'UI', '유아이', '사용자가 보고 누르고 읽는 화면과 조작 요소', '버튼, 카드, 탭, 입력창처럼 사용 흐름을 만드는 표면입니다.', 'Frontend Frameworks', 'basic', ['Component', 'Accessibility', 'Render']],
  ['libraries-tools', 'Breaking Change', '브레이킹 체인지', '기존 사용 방식과 호환되지 않는 변경', '버전 업데이트 전 영향 범위와 마이그레이션 필요성을 확인합니다.', 'Package Managers', 'intermediate', ['Semantic Versioning', 'Dependency', 'Migration']],
  ['libraries-tools', 'Chunk', '청크', '번들을 나눈 개별 파일 조각', '초기 로딩과 캐싱 전략에 영향을 줍니다.', 'Build Tools', 'intermediate', ['Bundle', 'Vite', 'Tree Shaking']],
  ['libraries-tools', 'Column', '컬럼', '표 데이터에서 세로 방향의 속성 단위', 'DataFrame과 스키마를 읽을 때 기본 단위입니다.', 'Data Tools', 'basic', ['DataFrame', 'Series', 'Schema']],
  ['libraries-tools', 'Console', '콘솔', '브라우저나 터미널에서 로그와 오류를 확인하는 창', '디버깅의 첫 단서가 자주 나타납니다.', 'Quality Tools', 'basic', ['Browser DevTools', 'Debugging', 'Stack Trace']],
  ['libraries-tools', 'Debugging', '디버깅', '문제 원인을 찾아 재현하고 수정하는 과정', '증상, 재현 조건, 원인, 검증을 분리해 진행합니다.', 'Quality Tools', 'basic', ['Regression', 'Stack Trace', 'Source Map']],
  ['libraries-tools', 'Dev Server', '데브 서버', '개발 중 앱을 빠르게 실행하고 갱신하는 서버', 'Vite의 HMR과 로컬 확인 흐름을 담당합니다.', 'Build Tools', 'basic', ['Vite', 'Hot Module Replacement', 'Browser']],
  ['libraries-tools', 'Formatting', '포매팅', '코드 모양을 일관된 형식으로 정리하는 작업', 'Prettier가 주로 담당하고 의미 변경과 분리해야 합니다.', 'Quality Tools', 'basic', ['Prettier', 'Diff', 'ESLint']],
  ['libraries-tools', 'Module', '모듈', '코드를 파일이나 기능 단위로 나눈 재사용 단위', 'import/export와 번들링의 기본 단위입니다.', 'Build Tools', 'basic', ['Bundle', 'Dependency', 'Vite']],
  ['libraries-tools', 'Network Tab', '네트워크 탭', '브라우저 요청과 응답을 확인하는 DevTools 영역', 'API 호출, 정적 파일, 캐시 상태를 분석합니다.', 'Quality Tools', 'basic', ['Browser DevTools', 'HTTP', 'CORS']],
  ['libraries-tools', 'Performance', '퍼포먼스', '앱이 얼마나 빠르고 부드럽게 반응하는지의 품질', '로딩, 렌더링, 번들 크기, 메모리 사용을 함께 봅니다.', 'Quality Tools', 'intermediate', ['Lighthouse', 'Bundle', 'Memoization']],
  ['libraries-tools', 'Render', '렌더', '상태와 데이터를 화면 출력으로 바꾸는 과정', 'React에서는 상태 변경이 렌더를 일으키고 실제 DOM 갱신으로 이어집니다.', 'React', 'basic', ['Reconciliation', 'State', 'Component']],
  ['libraries-tools', 'Reproducibility', '리프로듀서빌리티', '다른 환경에서도 같은 결과를 다시 만들 수 있는 성질', 'Lockfile과 고정된 스크립트가 빌드 재현성을 높입니다.', 'Build Tools', 'intermediate', ['Lockfile', 'package.json', 'Dependency']],
  ['libraries-tools', 'SSR', '에스에스알', '서버에서 HTML을 먼저 만든 뒤 브라우저에 보내는 렌더링 방식', 'Hydration과 함께 동작하며 초기 표시 속도와 SEO에 영향을 줍니다.', 'Frontend Frameworks', 'advanced', ['Hydration', 'React', 'Render']],
  ['libraries-tools', 'Stack Trace', '스택 트레이스', '오류가 어떤 함수 호출 경로에서 발생했는지 보여주는 기록', 'Source Map과 함께 원본 코드 위치를 추적합니다.', 'Quality Tools', 'intermediate', ['Debugging', 'Source Map', 'Console']],
  ['libraries-tools', 'Unit Test', '유닛 테스트', '작은 함수나 컴포넌트 단위를 독립적으로 검증하는 테스트', '빠른 회귀 확인과 로직 안정성에 유용합니다.', 'Quality Tools', 'basic', ['Vitest', 'Regression', 'Fixture']],
  ['libraries-tools', 'Virtual DOM', '버추얼 돔', '실제 DOM을 직접 바꾸기 전 React가 비교에 쓰는 가벼운 UI 표현', 'Reconciliation 과정에서 변경 차이를 계산하는 데 쓰입니다.', 'React', 'advanced', ['Reconciliation', 'Render', 'Diff']],
] as const

const expertTerms = expertSeedTerms.map(
  ([deck, term, pronunciation, koreanMeaning, simpleMeaning, category, difficulty, relatedTerms]) =>
    makeExpertTerm({
      id: `expert-${deck}-${slugify(term)}`,
      deck,
      term,
      pronunciation,
      koreanMeaning,
      simpleMeaning,
      category,
      difficulty,
      relatedTerms: relatedTerms ? [...relatedTerms] : undefined,
    }),
)

const addedTerms = [
  ...aiCommandTerms,
  ...librariesToolTerms,
  ...joovisArchitectureTerms,
  ...disputeTerms,
  ...expertTerms,
] satisfies RawDevTerm[]

const buildResult = buildDataset(legacyTerms, addedTerms)

export const devTerms = buildResult.terms
export const datasetStats = buildResult.stats

function makeAiTerm(term: Omit<RawDevTerm, 'id' | 'deck' | 'domainLabel' | 'joovisUsage' | 'checkQuestion' | 'codexPromptExample' | 'gptPromptExample'>): RawDevTerm {
  return {
    id: `ai-${slugify(term.term)}`,
    deck: 'ai-command',
    domainLabel: 'AI 지휘',
    pronunciation: term.pronunciation,
    term: term.term,
    koreanMeaning: term.koreanMeaning,
    simpleMeaning: term.simpleMeaning,
    category: term.category,
    difficulty: term.difficulty,
    joovisUsage: `AI에게 ${term.koreanMeaning}을 명확히 지시할 때 쓰는 표현입니다.`,
    checkQuestion: `${term.term}을 쓸 때 무엇을 더 분명히 해야 하나요?`,
    gptPromptExample: term.goodExpression,
    codexPromptExample: term.goodExpression,
    badExpression: term.badExpression,
    goodExpression: term.goodExpression,
    relatedTerms: term.relatedTerms,
  }
}

function makeToolTerm(
  term: string,
  pronunciation: string,
  koreanMeaning: string,
  simpleMeaning: string,
  category: string,
): RawDevTerm {
  return {
    id: `tool-${slugify(term)}`,
    term,
    pronunciation,
    koreanMeaning,
    simpleMeaning,
    category,
    deck: 'libraries-tools',
    domainLabel: '라이브러리/도구',
    difficulty: 'basic',
    joovisUsage: `${term}은 학습 앱이나 자동화 작업을 만들 때 실무 도구로 이해하면 좋습니다.`,
    checkQuestion: `${term}은 어떤 역할의 도구인가요?`,
    codexPromptExample: `${term} 관련 변경이 있다면 공식 역할, 현재 사용 위치, 빌드 영향만 분리해서 설명해줘.`,
  }
}

function makeJoovisTerm(
  term: string,
  pronunciation: string,
  koreanMeaning: string,
  simpleMeaning: string,
  category: string,
): RawDevTerm {
  return {
    id: `joovis-${slugify(term)}`,
    term,
    pronunciation,
    koreanMeaning,
    simpleMeaning,
    category,
    deck: 'joovis-architecture',
    domainLabel: 'JOOVIS',
    difficulty: 'intermediate',
    joovisUsage: `JOOVIS 아키텍처 언어에서 ${term}은 ${simpleMeaning}`,
    checkQuestion: `${term}은 어떤 경계나 흐름을 분명하게 만들까요?`,
    codexPromptExample: `${term} 관점으로 현재 상태, 변경 경계, 검증 필요 사항을 분리해줘.`,
  }
}

function makeDisputeTerm(
  term: Pick<RawDevTerm, 'id' | 'term' | 'pronunciation' | 'koreanMeaning' | 'simpleMeaning' | 'category'> & {
    difficulty: Difficulty
    relatedTerms?: string[]
  },
): RawDevTerm {
  return {
    ...term,
    deck: 'dispute-integration',
    domainLabel: '분쟁통합',
    disputeUsage: `${term.term}은 자료를 주장, 쟁점, 출처, 인용 가능성과 분리해서 정리할 때 쓰는 일반 교육용 용어입니다.`,
    checkQuestion: `${term.term}을 판단할 때 원본대조, 민감정보, 인용 가능 여부 중 무엇을 확인해야 하나요?`,
    gptPromptExample: `이 자료에서 ${term.term} 관점으로 확인할 항목을 원본대조, 쟁점 연결, 민감정보, 인용안전으로 나눠줘.`,
    codexPromptExample: `정적 학습 데이터 안에서 ${term.term} 설명이 일반적이고 개인정보 없는 표현인지 점검해줘.`,
    badExpression: '이 증거 중요한 것 같아.',
    goodExpression:
      '이 자료가 어떤 주장과 연결되는지, 원본대조 필요 여부, 직접인용 가능 여부, 민감정보 포함 여부를 분리해서 판단해줘.',
    evidenceCaution: '원본 확인 전에는 단정하거나 직접 인용하지 마세요.',
    privacyWarning: '실명, 주소, 계정번호, 구체적 사건 사실은 학습 예시에 넣지 마세요.',
    relatedTerms: term.relatedTerms ?? ['원본대조', '쟁점', '인용안전등급'],
  }
}

function makeExpertTerm(
  term: Pick<
    RawDevTerm,
    'id' | 'term' | 'pronunciation' | 'koreanMeaning' | 'simpleMeaning' | 'category' | 'relatedTerms'
  > & {
    deck: DeckId
    difficulty: Difficulty
  },
): RawDevTerm {
  const domainLabel = getDomainLabel(term.deck)
  return {
    ...term,
    domainLabel,
    joovisUsage:
      term.deck === 'dispute-integration'
        ? undefined
        : `${term.term}은 ${domainLabel} Deck에서 설계, 검증, 리뷰를 더 정확하게 말하기 위한 전문가 용어입니다.`,
    disputeUsage:
      term.deck === 'dispute-integration'
        ? `${term.term}은 증거관리, 쟁점정리, 원본대조, 인용안전 판단을 분리해서 기록할 때 쓰는 일반 교육용 용어입니다.`
        : undefined,
    checkQuestion: `${term.term}을 실제로 쓸 때 무엇을 기준으로 판단하고, 어떤 관련 용어와 함께 확인해야 하나요?`,
    codexPromptExample:
      term.deck === 'dispute-integration'
        ? `이 학습 데이터에서 ${term.term} 설명이 일반적이고 개인정보 없는 교육용 표현인지 점검해줘.`
        : `${term.term} 관점으로 현재 구현이나 설명에서 작동 원리, 위험, 검증 기준을 분리해서 설명해줘.`,
    gptPromptExample:
      term.deck === 'ai-command'
        ? `${term.term} 기준으로 내 요청을 목적, 경계, 출력 형식, 검증 기준으로 다시 써줘.`
        : undefined,
    badExpression:
      term.deck === 'ai-command'
        ? '이거 잘 되게 해줘.'
        : term.deck === 'dispute-integration'
          ? '이 자료 중요한 것 같아.'
          : undefined,
    goodExpression:
      term.deck === 'ai-command'
        ? `${term.term}을 기준으로 목표, 입력 자료, 금지 경계, 완료 기준, 검증 방법을 분리해서 처리해줘.`
        : term.deck === 'dispute-integration'
          ? `${term.term} 관점에서 원본대조 필요 여부, 연결되는 쟁점, 인용 가능성, 민감정보 포함 여부를 분리해서 판단해줘.`
          : undefined,
  }
}

function buildDataset(legacy: RawDevTerm[], additions: RawDevTerm[]) {
  const termsByKey = new Map<string, DevTerm>()
  const stats = {
    totalTerms: 0,
    added: 0,
    updated: legacy.length,
    skippedDuplicates: 0,
    deckCounts: {
      'ai-command': 0,
      development: 0,
      'libraries-tools': 0,
      'joovis-architecture': 0,
      'dispute-integration': 0,
    } satisfies Record<DeckId, number>,
  }

  for (const term of legacy) {
    const enriched = enrichTerm(term)
    termsByKey.set(getDedupKey(enriched), enriched)
  }

  for (const term of additions) {
    const enriched = enrichTerm(term)
    const key = getDedupKey(enriched)
    const existing = termsByKey.get(key)

    if (!existing) {
      termsByKey.set(key, enriched)
      stats.added += 1
      continue
    }

    const merged = mergeTerms(existing, enriched)
    if (JSON.stringify(merged) === JSON.stringify(existing)) {
      stats.skippedDuplicates += 1
    } else {
      termsByKey.set(key, merged)
      stats.updated += 1
    }
  }

  const terms = [...termsByKey.values()]
  stats.totalTerms = terms.length
  for (const term of terms) {
    stats.deckCounts[term.deck] += 1
  }

  return { terms, stats }
}

function enrichTerm(term: RawDevTerm): DevTerm {
  const deck = term.deck ?? inferDeck(term)
  const domainLabel = term.domainLabel ?? getDomainLabel(deck)
  const difficulty = term.difficulty ?? inferDifficulty(term)
  const base: DevTerm = {
    ...term,
    deck,
    domainLabel,
    difficulty,
    joovisUsage: term.joovisUsage,
    codexPromptExample: term.codexPromptExample,
  }
  const withDepth: DevTerm = {
    ...base,
    mentalModel: base.mentalModel ?? buildMentalModel(base),
    whyItMatters: base.whyItMatters ?? buildWhyItMatters(base),
    withoutIt: base.withoutIt ?? buildWithoutIt(base),
    realWorkflow: base.realWorkflow ?? buildRealWorkflow(base),
    mechanism: base.mechanism ?? buildMechanism(base),
    usagePattern: base.usagePattern ?? buildUsagePattern(base),
    commonPitfall: base.commonPitfall ?? buildCommonPitfall(base),
    expertNote: base.expertNote ?? buildExpertNote(base),
    relatedTerms: mergeRelatedTerms(base.relatedTerms, getDefaultRelatedTerms(base)),
  }

  if (deck === 'ai-command') {
    return {
      ...withDepth,
      badExpression: withDepth.badExpression ?? '이거 좀 봐줘.',
      goodExpression:
        withDepth.goodExpression ??
        '현재 상태, 변경 파일, 열린 경계, 금지 경계, 검증 결과, 다음 단계만 분리해서 판정해줘.',
      gptPromptExample:
        withDepth.gptPromptExample ??
        '모호한 표현을 줄이고 목표, 경계, 검증 기준을 분리해서 다시 써줘.',
    }
  }

  return withDepth
}

function buildMentalModel(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `${term.term}은 AI 작업실 입구에 붙은 작업표처럼 생각하면 됩니다. 표에는 목표, 재료, 금지 구역, 통과 기준이 적혀 있고, AI는 그 표를 보며 어디까지 들어가고 어디서 멈춰야 하는지 판단합니다.`
    case 'development':
      return `시스템을 건물로 보면 ${term.term}은 방, 복도, 배관, 출입문 중 하나의 역할을 합니다. 데이터가 어느 문으로 들어와 어떤 방을 지나고 어디에서 막히는지 공간적으로 따라가면 개념이 훨씬 선명해집니다.`
    case 'libraries-tools':
      return `${term.term}은 작업대 위의 전문 공구처럼 보면 됩니다. 망치인지, 자인지, 전동드릴인지 알아야 제대로 쓰듯이 이 도구가 빌드, 화면, 데이터, 검증 중 어느 문제를 해결하는지 먼저 잡아야 합니다.`
    case 'joovis-architecture':
      return `${term.term}은 관제실 지도 위의 구역 표시처럼 이해하면 좋습니다. 어떤 구역은 현재 진실을 보관하고, 어떤 구역은 검증 대기열이며, 어떤 문은 통과 전 리뷰가 필요한 경계입니다.`
    case 'dispute-integration':
      return `${term.term}은 증거 보관실의 라벨과 동선처럼 보면 됩니다. 원본 선반, 제출본 선반, 검토 대기함, 민감정보 잠금 구역을 분리해 두어야 자료가 섞이지 않습니다.`
  }
}

function buildWhyItMatters(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `${term.term}이 필요한 이유는 AI가 빈칸을 자연스럽게 메우려 하기 때문입니다. 기준을 먼저 주면 추측이 줄고, 답변을 나중에 검증하거나 고치기도 쉬워집니다.`
    case 'development':
      return `${term.term}이 중요한 이유는 버그가 대부분 "어디서 무엇이 바뀌었는지"를 놓칠 때 생기기 때문입니다. 이 개념은 원인 위치와 영향 범위를 좁히는 손잡이가 됩니다.`
    case 'libraries-tools':
      return `${term.term}을 이해하면 도구를 외워서 쓰는 것이 아니라 문제에 맞춰 선택할 수 있습니다. 특히 설정 오류, 버전 충돌, 빌드 실패가 났을 때 어디를 봐야 하는지 알려줍니다.`
    case 'joovis-architecture':
      return `${term.term}은 JOOVIS 작업이 감이 아니라 구조로 이어지게 만들기 때문에 중요합니다. 현재 상태, 변경 경계, 다음 판단자가 받을 정보가 분리되면 작업이 덜 흔들립니다.`
    case 'dispute-integration':
      return `${term.term}이 필요한 이유는 자료가 많아질수록 중요도, 출처, 원본성, 인용 가능성이 쉽게 섞이기 때문입니다. 분리해서 기록해야 나중에 안전하게 검토할 수 있습니다.`
  }
}

function buildWithoutIt(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `${term.term}이 없으면 AI는 사용자의 의도보다 그럴듯한 평균 답변을 우선할 수 있습니다. 그러면 금지된 범위를 건드리거나, 검증되지 않은 결론을 확정처럼 말할 위험이 커집니다.`
    case 'development':
      return `${term.term}을 모르고 작업하면 증상만 고치고 원인은 남길 수 있습니다. 작은 수정이 다른 모듈, 데이터, 런타임 흐름에 어떤 영향을 주는지 놓치기 쉽습니다.`
    case 'libraries-tools':
      return `${term.term}을 모르고 쓰면 오류가 났을 때 "라이브러리 문제"처럼 뭉뚱그리게 됩니다. 실제로는 설정, 타입, 번들, 런타임, 브라우저 중 한 지점의 문제일 수 있습니다.`
    case 'joovis-architecture':
      return `${term.term}이 없으면 작업 단위가 말로만 남고, 누가 무엇을 기준으로 이어받아야 하는지 흐려집니다. 결과적으로 재현, 리뷰, 롤백이 어려워집니다.`
    case 'dispute-integration':
      return `${term.term}을 빼면 자료가 "중요해 보임" 같은 감상으로만 남습니다. 원본대조, 민감정보, 쟁점 연결, 직접인용 가능 여부가 분리되지 않아 나중에 위험해질 수 있습니다.`
  }
}

function buildRealWorkflow(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `실제로는 먼저 ${term.term}을 기준으로 요청을 다시 씁니다. 그다음 입력 자료, 금지 경계, 출력 형식, 검증 방법을 나누고, 마지막에 AI 답변이 그 기준을 지켰는지 확인합니다.`
    case 'development':
      return `현장에서는 ${term.term}을 볼 때 관련 파일을 찾고, 입력과 출력 shape를 확인하고, 실패 경로를 재현한 뒤, 작은 수정과 빌드/테스트 검증으로 닫습니다.`
    case 'libraries-tools':
      return `작업 흐름은 ${term.term}의 공식 역할을 확인하고, 프로젝트에서 쓰이는 위치를 찾고, 설정과 버전을 본 뒤, 빌드 결과나 브라우저 동작으로 실제 효과를 검증하는 순서입니다.`
    case 'joovis-architecture':
      return `JOOVIS 흐름에서는 ${term.term}을 현재 상태 기록, 경계 확인, 변경 실행, 리뷰 게이트, 핸드오프 순서 안에 배치합니다. 그래야 다음 작업자가 같은 지도를 보고 이어갈 수 있습니다.`
    case 'dispute-integration':
      return `실제 정리에서는 ${term.term}을 증거목록에 붙이고, 원본대조 필요 여부, 쟁점 연결, 인용 가능성, 민감정보 여부를 별도 칸으로 기록합니다. 최근파일 단서만으로 복사나 제출을 단정하지 않습니다.`
  }
}

function buildMechanism(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `${term.term}은 AI가 답을 생성하기 전에 목적, 입력, 경계, 완료 기준을 정렬하게 만드는 지휘 장치입니다. 실제로는 모호한 요청을 작은 판단 단위로 쪼개고, 각 단위가 어떤 근거와 검증 조건을 가져야 하는지 고정합니다.`
    case 'development':
      return `${term.term}은 코드나 시스템이 실행될 때 데이터, 상태, 의존성이 어떤 순서로 움직이는지 설명하는 개념입니다. 단어를 외우는 것보다 입력이 들어오고 처리되고 실패하거나 성공하는 경로를 따라가야 의미가 잡힙니다.`
    case 'libraries-tools':
      return `${term.term}은 도구가 내부에서 어떤 문제를 대신 해결해 주는지 이해해야 쓸 수 있습니다. 설치 명령이나 이름만 외우지 말고 빌드, 런타임, 타입 검사, 브라우저 동작 중 어디에 끼어드는지 봐야 합니다.`
    case 'joovis-architecture':
      return `${term.term}은 JOOVIS 안에서 상태, 경계, 검증, 릴레이를 분리해 사고하기 위한 구조 언어입니다. 작동 원리는 현재 진실과 변경 경계를 나눈 뒤 다음 판단자가 같은 기준으로 이어받게 하는 것입니다.`
    case 'dispute-integration':
      return `${term.term}은 자료를 감정적으로 중요하다고 보는 대신 원본성, 출처, 쟁점 연결, 인용 가능성, 민감정보 위험으로 나눠 다루게 하는 증거관리 개념입니다. 이 설명은 일반 교육용이며 실제 사건 사실을 포함하지 않습니다.`
  }
}

function buildUsagePattern(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `프롬프트에서 ${term.term}을 쓸 때는 "무엇을 해줘"보다 "무엇을 기준으로 판단하고, 무엇은 하지 말고, 어떤 형식으로 검증 결과를 내라"까지 같이 말합니다.`
    case 'development':
      return `코드 리뷰에서는 ${term.term}이 입력, 출력, 상태 변화, 예외 처리, 테스트 중 어디에 영향을 주는지 확인합니다. 버그를 찾을 때도 이 순서로 보면 놓치는 부분이 줄어듭니다.`
    case 'libraries-tools':
      return `${term.term}을 사용할 때는 공식 역할, 프로젝트 안의 위치, 빌드 결과, 브라우저나 Node.js 런타임에 미치는 영향을 함께 확인합니다.`
    case 'joovis-architecture':
      return `JOOVIS 문맥에서는 ${term.term}을 단독 명칭이 아니라 LOCK, Current Truth, Review Gate, Handoff Packet 같은 경계 언어와 함께 써서 작업 흐름을 통제합니다.`
    case 'dispute-integration':
      return `분쟁통합 문맥에서는 ${term.term}을 증거목록, 쟁점태그, 원본대조, 직접인용 가능 여부와 연결해 기록합니다. 최근파일이나 추정만으로 사실을 단정하지 않습니다.`
  }
}

function buildCommonPitfall(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return `${term.term}을 말하면서도 출력 형식, 금지 경계, 검증 기준을 빼면 AI가 넓게 추측할 수 있습니다. 그래서 좋은 명령은 항상 경계와 판정 기준을 같이 둡니다.`
    case 'development':
      return `${term.term}을 이름만 알고 실제 실행 경로를 보지 않으면 원인을 잘못 짚기 쉽습니다. 특히 비동기, 캐시, 상태 변경, 의존성 문제는 겉으로 보이는 증상과 실제 원인이 다를 수 있습니다.`
    case 'libraries-tools':
      return `${term.term}을 "설치하면 해결되는 것"으로만 이해하면 버전, 설정, 빌드 출력, 브라우저 호환성 문제를 놓칩니다. 도구가 어느 단계에서 일하는지 확인해야 합니다.`
    case 'joovis-architecture':
      return `${term.term}을 멋있는 이름처럼만 쓰면 작업 경계가 흐려집니다. 반드시 어떤 파일, 상태, 판단, 검증을 보호하거나 전달하는지까지 붙여야 합니다.`
    case 'dispute-integration':
      return `${term.term}을 근거 없이 "중요함"으로만 표시하면 위험합니다. 원본대조 전 직접인용, 민감정보 미가림, 쟁점과 무관한 자료 확대를 피해야 합니다.`
  }
}

function buildExpertNote(term: DevTerm) {
  const related = term.relatedTerms?.slice(0, 4).join(', ')
  return related
    ? `${term.term}은 단독 암기보다 ${related}와 함께 연결해서 이해해야 실제 보고서나 리뷰에서 쓸 수 있습니다.`
    : `${term.term}은 뜻만 외우기보다 어떤 판단을 가능하게 하고 어떤 실수를 막는지까지 연결해서 익혀야 합니다.`
}

function getDefaultRelatedTerms(term: DevTerm) {
  switch (term.deck) {
    case 'ai-command':
      return ['Context', 'Scope', 'Boundary', 'Acceptance Criteria']
    case 'development':
      return ['Interface', 'Schema', 'Runtime', 'Invariant']
    case 'libraries-tools':
      return ['Dependency', 'Runtime', 'Build', 'Validation']
    case 'joovis-architecture':
      return ['Current Truth', 'Boundary Ledger', 'Review Gate', 'State Capsule']
    case 'dispute-integration':
      return ['원본대조', '출처추적', '인용안전등급', '민감정보']
  }
}

function mergeRelatedTerms(primary: string[] | undefined, fallback: string[]) {
  const seen = new Set<string>()
  return [...(primary ?? []), ...fallback].filter((term) => {
    const key = normalizeTerm(term)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function inferDeck(term: RawDevTerm): DeckId {
  if (term.category === 'AI Command') {
    return 'ai-command'
  }
  if (term.category === 'JOOVIS-Specific') {
    return 'joovis-architecture'
  }
  return 'development'
}

function inferDifficulty(term: RawDevTerm): Difficulty {
  if (term.category === 'Data / Schema' || term.category === 'Architecture') {
    return 'intermediate'
  }
  if (term.category === 'JOOVIS-Specific') {
    return 'intermediate'
  }
  if (term.category === 'Runtime / Integration') {
    return 'intermediate'
  }
  return 'basic'
}

function getDomainLabel(deck: DeckId) {
  switch (deck) {
    case 'ai-command':
      return 'AI 지휘'
    case 'development':
      return '개발 기본'
    case 'libraries-tools':
      return '라이브러리/도구'
    case 'joovis-architecture':
      return 'JOOVIS'
    case 'dispute-integration':
      return '분쟁통합'
  }
}

function mergeTerms(existing: DevTerm, incoming: DevTerm): DevTerm {
  return {
    ...existing,
    ...Object.fromEntries(
      Object.entries(incoming).filter(([, value]) => value !== undefined && value !== ''),
    ),
    id: existing.id,
    term: existing.term,
    deck: existing.deck,
  }
}

function getDedupKey(term: DevTerm) {
  return `${term.deck}:${normalizeTerm(term.term)}`
}

function normalizeTerm(term: string) {
  return term.normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]+/gu, '')
}

function slugify(term: string) {
  const slug = term
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || normalizeTerm(term)
}
