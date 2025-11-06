---
source: practical-techniques/lesson-6-project-onboarding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T13:06:43.535Z
model: claude-haiku-4.5
tokenCount: 2102
---

Alex: Let's talk about project onboarding—specifically, how to onboard AI agents into your codebase. When you join a new project as an engineer, that first week is brutal. You're drowning in unfamiliar architecture, tech stack decisions, and tribal knowledge scattered across Slack threads. There's always that one bash script everyone runs that nobody documented.

Sam: Right. And you figure it out by grabbing the senior engineer and asking a lot of questions over coffee.

Alex: Exactly. But AI agents don't have that option. When you hand them a prompt, they can see about 200,000 tokens of context—your code, their instructions—and that's it. No memory of yesterday's conversation. No intuitive understanding of how your team does things. They're starting fresh every time.

Sam: So they're operating blind. They see the immediate problem but miss all the surrounding conventions and architecture.

Alex: Precisely. The solution is to codify your project context in files that live in your repository. Files that inject project-specific knowledge directly into the agent's system prompt, giving them what we call "project memory."

Sam: Like documentation that's specifically written for AI consumption, not humans?

Alex: Not exactly. It's documentation written for both, but structured in a way that machines can parse reliably. The industry has converged on two main approaches. AGENTS.md is the vendor-neutral standard—it works across GitHub Copilot, Cursor, Windsurf, and most other AI tools. Single file at your repository root.

Sam: And Claude Code?

Alex: Claude Code uses CLAUDE.md, which is more sophisticated. It supports hierarchical context—multiple files at different levels of your repository that automatically merge based on your working directory. You can define universal preferences globally in your home directory, project standards at the root, and module-specific overrides in subdirectories.

Sam: So with CLAUDE.md you're not duplicating rules across different places.

Alex: Right. More specific instructions override general ones, but non-conflicting rules from all levels remain active. It's a layering system. Your global ~/.claude/CLAUDE.md might say "I prefer functional programming patterns and minimal comments," while your project's CLAUDE.md adds tech-stack specifics like "we use Docusaurus 3.9.2 and TypeScript 5.6." A subdirectory under /website might then add "in this module, we use React hooks and avoid class components." All three are active, no redundancy.

Sam: So if you're working with AGENTS.md, you're stuck with a single file. What goes in it?

Alex: Keep it minimal. Your README should contain 90% of what AI agents need—tech stack, architecture overview, development setup. AGENTS.md adds only the operational context that's specific to AI: MCP server configurations, environment variables, modified test commands for non-interactive execution, gotchas about non-obvious dependencies.

Sam: Things that would be implicit in a human onboarding but need to be explicit for an agent.

Alex: Exactly. And there's a security consideration here. Context files are injected directly into system prompts. Security researchers have found "Rules File Backdoor" attacks where malicious instructions get injected using Unicode evasion or other tricks. So treat context files like code—version control them, code review them, keep them minimal.

Sam: That makes sense. Now, you mentioned there's a way to use both AGENTS.md and CLAUDE.md in the same project?

Alex: Yes. If you're in a mixed-tool environment where some team members use Copilot and you're using Claude Code, you can use a feature called @linking in CLAUDE.md to reference AGENTS.md. It pulls the entire AGENTS.md content into your Claude context. Single source of truth, both formats supported.

Sam: So you're not maintaining duplicate documentation.

Alex: Correct. Now, here's where it gets interesting. The real leverage is automating context file generation. You don't want to manually write these files—that's slow and error-prone. Instead, apply the workflow from earlier lessons: use AI agents to bootstrap their own context.

Sam: Walk me through that.

Alex: Four phases. Research: The agent uses code analysis tools like ChunkHound to understand your project's architecture, coding patterns, and conventions. While simultaneously, it uses research tools to pull in framework documentation and best practices. Plan: It synthesizes those two signals—what your codebase actually does, and what the ecosystem recommends—into a structured plan for the context file. Execute: Generate the file using the prompting techniques we covered. Validate: Test the generated context by having the agent work on a typical task, iterate on gaps.

Sam: What kind of things would the code analysis turn up?

Alex: Architecture patterns, module responsibilities, testing conventions, naming strategies—how you organize your code. Then the agent adds the human knowledge afterward: production incidents, team-specific gotchas, non-obvious decisions that only people who lived through them would know.

Sam: So the AI generates the technical foundation, and humans add the war stories.

Alex: That's a good way to frame it. The agent can read code and documentation at scale. What it can't do is know that three years ago you tried microservices and it nearly destroyed the team, so now you're monolithic but with clear service boundaries. That context only comes from the people who lived it.

Sam: That seems like a more sustainable approach than manually maintaining these files.

Alex: It is. And it scales. If you have thirty services across your company, each one can have its own hierarchical context—global company standards, service-specific conventions, module-specific quirks. Each agent gets the complete picture for the specific code they're working in.

Sam: Without bloating the context window.

Alex: Right. The agent only loads what's relevant to their working directory. It's efficient and precise.

Sam: Let me ask this—when you're setting up initial context for a project that doesn't have one, what's the minimum viable file? What can't you skip?

Alex: Tech stack and development environment. How to run the project locally, how to run tests, critical architectural decisions, and any non-obvious gotchas. If you're using specific MCP servers or custom tools, those need to be documented. And if there are security concerns—like "never commit API keys, use .env files"—that's critical.

Sam: Beyond that, is more always better? Or does bloated context actually hurt?

Alex: It hurts. Bloated context creates two problems. First, it increases latency—the agent has to parse more text before it can start working. Second, it dilutes signal. If half your context is rules the agent will never need, you're wasting tokens. You want dense, high-signal context.

Sam: So iteratively refine it based on what agents actually ask for.

Alex: Exactly. Start with the minimum viable file. Use your agents for a week. Watch what questions they ask. If they keep asking "how do I run tests," that's a signal to add it. If they're asking about package management, add that. The file evolves based on actual agent behavior, not theoretical completeness.

Sam: That makes sense. One more thing—you mentioned vendor-neutral AGENTS.md works across most tools except Claude Code. In practice, how painful is it to maintain both formats?

Alex: If you use the @linking approach, it's not painful at all. You maintain AGENTS.md as the source of truth, and CLAUDE.md simply references it. The only exception is hierarchical features—if you want module-specific overrides, that's CLAUDE.md-only. But for most projects, AGENTS.md plus a thin CLAUDE.md layer is sufficient.

Sam: And if you're a single-tool shop using only Claude Code?

Alex: Then just use CLAUDE.md hierarchically. No need for AGENTS.md. You get the layering benefits without extra files.

Sam: So the decision tree is: multi-tool team, use AGENTS.md as the source and @link it in CLAUDE.md. Single-tool Claude Code shop, just use CLAUDE.md with hierarchy.

Alex: That's right. And remember, this isn't about documentation for documentation's sake. The goal is to make AI agents productive in your codebase on day one. Context files are how you transfer implicit knowledge into explicit, machine-readable format. That's the leverage point.
