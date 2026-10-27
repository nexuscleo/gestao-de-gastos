# Graph Report - gestao-de-gastos  (2026-10-25)

## Corpus Check
- Corpus is ~3,764 words - fits in a single context window. You may not need a graph.

## Summary
- 63 nodes · 79 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Project Metadata
- Finance App Source
- Runtime Dependencies
- Build Dependencies
- Application Technology Stack
- NPM Scripts
- Installment Payment Flow
- Payment Reversal Flow
- Plan Validation and Scheduling
- App Initialization Helpers
- Transaction Validation
- Product Documentation
- Ending Installment Plans
- Monthly Due Date Rules
- Future Expense Tracking

## God Nodes (most connected - your core abstractions)
1. `FinanceApp()` - 8 edges
2. `FinançasPro expense-management application` - 6 edges
3. `Installment and financing tracking` - 6 edges
4. `scripts` - 4 edges
5. `isValidDate()` - 4 edges
6. `isValidPlan()` - 4 edges
7. `Registering the next installment payment` - 4 edges
8. `react` - 3 edges
9. `addMonths()` - 3 edges
10. `loadPlans()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `FinanceApp()` --indirect_call--> `loadPlans()`  [INFERRED]
  src/App.jsx → src/App.jsx  _Bridges community 8 → community 9_
- `FinanceApp()` --indirect_call--> `loadTransactions()`  [INFERRED]
  src/App.jsx → src/App.jsx  _Bridges community 10 → community 9_
- `isValidPlan()` --calls--> `isValidDate()`  [EXTRACTED]
  src/App.jsx → src/App.jsx  _Bridges community 10 → community 8_
- `FinançasPro expense-management application` --references--> `Local browser storage`  [EXTRACTED]
  README.md → README.md  _Bridges community 4 → community 6_
- `Installment and financing tracking` --references--> `Ending installment monitoring`  [EXTRACTED]
  README.md → README.md  _Bridges community 6 → community 12_

## Import Cycles
- None detected.

## Communities (15 total, 4 thin omitted)

### Community 0 - "Project Metadata"
Cohesion: 0.18
Nodes (10): name, private, type, version, lucide-react, react-dom, tailwindcss, @tailwindcss/vite (+2 more)

### Community 1 - "Finance App Source"
Cohesion: 0.33
Nodes (5): react, recharts, CATEGORIES_EXPENSE, CATEGORIES_INCOME, COLORS

### Community 2 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, lucide-react, react, react-dom, recharts

### Community 3 - "Build Dependencies"
Cohesion: 0.40
Nodes (5): devDependencies, tailwindcss, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 4 - "Application Technology Stack"
Cohesion: 0.40
Nodes (5): FinançasPro expense-management application, React, Recharts, Tailwind CSS, Vite

### Community 5 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

### Community 6 - "Installment Payment Flow"
Cohesion: 0.67
Nodes (4): Local browser storage, Installment progress and remaining due dates, Installment and financing tracking, Registering the next installment payment

### Community 7 - "Payment Reversal Flow"
Cohesion: 0.67
Nodes (3): Deleting a payment transaction, Expense transaction history, Returning an installment to pending

### Community 8 - "Plan Validation and Scheduling"
Cohesion: 0.67
Nodes (3): addMonths(), isValidPlan(), loadPlans()

### Community 9 - "App Initialization Helpers"
Cohesion: 0.67
Nodes (3): createId(), FinanceApp(), todayISODate()

### Community 10 - "Transaction Validation"
Cohesion: 0.67
Nodes (3): isValidDate(), isValidTransaction(), loadTransactions()

## Knowledge Gaps
- **31 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 32 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Dependencies` to `Project Metadata`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Build Dependencies` to `Project Metadata`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `react` connect `Finance App Source` to `Project Metadata`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `FinanceApp()` (e.g. with `loadPlans()` and `loadTransactions()`) actually correct?**
  _`FinanceApp()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._