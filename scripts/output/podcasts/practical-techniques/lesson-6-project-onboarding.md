---
source: practical-techniques/lesson-6-project-onboarding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T14:14:55.957Z
model: claude-haiku-4.5
tokenCount: 2504
---

Alex: Let's talk about something every senior engineer has experienced: joining a new project. That first week is brutal. You're drowning in unfamiliar architecture, decisions that were made years ago, tribal knowledge scattered across Slack threads, and that one critical bash script everyone runs but nobody documented.

Sam: Right. It takes time to even know what you don't know yet.

Alex: Exactly. Now here's the interesting part: AI agents face the exact same problem. But they don't have the advantage of grabbing coffee with a senior engineer and filling in the gaps. They see whatever fits in their context window—roughly 200K tokens—and that's it. No institutional memory. No understanding of "how we do things around here."

Sam: So how do you fix that? You can't exactly onboard an AI agent the way you onboard a person.

Alex: You codify your project context in machine-readable files. Think of it like writing a runbook for how your project works, but in a format that AI agents can actually use. These files sit between the system prompt and your input, effectively giving your AI "project memory" without you having to re-explain your tech stack and conventions over and over.

Sam: What does that look like practically?

Alex: There are two main approaches that have gained traction. The first is AGENTS.md—a vendor-neutral standard that's been adopted by about 20,000 open-source projects. It works with GitHub Copilot, Cursor, Windsurf, and most other AI coding tools. It's a single file you put in your repository root, and it contains AI-specific operational context: MCP server configurations, environment variables, modified test commands for non-interactive execution, things like that. Keep it minimal—your README should already contain 90% of what an AI needs to know.

Sam: And the second approach?

Alex: Claude Code has something more sophisticated called CLAUDE.md. Instead of one file at the root, you can have multiple CLAUDE.md files at different levels—your home directory, project root, subdirectories—and they form a hierarchy. More specific instructions override general ones, but non-conflicting rules from all levels stay active. So you can define universal preferences globally, project standards at the root level, and then module-specific overrides in subdirectories without duplicating rules.

Sam: That's actually really clever. So the same context file can work across different projects?

Alex: Exactly. Global context is about your personal preferences—coding style, operational mindset, how you like to work. That lives in ~/.claude/CLAUDE.md and applies everywhere. Project-level context is what a new team member needs to be productive in the first hour: tech stack details, common commands, architectural conventions, coding standards. That's your project-root CLAUDE.md or AGENTS.md.

Sam: So if I'm using Claude Code, I get this layering behavior automatically?

Alex: Yes. If I'm working in, say, the frontend subdirectory of my project, Claude loads my global context, then my project-level context, then any module-specific context in that directory. They get merged together. If there's a conflict, the more specific one wins. If there's no conflict, they all stay active.

Sam: What if you're in a mixed environment where some team members use Copilot and others use Claude Code?

Alex: Good question. You can actually reference AGENTS.md from your CLAUDE.md using a special @linking syntax. That way you maintain a single source of truth—the shared AGENTS.md file works for everyone, and Claude Code can import it into its context system alongside its own hierarchical files.

Sam: That makes sense. But let me push back on something. How much does this really matter? I mean, context windows are getting bigger every year. Can't you just paste your entire project README into the context?

Alex: You're right that you could. But there's a cost. Every token you use for context is a token you're not using for the actual task. More importantly, unfocused context creates noise. If you dump everything—all your documentation, all your architectural notes, all your past decisions—the AI has to filter through it to find what's relevant. Structured, hierarchical context lets you inject exactly what's needed for the specific context you're working in.

Sam: Got it. So the hierarchy solves the signal-to-noise problem.

Alex: Precisely. Global context might say "we use TypeScript and we favor functional patterns." Project context might say "we run webpack with this specific config, and we have a custom testing framework." Module context in your auth subdirectory might say "this module uses async/await patterns and handles JWT tokens—here are the edge cases that have caused production incidents." Each level adds specificity without repetition.

Sam: What should actually go in these files? I think that's where people get stuck.

Alex: At global level, it's your personal preferences and operational rules. Things like "I use uuidgen for unique strings" or "I prefer explicit error handling over silent failures." At project level, it's context a new team member needs: tech stack, development commands, architectural decisions, coding conventions. Things that would normally take a senior engineer an hour to explain.

Sam: And then specific modules?

Alex: Module-level context captures the nuances that only live in that part of the codebase. API modules might need different context than UI modules. A module that handles payment processing has different requirements than a logging utility. You can override or extend the project-level context at that granularity.

Sam: There's a security angle here that seems worth mentioning.

Alex: Absolutely right. Context files are injected directly into system prompts. Security researchers have identified what they call "Rules File Backdoor" attacks where malicious instructions can be injected using Unicode tricks or evasion techniques. So treat your context files like code: keep them minimal, version-control them, code-review them before they get merged.

Sam: Minimal seems to be a theme across this course. Don't make context files solve every problem.

Alex: Right. They're a tool for bridging the gap between what's documented and what you need repeated. If something belongs in your README or inline code comments, it doesn't belong in a context file.

Sam: So let's say I'm starting a new project or joining an existing one. How do I actually bootstrap these context files?

Alex: Here's where it gets interesting. You apply the grounding workflow from the earlier lessons. The agent uses ChunkHound to understand your actual codebase—architecture, patterns, conventions, testing approach. Simultaneously, it uses ArguSeek to pull in ecosystem knowledge: framework documentation, best practices, security guidelines relevant to your tech stack. Then it plans a structured context file, generates it, and validates it by testing it on a real task.

Sam: So you're using the AI to understand the codebase structure, then using that understanding to write context files that help future AI interactions.

Alex: Exactly. It's bootstrapping. You run the agent once with a structured prompt, it analyzes your project deeply, generates a context file, you manually add the tribal knowledge that only humans know—production incidents, non-obvious gotchas, weird hacks that work but nobody understands—and then you have a context file that makes every future AI interaction more effective.

Sam: How long does that take?

Alex: The research and generation phase typically takes 5-10 minutes depending on codebase size. The validation and human annotation phase—that's where you add real value. You're looking for gaps in what the AI generated, edge cases it missed, conventions that are implicit in your codebase but not explicitly documented.

Sam: And then you commit it?

Alex: Commit it. Version control it. Treat it like any other part of your developer experience infrastructure. It evolves as your project evolves. When you adopt a new framework or change architectural patterns, you update the context file.

Sam: One more thing: if I'm working across multiple projects, does the global context become a bottleneck? Like, do I need to be constantly updating it?

Alex: You want to keep global context stable. It's your personal preferences and operational rules—things that don't change often. Project-level context is where you iterate. If you find yourself updating global context frequently, you've probably put something there that belongs at project level.

Sam: Makes sense. So the real benefit is that you're creating a feedback loop: you document your conventions in a machine-readable way, the AI understands them, and future interactions become more effective.

Alex: And faster. You're not explaining "we use TypeScript" and "we prefer functional patterns" on every single interaction. The AI already knows that. You can focus your prompts on the actual task instead of the context.

Sam: This feels like it maps to what we covered in lesson five about grounding—you're grounding the AI in your project's specific reality instead of making it operate in a generic void.

Alex: Perfect analogy. Grounding was about enriching a single prompt with relevant context. Context files are about making that enrichment permanent and reusable across hundreds of future interactions. You ground the AI once, you document it, and then every agent that works on your project benefits from that understanding.

Sam: I think the practical takeaway is clear: if you're serious about using AI agents in production, invest in context files. It's not complicated infrastructure, but it pays off immediately.

Alex: And it follows the principle we've emphasized throughout this course: the better your instructions, the better your results. Context files are just instructions encoded in a structured, hierarchical way. They're an investment that multiplies the value of every AI interaction you have.
