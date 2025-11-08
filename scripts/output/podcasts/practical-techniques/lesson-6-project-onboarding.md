---
source: practical-techniques/lesson-6-project-onboarding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T09:11:35.965Z
model: claude-haiku-4.5
tokenCount: 3150
---

Alex: Let's talk about the thing that probably frustrates you most when you join a new project. That first week is brutal, right? You're swimming in unfamiliar architecture, tech stack decisions, tribal knowledge that's scattered across Slack threads, and that one critical bash script everyone runs but somehow nobody documented.

Sam: Oh man, the bash script. That's always the thing. Someone's been running it for three years, it does something critical, and when you ask about it everyone's like "oh yeah, we should probably document that." But AI assistants have to deal with this problem without even the option of grabbing coffee with someone on the team.

Alex: Exactly. An AI agent sees exactly what's in its context window—roughly 200,000 tokens—and that's it. No persistent memory. No understanding of "how we do things around here." Every conversation, it's starting from zero. So the solution is to be intentional about what you inject into that context upfront by codifying your project knowledge in hierarchical, machine-readable files.

Sam: So you're talking about context files—these documents that live in your repo and essentially become institutional memory for AI assistants?

Alex: Right. They're markdown documents that inject project-specific knowledge between the system prompt and your actual input. They give an AI agent "project memory" without requiring you to re-explain your tech stack, conventions, and architecture in every single conversation. The industry has converged on two main approaches: AGENTS.md, which is a vendor-neutral standard, and CLAUDE.md, which is Claude Code's hierarchical system.

Sam: What's the difference between those two?

Alex: AGENTS.md is the vendor-neutral standard that 20,000-plus open-source projects have adopted. It works across GitHub Copilot, Cursor, Windsurf, and most other AI coding tools. It's a single file at your repository root. You keep it minimal—your README should contain 90% of what an AI needs. AGENTS.md adds only the AI-specific operational context: MCP server configurations, environment variables, modified test commands that work non-interactively, warnings about non-obvious dependencies.

Sam: So it's pragmatic. Don't duplicate what's already documented.

Alex: Exactly. But Claude Code doesn't support AGENTS.md. If you're using Claude Code specifically, you use CLAUDE.md instead. And CLAUDE.md is interesting because it's hierarchical. You can have multiple CLAUDE.md files at different directory levels—one in your home directory for global preferences, one at the project root for project-wide standards, and even subdirectory-specific overrides.

Sam: How does that hierarchy work?

Alex: More specific instructions override general ones. So you might have universal coding style preferences in your global ~/.claude/CLAUDE.md, then project-specific standards at the repository root, and then module-specific rules in subdirectories. Non-conflicting rules from all levels remain active. It's a layered system that avoids duplicating rules while letting you specialize as needed.

Sam: That's elegant. So if I'm using both Claude Code and something like GitHub Copilot on the same team, how do I avoid maintaining two separate context files?

Alex: Good question. Claude Code's CLAUDE.md actually has a feature where you can use @linking to reference your AGENTS.md. You can import the entire AGENTS.md content into Claude's context directly, so you maintain a single source of truth while supporting both file formats.

Sam: Nice. That's a practical solution for mixed tooling environments. But let's talk about what actually goes into these files. What should I be documenting?

Alex: It depends on the level. At the global level, you're capturing personal preferences that apply across all your projects—your coding style, your mindset about how to approach problems, operational rules for how you like to work. Think of it as your professional defaults.

Sam: Like a personal coding philosophy document?

Alex: Essentially, yes. Here's a concrete example. The course author has a global ~/.claude/CLAUDE.md that starts with a "Mindset" section—20 years of architectural experience, emphasis on gathering thorough information before solving, working in explicit steps, being critical and validating assumptions. Then there's a "Search Protocol" section that specifies preferred tools like ChunkHound's code research tool, guidance on when to use it versus subagents, exactly how to structure queries. There's "Architecture First"—learn the surrounding architecture before coding, find and reuse existing code instead of duplicating, match surrounding patterns and style.

Sam: So the global context is really about your philosophy and your methods. How you want to work.

Alex: Right. And then you have "Coding Standards" that are specific but still personal. KISS principle—keep it simple, write minimal code that compiles and lints cleanly, fix bugs by deleting code when possible. Then "Operational Rules" that are concrete: time-box operations that could hang, use uuidgen for unique strings, use specific ISO-8601 formatting commands, prefer flat directories with grep-friendly naming.

Sam: Those are really practical. And then at the project level, it's different.

Alex: Project-level context captures what a new team member needs to be productive in the first hour. Tech stack specifics, common commands, tribal knowledge, coding conventions specific to that codebase. Here's the actual example from this AI Coding Course repository. It documents the tech stack—Docusaurus 3.9.2, TypeScript 5.6.2, React 19. It specifies the exact commands you run for development: "cd website && npm start" for the dev server, "npm run build" for production, "npm run serve" to preview locally, "npm run deploy" for GitHub Pages deployment.

Sam: But that's all in the README, right? You said not to duplicate.

Alex: Right. So AGENTS.md or CLAUDE.md at the project level adds what the README can't. The CLAUDE.md for this project includes a whole section on tone and communication style—"coworker-level communication, professional and direct, no hand-holding." That's an instruction for how the AI should help. It says "assume strong fundamentals, skip basic explanations, focus on practical application and production considerations." That's metadata about how to interact that wouldn't normally be in a README.

Sam: That makes sense. A README tells you what the project does and how to build it. The context file tells AI assistants how to help you work on it.

Alex: Exactly. And it includes context about project philosophy—"Production-Ready Architecture Focus," "Minimalism & Clarity." It links to key configuration files and explains the deployment process. It's the institutional knowledge that an AI needs to be immediately productive.

Sam: So once you've written these context files, you're set?

Alex: In practice, there's a meta-move here that's worth understanding. You can actually use the workflow from lessons 3 through 5 to generate context files automatically instead of manually writing them. Think of it as applying the same grounding and planning techniques to bootstrap your own context.

Sam: Walk me through that. How does that process work?

Alex: The four-phase workflow applies directly. In the research phase, you use ChunkHound's code_research() tool to understand your project's architecture, patterns, and conventions. You query for things like architecture decisions, existing coding styles, how modules are organized, what the testing conventions are. This gives you a comprehensive architectural understanding of what you're working with.

Sam: So the AI is reverse-engineering your codebase to understand how you build.

Alex: Right. Meanwhile, you use ArguSeek's research_iteratively() and fetch_url() to retrieve framework documentation, best practices, and security guidelines relevant to your specific tech stack. So now the AI has both codebase-specific knowledge and current ecosystem knowledge.

Sam: Then it plans.

Alex: In the plan phase, the agent synthesizes the codebase insights from ChunkHound and the domain knowledge from ArguSeek into a structured context file plan. It figures out what's critical to document, what's redundant with documentation that exists, what patterns it observed in the code.

Sam: And then it generates the file.

Alex: Execute phase, yes. The agent generates the actual context file, using the prompt optimization techniques we covered in previous lessons specific to your model. Then in the validate phase, you test the generated context with a typical task—give it a real project problem and see if the context helps it solve it better. You iterate based on gaps.

Sam: What would that prompt look like? The one that tells an agent "generate our context file"?

Alex: The lesson includes a concrete example. It's a specification prompt that tells the agent: use ChunkHound with specific queries for architecture, coding style, module responsibilities, and testing practices. Use ArguSeek to research the framework ecosystem. Then synthesize all of that into a markdown context file. The prompt includes grounding—ChunkHound provides the codebase context, ArguSeek provides the ecosystem knowledge—and a structured Chain-of-Thought that ensures the agent follows the research-plan-execute-validate path methodically. The result is production-ready context files generated in one iteration, not manually curated over weeks.

Sam: Though you still need to add the human knowledge afterward.

Alex: Exactly. The AI can discover patterns and conventions by analyzing code. But the tribal knowledge—production incidents you've learned from, team conventions that aren't codified, gotchas that only senior people know—that's still something humans need to add manually. But the AI handles 80% of the grunt work of understanding what to document.

Sam: And once you have these context files, how much better does the AI actually get at being productive in your project?

Alex: That's hard to quantify exactly, but the difference is substantial. Without project context, an AI is generic. It might give you reasonable code suggestions, but they don't know about your conventions, your dependencies, your architecture decisions. It doesn't know that you always use this specific pattern for error handling, or that you've moved away from a practice that was common three years ago but is outdated now. With context files, the AI becomes project-aware. It's not just generating code—it's generating code that fits into your specific world.

Sam: And you're not burning context window space explaining yourself every time.

Alex: Right. You establish context once, and then every subsequent interaction with the AI benefits from that institutional knowledge. That's the actual productivity gain—less re-explaining, faster feedback loops, more consistency in the output.

Sam: One more thing—you mentioned security considerations with context files?

Alex: Yes, this is worth being explicit about. Context files are injected directly into system prompts. Security researchers have identified what's called "Rules File Backdoor" attacks where malicious instructions are injected using Unicode character tricks or evasion techniques. It's a real vulnerability. So treat context files like code—keep them minimal, version-control them, have them code-reviewed like any other critical artifact. Don't assume context files are safe just because they're markdown.

Sam: So the same scrutiny you'd apply to a build script or a deploy configuration.

Alex: Exactly. Because it's affecting how an AI behaves in your codebase. If someone can compromise that file, they can change how the AI generates code. That's serious.

Sam: Alright. So the practical takeaway is: codify your project knowledge in structured context files instead of expecting AI to magically know your conventions.

Alex: Right. Use AGENTS.md if you're in a mixed-tool environment and want vendor-neutral compatibility. Use CLAUDE.md if you're all-in on Claude Code and want to take advantage of hierarchical context. Keep them minimal, version-control them, and optionally bootstrap them with an AI agent to avoid manual work. It transforms an AI from a generic code generator into a project-aware operator.

Sam: And you can layer them—global preferences, project standards, module-specific overrides.

Alex: That's the real power of the hierarchical system. You don't have to repeat yourself. General rules apply everywhere unless something more specific overrides them.
