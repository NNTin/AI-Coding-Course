---
title: MCP Servers
sidebar_position: 4
---

# MCP Servers

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) extends CLI agents with specialized capabilities—code research, web grounding, browser automation. While IDE-based assistants (Cursor, Windsurf) often include these features built-in, CLI agents (Claude Code, Copilot CLI, Aider) rely on MCP servers to add functionality beyond basic file operations.

These three MCP servers address the critical gaps in AI-assisted development workflows.

## Code Research

### ChunkHound

[ChunkHound](https://chunkhound.github.io) provides semantic code search and structured sub-agent research for large codebases.

**What it does:**

- Multi-hop semantic search through code relationships
- Hybrid semantic + symbol search (conceptual discovery, then exhaustive regex)
- Map-reduce synthesis with architectural relationships and `file:line` citations

**When to use it:**

- **10,000-100,000 LOC:** Valuable when repeatedly connecting components across the codebase
- **100,000+ LOC:** Highly valuable as autonomous agents show incomplete findings
- **1,000,000+ LOC:** Essential—only approach with progressive aggregation at extreme scale

**Key trade-off:** Higher token cost (1-2x) vs autonomous search, but maintains first-iteration accuracy through context isolation.

**Installation:**

```bash
uv tool install chunkhound
```

Requires Python 3.10+ and the uv package manager. See [ChunkHound on GitHub](https://github.com/chunkhound/chunkhound) for API key configuration and setup details.

**Learn more:** [Lesson 5: Grounding](/docs/methodology/lesson-5-grounding#deep-dive-chunkhound-architecture) covers ChunkHound's architecture, pipeline design, and scale guidance in detail.

## Web Research

### ArguSeek

[ArguSeek](https://github.com/ArguSeek/arguseek) is a web research sub-agent with isolated context and semantic state management.

**What it does:**

- Google Search API (quality vs Bing/proprietary alternatives)
- Query decomposition—3 concurrent variations per query (docs + community + security advisories)
- Semantic subtraction—follow-up queries skip covered content and advance research
- Bias detection—flags vendor marketing, triggers counter-research

**When to use it:**

- Researching best practices and competing approaches
- Finding security advisories and CVEs
- Learning new technologies with current (post-training) information
- Multi-source research (processes 12-30 sources per call, scales to 100+ sources per task)

**Key advantage:** Maintains state across queries—builds on previous research instead of re-explaining basics, keeping your orchestrator context clean.

**Installation:**

```bash
brew install arguseek
```

Requires Go 1.23+ and Google API credentials. See [ArguSeek on GitHub](https://github.com/ArguSeek/arguseek) for detailed setup instructions and configuration options.

**Learn more:** [Lesson 5: Grounding](/docs/methodology/lesson-5-grounding#deep-dive-arguseek-architecture) explains ArguSeek's architecture, semantic subtraction, and research patterns.

## Browser Automation

Two major options for browser automation—both provide comprehensive tooling, differ in maturity and optimization approach.

### Playwright MCP

[Playwright MCP](https://github.com/microsoft/playwright-mcp) is the official browser automation server from Microsoft, built on the Playwright testing framework. Most popular MCP server on GitHub for browser automation.

**What it does:**

- Accessibility tree approach (not screenshots)—LLM-friendly structured data from the DOM
- Full browser automation via Playwright—navigate, click, type, extract data
- Automated testing and exploration—generate tests, reproduce bugs, validate UX from natural language
- Self-verifying workflows—agents modify code, launch browser, interact with UI, confirm expected behavior

**When to use it:**

- Mature ecosystem preference—established Playwright foundation with broad community support
- Testing-focused workflows—leverages Playwright's end-to-end testing patterns
- Accessibility-first automation—semantic DOM structure over visual parsing

**Key advantage:** High popularity and mature testing ecosystem. Accessibility tree provides clean, structured text that LLMs interpret reliably without visual processing overhead.

**Installation:**

```bash
npx @playwright/mcp@latest
```

Requires Node.js 18+. See [Playwright MCP on GitHub](https://github.com/microsoft/playwright-mcp) for MCP client configuration.

### Chrome DevTools MCP

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) is the official browser automation server from the Google Chrome team, purpose-built for MCP workflows with context optimization.

**What it does:** (26+ professional tools)

- Performance analysis—run traces, extract LCP, blocking time, actionable metrics
- Advanced debugging—analyze network requests (CORS, failed loads), inspect console logs, take DOM snapshots
- Reliable automation—simulate user interactions (click, type, navigate) via Puppeteer
- Emulation—CPU throttling, network speed, viewport size for testing under constraints

**When to use it:**

- Performance-focused workflows—deep Chrome DevTools integration for profiling and optimization
- Context-optimized preference—newer tool designed specifically for MCP agent use cases
- Chrome-specific features—leverage proprietary DevTools Protocol capabilities

**Key capability:** Closes the "write code → run → verify" loop—agents test their changes in the browser and iterate based on actual behavior.

**Installation:**

```bash
npx chrome-devtools-mcp@latest
```

See [Chrome DevTools MCP on GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp) for MCP client configuration.

### Choosing Between Them

**Playwright MCP:** More popular with broader GitHub community, mature testing ecosystem, established Playwright foundation. Best for standard testing workflows and accessibility-first automation.

**Chrome DevTools MCP:** Newer and purpose-built for MCP, context-optimized by the Chrome team, performance analysis focus. Best for Chrome-specific debugging and profiling workflows.

Both provide comprehensive browser automation with similar scope (~26 tools). The choice depends on ecosystem preference and whether you prioritize maturity (Playwright) or MCP-specific optimization (CDP).

:::tip Run Browser Automation in Sub-Agents
Browser automation generates high token volumes—DOM snapshots (5,000-15,000 tokens), screenshots (3,000-8,000 tokens), network traces (2,000-10,000 tokens). Multiple operations quickly fill your context window.

**Best practice:** Delegate browser tasks to sub-agents. The sub-agent processes DOM data and screenshots in its isolated context, then returns a concise synthesis: "Button at selector `.submit-btn` clicked, form submitted successfully, redirected to `/dashboard`" (50 tokens instead of 15,000-token DOM dump).

See [Lesson 5: Sub-Agents for Context Isolation](/docs/methodology/lesson-5-grounding#solution-2-sub-agents-for-context-isolation) for architecture details.
:::

---

**Related Course Content:**

- [Lesson 5: Grounding](/docs/methodology/lesson-5-grounding) - Detailed architecture and use cases for ChunkHound and ArguSeek
- [Lesson 7: Planning & Execution](/docs/practical-techniques/lesson-7-planning-execution) - Multi-agent workflows that leverage MCP capabilities
