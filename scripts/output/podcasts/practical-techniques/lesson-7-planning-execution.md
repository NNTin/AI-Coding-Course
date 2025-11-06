---
source: practical-techniques/lesson-7-planning-execution.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T13:14:09.331Z
model: claude-haiku-4.5
tokenCount: 2686
---

Alex: Welcome to Lesson 7. We're shifting from gathering context to using it. By now you understand RAG and semantic search—how to load information from your codebase and the web. Today's about the execution phase: how to keep agents grounded while they work, how to review their plans before they go autonomous, and how to run multiple agents in parallel without stepping on each other's toes.

Sam: So grounding isn't just a setup step anymore—it's continuous throughout the entire execution?

Alex: Exactly. You load context, review the plan, execute, validate. When something doesn't match your mental model, you stop and clarify. When the agent proposes duplication, you enforce DRY. Grounding is the entire loop, not just the beginning.

Sam: That makes sense. Walk me through what that looks like in practice.

Alex: Start with concrete code, not abstractions. If you need rate limiting, don't prompt "Add rate limiting middleware." Instead, show the agent your actual patterns: "Search for existing middleware, especially authentication. Check our Redis config. Then propose rate limiting that follows the same error handling, export structure, and Redis usage you find."

The agent will search for middleware files, read your Redis configuration, analyze your patterns, then propose something that fits your codebase. Concrete beats abstract every time.

Sam: So you're forcing discovery instead of letting it guess from training data.

Alex: Right. And here's the thing—when you ask "How does X work?" you're not really testing the agent's knowledge. You're triggering a sequence that loads context into the window for what comes next. Ask about your authentication middleware, and the agent searches files, reads implementations, analyzes patterns, synthesizes everything. That synthesis lives in the context window now. When you follow up with "Add rate limiting following the same pattern," the agent already has middleware structure, error handling conventions, everything it needs. You're priming the working memory.

Sam: So questions are a context engineering tool, not verification.

Alex: Exactly. And here's the operational detail—those questions are safe to run autonomously. They're read-only. You can set approval mode to require human sign-off on any changes, but questions don't trigger that. If the explanation is incomplete, you just refine and ask again. There's no risk.

Sam: But what about when the agent's explanation is just wrong? Where it hallucinates something plausible?

Alex: That's where evidence requirements come in. When you explicitly require "file paths, line numbers, actual values," the agent can't provide those without retrieving them. It converts what might be a hallucinated response into something anchored in your actual code.

Without evidence, the agent might say "probably a database timeout or null pointer exception in the auth logic." That's pattern completion from training data, not analysis of your code.

With evidence, it has to trace execution and cite specifics: "The error occurs in src/api/auth.ts:67 where user.profile.email is accessed. The profile object is null for OAuth users—see src/services/oauth.ts:134 where profile creation is skipped for federated auth. Stack trace shows: Cannot read property 'email' of null."

Now it's grounded.

Sam: What counts as good evidence?

Alex: File paths with line numbers—src/auth/jwt.ts:45-67, not "the auth file." Actual values from configs—port: 8080, not "a port number." Specific identifiers—validateJWT() function, not "the validation function." Full error messages and stack traces, not "an error occurred."

You can combine evidence requirements with step-by-step instructions. For complex debugging, Chain-of-Thought controls the execution path, evidence requirements ensure each step is grounded. You get both execution control and grounding at every stage.

Sam: And you're still validating the agent's logic, right? Because LLMs complete patterns, not reason?

Alex: Correct. Your engineering skills are still required. The agent can explain the code, but you validate whether that explanation makes sense. When something doesn't fit your mental model, challenge it. Agent says "port 3000," but logs show 8080. Push back: "Explain this discrepancy with evidence from the config and environment setup."

That forces the agent to re-examine, search more carefully, ground the response in actual data instead of pattern completion. Use your mental model to validate their reasoning.

Sam: So once you've got context loaded and you're confident about the grounding, you review the plan before they execute autonomously?

Alex: Yes. This is critical. Before the agent goes autonomous, review the plan. Ask yourself: How did they derive this? Was grounding thorough? Did they read relevant files, check documentation, understand constraints?

Review the "why," not just the "what." If the agent proposes caching user sessions in Redis with 24-hour TTL—good thinking—but did they check your existing session implementation? GDPR compliance for session data? Cache invalidation when passwords change? That's the kind of thing you catch at review.

Sam: And if grounding was shallow?

Alex: Stop and add context. Force deeper research before execution. This is architectural fit validation, not line-by-line code review. You're checking: Does this match our patterns? Are changes in the right modules? Is the scope appropriate, or is the agent trying to refactor half the codebase when you asked for a targeted fix?

Watch for a specific red flag: agents inventing instead of reusing. When they plan, they default to generating plausible code from training patterns rather than discovering what already exists. This is why AI code has 8 times more duplicated blocks than human code.

In plan review, watch for phrases like "Create a new utility function for" or "Implement a helper to handle." These signal invention, not discovery. They didn't search for existing utilities. Stop and force the search first. Agent searches, finds what exists, then proposes building on top of it or refactoring intelligently. Intervention at planning stage is way faster than rewriting generated code.

Sam: Once the plan is solid, you let it execute autonomously. For complex features, I'm assuming you run multiple agents in parallel?

Alex: That's where git worktrees come in. Worktrees give you multiple working directories from a single repository, each with a different branch. Run three agent instances simultaneously on different features with zero interference. Each one has its own branch, its own working directory, isolated context.

Sam: That's a significant workflow shift from how most people work.

Alex: It is. And supporting that workflow means investing in your terminal environment. Multi-agent work means managing concurrent sessions, switching between agent contexts, monitoring long-running processes. Your terminal becomes infrastructure, not just a command prompt.

Modern terminals offer IDE-level features—GPU acceleration, programmable layouts, rich scripting. Ghostty, Kitty, WezTerm, Alacritty—each offers different tradeoffs. Pick one and configure it for your workflow. Session management, keybindings for rapid context switching, notification configuration for when agents finish.

Sam: So you're treating the terminal like you'd treat an IDE.

Alex: Exactly. And complement that with modern CLI tools. Micro for quick edits without switching IDEs. Eza for directory navigation with better formatting and git integration. Fzf for fuzzy finding files across worktrees. Lazygit for visual git management—especially useful juggling multiple worktrees.

These tools reduce friction. Install them once, benefit across every session. And don't be dogmatic about terminal-only workflows. IDEs are still better for code navigation, symbol search, viewing large files. CLI excels at quick edits, git operations, parallel session management.

Use the best tool for each task. IDE for navigation and complex logic. CLI for quick refactors and managing parallel sessions. Pragmatism beats purism.

Sam: And the agent itself can help with CLI work.

Alex: Right. If you're not familiar with a git worktree workflow, ground the agent with research first—have it search documentation on worktree best practices—then ask it to generate the exact commands for your context. That's faster than reading docs manually and ensures commands fit your setup.

Sam: Let me make sure I have the mental model right. You're thinking about execution as this continuous grounding loop. Load context through questions and search. Review the plan to catch invention and architectural mismatches. Execute autonomously once grounding is solid. Validate output. When something breaks the mental model, you stop and clarify.

Alex: That's it exactly. And for complex work, you scale by running multiple agents in parallel with worktrees. Each one executes autonomously on its own branch. You review as they complete, merge what's solid, loop back if grounding was shallow.

The shift from "let me prompt the agent once and hope it works" to "active context management throughout execution" is where agents become reliable code-producing machines instead of just code generators.

Sam: How much of that is you catching mistakes versus the grounding actually preventing mistakes in the first place?

Alex: Good question. Solid grounding prevents most mistakes. You force discovery, validate logic during planning, require evidence at every step. But mistakes still happen because LLMs fundamentally complete patterns, not reason. Your engineering judgment catches what grounding doesn't—edge cases, security considerations, logic that looks right statistically but breaks under real constraints.

The goal isn't to eliminate review entirely. It's to shift review from "Does this compile and make sense?" to "Does this handle GDPR compliance? Cache invalidation? Backwards compatibility?" The agent handles the mechanical work. You handle the reasoning.

Sam: So the pattern is: thorough grounding catches most mistakes, solid planning catches architectural ones, validation during execution catches logic errors, and code review is really architecture and constraint review.

Alex: Exactly. Each layer filters out a different category of problem. And it scales because you're not reviewing every line—you're validating decisions and catching duplication before it becomes code.

Alex: That's the operational model. Grounding is continuous. Planning is architectural review. Execution is autonomous but parallelized. Validation is constraint-focused. Together, they turn agents into reliable tools instead of code generators that need heavy revision.
