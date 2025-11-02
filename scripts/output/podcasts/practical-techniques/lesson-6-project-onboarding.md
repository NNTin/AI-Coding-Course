---
source: practical-techniques/lesson-6-project-onboarding.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:11:51.248Z
model: claude-haiku-4.5
tokenCount: 4540
---

Alex: When you join a new project as an engineer, there's this specific kind of chaos that hits you in the first week. You're drowning in architectural decisions you don't understand, tech stack details you've never seen before, and there's always this one critical bash script that everyone uses but nobody documented. It's tribal knowledge scattered across Slack threads and institutional memory.

Sam: Yeah, I've been there. You spend your first few days just trying to get the development environment running. And even then, you're not sure if you've set it up correctly because nobody wrote down the steps.

Alex: Exactly. But here's the problem when you're working with AI agents - they don't have the luxury of asking someone at lunch, or scrolling through six months of Slack history to figure out how things work. They see what's in their context window and that's it. About 200,000 tokens. That's their entire world.

Sam: So you're saying if the knowledge isn't in that window, the agent basically has to invent solutions?

Alex: Precisely. Which means it'll reinvent patterns you've already solved, miss critical constraints you've learned the hard way, and produce code that doesn't fit with how your team actually works. The solution is to codify your project context in machine-readable files - things like CLAUDE.md or .cursorrules depending on which AI tool you're using.

Sam: So it's like creating an onboarding document, but specifically for AI?

Alex: It's more fundamental than that. It's encoding the difference between "generic code generator that happens to write JavaScript" and "project-aware operator that understands our architecture, follows our patterns, and avoids our known pitfalls." When a new AI agent starts working on your codebase, it should have instant access to the same context that makes a senior engineer productive.

Sam: What does that actually look like in practice?

Alex: Let me walk through a concrete example. Imagine an e-commerce backend - microservices, multiple databases, specific testing strategy, deployment pipeline. A good context file would tell the agent: we use pnpm as the package manager, not npm. We only use ES modules, never CommonJS. Database connections must go through our pooling layer. Errors get wrapped in structured error classes. Transactions have explicit rollback handlers.

Sam: That's interesting because those feel like the kinds of things you'd naturally discover by reading the codebase itself.

Alex: You'd think, right? But that's the exact problem. An agent could easily read a file using `pg.Client` directly, see it works, and generate code the same way - missing that your codebase has a centralized pool in `db/pool.ts` that it should be using. Or it might generate a Promise-based async pattern when your team uses async/await consistently.

Sam: So the context file is less about teaching principles and more about encoding decisions you've already made?

Alex: Exactly. It's tribal knowledge converted to explicit rules. And there's a hierarchy to it. You can have a global context file in your home directory that applies to every project you work on - your personal coding preferences. Then a repository-level context that's specific to that codebase. And then subdirectory-specific contexts for components within a monorepo.

Sam: How does the precedence work when you have overlapping rules?

Alex: More specific files override general ones. So if your global context says "always use Prettier formatting" but your repo-level context specifies a particular Prettier config, the repo rules win. It's additive and hierarchical.

Sam: That makes sense. But I'm curious - if different AI tools use different file formats, doesn't that become a maintenance nightmare? Do you have to maintain .cursorrules for Cursor, CLAUDE.md for Claude, and who knows what for Copilot?

Alex: That's a genuine problem. Right now, different tools have different conventions. Cursor uses .cursorrules or .mdc files. Claude Code uses CLAUDE.md. There's a movement toward a vendor-neutral standard called AGENTS.md, but adoption is still early.

Sam: What's the philosophy behind keeping it vendor-neutral?

Alex: Two things. First, you don't want to lock your configuration to a single tool. Your team might use Claude Code today and switch to Cursor next year. Second, security. The more comprehensive your AI configuration file, the larger the attack surface for what people call "Rules File Backdoor" attacks - where someone injects malicious instructions into your context files.

Sam: So the idea is to keep the AI-specific stuff minimal?

Alex: Right. The philosophy is: put 90% of your context in normal documentation. Your README, architecture docs, whatever already exists. Use AGENTS.md or CLAUDE.md only for the operational details that are really specific to how agents interact with your system. Like, "when running tests, add the --no-interactive flag because we're in a CI environment" or "E2E tests require the Docker daemon to be running."

Sam: That makes sense from a security perspective. If someone edits your context file, they can't do as much damage if most of the knowledge is elsewhere.

Alex: Exactly. And it's also cleaner from a documentation perspective. Your README should be the source of truth for how to develop in your project. Your context file is supplementary.

Sam: So what would a well-structured context file actually contain?

Alex: Let me break down the anatomy. You start with a project overview - two to three sentences describing what the system does, its architecture type, and the scale. Then the tech stack: runtime, framework, database, key dependencies. Then development commands - how to install, how to run locally, how to run tests and what different test commands do.

Sam: And beyond that?

Alex: Coding conventions. Your module system - are you using ES modules or CommonJS? How do you handle async code? How do you structure error handling? Then key files - the three to five most important files in the codebase with brief descriptions of what they do. And critical constraints.

Sam: What do you mean by critical constraints?

Alex: Things like "never commit API keys" or "always run typecheck before pushing" or "database schema changes require migration files." These are the gotchas that can break your system if ignored. They should be explicit and visible, not buried in tribal knowledge.

Sam: How do you decide what goes in there versus what's obvious from reading the code?

Alex: Good question. If it's something a reasonable engineer could figure out by reading the code, it doesn't belong. If it's something that could only be learned by painful experience or by asking a teammate, it belongs. The "staging database is flaky, always retry failed connections" type thing. Or "we seed test data in a specific order because of foreign key constraints."

Sam: I'm thinking about the common pitfalls section you mentioned. How specific should that be?

Alex: Very specific. Not just "be careful with database connections" but "database connections must use our pool in db/pool.ts, never create raw pg.Client instances, and transactions must be wrapped in try/catch with explicit rollback." Now an agent reading that understands the actual constraint.

Sam: So the context file is almost like a specification for how the agent should operate?

Alex: That's actually a great way to think about it. It's a specification of your team's engineering practices, encoded in a format that an agent can read and follow. When you hand an agent a task, it's not starting from a generic set of defaults anymore. It understands your architecture, your tool choices, your patterns.

Sam: Let's talk about the hierarchy you mentioned earlier. How does that work in practice with a monorepo?

Alex: Say you have a monorepo with multiple services. You have a root CLAUDE.md that covers the whole project - tech stack, general conventions, build system. Then you might have services/user-service/CLAUDE.md that explains user service-specific patterns, like how authentication works or specific database schema concerns. And services/payment-service/CLAUDE.md that covers payment-specific stuff like how you handle Stripe webhooks or PCI compliance requirements.

Sam: So when the agent is working in the payment service, it gets the root context plus the payment-service-specific context?

Alex: Exactly. It merges them. The more specific rules can override or augment the general ones. So the root file says "all errors get wrapped in structured error classes" and the payment service file adds "payment errors additionally log to our compliance audit trail."

Sam: That seems like it could get complex pretty quickly. How do you prevent the hierarchy from becoming unwieldy?

Alex: By being disciplined about what belongs at each level. Root context is truly global - applies to every part of the project. Service-level context is specific to that service. And you keep it focused. If you find yourself writing a 500-line CLAUDE.md for a single service, you're probably putting too much there. It should be concise.

Sam: So the process for creating these files would be... what exactly?

Alex: You start by analyzing the codebase. Read the package.json to understand the tech stack and dependencies. Look at the README for how development actually works. Find the test commands - whether that's scripts in package.json, a Makefile, whatever. Scan the actual code to identify patterns. Do files use ES modules or CommonJS? How are async operations handled? How are errors represented?

Sam: And then you synthesize that into the context file?

Alex: Right. But here's the thing - you can actually have the agent help you with this. You can point an agent at your codebase and say "analyze this and draft a CLAUDE.md that captures the tech stack, development setup, and code patterns." The agent can extract a lot of the structure from the documentation that already exists.

Sam: That's clever. So you're using the agent to bootstrap its own configuration.

Alex: Exactly. And then you review what it generated, add the tribal knowledge pieces it couldn't discover, maybe reorganize for clarity. But the skeleton is there and you've saved a lot of manual work.

Sam: Once you have a context file, how do you validate that it actually works? That it helps the agent be more effective?

Alex: Good test is to start a fresh conversation with the agent - so it has no memory of previous interactions - and give it a typical task. Something like "add input validation to the login endpoint" or "fix this failing test." Then you observe: does it use the right patterns? Does it put code in the right places? Does it know to run the right tests?

Sam: And if it gets something wrong?

Alex: You note what it missed or got wrong, update the context file to be more explicit about that thing, and test again with the same task. Iterate until the context file is comprehensive enough that the agent consistently produces code that fits with your project.

Sam: How much time does this investment actually save in the long run?

Alex: That depends on how much you interact with AI agents. If you're using them regularly - which most teams are now - it saves a huge amount of cognitive load. Your agent isn't constantly asking clarifying questions or producing code that needs rewrites. It just... works. It writes code that fits.

Sam: But there's also the ongoing maintenance aspect, right? If you change your conventions, the context file needs to change too.

Alex: That's true, but it's not a huge burden if you treat it like other documentation. When you decide to upgrade to a new testing framework, the engineer who does that also updates the CLAUDE.md. It becomes part of the change process.

Sam: I'm thinking about the security angle you mentioned earlier. Is there anything specific you should avoid putting in the context file?

Alex: Absolutely. Never hardcode actual secrets - API keys, database passwords, anything like that. You reference secret management systems instead. "Use AWS Secrets Manager for database credentials" rather than listing the actual credentials. The context file is version controlled and potentially visible to multiple people, so treat it like any other code repository.

Sam: What about sensitive architectural information? If I describe exactly how my infrastructure is set up, isn't that an attack surface?

Alex: That's worth thinking about. There's a balance. You need enough detail that the agent can make good decisions. But you don't need to describe your exact AWS resource layout or security group configuration. "Services communicate via REST APIs on internal DNS" is enough. You don't need "service runs on t3.large in us-west-2 in VPC vpc-12345."

Sam: That makes sense. Keep the architectural concepts but not the operational details.

Alex: Right. Anyone reading your code repository can see the architecture anyway. The context file just makes explicit what's already implicit in the code structure.

Sam: Let me ask about tooling. Are there tools that help you generate or maintain these context files automatically?

Alex: Not really mature solutions yet. There's some experimentation with having agents generate context files from analyzing code. But mostly it's a manual process guided by the template approach we talked about. Some teams use simple scripts to extract information from their config files and build a context file, but that's pretty custom.

Sam: Would you generate separate context files for different agents if you were using multiple tools?

Alex: If you're using both Claude Code and Cursor heavily, you might maintain a CLAUDE.md and a .cursorrules file. But they should be consistent - same information, different format. Some teams keep them aligned manually, which isn't ideal but works.

Sam: Or you use that vendor-neutral AGENTS.md approach you mentioned?

Alex: Yeah, if you're forward-thinking about it. Put everything in AGENTS.md once and trust that tools will eventually standardize on reading from it. But we're not quite there yet.

Sam: Let's talk about the scope of a context file. When you have all this hierarchy, how much should a single file contain?

Alex: Keep it readable. A root CLAUDE.md should be maybe 200-300 lines maximum. You can link to external documentation for details. Your CLAUDE.md says "see docs/architecture.md for the full system design" rather than explaining the whole system in the context file. The context file is the quick reference - the things you need instantly.

Sam: So it's optimization for readability and quick lookup?

Alex: Yes. An engineer or agent should be able to scan it in five minutes and understand enough to be productive. If it takes 20 minutes to read, you've put too much in there.

Sam: One thing I'm wondering about - once you have this context file, do you expect developers to read it? Or is it primarily for the AI?

Alex: Both, but the primary audience is your team. The AI just happens to be able to read it too. A good CLAUDE.md serves as a quick reference guide for onboarding new engineers. They read it and know immediately how to run tests, what module system to use, which files to look at first.

Sam: So it's not created specifically for the AI, it's just written in a format that the AI can also read?

Alex: Exactly. You're creating good documentation and structuring it so that machines can parse it too. That's the right way to think about it.

Sam: What about the future? Are there things you expect to change about how context files work?

Alex: I think we'll see standardization. Right now every tool has its own format, which is friction. I expect a few years from now there will be a clearer standard - probably something like AGENTS.md - and tools will converge on it. The syntax might change, but the concept of hierarchical, project-specific agent configuration is here to stay.

Sam: That makes sense. It's solving a real problem - AI agents need to understand your project - and the problem isn't going away.

Alex: Right. And the broader pattern here is important. You're not creating context files because AI is magic and can magically read your code better if you write it down. You're creating them because you're explicitly teaching the agent how to operate in your environment. How to think like your team, follow your patterns, avoid your pitfalls.

Sam: It's less about documenting the system and more about instructing the agent on how to work effectively within it.

Alex: Exactly. And that's a shift in how we think about documentation. Historically, documentation is written for humans. Now part of it also has to be machine-readable. Which actually makes our documentation clearer overall, because being explicit for machines forces us to be precise.

Sam: Do you see teams struggling with this, or is it pretty straightforward to adopt?

Alex: It's straightforward once you understand the pattern. The barrier is usually just realizing it's a thing that exists. Engineers think "oh, I'll just give the agent my codebase and it'll figure it out." And sometimes it does, and sometimes it produces code that's technically correct but doesn't fit with the team's actual practices. Once they see that friction, they're motivated to create a context file.

Sam: The key is that first experience where the agent goes wrong in a way that could have been prevented by being more explicit?

Alex: Absolutely. That's when people get it. They say "I spent an hour refactoring this code the agent wrote because it used the wrong pattern" and then they understand why a context file matters.

Sam: So my takeaway here is: context files are just documentation, but structured specifically so that agents can read and follow them. And they dramatically reduce the friction of working with AI on your actual projects.

Alex: That's exactly right. They're the difference between using AI as a generic code generator and using AI as an integrated tool that actually understands your project. And given how much we're all using these tools now, that's worth getting right.
