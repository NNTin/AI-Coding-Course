---
source: understanding-the-tools/lesson-2-understanding-agents.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T09:57:51.535Z
model: claude-haiku-4.5
tokenCount: 1889
---

Alex: Last lesson we established the fundamental architecture: LLMs are brains that predict tokens, and agent frameworks are bodies that execute actions. Now we need to understand how these work together. The key insight is that an agent isn't just an LLM responding to your prompts. It's a feedback loop - perceive, reason, act, verify, and iterate.

Sam: So it's fundamentally different from just chatting with an LLM and copying the responses yourself?

Alex: Completely different. Let me illustrate with authentication. In a chat interface, you ask for authentication code, you get a response, you manually edit your files, you run it, something breaks, you ask for help, you manually edit again. The LLM is passive - it responds when you prompt it.

Sam: Right, you're the orchestrator between the LLM and the actual execution.

Alex: Exactly. With an agent, you give a single instruction: "Add authentication to this API." The agent reads your API files, reasons about what needs to happen, edits the code, runs tests, observes they fail, analyzes the error, fixes the code, runs tests again, and stops when they pass. The entire feedback loop is autonomous. The agent closes the loop without waiting for you.

Sam: That's a massive shift in how you work. You're not managing the back-and-forth.

Alex: Right. And here's what makes this work: understanding what's actually happening under the hood. When you interact with an agent, there's no magic. There's no separate reasoning engine or hidden state. Everything - and I mean everything - is just text flowing through a context window. Your instructions, the agent's reasoning, tool calls, results, responses, everything is a single continuous text stream.

Sam: So when the agent says "I should check the validation logic," that's not internal thought, that's literally text being generated and visible in the context?

Alex: Exactly. That text is visible to both you and the LLM itself in the next iteration. Now, there's a complication here with extended thinking modes. Anthropic and OpenAI now offer extended thinking where the model generates hidden reasoning tokens before producing visible output. What you see is a summary of that chain-of-thought, not the full reasoning process. You're billed for all those hidden reasoning tokens, but you only see an abbreviated version. The actual reasoning is opaque to you - you can't debug it or inspect it.

Sam: That's interesting. So you lose some transparency there.

Alex: You do. But the fundamental principle still holds: the agent's only knowledge is what's in that context window. If it forgets something, it's not a memory issue - something scrolled out of context. If it makes a decision you don't like, you can see exactly why because the entire decision-making process is text in the context.

Sam: That actually gives you a lot of control then. You can see the full chain and intervene.

Alex: Exactly. And here's where it gets really powerful: the LLM is completely stateless. It has no hidden internal state. Each response is generated purely from the current context. When the conversation continues, the LLM sees its previous responses as text in the context, not as memories. Now, most people think that's a limitation. Actually, it's a massive advantage.

Sam: How so?

Alex: You have total control over the agent's "memory." You decide what it knows by controlling what's in the context. If you want the agent to explore an alternative approach, you don't need to worry about it defending previous decisions. Each conversation is a clean slate. You can even ask the agent to review its own code, and here's the key part: the agent doesn't know it wrote that code unless you tell it. It reviews the code objectively as if someone else wrote it. No ego, no defensive justification. You get unbiased verification.

Sam: That's clever. So you could generate one implementation, then in a separate context ask for a critical security review of that code without bias.

Alex: Precisely. Or performance review. Or ask for completely different implementations and compare them. The agent can A/B test approaches without cross-contamination. You're designing the context like you'd design an interface contract - precise inputs produce steered behavior.

Sam: So the stateless nature is actually a feature for developers.

Alex: It is. It shifts your mindset from "Does the agent remember what I said?" to "What text am I putting in the context window to steer this behavior?" That's the mental model that makes you effective with agents.

Sam: Let's talk about tools then. How do agents actually interact with the outside world?

Alex: Through tools - functions the LLM can call. Built-in tools like Read, Edit, Bash, Grep, Write, Glob - these aren't just shell wrappers. They're engineered with edge case handling, safety guardrails, and token-efficient output formats specifically designed for LLM reasoning.

Sam: And when those built-in tools aren't enough?

Alex: That's where MCP - Model Context Protocol - comes in. It's a standardized plugin system for adding custom tools. You can connect agents to database clients, API integrations, cloud platforms. Configure MCP servers in your settings, and the agent discovers their tools at runtime. You're essentially extending the agent's capabilities into any system you can write an MCP server for.

Sam: So MCP is the integration layer.

Alex: Right. It's how you make agents work with your actual infrastructure.

Sam: You mentioned earlier that CLI agents have advantages over IDE agents or chat interfaces. What's that about?

Alex: Multiple terminal tabs give you multiple agents working on different projects simultaneously. Open three tabs, one agent refactoring project-a, another debugging project-b, another implementing project-c. They work independently in parallel. IDE agents are tightly coupled to a single window - you're blocked until the agent finishes or you lose context. Chat interfaces reset context with each conversation. You're manually copying code and executing changes. CLI agents unlock parallelism without managing conversation threads or multiple IDE instances.

Sam: That's a significant workflow difference.

Alex: It fundamentally changes productivity. But here's what matters most: understanding that agents are text-steerable systems. You control the context window - that's the agent's entire world. Vague context produces wandering behavior. Precise, scoped context steers the agent exactly where you need it. You can steer upfront with focused prompts or dynamically mid-conversation when the agent drifts. The stateless nature even lets you steer the agent to objectively review its own work in a fresh context.

Sam: So effective AI-assisted coding is really about context engineering.

Alex: Exactly. It's system design thinking applied to text. You already know how to design interfaces and contracts - precise specifications, clear responsibilities, bounded scopes. That's exactly what you're doing when you engineer context for an agent. You're designing a contract between yourself and an autonomous system. The rest of this course teaches how to apply those skills across real coding scenarios - how to prompt effectively, how to structure complex work, how to maintain quality as agents grow more autonomous.

Sam: That makes sense. So we're learning a new form of system design.

Alex: That's the right framing. Next lesson we'll start looking at the methodology - the actual high-level approach to working with agents effectively.
