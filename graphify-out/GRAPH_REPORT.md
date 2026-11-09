# Graph Report - gestao-de-gastos  (2026-11-08)

## Corpus Check
- 51 files · ~80,983 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4200 nodes · 8986 edges · 140 communities (103 shown, 35 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 587 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c1952ea`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- index.d.ts
- library.d.ts
- react-native.js
- FinançasPro expense-management application
- wasm-compiler-edge.js
- edge-esm.js
- wasm-engine-edge.js
- Decimal
- Decimal
- runtime/edge.js
- Product Documentation
- library.js
- runtime/index-browser.js
- backend/package.json
- addErrorMessage
- pl
- o
- a
- e
- addErrorMessage
- addErrorMessage
- ia
- r
- constructor
- addErrorMessage
- wo
- ju
- a
- n
- .slice
- r
- transaction
- transaction
- Ne
- i
- e
- slice
- r
- write
- a
- ji
- co
- ml
- write
- write
- r
- toString
- transaction
- fs
- .slice
- t
- ln
- e
- e
- hs
- index-browser.d.ts
- requestInternal
- i
- with
- constructor
- ModelAction
- ja
- InstallmentPlanDelegate
- TransactionDelegate
- UserDelegate
- write
- Prisma__UserClient
- write
- e
- SqlDriverAdapter
- concat
- write
- client/package.json
- handleRequestError
- requestInternal
- t
- require
- import
- no
- Span
- handleRequestError
- from
- K
- exports
- .write
- constructor
- MergedExtensionsList
- Engine
- Ce
- PrismaClient
- NullTypesEnumValue
- RequestHandler
- Dt
- ./runtime/client
- hp
- tn
- PrismaClientKnownRequestError
- PrismaPromise_2
- SpanKind
- Sql
- TracingHelper
- getGlobalTracingHelper
- ./edge
- ./extension
- ./index
- ./react-native
- ./runtime/binary
- ./runtime/edge
- ./runtime/index-browser
- ./runtime/library
- ./runtime/react-native
- ./runtime/wasm-compiler-edge
- ./runtime/wasm-engine-edge
- ./wasm
- $s
- TraceState
- Context
- DataLoader
- MetricsClient
- SpanStatusCode
- TypedSql
- ./query_engine_bg.wasm
- PrismaClientInitializationError
- PrismaClientRustPanicError
- PrismaClientValidationError
- Skip
- AnyNull
- DbNull
- JsonNull
- CallSite
- DecimalJsLike
- ErrorCapturingInterface
- ErrorRegistry
- JsonConvertible
- defineExtension
- dmmf
- type

## God Nodes (most connected - your core abstractions)
1. `Decimal` - 117 edges
2. `Decimal` - 117 edges
3. `n()` - 87 edges
4. `o()` - 78 edges
5. `a()` - 52 edges
6. `a()` - 51 edges
7. `a()` - 50 edges
8. `s()` - 43 edges
9. `e()` - 36 edges
10. `r()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `T()` --indirect_call--> `na()`  [INFERRED]
  backend/src/generated/client/runtime/edge-esm.js → backend/src/generated/client/runtime/library.js
- `ai()` --indirect_call--> `n()`  [INFERRED]
  backend/src/generated/client/runtime/edge-esm.js → backend/src/generated/client/runtime/index-browser.js
- `Aa()` --indirect_call--> `n()`  [INFERRED]
  backend/src/generated/client/runtime/edge-esm.js → backend/src/generated/client/runtime/index-browser.js
- `ka()` --indirect_call--> `n()`  [INFERRED]
  backend/src/generated/client/runtime/edge-esm.js → backend/src/generated/client/runtime/index-browser.js
- `xt()` --indirect_call--> `Wn()`  [INFERRED]
  backend/src/generated/client/runtime/edge-esm.js → backend/src/generated/client/runtime/edge.js

## Import Cycles
- None detected.

## Communities (140 total, 35 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.06
Nodes (49): dependencies, lucide-react, react, react-dom, recharts, devDependencies, tailwindcss, @tailwindcss/vite (+41 more)

### Community 1 - "index.d.ts"
Cohesion: 0.01
Nodes (375): AggregateInstallmentPlan, AggregateTransaction, AggregateUser, At, AtBasic, AtLeast, AtLoose, AtStrict (+367 more)

### Community 2 - "library.d.ts"
Cohesion: 0.01
Nodes (340): AccelerateEngineConfig, AccelerateExtensionFetch, AccelerateExtensionFetchDecorator, AccelerateUtils, Action, ActiveConnectorType, Aggregate, AllModelsToStringIndex (+332 more)

### Community 3 - "react-native.js"
Cohesion: 0.02
Nodes (60): An(), ap(), bo(), bs(), commitTransaction(), cp(), disconnect(), ep() (+52 more)

### Community 4 - "FinançasPro expense-management application"
Cohesion: 0.12
Nodes (18): Local browser storage, Deleting a payment transaction, Ending installment monitoring, Expense transaction history, FinançasPro expense-management application, Installment progress and remaining due dates, Installment terms and entry fields, Installment and financing tracking (+10 more)

### Community 5 - "wasm-compiler-edge.js"
Cohesion: 0.02
Nodes (72): ac(), Ad(), Af(), Ai(), am(), apiKey(), Bd(), bi() (+64 more)

### Community 6 - "edge-esm.js"
Cohesion: 0.03
Nodes (69): ap(), At(), bc(), bo(), Bt(), _c(), cs(), dc() (+61 more)

### Community 7 - "wasm-engine-edge.js"
Cohesion: 0.03
Nodes (65): as(), L(), Bo(), cn(), constructor(), ct(), Cu(), deref() (+57 more)

### Community 10 - "runtime/edge.js"
Cohesion: 0.02
Nodes (56): addItem(), ao(), as(), bn(), bs(), bu(), Ci(), cs() (+48 more)

### Community 12 - "library.js"
Cohesion: 0.03
Nodes (60): Bc(), bi(), Bm(), Bu(), Cm(), Co(), dm(), Ei() (+52 more)

### Community 13 - "runtime/index-browser.js"
Cohesion: 0.06
Nodes (40): {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
}, Prisma, PrismaClient, b(), be(), bn(), ce(), constructor() (+32 more)

### Community 14 - "backend/package.json"
Cohesion: 0.05
Nodes (44): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, nodemailer, prisma (+36 more)

### Community 15 - "addErrorMessage"
Cohesion: 0.12
Nodes (53): ac(), addErrorMessage(), addSuggestion(), asObject(), bc(), _c(), cc(), dc() (+45 more)

### Community 16 - "pl"
Cohesion: 0.12
Nodes (52): addErrorMessage(), addField(), addItem(), addSuggestion(), al(), asObject(), bl(), cl() (+44 more)

### Community 17 - "o"
Cohesion: 0.08
Nodes (51): dp(), nf(), _a(), Au(), #c(), cf(), cn(), constructor() (+43 more)

### Community 18 - "a"
Cohesion: 0.07
Nodes (23): a(), ar(), bi(), Ca(), di(), Ei(), fromContent(), gl() (+15 more)

### Community 19 - "e"
Cohesion: 0.06
Nodes (49): yn(), Wa(), Af(), append(), bn(), Ci(), e(), ed() (+41 more)

### Community 20 - "addErrorMessage"
Cohesion: 0.13
Nodes (46): addErrorMessage(), addField(), addSuggestion(), ap(), asObject(), at(), Do(), ec() (+38 more)

### Community 21 - "addErrorMessage"
Cohesion: 0.13
Nodes (46): addErrorMessage(), addField(), addSuggestion(), ap(), ar(), asObject(), bp(), Cp() (+38 more)

### Community 22 - "ia"
Cohesion: 0.08
Nodes (45): ou(), addItem(), At(), Bl(), bs(), bt(), concat(), Df() (+37 more)

### Community 23 - "r"
Cohesion: 0.06
Nodes (44): ai(), Ba(), be(), Do(), _e(), enabled(), fo(), i() (+36 more)

### Community 24 - "constructor"
Cohesion: 0.06
Nodes (45): applyPendingMigrations(), buildQueryError(), connect(), constructor(), consumeError(), deref(), dispatchBatches(), dispatchEngineSpans() (+37 more)

### Community 25 - "addErrorMessage"
Cohesion: 0.14
Nodes (44): ad(), addErrorMessage(), addField(), addItem(), addSuggestion(), asObject(), bd(), cd() (+36 more)

### Community 26 - "wo"
Cohesion: 0.09
Nodes (42): bc(), be(), bo(), dc(), Ep(), Er(), fc(), findField() (+34 more)

### Community 27 - "ju"
Cohesion: 0.13
Nodes (43): addErrorMessage(), addField(), addSuggestion(), l(), asObject(), bu(), Do(), fu() (+35 more)

### Community 28 - "a"
Cohesion: 0.07
Nodes (14): a(), Ai(), es(), Ga(), l(), Le(), re(), Ri() (+6 more)

### Community 29 - "n"
Cohesion: 0.10
Nodes (41): ac(), au(), be(), bn(), cc(), findField(), Ft(), getArgumentName() (+33 more)

### Community 30 - ".slice"
Cohesion: 0.07
Nodes (38): ai(), cn(), d(), Da(), enabled(), Er(), eu(), Fl() (+30 more)

### Community 31 - "r"
Cohesion: 0.06
Nodes (42): Zc(), Cn(), ap(), ba(), bl(), Bo(), cp(), el() (+34 more)

### Community 32 - "transaction"
Cohesion: 0.08
Nodes (42): Aa(), bf(), buildQueryError(), consumeError(), convertProtocolErrorsToClientError(), df(), dispatchBatches(), dr() (+34 more)

### Community 33 - "transaction"
Cohesion: 0.07
Nodes (42): bc(), bf(), commitTransaction(), convertProtocolErrorsToClientError(), ct(), Fo(), getURLAndAPIKey(), gf() (+34 more)

### Community 34 - "Ne"
Cohesion: 0.08
Nodes (34): An(), _e(), un(), ae(), br(), co(), Ct(), en() (+26 more)

### Community 35 - "i"
Cohesion: 0.10
Nodes (38): Ea(), em(), eo(), Et(), F(), findField(), ga(), getArgumentName() (+30 more)

### Community 36 - "e"
Cohesion: 0.08
Nodes (37): $l(), an(), at(), au(), Bi(), e(), el(), getAllClientExtensions() (+29 more)

### Community 37 - "slice"
Cohesion: 0.09
Nodes (35): Ae(), alloc(), allocUnsafeSlow(), Bo(), br(), byteLength(), Cm(), construct() (+27 more)

### Community 38 - "r"
Cohesion: 0.09
Nodes (31): bi(), cc(), cn(), Da(), de(), ea(), Ei(), fn() (+23 more)

### Community 39 - "write"
Cohesion: 0.10
Nodes (34): ze(), aa(), addMarginSymbol(), afterNextNewline(), copy(), enabled(), eo(), equals() (+26 more)

### Community 40 - "a"
Cohesion: 0.10
Nodes (7): a(), bi(), Ei(), Le(), re(), W(), xi()

### Community 41 - "ji"
Cohesion: 0.08
Nodes (32): zl(), Sa(), aa(), Ca(), dm(), et(), fm(), getAllClientExtensions() (+24 more)

### Community 42 - "co"
Cohesion: 0.10
Nodes (32): br(), Ce(), co(), ds(), fs(), ft(), getArgumentName(), getArgumentPath() (+24 more)

### Community 43 - "ml"
Cohesion: 0.08
Nodes (30): an(), ca(), cl(), fl(), get(), getCurrentBinaryTarget(), getURLAndAPIKey(), Gt() (+22 more)

### Community 44 - "write"
Cohesion: 0.14
Nodes (30): addMarginSymbol(), afterNextNewline(), compare(), copy(), de(), ee(), getCurrentLineLength(), getPrintWidth() (+22 more)

### Community 45 - "write"
Cohesion: 0.12
Nodes (28): addMarginSymbol(), afterNextNewline(), Fr(), getCurrentLineLength(), getPrintWidth(), indent(), indentedCurrentLine(), io() (+20 more)

### Community 46 - "r"
Cohesion: 0.09
Nodes (29): Aa(), constructor(), dispatchBatches(), dispatchEngineSpans(), En(), fo(), getActiveContext(), getGlobalTracingHelper() (+21 more)

### Community 47 - "toString"
Cohesion: 0.12
Nodes (28): addField(), addItem(), bn(), dr(), es(), getAllBatchQueryCallbacks(), getArgumentName(), getArgumentPath() (+20 more)

### Community 48 - "transaction"
Cohesion: 0.12
Nodes (29): wu(), Be(), buildQueryError(), consumeError(), convertProtocolErrorsToClientError(), dispatchBatches(), dt(), Du() (+21 more)

### Community 49 - "fs"
Cohesion: 0.09
Nodes (27): Ip(), Op(), as(), bp(), ds(), fs(), ge(), getAllClientExtensions() (+19 more)

### Community 50 - ".slice"
Cohesion: 0.11
Nodes (25): br(), co(), di(), enabled(), h(), I(), j(), ja() (+17 more)

### Community 51 - "t"
Cohesion: 0.10
Nodes (27): ba(), Ci(), dispatchEngineSpans(), getActiveContext(), getConnectionInfo(), getGlobalTracingHelper(), getTraceParent(), Gi() (+19 more)

### Community 52 - "ln"
Cohesion: 0.11
Nodes (22): an(), ar(), ba(), Ca(), de(), di(), Ea(), Et() (+14 more)

### Community 53 - "e"
Cohesion: 0.11
Nodes (26): allocUnsafe(), append(), Cd(), connect(), destroy(), digest(), digestInto(), e() (+18 more)

### Community 54 - "e"
Cohesion: 0.10
Nodes (23): config, Prisma, PrismaClient, {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
}, al(), append(), cu(), e() (+15 more)

### Community 55 - "hs"
Cohesion: 0.11
Nodes (21): $c(), d(), Ee(), g(), getAllClientExtensions(), getAllModelExtensions(), gl(), gs() (+13 more)

### Community 56 - "index-browser.d.ts"
Cohesion: 0.10
Nodes (18): AnyNull, Args, Config, Constructor, DbNull, Exact, GetRuntimeOutput, Instance (+10 more)

### Community 57 - "requestInternal"
Cohesion: 0.14
Nodes (22): convertProtocolErrorsToClientError(), cp(), handleError(), Hr(), ip(), je(), json(), metrics() (+14 more)

### Community 58 - "i"
Cohesion: 0.18
Nodes (22): A(), C(), Ae(), Ai(), da(), Et(), hu(), ii() (+14 more)

### Community 59 - "with"
Cohesion: 0.16
Nodes (21): ai(), ec(), hr(), ic(), Jo(), Jt(), nc(), oc() (+13 more)

### Community 60 - "constructor"
Cohesion: 0.12
Nodes (21): ar(), constructor(), dispatchEngineSpans(), getActiveContext(), getAllBatchQueryCallbacks(), getGlobalTracingHelper(), _getNamespace(), getTraceParent() (+13 more)

### Community 61 - "ModelAction"
Cohesion: 0.10
Nodes (20): ModelAction, aggregate, aggregateRaw, count, create, createMany, createManyAndReturn, delete (+12 more)

### Community 62 - "ja"
Cohesion: 0.16
Nodes (19): am(), Fr(), getAllClientExtensions(), getAllComputedFields(), getAllModelExtensions(), he(), ja(), Lm() (+11 more)

### Community 66 - "write"
Cohesion: 0.23
Nodes (18): Cr(), addMarginSymbol(), afterNextNewline(), getCurrentLineLength(), getPrintWidth(), indent(), indentedCurrentLine(), newLine() (+10 more)

### Community 67 - "Prisma__UserClient"
Cohesion: 0.12
Nodes (4): Prisma__InstallmentPlanClient, Prisma__TransactionClient, Prisma__UserClient, PrismaPromise

### Community 68 - "write"
Cohesion: 0.24
Nodes (17): addMarginSymbol(), afterNextNewline(), getCurrentLineLength(), getPrintWidth(), indent(), lu(), newLine(), setColor() (+9 more)

### Community 69 - "e"
Cohesion: 0.15
Nodes (17): append(), e(), empty(), Fa(), getAllBatchQueryCallbacks(), He(), ht(), ll() (+9 more)

### Community 70 - "SqlDriverAdapter"
Cohesion: 0.12
Nodes (7): AdapterInfo, DriverAdapterFactory, Queryable, SqlDriverAdapter, SqlDriverAdapterFactory, SqlQueryable, $transaction()

### Community 71 - "concat"
Cohesion: 0.15
Nodes (16): Vl(), ao(), concat(), getAllModelExtensions(), getAllQueryCallbacks(), isEmpty(), Lo(), Ne() (+8 more)

### Community 72 - "write"
Cohesion: 0.26
Nodes (16): addMarginSymbol(), afterNextNewline(), getCurrentLineLength(), getPrintWidth(), indent(), newLine(), setColor(), underline() (+8 more)

### Community 73 - "client/package.json"
Cohesion: 0.13
Nodes (14): browser, imports, #main-entry-point, #wasm-engine-loader, main, default, name, sideEffects (+6 more)

### Community 74 - "handleRequestError"
Cohesion: 0.14
Nodes (15): bp(), dispatchBatches(), handleAndLogRequestError(), handleRequestError(), is(), Lr(), renderAllMessages(), request() (+7 more)

### Community 75 - "requestInternal"
Cohesion: 0.22
Nodes (15): convertProtocolErrorsToClientError(), ep(), handleError(), je(), json(), metrics(), prometheus(), propagateResponseExtensions() (+7 more)

### Community 76 - "t"
Cohesion: 0.17
Nodes (11): append(), empty(), jo(), pa(), qo(), single(), t(), config (+3 more)

### Community 77 - "require"
Cohesion: 0.26
Nodes (12): default, require, ./client, require, browser, default, edge-light, node (+4 more)

### Community 78 - "import"
Cohesion: 0.26
Nodes (12): import, ./sql, browser, default, edge-light, node, types, worker (+4 more)

### Community 79 - "no"
Cohesion: 0.20
Nodes (12): addItem(), ec(), getGlobalOmit(), _getName(), gp(), lt(), no(), Se() (+4 more)

### Community 81 - "handleRequestError"
Cohesion: 0.18
Nodes (12): dn(), fa(), handleAndLogRequestError(), handleRequestError(), ht(), If(), oi(), Rt() (+4 more)

### Community 82 - "from"
Cohesion: 0.20
Nodes (12): alloc(), allocUnsafe(), allocUnsafeSlow(), byteLength(), construct(), fill(), from(), ho() (+4 more)

### Community 83 - "K"
Cohesion: 0.41
Nodes (12): compare(), J(), K(), re(), readIntBE(), readIntLE(), readUIntBE(), readUIntLE() (+4 more)

### Community 84 - "exports"
Cohesion: 0.18
Nodes (11): exports, ./generator-build, ./index-browser, ./package.json, default, import, require, default (+3 more)

### Community 85 - ".write"
Cohesion: 0.24
Nodes (10): Ba(), cr(), Fa(), Ha(), La(), pn(), Ua(), vp() (+2 more)

### Community 86 - "constructor"
Cohesion: 0.27
Nodes (11): constructor(), dispatchEngineSpans(), getActiveContext(), getAllBatchQueryCallbacks(), getGlobalTracingHelper(), _getNamespace(), getTraceParent(), isEnabled() (+3 more)

### Community 89 - "Ce"
Cohesion: 0.22
Nodes (9): Aa(), Ce(), ci(), De(), getGlobalOmit(), ho(), rn(), shouldApplyGlobalOmit() (+1 more)

### Community 91 - "NullTypesEnumValue"
Cohesion: 0.22
Nodes (5): AnyNull, DbNull, JsonNull, NullTypesEnumValue, ObjectEnumValue

### Community 93 - "Dt"
Cohesion: 0.28
Nodes (9): Dt(), equals(), Ga(), Hi(), isBuffer(), isDecimal(), Ja(), za() (+1 more)

### Community 94 - "./runtime/client"
Cohesion: 0.25
Nodes (8): ./runtime/client, default, require, default, import, node, require, types

### Community 95 - "hp"
Cohesion: 0.32
Nodes (8): Cs(), Ds(), hp(), hu(), Is(), Qs(), st(), yp()

### Community 96 - "tn"
Cohesion: 0.32
Nodes (7): Da(), Fa(), Ga(), Ia(), ir(), Ma(), tn()

### Community 97 - "PrismaClientKnownRequestError"
Cohesion: 0.29
Nodes (3): ErrorWithBatchIndex, PrismaClientKnownRequestError, PrismaClientUnknownRequestError

### Community 99 - "SpanKind"
Cohesion: 0.33
Nodes (6): SpanKind, CLIENT, CONSUMER, INTERNAL, PRODUCER, SERVER

### Community 102 - "getGlobalTracingHelper"
Cohesion: 0.67
Nodes (6): dispatchEngineSpans(), getActiveContext(), getGlobalTracingHelper(), getTraceParent(), isEnabled(), runInChildSpan()

### Community 103 - "./edge"
Cohesion: 0.40
Nodes (5): default, import, require, types, ./edge

### Community 104 - "./extension"
Cohesion: 0.40
Nodes (5): ./extension, default, import, require, types

### Community 105 - "./index"
Cohesion: 0.40
Nodes (5): ./index, default, import, require, types

### Community 106 - "./react-native"
Cohesion: 0.40
Nodes (5): ./react-native, default, import, require, types

### Community 107 - "./runtime/binary"
Cohesion: 0.40
Nodes (5): ./runtime/binary, default, import, require, types

### Community 108 - "./runtime/edge"
Cohesion: 0.40
Nodes (5): ./runtime/edge, default, import, require, types

### Community 109 - "./runtime/index-browser"
Cohesion: 0.40
Nodes (5): ./runtime/index-browser, default, import, require, types

### Community 110 - "./runtime/library"
Cohesion: 0.40
Nodes (5): ./runtime/library, default, import, require, types

### Community 111 - "./runtime/react-native"
Cohesion: 0.40
Nodes (5): ./runtime/react-native, default, import, require, types

### Community 112 - "./runtime/wasm-compiler-edge"
Cohesion: 0.40
Nodes (5): ./runtime/wasm-compiler-edge, default, import, require, types

### Community 113 - "./runtime/wasm-engine-edge"
Cohesion: 0.40
Nodes (5): ./runtime/wasm-engine-edge, default, import, require, types

### Community 114 - "./wasm"
Cohesion: 0.40
Nodes (5): ./wasm, default, import, require, types

### Community 115 - "$s"
Cohesion: 0.50
Nodes (4): lp(), qs(), $s(), wt()

### Community 120 - "SpanStatusCode"
Cohesion: 0.50
Nodes (4): SpanStatusCode, ERROR, OK, UNSET

## Knowledge Gaps
- **898 isolated node(s):** `name`, `version`, `description`, `main`, `type` (+893 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1712 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `n()` connect `n` to `edge-esm.js`, `wasm-engine-edge.js`, `runtime/index-browser.js`, `o`, `e`, `addErrorMessage`, `ia`, `r`, `constructor`, `addErrorMessage`, `wo`, `ju`, `.slice`, `r`, `transaction`, `transaction`, `Ne`, `i`, `e`, `r`, `write`, `ji`, `co`, `ml`, `write`, `write`, `r`, `fs`, `.slice`, `e`, `hs`, `constructor`, `write`, `write`, `write`, `.write`, `constructor`, `tn`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `kr()` connect `write` to `runtime/edge.js`, `i`, `library.js`, `constructor`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `Cr()` connect `write` to `r`, `react-native.js`, `write`, `edge-esm.js`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 85 inferred relationships involving `n()` (e.g. with `constructor()` and `dc()`) actually correct?**
  _`n()` has 85 INFERRED edges - model-reasoned connections that need verification._
- **Are the 68 inferred relationships involving `o()` (e.g. with `constructor()` and `ac()`) actually correct?**
  _`o()` has 68 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `a()` (e.g. with `_e()` and `Ne()`) actually correct?**
  _`a()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _898 weakly-connected nodes found - possible documentation gaps or missing edges._