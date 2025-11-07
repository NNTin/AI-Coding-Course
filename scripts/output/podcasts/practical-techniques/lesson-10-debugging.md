---
source: practical-techniques/lesson-10-debugging.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T14:06:24.585Z
model: claude-haiku-4.5
tokenCount: 2344
---

Alex: Let's talk about debugging with AI agents, because it's probably not what you're doing right now. Most teams treat it as just asking an AI assistant "what's wrong with my code?" but that's diagnostic theater. Real debugging is about building the right scientific environment where agents can observe, reproduce, and verify fixes with actual evidence.

Sam: That makes sense. I've definitely fallen into the trap of pasting a stack trace and hoping the AI finds the problem. What changes?

Alex: Everything. Think about how you'd debug this in production manually. You wouldn't just stare at the code. You'd collect logs, look at metrics, maybe run a profiler, reproduce the issue in a controlled environment. Then you'd form a hypothesis and test it. That's the scientific method - observe, hypothesize, reproduce, test, fix, verify. AI agents are brilliant at that process when you give them the right inputs. The mistake is giving them the wrong inputs.

Sam: So you're saying the agent isn't the problem - how you're setting up the debugging task is?

Alex: Exactly. When you have a production bug, the agent needs access to the full diagnostic environment. That means logs, runtime state, database queries, heap dumps if there's memory issues. Not a description of those things - actual access. That's the fundamental shift.

Sam: How does that work practically? You can't just give an AI agent production database access.

Alex: You create inspection tools and read-only helpers. Let me give you concrete examples. For static analysis, you'd give the agent the full execution path - src/api/orders.ts where the HTTP handler is, src/services/OrderService.ts where the business logic lives. The agent traces through the actual code paths, not your summary of them.

For runtime issues, you build debugging scripts. Imagine a function called inspectOrder that takes an order ID and returns its current state - how it moved through the system, what data it has, what's corrupted. The agent runs these scripts, observes the actual state, and starts forming hypotheses based on evidence.

Sam: That's different from just asking the AI to look at the code.

Alex: Night and day different. Because now the agent has concrete data. It sees "order abc123 is in the database with total 0 but items array has three items" - that's debugging information. Not "the order total is sometimes zero." See the difference? One is an observation, one is a symptom.

Sam: Okay, so once you have that inspection setup, how do you actually reproduce the bug?

Alex: Reproducibility is the lynchpin. You need isolated, controlled environments. The gold standard is Docker. You create a Docker Compose setup that includes your API, your database, your caching layer - whatever your production environment has. But in miniature, where you control everything.

Then you build scripts that capture production state. If there's a memory leak, you capture heap snapshots at specific intervals. If there's a database corruption issue, you dump the relevant tables. If it's a timing issue, you record the exact sequence of events that triggers it.

The key insight is that you're not asking the agent to reproduce the bug. You're setting up an environment where the bug reproduces reliably, and the agent's job is to inspect what's happening during reproduction.

Sam: So the agent isn't actually discovering the bug - it's running diagnostics while you've already got the bug in a box.

Alex: Precisely. And that's way more productive. Because now the agent can run your reproduction script, watch the bug happen, collect heap dumps or trace logs, and analyze what changed in the system state. It's not guessing. It's observing.

Sam: What about the cases where you can't reproduce it locally? Like production-only issues?

Alex: That's where read-only production helpers come in. You create safe, read-only query interfaces into production. Your agent never modifies anything, never touches sensitive data. It can query logs, run diagnostic scripts, stream production logs to a file - but always read-only.

The key is building these as purpose-built helpers, not raw database access. A function that returns "give me all orders from this customer in the last hour with their state transitions." Not "here's the database password." That's both safer and more useful because the agent gets structured data it can reason about.

Sam: And you're verifying everything with evidence before you accept a fix?

Alex: That's non-negotiable. The agent proposes a fix, but you don't ship it based on the proposal. You show a reproduction of the bug - "here's the memory growing, here's the corrupted order, here's the race condition." Then you apply the fix and run the same reproduction. If the fix works, the evidence should be obvious. Memory stable, order correct, race gone.

Sam: So you're showing before-and-after proof.

Alex: Exactly. And you're running tests - both the existing tests to make sure nothing broke, and ideally new regression tests that would catch this specific bug if it ever reappeared. Every single fix needs a regression test. That's the only way you prevent the same bug from recurring in three months when someone refactors that code.

Sam: What does a regression test look like for something like a memory leak?

Alex: For a memory leak, you'd have a load test that runs for a certain duration - maybe 30 minutes - and monitors heap size. Before your fix, you can show the memory grows steadily. After your fix, it stays stable. That test stays in your CI pipeline. If anyone accidentally reintroduces the leak, the test fails during code review.

Same principle applies to any bug. Race condition? Write a test that triggers the race condition reliably. Corrupted data? Write a test that produces the corruption with the broken code, fails with the fix. The test is the evidence, and it's permanent.

Sam: This sounds like it requires building a lot of infrastructure - reproduction environments, inspection scripts, verification workflows.

Alex: It does, but here's the thing: you do this for every important bug anyway. You just usually do it ad-hoc, half-documented, in a way you can't reuse. The systematic approach is actually less work because you're reusing those tools. The next memory leak issue uses the same heap snapshot and memory profiling infrastructure. The next database issue uses the same inspection queries.

And the agent becomes genuinely useful because it's not guessing. It's running diagnostics in a structured environment where problems are isolatable and measurable.

Sam: So going back to the memory leak scenario in the exercise - you'd set up Docker with your API, Prometheus, Grafana, a load test harness. The agent can run the load test, capture heap snapshots, analyze what's growing.

Alex: Right. But it's even more specific. You'd give the agent inspection tools: scripts to capture heap snapshots on demand, analyze heap growth, check for connection leaks in the database. Each tool gives the agent structured information to reason about. The agent doesn't guess "maybe it's event listeners" - it runs the connection leak check and sees "yes, there are 500 unclosed database connections accumulating."

Sam: And then when the agent proposes a fix - say, properly closing connections - you run the load test for eight hours before and after to show memory stays stable.

Alex: Exactly. That's evidence-based debugging. The agent said "close the connections," you prove it works by showing the heap stays flat. You can't argue with that.

Sam: One more thing - you said give agents full diagnostic access. How do you balance that with security? We don't want agents accessing production data.

Alex: You don't give them raw access. You give them curated, read-only interfaces. Query tools that return structured data about system state, not customer data. Log streaming that filters for diagnostic information. Inspection helpers that show "this order moved through these states, has this data" without exposing payment information or user details.

It's the same principle as auditing systems - you need visibility for debugging, but you design that visibility to be safe and minimal. The agent gets enough to diagnose, nothing more.

Sam: Okay, so the meta-lesson here is that debugging with AI isn't about the AI being smarter at reading code. It's about setting up better diagnostic environments.

Alex: That's the whole thing in one sentence. The agent is a systematic investigator. You give it the right tools - reproducible environments, inspection scripts, log access, test frameworks - and it becomes incredibly effective. But if you just paste code and ask "what's wrong?" you're wasting its capability.

You're also wasting your own time debugging, because you end up in circles. The agent suggests something, you try it, it doesn't work, you don't know why. With evidence-based debugging, you see immediately whether a fix works because the reproduction reproduces or it doesn't.

Sam: And the regression test is the gift that keeps giving - it prevents the bug from coming back.

Alex: Exactly. That's actually the most valuable part. The fix itself matters once. The regression test matters forever. Every time someone refactors that code or adds a feature, the test is there making sure they didn't reintroduce the bug.
