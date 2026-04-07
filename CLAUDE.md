# CLAUDE.md

## Project Overview
- Build a client-only single-page quiz web app that runs entirely in the browser.
- Do not add a backend, external API calls, or cloud sync for core functionality.
- Core screens are `landing`, `quiz`, and `results`; prefer in-memory screen switching over full routing.
- Use React + TypeScript + Vite with CSS Modules and CSS custom properties.
- The quiz loop must show exactly one question at a time with exactly four answer buttons.
- Persist only leaderboard data and user preferences in `localStorage`; active quiz state stays in memory.
- Optimize for correctness first, then accessibility, performance, and UI polish.

## Current Architecture Intent
- Keep the app small and explicit. Avoid extra framework layers.
- Drive quiz state with `useReducer` and pure domain helpers.
- Keep screen components focused on rendering and user input.
- Put scoring, streaks, progress, timeout handling, and session transitions in reducer/domain modules.
- Isolate browser persistence behind storage adapter modules.
- Validate static question data before the quiz becomes playable.
- Use a deadline-based timer model. Treat timer expiry as an event, not as a scoring mechanism.
- Test pure logic heavily and cover critical user flows with UI tests.

## Project Structure

```text
src/
  app/
    AppShell.tsx
    quizReducer.ts
    selectors.ts
  components/
    LandingScreen.tsx
    QuizScreen.tsx
    ResultsScreen.tsx
    AnswerButton.tsx
    ProgressBar.tsx
    LeaderboardTable.tsx
  domain/
    scoring.ts
    timer.ts
    validation.ts
    types.ts
  data/
    questionBank.ts
  storage/
    leaderboardStorage.ts
    preferencesStorage.ts
  styles/
    tokens.css
    feedback.module.css
tests/
  unit/
  integration/
```

## Working Rules for Claude Code
- Read [docs/tech-design-spec.md](/Users/luannh/Documents/projects/claude-code-homework/docs/tech-design-spec.md) before changing architecture or product rules.
- Treat the spec as the primary source of truth for behavior, constraints, and boundaries.
- Make small, reviewable changes. Finish one vertical slice before widening scope.
- Prefer implementing core logic in pure helpers before wiring UI.
- Verify behavior after changes. Run the smallest useful test set first, then widen if needed.
- Preserve simple in-memory screen switching unless the spec changes.
- Keep prompt context lean: write durable project rules here, not temporary task notes or long rationale.

## Implementation Priorities
1. Make the quiz loop correct: start, answer, feedback, advance, finish.
2. Make timer behavior safe: reset per question, ignore stale events, prevent double resolution.
3. Make persistence safe: validate reads, normalize writes, trim leaderboard to top 10.
4. Add polish only after correctness is stable: animation, responsive refinement, and presentation details.

## Commands
- No project runtime commands are currently verifiable from the repository contents.
- Confirm before use: `npm install`
- Confirm before use: `npm run dev`
- Confirm before use: `npm run build`
- Confirm before use: `npm run test`
- Confirm before use: `npm run lint`

## Verification
- Always give Claude a way to verify its work. Prefer tests, deterministic output checks, and screenshots for UI changes.
- Treat verification as part of implementation, not a separate optional step.
- Run `npm run lint` and `npm run test` as the default verification step when those commands are available in the repo.
- Verify the smallest relevant scope first, then widen if needed.
- For logic changes, prefer reducer and domain tests before broader UI coverage.
- For UI changes, verify both behavior and presentation:
  - interaction flow
  - visible states
  - responsive layout
  - keyboard access
- For bug fixes, verify the reported symptom is gone and the root cause is covered by a test when practical.
- For timer changes, verify stale timeouts, double resolution, and difficulty-based durations explicitly.
- For persistence changes, verify malformed `localStorage` input falls back safely and normalized output is written correctly.
- When expected output is known, state it clearly in the task or test. Do not rely on subjective “looks right” checks alone.
- If a change cannot be verified with the current repo state, say so explicitly and do not claim completion beyond the checked scope.
- Do not ship unverified behavior when a reasonable verification path exists.

## Code Conventions
- Use strict TypeScript. Prefer explicit types at domain boundaries.
- Keep quiz state transitions in the reducer and pure helper modules.
- Keep UI components free of scoring, streak, leaderboard, and storage rules.
- Keep timer code responsible only for countdown state and timeout events.
- Put `localStorage` access only in storage adapter modules such as leaderboard/preferences adapters.
- Validate all externalized data at boundaries: static question data on boot, persisted data on read.
- Derive display values like progress, accuracy, and elapsed time instead of storing redundant state.
- Prefer immutable updates and deterministic helpers.
- Use CSS Modules and CSS custom properties; avoid ad hoc global styling unless clearly justified.

## Testing Expectations
- Add unit tests for reducer transitions and pure quiz domain helpers.
- Test scoring and streak multiplier rules precisely:
  - `1x` for streak `1-2`
  - `2x` for streak `3-4`
  - `3x` for streak `5+`
- Test timeout behavior, stale timer token handling, and double-submit prevention.
- Test question-bank validation, including rejection of malformed question records.
- Test storage normalization for malformed, partial, or outdated `localStorage` payloads.
- Add integration tests for critical flows:
  - landing selection and quiz start
  - answer submission and immediate feedback
  - auto-skip on timeout
  - auto-advance after feedback
  - final results summary
  - leaderboard persistence and top-10 trimming

## UX and Accessibility Requirements
- Keep the UI usable at `320px` width and above.
- Make all core interactions keyboard accessible with visible focus states.
- Use native buttons for answer actions unless there is a strong reason not to.
- Never rely on color alone for correctness, timeout, or status feedback.
- Keep timer information visually prominent without spamming screen reader announcements every second.
- Move focus appropriately after major screen transitions.
- Respect reduced-motion preferences for feedback and transitions.
- Maintain a path to Lighthouse Performance and Accessibility scores of `90+`.

## Data and Persistence Rules
- Support at least 10 total questions across at least 2 categories.
- Every question must have exactly four non-empty answers and a valid correct-answer index.
- Landing must include category and difficulty selection.
- Timer durations are fixed:
  - Easy: `20s`
  - Medium: `15s`
  - Hard: `10s`
- Timeout counts as `skipped`, awards `0`, resets streak, and reveals the correct answer.
- Results must include score, correct/incorrect/skipped counts, accuracy, category, difficulty, and elapsed time.
- Persist leaderboard and preferences with versioned keys and versioned payloads.
- Sanitize and validate persisted data before use.
- Sort leaderboard by score descending, then accuracy descending, then elapsed time ascending, then completion time descending.
- Trim leaderboard to the top 10 entries before writing it back.
- If `localStorage` is unavailable or malformed, continue gameplay with safe defaults.

## NEVER
- Never add a backend or external API dependency for the core quiz flow.
- Never introduce full routing when in-memory screen switching is sufficient.
- Never render more or fewer than four answer options for a question.
- Never let UI components own scoring, streak, or leaderboard rules.
- Never write directly to `localStorage` outside storage adapter modules.
- Never let timer expiry and answer submission both resolve the same question.
- Never let timer logic update score directly.
- Never bypass validation for static question data or persisted data.
- Never persist in-progress quiz session state unless the spec explicitly changes.
- Never treat timeout as `incorrect`; it is `skipped`.
- Never weaken strict TypeScript or remove validation to “move faster.”
- Never add repo-specific commands, dependencies, or structure assumptions without confirming them from the actual repository.

## If the repo and spec conflict
- Follow [docs/tech-design-spec.md](/Users/luannh/Documents/projects/claude-code-homework/docs/tech-design-spec.md) for product rules, architecture boundaries, and stack direction unless the user explicitly overrides it.
- If the repo contains partial implementation that conflicts with the spec, prefer bringing the code toward the spec in small, safe steps.
- If the conflict affects behavior or architecture materially, call it out in the change summary and avoid silent divergence.
