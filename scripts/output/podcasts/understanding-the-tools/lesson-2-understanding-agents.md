---
source: understanding-the-tools/lesson-2-understanding-agents.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:13:28.685Z
model: claude-haiku-4.5
tokenCount: 2290
---

Alex: In lesson one, we established something fundamental: LLMs are brains - token prediction engines - and frameworks are bodies, execution layers. Today we need to understand how they actually work together to accomplish things. Because there's a profound difference between asking an LLM a question and having an agent autonomously solve a problem.

Sam: Right. So when I chat with ChatGPT and ask "how do I add authentication to my API," the LLM gives me code, and then I'm the one actually making changes, running tests, debugging. That's not autonomous.

Alex: Exactly. You're manually closing the loop. The agent's job is to close that loop automatically. Let me describe what I mean by the execution loop. It's: perceive, reason, act, verify, iterate. The agent observes its environment, thinks about what to do, takes an action, checks the result, and if needed, loops back.

Sam: So the agent reads files, figures out what needs to happen, makes the change, runs tests, sees what broke, reasons about why, and fixes it without me intervening.

Alex: Without you intervening at all. That's the critical difference. A chat interface requires manual intervention between each step. You're the glue. An agent is the glue - it loops until the goal is achieved.

Sam: That sounds powerful but also... how does it know when it's done? Or when to stop looping?

Alex: Good question. The agent has a termination condition - usually it's "the tests pass" or "the feature is complete and verified." Without that, you're right, you'd end up in infinite loops. But the loop terminates when the verification step passes.

Sam: And I'm assuming the agent can also encounter situations where it gets stuck, hits a genuine blocker, and needs to ask for help.

Alex: Absolutely. Or it fails repeatedly and decides it needs a different approach. The loop is deterministic in its structure but flexible in its path. Now here's what I want you to understand on a deeper level: all of this is just text.

Sam: Just text?

Alex: Just text. There's no magic happening. No hidden reasoning engine. No separate inference pipeline. When an agent is working on your problem, you're watching a conversation unfold in a single text buffer. That buffer is the agent's entire world.

Sam: That seems like an important thing to wrap my head around. Can you walk me through what's actually happening?

Alex: Sure. Imagine you tell the agent "add email validation to the registration endpoint." What flows through the context window? Your system prompt - those are instructions. Then your task. Then the agent calls a tool to read the registration code. That tool result appears as text. The agent reasons about what it sees - that reasoning is text being generated. It calls another tool to edit the file. That tool result shows up as text. And so on.

Sam: So when I see the agent "thinking" or saying "I should check the validation logic," that's not internal thought, that's literally text it's generating that I can see.

Alex: Exactly. The agent doesn't have a separate thinking layer - it's all in the context. Now, there's a complication here with extended thinking modes. Some providers like Anthropic and OpenAI have models that generate hidden reasoning tokens before producing visible output. So you see a summary of the chain-of-thought, not the full reasoning.

Sam: And you're paying for the full hidden reasoning, right?

Alex: Right. The full token count includes that hidden work, but you don't see it. It's opaque. Which means you can't debug it. That's something to keep in mind when you're reasoning about what the model is doing.

Sam: So the practical implication is that everything the agent "knows" is what's in the context right now. If something scrolled out of context, it's lost.

Alex: Completely. The agent has no persistent memory. No hidden state. Each response is generated purely from what's visible in the context window. This sounds like a limitation, but it's actually a feature.

Sam: How is that a feature?

Alex: Because it means you have total control over what the agent knows. You decide what's in the context. You're engineering its memory, essentially. Want the agent to forget a failed approach and try something different? Start a fresh conversation. Want it to review its own code objectively? Don't tell it that it wrote the code - it will review it like someone else did.

Sam: Wait, that's clever. The agent has no ego about its own work because it genuinely doesn't know it wrote it unless you tell it.

Alex: Exactly. The agent can review code with fresh eyes. No defensive justification of past decisions. This enables some powerful workflows. You can have the agent generate code, then review it from a security perspective in the same conversation. Or a performance perspective. Or have it generate two competing implementations and objectively compare them.

Sam: Because each time you're essentially asking a fresh LLM with partial context, not a model that's invested in defending previous choices.

Alex: Precisely. Now, another huge implication: you can actually design your prompts to control what context the agent sees. If you want unbiased code review, you engineer the context to not reveal who wrote it. If you want the agent to follow existing patterns, you include examples in the context. The agent's "knowledge" is entirely what you architect into the conversation.

Sam: That's shifting how I think about prompting. It's not just asking questions, it's designing a system where the context steers behavior.

Alex: That's exactly it. Now let's talk about tools, because agents are only as useful as the tools they can call. Tools are functions the agent can invoke to interact with the world. Some are built-in.

Sam: Built-in tools are the ones that ship with the framework?

Alex: Right. Read, Edit, Bash, Grep, Write, Glob. These aren't just thin wrappers around shell commands. They're engineered with edge-case handling, output formats that are efficient for the LLM to parse, safety guardrails, and token efficiency. They're optimized for the specific job of AI-assisted coding.

Sam: And you can also add custom tools through MCP?

Alex: Model Context Protocol. It's a standardized way to add custom tools. You can connect agents to databases, APIs, cloud platforms - anything you can write a tool for. Stripe integration, GitHub, Figma, AWS. You configure the MCP servers in your settings, and the agent discovers the available tools at runtime.

Sam: So the agent sees a database client as just another tool it can call, same as it would call "read this file."

Alex: Exactly. From the agent's perspective, it's all the same - tools are tools. The difference is custom tools connect you to your own infrastructure. But here's something important to understand: not all AI coding interfaces are equal. Chat interfaces like ChatGPT or Copilot Chat excel at brainstorming and explaining. But CLI agents - the ones you run in a terminal - they're fundamentally different for actual development work.

Sam: Different how?

Alex: Concurrency. Open three terminal tabs with three agents working on different projects simultaneously. One's refactoring in project-a, another's debugging in project-b, a third's implementing a feature in project-c. Each agent keeps working independently. You can context-switch between them freely.

Sam: Versus an IDE agent where you're locked to that one project and window.

Alex: Right. And chat interfaces lose context with each new conversation - you're copying and pasting code back and forth. CLI agents unlock parallelism without managing conversation threads or multiple IDE instances. That's a massive developer experience advantage.

Sam: So there's a throughput difference. If you're juggling multiple projects, CLI agents let you actually parallelize.

Alex: Exactly. Now, all of this brings us back to the core insight: effective AI-assisted coding is about engineering context to steer behavior. The context window is the agent's entire world. Everything it knows comes from the text flowing through it. You control that text.

Sam: System prompt, my instructions, tool results, the conversation history itself.

Alex: All of it. Vague context produces wandering behavior. Precise, scoped context steers the agent exactly where you need it. You can steer upfront with focused prompts, or dynamically mid-conversation when the agent drifts. The stateless nature means you can even steer the agent to objectively review its own code in a separate conversation.

Sam: This is system design applied to text. You're designing interfaces and contracts, which we already know how to do.

Alex: That's the insight right there. The rest of this course teaches how to apply those skills - interface design, contract thinking - to engineer context and steer agents through real coding scenarios. We're moving from "what is an agent" to "how do I architect my interaction with one to get reliable results."

Sam: And that feels like the shift from "asking tools questions" to "building systems with them."

Alex: That's exactly the shift. That's where the real value emerges.
