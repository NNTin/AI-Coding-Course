---
source: practical-techniques/lesson-10-debugging.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T08:46:28.642Z
model: claude-opus-4.5
tokenCount: 2646
---

Alex: Today we're tackling debugging with AI agents, and I want to start with what I consider the most important mindset shift: never accept a fix without reproducible proof it works.

Sam: That sounds obvious, but I've definitely fallen into the trap of describing symptoms and hoping the AI just figures it out.

Alex: Exactly. And that's the anti-pattern. You describe a bug, ask the agent to fix it blindly, and maybe it proposes something that looks plausible. But "looks plausible" isn't the same as "actually works." The production pattern is fundamentally different: provide reproduction steps, give the agent access to diagnostic tools, and require before-and-after evidence.

Sam: So it's moving from "what do you think is wrong?" to "prove the bug exists, then prove your fix works."

Alex: Right. AI agents excel at pattern recognition and systematic investigation when they have concrete data. They fail spectacularly when forced to speculate. That's the key distinction.

Sam: Where do you actually start when you have a bug? Diving straight into logs?

Alex: No, code inspection first. Before you touch logs or reproduction, have the agent explain the architecture and execution flow. Use conversational analysis to identify mismatches between your mental model and actual system behavior.

Sam: So you're asking the agent to trace request paths, explain data flow, find potential failure points based on code structure.

Alex: Exactly. And this isn't about having the agent read every line. Use semantic code search—tools like ChunkHound for larger codebases, or agentic Grep and Read for smaller ones. Find the relevant components, then focus the conversation on critical paths. Something like: "Trace the authentication flow from API request to database query. Where could a race condition occur?" The agent's explanation often reveals edge cases or assumptions you missed entirely.

Sam: That makes sense. Get the architecture clear before you start hypothesizing. What about logs? That's where I spend most of my debugging time.

Alex: Log analysis is genuinely AI's superpower. Think about what senior engineers struggle with: multi-line stack traces scattered across thousands of entries, inconsistent formats from different services, raw debug output without structured fields. That chaos is exactly where AI has the biggest advantage.

Sam: Because it can process volumes we just can't handle manually.

Alex: Right. What takes senior engineers days of manual correlation happens in minutes. AI spots patterns across log formats—cascading errors in microservices with different logging styles, timing patterns indicating race conditions buried in verbose output, specific user cohorts experiencing failures across fragmented logs. The messier the logs, the more AI's pattern recognition outpaces human capability.

Sam: How do you actually give the agent access to logs? Does it need structured JSON with correlation IDs?

Alex: That's the thing—it doesn't. Give agents access however works: paste grep output, pipe script output, upload raw log files, give it direct CLI access to log aggregators. AI parses whatever you have. Structured logs with consistent timestamps, request IDs, and JSON formatting are good engineering practice and make both human and AI analysis easier. But don't wait for perfect logging infrastructure. AI's strength is working with what you already have.

Sam: What about adding diagnostic logging during an investigation?

Alex: This is where the economics transform. When you control logging, add targeted diagnostic statements preemptively. Fifteen minutes writing specific log output beats hours of speculation. The agent can guide what to log based on its hypothesis, then analyze the new output immediately.

Sam: But adding lots of debug logging has always felt tedious. Add logs, analyze, remove logs, clean up the mess.

Alex: That's exactly the shift. AI makes it trivial to add diagnostic logs at dozens of strategic points—far more volume than humans would ever instrument manually—because the agent generates and places them in minutes. Once the bug is verified fixed, the same agent systematically removes all temporary diagnostic statements, restoring code hygiene. What would be prohibitively tedious for humans becomes routine. Debugging shifts from "minimal instrumentation" to "evidence-rich exploration."

Sam: When do you move beyond logs to actual reproduction scripts?

Alex: When code inspection and log analysis aren't sufficient—when you need bulletproof evidence or must reproduce complex state and timing conditions. This is where AI agents' code generation capabilities really shine. Environments that take humans hours to set up—Kubernetes configs, Docker configs, database snapshots, mock services, state initialization—take AI minutes to generate.

Sam: So you're trading human setup time for agent generation time.

Alex: Exactly. Reproduction scripts eliminate ambiguity and create verifiable test cases. They capture full context: database state, external API responses, configuration, user inputs. Ask the agent to simulate the exact conditions where the bug occurs, and it produces the scaffolding on demand. For complex systems, use Docker to create isolated reproduction environments. Snapshot production database state, configure services with production-like settings, write a script that triggers the bug reliably. Once you have reliable reproduction, the agent can iterate on fixes and verify each attempt.

Sam: This sounds like what you'd call "closed-loop" debugging?

Alex: Exactly. Here's the critical distinction. With good grounding—the techniques from Lesson 5—agents can always explore your codebase and research online issues. But closing the loop means the agent can test its fixes and verify its reasoning actually works. Without environment access, the agent proposes solutions it can't validate. With closed-loop access, it applies fixes, re-runs reproduction, and proves they work—or iterates on new hypotheses when they don't.

Sam: Can you give me a concrete example of the difference?

Alex: An open-loop agent researches your code and online issues, then reports: "The bug is likely missing RS256 signature verification at jwt.ts line 67—try adding algorithm validation." A closed-loop agent does the same research, then applies that fix, re-runs the failing request, observes it now returns 401 correctly, and reports: "Fixed and verified—RS256 validation added at jwt.ts line 67, reproduction now passes."

Sam: That's a massive difference. One is a suggestion, the other is proof.

Alex: Right. The closed-loop workflow has five steps: Build, Reproduce, Place, Investigate, Verify. First, build a reproducible environment—Docker, scripts, database snapshots—that reliably triggers the bug. Second, reproduce and verify the bug manifests consistently with concrete evidence: logs, status codes, error output. Third, place the agent with tool access within the environment—not just code access, but runtime execution capabilities.

Sam: This is where CLI agents have an advantage over IDE assistants, right?

Alex: Exactly. CLI agents like Claude Code, Codex, or Copilot CLI can run anywhere you have shell access: inside Docker containers, on remote servers, in CI/CD pipelines, on problematic production instances. IDE agents are tied to your local development machine. If the bug only manifests in a specific environment, CLI agents can go there.

Sam: What about the investigate step?

Alex: The agent leverages grounding techniques to form hypotheses by correlating three things: runtime behavior—executing diagnostic commands, inspecting responses, analyzing logs; the codebase—using ChunkHound's code research for comprehensive investigation with architectural context, or agentic search for smaller codebases; and known issues—researching error patterns, CVEs, similar bugs using tools like ArguSeek.

Sam: And verify closes the loop.

Alex: The agent applies the fix, re-runs reproduction, and confirms the bug is resolved—or forms a new hypothesis and iterates. This transforms debugging from "research and guess" to "research, fix, test, and prove." A closed feedback loop where the environment validates or refutes the agent's reasoning.

Sam: What about when you can't access the failing environment at all? Customer deployments, edge infrastructure, locked-down production?

Alex: Remote diagnosis. You face limited information and no iteration cycle. This is where AI agents' probabilistic reasoning becomes a feature, not a limitation. Combined with code generation, agents turn remote diagnosis from "send me logs and wait" into an active investigation workflow.

Sam: How does that work in practice?

Alex: Follow the research-first pattern. Ground yourself in the codebase—understand the architecture around the failing component using code research. Ground yourself in known issues—search for similar problems in the ecosystem. With this context, the agent generates ranked hypotheses based on evidence, not generic patterns. Then it produces targeted diagnostic scripts that collect evidence for each hypothesis: configuration states, version mismatches, timing data, whatever's needed to validate or refute each theory.

Sam: So you're trading developer time for compute time.

Alex: Exactly. Writing a comprehensive diagnostic script takes humans days but takes agents 30 minutes. More importantly, agents generate thorough diagnostics trivially—scripts that check dozens of potential issues, cross-reference configuration, and output structured data. Send the script to the customer, load the output into the agent's context, and it correlates evidence with hypotheses to identify root cause.

Sam: Let me see if I can summarize the key principles here. Evidence over speculation—never accept fixes without reproducible proof. Code inspection first to understand architecture before diving into fixes. Log analysis is AI's superpower for processing volumes humans can't handle. Code is cheap, so write reproduction scripts and diagnostics liberally. Closed-loop debugging with the Build, Reproduce, Place, Investigate, Verify workflow. CLI agents can access any environment, unlike IDE assistants. And for remote diagnosis, generate comprehensive diagnostic scripts when direct access isn't possible.

Alex: That's exactly right. Debugging with AI agents is fundamentally about building diagnostic environments where evidence is abundant and verification is systematic. The agent is your tireless investigator—give it the tools and demand proof.
