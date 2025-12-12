---
source: methodology/lesson-3-high-level-methodology.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T08:03:08.688Z
model: claude-opus-4.5
tokenCount: 2949
---

Alex: There's something I want to address before we dive into methodology today. The hardest part of working with AI agents isn't the tooling or even the prompts. It's psychological. It's letting go.

Sam: Letting go of what, exactly?

Alex: Your identity as a craftsman. Think about it—your entire career, your value has been in the details. Writing clean code, spotting subtle bugs, understanding every line you ship. You've internalized that good engineers own their implementations deeply.

Sam: And AI agents break that model.

Alex: Completely. You cannot read, verify, and mentally own two thousand lines of generated implementation the way you owned two hundred lines you wrote yourself. If you try, you'll either burn out or become the bottleneck that negates every productivity gain the agent provides.

Sam: So what's the alternative? Just trust the output blindly?

Alex: No—you shift how you ensure quality. You stop validating correctness by reading every line and start validating systematically. Does this fit the architecture? Does it follow our patterns? Does it handle the risks I identified? Does the behavior match my mental model? Your focus moves from the code itself to two higher-level concerns: the context you provide and the prompts you craft.

Sam: You're describing a role change, not just a tool change.

Alex: Exactly. You're moving from craftsman to operator, from implementer to orchestrator. Your value moves up the stack—from syntax to structure, from loops to logic, from implementation details to architectural decisions.

Sam: Walk me through what the operator workflow actually looks like day-to-day.

Alex: Traditional development is: write code, test it, review it, debug it, refactor it. The operator workflow is fundamentally different. You map the system—modules, boundaries, data flow. You research existing patterns and constraints. You plan the change at the architecture level. You direct the agent with precise context. Then you validate behavior against your mental model.

Sam: Notice what's missing—actually writing implementation code.

Alex: Right. The agent handles that. Your cognitive load shifts entirely to system-level thinking. Module boundaries and responsibilities, inputs and outputs, state management, contracts between components. You still read code, but selectively. When an agent generates fifty files, you don't review line by line. You review at the system level and spot-check where your mental model says "this is risky."

Sam: There's something counterintuitive here. Isn't AI-generated code harder to trust because you didn't write it?

Alex: Here's the thing—properly prompted AI-generated code is often easier to read than hand-written code. LLMs follow patterns with mechanical precision across thousands of lines. When you provide quality patterns and clear constraints, they replicate them perfectly. You're achieving structural consistency at a scale individual craftsmanship can't match. Your job shifts from ensuring every implementation detail is correct to ensuring the patterns themselves are correct.

Sam: But you still own everything that ships.

Alex: Absolutely. Machines can't be held accountable—they execute instructions. Every line of agent-generated code ships under your name. That responsibility doesn't change regardless of which tool writes the implementation.

Sam: So what's the systematic workflow that makes this practical?

Alex: Four phases: Research, Plan, Execute, Validate. Every significant agent interaction should follow this pattern, and skipping any phase dramatically increases your failure rate.

Sam: Let's start with Research.

Alex: You wouldn't start coding in a new codebase without first learning the architecture, patterns, and conventions. Your agent needs the same context. This is grounding—bridging the general-purpose knowledge embedded in the model with the actual real-world context it needs. Without grounding, agents hallucinate patterns, invent inconsistent APIs, and miss your existing implementations.

Sam: What tools enable this?

Alex: Two main categories. For code context, you need semantic code search—something like ChunkHound that performs code deep research. It answers architectural questions like "How is authentication handled?" or "What's the error handling pattern?" rather than just keyword matching. For domain knowledge, tools like ArguSeek pull information from Google directly into your context. Latest API docs, framework best practices, algorithms from research papers, solutions from GitHub issues—all retrieved without manual tab-switching and copy-pasting.

Sam: Ground the agent in both your codebase and domain knowledge before planning.

Alex: Exactly. Now, Phase 2 is Planning, and this is where it gets interesting. Planning isn't a single approach—it's a strategic choice based on whether you know the solution or need to discover it.

Sam: Two modes of planning?

Alex: Exploration planning and exact planning. Use exploration when the solution space is unclear. Rather than dictating a solution, you frame the problem space and steer the agent to research your codebase patterns, explore alternatives, and iterate through reasoning-action cycles with you. Higher cost and time investment, but it discovers better solutions and catches architectural issues early.

Sam: And exact planning?

Alex: Use it when you know the solution and can articulate it precisely. Be directive—define the task with specificity, specify integration points and patterns to follow, provide explicit constraints and requirements, list edge cases, define acceptance criteria. The agent executes along a predetermined path. Faster and more cost-effective, but requires upfront clarity. If your plan is wrong, the generated code will be wrong.

Sam: As you plan, you're building your mental model.

Alex: That's the key insight. You're not memorizing code—you're understanding relationships. How authentication flows through middleware. Where data validation happens versus business logic. How errors propagate to the client. Where performance bottlenecks might appear. What security boundaries exist. This mental model is what allows you to validate generated code quickly.

Sam: You check whether output fits the model rather than reading every line.

Alex: Right. If it fits, it's probably correct. If not, either your model is wrong and needs updating, or the code is wrong and needs regeneration. Tools like Claude Code have dedicated plan mode—press Shift+Tab to enter it. Other tools lack this, but you can simulate it with structured prompts that explicitly separate research and exploration from implementation.

Sam: Now Phase 3—execution. This is where most people focus, but you're saying it's actually the least interesting phase?

Alex: In some ways, yes. With your plan complete, you execute—but how you interact during execution fundamentally changes your productivity. Two modes: supervised and autonomous.

Sam: Supervised is watching the agent work?

Alex: Right—actively monitoring each action, reviewing intermediate outputs, steering when it drifts, intervening on mistakes. Maximum control and precision. You catch issues immediately. The cost is massive: your throughput tanks because you're blocked while the agent works. Can't context-switch, can't step away. Use supervised mode when learning how agents behave, on security-sensitive code, or on complex problems where you need to build your mental model as the agent explores.

Sam: And autonomous mode?

Alex: Fire and forget. You give the agent a well-defined task from your plan, let it run, check results when it's done. You're not watching. You're doing other things—different project, a meeting, cooking dinner, running errands. Maybe check your phone occasionally to see if it's blocked.

Sam: This is where the real productivity transformation happens.

Alex: And it's not what most people think. Yes, sometimes the agent finishes faster than manual coding. But that's not the point. The point is parallel work and continuous output. You can have three agents running simultaneously on different projects. You can maintain eight-hour stretches of productive output while only spending two hours at your keyboard.

Sam: Even if the agent is slower on a single task, you win because you're not blocked.

Alex: Exactly. If you could hand-code something in twenty minutes and the agent takes thirty, autonomous mode still wins if it means you're cooking dinner instead of staring at a screen. This is the actual ten-times productivity gain people talk about—working on multiple tasks simultaneously while living your life. A senior engineer running three autonomous agents in parallel while attending meetings and cooking ships more code than the same engineer babysitting one agent through a single task.

Sam: But autonomous mode depends entirely on excellent grounding and planning.

Alex: If you skip those phases, the agent drifts, hallucinates, produces garbage. If you do them well, you can trust execution without supervision. Your goal is maximizing time in autonomous mode.

Sam: Phase 4 is validation. What's the reality here?

Alex: LLMs are probabilistic machines that almost never produce one hundred percent perfect output on first pass. This isn't failure—it's expected behavior. Your validation goal isn't perfection verification. It's accurately identifying what's wrong or missing, then making a critical decision: iterate with fixes, or regenerate from scratch?

Sam: How do you decide?

Alex: It's art more than science, but remember—code generation is cheap. Don't get attached to output. Iterate when the output is aligned with expectations but has gaps: missing edge cases, some tech debt, incomplete error handling, pattern inconsistencies. The foundation is right; it needs refinement. Regenerate when something fundamental is wrong: architecture doesn't match your mental model, the agent misunderstood requirements, the approach itself is flawed.

Sam: Don't patch fundamentally broken code.

Alex: Fix the context and regenerate. It's usually easier to fix your input—the prompt, examples, constraints—than to fix the generated code. Think of yourself as debugging your input, not the output.

Sam: What about actually running the code?

Alex: Nothing beats it. Be the user. Test the happy path, try to break it, check edge cases. Does it handle errors gracefully? Is performance acceptable? Five minutes of manual testing reveals more than an hour of code review. Also use the agent itself—it's better at finding issues in code than generating perfect code first try. Have it review its own work. Have it create tests as guardrails.

Sam: Build, tests, linters still matter.

Alex: Absolutely. If they fail, you have clear signal. If they pass, manually verify behavior matches your plan and mental model.

Sam: This workflow isn't linear—it loops back.

Alex: Validation often reveals gaps in your research or flaws in your plan. That's expected. The value isn't executing each phase perfectly the first time. It's having a systematic framework that catches issues before they compound. You're not validating by reading every line. You're validating against your mental model. Does the architecture match your plan? Do patterns align with your grounding? Does behavior satisfy requirements? If yes, ship it. If no, identify whether the problem is context—regenerate—or refinement—iterate.

Sam: The workflow tells you what to do. But execution happens through communication with the agent.

Alex: Every phase—research queries, planning prompts, execution instructions, validation reviews—depends on how precisely you communicate. The workflow is strategic framework. Prompting is how you execute it effectively. That's what we cover next.
