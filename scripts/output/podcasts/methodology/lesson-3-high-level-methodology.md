---
source: methodology/lesson-3-high-level-methodology.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T08:22:49.205Z
model: claude-haiku-4.5
tokenCount: 2811
---

Alex: The hardest part of working with AI agents isn't mastering a new tool or writing a clever prompt. It's psychological. It's letting go.

Sam: Letting go of what, exactly?

Alex: Control. For your entire career, your value has been in understanding code deeply—the details, the subtle bugs, owning every line you ship. That's what separates senior engineers from junior ones. But agents destroy that equation. You cannot read and verify 2,000 lines of generated code the way you owned 200 lines you personally wrote.

Sam: So you're saying we can't maintain the same level of craftsmanship we're used to?

Alex: Not at the same scale, no. And if you try—if you insist on understanding every generated line—you'll burn out or become a bottleneck that completely negates the productivity gains. The shift isn't optional. It's a fundamental change in how you operate.

Sam: What does that look like in practice?

Alex: You move from craftsman to operator. From implementer to orchestrator. From writing code to directing systems. Your value doesn't disappear—it moves up the stack. Instead of ensuring every loop is efficient, you're ensuring the architecture makes sense. Instead of reviewing syntax, you're validating that patterns are consistent.

Sam: But quality still matters, right?

Alex: Absolutely. But you ensure quality differently. You stop validating correctness by reading every character and start validating by thinking systematically: Does this fit our architecture? Does it follow our patterns? Does it handle the risks we identified? Does the behavior match my mental model of how the system should work?

Sam: That's an interesting distinction. Instead of line-by-line code review, you're validating at a higher level of abstraction.

Alex: Exactly. Your focus shifts to two things: the context you provide—the patterns, constraints, and examples that guide the agent—and the prompts you craft—the architectural requirements and integration points you specify. Get those right, and you can confidently ship thousands of lines generated code. Get them wrong, and you'll waste time fixing and refactoring.

Sam: So the real work shifts earlier in the process, before code is generated.

Alex: Precisely. That's why we have a four-phase workflow: Research, Plan, Execute, Validate. It's systematic enough to maintain architectural control while delegating implementation. It's how you ensure quality without reading every character, and how you scale your impact beyond what you could personally type.

Sam: Walk me through these phases. Let's start with research.

Alex: Research is what we call grounding. It's the bridge between the general knowledge embedded in the model and the actual context of your codebase and domain. Without grounding, agents hallucinate patterns, invent inconsistent APIs, and miss your existing implementations.

Sam: What does grounding look like concretely?

Alex: Two tools handle it. ChunkHound performs semantic code search—architectural questions like "How is authentication handled?" or "What's our error handling pattern?" instead of keyword matching. It retrieves the relevant patterns and implementations from your codebase.

Sam: And for domain knowledge outside the codebase?

Alex: That's ArguSeek. It pulls information from Google and technical documentation directly into your context. Need the latest API docs? Best practices for a framework? An algorithm in a research paper? ArguSeek retrieves it and makes it available without manual tab-switching or copy-pasting.

Sam: So before you even start planning, you've grounded the agent in both your codebase patterns and the external domain knowledge it needs.

Alex: Yes. Without that grounding, the agent is flying blind. It might produce code that technically works but doesn't fit your architecture or follow your conventions. Grounding is non-negotiable.

Sam: What about phase two—planning?

Alex: Planning is where strategy comes in. There are two approaches depending on your situation. Exploration planning is for when the solution space is unclear. You frame the problem, let the agent research your patterns via ChunkHound, explore alternatives, and iterate with you through reasoning cycles. You're discovering the approach together. This costs more time and tokens, but it discovers better solutions and catches architectural issues early.

Sam: And the other approach?

Alex: Exact planning. You use this when you know the solution and can articulate it precisely. Be directive. Define the task with specificity, specify integration points and patterns to follow, provide explicit constraints and requirements, list edge cases, define acceptance criteria. The agent executes along a predetermined path. It's faster and more cost-effective, but it requires architectural certainty upfront. If your plan is wrong or incomplete, the generated code will be.

Sam: So exploration when you're learning the space, exact planning when you've already done the thinking.

Alex: Exactly. During planning, you're also building your mental model—understanding how authentication flows through middleware, where data validation happens versus business logic, how errors propagate, where security boundaries exist. This mental model becomes your validation blueprint. When the agent completes, you don't read every line. You check against your model.

Sam: Does the mental model change after you get results?

Alex: Almost always. Validation often reveals gaps in your research or flaws in your plan. That's expected. The value of the workflow isn't executing each phase perfectly the first time. It's having a systematic framework that catches issues before they compound.

Sam: Let's move to execution—phase three.

Alex: Execution has two modes: supervised and autonomous. Most engineers start supervised to build trust, then shift to autonomous as they develop stronger grounding and planning skills.

Sam: What's supervised mode?

Alex: You actively watch the agent work. You review each action, check intermediate outputs, steer when it drifts, intervene when it makes mistakes. You get maximum control and precision. You catch issues immediately. The tradeoff is brutal: your throughput tanks because you're blocked while the agent works. You can't context-switch, you can't step away. You're burning your most valuable resource—attention—on implementation details. Use this when you're learning agent behavior, when working on security-critical code, or when tackling complex problems where you need to build your mental model in real time. It's your training ground for developing the trust to eventually let go.

Sam: And autonomous mode?

Alex: You give the agent a well-defined task from your plan and let it run. You're not watching. You're doing other things. Working on a different project, attending a meeting, cooking dinner. You might check occasionally to see if it's blocked, but mostly you're away.

Sam: I'm guessing that's where the real productivity multiplier lives.

Alex: Yes. But here's the counterintuitive part: the real gain isn't finishing individual tasks faster. It's working on multiple projects simultaneously. You can have three agents running in parallel on different projects. You maintain eight-hour stretches of productive output while only spending two hours at your keyboard. You can genuinely multitask in software development for the first time in history.

Sam: Even if an agent takes longer on a single task than you would?

Alex: Especially then. If an agent takes thirty minutes on something you could hand-code in twenty minutes, autonomous mode still wins if it means you're cooking dinner instead of being blocked. The math is different. The real productivity game changer is parallel execution and continuous output.

Sam: That requires excellent grounding and planning though.

Alex: Completely. If you skip those phases, the agent drifts, hallucinate, produces garbage. If you do them well, you can trust execution without supervision. Your goal is maximizing autonomous time—that's where you become genuinely more productive.

Sam: Okay. Phase four is validation. How does that work?

Alex: LLMs are probabilistic. They almost never produce 100% perfect output on first pass. That's expected, not failure. Your validation goal isn't perfection verification. It's accurately identifying what's wrong or missing, then making a decision: iterate with fixes or regenerate from scratch?

Sam: What's the heuristic?

Alex: Iterate when the output aligns with your expectations but has gaps—missing edge cases, some technical debt, incomplete error handling, pattern inconsistencies. The foundation is right; it needs refinement. Regenerate when something fundamental is wrong—the architecture doesn't match your mental model, the agent misunderstood requirements, the approach itself is flawed. Don't patch fundamentally broken code. Fix your context and regenerate.

Sam: So you're debugging your input, not the output.

Alex: Exactly. It's usually easier to refine your prompt and constraints than to fix generated code. Run your code like you're a user. Test the happy path, try to break it, check edge cases. Does it handle errors gracefully? Five minutes of manual testing reveals more than an hour of code review.

Sam: Should you use the agent itself for validation?

Alex: Absolutely. Agents are better at finding issues in code than generating perfect code on first pass. Have it review its own work—we'll cover that technique in lesson nine. Have it create tests as guardrails—lesson eight covers that. Automated checks still matter: build, tests, linters. If these pass and behavior matches your plan and mental model, ship it.

Sam: One thing I want to clarify: you said earlier that properly prompted AI-generated code is actually easier to read than hand-written code.

Alex: Right. LLMs follow patterns with mechanical precision across thousands of lines. When you provide quality patterns and clear constraints, they replicate them perfectly. You're not sacrificing quality by delegating to agents—you're achieving structural consistency at a scale individual craftsmanship can't match.

Sam: So the agent becomes a consistency engine.

Alex: That's the perfect way to frame it. Your job shifts from ensuring every implementation detail is correct to ensuring the patterns themselves are correct. One other critical point: you own the results. Machines can't be held accountable. Every line of agent-generated code ships under your name. This is the engineer's responsibility, and it doesn't change regardless of which tool writes the implementation.

Sam: That's a good reminder that we're not off the hook just because we're delegating.

Alex: Not at all. We're just operating differently—higher level, more strategic, but still accountable. The workflow—Research, Plan, Execute, Validate—is the framework. But strategy means nothing without execution, and execution depends on communication. Every phase depends on how precisely you communicate with the agent. The workflow tells you what to do. Prompting tells you how to do it effectively.

Sam: So lesson four covers the actual prompting techniques.

Alex: Exactly. That's where execution becomes concrete.
