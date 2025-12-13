---
source: methodology/lesson-5-grounding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T14:43:21.033Z
model: claude-opus-4.5
tokenCount: 3083
---

Alex: Let me paint a scenario that happens constantly in production. You ask your agent to fix an authentication bug. It confidently generates a solution using JWT verification patterns—clean code, follows best practices. One problem: your codebase uses sessions, not JWTs. The agent just hallucinated a plausible implementation based on common patterns from its training data.

Sam: Because the agent doesn't actually know your codebase exists. It's working from statistical patterns frozen at its training cutoff.

Alex: Exactly. And this gets at the fundamental issue we covered in Lesson 2—the context window is the agent's entire world. Everything outside it literally doesn't exist to the model. Without explicit grounding in your actual code and current documentation, agents generate statistically plausible solutions that may be completely wrong for your system.

Sam: So grounding is how you inject reality into that context window before the agent starts generating.

Alex: Right. You retrieve relevant external information—your codebase patterns, current docs, best practices—and feed it to the agent before generation. The difference is stark. Without grounding, you get generic training patterns, guessed architecture, hallucinated implementations. With grounding, you get solutions built from your actual code that integrate cleanly with your system.

Sam: Let's talk about how agents discover codebases in the first place. When I say "fix the authentication bug," the agent starts with zero knowledge of where auth code even lives.

Alex: That's agentic search—the agent discovers your codebase autonomously by calling tools on its own. Glob finds files matching patterns, Grep searches for keywords, Read examines code. The agent decides what to search, interprets results, determines next steps. In small codebases under 10,000 lines, this works beautifully. Two or three searches return 5-10 files totaling maybe 15,000 tokens. The agent reads them, builds a mental model, solves the problem.

Sam: But that breaks down at scale.

Alex: Dramatically. Search "authentication" in a 100,000-line project and you get 80-plus files. Reading them consumes 60,000 or more tokens before discovery even finishes. That's half your effective context window gone. And here's the critical problem—the information you provided up front, your constraints and requirements, gets pushed into the middle of the context as search results flood in.

Sam: Which brings us to the context window illusion. Claude Sonnet 4.5 advertises 200,000 tokens, but what's the reality?

Alex: Reliable attention spans 60,000 to 120,000 tokens—roughly 30 to 60 percent of advertised capacity. This comes from transformer architecture itself. The attention mechanism follows a U-shaped curve: the beginning and end of your context get strong attention, but the middle gets skimmed or missed entirely. This isn't a bug you can fix—it's how transformers work under realistic constraints.

Sam: So if agentic search fills your context with search results, your original constraints end up in that ignored middle zone.

Alex: Exactly. Three Grep searches return 18,000 tokens. Reading five files adds another 22,000 tokens. You're at 40,000 tokens and the agent hasn't finished discovery yet. Where are your initial constraints? Buried in the middle, being ignored. You've lost control of the generation.

Sam: What's the first solution to this scale problem?

Alex: Semantic search. Instead of querying by exact keywords, you query by meaning. Ask for "authentication middleware that validates user credentials" and you get relevant code even if it never mentions those exact terms.

Sam: How does that work technically?

Alex: Your code gets converted to high-dimensional vectors—768 to 1536 dimensions—that capture semantic meaning. Similar concepts cluster together in vector space. Then cosine similarity finds relevant chunks. So "auth middleware," "login verification," and "JWT validation" map to nearby vectors because the embedding model understands they're semantically related, even though they use completely different words. You need vector databases like ChromaDB, pgvector, or Qdrant, plus approximate nearest neighbor algorithms for fast search.

Sam: And availability depends on your tooling?

Alex: Right. IDE-based assistants like Cursor, Windsurf, or Cline typically include semantic search out-of-the-box—the editor handles indexing automatically. CLI agents like Claude Code need MCP servers to add semantic search. You've got options there: Claude Context for RAG-based semantic search, Serena as a lighter LSP-based bridge, or ChunkHound for a structured pipeline with hybrid search.

Sam: Semantic search extends your scale significantly, but there's still a limitation.

Alex: The results still fill your orchestrator context. Ten semantic chunks at 15,000 tokens, plus reading the actual files at 25,000 tokens, plus exploring related patterns at another 10,000 tokens—you're at 50,000 tokens. Half your effective context consumed before the agent even starts reasoning about the actual task.

Sam: Which leads to sub-agents for context isolation.

Alex: This is where it gets interesting. A sub-agent is an agent invoked by another agent—like a function call, but for agents. The orchestrator writes a prompt describing the research task: "Find all JWT authentication code and explain the current implementation." The sub-agent executes in its own isolated context, running searches and reading files. When complete, it returns a concise synthesis—typically 2,000 to 5,000 tokens instead of the 50,000 to 150,000 tokens it processed internally.

Sam: So you're paying more in total tokens, but your orchestrator maintains a clean context.

Alex: Exactly. The trade-off is token cost, not accuracy. You pay to process tokens in both contexts, which increases total cost significantly. But your orchestrator maintains clean context throughout, which means first-iteration accuracy. That typically saves tokens compared to multiple correction cycles from a polluted context.

Sam: There are two architectures for sub-agents, right?

Alex: Yes, and they serve different scales. The autonomous architecture gives the sub-agent tools and a system prompt defining its research strategy. The agent autonomously decides what to search, what to read, how to synthesize. Claude Code's Explore agent works this way—you send it a research question, it picks tools and sequences autonomously, then synthesizes findings. Simpler to build, cheaper to run, flexible across different tasks.

Sam: And the structured architecture?

Alex: You build a deterministic control plane that defines the exact search algorithm—breadth-first traversal, hybrid semantic plus symbol search. The LLM makes tactical decisions within your structure: "Should I expand this symbol? Is this chunk relevant?" ChunkHound uses this approach—a fixed multi-hop pipeline where the system controls traversal strategy and the LLM ranks relevance at decision points. More complex to build, higher cost, but maintains consistency at extreme scale.

Sam: What's the trade-off between them?

Alex: Autonomous agents work well but degrade in large codebases where they make suboptimal exploration choices. Structured agents scale reliably but cost more to build and run. For most teams, autonomous works until it doesn't, then you need structured.

Sam: Let's get concrete on tool selection by scale.

Alex: Under 10,000 lines of code, agentic search with Grep and Read handles everything. Simple, fast, reliable. Between 10,000 and 100,000 lines, you need semantic search or sub-agents. For Claude Code, the built-in Explore agent works. For other CLI agents, ChunkHound via MCP is currently the only way to add sub-agent functionality. The breaking point is when searches start returning 50-plus files and overwhelming your context.

Sam: And above 100,000 lines?

Alex: Structured code research becomes essential, especially at the million-plus line scale. ChunkHound's multi-hop BFS traversal with progressive aggregation is the only approach I've seen that reliably handles codebases that large. Autonomous agents start missing architectural connections across modules.

Sam: You mentioned measuring this. How do teams know where they fall?

Alex: Run cloc—C-L-O-C—on your codebase. It gives you a language-by-language breakdown. Focus on the "Code" column for accurate line counts, not comments or blanks.

Sam: Now let's shift to web grounding. Same pattern, different sources?

Alex: Same progression exactly. You need more than your codebase—you need current ecosystem knowledge. API docs, best practices, security advisories, recent research. Built-in web search works for simple queries, but you hit the same context pollution problem. Each search consumes 8,000 to 15,000 tokens. Each page you fetch adds 3,000 to 10,000 tokens. Fill your context with search results and your original constraints disappear.

Sam: What about synthesis tools like Perplexity?

Alex: They help. Raw fetching would cost 15,000 to 30,000 tokens—synthesis compresses that to 3,000 to 8,000 tokens per query. But there are limitations. Perplexity uses Bing instead of Google, so search quality suffers. You still hit context limits after 3-5 queries. And there's no state management—follow-up questions force the tool to re-explain basics instead of building on previous research.

Sam: So you need the same sub-agent approach for web research.

Alex: Exactly. ArguSeek is a web research sub-agent with isolated context and semantic state management. It processes 12 to 30 sources per call. You can make tens of calls per task, scanning 100-plus sources total while keeping your orchestrator context clean.

Sam: How does semantic subtraction work?

Alex: Follow-up queries skip already-covered content and advance your research instead of repeating basics. So you can ask about OAuth2 flow, then ask about security considerations, then ask about refresh token patterns, and each query builds on the previous ones instead of re-explaining OAuth from scratch.

Sam: And it uses Google Search API?

Alex: Yes, which matters for quality. It also does query decomposition—three concurrent query variations per request covering official docs, community discussions, and security advisories. Plus bias detection that flags vendor marketing and triggers counter-research.

Sam: In production, you combine both types of grounding.

Alex: That's the pattern. Ground in your codebase to prevent hallucinations and match your architecture. Ground in current web sources to get best practices and avoid outdated patterns. Code-only grounding prevents hallucinations but risks outdated patterns. Web-only grounding gives you current best practices but doesn't fit your architecture. Combining both gives you solutions that work for your specific system using current standards.

Sam: What are the key takeaways engineers should walk away with?

Alex: First, the agent only knows what's in the context window—without grounding, it hallucinates plausible solutions. Second, agentic search works beautifully under 10,000 lines but breaks down at scale. Third, the context window illusion is real—advertised capacity doesn't equal effective attention, and the U-curve means your constraints can disappear into the ignored middle.

Sam: And for the solutions?

Alex: Semantic search queries by meaning instead of keywords, extending your scale to 100,000-plus lines. Sub-agents isolate research in separate contexts, trading token cost for first-iteration accuracy. Autonomous sub-agents are simpler and flexible; structured sub-agents scale reliably to millions of lines. Choose your tools by codebase scale. And in production, combine code and web grounding to get solutions that fit your architecture using current standards.

Sam: This completes the methodology module. We've covered Plan-Execute-Validate workflows, prompting patterns, and now context management through grounding.

Alex: Right. These three pillars—structured workflows, effective communication, and grounding in reality—give you the foundation to operate AI agents effectively in production. The techniques scale from small projects to enterprise codebases, and the principles stay consistent even as the specific tools evolve.
