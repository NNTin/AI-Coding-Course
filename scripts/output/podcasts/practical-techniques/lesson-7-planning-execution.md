---
source: practical-techniques/lesson-7-planning-execution.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T09:09:11.841Z
model: claude-opus-4.5
tokenCount: 2359
---

Alex: We've covered how agents retrieve context through RAG and semantic search. Now let's talk about what happens after you have that context—the planning and execution phase. This is where grounding shifts from a one-time upfront activity to a continuous process.

Sam: Right, so you're saying grounding isn't just "load context, then go." It's more iterative?

Alex: Exactly. The workflow is: load context, review the agent's plan, let it execute, then validate. And critically—when something doesn't match your mental model, you stop and clarify. When the agent proposes duplicating existing functionality, you enforce DRY. It's active collaboration, not passive code generation.

Sam: Let's dig into the grounding techniques. What's the most common mistake you see engineers make here?

Alex: Grounding in documentation instead of actual code. Abstract descriptions lead to generic solutions. Here's a concrete example: say you need rate limiting for your API. The ineffective prompt is "Add rate limiting middleware." The effective approach is: "Search for existing middleware patterns, especially authentication. Check our Redis configuration. Then propose rate limiting that follows the same error handling, export structure, and Redis client usage you found."

Sam: So you're forcing the agent to discover your patterns first, then match them.

Alex: Precisely. The agent will grep for middleware files, read your Redis config, analyze your conventions, and propose something that actually fits. Concrete always beats abstract.

Sam: There's an interesting technique you mentioned about using questions to load context. Can you explain that mechanism?

Alex: This is one of the most powerful techniques that's often misunderstood. When you ask "How does our authentication middleware work?", you're not testing the agent's knowledge. You're triggering a search-read-synthesize sequence that loads relevant code into the context window.

Sam: Walk me through that sequence.

Alex: The agent searches for auth-related files, reads the middleware implementations, analyzes the patterns, and synthesizes findings. That synthesis now lives in the context window. When you follow up with "Add rate limiting following the same pattern," the agent already has middleware structure, error handling conventions, export patterns—all loaded and ready. No additional search needed.

Sam: So questions become a context engineering tool, not a knowledge verification step.

Alex: Exactly. You're deliberately priming the agent's working memory before requesting implementation. This is more efficient than one massive prompt and more reliable than hoping the agent searches for the right things autonomously. And here's a practical tip: questions are safe to execute autonomously—they're read-only. Set your agent to required approval mode, let it explore freely, and if the explanation is wrong, just refine and retry.

Sam: What about forcing the agent to actually ground its responses instead of generating plausible-sounding guesses?

Alex: Require evidence. Explicitly. When you require "evidence including file paths, line numbers, actual values" in your prompt, the agent cannot provide that evidence without retrieving it. You convert potential hallucinations into grounded responses.

Sam: Can you contrast that with what happens without the evidence requirement?

Alex: Sure. Without it, you ask "Why is this endpoint returning 500?" and the agent might respond "Probably a database timeout or null pointer exception in the authentication logic." That's pattern completion from training data—sounds plausible but isn't grounded in your actual code.

Sam: And with the evidence requirement?

Alex: Now the agent must trace execution and cite specifics. It comes back with: "The error occurs in src/api/auth.ts:67 where user.profile.email is accessed. The profile object is null for OAuth users—see src/services/oauth.ts:134 where profile creation is skipped for federated auth. Stack trace shows TypeError: Cannot read property 'email' of null."

Sam: Night and day difference. What constitutes good evidence?

Alex: File paths with line numbers—src/auth/jwt.ts:45-67, not "the auth file." Actual values from configs—port: 8080, not "a port number." Specific identifiers—validateJWT() function, not "the validation function." Exact error messages with full stack traces, not "an error occurred."

Sam: You can combine this with Chain-of-Thought for complex debugging?

Alex: Absolutely. For multi-step debugging, Chain-of-Thought controls the execution path while evidence requirements ensure each step is grounded. Something like: "First, find the endpoint handler with evidence. Then trace the database query, citing the exact SQL and connection config. Then identify where null handling fails, with line numbers."

Sam: Let's talk about plan review. What should engineers look for before letting the agent execute?

Alex: Focus on strategy and reasoning, not just the output. Key questions: How did the agent derive this plan? Was grounding thorough—did it read relevant files, check documentation, understand constraints? Did it miss important considerations like security, performance, backwards compatibility?

Sam: Can you give an example of shallow grounding in a plan?

Alex: Agent proposes caching user sessions in Redis with 24-hour TTL. Sounds reasonable. But did it check your existing session implementation? Did it consider GDPR compliance for session data? Did it account for cache invalidation when users change passwords? If grounding was shallow, stop and add context before execution.

Sam: What about checking architectural fit?

Alex: You're validating that the proposed approach is sufficiently constrained and grounded. Check pattern adherence—does this fit established patterns? Module boundaries—are changes in the right modules? Appropriate scope—is the agent trying to refactor half the codebase when you asked for a targeted fix?

Sam: What's a red flag for grounding failure?

Alex: Agent plans to add email validation by creating a new validation library in src/lib/validators/. But you already have Zod schemas in src/validation/. The agent generated a plausible solution from training patterns instead of discovering your existing approach. Stop and correct: "We use Zod schemas in src/validation/. Search there first, then extend existing patterns."

Sam: This connects to something research has shown about AI-generated code, right?

Alex: Yes—AI-generated code contains eight times more duplicated blocks than human-written code. Agents reinvent the wheel because invention is statistically easier than discovery. They default to generating plausible code from training patterns rather than searching for existing utilities.

Sam: What phrases signal this during plan review?

Alex: Watch for: "Create a new utility function for..." Did it search for existing utilities? "Implement a helper to handle..." Does this helper already exist? "Build error handling logic..." What about existing error patterns? "Add validation for..." Check for existing validation schemas first.

Sam: Let's talk about checkpointing. Why is this so critical for agentic workflows?

Alex: Agents make mistakes frequently—especially while you're learning effective grounding and prompting. The good news: as your skills improve, rollbacks decrease dramatically. But even experienced practitioners value checkpointing as a safety net. The difference between frustrating and productive sessions is how quickly you can roll back.

Sam: What's the recommended rhythm?

Alex: Create a restore point before risky operations, let the agent execute, validate results, then keep or revert. Modern tools like Claude Code, Cursor, and VS Code Copilot have built-in checkpointing. In Claude Code, pressing ESC twice creates a checkpoint that saves both conversation context and code state.

Sam: And if your tool lacks built-in checkpointing?

Alex: Commit far more frequently than traditional development. After each successful increment, before risky operations, when changing direction, after manual corrections. Each commit is a known-good state you can return to instantly.

Sam: Finally, let's cover parallel execution. How do git worktrees fit in?

Alex: Git worktrees allow multiple working directories from a single repository, each with a different branch checked out. This enables running multiple agent instances on different tasks simultaneously without conflicts. Basic setup is just: git worktree add path branch-name.

Sam: Can agents help with the setup itself?

Alex: Absolutely. Ground with ArguSeek first for best practices, then ask the agent to generate commands for your specific scenario. Something like: "Research git worktree best practices, then create worktrees for these parallel features: auth refactor on feat/auth-refactor, analytics API on feat/analytics-api. Include setup and cleanup commands."

Sam: So the key takeaways here are: questions load context rather than verify knowledge, evidence requirements force grounding, and agents complete patterns rather than logic—so your engineering judgment is still essential.

Alex: Right. Review the plan's strategy before execution, watch for invention over reuse, checkpoint liberally, and use git worktrees for true parallelization. These techniques turn agents from code generators into reliable collaborators—but only when you actively guide them.
