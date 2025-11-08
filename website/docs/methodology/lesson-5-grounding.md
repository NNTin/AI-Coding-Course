---
sidebar_position: 3
sidebar_label: 'Lesson 5: Grounding'
title: 'Grounding: Anchoring Agents in Reality'
---

import UShapeAttentionCurve from '@site/src/components/VisualElements/UShapeAttentionCurve';
import GroundingComparison from '@site/src/components/VisualElements/GroundingComparison';

**The Problem:** LLMs only "know" training data and context window content. As covered in [Lesson 2](/docs/understanding-the-tools/lesson-2-understanding-agents), **the context window is the agent's entire world**—everything else doesn't exist.

Without your actual codebase or current docs, agents generate plausible-sounding solutions based on statistical patterns—not your architecture, constraints, or the real bug.

**Grounding** retrieves relevant external information (codebase, docs, best practices) and injects it into context before generation. This lesson covers the engineering techniques that anchor agents in reality.

**Scenario:** You're debugging an authentication bug in your API.

<GroundingComparison />

## The Discovery Problem: Agentic Search

When you assign "Fix the authentication bug," the agent starts with zero codebase knowledge. It doesn't know where auth code lives, what libraries you use, or how it's structured.

**Agentic search** solves this through autonomous tool calls—Glob finds files, Grep searches keywords, Read examines code. The agent decides what to search, interprets results, determines next steps.

**Example flow:**

```
Task: "Fix JWT expiration validation"

→ Grep("JWT", "**/*.ts")
  Found in src/auth/jwt.ts:45, src/middleware/auth.ts:12...

→ Read("src/auth/jwt.ts")
  [JWT verification logic]

→ Read("src/middleware/auth.ts")
  [Middleware integration]

→ Synthesize + identify bug
```

**Works well for small codebases** (~10K LOC). A few searches return manageable results, context stays clean.

**Breaks at scale:** Searching "authentication" in a 100K LOC project returns 50+ files. Reading them fills context before discovery completes, pushing critical information into the ignored middle.

## The Scale Problem: Context Window Limits

Claude Sonnet 4.5 advertises 200K tokens, but reliable attention spans 60-120K (30-60%)—the **context window illusion**.

<UShapeAttentionCurve />

**U-shaped attention:** Beginning and end get strong attention. Middle gets skimmed or missed. Not a bug—transformer architecture under realistic constraints.

**Impact:** Fill your context, and critical constraints get pushed into the ignored middle.

**Agentic search amplifies this at scale.** A few Grep searches return ~20K tokens, reading files adds ~15K, and the agent hasn't finished discovery before context fills. Initial constraints? Now buried in the middle.

### Solution 1: Semantic Search

Search **by meaning, not keywords**. Query "authentication middleware that validates user credentials" matches relevant code even without exact term overlap.

:::tip How Semantic Search Works

**Vector embeddings:** Code → high-dimensional vectors (768-1536 dims) capturing semantic meaning. Similar concepts cluster in vector space.

**Similarity matching:** Cosine similarity finds relevant chunks. "auth middleware", "login verification", "JWT validation" map to nearby vectors—the model understands they're related.

**Infrastructure:** Vector databases (ChromaDB, pgvector, Qdrant) + ANN algorithms for fast search. Rerankers refine results. You call `code_research()`, not low-level APIs.

**Key difference:** Embedding models + vector similarity ≠ keyword matching. Search by concept, not text.
:::

**Availability depends on tool type:**

**IDE-based assistants** (Cursor, Windsurf, Cline) typically include semantic search out-of-the-box—integrated indexing and vector search within the editor.

**CLI agents** (Claude Code, Copilot CLI, Codex) require MCP servers to add semantic search. [Model Context Protocol (MCP)](https://modelcontextprotocol.io) lets you extend CLI agents with tools like semantic search, web research, and database access.

**MCP servers for semantic code search:**

- [Claude Context](https://github.com/zilliztech/claude-context) - RAG-based semantic search
- [Serena](https://github.com/oraios/serena) - LSP-based bridge (lighter weight, limited to LSP symbol scope)
- [ChunkHound](https://chunkhound.github.io) - Structured pipeline with hybrid search

Once available (built-in or via MCP), agents combine semantic search with Grep—conceptual discovery + precise matching.

**Extends scale to ~100K+ LOC.** Finds relevant code faster, fewer false positives.

**Limitation:** Still fills orchestrator context. 10 chunks (15K tokens) + files (25K) + related patterns (10K) = context half-full before reasoning starts.

## Solution 2: Sub-Agents for Context Isolation

**Sub-agents run research in isolated contexts.** Orchestrator delegates to sub-agent → sub-agent searches in own context → returns concise synthesis.

```
Orchestrator: "Research JWT authentication implementation" → code sub-agent

Code sub-agent (isolated context):
  Semantic searches (~10K tokens) + files (~15K) + patterns (~8K)
  Synthesizes → Returns ~200 tokens:
  "JWT auth in src/auth/jwt.ts:45-67 uses Passport.js.
   Pattern: middleware → strategy → validation. RS256."

Orchestrator: Receives 200 tokens vs 33K raw results
```

**Trade-off:** 3x token cost (both contexts processed), but clean context means first-iteration accuracy. Precision reduces total usage vs multiple correction cycles.

**Without sub-agents:** Exploit the U-curve—critical constraints at start, tasks at end. Supporting info in skimmable middle.

### Two Sub-Agent Architectures

**Autonomous:** System prompts + tools. Agent decides strategy. Example: Claude Code's Explore agent—receives research question, autonomously picks Grep/Read/Glob, synthesizes. Simpler, cheaper, flexible.

**Structured:** Deterministic control plane + strategic LLM calls. System defines algorithm (BFS, hybrid search), LLM makes tactical choices ("expand this symbol?"). Example: ChunkHound—fixed pipeline, LLM ranks relevance and synthesizes. Complex to build, maintains consistency at scale.

**Trade-off:** Autonomous degrades in large codebases. Structured scales but costs more.

## Code Grounding: Choosing Tools by Scale

Codebase size determines which approach works.

### Tool Selection Matrix

| Scale           | Recommended Tools                                                             | Breaking Point                                         | Why                                                                                                      |
| --------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **< 10K LOC**   | Agentic search (Grep, Read, Glob)                                             | N/A                                                    | Fast, cheap, sufficient coverage. No indexing overhead.                                                  |
| **10-100K LOC** | Explore agent OR semantic search via MCP (ChunkHound, Claude Context, Serena) | ~50+ file matches overwhelm context                    | CLI agents: Install MCP server. IDE assistants: Use built-in search. Balances thoroughness with latency. |
| **100K+ LOC**   | ChunkHound code research (structured sub-agent)                               | Agentic search misses connections, incomplete findings | Essential at 1M+ LOC. Only approach with progressive aggregation.                                        |

<details>
<summary>Deep Dive: ChunkHound Architecture</summary>

[ChunkHound](https://chunkhound.github.io)—structured pipeline for code research at scale.

**Pipeline:**

1. **Multi-hop BFS traversal** through semantic relationships
2. **Hybrid semantic + symbol search**—conceptual discovery, then exhaustive regex for every symbol
3. **Map-reduce synthesis**—architectural relationships with `file:line` citations

**Scale guidance:**

- **< 10K LOC:** Explore agent cheaper (ChunkHound adds 3-5x cost, 2-3x latency)
- **~10K LOC:** Inflection point—valuable if repeatedly connecting components
- **100K+ LOC:** Highly valuable—autonomous agents show incomplete findings
- **1M+ LOC:** Essential—only approach with progressive aggregation

**Usage:** `Research our authentication middleware architecture`

**Returns:** Component locations, architectural patterns, relationships across modules with citations.

**Use for:** Feature implementation prep, complex debugging, refactoring analysis, code archaeology, when Explore returns incomplete results.

**Alternatives:** [Claude Context](https://github.com/zilliztech/claude-context)—semantic search via RAG. [Serena](https://github.com/oraios/serena)—LSP bridge instead of full semantic search (faster, lighter, but limited to language server symbol scope). Neither implements structured multi-hop traversal.

</details>

## Web Grounding: Same Pattern, Different Sources

You also need current ecosystem knowledge—docs, best practices, security advisories, research.

**Same progression as code grounding:** Simple → hits context limits → needs sophisticated solutions.

### Built-In Web Search

Most assistants (Claude Code, Copilot, Cursor) include basic web search. Works for simple queries. **Limitation:** Same context pollution—each search ~8-15K tokens, pages ~3-10K. U-curve applies.

### Synthesis Tools (Perplexity)

Search + fetch + synthesize before returning. **Improvement:** ~15-30K → ~3-8K per query.

**Limitations:**

- Custom indexes (Bing), not Google quality
- 3-5 queries before context fills
- No state—follow-ups re-explain basics

### ArguSeek: Isolated Context + State

[ArguSeek](https://github.com/ArguSeek/arguseek)—web research sub-agent with state management.

**Scale:** 12-30 sources per call, tens of calls per task = 100+ sources scanned. Clean orchestrator context maintained.

**Mechanism:**

1. **Google Search API**—search quality, not Bing/Brave
2. **Query decomposition** (Gemini)—3 concurrent variations (docs + community + security)
3. **Semantic subtraction**—follow-ups skip already-covered content

**Example:**

```
Q1: "Passport.js JWT authentication?" → 15 sources, ~3K tokens
Q2: "Security vulnerabilities?" (with Q1) → 20 sources, ~4K, skips basics
Q3: "RS256 implementation?" (with Q1+Q2) → 18 sources, ~3K, builds on context

Total: 53 sources, ~10K tokens vs ~40K+ raw fetching
```

<details>
<summary>Deep Dive: ArguSeek Architecture</summary>

[ArguSeek](https://arguseek.com)—structured pipeline for web research with semantic state management.

**Key Differentiators:**

1. **Google Search API**—quality vs Bing/proprietary
2. **Semantic subtraction**—stateless but context-aware. Follow-ups skip covered content, advance research vs re-explaining
3. **Query decomposition**—3 concurrent variations per query (docs + community + advisories)
4. **Bias detection**—flags vendor marketing, triggers counter-research
5. **PDF synthesis**—Gemini Vision extraction

**Tools:**

- `research_iteratively`—multi-source synthesis with citations
- `fetch_url`—targeted page extraction

**Use for:** Best practices research, competing approaches, security advisories, new tech learning, bias verification.

**Alternatives:** [Perplexity](https://perplexity.ai) (Bing), [OpenAI Deep Research](https://platform.openai.com/docs/guides/deep-research), [Consensus](https://consensus.app), [Elicit](https://elicit.com). Most lack Google API + semantic subtraction combo.

</details>

## Production Pattern: Multi-Source Grounding

Combine code + web grounding:

```
Task: "Implement OAuth2 for our API"

1. Code research: Existing auth patterns (ChunkHound)
2. Web research: Current best practices, CVEs (ArguSeek)
3. Synthesis: Fits your architecture + 2025 standards
```

Prevents hallucinations (code-grounded) and outdated solutions (web-grounded).

## Key Takeaways

**Context = Agent's World**
Agents only know context window contents. Grounding injects external information (code, docs, research) before generation.

**Agentic Search = Autonomous Discovery**
Grep/Read/Glob autonomously. Works for small projects (`<10K LOC`). Fails at scale—context pollution.

**Semantic Search = Meaning-Based Retrieval**
Vector embeddings enable conceptual search. Extends to ~100K+ LOC.

**U-Curve = Effective Attention Limits**
200K advertised, 60-120K reliable. Beginning + end processed. Middle skimmed/ignored.

**Sub-Agents = Context Isolation**
Research in isolated context → return synthesis. 3x token cost, but first-iteration accuracy. Two types: Autonomous (flexible) vs Structured (scale consistency).

**Code Grounding = Scale-Based Tool Selection**
`<10K LOC`: Agentic search. `10-100K`: Explore/semantic. `100K+`: ChunkHound structured research.

**Web Grounding = Same Pattern**
Built-in search → Perplexity synthesis → ArguSeek (100+ sources, state management).

**Multi-Source = Production Pattern**
Code + web grounding prevents hallucinations and outdated solutions.

---

**Next:** The methodology module is complete. You now have the fundamental workflows (Plan > Execute > Validate), communication patterns (Prompting 101), and context management strategies (Grounding) to operate AI agents effectively in production environments.
