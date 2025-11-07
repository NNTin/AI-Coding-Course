---
source: practical-techniques/lesson-8-tests-as-guardrails.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T14:36:33.064Z
model: claude-haiku-4.5
tokenCount: 2454
---

Alex: Here's the problem with agent velocity: they can refactor half your codebase in minutes. Rename functions, restructure modules, update dozens of files—all while you get coffee. That's powerful. It's also dangerous, because small logic errors compound fast when changes happen at scale.

Sam: So without constraints, you could ship subtle bugs across your entire system?

Alex: Exactly. And that's where tests come in. They're not just verification—they're your constraint system. Tests define the operational boundaries agents can't cross. But here's the deeper insight: tests are living documentation that agents actually read and learn from during the research phase before they write anything.

Sam: You mean they read the test code itself to understand what behavior matters?

Alex: Right. When an agent researches your codebase before implementing something, both source code and tests load into context. Good tests show concrete constraints: OAuth users skip email verification, dates handle timezone offsets, negative quantities are rejected. When these tests are in context, the agent's implementation gets grounded in your actual codebase patterns instead of statistical patterns from training data.

Sam: So the quality of tests directly affects the quality of generated code?

Alex: Absolutely. Bad tests pollute the context—tests named "test('works')" with unclear assertions, or tests that mock away actual behavior. When 50 low-quality tests load into context before an auth refactor, the agent inherits that noise. It's context pollution. You want signal, not noise.

Sam: How do you discover what actually needs testing in the first place?

Alex: Use the planning techniques from Lesson 7. Before you write tests, ask the agent research questions: "Show me how the password reset flow handles expired tokens." The agent searches your implementation, reads existing tests, and synthesizes findings. This loads concrete edge cases into context. Then follow up with specific constraints: "List the cases we need to test—users with pending password reset, users in the middle of completing one, concurrent reset requests." The agent analyzes the code against those questions and surfaces untested paths.

Sam: So you're using questions as a discovery tool.

Alex: Exactly. You get a grounded list of edge cases derived from your actual code, not generic testing advice. But here's where it gets tricky: there's a serious risk called "cycle of self-deception" when code and tests are generated in the same conversation.

Sam: What do you mean by that?

Alex: Imagine an agent writes an API endpoint that accepts zero or negative product quantities, then generates tests in the same session verifying that adding zero items succeeds. Both artifacts come from the same flawed reasoning—neither questioned whether quantities must be positive. The test passes, the bug ships. You've created a system where the agent is optimizing for green tests, not correctness.

Sam: That's Goodhart's Law, isn't it? When a measure becomes a target, it ceases to be a good measure.

Alex: Exactly. The solution requires a circuit breaker that prevents this convergence. And it's elegant: you use fresh contexts for each step. Write code in one conversation. Write tests in a completely separate conversation—the agent doesn't remember implementing anything, so tests derive independently from requirements. Then triage failures in a third context where the agent analyzes the failure objectively without defending prior decisions.

Sam: So the workflow is: code context, fresh test context, fresh debug context?

Alex: Precisely. Context A researches patterns and executes the implementation. Context B independently researches requirements and edge cases, then writes tests that should initially fail if they're any good. Context C analyzes failures without knowing who wrote what—pure forensics. This prevents specification gaming and gives you objective analysis.

Sam: That's methodical. What about the actual test design—how do you write tests that capture what agents should constrain?

Alex: Use sociable tests, not heavily mocked ones. Mock only external systems—APIs, third-party services. Use real implementations for internal code. A heavily mocked authentication test stubs findByEmail(), verify(), and create()—it passes even if the agent breaks all three. A sociable test uses real database queries, real password hashing, real session tokens. If the agent breaks any part of the flow, the test fails immediately.

Sam: And when do you mock?

Alex: When it costs money or has side effects. Mock Stripe because charging cards is real. Use a test database because it's fast and verifies actual behavior. This catches actual breakage instead of implementation details.

Sam: You also mentioned smoke tests earlier.

Alex: Right. Build a sub-30-second smoke test suite covering critical junctions—core user journey, authentication boundaries, database connectivity. Not exhaustive coverage. A 10-minute comprehensive suite kills your iteration speed. When agents make changes, you need fast feedback while the context is fresh. Run smoke tests after each task so you catch failures immediately instead of making 20 changes and discovering which one broke the system. The cost of debugging grows exponentially.

Sam: So you're codifying this somewhere agents see it?

Alex: Absolutely. Document it in your project's AGENTS.md or CLAUDE.md file so agents automatically run smoke tests without reminding them. They do it because the project expects it, like linting.

Sam: You mentioned that green tests don't guarantee working software.

Alex: Correct. Tests verify logic. They don't verify UX, real-world usability, or whether customers actually want the feature. Tests catch 80%. You run the actual product and verify the remaining 20%. A test suite passing in CI while a critical button is broken is a false sense of security.

Sam: What about testing strategies beyond deterministic tests? You mentioned agents as user simulators.

Alex: Yes. Deterministic tests verify known requirements. Agent simulation discovers unknown edge cases. Both are essential. You give an agent a task and the tools to interact with your product—browser automation, API clients, CLI access. Like a human tester, the agent navigates, clicks, fills forms, observes results. But agents explore non-deterministically.

Sam: What do you mean by non-deterministic?

Alex: Run the same test script twice and the agent explores different paths each time. One iteration tests the happy path, another discovers a race condition by clicking rapidly, a third stumbles onto unicode character edge cases you never wrote tests for. That randomness makes agents unreliable for regression testing—you can't guarantee the same paths in CI/CD—but it's excellent for discovery.

Sam: So agents find edge cases humans don't think to test?

Alex: Exactly. Deterministic tests prevent regression on known issues. Agent simulation discovers unknown issues. Workflow: use agents for discovery, then solidify findings into deterministic tests. Agents explore the unknown; tests prevent backsliding.

Sam: How do agents interact with your product for this testing?

Alex: Model Context Protocol servers. Browser automation via Chrome DevTools Protocol or Playwright for cross-browser testing. Mobile automation tools for iOS and Android. These give agents "eyes and hands" across platforms. They navigate your application like a user would but with systematic exploration of state spaces. Configuration happens in your AI assistant's MCP settings—direct connection to your product environment.

Sam: And when tests fail—which they will—how do you debug that?

Alex: Apply the same four-phase workflow from Lesson 3: Research, Plan, Execute, Validate. But specialized for debugging. You craft what I call a diagnostic prompt with specific structure. The agent examines the test code and assertions, articulates what it's testing and why, compares against the implementation, identifies the root cause, then determines whether it's a test that needs updating or a real bug.

Sam: That sounds like Chain-of-Thought for debugging.

Alex: It is. But the critical elements are: fenced code blocks preserve error formatting—prevents the LLM from misinterpreting failure messages. Explicit grounding like "use the code research" forces codebase search instead of hallucination. Numbered DIAGNOSE steps force sequential analysis. The agent can't jump to "root cause" without examining test intent first. And evidence requirements—file paths, line numbers, semantic analysis—prevent vague conclusions.

Sam: So you're forcing the agent to show its work?

Alex: Exactly. Evidence requirements mean the agent can't say "probably a database timeout." It must say "The error occurs in src/api/auth.ts:67 where user.profile.email is accessed. The profile is null for OAuth users because src/services/oauth.ts:134 skips profile creation." That's analysis grounded in your code.

Sam: The broader pattern seems to be: grounding throughout, constraints everywhere, fresh contexts to prevent self-deception.

Alex: Yes. Tests are guardrails. Write them separately from code. Run them frequently. Use them to catch regressions at scale when agents make sweeping changes. And use agent simulation to discover edge cases your deterministic tests miss. The two approaches complement each other.

Sam: And the key insight is that agents read tests as documentation?

Alex: Right. Tests tell agents what actually matters. They're not just verification artifacts—they're the constraints that shape agent behavior when it refactors your codebase. Good tests lead to good implementations. Bad tests create self-deception. That's why test quality and agent quality are intertwined.
