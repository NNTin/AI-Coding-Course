---
source: practical-techniques/lesson-10-debugging.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:11:35.123Z
model: claude-haiku-4.5
tokenCount: 3043
---

Alex: So let's talk about debugging with AI agents. And I want to start with a mindset shift because this is where most teams get it wrong. When you hand an AI agent a problem, the instinct is to just dump your error message and ask "what's wrong with my code?" But that's not systematic debugging—that's lazy debugging.

Sam: Right, you're outsourcing the thinking instead of building a diagnostic system. So what does systematic debugging actually look like with an agent?

Alex: It's the scientific method applied rigorously. You observe, you form a hypothesis, you reproduce the bug in isolation, you test your theory with evidence, you fix it, and then you verify. Every step requires data. And here's the thing: AI agents are exceptional at working through data-rich environments. But they need you to build that environment for them first.

Sam: So the agent isn't doing the debugging—you're building the tool that lets the agent debug systematically.

Alex: Exactly. The agent becomes your systematic investigator, but you're the one who has to set up the crime scene. And that's actually where the real work is. Let's say you have a production bug. Something's wrong but it's not immediately obvious. The first instinct is to look at the code, right? But production bugs aren't usually code problems—they're environment problems, state problems, race conditions, resource exhaustion.

Sam: So you need to give the agent access to actual production data. Logs, metrics, database state—not just source code.

Alex: Precisely. And that's where a lot of teams struggle. They try to create minimal reproducers without actually capturing what the system was doing when the bug occurred. I've seen teams spend days on "why is this happening?" when they should have spent 30 minutes capturing the diagnostic data first.

Sam: What does that actually look like in practice? If I have a production issue right now, where do I start?

Alex: You start by building inspection scripts. Not to fix anything yet—just to see what's actually happening in your system. Let's say you have a memory leak. A slow leak that takes 6-8 hours to kill a process. You can't just look at the code and guess. You need to instrument the system to see what's growing over time.

Sam: So you'd write a script that captures heap snapshots at intervals, or tracks object counts, something like that?

Alex: Yes. And you'd give that script to the AI agent along with instructions on how to run it and what to look for. The agent can analyze heap snapshots, correlate memory growth with specific requests, track down which objects are accumulating. But—and this is critical—the agent needs the raw data. It needs access to the actual heap dumps, not just your interpretation of them.

Sam: I'm thinking about a team I worked with that had mysterious database connection exhaustion. We knew connections were filling up, but we didn't know why. Did they miss that?

Alex: Probably. Most teams do. They'll create a simple repro script that loads the app, makes some requests, and checks the connection pool. But that's not the actual bug. The actual bug is usually hiding in specific edge cases or specific patterns of requests. So the smarter approach is to capture what was happening in production when the problem occurred, and recreate that.

Alex: Docker-based reproduction becomes critical here. You build an environment that matches your production setup—same database, same dependencies, same load patterns. You create a script that simulates the production workload that triggers the bug. The AI agent can then interact with that environment directly.

Sam: You're essentially creating a lab where the agent can experiment safely.

Alex: Right. The agent can trigger the bug, observe the behavior, modify hypotheses, test fixes, all without touching production. And the key insight is that the agent can work autonomously once the environment is set up. It doesn't need you to manually check everything. It can run diagnostics, analyze results, propose theories, test them.

Sam: But there's a trust problem there, right? How do you know the agent isn't missing something, or going down a wrong path?

Alex: That's where the evidence requirement comes in. You don't accept "this should fix it" based on reasoning alone. You require the agent to demonstrate the fix. Show me a before-and-after. Show me the memory profile stabilizing. Show me the connection pool staying healthy under load. Make them prove it in the controlled environment.

Sam: So the agent has to do the work twice—first to investigate and figure out the hypothesis, then to verify that the fix actually solves the problem.

Alex: And that's not wasted effort. That's the difference between a fix that looks good on paper and a fix that actually works. I've seen too many bugs "fixed" with code changes that didn't actually address the root cause. The agent made a logical leap without evidence. That's a trap even good engineers fall into.

Sam: What about situations where you can't fully reproduce the bug locally? Say there's a race condition that only manifests under specific production load patterns that are hard to simulate.

Alex: Then you need remote debugging with safety guardrails. You don't give the agent write access to production. But you can give it read-only access. You create helper scripts that pull logs, database queries that show state without risk of modification, heap dumps that the agent can analyze. The agent becomes your tool for slicing through massive log files and spotting patterns you'd miss manually.

Sam: That sounds like structured log analysis. Instead of grep-ing through millions of lines, you give the agent formatted data that's easier to reason about.

Alex: Exactly. And this is where a lot of teams fail to optimize. They have massive unstructured logs, timestamps in different formats, nested JSON that's hard to parse. The agent spends cycles just parsing the data instead of analyzing it. If you structure your logs for consumption—consistent timestamps, clear fields, predictable structure—the agent can focus on the actual investigation.

Sam: So the upfront investment in good observability infrastructure pays off when you're debugging with an agent.

Alex: Significantly. A well-instrumented system becomes dramatically easier to debug because you can give the agent rich contextual data. A poorly instrumented system means the agent is working blind, making educated guesses.

Sam: Let's say I've identified the bug with the agent's help, and we've got a fix. How do you prevent that same bug from coming back?

Alex: Every fix needs a regression test. Not a generic test—a specific test that would have caught this bug. If it's a memory leak, you test that memory usage stays stable under the same load pattern for hours. If it's a connection leak, you verify the pool stays bounded. If it's a race condition, you create a test that reproduces the race condition scenario.

Sam: But race conditions are notoriously hard to test reliably.

Alex: They are. That's why you need to be disciplined about it. Create a test that reliably reproduces the race condition, then verify that the test fails before the fix and passes after. The agent can actually help write these tests, especially if you give it the reproduction script and the fix. It can generate test cases that exercise the same code path.

Sam: I'm thinking about the real-world friction point: what if the agent proposes a fix that passes all the tests but still has problems in production?

Alex: Then your test suite was insufficient. And that's valuable information. That's when you circle back: what were we missing? Was it a subtle race condition under different concurrency? A resource constraint? A timing issue that only manifests at scale? You use the real production failure as feedback to improve your tests.

Sam: So the debugging cycle doesn't end with "the tests pass."

Alex: It ends with "we've observed stable behavior in production under the actual load that previously caused the failure." That's the evidence. Tests passing is necessary but not sufficient. The agent, properly guided, will help you build that evidence. But you have to insist on it.

Sam: What about the time investment here? It sounds like you're building fairly sophisticated debugging infrastructure just to solve one bug.

Alex: In the short term, yes. But here's the thing: that infrastructure becomes reusable. The reproduction environment you build for one bug, you can use for the next production incident. The inspection scripts you write once, you run again. The monitoring gaps you discover, you instrument against. So there's an upfront cost that compounds into a payoff.

Sam: And the alternative is what—firefighting every incident with no systematic approach?

Alex: Exactly. Most teams oscillate between "we'll just do quick fixes" and "we have no idea why this keeps happening." The systematic approach takes more time upfront but it creates repeatability. You stop being surprised by the same class of bugs. You stop spending six hours chasing ghosts.

Sam: Let me ask a practical question: in the hands-on exercise around the memory leak, you're setting up load tests that run for 8 hours. Are you actually expecting an engineer to sit and watch that?

Alex: No. The agent runs it. That's the beauty of it. You give the agent a reproduction environment, a load test script, and instructions to monitor memory over an 8-hour window. The agent sets it up, monitors the results, compares before and after profiles. Meanwhile, you're working on other things. The agent is your tireless investigator.

Sam: But there's still a question of confidence. If the agent says "memory is stable over 8 hours," how do I validate that claim?

Alex: You spot-check the evidence. You look at the graphs it generates. You review its analysis of the heap dumps. You don't have to be a hero and verify every detail, but you do spot-check the major claims. And if you don't trust the results, you run the test yourself. The verification step is non-negotiable, but it doesn't have to be exhausting.

Sam: I think the mental model shift here is the important part. The agent isn't a debugger replacing human judgment. It's a tool that augments systematic investigation.

Alex: That's exactly right. And once you internalize that, you stop asking the agent to guess and you start building systems where the agent can observe, test, and provide evidence. That's where debugging with AI becomes genuinely powerful.

Sam: So the checklist at the end really is the heart of it: can you reproduce it, does the agent have the data it needs, is the fix verified, is there a regression test, are there monitoring gaps?

Alex: That's the whole discipline right there. Master that checklist and you stop having mystery bugs. You stop shipping untested fixes. You stop wondering if something worked or just seemed to work. That's the difference between guesswork and engineering.

Sam: One last question: what about the learning curve for your team? This requires engineers to think differently about debugging.

Alex: It does. And that's the hard part. Most engineers learn debugging by trial and error, by intuition. This is more methodical. It requires documentation, scripting, discipline. But the payoff is that junior engineers can actually debug production issues systematically. They follow the process, give the agent the right data, let it work. They don't need 15 years of experience to root-cause a production bug.

Sam: So it's actually a way to level-up the whole team.

Alex: It is. And for senior engineers, it's a way to stop spending weekends on production incidents. You build the infrastructure once, you follow the process, and the next time something breaks, you're not starting from scratch.

Sam: That's a pretty compelling argument for the upfront investment.

Alex: It really is. And here's the thing—you're probably going to debug issues anyway. The question is whether you do it systematically or whether you chase your tail. The cost is about the same in terms of time. The difference is in the outcomes.
