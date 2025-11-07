---
source: methodology/lesson-3-high-level-methodology.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T13:38:08.971Z
model: claude-haiku-4.5
tokenCount: 3005
---

Alex: The hardest part of working with AI agents isn't learning new tools or mastering better prompts. It's actually letting go. And I think that's worth spending real time on, because it challenges something fundamental about how engineers see themselves.

Sam: Letting go of what exactly?

Alex: Control. Details. Ownership of every line you write. For your entire career, your value has been in the details. You've built your reputation on understanding code deeply, spotting subtle bugs, writing clean implementations. You've internalized that good engineers own what they build.

Sam: Right. And AI agents don't let you do that at scale. You can't read and mentally own 2,000 lines of generated code the way you'd own 200 lines you wrote yourself.

Alex: Exactly. If you try to maintain that level of control, you either burn out or become the bottleneck that negates every productivity gain the agent gives you. The shift required is actually psychological as much as methodological. You're moving from craftsman to operator. From implementer to orchestrator. From writing code to directing systems.

Sam: That's a pretty significant reframing. Does that mean you stop caring about quality?

Alex: No. You just ensure quality differently. Instead of validating correctness by reading every line, you validate systematically: Does this fit the architecture? Does it follow our patterns? Does it handle the risks I identified? Does the behavior match my mental model of how this system should work?

Your focus shifts to two higher-level concerns. First, the context you provide—what patterns, constraints, and examples guide the agent. Second, the prompts you craft—what architectural requirements and integration points you specify. Get those right, and you can confidently ship thousands of lines of generated code. Get them wrong, and you're wasting time fixing and second-guessing.

Sam: So you're not directly validating the implementation anymore. You're validating your input and your mental model of the system.

Alex: That's the insight. Your cognitive load shifts entirely to architectural thinking—understanding how pieces fit together, what patterns to follow, what constraints matter, what risks exist. When an agent generates 50 files, you don't review them line by line. You review the architecture. Does it follow the patterns? Does it handle security boundaries? Does it integrate correctly? You spot-check where your mental model says "this is risky" or "this is too complex."

Sam: But surely that requires you to understand the codebase pretty deeply?

Alex: Actually, here's the counterintuitive part: properly prompted AI-generated code is often easier to read than hand-written code. LLMs follow patterns with mechanical precision across thousands of lines. When you provide quality patterns and clear constraints, they replicate them perfectly. You're not sacrificing quality by delegating to agents. You're achieving structural consistency at a scale individual craftsmanship can't match.

Sam: So the agent becomes better at replicating the patterns than most humans would be?

Alex: Consistently, yes. The tradecraft shifts from "did I write this correctly" to "is the pattern itself correct." That's a much more tractable problem. And one thing doesn't change: you own the results. Machines can't be held accountable. Every line of agent-generated code ships under your name. That responsibility remains.

Sam: Okay, so this is a fundamental mindset shift. What does the actual workflow look like?

Alex: There are four phases that every significant agent interaction should follow. Research, Plan, Execute, Validate. Each phase has a distinct purpose. Skip any one of them and your failure rate climbs dramatically.

The first phase is Research. Think about starting work in a new codebase. You don't just start coding. You learn the architecture, the patterns, the conventions. You keep documentation open. Your agent needs the same grounding.

For codebase context, you need something called code deep research—semantic code search that answers architectural questions like "How is authentication handled?" or "What's the error handling pattern?" not just keyword matching. That's what tools like ChunkHound do. They retrieve the actual patterns and implementations from your codebase.

For domain knowledge, you need access to external resources. APIs, frameworks, algorithms, best practices from GitHub. That's where tools like ArguSeek come in. They pull information directly into your context without manual tab-switching.

Sam: So Research is essentially "give the AI the context it needs to operate in your actual environment."

Alex: Exactly. Without that grounding, agents hallucinate patterns, invent inconsistent APIs, miss your existing implementations. With it, they work within your constraints and patterns.

Sam: What about the Planning phase?

Alex: Planning is a strategic choice based on whether you know the solution or need to discover it. There are two approaches here.

Exploration Planning is when the solution space is unclear. You frame the problem, steer the agent to research your codebase patterns and domain knowledge, and explore alternatives together. You're discovering the approach. This costs more time and runs higher, but it catches architectural issues early and builds a clearer mental model before you commit to implementation.

Exact Planning is when you already know the solution and can articulate it precisely. You be directive. Define the task with specificity, specify integration points and patterns, provide explicit constraints and requirements, list edge cases, define acceptance criteria. The agent executes along a predetermined path. This is faster, more cost-effective, but requires that you've already done the architectural thinking. If your plan is wrong, the generated code will be wrong.

As you're planning, you're actually refining your mental model of the system. You're understanding relationships—how authentication flows through middleware, where data validation happens, how errors propagate, where performance bottlenecks might appear, what security boundaries exist. This mental model is what lets you validate generated code quickly, because you're not reading every line. You're checking: "Does this fit my mental model of how this system works?"

Sam: So the plan phase is really about two things: deciding on your approach, and building a clear mental model you can validate against later.

Alex: Perfectly stated. Now, Execute. This is where it gets interesting, because there are two fundamentally different modes, and which one you use changes your productivity in non-obvious ways.

Supervised mode means you actively monitor the agent as it works. You watch each action, review intermediate outputs, steer when it drifts, catch issues immediately. You get maximum control and precision. The cost is that your throughput tanks. You're blocked while the agent works. You can't context-switch to another task. You're burning your most valuable resource—attention—on implementation details.

Use supervised mode when you're learning how agents behave, when you're working on critical security code, or when tackling complex problems where you need to build your mental model as the agent explores. It's your training ground for developing trust.

Sam: But most engineers probably start there.

Alex: Almost everyone does. You have to build confidence that agents can actually execute reliably. But here's where the real leverage happens: Autonomous mode. You give the agent a well-defined task from your plan, let it run, and check the results when it's done. You're not watching it work. You're doing other things—working on a different project, attending a meeting, cooking dinner, running errands. You check your phone occasionally, but mostly you're away.

And this is where I need to be really clear about something that I think gets misunderstood. The productivity transformation isn't about an individual task finishing faster. It's about parallel work and continuous output. You can have three agents running simultaneously on different projects. You can maintain eight-hour stretches of productive output while only spending two hours at your keyboard. You can genuinely multitask in software development for the first time in your career.

Sam: So it's not about speed per agent. It's about throughput across multiple agents.

Alex: That's exactly right. Even if you could hand-code something in 20 minutes and the agent takes 30, autonomous mode wins if it means you're cooking dinner instead of being blocked. The agent's working, you're living your life, and you're still shipping code. A senior engineer running three autonomous agents in parallel while attending meetings and cooking dinner ships more code than the same engineer babysitting one agent through a single task. That's the actual game changer.

Sam: That requires really solid grounding and planning though, doesn't it?

Alex: Completely. If you skip Research and Plan, the agent will drift, hallucinate, produce garbage. If you do them well, you can trust the agent to execute correctly without supervision. Your goal is to maximize time in autonomous mode. That's where you become genuinely more productive, not just slightly faster.

Sam: What about the Validation phase?

Alex: This is where you confront a reality: LLMs are probabilistic machines that almost never produce 100% perfect output on first pass. This isn't failure. It's expected behavior. Your validation goal isn't perfection verification. It's accurately identifying what's wrong or missing, then making a critical decision: iterate with fixes, or regenerate from scratch?

The general principle is: code generation is cheap. Don't get attached to the output.

Iterate when the output is aligned with your expectations but has gaps—missing edge cases, some tech debt, incomplete error handling, pattern inconsistencies. The foundation is right; it needs refinement.

Regenerate when something fundamental is wrong—the architecture doesn't match your mental model, the agent misunderstood requirements, or the approach itself is flawed. Don't patch fundamentally broken code. Fix the context and regenerate.

And here's the key insight: It's usually easier to fix your context—the prompt, the examples, the constraints—than to fix the generated code. Think of yourself as debugging your input, not the output.

Sam: So in validation, you're leaning heavily on that mental model again.

Alex: Completely. Nothing beats actually running your implementation. Be the user. Test the happy path, try to break it, check edge cases. Does it handle errors gracefully? Is performance acceptable? Five minutes of manual testing reveals more than an hour of code review.

You can also use the agent itself to find issues in its own work—we'll cover that technique in a later lesson. Have the agent create tests as guardrails. And obviously, run your build, tests, and linters. If those pass and the behavior matches your mental model, ship it.

Sam: So this workflow—Research, Plan, Execute, Validate—it's not really linear, is it?

Alex: No. It's iterative. Validation often reveals gaps in your research or flaws in your plan. That's expected. The value isn't executing each phase perfectly the first time. It's having a systematic framework that catches issues before they compound.

The operator mindset I mentioned at the start—that shift from craftsman to orchestrator—this workflow makes that shift practical. You're not abandoning quality or responsibility. You're fundamentally changing how you ensure both: through architectural thinking, precise context, and systematic validation against your mental model rather than line-by-line code review.

Sam: And that's where the next lesson comes in—how to actually communicate with the agent effectively?

Alex: Exactly. This workflow tells you what to do. Prompting tells you how to do it effectively. That's Lesson 4.
