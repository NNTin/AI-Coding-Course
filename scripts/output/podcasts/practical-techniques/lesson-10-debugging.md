---
source: practical-techniques/lesson-10-debugging.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T12:58:27.585Z
model: claude-haiku-4.5
tokenCount: 2322
---

Alex: Let's talk about debugging with AI agents, and I want to start by challenging how most engineers approach this. When they hit a production bug, they tend to throw the code at Claude and ask "what's wrong?" That's backwards. Debugging with AI is about creating the right diagnostic environment - treating the agent as a systematic investigator rather than a code reviewer.

Sam: That's a significant shift from how I've seen most teams use AI for debugging. So instead of just pasting a stack trace and hoping for insights, we're building actual diagnostic infrastructure?

Alex: Exactly. Think about how you'd debug a production issue manually. You don't just read the code and guess. You observe the actual behavior - logs, metrics, database state, heap dumps. You form a hypothesis. You try to reproduce it in a controlled environment. You verify the fix works before deploying. That's the scientific method, and AI agents excel when you give them access to that full diagnostic environment.

Sam: But doesn't that require way more setup? Setting up Docker environments, creating inspection scripts - that sounds like overhead.

Alex: It is setup, but it's the good kind of setup. Here's the key insight: when you give an agent direct access to logs, database state, and runtime information, you eliminate the most dangerous debugging pattern - the agent hallucinating about what might be wrong. Instead, it's analyzing actual evidence. The agent becomes your systematic investigator.

Sam: So the workflow would be something like: agent observes the system state, forms a hypothesis about what's happening, but then we need to isolate and reproduce the issue before we even consider a fix?

Alex: Precisely. And reproducibility is everything. If you can't isolate the bug in a controlled environment, you can't verify that your fix actually works. That's why Docker-based reproduction is so valuable. You capture the exact conditions - the schema, the data patterns, the load characteristics - and you create an environment where the bug reliably appears. The agent then operates in that isolated space.

Sam: I'm thinking about a memory leak scenario. In production, memory grows over hours, but locally it might not show up in minutes. How do you reproduce something like that without running for six hours?

Alex: That's where inspection scripts become critical. You create tools that let the agent inspect runtime state directly - heap snapshots, connection counts, event listener accumulation. The agent doesn't have to guess. It can run a script, see that database connections aren't being closed, and immediately identify the root cause. Then you build a focused load test that demonstrates the leak in minutes instead of hours.

Sam: So the agent's investigation is driven by tools it can actually run and observe the results from?

Alex: Yes. Create read-only database queries that show connection counts. Write heap inspection scripts. Build automated log analysis. The agent operates on evidence, not descriptions. And here's the crucial part - once the agent proposes a fix, you don't accept "this should work." You demand proof. Before-and-after comparisons. The load test passing without memory growth. Regression tests that prevent the bug from recurring.

Sam: That seems like it could slow down the process if you're always requiring verification, but I suspect the actual payoff is that you catch issues before deploying?

Alex: More than that. You're building institutional knowledge. Every bug gets a regression test. You're instrumenting your system to prevent future occurrences. And because the agent is working with real data, not hypothetical scenarios, the fixes are almost always correct on first try. No deploy-and-hope cycle.

Sam: Let me push back on one thing though. You're describing environments that need pretty careful setup - Docker with the right dependencies, inspection scripts, load test harnesses. That's a lot for debugging a single issue.

Alex: Fair point. The answer is: you build this infrastructure incrementally. Start with what you have. If you've got logs, create a structured log analysis script. If you can query your database, build a read-only inspection helper. If you have production but can't fully reproduce locally, create safe read-only queries that let the agent inspect production state. You don't need all of it at once. You build the diagnostic environment that fits your system.

Sam: So for a new team starting out, what's the minimum viable setup?

Alex: Three things. One: structured logs that are easy to parse and search. Two: the ability to run your application in an isolated environment - doesn't have to be Docker, could be a test database and a local service. Three: a way for the agent to verify a fix works - automated tests or a simple reproduction script. Everything else builds from there.

Sam: And the agent's role in that is it can navigate these tools and pull together evidence?

Alex: Right. Once you've given an agent the right access, it becomes incredibly systematic. It's not guessing. It's "here are the symptoms, I'll check the logs, query the database, run a heap dump, and tell you what's actually happening." Then it proposes a fix based on actual data. And crucially, you don't accept that fix until it's verified.

Sam: How does that verification work in practice? You mentioned before-and-after comparisons and regression tests.

Alex: The agent proposes a fix, you apply it in your isolated environment, and the agent re-runs the reproduction steps to verify the bug is gone. Then you run your test suite to ensure nothing broke. Finally, you add a new test that specifically covers this bug - so if someone accidentally reintroduces it in the future, the test catches it immediately. The agent can even write that regression test for you.

Sam: So the agent is working iteratively through the entire debug cycle, not just generating a proposed fix?

Alex: Exactly. And that's where the real power emerges. The agent sees that memory still growing after the first fix, so it digs deeper. It notices database connections aren't being closed in one code path but are in another. That consistency gap becomes the hypothesis. It can guide you through multiple iterations until the evidence shows the bug is fixed.

Sam: That requires a lot of trust in the agent being thorough, though. How do you make sure it's not missing something?

Alex: You don't trust - you verify. The verification is built in. The agent proposes a fix, but you only accept it when the evidence is clear. Memory stable over eight hours. All tests pass. The specific bug no longer reproduces. That's not trust, that's science. The evidence either supports the fix or it doesn't.

Sam: I think the biggest mindset shift here is that debugging is no longer "ask the agent to find bugs in code" but rather "create an environment where the agent can systematically investigate."

Alex: Exactly right. And here's why that matters for senior teams - it's the difference between hope-driven debugging and evidence-driven debugging. Most teams do hope-driven: they apply a fix, deploy, and hope it works. You're building the infrastructure to know it works before you deploy. That's the production-grade approach.

Sam: And as a side effect, you're building better observability and monitoring into the system generally?

Alex: Absolutely. The inspection scripts you create for debugging become the foundation of your monitoring. The structured logs that help agents investigate become your audit trail. The regression tests prevent recurrence. You're not just fixing the bug - you're improving the entire system's debuggability. That's the real multiplier effect.

Sam: One more practical question - in a large codebase with many services, does this approach still scale? Or does it become overwhelming?

Alex: It scales because you're working methodically. You're not trying to debug everything at once. You isolate the failing service, create a reproduction environment for just that piece, and investigate in that context. The agent can be given the relevant code, logs from that service, and database queries specific to that domain. You're reducing complexity by focusing.

Sam: So the discipline is really about not trying to solve the whole system at once?

Alex: Right. Production debugging requires discipline. You observe symptoms from the whole system, but you isolate investigation to the smallest component that reproduces the issue. The agent gets the narrowly-scoped context and the right diagnostic tools. That focus is what makes both the agent and human investigation effective.

Sam: This has fundamentally changed how I think about setting up a debugging infrastructure. Instead of "let's build monitoring," it's "let's build diagnostic environments that agents can actually investigate."

Alex: That's the frame. Monitoring tells you something broke. Diagnostic environments let you systematically discover why. And when an agent is operating in that environment with access to real data and the ability to verify hypotheses, debugging becomes predictable. You follow the scientific method, you get reliable answers, and you prevent recurrence through tests. That's production-grade debugging.
