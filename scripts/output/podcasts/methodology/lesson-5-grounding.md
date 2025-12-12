---
source: methodology/lesson-5-grounding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T08:28:36.376Z
model: claude-opus-4.5
tokenCount: 3837
---

Alex: Let's talk about a failure mode I see constantly. You ask your agent to fix an authentication bug, and it confidently generates a solution using JWT verification patterns. Clean code, follows best practices. One problem: your codebase uses sessions, not JWTs. The agent just hallucinated a plausible implementation based on its training data.

Sam: Because the agent has no idea your codebase even exists. It's working from statistical patterns of what authentication code usually looks like.

Alex: Exactly. And this gets to a fundamental principle we covered earlier: the context window is the agent's entire world. Everything outside that window doesn't exist. Your architecture, your patterns, your constraints—none of it matters unless you explicitly inject it into the context.

Sam: So grounding is how you inject that reality.

Alex: Right. You retrieve relevant external information—your actual codebase patterns, current documentation, best practices—and feed it to the agent before it generates anything. Without grounding, the agent works from generic training patterns frozen at its knowledge cutoff. It guesses your architecture, hallucinates implementations that don't match your system, misses recent security vulnerabilities. With grounding, it works from your actual code, uses current docs, follows your existing patterns.

Sam: Let's start with the code side. How does an agent discover a codebase it's never seen?

Alex: Agentic search. The agent autonomously calls tools—Glob to find files matching patterns, Grep to search for keywords, Read to examine code. It decides what to search, interprets results, determines next steps. You say "fix the authentication bug" and the agent might start by globbing for auth-related files, grepping for "login" or "session", then reading the relevant files it finds.

Sam: And for small codebases this works well.

Alex: Beautifully. Under 10,000 lines of code, two or three searches return maybe 5-10 files totaling 15,000 tokens. The agent reads them, builds a mental model, solves the problem. Context stays clean. But at scale, this breaks down completely.

Sam: What happens when you search "authentication" in a 100,000-line project?

Alex: You get 80-plus files. Reading them consumes 60,000 or more tokens before the agent even finishes discovery. That's half your effective context window gone just on exploration. And here's where it gets insidious: those critical constraints you provided up front? They get pushed into the middle of the context as search results flood in.

Sam: The U-shaped attention problem.

Alex: Exactly. Claude Sonnet 4.5 advertises 200,000 tokens. The reality is reliable attention spans 60,000 to 120,000 tokens—that's 30 to 60 percent of advertised capacity. Transformers pay strong attention to the beginning and end of your context. The middle gets skimmed or missed entirely. This isn't a bug, it's how transformer architecture actually works under realistic constraints.

Sam: So if agentic search fills your context with search results, your original instructions end up in the ignored middle.

Alex: Right. Three Grep searches return 18,000 tokens. Reading five files adds another 22,000 tokens. You're at 40,000 tokens and the agent hasn't finished discovery yet. Where are your initial constraints? Buried in the middle, being ignored. You've lost control of the generation before it even starts.

Sam: What's the first solution to this scale problem?

Alex: Semantic search. Instead of querying by exact keywords, you query by meaning. Ask for "authentication middleware that validates user credentials" and you get relevant code even if it never uses those exact terms.

Sam: How does that work technically?

Alex: Your code gets converted to high-dimensional vectors—typically 768 to 1536 dimensions—that capture semantic meaning. Similar concepts cluster together in vector space. Then cosine similarity finds relevant chunks. So "auth middleware", "login verification", and "JWT validation" all map to nearby vectors even though they use different words. The embedding model understands they're semantically related.

Sam: What's the infrastructure look like?

Alex: Vector databases like ChromaDB, pgvector, or Qdrant, plus approximate nearest neighbor algorithms for fast search. Often a reranker to refine results. But you don't touch the low-level APIs—you just call something like code_research and get relevant chunks back.

Sam: Availability varies by tool, right?

Alex: Significantly. IDE-based assistants like Cursor, Windsurf, and Cline typically include semantic search out of the box. The editor handles indexing automatically. CLI agents like Claude Code or Copilot CLI need MCP servers to add it. Model Context Protocol lets you extend CLI agents with tools like semantic search, web research, database access.

Sam: What MCP servers add semantic code search?

Alex: A few options. Claude Context does RAG-based semantic search. Serena is an LSP-based bridge—lighter weight but limited to language server symbol scope. ChunkHound offers a structured pipeline with hybrid search. Once you have semantic search, your agent can combine it with Grep for hybrid discovery: conceptual search to find the right area, precise keyword matching to locate exact implementations.

Sam: And this extends your scale ceiling.

Alex: To 100,000-plus lines of code. You find relevant code faster with fewer false positives. But there's still a fundamental limitation: semantic search still fills your orchestrator context. Ten semantic chunks at 15,000 tokens, plus reading files at 25,000 tokens, plus exploring related patterns at 10,000 tokens—you're at 50,000 tokens. Half your effective context consumed before the agent starts reasoning about the actual task.

Sam: Which brings us to sub-agents.

Alex: Sub-agents are agents invoked by other agents—like function calls, but for agents. Your orchestrator writes a prompt describing the research task: "Find all JWT authentication code and explain the current implementation." The sub-agent executes in its own isolated context, runs searches, reads files. When complete, it returns a concise synthesis: "JWT implementation found at src/auth/jwt.ts using Passport.js..." That synthesis loads into the orchestrator's context—typically 2,000 to 5,000 tokens instead of the 50,000 to 150,000 tokens the sub-agent processed internally.

Sam: So the orchestrator context stays clean.

Alex: Exactly. The trade-off is token cost, not accuracy. You pay to process tokens in both contexts, which increases total cost. But your orchestrator maintains clean context throughout, which means first-iteration accuracy. That typically saves tokens compared to multiple correction cycles from a polluted context.

Sam: What are the two sub-agent architectures?

Alex: Autonomous and structured. In autonomous architecture, you give the sub-agent tools like Grep, Read, and Glob plus a system prompt defining its research strategy. The agent autonomously decides what to search, what to read, how to synthesize. Claude Code's Explore agent works this way—you send it a research question, it picks tools and sequences, then synthesizes findings. Simpler to build, cheaper to run, flexible across different research tasks.

Sam: And structured?

Alex: You build a deterministic control plane that defines the exact search algorithm—breadth-first traversal, hybrid semantic plus symbol search. The LLM makes tactical decisions within your structure: "Should I expand this symbol? Is this chunk relevant?" ChunkHound uses a fixed multi-hop pipeline where the system controls traversal strategy and the LLM ranks relevance at decision points. More complex to build, higher cost, but maintains consistency at extreme scale.

Sam: When does each approach make sense?

Alex: Autonomous agents work well but degrade in large codebases where they make suboptimal exploration choices. Structured agents scale reliably but cost more to build and run. For most teams, autonomous sub-agents handle everything up to 100,000 lines. Past that, or when you're dealing with millions of lines of code, structured approaches become essential.

Sam: Let me make sure I have the tool selection matrix right. Under 10,000 lines?

Alex: Agentic search with Grep, Glob, and Read works reliably. The breaking point is when search results start overwhelming context—usually around 20-30 files. At that scale, agentic search is cheaper and faster than anything else.

Sam: Between 10,000 and 100,000 lines?

Alex: For Claude Code specifically, use the built-in Explore agent—it's an autonomous sub-agent designed for this. For other CLI agents, ChunkHound via MCP is currently the only option to add sub-agent functionality. Alternatively, semantic search through Claude Context or Serena extends agentic search with meaning-based queries. The breaking point here is when searches return 50-plus files and start overwhelming context.

Sam: And over 100,000 lines?

Alex: ChunkHound's structured code research. Essential at a million lines or more—it's the only approach with progressive aggregation across large codebases. Autonomous agents start missing architectural connections across modules at this scale.

Sam: Quick practical note—how do you measure lines of code?

Alex: Use cloc. Run cloc dot in your repo, look at the Code column for accurate counts. Ignore comments and blanks for this purpose.

Sam: Let's talk ChunkHound architecture in more detail.

Alex: ChunkHound is currently the only MCP-based sub-agent for code research. For CLI agents other than Claude Code, it's the only way to add sub-agent functionality. The pipeline has three stages: multi-hop breadth-first traversal through semantic relationships, hybrid semantic plus symbol search—conceptual discovery then exhaustive regex for every symbol—and map-reduce synthesis that captures architectural relationships with file and line citations.

Sam: What's the scale guidance?

Alex: Under 10,000 lines, the Explore agent is cheaper—ChunkHound adds 1 to 2x cost and latency. Around 10,000 lines is the inflection point where ChunkHound becomes valuable if you're repeatedly connecting components across the codebase. At 100,000-plus lines it's highly valuable because autonomous agents start showing incomplete findings. At a million lines it's essential—only approach with progressive aggregation.

Sam: When do you reach for it?

Alex: Feature implementation prep, complex debugging, refactoring analysis, code archaeology, or when Explore returns incomplete results. You ask something like "Research our authentication middleware architecture" and get back component locations, architectural patterns, relationships across modules, all with citations.

Sam: What are the alternatives?

Alex: Claude Context does semantic search via RAG. Serena is an LSP bridge—faster and lighter but limited to language server symbol scope. Neither implements structured multi-hop traversal.

Sam: Let's shift to web grounding. Same pattern applies?

Alex: Same progression. Simple tools work initially, then hit context limits, then need sophisticated solutions. Most assistants include basic web search—Claude Code, Copilot, Cursor. Works for simple queries. But same context pollution problem. Each search consumes 8,000 to 15,000 tokens. Each page fetch adds 3,000 to 10,000 tokens. Fill your context with search results and your original constraints disappear into the ignored middle.

Sam: What about synthesis tools like Perplexity?

Alex: They search, fetch, and synthesize before returning results. Raw fetching might cost 15,000 to 30,000 tokens; synthesis compresses to 3,000 to 8,000 tokens per query. But there are limitations: Perplexity uses Bing instead of Google, so search quality suffers. You hit context limits after 3 to 5 queries. And there's no state management—follow-up questions force the tool to re-explain basics instead of building on previous research.

Sam: How does ArguSeek solve this?

Alex: ArguSeek is a web research sub-agent with isolated context and semantic state management. It processes 12 to 30 sources per call. You can make tens of calls per task, scanning 100-plus sources total while keeping your orchestrator context clean.

Sam: What's the architecture?

Alex: Four key differentiators. First, Google Search API instead of Bing or proprietary alternatives—better search quality. Second, query decomposition via Gemini runs 3 concurrent query variations per search: official docs, community discussions, and security advisories. Third, semantic subtraction—follow-up queries skip already-covered content and advance your research instead of repeating basics. Fourth, bias detection that flags vendor marketing and triggers counter-research.

Sam: Can you walk through a research sequence?

Alex: Say you're implementing OAuth with the Stripe API. First call: research Stripe OAuth 2.0 implementation best practices, current security requirements. ArguSeek returns synthesis with citations. Second call: research with the previous query as context, asking about refresh token handling and scope management. It skips the OAuth basics it already covered and advances to the specific details. Third call: common Stripe OAuth security vulnerabilities and mitigation strategies. Each call builds on the previous without repeating fundamentals.

Sam: In production, you combine code and web grounding?

Alex: Always. Code-only grounding prevents hallucinations but risks outdated patterns. Web-only grounding gives you current best practices but doesn't fit your architecture. You need both. Ground in your codebase to match your architecture and prevent hallucinations. Ground in current web sources for best practices and to avoid outdated patterns. Combining both prevents solutions that work in theory but don't fit your system.

Sam: Let me summarize the key points. The agent only knows what's in the context window—without grounding, it hallucinates based on training data. Agentic search works for small codebases but floods context at scale. The context window illusion means reliable attention is 60,000 to 120,000 tokens, not the advertised 200,000.

Alex: Right. And the solutions scale up with your codebase. Semantic search extends you to 100,000 lines by querying meaning instead of keywords. Sub-agents isolate research in separate contexts, processing huge amounts of information and returning compact syntheses. Autonomous sub-agents work well up to 100,000 lines; structured sub-agents scale to millions.

Sam: Tool selection by scale: under 10,000 lines use agentic search, 10,000 to 100,000 lines add semantic search or Explore, over 100,000 lines use ChunkHound's structured approach.

Alex: Web grounding follows the same progression—built-in search for simple queries, synthesis tools compress results, sub-agents like ArguSeek maintain state across 100-plus sources. In production, you combine code and web grounding to get solutions that match your architecture and follow current best practices.

Sam: That completes the methodology module.

Alex: You now have the fundamental workflows—Plan, Execute, Validate. The communication patterns from Prompting 101. And the context management strategies we just covered. These form the foundation for operating AI agents effectively in production.
