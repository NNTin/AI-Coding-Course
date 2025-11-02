---
source: practical-techniques/lesson-8-tests-as-guardrails.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:12:53.576Z
model: claude-haiku-4.5
tokenCount: 4678
---

Alex: So we've been building up to this all course—how do you actually let an AI agent operate autonomously on your codebase without burning the place down? And the answer, which might seem obvious in retrospect, is tests. But not in the way most teams think about tests.

Sam: When you say "not the way most teams think about tests," what do you mean? I assume you're not talking about just having tests exist somewhere in CI.

Alex: Right. Most teams have tests to catch regressions after humans write code. We're talking about something more fundamental here: tests as the operational boundary for what an agent is allowed to do. It's the difference between a guardrail you check afterwards versus a physical constraint that prevents bad behavior in the first place.

Sam: So you're saying the agent can't ship code unless tests pass? That's table stakes for any automated system.

Alex: Yes, but there's a philosophical shift underneath that. When you have comprehensive tests, you're not asking "did the human engineer write correct code?" You're saying to the agent: "Here are the exact rules you must operate within. Stay within these bounds, and you have full autonomy. Violate them, and you stop." It's like a CNC machine—the machine can run unsupervised because physical constraints prevent it from cutting outside the safe zone.

Sam: That makes sense, but I think the tension most teams feel is: "How do I know my tests actually catch the things that matter?" You could have green tests and still ship something broken.

Alex: Exactly. That's why the human writes the tests and the agent writes the code. You're not asking the agent to decide what's correct—you're encoding your understanding of correctness into the test suite. The agent's job is to find implementations that satisfy your specifications, not to hallucinate what correct might be.

Sam: So if I'm an organization moving toward this model, what's the first shift I need to make? Is it just "write better tests"?

Alex: It's more than that. You need to think about your test suite as a specification language first, and a regression detector second. Right now, most teams write tests after code exists. They're describing what the code does, not what it should do. For agent work, you flip that: write the test first, which forces you to think deeply about requirements and edge cases before any code exists.

Sam: That's classic TDD, right? Red-green-refactor?

Alex: It's TDD, but for a different reason. With humans, TDD is optional—it's a discipline that some teams enforce and others skip. With agents, TDD becomes essential. Here's why: agents can ship code immediately if you don't have explicit guardrails. Without tests, you have two choices—manual review or unverified code. Both fail at scale.

Sam: When you say "unverified code fails at scale," you mean in terms of time cost, right? Every line an agent writes, someone has to check?

Alex: Yes. If you're reviewing agent output like you review human code, you've just eliminated the time savings from using the agent in the first place. The only way to scale autonomous agent execution is to make tests the arbiter of correctness. Green tests mean it's safe to ship, no human in the loop.

Sam: Okay, so assuming we have good tests, what does the workflow actually look like?

Alex: It's clean. You give the agent a specification—could be written as a test, could be written as a PR description with acceptance criteria. The agent reads your tests, implements code to pass them, runs the full test suite locally, and if everything's green, it commits and moves on. You're not in the loop unless something fails.

Sam: And when something fails? Does the agent just ping you and wait?

Alex: Not necessarily. Agents are actually pretty good at debugging test failures. The debug workflow is: test fails, agent reads the error message, forms a hypothesis about what's wrong, checks the code, fixes it, reruns tests. Most test failures resolve in that loop. You only get pinged if the agent gets stuck—typically that's architectural confusion or ambiguous test output.

Sam: What does "architectural confusion" look like in practice?

Alex: Let's say you have a test that's checking some behavior that depends on how your service layer talks to your database. The test fails, but the error message doesn't directly point to the database. The agent reads the error, tries a few fixes in the service layer, but they don't work. At that point, it escalates because it needs context about your architecture that it can't infer from the code.

Sam: So the agent hits a real knowledge boundary, not just a "I don't know how to debug" problem.

Alex: Exactly. And that's actually valuable. It tells you where your tests might be too tightly coupled to implementation details, or where you need better documentation. The agent's confusion is often a signal that your codebase has architectural assumptions that aren't explicit.

Sam: This feels like it ties back to that earlier point about tests being specifications. If your tests are specification-level, they should be decoupled enough that implementation changes don't break them.

Alex: Right. Unit tests that are hyper-coupled to internal implementation are noisy for agent work. They fail for reasons that don't matter. Integration tests that verify contracts and behavior are signal. That's why the test pyramid—lots of fast unit tests, fewer but more meaningful integration tests—works well with agents.

Sam: So if I'm designing my test suite thinking "agents will work here," what does that actually change?

Alex: A few concrete things. First, you want clear separation between unit tests that verify individual components and tests that verify how components interact. Second, you want good error messages in your tests—"expected X, got Y" is fine for humans, but for agents, "expected database connection to be closed after transaction, but connection pool size increased" gives them way more to work with.

Sam: The error messages thing is interesting. You're optimizing for machine readability, not human readability.

Alex: Not replacing human readability—augmenting it. A good test failure message should be clear to both. But when you're writing assertions, you might add a bit more context that an agent would find helpful. Something like including what the expected state was, what the actual state is, and what behavior was being tested.

Sam: Let me ask about test coverage. Does having agents change how you think about coverage targets?

Alex: It sharpens the question. Coverage percentage alone is meaningless—you can have 95% coverage and still miss critical cases. But with agents, you have a built-in mechanism to improve coverage. If an agent implements a feature and brings coverage down, tests fail. The agent then has to add test cases to restore coverage. You're not debating coverage in code review anymore—the test suite enforces it.

Sam: That's an interesting inversion. Instead of "you should write tests for this," it's "your code won't ship until tests pass."

Alex: Exactly. And mutation testing fits here too. You can use mutation testing to verify that your tests actually catch bugs, not just hit coverage targets. If a mutation doesn't break any tests, you have a gap. The agent reads that feedback and adds tests to catch future mutations in that area.

Sam: What about the CI side? If agents are committing code automatically, you need CI to be bulletproof, right?

Alex: You need pre-commit hooks and PR checks. Pre-commit hooks run the test suite locally before the agent even commits. That's where most issues get caught. For anything that makes it past pre-commit, GitHub Actions or whatever your CI system runs the full suite again. If that fails, the agent is blocked. It can't merge until tests pass.

Sam: So the agent needs to treat test failures as hard blockers, not "I'll just commit and see what CI says."

Alex: Right. And that's where discipline comes in. You set up your CI/CD pipeline such that failed tests prevent merges. The agent's prompt should reinforce that tests are the source of truth. "If any test fails, fix it before committing" is a core operating principle.

Sam: I'm imagining a scenario where an agent implements something, tests pass locally, but they fail in CI for some environmental reason. What happens?

Alex: The agent can't merge. At that point, it's likely a genuine environmental issue or a flaky test. The agent's escape hatch is to report the failure with context—what tests failed, what the error was—and ask for human help. This is actually where flaky tests become obvious. If the same tests fail intermittently in CI but pass locally, that's a test suite problem you need to fix.

Sam: So flaky tests are particularly problematic in this model because they create noise and false blockers.

Alex: They're not just problematic; they're dangerous. A flaky test that occasionally fails is an obstacle to agent autonomy. The agent can't distinguish between a real bug and a flaky test, so it might spend time debugging something that's not actually broken. You need rock-solid tests.

Sam: How do you practically get to rock-solid tests if you're starting from a codebase where tests are mediocre?

Alex: That's a separate project, honestly. You can't jump straight to agent-driven development if your test suite is weak. I'd suggest a phased approach: first, stabilize and improve tests in the areas where you'll use agents. Then introduce agents to that specific subsystem. As your confidence grows, expand to other areas. You learn what good tests look like by seeing agents interact with them.

Sam: Is there a minimum bar? Like, "you need X% coverage and zero flaky tests before agents touch this code"?

Alex: Not a hard number, but roughly: you want comprehensive tests for happy paths and known edge cases. You want tests that represent actual requirements, not internal implementation details. And you want them stable—running the same tests ten times should give you the same results. If you can't meet that bar, the subsystem isn't ready for agent work.

Sam: Let me circle back to the TDD cycle because I think that's where a lot of the value is for agents. Walk me through what it actually looks like when you're working that way.

Alex: You start by writing a failing test that represents the feature you want. The test encodes the requirement—what inputs go in, what behavior you expect, what the output should be. Then you give that test to the agent and say, "Make this test pass with a minimal implementation." The agent writes code, runs the test, iterates if it fails, and stops when it's green.

Sam: So you're writing one test at a time, or multiple tests upfront?

Alex: Ideally, you write a set of related tests that cover the core requirement and main edge cases. Then the agent implements to pass all of them. If you're building a feature flag system, for example, you'd write tests for enabling and disabling, for percentage rollouts, for caching behavior. The agent then implements all of that.

Sam: And if the agent gets it wrong?

Alex: The test fails. The agent reads why it failed and fixes it. Most of the time that works. If the agent keeps hitting the same wall, it escalates. But in my experience, if the test is clear and the agent has the right context, it figures it out.

Sam: What about the refactoring phase? After tests are green, the agent can improve the design without breaking functionality.

Alex: That's where TDD really shines with agents. You have a safety net—the tests. The agent can aggressively refactor, knowing that if anything breaks, tests will catch it immediately. And agents are good at this. They can extract methods, improve naming, reduce complexity, and maintain test greenness throughout.

Sam: Do you have the agent refactor in one big pass, or incremental steps?

Alex: Incremental is safer. Tell the agent to refactor one thing at a time—improve naming, then extract a method, then simplify logic. After each step, it reruns tests. That way if something breaks, you know exactly which change caused it. Plus, the diff is cleaner and easier to understand if you need to review it.

Sam: Okay, I'm getting a clearer picture. Let me ask about the boundary between what humans should specify and what agents should figure out. If I write a test, is that enough specification, or do I need to write more prose?

Alex: The test is the primary specification. The test shows exactly what behavior you expect. But tests alone can be ambiguous. Like, a test might verify that caching works, but not explain why caching is important or what the performance constraints are. I'd pair the test with a brief comment or PR description that explains the "why" and any non-obvious requirements.

Sam: So the agent reads the test to understand what, and the prose to understand why?

Alex: Yes. The "why" helps the agent make design decisions. It might choose a different caching strategy if it understands that memory usage is more critical than latency, for example. Tests specify behavior; prose explains intent.

Sam: I'm wondering about testing against external systems. If your feature flag system talks to a database or external API, how does that work with agents?

Alex: You mock or stub those dependencies. The test shouldn't depend on external systems being available. The agent implements against mocked dependencies, tests pass locally, and in production the real dependencies are used. That's standard practice—agents don't change that.

Sam: But if the mock doesn't accurately represent the real system, you could have tests that pass but production code that fails.

Alex: True, and that's a broader testing problem. Contract testing or integration tests against staging environments can catch those gaps. But for autonomous agent execution, the safest approach is: agents work against comprehensive unit tests with mocked dependencies. Humans write integration tests that verify the agent's code works with real systems. That separation of concerns keeps the feedback loop fast for agents while maintaining safety.

Sam: So agents operate in the unit test realm, humans verify integration?

Alex: Not quite. Agents run the full test suite, including integration tests, before committing. But integration tests are typically written by humans and maintained by humans. Agents might add integration tests if you give them a template, but the default is that humans own integration test strategy.

Sam: That makes sense. Let me ask about monitoring and what happens after code ships. Tests pass, code is in production, but something goes wrong. Does that feedback loop back to the test suite?

Alex: Absolutely. If production catches a bug that tests didn't, that's the first signal. You write a test that reproduces the bug—before fixing the code. Then the agent would fix the code to pass that new test. That's how you evolve your test suite over time. Production incidents become test cases.

Sam: So the test suite grows to capture real-world issues.

Alex: Yes. And that's actually healthy. Your tests become a record of what you've learned the hard way. Future agents operate within guardrails informed by past mistakes.

Sam: I'm trying to think about the failure modes. What's the worst case with this model?

Alex: Worst case is you have poor tests and agents ship buggy code. But that's not a problem with the model—that's a problem with poor tests. The model assumes you have good tests. Another failure mode is that your tests are good but slow, so agents are blocked waiting for test results. You'd solve that by optimizing the test suite—parallel execution, test sharding, whatever. The third failure mode is that tests are decoupled from actual requirements, so they pass but don't verify what matters. That's a specification problem, not an agent problem.

Sam: How do you avoid that third one? How do you ensure tests are actually testing what matters?

Alex: Code review of tests by domain experts. Tests should be reviewed with the same rigor as production code. And you should periodically audit tests—do they still represent current requirements? Are they testing dead code or edge cases that don't matter anymore? Treat tests as first-class code.

Sam: Do you change how you do code review if agents are writing code?

Alex: You're not reviewing every line the agent writes—that defeats the purpose. You're spot-checking, you're reviewing test failures to understand what the agent struggled with, and you're reviewing major refactors if the agent does them. But you're not doing line-by-line review of correct code. That's the whole point.

Sam: And what about the agent's commits? I imagine you want meaningful commit messages even if a human didn't write the code.

Alex: Right. You should prompt agents to write clear commit messages. "Fix bug in feature flag cache invalidation" is better than "Update code." The commit message should be clear enough that someone skimming the log understands what changed and why. That's good practice with agents as it is with humans.

Sam: One more thing—what about the learning curve for teams shifting to this model? Is there training involved?

Alex: The biggest shift is mindset. You have to believe that well-specified tests are sufficient, that you don't need to review every line. Some teams struggle with that because code review is part of their culture. I'd suggest starting small—use agents on a feature that's well-tested, see the results, build confidence. As your team sees agents working autonomously on multiple features, the model clicks.

Sam: And it's not like agents are replacing code review entirely. It's just shifting the review focus.

Alex: Exactly. Code review becomes about architecture, about test strategy, about whether the solution aligns with your systems. It's higher-level review, not line-by-line review. That's actually more valuable.

Sam: I think I have a solid mental model now. Tests are guardrails, humans specify via tests, agents implement within guardrails, escalate when they hit real blockers. Simple model.

Alex: It is simple, and that's its strength. The complexity is in executing well—building good tests, maintaining them, using agents effectively within their constraints. But the core model is sound. And once you've done it a few times, it becomes your default way of working.

Sam: Thanks for walking through this. I think teams would find this pretty practical if they're considering moving toward autonomous agent work.

Alex: The key message is just this: don't try to use agents without good tests. Tests first, then agents. That's the safe path.
