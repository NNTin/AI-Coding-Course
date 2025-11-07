---
source: understanding-the-tools/lesson-2-understanding-agents.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T15:05:21.423Z
model: claude-haiku-4.5
tokenCount: 2337
---

Alex: So in Lesson 1, we established the mental model: LLMs are brains - token prediction engines - and agent frameworks are the bodies that let them execute actions in the real world. Now the question is: how do these actually work together?

Sam: Right. Because an LLM by itself just generates text. How does it become something that can complete a task end-to-end?

Alex: Through a feedback loop. An agent isn't just a single LLM call that returns text. It's a cycle: perceive, reason, act, observe, and then iterate based on what it learned. The critical difference from a chat interface is automation.

Sam: Can you give me a concrete example?

Alex: Sure. With a chat interface, you're manually looping. You ask the LLM for authentication code, it gives you suggestions, you edit files, you get an error, you ask again, it gives a fix, you apply that manually. Each step requires human intervention.

Sam: You're the loop closure mechanism.

Alex: Exactly. With an agent, you say "Add authentication to this API" once, and the agent handles the entire cycle automatically. It reads the API files, plans the implementation, edits the code, runs tests, sees they fail, analyzes the error, fixes it, runs tests again, and stops when they pass. All without you intervening.

Sam: So the agent can see the results of its actions and course-correct.

Alex: And that's what makes it powerful. It's not just faster - it's fundamentally different. The agent is closing the feedback loop autonomously. That changes the entire interaction model.

Sam: Okay, that makes sense. But how is this actually implemented? What's happening under the hood?

Alex: Here's the fundamental insight that demystifies the whole thing: everything is just text. No magic. No hidden reasoning engine. Just text flowing through a context window.

Sam: Text?

Alex: Think about it. When you interact with an agent, you're watching a conversation unfold in a single, large text buffer. System instructions as text, your task as text, tool calls as text, results as text, the LLM's reasoning as text. All of it just text in one continuous stream in the context window.

Sam: So when the agent is "thinking" - when you see it say something like "I should check the validation logic" - that's not separate internal computation?

Alex: Correct. That's the agent literally generating text. And here's the important part: the LLM sees that text in the context too. It's not hidden reasoning. The agent is writing down its thinking, and then that becomes part of the conversation the LLM sees.

Sam: That's actually quite different from how I was picturing it. I was imagining some kind of internal deliberation separate from output.

Alex: That's the common misconception. Though I should mention - providers like Anthropic and OpenAI now offer extended thinking modes where the model does generate hidden reasoning tokens before producing visible output. You see a summary of that thinking, not the full process. And you're billed for all those hidden tokens even though you don't see them. So it's more opaque. But the fundamental point stands: the agent's world is what's in the context window.

Sam: This matters because...?

Alex: Because it changes how you predict behavior and debug problems. The agent only knows what's in the context. If it forgets something, it probably scrolled out of context. If it's making weird decisions, you can inspect the full conversation and see exactly what information it's working from. You're not guessing at hidden state.

Sam: You can see the complete picture of what the agent sees.

Alex: Right. Which brings me to the most important insight: the LLM is completely stateless. It has no memory between conversations. No hidden internal state. Each response is generated entirely from the text currently in the context.

Sam: That sounds like a limitation.

Alex: It's the opposite. It's a massive advantage. You control what the agent knows by controlling what's in the context. You decide what history matters, what examples are relevant. You're engineering the agent's entire world through the context you provide.

Sam: Give me a scenario.

Alex: Say you ask an agent to implement feature A, it writes code, you realize you want a different approach. With a human colleague, they're mentally invested in the first approach. They might defend it or be anchored to it. With the agent? You start a fresh conversation about approach B. The agent doesn't carry baggage from the previous decision because it literally has no memory of it unless you include that history in the new context.

Sam: Each conversation is a clean slate.

Alex: Exactly. And this enables some powerful workflows. You can generate code, then ask the agent to review it without telling it who wrote it. The agent doesn't know it wrote that code unless you tell it. So it reviews it with fresh eyes, completely objectively.

Sam: That's interesting. An unbiased code review from the same agent that wrote the code.

Alex: That's one application. You can also explore A/B testing approaches - show the agent two different implementations and ask which is better without cross-contamination. Or get a security review in one context and a performance review in another, treating them as separate analyses.

Sam: So the implication for how we work with agents is that we should be intentional about what context we give them.

Alex: Absolutely. The stateless nature means you're designing context like you'd design an API contract. You decide what inputs matter, what examples are relevant, what constraints exist. That's system design thinking applied to text. And honestly, if you're a good architect, you're already thinking this way.

Sam: Let's shift gears. You mentioned tools. An agent needs to actually do things - read files, execute code, that kind of thing.

Alex: Agents have two categories of tools. Built-in tools optimized for speed: Read, Edit, Bash, Grep, Write, Glob. These aren't just wrappers around shell commands. They have edge case handling, LLM-friendly output formats, safety guardrails, token efficiency. They're engineered specifically to work well with agents.

Sam: And then external tools?

Alex: There's a standardized protocol called MCP - Model Context Protocol. It's a plugin system. You can connect agents to external systems through MCP: database clients, APIs like Stripe or GitHub, cloud platforms. Configure an MCP server in your settings, and the agent discovers its tools at runtime and can call them.

Sam: So the agent's capabilities scale based on what you configure.

Alex: Right. The agent itself doesn't change. You're just giving it access to different tools based on what the task needs.

Sam: Now I want to push back on something. You mentioned CLI coding agents versus IDE agents versus chat interfaces. Why does the delivery mechanism matter?

Alex: Because of parallelism. Open three terminal tabs, run agents on different projects simultaneously. One's refactoring, one's debugging, one's implementing. You context-switch freely. Each agent keeps working independently.

Sam: But an IDE agent is integrated into your editor...

Alex: Which makes it powerful for flow on a single project, but you're blocked until it finishes or you lose context by canceling. You're tightly coupled to one window. Chat interfaces reset context with each conversation and require you to manually copy-paste code and apply changes.

Sam: So CLI agents solve the parallelism problem.

Alex: Multiple independent agents, each with their own context, running concurrently on different problems. That's a fundamentally different capability. You're not just getting faster code generation - you're unlocking a workflow that wasn't possible before.

Sam: That seems like it would compound over time. If you can work on three projects simultaneously...

Alex: That's where the real productivity game changes. But that's something we'll dive deeper into in Lesson 7 when we talk about planning and execution across multiple concurrent tasks.

Sam: Fair. So zooming back out: we've talked about the feedback loop, the textual nature of agents, the stateless design, and tools. Is there a unifying principle here?

Alex: Yes. Effective AI-assisted coding comes down to one thing: engineering context to steer behavior. The context window is the agent's entire world. Everything it knows, every decision it makes, comes from the text flowing through it. You control that text. You decide the system prompt, your instructions, what tool results are relevant, which conversation history matters.

Sam: So it's like designing an API interface, but for text instead of code.

Alex: Exactly. Vague context produces wandering behavior. Precise, scoped context steers the agent exactly where you need it. You can steer upfront with focused prompts, or dynamically mid-conversation when the agent drifts. The stateless nature means you can even ask the agent to review its own work in a fresh conversation.

Sam: And because you understand the textual nature and the stateless design, you can be intentional about what goes into that context.

Alex: That's it. This is system design thinking applied to text. And the rest of this course is about teaching you how to apply those skills to engineer context and steer agents across real coding scenarios.
