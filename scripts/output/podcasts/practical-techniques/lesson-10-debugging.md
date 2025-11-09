---
source: practical-techniques/lesson-10-debugging.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-09T13:27:19.173Z
model: claude-haiku-4.5
tokenCount: 4170
---

Alex: So we're talking about debugging with AI agents today, and I want to start with something that might sound obvious but is actually where most people go wrong. When you have a bug, your instinct is to describe the symptoms to the AI and hope it figures out what's wrong. That's the fundamental mistake.

Sam: Right, you're treating it like a rubber duck—just explaining the problem and expecting the agent to magically see what you missed?

Alex: Exactly. But AI agents aren't magic. They're pattern matchers. They excel when you give them concrete evidence and a systematic process. The core principle is simple: never accept a fix without reproducible proof it actually works. You stop speculating and start demanding evidence at every step.

Sam: So instead of "my API is returning the wrong status code, fix it," you're saying what—trace the actual request and show me the response?

Alex: Precisely. And that's actually a shift in how you interact with the agent. You're moving from "what do you think is wrong?" to "prove the bug exists, then prove your fix works." The agent becomes your investigator with a structured methodology.

Sam: That makes sense. So what's the investigation methodology? How do you actually structure this?

Alex: There are several phases. First, before you even touch logs or try to reproduce anything, understand the architecture. Have the agent explain the execution flow from request to response. This isn't about having it read every line of code—it's about tracing the critical path. Where could things actually break?

Sam: Why not just jump to the logs? Wouldn't that be faster?

Alex: Because logs are noise without context. You might see an error message, but without understanding the system architecture, you can't connect it to root cause. The agent can use code research tools to find relevant components, then you have a conversation about the flow. Often this alone reveals assumptions you made that don't match reality.

Sam: So you're essentially asking the agent to explain the system before trying to fix anything?

Alex: Yes. And this is where tools like ChunkHound shine for larger codebases. For code under 10,000 lines, simple grep and read operations work fine. But once you're in the 10,000 to 100,000 line range, you want semantic code search because you need architectural context. ChunkHound gives the agent structured multi-hop traversal—it can walk the call graph, understand module relationships, not just find matching strings.

Sam: Got it. So if you're working with a 50,000 line codebase, you'd guide the agent with ChunkHound to understand the architecture around the failing component first.

Alex: Correct. And then once you have that mental model aligned, you move to log analysis. This is where AI has a massive advantage over humans. I'm talking about those massive log files with thousands of entries, inconsistent formats across microservices, debug output scattered everywhere with no structure.

Sam: Oh man, I've spent entire days digging through logs like that.

Alex: Exactly. That's the tedious correlation work that takes senior engineers days but AI does in minutes. Multi-line stack traces from different services in different logging styles? The agent spots cascading errors you'd miss manually. Timing patterns indicating race conditions buried in verbose output? The agent finds them. User cohorts experiencing failures across fragmented logs from different systems?

Sam: So the messier the logs, the bigger the advantage AI has?

Alex: Yes. And honestly, don't wait for perfect logging infrastructure. You might have CSV output, raw grep dumps, unstructured debug text. The agent can parse whatever you have. That said, structured logs with consistent timestamps, request IDs, and JSON formatting are good engineering practice anyway—they help both humans and AI. But if you've got what you've got, use it.

Sam: What if logs aren't telling you enough? What if you need to actually see the bug happen yourself?

Alex: That's where reproduction scripts become critical. This is one of the best use cases for AI agents because code generation is cheap for them. Setting up a complete reproduction environment—K8s configs, Docker setups, database snapshots, mock services, state initialization—that takes humans hours. An AI agent generates the scaffolding in minutes.

Sam: So you're saying if I can't easily reproduce the bug in my environment, I ask the agent to write a script that sets it up?

Alex: Exactly. The agent generates Docker configurations, initialization scripts, database snapshots, whatever's needed to reliably trigger the bug. You get bulletproof evidence and a verifiable test case. The reproduction environment captures everything: database state, external API responses, configuration, exact user inputs.

Sam: That sounds great if you have access to the failing environment. But what about when you don't? What if it's a customer's production system you can't touch?

Alex: Now that's a different pattern. You can't build a reproduction environment, and you can't iterate locally. This is where the agent's probabilistic reasoning becomes a feature, not a limitation. You're trading developer time for compute time.

Sam: Meaning what, exactly?

Alex: You start the same way—ground yourself in the codebase architecture using code research. Understand the system around the failing component. Then research known issues in the ecosystem. With that context, the agent generates ranked hypotheses based on evidence, not speculation. Then it produces diagnostic scripts.

Sam: Diagnostic scripts?

Alex: Yes. The agent writes comprehensive scripts that check multiple potential issues simultaneously: configuration states, version mismatches, timing data, cross-references between settings. These scripts might take humans days to write. The agent generates them in 30 minutes and makes them thorough enough to test dozens of scenarios. You send the script to the customer, get the output back, load it into the agent's context, and the agent correlates the evidence with hypotheses.

Sam: So instead of "send me logs and wait," you're systematically testing theories?

Alex: Precisely. The agent acts as your tireless investigator when direct access isn't possible. Now, when you do have access to the failing environment—that's when things get powerful.

Sam: How so?

Alex: This is what I call closed-loop debugging. The agent doesn't just research and propose fixes. It places itself inside the failing environment where it can test hypotheses and verify fixes actually work. There's a workflow for this: BUILD, REPRODUCE, PLACE, INVESTIGATE, VERIFY.

Sam: Walk me through that.

Alex: Build first. Create a reproducible environment—Docker container, scripts, database snapshots—that reliably triggers the bug every time. Reproduce second. Run it, confirm the bug manifests with concrete evidence: logs, status codes, error output. You have proof.

Sam: Then you place the agent in the environment?

Alex: Right. You give the agent tool access within the environment. Not just code reading capabilities, but the ability to execute commands, inspect runtime state, apply fixes. This is where CLI agents like Claude Code are superior to IDE assistants. An IDE assistant is stuck on your local machine. A CLI agent works anywhere you have shell access: inside Docker containers, on remote servers, in CI/CD pipelines, even on problematic production instances if you have the access.

Sam: So the agent is actually making changes and running tests?

Alex: Yes. It investigates by running diagnostic commands, inspecting responses, analyzing logs. It uses code research to understand the codebase—and for this, codebase size matters. Under 10,000 lines, simple agentic search with grep and read is fine. 10,000 to 100,000 lines, you want ChunkHound's semantic search for architectural context. Above 100,000 lines, ChunkHound's structured multi-hop traversal becomes essential because autonomous agents start missing cross-module connections.

Sam: The agent forms hypotheses based on all this information?

Alex: Correct. It correlates runtime behavior with codebase structure and known issues. Then it applies a fix to the actual code in the environment, re-runs the reproduction scenario, and confirms the bug is resolved. If the fix works, you have proof. If it doesn't, the agent sees the failure and iterates with a new hypothesis.

Sam: That's completely different from what most people do—researching the code and suggesting changes.

Alex: It is. You're transforming debugging from "research and guess" into "research, fix, test, and prove." The environment validates or refutes the agent's reasoning in real time. This closed-loop feedback eliminates ambiguity.

Sam: What does that actually look like in practice? Say you have a JWT authentication bug.

Alex: Open-loop agent: researches your code, finds that RS256 signature verification is missing at jwt.ts:67, reports back "try adding algorithm validation." You have to decide if that's right and implement it yourself.

Sam: Right, you don't actually know if that fix works.

Alex: Exactly. Closed-loop agent: does the same research, but then applies the fix—actually adds the algorithm validation at jwt.ts:67, re-runs the failing request, observes it now returns a 401 correctly when it was returning 200 before, and reports: "Fixed and verified. RS256 validation added at jwt.ts:67. Reproduction passes."

Sam: So you have proof the fix works because the agent actually tested it.

Alex: And if the fix doesn't work, the agent doesn't leave you hanging. It observes the new behavior, forms a different hypothesis based on what happened, and tries again. The loop closes continuously until the bug is resolved or the evidence points to a different root cause.

Sam: This requires the agent to have access to the actual development environment though, right? That's not always practical or safe.

Alex: True. But think about where you can do this. Your local Docker environment? Yes. Staging infrastructure? Yes. Even specific production instances if you have controlled CLI access. The point is to close the loop wherever you safely can. When you can't—locked-down production, customer systems, edge infrastructure—you fall back to diagnostic scripts and remote diagnosis.

Sam: So the methodology adapts to what access you have.

Alex: Exactly. The principle stays the same: evidence over speculation, systematic investigation over guessing. The tools and workflow adjust based on constraints. When you have closed-loop access, use it. When you don't, generate comprehensive diagnostic scripts and correlate the output.

Sam: What about the actual investigation phase? Beyond running commands, how does the agent form hypotheses?

Alex: The agent correlates what it observes in runtime behavior with what it knows about the codebase and known issues. Maybe it observes a timing pattern in the logs that suggests a race condition. It traces the code to find the shared state and potential interleaving. Maybe it notices a version mismatch in error output and searches for CVEs or known incompatibilities in that dependency. It's triangulating evidence.

Sam: And as it gathers more evidence, the hypothesis gets more or less probable.

Alex: Right. The agent is essentially building a Bayesian understanding. "If hypothesis A were true, I'd expect to see X, Y, and Z in the logs. I see X and Y but not Z. So hypothesis A becomes less likely. Hypothesis B predicts I'd see X, Y, and W. I see X, Y, and W, so B becomes more likely."

Sam: That's actually elegant. The agent isn't just guessing—it's testing predictions.

Alex: Exactly. And when you close the loop by letting it apply fixes and test them, you get definitive proof. The hypothesis either predicts the fix works, or it doesn't. That's the power of the closed-loop workflow.

Sam: Let me ask about something practical. If I'm debugging a complex distributed system—maybe a microservices architecture with multiple databases, message queues, caching layers—how would I even structure the reproduction environment?

Alex: You'd scale it appropriately. Docker Compose is your friend. The agent can generate a docker-compose.yml that spins up all the services with production-like configurations. You can snapshot real database state from production, configure mock responses for external APIs, and write initialization scripts that put the system in the state where the bug manifests.

Sam: And the agent generates all of that?

Alex: Yes. You describe what's failing and what systems are involved. The agent generates the compose file, the database snapshot logic, the initialization scripts. You run it, and fifteen minutes later you have a complete reproduction environment on your machine. It's time spent once, but it pays dividends because then the closed-loop debugging works.

Sam: What about logging during investigation? You mentioned adding targeted diagnostic statements.

Alex: That's where the agent guides the investigation. It forms a hypothesis about what's happening, and that hypothesis tells you exactly what to log. Maybe it suspects a race condition between service A and service B. You add targeted log statements with timestamps and request IDs that make the interleaving visible. The agent analyzes the new logs and either confirms the hypothesis or points you toward a different angle.

Sam: So logging becomes a tool controlled by the agent's investigation, not just hoping you logged the right thing already.

Alex: Precisely. Fifteen minutes of targeted logging beats hours of speculation. The agent says "I need to see these three timing points to validate my hypothesis," you add those log statements, and suddenly you have the evidence you need.

Sam: This all assumes you can actually get the agent into the environment. What about security considerations? Won't there be resistance to giving an AI agent shell access?

Alex: That's a legitimate concern, and you should be thoughtful about it. But remember, the agent is operating in a controlled environment—reproduction Docker container, sandbox, staging system. You're not giving it production access unless you're confident and have controls. The benefit is that debugging time goes from days to hours because the agent can test fixes immediately.

Sam: And for completely locked-down scenarios?

Alex: You fall back on diagnostic scripts and remote diagnosis. The agent generates the scripts, you run them in the locked-down environment, and the agent analyzes the output. It's slower than closed-loop debugging, but still faster than manual investigation. The agent can write scripts that check dozens of potential issues systematically.

Sam: So even in constrained scenarios, the methodology still applies—you're just using different tools.

Alex: Right. The core principle is always the same: evidence over speculation. Build reproducible test cases. Investigate systematically. Verify fixes actually work. The specific tools and access levels adjust, but the mindset stays consistent.

Sam: I think the biggest insight here is that you're not asking the AI to magically solve problems. You're using it as a systematic investigator that can correlate evidence faster than humans can.

Alex: That's it exactly. The agent isn't magic. It's a tool that excels at processing evidence—logs, code structure, runtime behavior—and spotting patterns humans would miss. Give it clear constraints, concrete data, and verification mechanisms, and it becomes incredibly powerful.

Sam: And the closed-loop part makes that verification happen automatically as the agent tests fixes.

Alex: Exactly. You're not relying on the agent's confidence in its solution. You're relying on observed reality—the fix either works in the reproduction environment or it doesn't. The loop closes continuously until you have definitive proof.

Sam: One more question: for someone starting with this, what's the biggest thing they should change about how they debug?

Alex: Stop describing bugs and asking the agent to fix them blindly. Start by saying "here's proof the bug exists—logs, status codes, reproduction steps. Here's the environment where it happens." Then engage the agent as an investigator. Have it explain the architecture first. Use tools like ChunkHound for larger codebases to get architectural context. Build a reproduction environment so you can verify fixes actually work. Close the loop.

Sam: The shift from description to evidence.

Alex: Yes. And from hoping the fix works to proving it works. That's the fundamental change in debugging with AI agents.
