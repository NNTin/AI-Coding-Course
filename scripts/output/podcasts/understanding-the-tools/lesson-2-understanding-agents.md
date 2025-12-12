---
source: understanding-the-tools/lesson-2-understanding-agents.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T10:17:17.452Z
model: claude-opus-4.5
tokenCount: 2337
---

Alex: In the last lesson we established that LLMs are brains - token prediction engines - and agent frameworks are bodies that execute actions. Today I want to dig into how these pieces actually work together to create something that can autonomously complete complex coding tasks.

Sam: Right, because there's a real difference between chatting with an LLM and using an agent. I've used both, but I'm not sure I could articulate precisely what makes them different under the hood.

Alex: The key difference is the feedback loop. An agent isn't just responding to prompts - it's running a continuous cycle: perceive, reason, act, verify, iterate. And crucially, it does this autonomously without requiring you to manually intervene between steps.

Sam: Can you make that concrete? What does that loop actually look like?

Alex: Sure. Think about implementing a feature with a chat interface versus an agent. With chat, you ask "How should I add authentication to this API?" The LLM gives you code. Then you manually edit files. You hit an error, go back to the chat, paste the error. Get another suggestion. Manually edit again. You're the one closing the loop between each step.

Sam: You're the execution layer.

Alex: Exactly. Now with an agent, you say "Add authentication to this API." The agent reads the API files - that's perceive. It plans the implementation - that's reason. It edits the files directly - act. It runs the tests - observe. Tests fail, so it analyzes the error - reason again. Fixes the code, runs tests, tests pass, done. The entire cycle happens without you touching anything.

Sam: So the agent is closing that feedback loop automatically. That's a significant productivity difference when you're doing real implementation work.

Alex: It is. But here's what I really want to demystify today: despite how sophisticated this seems, everything happening under the hood is just text flowing through a context window. No magic, no separate reasoning engine, no hidden state.

Sam: Wait, break that down. What do you mean "just text"?

Alex: When you interact with an agent, you're watching a conversation unfold in a single, large text buffer. Your prompt goes in as text. The system instructions are text. When the agent calls a tool like Read or Bash, that tool call is text. The result comes back as text. The agent's response is text. It's all one continuous stream.

Sam: So when I see the agent "thinking" - like when it says "I should check the validation logic first" - that's not some internal cognitive process?

Alex: No, that's literally text being generated in the context window. It's visible to you and to the LLM itself. The agent doesn't think separately from its output. Now, there's a wrinkle here with extended thinking modes - Anthropic and OpenAI both offer these now. The model generates hidden reasoning tokens before producing visible output. What you see is a summary, not the full chain of thought. You're billed for those hidden tokens, but you can't inspect or debug them.

Sam: That's interesting from a debugging standpoint. If the reasoning is opaque, how do you troubleshoot when something goes wrong?

Alex: You work with what you can see. And understanding the textual nature helps enormously. Let me give you a concrete example. When you ask Claude Code to "Add email validation to the registration endpoint," the context window contains system instructions, your task, and then the agent starts generating. It might say "I'll use the Read tool to examine the registration endpoint." That tool call goes into the context as text. The file contents come back as text. The agent reasons about what it sees, suggests an edit, uses the Edit tool - all text. Then maybe it runs tests with Bash - the command is text, the output is text.

Sam: So the context window is accumulating this entire interaction history.

Alex: Right. And this has practical implications. First, the agent only knows what's in that context. If something scrolled out because the context got too long, the agent has effectively forgotten it. Second, you're adding text to a conversation, not issuing commands to a system that maintains state. Third, context windows are finite - complex tasks can lose details as earlier context gets pushed out.

Sam: That explains some behavior I've seen. Long sessions where the agent seems to forget decisions it made earlier.

Alex: Exactly. And here's the insight that really changes how you work with these tools: the LLM is completely stateless. Its only world is the current context window. It doesn't remember previous conversations. There's no hidden internal state. When it continues a conversation, it sees its previous responses as text in the context, not as memories it recalls.

Sam: That sounds like a limitation, but I'm guessing you're about to tell me it's actually an advantage.

Alex: It's a massive advantage. You control what the agent knows by controlling what's in the context. Think about clean-slate exploration. Start a new conversation, and the agent has no bias from previous decisions. You can ask it to implement authentication with JWT in one context, sessions in another. Each approach gets evaluated on its merits without the agent defending earlier choices.

Sam: That's useful for exploring design alternatives without fighting against accumulated bias.

Alex: And here's where it gets really powerful: unbiased code review. The agent can critically audit its own work if you set it up correctly. In one context, the agent writes code and might say "looks sound overall" when you ask for feedback. Start a fresh context, don't reveal that the agent wrote the code, and suddenly it's flagging "Critical security vulnerabilities: localStorage exposes tokens to XSS attacks."

Sam: Because it has no defensive bias about its own work. It's treating the code as if someone else wrote it.

Alex: Exactly. This enables generate-review-iterate workflows where the agent writes code and then objectively audits it. Or multi-perspective analysis - security review in one context, performance review in another, each with a clean slate.

Sam: So context engineering is the real skill here. You're designing the information environment the agent operates in.

Alex: That's the core truth of this entire course. Effective AI-assisted coding is about engineering context to steer behavior. The context window is the agent's entire world. Vague context produces wandering behavior. Precise, scoped context steers the agent exactly where you need it. You can steer upfront with focused prompts, or dynamically mid-conversation when the agent drifts.

Sam: Let's talk about tools for a moment. You mentioned Read, Bash, Edit. How do agents actually interact with the world?

Alex: Tools are functions the LLM can call. CLI coding agents ship with purpose-built tools - Read, Edit, Bash, Grep, Write, Glob. These aren't just wrappers around shell commands. They're engineered with edge case handling, LLM-friendly output formats, safety guardrails, and token efficiency.

Sam: And for external systems?

Alex: That's where MCP comes in - Model Context Protocol. It's a standardized plugin system for adding custom tools. You can connect your agent to database clients like Postgres or MongoDB, API integrations for Stripe or GitHub or Figma, cloud platforms like AWS, GCP, Azure. Configure MCP servers in your settings, and the agent discovers their tools at runtime.

Sam: So the agent's capabilities are extensible.

Alex: Very much so. And this brings me to why CLI coding agents specifically win for implementation work. While chat interfaces are great for answering questions and brainstorming, CLI agents deliver superior developer experience for actual coding.

Sam: What makes the CLI form factor better?

Alex: The concurrent work advantage. Multiple terminal tabs means multiple agents working on different projects simultaneously. You can have one agent refactoring in project A, another debugging in project B, a third implementing a feature in project C. Context-switch freely. Each agent keeps working independently.

Sam: Compared to IDE agents like Cursor that are coupled to a single window.

Alex: Right. IDE agents block you until they complete, or you cancel and lose context. Chat interfaces reset context with each conversation and require manual copy-paste. CLI agents unlock parallelism without managing conversation threads or multiple IDE instances.

Sam: We'll presumably cover how to coordinate that parallelism effectively.

Alex: Lesson 7 goes deep on planning and execution strategies - when to parallelize versus serialize tasks, how to coordinate multi-project workflows. But the key takeaway for now is that you're applying system design thinking to text. You already know how to design interfaces and contracts. The rest of this course is about applying those skills to engineer context and steer agents across real coding scenarios.

Sam: So we've established the mental model: agents are feedback loops, everything is text in a context window, LLMs are stateless, and that statelessness is actually a feature that gives you control. Context engineering is the core skill.

Alex: That's the foundation. Next lesson we'll get into the high-level methodology - the practical patterns for how to actually apply this understanding.
