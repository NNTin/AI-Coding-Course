---
source: methodology/lesson-5-grounding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T08:46:03.292Z
model: claude-haiku-4.5
tokenCount: 2685
---

Alex: Welcome back. Today we're tackling grounding—which is arguably the most critical engineering problem when deploying agents in production.

Sam: Grounding. That's the concept where you keep agents from hallucinating, right? Feed them the actual information they need?

Alex: Exactly. But here's the problem: LLMs only know two things—training data and whatever you put in the context window. Everything else doesn't exist. As we covered in Lesson 2, the context window is literally the agent's entire world.

Sam: So if I assign an agent to "fix the authentication bug" and don't give it my codebase, what happens?

Alex: It generates a plausible-sounding solution based on statistical patterns. Probably a standard auth flow it's seen a thousand times. Not your architecture, not your specific constraints, not the actual bug you're dealing with. That's why grounding exists—you retrieve relevant information from your codebase, documentation, whatever external sources matter, and inject it into context before the agent starts reasoning.

Sam: How does discovery even work then? If the agent doesn't know your codebase yet, how does it find the right authentication code to read?

Alex: That's where agentic search comes in. Instead of you specifying exactly where to look, the agent autonomously uses search tools—Glob to find files, Grep to search by keyword, Read to examine code. It decides what to search, interprets results, determines the next step.

Sam: That sounds efficient for small projects. What happens as the codebase scales?

Alex: You hit a wall. Imagine you're debugging auth in a 100K line-of-code project. You ask the agent to search "authentication" and you get back 50+ matching files. Reading through them all starts filling your context window before discovery even completes. And here's where it gets interesting: you've heard Claude Sonnet 4.5 advertises a 200K token context window, but reliable attention only spans about 60 to 120K tokens—that's 30 to 60 percent of the window. We call this the context window illusion.

Sam: Why the gap?

Alex: Transformer architecture under realistic constraints. The beginning and end of context get strong attention. The middle gets skimmed or missed. That's the U-shaped attention curve. It's not a bug—it's just how the architecture works. But here's the consequence: fill your context window and critical constraints get pushed into that ignored middle. Agentic search amplifies this problem at scale. A few Grep searches return roughly 20K tokens, reading files adds another 15K, and the agent hasn't finished discovery before the context is already half-full. Initial constraints? Now buried in the middle.

Sam: So autonomous search breaks at scale. What's the solution?

Alex: Semantic search. Instead of searching by keywords, you search by meaning. You query something like "authentication middleware that validates user credentials" and it matches relevant code even without exact term overlap. "Auth middleware", "login verification", "JWT validation"—the system understands they're semantically related.

Sam: How does that even work under the hood?

Alex: Vector embeddings. Code gets converted to high-dimensional vectors—typically 768 to 1536 dimensions—that capture semantic meaning. Similar concepts cluster together in that vector space. You then use cosine similarity to find chunks that match your query. The infrastructure is vector databases like ChromaDB, pgvector, or Qdrant, combined with ANN algorithms for fast search. Rerankers refine results. As an agent user, you typically call something like code_research() and don't worry about the low-level APIs.

Sam: And that's available everywhere?

Alex: Not uniformly. IDE-based assistants—Cursor, Windsurf, Cline—typically include semantic search out of the box with integrated indexing and vector search. But CLI agents like Claude Code or Copilot CLI require MCP servers to add semantic search capabilities. MCP is the Model Context Protocol—it lets you extend CLI agents with tools like semantic search, web research, database access.

Sam: What MCP servers are available for semantic code search?

Alex: Three primary options. Claude Context does RAG-based semantic search. Serena is an LSP-based bridge—lighter weight but limited to LSP symbol scope. Then there's ChunkHound, which provides a structured pipeline with hybrid search capabilities.

Sam: Hybrid meaning?

Alex: Semantic search plus traditional regex matching. You conceptually discover relevant code through semantics, then exhaustively search every symbol in those files with precise regex patterns. It's more thorough than semantic search alone.

Sam: What scale does semantic search reach?

Alex: It extends you to roughly 100K lines of code and beyond. You find relevant code much faster, fewer false positives. But here's the limitation: it still fills your orchestrator context. Say you pull 10 chunks at 15K tokens, add related files at 25K, add related patterns at 10K—you're at 50K tokens before reasoning even starts.

Sam: So you've solved discovery but not context management.

Alex: Exactly. Which brings us to sub-agents. Sub-agents run research in isolated contexts. You have an orchestrator that delegates to a sub-agent. The sub-agent does all its searching in its own isolated context window, synthesizes findings, and returns a concise result back to the orchestrator.

Sam: That seems wasteful—you're processing tokens in two separate contexts.

Alex: You're right. It's roughly 3x the token cost. But the benefit is a clean orchestrator context, which means first-iteration accuracy. That reduced error rate actually cuts total token usage compared to multiple correction cycles needed with a polluted context.

Sam: What's the architecture look like?

Alex: Two main approaches. Autonomous sub-agents get system prompts and tools, and they decide their own strategy. Claude Code's Explore agent is a good example—you give it a research question, it autonomously picks whether to use Grep, Read, or Glob, synthesizes findings, and returns results. Simpler to build, cheaper, flexible.

Sam: And the structured approach?

Alex: Structured sub-agents have a deterministic control plane plus strategic LLM calls. The system defines the algorithm—BFS, hybrid search, whatever—and the LLM makes tactical choices within that framework. ChunkHound is an example: fixed pipeline, the LLM ranks relevance and synthesizes results. More complex to build but maintains consistency at massive scale.

Sam: What's the tradeoff?

Alex: Autonomous degrades in very large codebases. You don't have enough structure to coordinate search efficiently. Structured scales better but costs more to build and operate.

Sam: So tool choice depends on codebase size. Where are the inflection points?

Alex: Under 10,000 lines, agentic search with Grep and Read works well. A few searches return manageable results, context stays clean. Between 10,000 and 100,000 lines, switch to semantic search. Use tools like ChunkHound or Claude Context via MCP servers. Above 100,000 lines, you need ChunkHound's structured multi-hop traversal. At that scale, autonomous agents start missing architectural connections. ChunkHound uses BFS traversal through semantic relationships, hybrid semantic plus symbol search, and map-reduce synthesis that gives you architectural relationships with file and line citations.

Sam: What about web grounding? Same problem?

Alex: Same progression, different sources. You need current ecosystem knowledge—documentation, best practices, security advisories, research papers. Most assistants include basic web search, but it hits the same context limit. Each search returns 8 to 15K tokens, pages add another 3 to 10K. The U-curve applies.

Sam: So you need something more sophisticated.

Alex: Tools like Perplexity synthesize before returning—search, fetch, synthesize, return clean results. That compresses roughly 15 to 30K tokens down to 3 to 8K per query. But limitations exist: custom indexes rather than Google quality, and you hit context limits after 3 to 5 queries.

Sam: What about something like ArguSeek?

Alex: ArguSeek is a web research sub-agent with state management. It can handle 12 to 30 sources per call, tens of calls per task—meaning 100+ sources scanned while keeping your orchestrator context clean. It uses Google Search API for quality, not Bing or proprietary indexes. It decomposes queries into three concurrent variations: documentation, community discussions, and security advisories. It has semantic subtraction—follow-up queries skip already-covered content, advancing research rather than re-explaining basics. It even flags vendor marketing and triggers counter-research.

Sam: So you get breadth and context isolation.

Alex: Right. Tools like research_iteratively give you multi-source synthesis with citations, and fetch_url lets you target specific pages. Use it for best practices research, competing approaches, security advisories, new technology learning, bias verification. Alternatives exist—Perplexity, OpenAI Deep Research, Consensus, Elicit—but most lack the Google API quality combined with semantic subtraction.

Sam: In practice, how do you combine code and web grounding?

Alex: You use both. Code grounding keeps the solution architecturally sound and grounded in your specific codebase. Web grounding prevents the solution from being outdated. Maybe you're debugging an authentication flow. You ground in your codebase to understand the current implementation, then ground in web research to verify you're not using deprecated OAuth patterns, check security advisories for the libraries you're using, and research alternatives if your current approach has known issues.

Sam: That prevents both hallucinations and technical debt.

Alex: Exactly. And that's the production pattern. The core principle is simple: the context window is the agent's entire world. Everything outside it doesn't exist. Grounding injects external information before generation. Agentic search works for small projects but breaks at scale. Semantic search extends scale to 100K lines, but fills orchestrator context. Sub-agents isolate context and reduce error rates. Web grounding follows the same pattern—simple search breaks, synthesis tools compress, ArguSeek provides scale with semantic awareness. Choose tools by codebase size and research complexity, and you'll keep agents grounded in reality rather than statistical hallucinations.

Sam: That's a clear progression from simple to sophisticated.

Alex: And that's the lesson. Grounding is the bridge between what agents can theoretically do and what they can actually accomplish in your production environment.
