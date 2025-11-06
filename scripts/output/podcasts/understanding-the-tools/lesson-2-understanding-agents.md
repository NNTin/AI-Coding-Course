---
source: understanding-the-tools/lesson-2-understanding-agents.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T13:47:17.888Z
model: claude-haiku-4.5
tokenCount: 2011
---

Alex: In Lesson 1, we established this foundational model: LLMs are brains - token prediction engines - and agent frameworks are bodies that execute actions. Now we're going to understand how these actually work together in practice.

Sam: So when we say "work together," we're talking about something beyond just hitting an LLM API and getting code back, right?

Alex: Exactly. A lot of people conflate agents with chat interfaces, but they're fundamentally different. An agent is a feedback loop. It's the LLM reasoning about a goal, taking an action, observing the result, and then iterating based on what it learned.

Sam: Can you give me a concrete example of what that loop actually looks like?

Alex: Sure. Imagine you ask an agent to add authentication to an API. In a chat interface, you'd describe what you want, get code back, manually edit your files, run into an error, paste that error back into the chat, and ask for a fix. It's manual handoff after handoff.

Sam: Right, you're the integration point between the LLM and the actual system.

Alex: Precisely. But with an agent, you give it one instruction: "Add authentication to this API." The agent then reads the relevant files, understands the structure, plans what needs to change, makes edits, runs tests, sees the tests fail, analyzes why, applies a fix, runs tests again, and either continues iterating or stops when tests pass. The entire cycle closes without you intervening.

Sam: So the loop is really the differentiator here - it's not just faster response time, it's fundamentally different work.

Alex: Right. The agent closes the gap between thinking and verification. That's what makes it an agent rather than just a smart autocomplete.

Now here's where it gets interesting - and this is foundational to understanding how to actually work with agents effectively. Everything happening in that loop is just text flowing through a context window.

Sam: Just text?

Alex: Just text. No magic internal reasoning engine, no hidden state. When an agent is working on your codebase, you're watching a continuous stream of text unfold in one large buffer. System instructions, your task description, tool outputs, the agent's reasoning, everything is visible as text.

Sam: That seems like it should be obvious, but I think most people have the intuition that the LLM is doing some kind of "thinking" separately from what they see.

Alex: That's the mental model that gets people in trouble. And it's gotten more complicated recently with extended thinking modes. Anthropic and OpenAI now offer versions where the model generates hidden reasoning tokens before producing visible output. What you see in the context is a summary of that internal chain-of-thought, not the actual reasoning process. You're paying for all those hidden tokens, but you can't inspect what actually happened.

Sam: So you're paying for computation you can't audit or debug.

Alex: Exactly. And that's relevant to how you architect your agent workflows. But the core point stands: the agent's entire world is what exists in the context window. It doesn't know what happened in previous conversations. It has no persistent memory. Each response is generated purely from the text currently visible.

Sam: That sounds like a limitation, though.

Alex: It's inverted thinking. It's actually a massive advantage. Because the LLM is completely stateless, you have total control over what it knows. If you want the agent to forget a bad architectural decision it made and explore an alternative approach, you don't have to fight through previous reasoning. You just shape what context it sees.

Sam: So you're engineering what's in the context to steer behavior?

Alex: Exactly. And here's where it gets powerful: the statelessness means the agent can objectively review its own work. It can write code, and then in the same conversation, review that code as if someone else wrote it. It doesn't know it was the author unless you tell it.

Sam: Wait, that actually enables some really useful patterns. You could have it generate code, then without telling it who wrote it, ask for a security review.

Alex: Precisely. You could run multiple perspectives on the same code without the agent defending its earlier decisions. You could explore A/B approaches to a problem, have it review both, without any cross-contamination or ego investment in the first approach.

Sam: That's clever. So understanding that the agent is stateless and textual fundamentally changes how you structure your interactions with it.

Alex: It does. And this is system design thinking. You're already good at designing interfaces and contracts in your services architecture. This is the same discipline applied to text.

Now, agents become useful through tools - functions they can invoke to interact with the world. Built-in tools like Read, Edit, Bash, Grep, Write - these aren't just thin wrappers around shell commands. They're engineered with edge case handling, output formats optimized for token efficiency, and safety guardrails.

Sam: So the tooling is purpose-built for the LLM's constraints?

Alex: Right. But you can also extend this through a standardized plugin system called MCP - Model Context Protocol. You can connect your agent to databases, APIs, cloud platforms, whatever you need. The agent discovers those tools at runtime.

Sam: Alright, so we've established that agents are fundamentally feedback loops, everything is text, and the statelessness is actually an advantage. What differentiates CLI agents from other agent interfaces out there?

Alex: This is important for practical productivity. Chat interfaces like ChatGPT excel at brainstorming and answering questions. They're conversational. IDE agents like Cursor are deeply embedded in a single project. They're tightly coupled to one window.

CLI agents are different. You can open multiple terminal tabs and run agents on different projects simultaneously. One tab refactoring project-a, another debugging project-b, a third implementing in project-c. They work independently while you context-switch freely.

Sam: So it's the parallelism advantage. You're not blocked waiting for a single agent to complete.

Alex: Exactly. And you're not manually copying and pasting code between interfaces like you would with chat. Each agent has direct access to its project context. That's why CLI agents deliver superior developer experience for actual implementation work.

Now, all of this connects to a larger principle we'll explore throughout this course: effective AI-assisted coding is about engineering context to steer behavior. The context window is the agent's entire world. You control what's in it through your prompts, through what tool results you feed back, through how you structure information. Vague context produces wandering behavior. Precise, scoped context steers the agent exactly where it needs to go.

Sam: And you can adjust that mid-conversation if it drifts?

Alex: Absolutely. You can dynamically steer the conversation as you learn what the agent needs. You can even use that stateless property to have it take a fresh look at a problem. The point is - you're already thinking in systems and interfaces. Apply that same rigor to text, and you'll work with agents far more effectively.

Sam: So it's not about prompt magic or secret incantations. It's structural thinking about what information the agent needs and how you present it.

Alex: That's exactly right. And that's what the rest of this course is going to teach you - how to apply those skills to real coding scenarios, how to structure complex workflows, how to think about when to parallelize work across agents. But you now understand the fundamental mechanics: agents are feedback loops of text, stateless, and you steer them through context engineering.

Sam: Got it. This is solid foundation for the practical stuff coming next.

Alex: It is. And once you internalize that agents are just text and you control that text, everything else becomes much clearer.
