---
source: methodology/lesson-5-grounding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T07:24:09.268Z
model: claude-haiku-4.5
tokenCount: 2004
---

Alex: Let's talk about grounding—one of the most critical bottlenecks when working with AI agents at scale. The core problem is deceptively simple: LLMs only know two things. Their training data and what's currently in the context window. Everything else doesn't exist.

Sam: So when you ask an agent to fix an authentication bug, without access to your actual codebase, it's essentially making educated guesses based on patterns it's seen before.

Alex: Exactly. It will generate plausible-sounding solutions that have nothing to do with your architecture, your constraints, or the actual bug. This is where grounding comes in. Grounding means retrieving relevant external information—your codebase, documentation, best practices—and injecting it into context before the agent starts reasoning.

Sam: So it's like giving the agent access to the actual material it needs instead of asking it to work from memory.

Alex: Right. And the challenge scales. Let's say you have a small codebase, maybe ten thousand lines of code. The agent starts with zero knowledge of it. So it searches using what we call agentic search—it autonomously uses tools like Glob to find files, Grep to search keywords, Read to examine code. It decides what to search and interprets the results in real time.

Sam: That seems efficient for something that size. A few searches probably return manageable results.

Alex: It works well, yes. But jump to a hundred thousand lines of code and the system breaks. A single search for "authentication" returns fifty or more files. The agent reads through them, context fills up with hundreds of thousands of tokens before discovery even completes. And here's the killer—what gets buried in that context?

Sam: The initial constraints and requirements. The things that actually matter for understanding the problem.

Alex: Precisely. This is where we hit the context window illusion. Claude Sonnet advertises two hundred thousand tokens, but in practice, you can reliably use about sixty to one hundred twenty thousand. That's not a limitation—it's transformer architecture under real constraints.

Sam: So you lose the U-shaped attention curve?

Alex: That's exactly what happens. Beginning and end of your context get strong attention. Middle gets skimmed or missed. It's not a bug, it's architecture. So if you fill your context with search results and code samples, your critical constraints get pushed into that ignored middle. Agentic search amplifies this at scale.

Sam: So you need a different approach for larger codebases.

Alex: Exactly two approaches. First is semantic search. Instead of searching by keywords, you search by meaning. You query for "authentication middleware that validates credentials" and the system finds relevant code even if it doesn't use those exact terms.

Sam: How does that even work?

Alex: Through vector embeddings. Code gets converted into high-dimensional vectors—think of them as mathematical representations of meaning. Similar concepts cluster in vector space. So "auth middleware," "login verification," and "JWT validation" all map to nearby vectors because the embedding model understands they're related. You're not matching keywords anymore, you're matching concepts.

Sam: That's a significant shift. But doesn't this still create the same context pollution problem?

Alex: It's better. You get faster, more accurate discovery with fewer false positives. But you're right—you still eventually fill orchestrator context. Ten semantic chunks at fifteen thousand tokens, plus files at twenty-five thousand, plus related patterns at ten thousand, and you're halfway through context before reasoning starts.

Sam: So semantic search buys you scale, but doesn't solve the architectural problem. You need something else.

Alex: That's where sub-agents come in. The orchestrator doesn't do the research itself. It delegates to a sub-agent. The sub-agent searches in its own isolated context, then returns a concise synthesis back to the orchestrator. Your main context stays clean.

Sam: But that has to cost more in tokens, right? Two separate contexts getting processed?

Alex: It does. Three times the token cost. But here's the trade-off calculation: with clean context, you get first-iteration accuracy. Precision reduces total usage because you avoid multiple correction cycles. It's often cheaper overall.

Sam: Interesting. So there are two ways to build these sub-agents?

Alex: Yes. Autonomous sub-agents use system prompts and tools, then decide their own strategy. The agent receives a research question and autonomously decides whether to Grep, Read, or Glob. Simple to build, flexible, cheaper.

Sam: And the other approach?

Alex: Structured sub-agents use a deterministic control plane with strategic LLM calls. The system defines the algorithm—maybe a breadth-first search through code relationships—and the LLM makes tactical choices about what to explore next. More complex to build, but it maintains consistency at scale.

Sam: Which one scales better?

Alex: Structured scales better for large codebases. Autonomous degrades because the agent makes suboptimal exploration decisions. But there's a cost trade-off. For a hundred thousand line codebase, you probably want semantic search plus structured sub-agents.

Sam: What about the web side of things? You mentioned grounding doesn't just apply to code.

Alex: Right. You also need current ecosystem knowledge. Documentation, best practices, security advisories, new research. The same problem applies. A basic web search returns eight to fifteen thousand tokens per query. You can do five queries before context fills. Then what? You're stuck.

Sam: Do you need the same level of sophistication as semantic search for code?

Alex: Not quite, but similar patterns emerge. Simple web search works for basic queries. Synthesis tools like Perplexity fetch multiple pages and synthesize before returning. That reduces output from fifteen to thirty thousand down to three to eight thousand per query. Better, but still fragile once you need twelve to thirty sources.

Sam: What's the production solution?

Alex: ArguSeek. It's a web research sub-agent with semantic state management. It uses Google Search API instead of Bing or proprietary indexes, so search quality is higher. It decomposes your query into three concurrent variations—one targeting documentation, one targeting community discussions, one targeting security advisories.

Sam: All at the same time?

Alex: Yes. And here's the clever part: semantic subtraction. When you ask a follow-up question, it understands what's already been covered and skips that content. You're advancing research, not re-explaining basics.

Sam: So you can have long research chains without losing context.

Alex: Exactly. You can scan a hundred sources across multiple calls and keep clean orchestrator context. It also flags vendor marketing and triggers counter-research to avoid bias.

Sam: So what's the production pattern? Code plus web?

Alex: Always combine them. You ground code decisions in your actual architecture—prevents hallucinations. You ground those decisions with current ecosystem knowledge—prevents outdated solutions. A bug fix that's architecturally sound but using a deprecated library is just as bad as one that's architecturally wrong.

Sam: Right. You need both constraints.

Alex: The key insight is this: context is the agent's entire world. Grounding means deliberately populating that world with what matters. Small codebases, use agentic search. Medium codebases, add semantic search. Large codebases or complex research, delegate to sub-agents. Each tool buys you scale until it doesn't, then you move to the next approach.

Sam: And you can't skip steps?

Alex: You could, but you'd be paying more. Three tools in isolation cost more than progressive application. Grounding is about understanding these trade-offs and applying the minimum necessary sophistication to stay in context while maintaining accuracy.
