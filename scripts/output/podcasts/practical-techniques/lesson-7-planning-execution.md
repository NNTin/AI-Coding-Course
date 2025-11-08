---
source: practical-techniques/lesson-7-planning-execution.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T09:22:30.654Z
model: claude-haiku-4.5
tokenCount: 3323
---

Alex: We've covered how agents retrieve context from your codebase and the web in the previous lesson. Now we're shifting from gathering context to actively using it during planning and execution. And this is where things get tactical—how you interact with the agent, how you review its plan before it runs, and how you set up workflows to work on multiple features in parallel.

Sam: So we're moving from "the agent can find information" to "the agent actually uses it correctly"?

Alex: Exactly. Grounding isn't a one-time thing at the start. It's continuous. You load context, review the plan, let it execute, then validate. When something doesn't match your mental model, you stop and clarify. When the agent proposes duplication, you enforce DRY. This is what turns agents from code generators into reliable machines.

Sam: That makes sense. So what does active grounding actually look like in practice?

Alex: Let's start with the most important principle: show agents actual patterns from your codebase, not generic documentation. I'll give you a concrete example. Say you need to add rate limiting to your API. The naive approach is to prompt "Add rate limiting middleware." But that's abstract. Instead, you ground it: "Search for existing middleware patterns, especially authentication. Check our Redis configuration. Then propose rate limiting that follows the same error handling, export structure, and Redis client usage you found."

Sam: So instead of asking the agent to invent something generic, you're forcing it to discover what you already have.

Alex: Right. The agent will grep for middleware files, read your Redis config, analyze your patterns, and propose an implementation that matches your conventions. Concrete beats abstract every time. This is where most people fail—they give agents abstract requirements and wonder why the output doesn't fit their codebase.

Sam: I see. What about when the agent needs to understand something before building? Like, I want to add a feature but I need the agent to first understand how authentication works in my system.

Alex: You use questions as a context engineering tool. When you ask "How does our authentication middleware work?", you're not testing the agent's knowledge. You're triggering a sequence that loads context into the window for subsequent steps. The agent will search for auth-related files, read middleware implementations, analyze patterns, and synthesize what it finds. That synthesis now lives in the context window.

Sam: And then when I ask it to build something new, it already has all that context without needing to search again?

Alex: Exactly. When you follow up with "Add rate limiting following the same pattern," the agent has middleware structure, error handling conventions, export patterns, and dependency usage already loaded. It doesn't need to search again—the knowledge is present. Questions are a way to deliberately prime the agent's working memory before asking for implementation. This is more efficient than packing everything into one massive prompt and more reliable than hoping the agent searches for the right things.

Sam: That's clever. But what stops the agent from just guessing or hallucinating about what the pattern is?

Alex: This brings us to the second critical technique: require evidence. When you explicitly require evidence—file paths, line numbers, actual values—the agent cannot provide that without retrieving it. This converts what might be a hallucinated response into something grounded in your actual codebase. The agent cannot fake file paths.

Sam: So if you ask about authentication and require evidence, it has to actually show you where in the code that pattern lives?

Alex: Yes. Without evidence requirement, the agent might respond with something like "Probably a database timeout or null pointer exception in the authentication logic." That's pattern completion from training data, not analysis of your actual code. But with evidence requirement, it has to read the endpoint implementation, trace execution, and cite specifics. It might say: "The error occurs in src/api/auth.ts:67 where user.profile.email is accessed. The profile object is null for OAuth users—see src/services/oauth.ts:134 where profile creation is skipped for federated auth. Stack trace shows: TypeError: Cannot read property 'email' of null."

Sam: That's concrete. What counts as good evidence?

Alex: File paths with line numbers—src/auth/jwt.ts:45-67, not "the auth file." Actual values from configs or logs—port 8080, not "a port number." Specific identifiers—the validateJWT() function, not "the validation function." And exact error messages—full stack traces or log entries, not "an error occurred." The point is: evidence is verifiable.

Sam: What if I'm asking the agent to do something complex—like debug a multi-step flow?

Alex: Combine evidence requirements with step-by-step instructions. Chain-of-Thought gives you execution control, while evidence requirements force grounding at every stage. So you might prompt: "Trace the request flow from entry point to failure. At each step, show: the function name and line number, the value of key variables from logs, and the decision being made. Then explain why the failure happened based on this evidence."

Sam: I like that. It prevents the agent from hand-waving through a complex problem. What about when the agent's logic just doesn't make sense?

Alex: Use your engineering judgment to challenge it. LLMs are bad at logic—they complete patterns based on statistical likelihood, not sound reasoning. Your skills are still required. When something doesn't fit your mental model, point it out. Agent says "The config uses port 3000" but your logs show connections on 8080? Challenge it: "You said port 3000, but logs show 8080. Explain this discrepancy with evidence from the config files and environment setup."

Sam: So I'm not just trusting the agent?

Alex: No. The agent handles syntax and boilerplate well. But reasoning? That's on you. When logic doesn't hold, make the agent justify with evidence. This is where your experience becomes the gating factor.

Sam: Okay, so we've grounded the agent with actual code patterns, loaded context with questions, required evidence, and validated logic. Now what?

Alex: Before the agent executes autonomously, you review the plan. This is where you catch architectural mismatches, missing considerations, and logic errors—before they become code. You're asking: How did the agent derive this plan? Was grounding thorough? Did it read relevant files? Did it miss important considerations like security, performance, backwards compatibility, or edge cases?

Sam: What am I actually looking at during plan review? The generated code?

Alex: No—not yet. You're reviewing the strategy and reasoning. If the agent says "Implement feature X using approach Y," ask yourself: Did it ground this decision in your codebase? Did it consider alternatives? Does the reasoning hold up? For example, the agent might propose caching user sessions in Redis with a 24-hour TTL. That sounds reasonable, but did it check your existing session implementation? Did it consider GDPR compliance for session data? Did it account for cache invalidation when users change passwords?

Sam: So if the plan looks shallow, I stop and add more context?

Alex: Yes. You validate the plan against what you know about your system. You're also checking architectural fit—does this match our patterns? Are changes in the right modules? Is the agent trying to refactor half the codebase when you asked for a targeted fix? These are high-level checks, not line-by-line code review. You're ensuring the agent is grounded in your actual architecture.

Sam: Give me an example of a grounding failure at the planning stage.

Alex: Agent plans to add email validation by creating a new validation library in src/lib/validators/. But you already have Zod schemas in src/validation/. That's a grounding failure—the agent generated a plausible solution from training patterns instead of discovering your existing validation approach. You catch it during planning and correct it before any code is written.

Sam: That's much faster than rewriting code after it's generated.

Alex: Exactly. There's another pattern to watch for during plan review: agents inventing instead of reusing. Research shows AI-generated code contains eight times more duplicated blocks than human-written code. Agents default to generating code from training patterns rather than discovering what exists in your codebase. Red flags during plan review: "Create a new utility function for..." Did it search for existing utilities? "Implement a helper to handle..." Does that helper already exist? "Build error handling logic..." What about existing error patterns?

Sam: So I need to actively call out these phrases when I see them?

Alex: Yes. When the agent defaults to invention, force discovery first. Make it search for existing utilities, helpers, and patterns before proposing anything new. This is the fastest way to reduce technical debt—stop duplicating code at the planning stage.

Sam: Once the plan is reviewed and solid, what happens?

Alex: The agent executes autonomously. For complex features, you can accelerate things significantly by running multiple agent instances in parallel on different tasks. This requires some setup though. Git worktrees are the foundation—they allow multiple working directories from a single repository, each with a different branch checked out. So you can have agent-1 working on feature A, agent-2 on feature B, and agent-3 on feature C, all simultaneously without conflicts.

Sam: How does that work technically?

Alex: You create worktrees with commands like `git worktree add ../feature-a feature-a-branch` and `git worktree add ../feature-b feature-b-branch`. Each worktree is a separate directory with its own checked-out branch. The agents work in isolation, push independently, and you merge when ready. Zero interference.

Sam: That's powerful, but managing three agents, three branches, three directories—that gets chaotic fast.

Alex: It does. This is where terminal customization becomes critical infrastructure, not just a nice-to-have. Multi-agent workflows mean managing concurrent sessions, context-switching between instances, and monitoring long-running processes. Your terminal becomes mission-critical. Modern terminals offer IDE-level features—GPU acceleration, programmable layouts, rich scripting, notification systems. Options like Ghostty, Kitty, WezTerm, and Alacritty all offer different customization approaches worth exploring.

Sam: What should I be setting up?

Alex: Session management, keybindings for rapid context switching, notification configuration for when agents finish long-running tasks, and visual indicators for different agent contexts. These seem like polish, but they're actually efficiency multipliers when you're juggling three parallel workflows.

Sam: Beyond the terminal itself, are there tools that help?

Alex: Modern CLI tools reduce friction across worktrees. Eza is a modern ls replacement with better formatting and git integration—easier to scan directories. Fzf is a fuzzy finder for files and git branches—quickly locate what you need across large codebases. Lazygit is a terminal UI for git with visual branch management and interactive staging—especially useful managing multiple worktrees. Micro is a terminal text editor with intuitive keybindings—Ctrl+S to save, Ctrl+Q to quit. These reduce friction when jumping between agent instances.

Sam: Should I use these instead of my IDE?

Alex: Mix them pragmatically. Use your IDE for code navigation, symbol search, and viewing large files—IDEs are superior at these. Use CLI for quick edits in agent context, git operations across worktrees, and rapid file location. Don't be dogmatic. Pragmatism beats purism—choose the best tool for each task.

Sam: Can the agent itself help me set up these workflows?

Alex: Yes. Ground the agent first with ArguSeek for external tools, then ask it to generate commands or explain usage. Tell it: "I want to set up a workflow with three git worktrees for parallel feature development. Generate the directory layout and git worktree commands." The agent will research worktree best practices, propose a clean structure, and give you exact commands. Much faster than reading documentation.

Sam: So we've covered active grounding, planning review, parallel execution setup. What's the core principle connecting all of this?

Alex: Grounding is continuous, not one-time. You load context through questions, review the plan before execution, validate that the agent discovered patterns instead of inventing them, and set up infrastructure to scale the workflow. The agent handles syntax and pattern matching. You handle reasoning, architectural decisions, and ensuring the agent stays anchored to your actual codebase, not training data patterns.

Sam: And the payoff is reliable, production-quality code at scale?

Alex: Yes. When grounding is active, planning is reviewed, and execution is parallel, agents become force multipliers. You're working on multiple features simultaneously while the agents execute reliably within your constraints.
