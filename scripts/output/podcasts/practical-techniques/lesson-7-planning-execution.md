---
source: practical-techniques/lesson-7-planning-execution.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-07T19:20:22.115Z
model: claude-opus-4.5
tokenCount: 2745
---

Alex: Today we're bridging the gap between context gathering and actual execution. Last time we covered grounding—RAG, semantic search, getting context into the agent. Now the question becomes: how do you actively manage that context while the agent is working? How do you review plans before letting it loose? And how do you set up workflows for parallel development?

Sam: Right, because grounding isn't just something you do upfront and forget about. It's continuous throughout the session.

Alex: Exactly. You load context, review the plan, let it execute, validate. When something doesn't match your mental model, you stop and clarify. When the agent proposes duplication, you enforce DRY. It's a cycle, not a one-shot operation.

Sam: Let's start with the active grounding techniques. What's the most common mistake you see?

Alex: Prompting with abstract descriptions instead of pointing at actual code. If you need rate limiting, don't just say "add rate limiting middleware." Instead, tell the agent: "Search for existing middleware patterns, especially authentication. Check our Redis configuration. Then propose rate limiting that follows the same error handling, export structure, and Redis client usage you found."

Sam: So you're forcing it to discover your patterns first.

Alex: Yes. The agent will grep for middleware files, read your Redis config, analyze your patterns—and then propose something that actually matches your conventions. Concrete beats abstract every time.

Sam: There's a technique here about using questions strategically. Can you walk through that?

Alex: When you ask "How does X work?", you're not testing the agent's knowledge. You're triggering a sequence that loads context into the window. When I ask "Explain how our authentication middleware works," the agent searches for auth files, reads implementations, analyzes patterns, synthesizes findings. That synthesis now lives in the context window.

Sam: So when you follow up with "Add rate limiting following the same pattern"—

Alex: The agent already has middleware structure, error handling conventions, export patterns, dependency usage—all loaded. It doesn't need to search again. The relevant knowledge is present. Questions are a context engineering tool. You're priming the agent's working memory before asking for implementation.

Sam: And questions are safe for autonomous execution since they're read-only.

Alex: Right. If the explanation is wrong or incomplete, you just ignore it, refine your prompt, try again. A well-crafted sequence of exploratory questions makes subsequent coding tasks much more reliable because the context window is already grounded in your actual codebase.

Sam: What about when the agent just... makes things up? I've had agents give me plausible-sounding answers that were completely wrong.

Alex: This is where evidence requirements become critical. When you explicitly require evidence—file paths, line numbers, actual values—the agent cannot provide that evidence without retrieving it. You're converting what might be a hallucinated response into a grounded one.

Sam: Give me a concrete example.

Alex: Say you're debugging an API endpoint. Without an evidence requirement, you ask what's causing the error. Agent responds: "Probably a database timeout or null pointer exception in the authentication logic." That's pattern completion from training data, not analysis.

Sam: It sounds plausible but it's just guessing.

Alex: Now add the evidence requirement: "What causes this error? Provide file paths, line numbers, the actual error message." The agent must read the endpoint implementation, trace execution, cite specifics. Now you get: "The error occurs in src/api/auth.ts:67 where user.profile.email is accessed. The profile object is null for OAuth users—see src/services/oauth.ts:134 where profile creation is skipped for federated auth."

Sam: Night and day. What counts as good evidence?

Alex: File paths with line numbers—src/auth/jwt.ts:45-67, not "the auth file." Actual values from configs or logs—port 8080, not "a port number." Specific identifiers—validateJWT() function, not "the validation function." Exact error messages with full stack traces.

Sam: Can you combine this with chain-of-thought prompting?

Alex: Absolutely. For complex debugging, use both. Chain-of-thought controls the execution path while evidence requirements ensure each step is grounded. You might say: "Step 1: Trace the request through middleware and cite file paths. Step 2: Identify where the error occurs with line numbers. Step 3: Explain what state causes this with evidence from logs or config."

Sam: Execution control plus grounding at every stage.

Alex: Right. And here's the thing—LLMs are fundamentally bad at logic. They complete patterns based on statistical likelihood, not sound reasoning. Your engineering skills are still required to catch inconsistencies.

Sam: So when something doesn't fit my mental model...

Alex: Challenge it. If the agent says "the config uses port 3000" but your logs show connections on 8080, you say: "You said port 3000, but logs show 8080. Explain this discrepancy with evidence from the config files and environment setup." This forces re-examination, more careful searching, grounding in actual data.

Sam: Let's talk about plan review. Before letting the agent execute autonomously, what should I be looking for?

Alex: Strategy and reasoning, not just the output. Key questions: How did the agent derive this plan? Was grounding thorough—did it read relevant files, check documentation, understand constraints? Did it miss important considerations—security, performance, backwards compatibility, edge cases?

Sam: Review the "why" behind the plan.

Alex: Exactly. Say the agent proposes caching user sessions in Redis with 24-hour TTL. Good plan on the surface. But did it check your existing session implementation? Consider GDPR compliance for session data? Account for cache invalidation when users change passwords? If grounding was shallow, stop and add context before execution.

Sam: What about the changes themselves? How deep should that review go?

Alex: This is high-level architectural fit, not line-by-line code review—validation comes later. You're checking: Does this fit our established patterns? Are changes in the right modules? Is the scope appropriate, or is the agent trying to refactor half the codebase when you asked for a targeted fix?

Sam: Pattern adherence, module boundaries, appropriate scope.

Alex: Here's a real example. Agent plans to add email validation by creating a new validation library in src/lib/validators/. But you already have Zod schemas in src/validation/. This is a grounding failure—the agent generated a plausible solution from training patterns instead of discovering your existing validation approach.

Sam: So you stop and correct.

Alex: Yes. "Don't create a new validators library. Search for existing validation in src/validation/. Use our Zod patterns. Show evidence you've read our existing schemas." Catching grounding failures at planning is much faster than rewriting generated code.

Sam: There's research on this invention-over-reuse problem, right?

Alex: AI-generated code contains eight times more duplicated blocks than human-written code. The industry is seeing declining code consolidation metrics. Agents reinvent the wheel because invention is statistically easier than discovery—pattern completion, not codebase discovery.

Sam: What are the red flags during plan review?

Alex: Watch for these phrases: "Create a new utility function for..." Did it search for existing utilities? "Implement a helper to handle..." Does this helper already exist? "Build error handling logic..." What about existing error patterns? "Add validation for..." Check for existing validation schemas first. Any time you see these, pause and force discovery before implementation.

Sam: Let's talk about checkpointing. How frequently should I be creating restore points?

Alex: Here's the reality: agents make mistakes frequently, especially while you're learning effective grounding and prompting patterns. As your skills improve, the need for rollbacks decreases dramatically. But even experienced practitioners value checkpointing as a safety net.

Sam: The difference between frustrating and productive sessions.

Alex: Exactly. Establish a checkpoint rhythm: create a restore point before risky operations, let the agent execute, validate results, then keep or revert. Modern tools like Claude Code, Cursor, VS Code Copilot have built-in checkpointing. In Claude Code, you press ESC twice to create a checkpoint—saves both conversation context and code state.

Sam: And if your tool lacks checkpointing?

Alex: Commit far more frequently than traditional development. After each successful increment, before risky operations, when changing direction, after manual corrections. Each commit represents a known-good state you can return to instantly.

Sam: Finally, parallel execution. How do git worktrees fit in?

Alex: Git worktrees let you have multiple working directories from a single repository, each with a different branch checked out. This enables running multiple agent instances on different tasks simultaneously without conflicts.

Sam: So I could have one agent working on an auth refactor while another builds a new analytics API.

Alex: Right. Basic setup is three commands: git worktree add with a path and branch. But here's where it gets interesting—you can use agents to help generate worktree commands. Ground with ArguSeek first for best practices, then ask the agent to generate commands for your specific context.

Sam: Agents helping set up parallel agent environments.

Alex: You specify what you need—authentication refactor on one branch, analytics API on another—and the agent researches worktree workflows, proposes a clean directory layout, generates the exact commands. Faster than reading documentation manually and ensures commands match your context.

Sam: The meta-level tooling for this parallel workflow seems important.

Alex: Managing multiple worktrees and agent sessions requires efficient terminal tooling. Tools like Ghostty, Kitty, or WezTerm for terminals. Lazygit, eza, fzf for navigation. Mix CLI and IDE tools pragmatically—use what's most efficient for each task.

Sam: So to summarize the key points: questions load context rather than verify knowledge, evidence requirements force grounding, LLMs complete patterns not logic so our judgment is still required—

Alex: Review plans for strategy and reasoning, watch for invention over reuse, checkpoint before execution and commit after validation, and git worktrees enable true parallelization across agent instances.

Sam: Next time we're covering tests as guardrails?

Alex: Yes. We'll look at how testing integrates with this planning and execution cycle—using tests to validate agent output and catch regressions before they compound.
