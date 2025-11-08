---
source: practical-techniques/lesson-8-tests-as-guardrails.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T09:34:38.785Z
model: claude-haiku-4.5
tokenCount: 3281
---

Alex: Let's talk about tests. This might seem like a step backwards—we just spent the last lesson on how agents execute massive refactors at velocity. Now I'm going to tell you that the main thing standing between you and a corrupted codebase is a good test suite.

Sam: That's a pretty stark way to frame it. So you're saying tests aren't about code quality or TDD philosophy—they're about containing agent-driven changes?

Alex: Exactly. When an agent refactors 30 files in a single session, they rarely get it right the first time. You're reviewing a 2,000-line diff. You develop pattern blindness. You skim past 28 correct files while missing two with subtle logic errors. A test would catch that immediately. The agent can't silently remove critical rounding logic if a test is verifying the output.

Sam: Right, but that's true for any refactor, agent-driven or not. What's different here?

Alex: Scale and velocity. Humans refactor slowly. We think through each change, test manually, iterate. We find bugs before they compound. Agents work so fast that errors cascade before anyone notices. That's why tests become a constraint system—they define operational boundaries agents cannot cross. And here's what's critical: tests also function as documentation that agents actually read.

Sam: What do you mean "actually read"? Tests are written for humans.

Alex: They're written for humans, but agents read them during the research phase. Before an agent writes code, it searches for relevant files, reads existing implementations—and it also loads tests into the context window. The difference between a good test and a bad test is night and day here. A good test names the scenario, shows what edge cases matter, documents the gotchas. When tests load into context before an auth refactor, their quality determines whether the agent's implementation is grounded in your actual constraints or just completes patterns from training data.

Sam: So if I have a test named `test('works')` with unclear assertions, that's worse than no test?

Alex: Worse, yes. That test fills the context window with noise. It loads into context, the agent reads it, and learns nothing useful. Imagine 50 tests load into context before an auth refactor—their quality determines whether the implementation is sound or just follows statistical patterns. A test that mocks away actual behavior teaches the agent that mocking away behavior is correct. A test that exercises real database queries teaches the agent that database behavior matters.

Sam: So the test quality directly affects implementation quality downstream. Before we write code, should we start by understanding what tests already exist?

Alex: Absolutely. Before writing tests, use the planning techniques from the last lesson—ask questions to discover what needs testing. Ask about OAuth users, email verification, deleted users, concurrent requests. The agent searches for the function, reads the implementation, finds existing tests, synthesizes findings. This loads concrete constraints into context: OAuth users skip email verification, admin users bypass rate limits. You get a grounded list of edge cases derived from actual code, not generic testing advice.

Sam: That's the "research first" approach we covered before, applied to test discovery. But here's my concern: when an agent writes both code and tests in the same conversation, aren't they operating from the same flawed assumptions?

Alex: You've identified the core problem. It's called specification gaming, and it's subtle. An agent implements an API endpoint that accepts zero or negative product quantities. Then in the same session, it generates tests verifying that adding zero items succeeds. Both artifacts stem from the same flawed reasoning—neither questioned whether quantities must be positive. The test passes, the bug remains undetected. At scale across large codebases, this compounds.

Sam: So there's a systematic bias when code and tests are created in the same context. They inherit each other's blind spots.

Alex: Exactly. There's a principle called Goodhart's Law: when a measure becomes a target, it ceases to be a good measure. When tests become the optimization target, agents optimize for passing tests rather than correctness. Without safeguards, you get weaker assertions, buggy implementations, and green CI pipelines validating the wrong behavior. The solution requires a circuit breaker.

Sam: What's the circuit breaker?

Alex: Separate contexts. The three-context workflow. First, write code in one context—research existing patterns, plan implementation, execute, verify correctness against requirements. Second, write tests in a fresh context. The agent doesn't remember writing the implementation, so tests derive independently from requirements. Third, triage failures in another fresh context. The agent analyzes test failures objectively without knowing who wrote the code or tests.

Sam: That's leveraging statelessness deliberately. You're preventing the agent from defending prior decisions because it has no prior context.

Alex: Right. Each context is independent. This makes the system less efficient in terms of token usage—you're not carrying assumptions forward. But it's drastically more reliable. Salesforce measured this: switching to automated root cause analysis with this workflow reduced debugging time 30% across millions of daily test runs.

Sam: So the tradeoff is explicit. You spend more tokens on context switches, but you get objective analysis and fewer bugs that compound. That seems worth it.

Alex: Absolutely. Now let's talk about the tests themselves. Most teams write tests that are too heavily mocked. They verify implementation details—whether a function calls `findByEmail()` or `create()`—rather than actual behavior.

Sam: So you're saying we should write what you call "sociable" tests?

Alex: Yes. Sociable unit tests use real implementations for internal code. You only mock external systems—Stripe API calls, third-party services. Everything internal runs with actual code. The difference is stark. A heavily mocked authentication test stubs `findByEmail()`, stubs password verification, stubs session creation. It passes even when the agent breaks all three. A sociable test uses real database queries, real password hashing, real session tokens. If the agent breaks any part of the flow, the test fails immediately.

Sam: And if we're concerned about setup complexity—like database dependencies—there are ways to handle that without heavy mocking?

Alex: There's a pattern called "Nullables"—production code with an off-switch for in-memory infrastructure testing. You get the benefits of testing actual behavior without complex mock setups. But more practically, use a fast test database. That's faster and more reliable than mocking away reality.

Sam: Okay, so sociable tests for everything internal, mock only the expensive external calls. But then there's the question of feedback speed. If I've made 20 changes and now I want to verify nothing broke, do I really want to run the comprehensive test suite?

Alex: You don't. Build a sub-30-second smoke test suite covering only critical junctions—core user journey, authentication boundaries, database connectivity. Not exhaustive coverage. A 10-minute comprehensive suite is useless for iterative agent development because you'll skip running it until the end. Then when something breaks, you've made 20 changes and the context is stale. You run smoke tests after each task to catch failures immediately while context is fresh.

Sam: So the smoke test is fine-grained feedback, not comprehensive coverage.

Alex: Exactly. As Jeremy Miller notes, use "the finest grained mechanism that tells you something important." Smoke tests exist solely to prevent compounding errors during rapid iteration. Reserve edge cases, detailed validation, and UI rendering details for the full suite. And codify this in your project's CLAUDE.md or AGENTS.md so agents automatically run smoke tests after completing each task without needing explicit reminders.

Sam: That's a nice operational detail—baking the practice into documentation so agents do it by default. Now, we've talked about deterministic tests verifying known requirements. But earlier you mentioned agents can discover unknown edge cases. How does that work?

Alex: That's autonomous testing. You give an agent a task and the tools to interact with your product—browser automation, CLI access, API clients. The agent navigates, clicks, fills forms, observes results. Like a human tester exploring your application. The critical difference: agents explore state spaces non-deterministically.

Sam: Non-deterministic? I thought we wanted reproducible tests.

Alex: For regression testing, yes. But for discovery, no. Run the same test script twice, and the agent explores different paths. One iteration tests the happy path, another might accidentally discover a race condition by clicking rapidly, a third might stumble onto an edge case with unicode characters you never considered. This randomness makes it unreliable for CI/CD pipelines. But it's excellent for discovery—finding state machine bugs, input validation gaps, edge cases you didn't think to test.

Sam: So agents as exploratory testers, not regression testers. You use their non-deterministic behavior as a feature, not a bug.

Alex: Right. The workflow is: agents explore and discover unknowns, then you solidify findings into deterministic tests that prevent backsliding. To connect agents to your product for this, you'll want MCP servers. Google publishes Chrome DevTools MCP for full browser automation—performance profiling, DOM manipulation, real-time console logs. Microsoft has Playwright MCP for cross-browser testing across Chromium, WebKit, Firefox, with accessibility tree-based interactions so the agent can reference elements naturally like "click the submit button." For mobile, there's mobile-mcp from Mobile Next for iOS and Android automation. And there's emerging support for desktop automation through Computer Use MCP servers that use screen capture and mouse/keyboard input.

Sam: So agents get eyes and hands across platforms. Browser, mobile, desktop.

Alex: Exactly. Once you configure these in your AI assistant's MCP settings, agents can autonomously test, reproduce bugs, explore edge cases.

Sam: We've covered a lot—tests as constraints, tests as documentation, separate contexts, sociable tests, smoke tests, autonomous testing. Let's zoom back to the diagnostic side. When a test fails, what's the framework?

Alex: Same four-phase workflow from earlier lessons: Research, Plan, Execute, Validate. But applied to debugging. There's a specific prompt pattern. You fence the error output in a code block—this prevents the LLM from interpreting the failure message as instructions. You add an explicit grounding directive: "Use the code research to analyze this failure." That forces codebase search instead of hallucination from training patterns.

Sam: So you're constraining the response.

Alex: Yes. Then you structure the diagnosis in numbered steps using Chain-of-Thought. One: Examine the test code and assertions. Two: Understand and clearly explain what the test is testing. Three: Compare against the implementation. Four: Identify the root cause. Then a binary decision: Is this a test that needs updating or a real bug in the implementation? With evidence—file paths, line numbers, concrete proof.

Sam: The structure forces sequential analysis. You can't jump to "root cause" without examining the test intent first.

Alex: Right. And the evidence requirement prevents hand-waving conclusions. You can adapt this same pattern for performance issues, security vulnerabilities, deployment failures—change the diagnostic steps, preserve the structure.

Sam: So the reliability comes from the structure, not the specific task?

Alex: The structure is everything. Chain-of-Thought forces reasoning. Evidence requirements prevent hallucination. Constrained decisions prevent open-ended speculation. If you're systematic, agents can fix most issues autonomously.

Sam: And this all connects back to the core principle: tests are guardrails. They prevent agents from silently corrupting your codebase at scale. Write tests that document constraints, keep them separate from code generation, make sure they're sociable enough to catch real problems, and use them to constrain agent behavior.

Alex: Exactly. Green tests don't mean working software—they verify logic, not UX or real-world usability. You still need to run the product yourself. Tests catch 80%; human verification catches the remaining 20%. But that 80% is critical. It's the difference between rapid iteration and slow disaster.

Sam: Got it. So the hierarchy is: deterministic tests verify known requirements and catch regressions. Agent simulation discovers unknown edge cases that become deterministic tests. And diagnostic prompts fix issues when tests fail.

Alex: That's the complete loop. Tests are guardrails for agent-driven refactoring at scale.
