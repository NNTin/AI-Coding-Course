---
source: practical-techniques/lesson-7-planning-execution.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T14:25:55.132Z
model: claude-haiku-4.5
tokenCount: 2641
---

Alex: This lesson marks a shift from gathering context to actually using it. You've learned how to find information—through RAG, semantic search, grounding your prompts. Now we're talking about what happens when the agent is planning your work and executing it. And this is where your engineering judgment becomes critical, because agents are good at pattern completion, but not at logic.

Sam: So we're moving from "how do I get the agent to understand my codebase" to "how do I trust it to make architectural decisions"?

Alex: Exactly. And you shouldn't trust it blindly. But when you set up your workflow correctly, trust becomes much more rational. The core idea is that grounding isn't a one-time activity. You load context, review the plan, let it execute, validate the output. If something doesn't match your mental model, you stop and clarify. That continuous cycle is what transforms agents from code generators into reliable systems.

Sam: Let's start with that grounding piece. You're saying grounding needs to happen throughout, not just at the beginning?

Alex: Right. Think of it this way: when you ask an agent to add rate limiting to your API, don't prompt "Add rate limiting middleware." Instead, ask it to search for your existing middleware patterns, check your Redis configuration, then propose rate limiting that matches your established conventions. The agent will grep for middleware files, read your actual Redis setup, analyze your patterns, and propose code that fits. Concrete always beats abstract.

Sam: So I'm directing the search itself, not just asking for the outcome.

Alex: Precisely. And this matters because agents default to generating plausible solutions from training data instead of discovering what you actually have. They'll invent a middleware pattern that looks reasonable from statistical patterns they've seen, rather than finding your existing auth middleware and following that exact structure.

Sam: How do you force that discovery? Just by asking explicitly?

Alex: Two techniques work well. First, use questions strategically. When you ask "How does our authentication middleware work?", you're not testing the agent's knowledge—you're triggering a search sequence that reads your actual auth code and loads it into context. That synthesis now lives in the context window for subsequent steps. When you follow up with "Add rate limiting following the same pattern," the agent already has middleware structure, error handling, exports, and Redis usage loaded. It doesn't need to search again—you've primed its working memory.

Sam: So questions are a context engineering tool.

Alex: Exactly. You're deliberately loading information before the actual implementation task. It's more efficient than packing one massive prompt, and more reliable than hoping the agent searches for the right things autonomously. Questions are read-only operations, so they're safe to run autonomously—you can set required approval mode and let it search, knowing it won't change anything.

Sam: And the second technique?

Alex: Require evidence. When you explicitly ask for evidence—file paths, line numbers, actual values—the agent can't provide that without reading your code. It forces grounding. Without evidence requirement, you get pattern completion: "The error is probably a database timeout or null pointer." That's training data speaking, not analysis. With evidence requirement, the agent must cite specifics: "The error occurs in src/api/auth.ts:67 where user.profile.email is accessed. The profile object is null for OAuth users because of src/services/oauth.ts:134—federated auth skips profile creation."

Sam: What counts as good evidence?

Alex: File paths with line numbers, not "the auth file." Actual values from configs or logs, not "a port number." Specific identifiers like validateJWT(), not "the validation function." Full stack traces, not "an error occurred." And you can combine evidence requirements with step-by-step instructions for complex debugging—Chain-of-Thought controls your execution path while evidence keeps every step grounded.

Sam: This assumes the agent might hallucinate or make things up.

Alex: It does, and it should. LLMs complete patterns based on statistical likelihood, not sound reasoning. Your engineering skills validate the logic. When something doesn't fit your mental model—the agent says port 3000 but your logs show 8080—challenge it. Make it explain the discrepancy with evidence. That forces re-examination instead of pattern completion.

Sam: Alright, so you've grounded the context and you have good evidence. Now the agent proposes a plan. What do you check?

Alex: Review the strategy and reasoning, not just the output. How did it derive this plan? Did grounding happen thoroughly? Did it miss security considerations, performance implications, backwards compatibility, edge cases? You're validating the "why," not just the "what." If the plan reveals shallow grounding—the agent proposes caching sessions in Redis with a 24-hour TTL but didn't check your existing session implementation or GDPR compliance—stop there. Don't let it execute. Add constraints and force deeper research first.

Sam: What does shallow grounding actually look like in a plan?

Alex: Watch for phrases like "Create a new utility function for" or "Implement a helper to handle" or "Build error handling logic." Those signal the agent is inventing rather than discovering. You already have utilities, existing helpers, established error patterns. Red flag every time you hear "new" when you should be reusing. The agent will generate plausible code that looks right based on millions of training examples, but it's not architecture-grounded in your codebase.

Sam: And this is actually measurable. Didn't you mention research showing this bias?

Alex: Yeah. Analysis of 211 million lines of code shows AI-generated code contains eight times more duplicated code blocks than human-written code. Not because AI is bad at deduplication, but because invention is statistically easier than discovery. The training data has more examples of "write a validator" than "find the existing validator and extend it." So agents default to generation.

Sam: So the plan review is where you enforce DRY.

Alex: Exactly. Catch invention during plan review, fix the grounding, then execute. Rewriting generated code afterward is slower than preventing the duplication upfront.

Sam: Once the plan is solid, you execute. And you mentioned parallel execution is important?

Alex: For complex features, running multiple agents on different tasks simultaneously is a game changer. But that requires proper isolation. You can't have multiple agents checking out the same branch and stepping on each other. That's where git worktrees come in. They let you have multiple working directories from a single repository, each with a different branch checked out.

Sam: So you set up worktrees for different features, and each agent operates independently?

Alex: Right. One worktree for feature A, one for feature B, one for feature C. No branch conflicts, no merge chaos mid-execution. You can have three agents running simultaneously on three different features, each with its own isolated context.

Sam: That's powerful, but it sounds like you need a specific terminal setup to manage that effectively.

Alex: You absolutely do. Multi-agent workflows mean managing multiple concurrent sessions, context-switching between agent instances, monitoring long-running processes. Your terminal becomes mission-critical infrastructure. Modern terminals like Ghostty, Kitty, WezTerm offer GPU acceleration, programmable layouts, rich scripting. Invest time configuring your terminal the same way you configure your IDE. It pays back immediately.

Sam: What else improves the workflow?

Alex: Modern CLI tools. Micro for quick edits without switching to your IDE. Eza for better directory listing with git integration. Fzf for fuzzy finding files and commands. Lazygit for visual git branch management across worktrees. These reduce friction when you're working across multiple agent sessions and worktrees.

Sam: This feels like infrastructure optimization, not AI-specific.

Alex: It's both. These tools aren't new—they've existed for years—but most engineers don't use them consistently. Multi-agent workflows force you to be efficient with context switching. That's when terminal customization stops being optional and becomes foundational.

Sam: You can also ask agents to help with CLI operations?

Alex: Yeah. If you're unfamiliar with worktree workflows, ground the agent first with research—ask it to read documentation on git worktrees using ArguSeek—then ask it to generate the exact commands for your specific project structure. You get clean commands that match your context without reading documentation manually.

Sam: But don't become dogmatic about terminal-only workflows?

Alex: No. IDEs are still better for code navigation, symbol search, viewing large files. CLI excels at quick edits and git operations. Use the best tool for each task. Code exploration happens in your IDE. One-line edits in agent context happen in micro. Git operations across worktrees happen in lazygit. Pragmatism beats ideology.

Sam: So we've covered grounding, plan review, parallel execution with worktrees. What ties this together conceptually?

Alex: Continuous grounding. You're not grinding through a task once and hoping it works. You're cycling: load context, review the plan, execute, validate. If something doesn't fit your mental model, you stop and clarify. Questions load context without changing anything, evidence forces grounding, plan review catches architectural mismatches before they become code. And then parallel execution with proper isolation lets you scale this across multiple tasks simultaneously.

Sam: It sounds like the agent is doing more work, but you're doing more validation.

Alex: Exactly right. You're trading less time spent on boilerplate and syntax for more time spent on architectural decisions and validation. That's the trade-off that makes agents useful to senior engineers. Juniors might not have the mental models to validate logic. You do. Use that advantage.

Sam: The key takeaway is that grounding is continuous, not a setup step.

Alex: Right. Grounding, planning, execution, validation. That cycle is where agents become reliable. And when you have that cycle optimized across multiple worktrees with parallel agents, that's when you start seeing genuine productivity gains.
