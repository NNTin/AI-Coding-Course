---
source: practical-techniques/lesson-6-project-onboarding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T09:02:24.950Z
model: claude-opus-4.5
tokenCount: 1992
---

Alex: Let's talk about one of the most underrated challenges in AI-assisted development—project onboarding. When you join a new codebase, you spend the first week drowning in unfamiliar architecture, undocumented tribal knowledge, and those critical scripts everyone uses but nobody explained. AI agents face the exact same problem, except they can't grab coffee with a senior engineer to fill in the gaps.

Sam: Right, they only see what's in their context window. No memory of yesterday's conversation, no understanding of team conventions. Every session starts from zero.

Alex: Exactly. And that 200K token context window sounds generous until you realize it includes the system prompt, your conversation history, and any files the agent reads. The solution is to codify your project context in hierarchical, machine-readable files that get injected automatically. This transforms your AI agent from a generic code generator into something that actually understands your project.

Sam: I've seen AGENTS.md files in some open-source repositories. Is that the standard approach?

Alex: It's one of two approaches the industry has converged on. AGENTS.md is the vendor-neutral standard—it works across GitHub Copilot, Cursor, Windsurf, and most other AI coding tools. Over 20,000 open-source projects use it. You put a single file in your repository root, and compatible tools inject it into context automatically.

Sam: What about Claude Code? I assume it supports AGENTS.md too?

Alex: Actually, no—Claude Code is the notable exception. It uses its own CLAUDE.md format, but with a significant architectural difference. AGENTS.md is a single file at the root. CLAUDE.md is a hierarchical system where multiple files from different directories get loaded and merged based on your working directory.

Sam: So with Claude Code, I could have a global file in my home directory, a project file at the root, and subdirectory-specific files that all get merged together?

Alex: Precisely. Your global ~/.claude/CLAUDE.md applies to everything you work on—personal coding style, operational rules, preferred tooling. The project-level CLAUDE.md captures tech stack specifics and conventions. Subdirectory files can override or extend those rules for specific modules. More specific instructions override general ones, while non-conflicting rules from all levels remain active.

Sam: That's powerful for monorepos or projects with different subsystems. But what if my team uses mixed tooling—some people on Copilot, others on Claude Code?

Alex: Good question. You can use @linking in your CLAUDE.md to reference a shared AGENTS.md. Something like "See @file AGENTS.md for project conventions." This imports the entire AGENTS.md content into Claude's context, so you maintain a single source of truth while supporting both ecosystems.

Sam: What should actually go in these files? I've seen some that are essentially duplicates of the README.

Alex: That's a common mistake. Your README should contain 90% of what an AI agent needs to understand your project. The context file adds only AI-specific operational context—MCP server configurations, environment variables, modified test commands for non-interactive execution, warnings about non-obvious dependencies. Keep it minimal.

Sam: Can you give me a concrete example of what belongs at each level?

Alex: At the global level, you're capturing your personal engineering philosophy. The course author's actual global CLAUDE.md includes things like "MINIMALISM ABOVE ALL—less code is better code," specific search protocols for using ChunkHound over subagents, and operational rules like "NEVER commit without explicit request." These are preferences that apply regardless of what project you're working on.

Sam: And project-level captures what a new team member needs to know?

Alex: Right. Tech stack specifics—"Platform: Docusaurus 3.9.2, Languages: TypeScript 5.6.2, React 19.0." Common commands—how to start the dev server, run builds, deploy. Coding conventions like "Assume strong fundamentals, skip basic explanations, link to external docs if needed." The goal is everything someone needs to be productive in the first hour.

Sam: There's a security angle here too, isn't there? These files get injected directly into system prompts.

Alex: Critical point. Security researchers have documented "Rules File Backdoor" attacks where malicious instructions are hidden using Unicode characters or other evasion techniques. Treat context files like code—version controlled, code reviewed, minimal surface area. Don't accept context files from untrusted sources.

Sam: This seems like a lot of manual work to set up properly. Is there a way to bootstrap these files?

Alex: This is where the meta-game gets interesting. You can apply the four-phase workflow from earlier lessons to generate context files automatically. In the research phase, use ChunkHound's code_research tool to understand your project's architecture, patterns, and conventions. Query for architecture, coding styles, module responsibilities, testing conventions. Use ArguSeek to retrieve framework documentation and best practices relevant to your tech stack.

Sam: So the agent analyzes the codebase and external docs, then synthesizes that into a context file?

Alex: Exactly. The plan phase synthesizes codebase insights from ChunkHound and domain knowledge from ArguSeek into a structured context file plan. Execute phase generates the actual file. Validate phase tests it with a typical task and iterates based on gaps. You get production-ready context files in one iteration instead of manually curating them over weeks.

Sam: But there's still tribal knowledge the agent can't discover from code, right? Production incidents, team conventions, non-obvious gotchas.

Alex: Always. The automated generation handles the mechanical stuff—tech stack detection, common patterns, directory structure. You add the human knowledge afterward. That bash script everyone runs before deploying, the Slack channel where architecture decisions get made, the fact that the legacy payment module has a quirk nobody documented. Those require human input.

Sam: How do you validate that a context file is actually helping?

Alex: Run the same task with and without the context file. Does the agent ask fewer clarifying questions? Does it follow your coding conventions without being reminded? Does it know to run your custom lint script before committing? The difference should be obvious within a few interactions. If you're still constantly correcting the agent on project-specific conventions, the context file needs iteration.

Sam: One thing I'm wondering about—how do you handle context files in a team setting? Everyone has different preferences.

Alex: Global files remain personal—those are your preferences. Project-level files should be team consensus, checked into the repo, reviewed like any other code change. If someone wants to override a project convention for their own workflow, that goes in their global file, not the project file. The hierarchy handles the merge.

Sam: This feels like documentation that actually gets used, because the AI enforces it automatically.

Alex: That's the insight. Traditional documentation rots because humans ignore it. Context files are documentation that an AI agent reads on every single interaction. It creates positive pressure to keep them accurate—if the context file says "run npm test" but the actual command is "npm run test:unit", you'll notice immediately because the agent will fail.

Sam: What's the minimum viable context file for a new project?

Alex: Tech stack with versions, primary dev commands, and one or two non-obvious conventions. Maybe five to ten lines. You can always expand it, but starting minimal forces you to identify what actually matters versus what's nice-to-have. The goal isn't comprehensive documentation—it's the 20% of context that addresses 80% of agent confusion.
