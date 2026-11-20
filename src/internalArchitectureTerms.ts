import type {
  ArchitectureStatus,
  LearningPriority,
  RawDevTerm,
} from './types'

type InternalDeck = 'joovis-architecture' | 'foundry-lab'

type InternalSeed = {
  deck: InternalDeck
  term: string
  pronunciation: string
  koreanMeaning: string
  simpleMeaning: string
  mechanism: string
  workflow: string
  failure: string
  relatedTerms: string[]
  status: ArchitectureStatus
  category: string
  priority: LearningPriority
}

const joovisCapabilitySource =
  '읽기 전용 근거: joovis-invest-os/docs/architecture/JOOVIS_CAPABILITY_PORT_ADAPTER_TRACE_ARCHITECTURE_STANDARD_2026-05-21.md'
const joovisWorldSource =
  '읽기 전용 근거: joovis-invest-os/docs/ideas/JOOVIS_REALITY_SYNCED_WORLD_UPPER_ARCHITECTURE_REVIEW_2026-07-10.md'
const joovisCurrentSource =
  '읽기 전용 근거: joovis-invest-os/docs/JOOVIS_CURRENT_STATE.md 및 docs/JOOVIS_WBS_v0_5.md'
const foundrySource =
  '읽기 전용 근거: joovis-agent-foundry-lab/FOUNDRY_START_HERE.md, FOUNDRY_LAB_MANIFEST_v0_1.md, 목표 아키텍처 문서 및 src/core 구성요소 README'

const internalSeeds: InternalSeed[] = [
  joovis(
    'Capability Unit', '케이퍼빌리티 유닛',
    '하나의 능력을 계약·포트·어댑터·추적·안전 경계와 함께 묶은 설계 단위',
    '기능 코드 한 조각이 아니라 무엇을 약속하고 어디까지 책임지는지를 통째로 포장한 상자입니다.',
    '상위 시스템은 안정된 계약과 포트만 호출하고 공급자 차이는 어댑터에 격리하며 실행 흔적과 금지 경계를 같은 단위에 붙입니다.',
    '계약을 먼저 쓰고 포트, 어댑터, provenance trace, safety boundary 순서로 연결한 뒤 독립 검증합니다.',
    '함수나 화면만 capability라고 부르면 실제 권한, 외부 의존성, 실패 책임과 검증 근거가 흩어집니다.',
    ['Contract Manifest', 'Adapter', 'Provenance Trace', 'Runtime Authority'], 'concept', 'Capability Architecture',
  ),
  joovis(
    'Contract Manifest', '컨트랙트 매니페스트',
    'Capability의 버전·입출력·의존성·권한을 기계가 읽을 수 있게 선언한 명세',
    '상자 겉면에 내용물, 연결법, 위험 표시를 붙인 공식 라벨입니다.',
    '런타임과 검증기가 선언된 계약을 읽어 호환성, 의존성, 허용 권한과 산출물 형식을 사전에 검사합니다.',
    '구현보다 먼저 manifest를 버전 관리하고 admission 시 실제 구현과 선언이 일치하는지 검사합니다.',
    '문서만 있고 기계 검증이 없으면 선언과 코드가 조용히 갈라지는 contract drift가 생깁니다.',
    ['Contract', 'Schema', 'Capability Unit', 'Admission'], 'concept', 'Capability Architecture',
  ),
  joovis(
    'Provenance Trace', '프로버넌스 트레이스',
    '입력 출처부터 변환·판단·출력까지 이어지는 추적 경로',
    '결론에서 출발해 어떤 재료와 과정을 거쳤는지 거꾸로 따라가는 영수증 묶음입니다.',
    '각 단계가 source ref, 변환 버전, 시각과 산출물 ref를 이어 받아 하나의 원인 사슬을 만듭니다.',
    '입력 식별자를 만들고 모든 중간 artifact에 부모 ref를 전파한 뒤 결과에서 전체 경로를 재구성합니다.',
    '최종 값만 남으면 재현, 오류 위치 판정과 원본 변경 영향 분석이 불가능해집니다.',
    ['Provenance', 'Execution Trace', 'Evaluation Ledger', 'Artifact'], 'concept', 'Traceability',
  ),
  joovis(
    'Data Block Recipe', '데이터 블록 레시피',
    '특정 판단용 Data Block을 재현 가능하게 조립하는 입력·변환·검증 규칙',
    '재료 목록뿐 아니라 손질 순서와 완성 검사까지 적힌 조립법입니다.',
    '원천 ref, 시간 기준, 변환 버전, feature 규칙과 품질 검사를 고정해 같은 조건에서 같은 block을 다시 만듭니다.',
    'recipe를 버전으로 고정하고 source refs를 materialize한 뒤 schema와 leakage 검사를 통과시킵니다.',
    '완성 데이터만 저장하면 어떤 원천과 변환으로 만들었는지 알 수 없어 재현과 비교가 깨집니다.',
    ['Data Block', 'Dataset/Arena Packet', 'Material Fingerprint', 'Provenance Trace'], 'concept', 'Data Surface',
  ),
  joovis(
    'Canonical World State', '커노니컬 월드 스테이트',
    '검증된 관측을 투영해 만든 시스템의 기준 세계 상태',
    '여러 센서 기록을 모아 현재 세계를 대표하도록 정리한 공식 지도입니다.',
    '순서가 있는 관측을 결정적 projector로 접어 동일한 입력에서 재구성 가능한 authoritative state를 만듭니다.',
    '관측을 as-of 규칙에 따라 적용하고 invariant를 검사한 뒤 소비자에게 읽기 표면으로 제공합니다.',
    '각 에이전트가 자기 방식으로 세계를 조립하면 같은 시점에도 서로 다른 현실을 전제로 판단합니다.',
    ['Source of Truth', 'Snapshot', 'Replay World', 'Agent Perception'], 'target', 'Reality-Synced World',
  ),
  joovis(
    'Replay World', '리플레이 월드',
    '기록된 과거 events를 재생해 판단과 상태를 재현하는 격리 세계',
    '실제 시간은 멈추고 과거 필름을 다시 돌려 보는 조사실입니다.',
    '고정된 events, artifacts와 versions를 결정적으로 재생하고 현재 외부 시스템과의 부작용을 차단합니다.',
    'episode와 dependency versions를 고정한 뒤 projector와 agent를 재실행해 기존 trace와 비교합니다.',
    '현재 provider나 실시간 시계를 읽으면 과거 재현이 아니라 새로운 실행이 됩니다.',
    ['Replay', 'Deterministic Verification', 'Shadow World', 'Decision Episode'], 'target', 'World Mode',
  ),
  joovis(
    'World Readiness', '월드 레디니스',
    '현재 세계 상태가 특정 소비나 판단에 사용 가능한지 나타내는 종합 상태',
    '데이터가 있다는 사실을 넘어 지금 이 작업을 시작해도 되는지 보는 출발 신호입니다.',
    'source health, cadence, watermark, continuity와 consumer sufficiency를 결합해 readiness를 판정합니다.',
    '소스별 상태를 소비자 요구와 비교해 ready, degraded, unavailable 같은 제한된 상태로 노출합니다.',
    '행 하나가 최신이라는 이유만으로 전체 세계를 ready로 보면 누락·시차·소스 단절을 놓칩니다.',
    ['Source Health', 'Watermark', 'Consumer Sufficiency', 'Degraded Mode'], 'current', 'Readiness',
  ),
  joovis(
    'Source Cadence', '소스 케이던스',
    '원천 데이터가 생성·갱신되는 고유 주기와 시간 규칙',
    '각 원천이 자기 박자로 새 값을 내놓는 시간표입니다.',
    '분·일·이벤트 기반 갱신 주기를 모델링해 freshness와 expectedness 판단의 기준으로 사용합니다.',
    '원천별 calendar와 허용 지연을 설정하고 마지막 성공 관측으로 다음 기대 시각을 계산합니다.',
    '모든 source에 같은 freshness 기준을 적용하면 느린 공식 데이터는 오탐, 빠른 데이터는 늦은 탐지가 됩니다.',
    ['Source Health', 'Watermark', 'Data Freshness', 'Staleness'], 'current', 'Source Health',
  ),
  joovis(
    'Watermark', '워터마크',
    '이 시점까지의 데이터가 처리·확정되었다고 볼 수 있는 시간 경계',
    '강물이 이 선까지 들어왔다는 표시처럼 처리 완료 범위를 알려주는 시간선입니다.',
    '여러 source의 진행도를 비교해 늦게 도착할 수 있는 event를 고려한 안전한 as-of 경계를 계산합니다.',
    'source별 watermark를 추적하고 결합 snapshot은 가장 보수적인 안전 경계에 맞춥니다.',
    '최신 timestamp 하나만 보면 아직 도착하지 않은 과거 event 때문에 결과가 뒤집힐 수 있습니다.',
    ['As-of Timestamp', 'Point-in-Time Data', 'Source Cadence', 'Snapshot'], 'current', 'Temporal Safety',
  ),
  joovis(
    'Consumer Sufficiency', '컨슈머 서피션시',
    '특정 소비자가 목적을 수행하기에 현재 데이터가 충분한지에 대한 판정',
    '창고가 가득한지가 아니라 이 작업자에게 필요한 재료가 모두 있는지 보는 검사입니다.',
    '소비자별 required sources, freshness, coverage와 quality threshold를 world readiness에 대입합니다.',
    '소비 목적을 계약으로 선언하고 현재 snapshot이 요건을 충족할 때만 해당 기능을 enable합니다.',
    '전역 ready 하나만 두면 요구가 다른 화면과 판단기가 같은 허용 상태를 공유하게 됩니다.',
    ['World Readiness', 'Capability State', 'Admission', 'Data Sufficiency Agent'], 'current', 'Readiness',
  ),
  joovis(
    'Decision Episode', '디시전 에피소드',
    '하나의 판단을 입력 snapshot부터 결과·근거까지 묶는 추적 단위',
    '한 번의 의사결정을 시작 장면부터 결말까지 봉인한 사건 파일입니다.',
    'episode id 아래 snapshot refs, candidate version, decision, abstention, evidence와 outcome을 연결합니다.',
    '판단 시작 때 episode를 열고 입력을 고정한 뒤 모든 중간 artifact와 종료 상태를 같은 id로 기록합니다.',
    '결론만 남으면 어떤 시점의 어떤 입력과 버전으로 만들어졌는지 재현할 수 없습니다.',
    ['Execution Trace', 'Evaluation Ledger', 'Replay World', 'Snapshot'], 'current', 'Decision Trace',
  ),
  joovis(
    'Runtime Authority', '런타임 어쏘리티',
    '특정 기능이 지금 실제 상태에 영향을 주는 행동을 해도 된다는 권한',
    '도구를 소유한 것과 지금 사용 열쇠를 받은 것을 구분하는 현재 권한입니다.',
    '기능이 준비됐는지, 진입 심사를 통과했는지, 공급자 상태와 관리 정책이 허용하는지 대조해 잠시 유효한 실행 권한을 정합니다.',
    '행동 직전에 권한 조건을 다시 확인하고 결과 또는 환경 변화 시 권한을 철회합니다.',
    '설정 파일이나 과거 승인만 보고 권한이 있다고 판단하면 현재 경계와 어긋납니다.',
    ['Capability State', 'Admission', 'Capability Unit', 'Non-Actionable Shadow'], 'current', 'Authority Boundary',
  ),
  foundry(
    'Agent Family', '에이전트 패밀리', '같은 역할과 계약을 공유하지만 구현·파라미터가 다른 에이전트 후보 집합',
    '한 직무의 여러 지원자를 같은 시험으로 비교하기 위한 가족 단위입니다.',
    '공통 input/output contract를 고정하고 다른 candidate implementations를 family 아래 버전으로 관리합니다.',
    'family contract를 정한 뒤 candidates를 같은 arena와 evaluation matrix로 비교합니다.',
    '역할이 다른 후보를 한 점수표에서 비교하면 성능 차이가 아니라 문제 정의 차이를 측정합니다.',
    ['Agent Candidate', 'Agent Portfolio', 'Contract Family', 'Bounded Candidate Evaluation Matrix'], 'target', 'Agent Portfolio',
  ),
  foundry(
    'Agent Candidate', '에이전트 캔디데이트', '평가와 검토를 위해 생성된 특정 에이전트 구현 버전',
    '운영 권한이 있는 직원이 아니라 시험을 치르는 하나의 지원자입니다.',
    'code/config/model/prompt refs와 fingerprint를 묶어 재현 가능한 candidate artifact로 만들고 평가 evidence를 연결합니다.',
    'candidate를 dedup한 뒤 admitted experiment에서 평가하며 결과는 ledger에 남깁니다.',
    'candidate 생성과 promotion을 같은 상태로 보면 미검토 산출물이 mainline 권한을 얻습니다.',
    ['Candidate Artifact', 'Agent Family', 'Evaluation Ledger', 'Prepared Not Submitted'], 'current', 'Candidate Lifecycle',
  ),
  foundry(
    'Agent Portfolio', '에이전트 포트폴리오', '역할·강점·적용 조건이 다른 agent families의 조합',
    '평균 점수 1등 하나 대신 상황별 전문팀을 구성하는 개념입니다.',
    'family별 competence surface, 상관, 비용과 abstention 조건을 조합해 regime에 맞는 팀을 구성합니다.',
    '후보별 조건부 성능을 평가하고 중복과 공백을 확인한 뒤 selector와 router 정책을 설계합니다.',
    '유사 후보만 모으면 같은 상황에서 함께 실패하는 집중 위험이 생깁니다.',
    ['Agent Family', 'Competence Selector', 'Meta Router', 'Abstention'], 'target', 'Agent Portfolio', 'working',
  ),
  foundry(
    'Eligibility Gate', '엘리저빌리티 게이트', '후보가 비교나 선택 대상이 될 최소 조건을 만족하는지 판정하는 문',
    '점수 경쟁 전에 계약과 안전 요건부터 확인하는 입구 심사입니다.',
    'contract compatibility, evidence completeness, data sufficiency와 policy를 평가해 eligible set만 만듭니다.',
    'hard constraints를 먼저 검사하고 탈락 이유를 기록한 뒤 통과 후보만 selector로 넘깁니다.',
    '부적격 후보까지 점수 비교하면 높은 성능 하나가 안전·계약 위반을 가립니다.',
    ['Admission', 'Competence Selector', 'Data Sufficiency Agent', 'Compatibility Test'], 'target', 'Selection',
  ),
  foundry(
    'Competence Selector', '컴피턴스 셀렉터', '현재 조건에서 적합한 eligible candidate 또는 abstention을 고르는 구성요소',
    '전체 평균 1등이 아니라 지금 문제에 맞는 담당자를 배정하는 선택기입니다.',
    'regime binding, conditional evaluation, 비용, confidence와 정책 제약을 결합해 적합도를 계산합니다.',
    'eligible set과 현재 context를 비교하고 선택 근거 또는 abstention을 남깁니다.',
    '전체 평균만 보면 특정 regime에서 반복 실패하는 후보를 선택할 수 있습니다.',
    ['Eligibility Gate', 'Agent Portfolio', 'Meta Router', 'Abstention'], 'target', 'Selection',
  ),
  foundry(
    'Meta Router', '메타 라우터', '문제·상태·정책에 따라 agent family나 처리 경로를 선택하는 상위 라우터',
    '직접 문제를 풀기보다 어느 전문가와 절차로 보낼지 정하는 안내 데스크입니다.',
    'context classification, eligibility, competence와 resource policy를 결합해 route를 결정합니다.',
    '입력을 분류하고 가능한 families를 좁힌 뒤 selector 결과와 fallback 경로를 기록합니다.',
    'router 자체가 숨은 판단을 많이 하면 agent 성능보다 라우팅 오류가 결과를 지배합니다.',
    ['Competence Selector', 'Agent Portfolio', 'Model Routing', 'Abstention'], 'target', 'Selection', 'working',
  ),
  foundry(
    'Six-Plane', '식스 플레인', '파운드리의 여러 책임을 여섯 계층으로 나누고 계층마다 담당 주체를 정하는 구조',
    '복잡한 공장을 역할이 다른 여섯 층으로 나눠 문제 위치를 찾는 지도입니다.',
    '후보를 만드는 곳, 평가하는 곳, 근거를 보관하는 곳 등 책임별로 기준 상태를 관리할 주체와 지켜야 할 계약을 정합니다.',
    '새 기능을 만들 때 상태를 기록할 주체와 최종 결정을 내릴 주체를 지정한 뒤, 계층 사이에서 넘길 자료와 검증 조건을 계약으로 정합니다.',
    '계층 이름만 폴더에 붙여 두면 누가 상태를 바꿀 수 있고 누가 검증할지 여전히 알기 어렵습니다.',
    ['Three-Loop', 'Contract Family', 'Canonical Authority Owner', 'Membrane'], 'target', 'Plane Architecture',
  ),
  foundry(
    'Three-Loop', '쓰리 루프', 'Foundry 반복 흐름을 세 개의 큰 순환으로 묶어 보는 구조 모델',
    '여러 단계를 직선 목록이 아니라 서로 다른 속도로 도는 세 순환 벨트로 보는 방식입니다.',
    'runtime 관측, offline evolution, governance/integration처럼 cadence와 권한이 다른 반복을 분리합니다.',
    '각 event가 어느 loop에서 생성되고 어느 membrane을 통해 다음 loop로 넘어가는지 추적합니다.',
    '모든 단계를 하나의 무한 agent loop로 보면 중단 조건과 승인 책임이 사라집니다.',
    ['Six-Plane', 'Offline Evolution Loop', 'Carrier Graph', 'Stop Policy'], 'target', 'Loop Architecture',
  ),
  foundry(
    'Contract Family', '컨트랙트 패밀리', '같은 경계에서 함께 진화해야 하는 관련 계약들의 묶음',
    '서로 맞물리는 입구·출구·상태 표를 한 세트로 관리하는 것입니다.',
    'request, result, status, evidence refs와 errors를 공동 버전으로 묶습니다.',
    'membrane별 contract family를 정의하고 producer와 consumer compatibility tests를 함께 실행합니다.',
    '필드 하나만 독립 변경하면 문법은 통과해도 의미가 어긋나는 semantic drift가 생깁니다.',
    ['Contract Manifest', 'Membrane', 'Compatibility Test', 'Schema'], 'target', 'Contract Architecture',
  ),
  foundry(
    'Membrane', '멤브레인', 'plane 또는 loop 사이에서 통과 조건과 변환을 소유하는 얇은 경계',
    '벽처럼 완전히 막지 않고 검증된 것만 골라 통과시키는 세포막입니다.',
    '입력 contract, validation, normalization, authority와 output refs를 한 경계에 묶습니다.',
    'producer output을 검증·변환하고 accepted artifact ref만 다음 owner에게 전달합니다.',
    '경계가 비즈니스 로직까지 소유하면 양쪽 plane 책임을 흡수해 병목이 됩니다.',
    ['Contract Family', 'Carrier Graph', 'Adapter', 'Admission'], 'target', 'Contract Architecture',
  ),
  foundry(
    'Carrier Graph', '캐리어 그래프', '상태·artifact·evidence가 plane과 loop 사이를 이동하는 공식 전달 경로 지도',
    '정보가 어느 컨베이어 벨트를 타고 누구에게 전달되는지 보여주는 물류 지도입니다.',
    '노드는 canonical owners와 membranes이고 edge는 versioned carrier contracts와 refs입니다.',
    'candidate 생성부터 integration return까지 모든 carrier와 상태 전이를 그래프로 추적합니다.',
    '숨은 직접 호출이나 공유 파일 경로가 생기면 graph 밖의 shadow integration이 됩니다.',
    ['Membrane', 'Canonical Authority Owner', 'Integration Return', 'Handoff'], 'target', 'Coordination', 'working',
  ),
  foundry(
    'Canonical Authority Owner', '커노니컬 어쏘리티 오너', '특정 상태나 결정의 최종 기록과 변경 권한을 가진 단일 소유자',
    '여러 복사본 중 어느 장부가 최종이고 누가 수정할 수 있는지 정한 책임자입니다.',
    '각 state type에 한 owner만 write 권한을 주고 나머지는 refs 또는 projection으로 소비하게 합니다.',
    '계약 설계 때 owner, allowed transitions, readers와 handoff를 명시하고 중복 writer를 제거합니다.',
    '두 구성요소가 같은 상태를 최종이라고 쓰면 충돌 해결 규칙이 숨은 authority가 됩니다.',
    ['Source of Truth', 'Contract Family', 'Runtime Authority', 'State Ledger'], 'target', 'Governance',
  ),
  foundry(
    'Offline Evolution Loop', '오프라인 에볼루션 루프', '운영에서 분리된 환경에서 후보를 만들고 평가·반환하는 진화 순환',
    '운영 기계를 직접 개조하지 않고 시험 공장에서 다음 부품을 제작하는 루프입니다.',
    'arena packet, experiment spec, bounded worker, evaluation ledger와 integration return을 연결하되 자동 promotion은 차단합니다.',
    '실험을 admission하고 예약·실행·평가한 뒤 refs-only evidence와 prepared return을 남깁니다.',
    '루프 완료를 mainline 배포 완료로 해석하면 Foundry와 운영 authority 경계를 넘습니다.',
    ['Experiment Design Admission', 'Evaluation Ledger', 'Integration Return', 'Prepared Not Submitted'], 'current', 'Loop Architecture',
  ),
  foundry(
    'Bounded Candidate Evaluation Matrix', '바운디드 캔디데이트 이밸류에이션 매트릭스', '정해진 후보·데이터·지표·자원 안에서 비교를 고정하는 평가 행렬',
    '지원자마다 다른 시험을 치르지 않도록 시험지와 채점표 범위를 잠근 표입니다.',
    'candidate rows와 arena/metric columns를 고정하고 각 cell의 run/evidence refs를 ledger로 연결합니다.',
    'matrix를 materialize한 뒤 missing, duplicate와 incompatible cells를 검사하고 bounded queue로 dispatch합니다.',
    '실행 중 후보나 지표를 추가하면 비교 집합이 움직여 결과를 공정하게 해석할 수 없습니다.',
    ['Agent Candidate', 'Dataset/Arena Packet', 'Evaluation Ledger', 'Bounded Workload'], 'current', 'Evaluation',
  ),
  foundry(
    'Experiment Spec', '익스페리먼트 스펙', '실험 목적·후보·데이터·지표·자원·중단 조건을 고정한 실행 명세',
    '실험 전에 무엇을 어떻게 비교할지 봉인한 시험 계획서입니다.',
    '아이디어를 deterministic fields와 refs로 바꿔 admission, dedup, dispatch와 replay의 기준으로 씁니다.',
    '가설과 candidate/arena/metric refs, limits, stop policy를 채운 뒤 admission을 요청합니다.',
    '실행 후 지표나 데이터 범위를 바꾸면 결과에 맞춘 사후 설계가 됩니다.',
    ['Experiment Design Admission', 'Material Fingerprint', 'Stop Policy', 'Dataset/Arena Packet'], 'current', 'Experiment Control',
  ),
  foundry(
    'Experiment Design Admission', '익스페리먼트 디자인 어드미션', '실험 설계가 실행 큐에 들어갈 최소 요건을 만족하는지 판정하는 절차',
    '아이디어보다 시험이 해석 가능하고 안전한지 먼저 보는 승인 문입니다.',
    'spec completeness, boundedness, fingerprint, resource policy, leakage와 compatibility를 검사합니다.',
    'spec을 검증하고 accepted, held, rejected outcome과 reasons를 append-only evidence로 기록합니다.',
    '실행 성공을 admission 성공으로 대체하면 잘못 설계된 실험이 계산과 판단을 오염시킵니다.',
    ['Experiment Spec', 'Admission', 'Compute Resource Policy', 'Leakage Check'], 'current', 'Experiment Control',
  ),
  foundry(
    'Material Fingerprint', '머티리얼 핑거프린트', '실험 의미를 바꾸는 입력과 설정으로 계산한 내용 기반 식별자',
    '이름이 달라도 재료와 조리법이 같으면 같은 실험임을 알아보는 지문입니다.',
    'candidate, arena, metric과 material config를 canonicalize한 뒤 hash해 dedup identity로 사용합니다.',
    '비물질적 실행 메타데이터를 제외해 fingerprint를 계산한 뒤 reservation 전에 조회합니다.',
    'timestamp나 run id를 포함하면 같은 실험도 매번 다른 fingerprint가 되어 중복 방지가 무력화됩니다.',
    ['Dedup Identity', 'File Hash', 'Normalization', 'Artifact'], 'current', 'Experiment Identity',
  ),
  foundry(
    'Evaluation Ledger', '이밸류에이션 레저', '후보 평가 요청·상태·결과·근거 참조를 append-only로 기록하는 원장',
    '점수뿐 아니라 누가 어떤 시험을 언제 어떻게 치렀는지 남기는 공식 장부입니다.',
    'experiment, run, candidate, arena, metrics와 evidence refs를 불변 event로 연결합니다.',
    'admission부터 terminal outcome까지 transition을 append하고 수정 대신 새 정정 event를 추가합니다.',
    '평가 행을 덮어쓰면 실패·재시도·검토 전후의 이력을 감사할 수 없습니다.',
    ['Refs-Only Evidence', 'Candidate Artifact', 'Immutable Log', 'Provenance Trace'], 'current', 'Evidence',
  ),
  foundry(
    'Dataset/Arena Packet', '데이터셋 아레나 패킷', '평가 데이터·분할·schema·provenance·leakage 결과를 묶은 이식 가능한 패킷',
    '데이터 파일뿐 아니라 시험장 규칙과 봉인 정보까지 함께 든 이동 상자입니다.',
    'data refs, splits, as-of policy, feature/label contracts, fingerprints와 validation reports를 묶습니다.',
    'packet을 materialize하고 leakage와 schema를 검증한 뒤 evaluation matrix가 immutable ref로 사용합니다.',
    'CSV 하나만 넘기면 split, 시간 경계와 전처리 규칙이 실행자마다 달라집니다.',
    ['Data Block Recipe', 'Leakage Check', 'Bounded Candidate Evaluation Matrix', 'Point-in-Time Data'], 'current', 'Data Contract',
  ),
  foundry(
    'Integration Return', '인티그레이션 리턴', 'Foundry가 mainline 검토를 위해 candidate와 evidence refs를 계약으로 반환하는 산출물',
    '자동 설치가 아니라 심사할 부품과 시험 성적표를 접수창구에 돌려주는 패킷입니다.',
    'candidate artifact, compatibility result, evaluation refs, limitations와 submission state를 typed packet으로 묶습니다.',
    '실험 종료 후 refs-only packet을 만들고 mainline adapter contract 검사를 거쳐 prepared 상태로 둡니다.',
    'return 생성 자체를 merge나 promotion으로 해석하면 Foundry가 mainline authority를 침범합니다.',
    ['Mainline Adapter Contract', 'Compatibility Test', 'Prepared Not Submitted', 'Refs-Only Evidence'], 'current', 'Integration Boundary',
  ),
  foundry(
    'Mainline Adapter Contract', '메인라인 어댑터 컨트랙트', 'Foundry 산출물을 mainline이 이해할 검토 입력으로 번역하는 경계 계약',
    '연구실 부품을 운영 공장에 바로 꽂지 않고 공식 접수 규격으로 바꾸는 문서입니다.',
    '허용 artifact types, refs, versions, compatibility evidence와 금지된 authority를 명시합니다.',
    'integration packet을 schema 검증하고 compatibility test를 실행한 뒤 main approval 입력만 생성합니다.',
    '공유 폴더에 파일을 놓는 것으로 통합하면 계약·검토·권한 상태가 생략됩니다.',
    ['Integration Return', 'Compatibility Test', 'Adapter', 'Contract Family'], 'current', 'Integration Boundary',
  ),
  foundry(
    'Compatibility Test', '컴패터빌리티 테스트', '후보 산출물이 mainline의 현재 계약과 경계를 만족하는지 확인하는 검사',
    '부품 성능이 좋아도 현재 기계 규격과 안전장치에 맞는지 따로 보는 시험입니다.',
    'schema, interface, version, invariants, forbidden effects와 representative fixtures를 자동 검증합니다.',
    'adapter contract의 acceptance criteria를 실행하고 결과 refs와 실패 위치를 packet에 붙입니다.',
    'unit metric이 좋다는 이유로 compatibility를 생략하면 mainline에서 구조적 회귀가 생깁니다.',
    ['Mainline Adapter Contract', 'Contract', 'Regression', 'Acceptance Criteria'], 'current', 'Integration Boundary',
  ),
  foundry(
    'Prepared Not Submitted', '프리페어드 낫 서브미티드', '통합 패킷은 준비됐지만 mainline 승인 절차에는 아직 제출되지 않은 상태',
    '서류 봉투는 완성됐지만 접수 버튼을 누르지 않은 상태입니다.',
    'artifact completeness와 compatibility readiness를 submission action 및 approval authority와 별도 상태로 관리합니다.',
    'packet을 검증해 prepared로 기록하고 명시적 사람 또는 mainline 주체만 submitted 전이를 수행합니다.',
    'prepared를 approved나 deployed로 읽으면 문서상 상태가 실제 권한보다 앞서갑니다.',
    ['Integration Return', 'Admission', 'Mainline Adapter Contract', 'Handoff'], 'current', 'Integration Boundary',
  ),
  foundry(
    'Promotion Pipeline', '프로모션 파이프라인', '검증된 candidate가 단계별 심사와 승인을 거쳐 더 높은 권한 상태로 이동하는 목표 흐름',
    '시험 합격이 곧 취업이 아니라 여러 검문소를 거쳐 권한이 커지는 승격 통로입니다.',
    'evaluation, compatibility, risk, holdout와 human approval gates를 통과할 때만 state를 전이합니다.',
    '각 gate의 evidence contract와 rollback 조건을 정의하고 자동 생성과 최종 authority grant를 분리합니다.',
    '목표 pipeline을 현재 자동 promotion 기능으로 오해하면 현행 Foundry 경계를 과장합니다.',
    ['Prepared Not Submitted', 'Evaluation Ledger', 'Review Gate', 'Runtime Authority'], 'target', 'Governance', 'working',
  ),
  joovis(
    'Admission', '어드미션', '후보·데이터·기능이 다음 권한 단계로 들어가도 되는지 판정하는 관문',
    '준비됐다는 자기 주장과 실제 입장 허가를 분리하는 검문소입니다.',
    '정해진 evidence, readiness, policy와 compatibility 조건을 모두 만족할 때만 상태 전이를 허용합니다.',
    '요구 계약을 선언하고 evidence refs를 검사해 accepted, rejected, held 상태와 이유를 기록합니다.',
    'artifact 존재 자체를 admission으로 보면 미검토 결과가 운영 권한을 얻습니다.',
    ['Eligibility Gate', 'Runtime Authority', 'Prepared Not Submitted', 'Review Gate'], 'current', 'Authority Boundary',
  ),
  joovis(
    'Agent Perception', '에이전트 퍼셉션', 'Canonical World State 중 특정 에이전트가 현재 볼 수 있는 관측 표면',
    '전체 지도에서 그 에이전트에게 허용된 창문으로 보이는 부분입니다.',
    '권한, 시간, 역할과 필요한 feature에 따라 world state를 필터링해 perception snapshot을 만듭니다.',
    '세계 상태를 읽고 visibility와 sufficiency 규칙을 적용해 agent의 판단 입력으로 전달합니다.',
    'perception과 world state를 같다고 보면 제한된 관측을 전체 현실로 오해합니다.',
    ['Canonical World State', 'Consumer Sufficiency', 'Snapshot', 'Knowledge Boundary'], 'target', 'Agent State', 'working',
  ),
  joovis(
    'Shadow World', '섀도 월드', '현재 입력을 읽고 판단하되 현실 행동에는 영향을 주지 않는 병행 세계',
    '실제 경기 옆에서 같은 상황을 따라가지만 점수판에는 손대지 않는 연습 코트입니다.',
    'live observation을 복제해 candidate decisions를 만들지만 dispatch 권한을 끊고 비교 evidence만 남깁니다.',
    '동일 입력을 주되 non-influencing guard를 적용하고 결과를 기존 decision과 사후 비교합니다.',
    'shadow 출력이 자동 행동이나 운영 입력을 바꾸면 기술적 이름과 달리 영향 경로가 열린 것입니다.',
    ['Replay World', 'Non-Actionable Shadow', 'Non-Influencing Shadow', 'Runtime Authority'], 'target', 'World Mode',
  ),
  joovis(
    'Source Health', '소스 헬스', '원천이 현재 신뢰할 수 있게 도달·갱신·해석되고 있는지 나타내는 상태',
    '값 하나보다 그 값을 보내는 수도관이 지금 정상인지 보는 계기판입니다.',
    '연결 성공, schema, freshness, cadence, continuity와 오류를 조합해 source별 health를 계산합니다.',
    '수집마다 관측 상태를 기록하고 health가 나빠지면 sufficiency와 authority를 보수적으로 낮춥니다.',
    '마지막 성공값만 계속 제공하면 끊어진 source를 최신 정보처럼 사용할 수 있습니다.',
    ['Source Cadence', 'Provider Continuity', 'World Readiness', 'Degraded Mode'], 'current', 'Source Health',
  ),
  joovis(
    'Non-Actionable Shadow', '논 액셔너블 섀도', '실제 행동으로 이어질 수 없도록 권한 경로가 구조적으로 끊긴 shadow 상태',
    '보기와 기록은 가능하지만 실행 문에는 열쇠가 없는 관찰 모드입니다.',
    'candidate output은 만들 수 있어도 dispatch port, runtime authority와 live adapter를 연결하지 않습니다.',
    '관측·비교 artifact만 허용하고 action 요청은 fail closed 처리해 영향 경로가 없는지 검증합니다.',
    'UI에 shadow라고 써도 자동 전달이나 운영 입력 변경 경로가 남아 있으면 실제로는 actionable합니다.',
    ['Shadow World', 'Non-Influencing Shadow', 'Runtime Authority', 'Fail-closed'], 'current', 'Execution Boundary',
  ),
  foundry(
    'Abstention', '앱스텐션', '근거·능력·권한이 부족할 때 답이나 행동을 의도적으로 내지 않는 선택',
    '모르는데 찍는 대신 지금은 판단하지 않겠다고 정식으로 선택하는 기능입니다.',
    'confidence, data sufficiency, eligibility와 policy thresholds가 기준을 못 넘으면 no-action 상태를 냅니다.',
    '선택기 출력에 abstain reason, missing evidence와 재평가 조건을 포함합니다.',
    'abstention을 오류로 취급하면 시스템이 불확실한 상황에서도 아무 후보나 고르게 됩니다.',
    ['Data Sufficiency Agent', 'Competence Selector', 'Fail-closed', 'Confidence'], 'concept', 'Safety',
  ),
  foundry(
    'Data Sufficiency Agent', '데이터 서피션시 에이전트', '현재 데이터가 후보 선택이나 판단에 충분한지 평가하는 전문 agent',
    '답을 내기 전에 재료가 충분한지 검사하는 품질 담당자입니다.',
    'required sources, coverage, freshness와 uncertainty를 contract와 비교해 sufficient, degraded, insufficient를 냅니다.',
    '현재 world binding을 읽고 missing requirements를 구조화해 eligibility와 abstention 경로에 전달합니다.',
    '이 agent의 추정 자체를 canonical source health로 쓰면 관측 상태와 판단 상태가 섞입니다.',
    ['Consumer Sufficiency', 'Eligibility Gate', 'Abstention', 'World Readiness'], 'target', 'Agent Portfolio', 'working',
  ),
  foundry(
    'Dedup Identity', '디덥 아이덴티티', '두 요청이 의미상 같은 작업인지 판정하는 중복 제거 기준',
    '파일 이름이 아니라 실제 내용으로 같은 주문이 두 번 들어왔는지 알아보는 기준입니다.',
    'material fingerprint와 canonical contract fields를 조합해 예약·실행·ledger 단계가 공통으로 조회하는 key를 만듭니다.',
    'dispatch 전에 identity를 조회하고 기존 active run이 있으면 정책에 따라 reuse, join, reject합니다.',
    '각 단계가 다른 dedup key를 쓰면 queue에서는 하나인데 ledger에는 두 개가 생길 수 있습니다.',
    ['Material Fingerprint', 'Idempotency Key', 'Evaluation Ledger', 'Normalization'], 'current', 'Experiment Identity',
  ),
  foundry(
    'Candidate Artifact', '캔디데이트 아티팩트', '후보의 코드·설정·계약·fingerprint를 재현 가능하게 묶은 산출물',
    '후보 이름이 아니라 같은 후보를 다시 조립할 수 있는 봉인된 제출물입니다.',
    'implementation refs, build metadata, dependencies, contract version와 fingerprint를 typed artifact로 저장합니다.',
    'candidate build 후 schema와 hash를 검증해 artifact ref를 발급하고 matrix와 ledger가 그 ref만 사용합니다.',
    '작업 폴더나 latest tag만 가리키면 평가한 후보가 나중에 다른 내용이 될 수 있습니다.',
    ['Agent Candidate', 'Material Fingerprint', 'Artifact', 'Evaluation Ledger'], 'current', 'Candidate Lifecycle',
  ),
  foundry(
    'File Hash', '파일 해시', '파일 내용으로 계산해 동일성과 변경 여부를 확인하는 고정 길이 값',
    '파일 이름이 달라도 내용이 같은지 확인하는 디지털 지문입니다.',
    '동일한 bytes에 결정적 hash 함수를 적용해 artifact의 내용 기반 식별자와 검증 값을 만듭니다.',
    'artifact 저장과 전송 전후에 hash를 계산해 expected value와 비교하고 mismatch를 차단합니다.',
    'hash는 출처의 정당성이나 내용의 진실성이 아니라 bytes 동일성만 보여줍니다.',
    ['Material Fingerprint', 'Artifact', 'Provenance', 'Hash Verification'], 'concept', 'Experiment Identity', 'working',
  ),
  foundry(
    'Leakage Check', '리키지 체크', '평가 시점에 알 수 없던 정보나 정답 단서가 입력에 섞였는지 검사하는 절차',
    '시험 문제 옆에 정답이나 미래 정보가 비쳐 있지 않은지 보는 검사입니다.',
    'feature available time, label construction, split boundaries, duplicate entities와 transform lineage를 비교합니다.',
    'packet admission 전에 자동 검사를 실행하고 의심 항목은 evidence와 함께 hold 또는 manual review로 보냅니다.',
    '랜덤 train/test split만 통과했다고 시간 누출이나 entity 중복이 사라지는 것은 아닙니다.',
    ['Point-in-Time Data', 'Dataset/Arena Packet', 'Look-Ahead Bias', 'Data Quality Gate'], 'current', 'Data Contract',
  ),
  foundry(
    'Refs-Only Evidence', '레프스 온리 에비던스', '내용을 복제하지 않고 canonical artifact 참조만 전달하는 증거 방식',
    '보고서마다 원문을 복사하지 않고 봉인된 원본 보관함 번호만 전달합니다.',
    'integration packet에는 artifact id, hash, schema와 locator만 넣고 실제 evidence는 canonical owner에서 읽습니다.',
    '산출물을 저장해 ref를 발급하고 downstream은 ref validity와 access contract를 확인합니다.',
    '내용을 여러 packet에 복제하면 정정 후 어느 복사본이 진실인지 갈라집니다.',
    ['Evaluation Ledger', 'Integration Return', 'Canonical Authority Owner', 'Provenance Trace'], 'current', 'Evidence',
  ),
  foundry(
    'Compute Resource Policy', '컴퓨트 리소스 폴리시', '실험이 사용할 CPU·메모리·시간·동시성·재시도 한계를 정한 정책',
    '좋은 아이디어라도 공장 전력을 무제한 쓰지 못하게 정한 사용 규칙입니다.',
    'experiment class와 risk에 따라 quota, timeout, concurrency, attempts와 stop limits를 계산합니다.',
    'admission 시 policy를 binding하고 runner가 각 단계에서 budget 소비를 확인합니다.',
    'worker 내부 상수로만 제한하면 여러 worker 합계가 전역 한도를 넘을 수 있습니다.',
    ['Compute Governor', 'Runner Control Port', 'Bounded Workload', 'Stop Policy'], 'current', 'Resource Control',
  ),
  foundry(
    'Bounded Workload', '바운디드 워크로드', '개수·시간·자원·재시도·종료 조건이 명시된 유한 작업 묶음',
    '언젠가 끝날 것이라는 기대가 아니라 끝의 크기와 조건이 숫자로 적힌 작업입니다.',
    'max items, runtime, concurrency, attempts와 stop policy를 계약으로 고정해 worker가 무한 확장하지 못하게 합니다.',
    'admission 시 limits를 계산하고 실행 중 budget을 소비하며 소진 시 terminal reason을 기록합니다.',
    'agent가 스스로 더 탐색하도록 열어 두면 비용과 완료 시점을 예측할 수 없습니다.',
    ['Compute Resource Policy', 'Stop Policy', 'Long-Horizon Task', 'Timeout'], 'current', 'Resource Control',
  ),
  foundry(
    'Stop Policy', '스톱 폴리시', '성공·실패·예산 소진·위험 발생 시 반복을 끝내는 명시적 규칙',
    '잘될 때뿐 아니라 충분하지 않을 때도 언제 손을 떼는지 정한 브레이크입니다.',
    'quality threshold, no-improvement window, max attempts, time, cost와 safety trigger를 우선순위로 평가합니다.',
    '각 iteration 뒤 policy를 검사하고 stop reason과 마지막 valid artifact를 기록합니다.',
    '성공 조건만 있으면 성공하지 못하는 실험은 영원히 반복될 수 있습니다.',
    ['Bounded Workload', 'Compute Resource Policy', 'Stop Condition', 'Timeout'], 'current', 'Resource Control',
  ),
  joovis(
    'Provider Continuity', '프로바이더 컨티뉴이티', '외부 공급자 장애·세션 변화 후에도 상태와 경계를 일관되게 이어가는 능력',
    '연결이 끊겨도 어디까지 했고 무엇이 아직 금지인지 기록으로 복구하는 운영 연속성입니다.',
    'provider 상태를 별도로 추적하고 재연결 후 영속 기록으로 상태를 재구성한 뒤 명시적으로 권한을 다시 엽니다.',
    '장애를 감지하면 authority를 닫고 source health와 invariants를 확인한 후에만 동작을 재개합니다.',
    '연결이 돌아왔다는 이유만으로 이전 권한을 자동 복원하면 stale state에서 동작할 수 있습니다.',
    ['Source Health', 'Runtime Authority', 'Reconciliation', 'Fail-closed'], 'current', 'Runtime Continuity',
  ),
  foundry(
    'Compute Governor', '컴퓨트 거버너', 'Compute Resource Policy를 실제 실행 중 강제하는 조정 구성요소',
    '제한표를 읽기만 하지 않고 속도와 사용량을 실제로 조절하는 차단기입니다.',
    'leases, counters, concurrency slots와 cancellation signals로 여러 workers의 총사용량을 제한합니다.',
    'dispatch 전 permit을 발급하고 소비량을 추적해 한도 초과 시 runner control port로 중단합니다.',
    '관측만 하고 강제하지 않으면 governor가 아니라 dashboard에 불과합니다.',
    ['Compute Resource Policy', 'Runner Control Port', 'Circuit Breaker', 'Telemetry'], 'current', 'Resource Control',
  ),
  foundry(
    'Runner Control Port', '러너 컨트롤 포트', '실행기의 시작·취소·상태·heartbeat를 제어하는 안정된 포트',
    '실행기 내부를 직접 건드리지 않고 같은 스위치 규격으로 제어하는 조작 패널입니다.',
    'governor와 queue가 provider별 runner 차이를 모른 채 dispatch, cancel, inspect를 호출하도록 contract를 고정합니다.',
    '실행 ref와 limits를 전달하고 runner가 typed acknowledgement와 terminal state를 반환하게 합니다.',
    'cancel 요청이 best-effort 문자열이면 중단이 실제로 적용됐는지 검증할 수 없습니다.',
    ['Port', 'Compute Governor', 'Execution Trace', 'Contract'], 'current', 'Resource Control',
  ),
  foundry(
    'Non-Influencing Shadow', '논 인플루언싱 섀도', '실행과 관측은 가능하지만 실제 선택·정책·운영 결과에는 영향을 주지 않는 상태',
    '답안은 만들지만 최종 결정에는 반영되지 않는 비교 전용 참가자입니다.',
    'candidate execution rail은 열되 decision input과 mainline adapter로 가는 carrier를 끊고 evidence만 저장합니다.',
    'shadow 이름뿐 아니라 decision influence와 contract-level guard로 비영향성을 검증합니다.',
    '사람이 shadow 결과를 보고 자동 행동하면 기술적 직접 연결이 없어도 간접 영향이 생깁니다.',
    ['Non-Actionable Shadow', 'Layer Observation', 'Runtime Authority', 'Integration Return'], 'current', 'Observation',
  ),
  foundry(
    'Layer Observation', '레이어 옵저베이션', '특정 계층의 동작을 영향 권한과 분리해 관측한 구조화 기록',
    '건물 전체 결론이 아니라 한 층에서 실제로 무엇이 일어났는지 찍은 센서 기록입니다.',
    'layer id, lifecycle, execution, decision influence와 evidence refs를 하나의 observation으로 묶습니다.',
    '실행 지점에서 관측을 생성하고 cross-layer refs로 묶어 비교하되 authority는 부여하지 않습니다.',
    '로그가 존재한다는 사실을 decision influence로 오해하면 관측 rail이 운영 rail처럼 보입니다.',
    ['Non-Influencing Shadow', 'Execution Trace', 'Observability', 'Runtime Authority'], 'current', 'Observation',
  ),
]

export const internalArchitectureTerms = internalSeeds.map(makeInternalTerm)

function joovis(
  term: string,
  pronunciation: string,
  koreanMeaning: string,
  simpleMeaning: string,
  mechanism: string,
  workflow: string,
  failure: string,
  relatedTerms: string[],
  status: ArchitectureStatus,
  category: string,
  priority: LearningPriority = 'core',
): InternalSeed {
  return { deck: 'joovis-architecture', term, pronunciation, koreanMeaning, simpleMeaning, mechanism, workflow, failure, relatedTerms, status, category, priority }
}

function foundry(
  term: string,
  pronunciation: string,
  koreanMeaning: string,
  simpleMeaning: string,
  mechanism: string,
  workflow: string,
  failure: string,
  relatedTerms: string[],
  status: ArchitectureStatus,
  category: string,
  priority: LearningPriority = 'core',
): InternalSeed {
  return { deck: 'foundry-lab', term, pronunciation, koreanMeaning, simpleMeaning, mechanism, workflow, failure, relatedTerms, status, category, priority }
}

function makeInternalTerm(seed: InternalSeed): RawDevTerm {
  const statusNote = seed.status === 'current'
    ? '읽기 전용으로 확인한 현재 상태 또는 실행 코어 문서에서 현행 경계로 다뤄집니다. 실제 권한은 해당 시점의 capability state를 다시 확인해야 합니다.'
    : seed.status === 'target'
      ? '목표 아키텍처 또는 상위 설계 방향입니다. 문서에 있어도 현재 구현·연결·권한이 완료됐다는 뜻은 아닙니다.'
      : '설계 표준을 이해하기 위한 개념입니다. 실제 채택 여부와 런타임 권한은 별도 근거로 확인해야 합니다.'
  const promptKo = `${seed.term}을 현재와 목표 상태로 나누고 입력 → 상태 변화 → 출력 → 권한 경계 → 실패 처리 순서로 설명해줘.`
  const promptEn = `Explain ${seed.term} by separating current and target state, then trace input, state transition, output, authority boundary, and failure handling.`
  const source = seed.deck === 'foundry-lab'
    ? foundrySource
    : seed.status === 'current'
      ? joovisCurrentSource
      : seed.status === 'target'
        ? joovisWorldSource
        : joovisCapabilitySource

  return {
    id: `internal-${seed.deck}-${slugify(seed.term)}`,
    deck: seed.deck,
    domainLabel: seed.deck === 'foundry-lab' ? 'Foundry Lab' : 'JOOVIS',
    term: seed.term,
    pronunciation: seed.pronunciation,
    koreanMeaning: seed.koreanMeaning,
    simpleMeaning: seed.simpleMeaning,
    category: seed.category,
    difficulty: 'advanced',
    learningPriority: seed.priority,
    selectionReason: `${seed.status === 'current' ? '현행 구조' : seed.status === 'target' ? '목표 구조' : '설계 개념'}를 다른 상태와 혼동하지 않고 문서를 읽기 위해 선별한 용어입니다.`,
    architectureStatus: seed.status,
    statusNote,
    joovisUsage: `${seed.term}이 데이터·후보·평가·증거·권한·통합 구조 중 어디에 놓이는지 구분할 때 사용합니다.`,
    checkQuestion: `${seed.term}의 canonical owner는 누구이며, 어떤 입력이 어떤 상태 전이를 거쳐 무엇을 내보내고 어디에서 권한이 닫히나요?`,
    badExpression: `${seed.term}이 있으니까 이미 다 작동하는 거지?`,
    goodExpression: `${promptKo}\nEN: ${promptEn}`,
    gptPromptExample: promptEn,
    codexPromptExample: promptKo,
    mentalModel: `시스템을 여러 방과 통로로 그렸을 때 ${seed.term}은(는) ${seed.simpleMeaning} 위치, 소유자, 입력과 출력을 함께 그려보세요.`,
    whyItMatters: `${seed.mechanism} 이 경계를 알아야 문서의 선언, 실제 구현과 현재 권한을 서로 다른 사실로 읽을 수 있습니다.`,
    withoutIt: seed.failure,
    realWorkflow: seed.workflow,
    mechanism: seed.mechanism,
    usagePattern: seed.workflow,
    commonPitfall: seed.failure,
    expertNote: statusNote,
    researchBasis: source,
    relatedTerms: seed.relatedTerms,
  }
}

function slugify(term: string) {
  return term.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
