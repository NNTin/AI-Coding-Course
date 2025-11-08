---
source: practical-techniques/lesson-10-debugging.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T08:56:31.622Z
model: claude-haiku-4.5
tokenCount: 4522
---

Alex: Let's talk about debugging with AI agents. And I want to start by saying what debugging with AI is not. It's not asking "what's wrong with my code?" and hoping for an answer.

Sam: Right, because the agent doesn't have access to your runtime state, your logs, your database. It's just looking at code you've pasted and guessing.

Alex: Exactly. Production debugging with AI agents is about building diagnostic environments where agents can observe actual behavior, reproduce issues systematically, and verify fixes with evidence. Think scientific method, not guesswork.

Sam: So observation, hypothesis, reproduction, testing, verification - the whole cycle.

Alex: Precisely. And the key insight is that AI agents excel when you give them access to the full diagnostic environment. Not just a description of symptoms, but the actual logs, the actual database state, the actual runtime behavior.

Sam: Walk me through how that works in practice. What does "full diagnostic access" actually mean?

Alex: Let's start with code inspection. Before you can fix anything, the agent needs to understand what's actually happening in your system. Begin with static analysis - give the agent the full execution path. For example, if you have an order processing bug, you'd show the agent the HTTP handler at src/api/orders.ts, the business logic in src/services/OrderService.ts, the database models, the validation schemas, even your test files. The complete picture.

Sam: That's a lot of context, but I see why it matters. The bug might be in the interaction between layers, not just one file.

Alex: Right. And then you layer on dynamic inspection. For production issues, create inspection scripts that agents can actually run. Let's say you have a function called inspectOrder that takes an order ID, queries the database, checks cache state, prints the order object with all relationships loaded, and validates business rules. The agent can run that script, see the actual state, and immediately spot anomalies.

Sam: So instead of describing what you see in production, you're giving the agent a tool to see it themselves.

Alex: Exactly. And this is where reproducibility becomes critical. If you can't reproduce a bug, you can't verify your fix. Docker-based reproduction is your friend here.

Sam: How do you capture production state in a Docker environment?

Alex: Create isolated environments that mirror production conditions. You'd have a Docker Compose setup with your application, database, cache, message queues - the whole stack. Then you create seed data that triggers the bug. For instance, if orders with empty item arrays cause crashes, your seed script creates exactly that scenario. You can even capture production database snapshots, sanitize sensitive data, and restore them locally.

Sam: That's powerful. You're essentially freezing the exact conditions that cause the bug.

Alex: Right. And your agent workflow becomes: run the reproduction script, observe the failure with actual logs and stack traces, analyze the root cause with full context, propose a fix, verify the fix in the same environment. No guessing involved.

Sam: What about more complex state-dependent bugs? Things that depend on timing, or specific sequences of operations?

Alex: Reproduction scripts with snapshots. Capture the exact state before the bug occurs and restore it on demand. You'd have a captureState function that dumps your database, captures cache contents, saves message queue state, exports configuration, stores uploaded files - everything. Then a restoreState function that rebuilds that exact environment. This is especially useful for race conditions or bugs that only appear after specific user workflows.

Sam: Okay, so you've got reproduction working. The agent can trigger the bug reliably. Now what?

Alex: Now you let the agent inspect logs and databases directly. Don't make them guess - give them read access to actual system state. Structure your logs for agent consumption. Use structured logging with JSON format, include correlation IDs to trace requests across services, log timestamps, severity levels, context objects. When an agent analyzes logs, they can grep for specific request IDs, parse JSON to extract error patterns, trace the full execution flow.

Sam: Give me a concrete example.

Alex: Sure. Let's say you have an "items is null" error. The agent runs your log analysis, finds request ID abc123, sees that at line 4521, items.length is zero, then at line 4523, items[0].price throws a TypeError. The stack trace points to src/services/OrderService.ts line 87. That's precise, actionable information - not a vague description of "sometimes orders crash."

Sam: And database inspection works similarly?

Alex: Yes. Create read-only database helpers for agents. A TypeScript function that opens a read-only connection, runs safe SELECT queries, formats results as JSON, includes row counts and query execution time. The agent can inspect actual data, check for constraint violations, analyze relationships between tables.

Sam: What about production issues that you can't fully reproduce locally? Sometimes bugs only happen at scale or with specific production data you can't copy.

Alex: Remote debugging with helper scripts, but you must be careful about safety. Create read-only production query tools - scripts that can only run SELECT statements, with query timeouts, rate limiting, and audit logging. For logs, use streaming tools that tail production logs with filtering by service, request ID, or time range, again with rate limits and automatic timeout.

Sam: So the agent can observe production, but can't modify anything.

Alex: Correct. And here's a critical point: never accept solutions without evidence. I cannot stress this enough. "This should fix it" is not acceptable.

Sam: What does evidence-based verification actually look like?

Alex: You require proof in your agent prompt. The agent must provide reproduction showing the bug before the fix, test output showing the bug is fixed after the change, the exact diff of code changes, and proof that existing tests still pass. If they can't provide all four pieces of evidence, you reject the solution.

Sam: That's rigorous.

Alex: It has to be. Here's a real example: agent finds that items[0] is accessed without checking if items is empty. They propose wrapping it in an if statement that checks items.length and returns zero totals for empty arrays. Then they must rerun the reproduction script with the fix applied, run unit tests for OrderService, run integration tests for the full order flow. All passing. That's evidence.

Sam: And you can automate this verification?

Alex: Absolutely. Build verification into your debugging workflow. Create a verify script that checks out the proposed fix branch, runs all tests, runs the reproduction case, compares output against baseline, generates a pass/fail report. The agent runs this script before claiming success.

Sam: What about regression tests? I assume every fix needs one?

Alex: Non-negotiable. Every bug fix must include a regression test that would have caught the bug. The agent must show you the specific test case they added and proof that the test fails on the broken code - demonstrating it actually catches the bug - and passes after the fix. This prevents the same issue from recurring.

Sam: Let's make this concrete. Walk me through debugging a real production issue using this methodology.

Alex: Good idea. Imagine you have a Node.js API with a memory leak. Memory usage grows steadily until the process crashes with out-of-memory errors after six to eight hours of uptime.

Sam: Classic production nightmare.

Alex: Right. First, you build the reproduction environment. Docker Compose with your API, PostgreSQL, and monitoring tools like Prometheus and Grafana. You run Node with heap snapshot on OOM enabled - specifically node --max-old-space-size=512 --heapsnapshot-on-oom. Then you create a load test script that simulates production traffic patterns.

Sam: So you're recreating the conditions that cause the leak.

Alex: Exactly. Next, you build inspection tools. A script to capture heap snapshots on demand, another to analyze heap growth over time, a database query to check for connection leaks. Now you have diagnostic instruments.

Sam: And then you turn the agent loose?

Alex: With a very specific prompt. You tell the agent to start the reproduction environment, run the load test for thirty minutes, capture heap snapshots every five minutes, analyze the snapshots to identify growing objects, check for event listener accumulation, inspect database connection pools, and report findings with evidence.

Sam: What kind of evidence would you expect?

Alex: Heap snapshot comparisons showing which objects are accumulating, stack traces showing where those objects are allocated, database connection count over time, memory graphs showing the growth curve. Concrete data, not speculation.

Sam: And when they find the root cause?

Alex: They propose a fix and you verify it rigorously. Run an eight-hour load test before the fix, capture the memory profile. Apply the fix, run the same eight-hour test, compare memory profiles. The fixed version should show stable memory usage, no growth over time.

Sam: And of course, the fix needs regression tests.

Alex: Always. In this case, you'd add a test that runs the problematic code path in a loop, monitors memory usage, and fails if it grows beyond a threshold. This catches memory leaks in CI before they reach production.

Sam: What are the common patterns you see when memory leaks happen?

Alex: Event listener accumulation is big - adding listeners without removing them. Unclosed database connections or file handles. Caching without eviction policies. Global references to objects that should be garbage collected. Closures capturing large objects unintentionally.

Sam: And the agent can identify these patterns in heap snapshots?

Alex: Yes, especially with structured data. The heap snapshot shows you object counts and retained size. If you see EventEmitter instances growing linearly with requests, or database connection objects accumulating, that's a smoking gun.

Sam: Let's talk about the bigger debugging methodology. You mentioned the scientific method earlier - how does that map to working with AI agents?

Alex: Each phase has a specific agent role. In the observation phase, agents analyze logs, metrics, and traces. They're pattern-matching across large datasets, which they're good at. During hypothesis formation, agents propose testable theories based on code analysis and observed behavior. For reproduction, agents run scripts and Docker environments to isolate bugs. In testing, they verify hypotheses with evidence. For the fix phase, they apply solutions with regression tests. And verification ensures the fix resolves the issue without side effects.

Sam: What's the most common mistake you see engineers make when debugging with AI agents?

Alex: Accepting solutions without reproduction. An engineer describes a bug, the agent suggests a fix that "should work," and the engineer applies it to production without ever reproducing the issue or verifying the fix. That's dangerous.

Sam: Because you don't actually know if you fixed the root cause.

Alex: Right. You might have fixed a symptom, or gotten lucky, or introduced a new bug. Without reproduction and verification, you're flying blind.

Sam: What about cases where reproduction is genuinely difficult? Heisenbugs that disappear when you observe them, race conditions that only happen under specific timing?

Alex: Those are the hardest cases, but the methodology still applies. You invest more heavily in instrumentation - distributed tracing, detailed timing logs, chaos engineering to trigger race conditions. You might use tools like rr for record-replay debugging, capturing an execution trace you can replay deterministically. The key is not giving up on reproducibility, but finding creative ways to achieve it.

Sam: And sometimes that means accepting "we can reproduce it one in a hundred times" rather than demanding every time?

Alex: Yes, but you quantify it. "This script triggers the bug in 5% of runs over a ten-minute period." That's reproducible enough to verify a fix - you run the script before the fix and see the 5% failure rate, apply the fix, run it again and see zero failures over a much longer period.

Sam: Statistical validation rather than deterministic.

Alex: Exactly. Especially for concurrency bugs, that's often the best you can do.

Sam: Let's talk about the agent's role in hypothesis formation. How do you guide agents to form good hypotheses versus wild guesses?

Alex: Context is everything. Give the agent the full execution path, recent code changes that might have introduced the bug, similar bugs you've seen in the past, relevant architecture documentation. The more context, the better the hypotheses.

Sam: So if you just changed the caching layer and suddenly orders are failing, you'd tell the agent "we modified caching yesterday, here's the PR"?

Alex: Absolutely. That focuses the investigation. The agent might hypothesize cache invalidation timing issues, stale data being served, or cache key collisions. Those are testable hypotheses grounded in recent changes.

Sam: What about truly mysterious bugs where you have no idea what changed?

Alex: Start with correlation analysis. When did the bug start appearing? What deployments happened around that time? What external dependencies were updated? Are there patterns in which users or data trigger it? Agents can analyze logs to find these correlations, then form hypotheses based on what changed.

Sam: And if nothing changed, it's a load or data issue?

Alex: Often, yes. A code path that worked fine with 100 users breaks with 10,000. An edge case in your data that never appeared before suddenly shows up. Agents can analyze traffic patterns and data distributions to identify these scenarios.

Sam: Let's talk about the verification phase more. You mentioned demanding evidence, but what if the fix genuinely can't be verified locally? Maybe it's a production-scale issue or depends on external APIs?

Alex: You create production-like verification environments. Use load testing tools to simulate production scale. Use API mocking or contract testing to simulate external dependencies. If you absolutely must verify in production, use feature flags and gradual rollouts - deploy to 1% of traffic, monitor for the issue, expand if clean.

Sam: Canary deployments as verification.

Alex: Yes, but with very specific metrics. You're monitoring error rates, memory usage, response times, whatever metric relates to the bug. You compare the canary group to the control group statistically.

Sam: And if the canary shows the bug is fixed, you roll out fully?

Alex: With continued monitoring. Bugs have a way of reappearing under different conditions. The regression test in your CI is your long-term protection.

Sam: What's your debugging checklist? If I'm about to start debugging with an AI agent, what are the questions I should ask?

Alex: Five critical questions. One: Can you reproduce it in isolation? If no, stop and build reproduction first. Two: Does the agent have access to all diagnostic data - logs, databases, runtime state? If no, build the inspection tools. Three: Is the fix verified with evidence - before/after reproduction, passing tests? If no, reject the solution. Four: Does a regression test prevent recurrence? If no, write one. Five: Are there monitoring gaps to address? If the bug made it to production, something in your monitoring failed.

Sam: That last one is interesting. Every bug is a monitoring failure?

Alex: In a sense, yes. Either you didn't have the right metrics to catch it before production, or you had the metrics but no alerts, or the alerts fired but weren't actionable. Debugging should improve your monitoring, not just fix the code.

Sam: So the outcome of debugging isn't just a fix, it's better observability?

Alex: Exactly. You should come out of every debugging session with: the bug fixed, a regression test, and improved monitoring or alerting that would catch similar issues earlier.

Sam: Let's go back to the memory leak example. What monitoring improvements would you expect?

Alex: At minimum, memory usage alerts with thresholds. If memory grows more than 20% over a two-hour window, alert. Better yet, automated heap dump capture when memory crosses thresholds, so you have diagnostic data before the crash. Even better, synthetic tests that exercise high-memory code paths and fail if memory isn't released.

Sam: Proactive rather than reactive.

Alex: Right. The best debugging session is one you don't need because monitoring caught the issue first.

Sam: Final question: when should you not use an AI agent for debugging?

Alex: When you don't have reproduction or diagnostic access. If you're just guessing, the agent will guess alongside you, and that's not useful. Also, when the bug requires deep domain expertise the agent doesn't have - maybe a quirk of your database's transaction isolation, or a subtle protocol implementation detail. The agent can help, but you need to drive.

Sam: So agents are diagnostic tools, not magic solutions.

Alex: Precisely. You're still doing the debugging. The agent helps with systematic investigation, pattern matching in logs, running verification scripts. But the engineer owns the process, builds the diagnostic environment, and demands evidence. That's the methodology.

Sam: This is a very different approach than "paste your error into ChatGPT and hope."

Alex: Completely different. This is production-grade debugging with the rigor you'd expect for systems that matter. The agent is your systematic investigator - you give it tools and demand proof.

Sam: And the payoff is fixes you can trust.

Alex: Exactly. Every fix is verified, tested, and monitored. That's how you debug with confidence in production environments.
