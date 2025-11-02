---
source: methodology/lesson-3-high-level-methodology.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:10:56.282Z
model: claude-haiku-4.5
tokenCount: 3039
---

Alex: Let's start with something uncomfortable. The hardest part of working with AI agents isn't learning new tools or writing better prompts. It's letting go.

Sam: Letting go of what, exactly?

Alex: Control. Your entire career has been built on understanding code deeply. You pride yourself on knowing every line you ship, spotting subtle bugs, owning the implementation. That's how you built your reputation as a senior engineer.

Sam: Right. And now you're telling me I can't do that anymore?

Alex: Not can't. Shouldn't. Think about the math. An agent can generate thousands of lines of code in a single interaction. You physically cannot read, verify, and mentally own 2,000 lines the way you owned 200 lines you wrote yourself. If you try, you'll burn out. Worse, you become the bottleneck that eliminates every productivity gain the agent provides.

Sam: That feels counterintuitive. Shouldn't we be more careful with generated code, not less?

Alex: You should be more careful about the patterns and architecture. Less careful about individual lines. Here's the distinction: bad generated code usually comes from bad inputs, not lazy engineers. If you provide clear patterns, good constraints, and architectural context, LLMs replicate those patterns with mechanical precision across thousands of lines. The quality isn't in reading every line. The quality is in getting the patterns right in the first place.

Sam: So you're saying we shift from being craftsmen to something else?

Alex: Operators. Or orchestrators. You move from implementer to director. Your value moves up the stack—from syntax and loops to architecture and design. Your job becomes ensuring the context is right and the prompts are precise, not ensuring every semicolon is in place.

Sam: That's a significant psychological shift. How do you actually maintain quality if you're not reading the code?

Alex: You validate systematically instead of exhaustively. You ask different questions. Does this fit the architecture? Does it follow our patterns? Does it handle the risks I identified? Does the behavior match my mental model of how this system should work? You develop a mental model of your system—not memorizing every function, but understanding relationships. How authentication flows. Where validation happens. What security boundaries exist. Then when the agent finishes, you check: does this fit my model? If yes, it's probably right. If no, something's wrong.

Sam: And if something's wrong, you rewrite it?

Alex: Usually no. You regenerate it. You don't patch fundamentally broken code from an agent. You fix your input—the prompt, the examples, the constraints. Then regenerate. Code generation is cheap. Don't get attached to the output.

Sam: That makes sense intellectually, but I think there's real anxiety there. We're trained to own our code.

Alex: Absolutely. And you still do. Every line ships under your name. You're still responsible. The difference is you're responsible for directing well, not for typing perfectly. That's actually harder in some ways. You need to think more clearly about what you want before you ask for it.

Sam: Okay, so let's talk about the actual process. You mentioned a workflow—Research, Plan, Execute, Validate?

Alex: Four phases, yes. And they're not optional. Skip any one of them and your failure rate goes up dramatically.

Sam: What's the failure look like?

Alex: Research skipped? The agent doesn't know your patterns, hallucinating inconsistent APIs, missing existing implementations. Plan skipped? You get code that works technically but doesn't fit your architecture. Execute skipped? You're babysitting the agent instead of letting it run. Validate skipped? You ship code that looks right but doesn't actually handle edge cases or perform correctly. Each phase is a gate.

Sam: Let's dig into phase one first. What does research actually involve?

Alex: Two dimensions. First, code research—you need to understand patterns in your codebase. How do you handle authentication? What's the error handling pattern? How does data flow through middleware? Not by reading the entire repo. By doing targeted semantic searches that answer architectural questions. That's different from grep. You're not looking for a keyword. You're looking for patterns.

Sam: So you're going to use tools for that?

Alex: Yes. Tools like ChunkHound that do semantic code search. They answer questions at the architecture level, not the keyword level. Then you need domain knowledge research. Latest API docs? Best practices for a framework? You use ArguSeek for that—it pulls information from Google, GitHub, papers, whatever you need. Grounds your agent in real-world context, not just general knowledge from training data.

Sam: And this grounding is foundational before you even talk to the agent?

Alex: Before you direct the agent, yes. You do the research yourself. This is where your mental model starts forming. You're not asking the agent to figure out "how should we do error handling?" You're saying "I've looked at our codebase, here's how we do it, replicate this pattern when you generate new code."

Sam: That's a lot of upfront work though. Doesn't that kill the productivity argument?

Alex: No. It kills bad productivity. You're not faster at the task itself. You're faster because you need fewer iterations and your code is more consistent. More importantly, you're faster because you can eventually run multiple tasks in parallel. One agent running while you do something else. That's where real productivity multiplies.

Sam: Okay, phase two. Planning.

Alex: Planning is strategic. You have two modes depending on what you know. Exploration planning—you frame the problem, let the agent research alternatives with your codebase and domain knowledge grounding, iterate together to discover the approach. Higher cost, but you find better solutions and catch architectural issues early.

Sam: When would you use that?

Alex: Unfamiliar territory. You're working in a new framework. You're solving a problem that's never come up in your codebase. You need to discover the approach, not execute a known one. The iteration with the agent helps you think through the problem.

Sam: And the other mode?

Alex: Exact planning. You know the solution already. You've done the architectural thinking. Now you direct the agent precisely. Define the task with specificity, list integration points, constraints, edge cases, acceptance criteria. The agent executes along a predetermined path.

Sam: That's faster?

Alex: Much faster. But it requires you to be right. If your plan is incomplete or your understanding is wrong, the generated code will be wrong. Exact planning is for when you have architectural certainty.

Sam: Most engineers probably default to exploration mode?

Alex: Because most engineers haven't done the upfront architectural thinking yet. But that's where phase one and research come in. By the time you're planning, you've grounded yourself in patterns and domain knowledge. You should have clarity. If you don't, exploration mode is the right choice.

Sam: So you're building a mental model as you go through phases one and two?

Alex: Exactly. And that mental model is your blueprint for validation. You understand relationships—not every function, but how pieces fit together. Then phase three is execution.

Sam: Two modes there too?

Alex: Supervised and autonomous. Supervised—you're actively watching the agent work. Each action, each output. You steer when it drifts, intervene on mistakes. You get maximum control, maximum precision. The cost is maximum attention. You're blocked while the agent works. You can't context-switch. You're babysitting.

Sam: When would you use that?

Alex: Learning how agents behave. Critical security-sensitive code. Complex problems where you need to build your mental model as the agent explores. This is your training ground. You're developing trust and intuition.

Sam: And autonomous?

Alex: Fire-and-forget. You give the agent a well-defined task from your plan, let it run, check results when done. You're doing other things. Working on another project. Attending a meeting. Cooking dinner. This is where the real productivity happens.

Sam: I think a lot of people will misunderstand that claim. Shouldn't one agent finishing faster be better than the agent finishing while you cook?

Alex: Individually, maybe. But imagine you have three agents running in parallel on different projects. You're checking on them periodically but mostly working on something else or actually living your life. You're shipping more total code than if you were babysitting one agent through a single task. The real 10x productivity gain isn't speed per task. It's parallel work and continuous output.

Sam: That's only possible if the agent reliably produces good output, though.

Alex: Which is why phases one and two matter so much. If you research and plan well, autonomous mode works. If you skip those phases, the agent drifts, hallucinates, produces garbage. The entire system depends on quality upfront context and clear direction.

Sam: And phase four is validation. How does that work?

Alex: First principle: LLMs are probabilistic. They almost never produce 100% perfect output on first pass. That's not failure. It's expected. Your goal isn't to verify perfection. It's to identify what's wrong, then decide: iterate with fixes or regenerate from scratch?

Sam: How do you decide?

Alex: Iterate when the foundation is right but has gaps. Missing edge cases. Some tech debt. Incomplete error handling. The approach is sound. Regenerate when something fundamental is wrong. The architecture doesn't match your mental model. The agent misunderstood requirements. The approach itself is flawed. Don't patch fundamentally broken code. Fix your context and regenerate.

Sam: And the agent can help you validate its own work?

Alex: It's better at finding issues in code than generating perfect code initially. Use it to review its own output. Have it write tests as guardrails. Run the code yourself—actually use it. That five minutes of manual testing reveals more than an hour of code review. Then run your build, tests, linters. If those pass and behavior matches your plan and mental model, you probably ship.

Sam: So the workflow closes back on itself?

Alex: It's iterative. Validation often reveals gaps in research or flaws in planning. That's expected. The value isn't executing each phase perfectly first time. It's having a systematic framework that catches issues before they compound. You research, you plan, you execute, you validate. If validation shows you misunderstood something, you loop back, research deeper, replan, regenerate.

Sam: There's a lot of discipline in that.

Alex: There is. But here's what it actually means: you're not working harder. You're working smarter. You're thinking more explicitly about what you want before asking for it. You're validating strategically instead of exhaustively. You're delegating the part of engineering that machines are genuinely good at—pattern replication—and keeping the part humans are good at—architectural thinking, judgment, knowing what matters.

Sam: And that actually lets you do more?

Alex: Yes. Because you're parallel-processing multiple projects. You're not blocked. You're maintaining longer stretches of output. You're working at a higher level of abstraction. You're shipping more code in less time, and you're still shipping it under your name with your standards. You've just redefined what those standards mean.

Sam: Okay, I'm getting it. So the workflow is the structure. But how do you actually communicate all this research and planning to the agent?

Alex: That's prompting. That's lesson four. The workflow tells you what to do. Prompting tells you how to do it effectively.

Sam: Because you could do research, planning perfectly, then completely fail at communicating it to the agent.

Alex: Exactly. There's no point in doing great research if your prompt makes the agent ignore it. The framework is worthless if your directions are vague. That's where we go next.
