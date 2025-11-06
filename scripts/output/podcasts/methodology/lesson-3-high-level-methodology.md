---
source: methodology/lesson-3-high-level-methodology.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T12:27:53.351Z
model: claude-haiku-4.5
tokenCount: 2507
---

Alex: Let's talk about the hardest part of working with AI agents. And it's not what most people think. It's not learning the tools or writing better prompts. It's letting go.

Sam: Letting go of what?

Alex: Control. For your entire career, your value has been in the details. You've built your reputation on writing clean code, spotting subtle bugs, understanding every line you ship. That's how you think of yourself as a good engineer—you own your implementations completely.

Sam: Right. Craftsmanship. That pride in knowing you've read every line.

Alex: Exactly. But here's the problem: when you start working with AI agents at scale, you physically cannot read every line. An agent can generate 2,000 lines of code in minutes. You can't mentally own that the way you owned 200 lines you wrote yourself. If you try, you'll burn out or become the bottleneck that eliminates all the productivity gains the agent was supposed to provide.

Sam: So what's the answer? Just... accept bad code?

Alex: No. The answer is you shift your value up the stack. You move from craftsman to operator, from implementer to orchestrator, from writing code to directing systems. Your focus changes from "is every line perfect" to "does this fit our architecture and follow our patterns?"

Sam: That's actually a huge mindset shift. How do you validate quality if you're not reading the code?

Alex: Systematically. You think about the architecture: Does this follow our patterns? Does it handle the security boundaries I identified? Does the behavior match my mental model of how this system should work? You're validating against your architectural understanding, not character-by-character review.

Sam: That requires a pretty solid mental model of the system.

Alex: It absolutely does. And that's where the workflow comes in. There's a four-phase pattern that makes this practical: Research, Plan, Execute, Validate. Each phase has a specific purpose. Skip any one, and your failure rate skyrockets.

Sam: Walk me through it.

Alex: Phase one is Research. You wouldn't start coding in a new codebase without learning the architecture and conventions first, right?

Sam: Of course not.

Alex: Same with agents. This phase is about grounding—bridging the gap between the general knowledge embedded in the model and the actual context of your real codebase. Without grounding, agents hallucinate patterns, invent inconsistent APIs, miss your existing implementations. You need two types of context: code patterns and domain knowledge.

Sam: How do you get that?

Alex: Code patterns come from semantic code search—tools like ChunkHound that answer architectural questions. Instead of keyword matching, you ask things like "How is authentication handled?" or "What's the error handling pattern?" The tool returns relevant implementations from your actual codebase.

Sam: And domain knowledge?

Alex: That's tools like ArguSeek. You need the latest API docs? Best practices from a framework? Solutions from GitHub issues? ArguSeek pulls that from Google directly into your context. No tab-switching, no manual copy-pasting. Both tools together give your agent the grounding it needs to understand your world.

Sam: That makes sense. What's phase two?

Alex: Planning. Now that you're grounded, you plan the change. But there are two different approaches depending on what you know.

Exploration planning is for when you're not sure about the solution. You frame the problem space, let the agent research your codebase and domain knowledge, and iterate together. You're discovering the approach. It costs more—higher token usage, more time—but you get better architectural decisions and catch issues early.

Exact planning is for when you already know the solution. Be directive. Specify the task precisely, define integration points, list constraints, identify edge cases, set clear acceptance criteria. The agent executes along a clear path. It's faster and cheaper, but only works if your upfront planning is solid. If you get it wrong, the generated code will be wrong.

Sam: So the planning phase is really about clarifying your own thinking before you hand off to the agent.

Alex: That's exactly right. As you plan, you're building your mental model. You're not memorizing code—you're understanding relationships. How does data flow? Where do errors propagate? What are the security boundaries? This mental model is your blueprint. It's what lets you validate generated code quickly without reading every line.

Sam: So when the agent finishes, I'm checking: does this fit my model of how the system works?

Alex: Exactly. If yes, it's probably correct. If no, something's wrong—either your model needs updating or the code needs regenerating.

Sam: What about execution?

Alex: Here's where it gets interesting. There are two execution modes, and understanding the difference changes how you think about productivity.

Supervised mode: you actively monitor the agent as it works. You watch each action, review intermediate outputs, steer when it drifts. You catch issues immediately. The downside is massive—you're completely blocked. You can't context-switch, you can't step away. You're burning your attention on implementation details instead of strategic thinking.

Use supervised mode when you're learning how agents behave, or when you're working on security-critical code where you need to watch closely. It's your training ground.

Sam: And autonomous mode?

Alex: You give the agent a well-defined task, let it run completely unsupervised, and check the results when it's done. You're not watching it work. You're working on another project, attending a meeting, cooking dinner. The agent's running in the background.

Sam: That sounds risky if the agent makes mistakes.

Alex: It is, but only if you skipped Phase 1 and Phase 2. If you've grounded the agent well and planned precisely, it won't drift. And here's the counterintuitive part that actually drives real productivity: it's not about speed per task. It's about parallel work.

You can run three agents simultaneously on different projects. You can maintain eight-hour stretches of productive output while only spending two hours at your keyboard. Even if an agent takes longer than you would to hand-code something, autonomous mode wins if you're not blocked waiting for it.

Sam: So you're not getting 10x faster per task. You're getting productivity gains from working on multiple things simultaneously.

Alex: That's the actual game changer. A senior engineer running three autonomous agents in parallel while attending meetings and cooking dinner ships more code than the same engineer babysitting one agent through a single task. That's where the 10x lives.

Sam: That requires serious trust in the agent though.

Alex: Absolutely. Which is why Phases 1 and 2 matter so much. With good grounding and precise planning, you can trust the agent to execute correctly without supervision. Your goal is to maximize time in autonomous mode.

Sam: What about when things go wrong? Phase 4 is validation, right?

Alex: Right. And here's the reality: LLMs are probabilistic machines. They almost never produce 100% perfect output on first pass. That's expected behavior, not failure.

Your validation goal isn't perfection. It's identifying what's wrong or missing, then making a critical decision: iterate with fixes or regenerate from scratch?

Sam: How do you decide?

Alex: Iterate when the output's generally aligned but has gaps—missing edge cases, some tech debt, incomplete error handling. The foundation's right; it needs refinement.

Regenerate when something fundamental is wrong. The architecture doesn't match your mental model, the agent misunderstood requirements, the approach itself is flawed. Don't patch fundamentally broken code. Fix your input and regenerate.

Sam: The key is thinking of validation as debugging your context, not the output.

Alex: Exactly. Code generation is cheap. Your input—the prompt, examples, constraints—is what actually drives quality. Focus there.

Sam: What about actually running the code?

Alex: Do it. Be the user. Test happy paths, try to break it, check edge cases. Five minutes of manual testing beats an hour of code review. And then use the agent itself to review its own work—we'll get into that later. Also run your builds, tests, linters. If those pass and behavior matches your plan, you're good.

Sam: So the workflow isn't really linear. You discover gaps in validation that send you back to research or planning.

Alex: Right. It's iterative. The value isn't executing each phase perfectly first time. It's having a systematic framework that catches issues before they compound. You're closing the loop: research grounds you, planning clarifies thinking, execution happens in the mode that fits the moment, validation ensures quality against your mental model.

Sam: And all of this comes down to this mindset shift from craftsman to operator.

Alex: Exactly. You stop owning the implementation details and start owning the context that guides implementation. You direct systems instead of writing code. But here's the thing that doesn't change: you own the results. Machines can't be held accountable. Every line of agent-generated code ships under your name. You're responsible.

Sam: That's actually important to say. It's not like you're delegating responsibility away.

Alex: Not at all. You're changing how you ensure quality, but the responsibility remains completely yours. You're just doing it smarter—systematically instead of exhaustively, architecturally instead of microscopically.

Sam: This all makes sense as a framework. But how do you actually communicate all this to the agent effectively? That's where prompting comes in.

Alex: That's exactly where we go next. The workflow tells you what to do. Prompting tells you how to do it. How to research effectively, how to plan clearly, how to direct execution, how to validate systematically. That's Lesson 4.

Sam: Looking forward to it.
