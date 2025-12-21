---
source: intro.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-21T12:23:17.140Z
model: claude-opus-4.5
tokenCount: 1504
---

Alex: Welcome to Agentic Coding. I'm Alex, and with me is Sam. We're going to teach you how to actually operate AI coding assistants in production—not the demo version, the real thing.

Sam: Before we dive in, I have to point out something a bit meta here. This script we're reading? It was generated using Claude Code and the exact techniques we're about to teach.

Alex: Right, and the audio you're hearing is synthesized through Google's Gemini API. So you've got AI-generated voices reading an AI-generated script about how to use AI effectively.

Sam: There's something almost absurd about that recursion. AI teaching humans how to use AI, using AI.

Alex: It is recursive, but here's why it matters: if these techniques can produce production-grade training material about their own application, they're robust enough for your codebase. This isn't a demo. It's validation. Now, let's get into it.

Sam: So what's the actual problem we're solving here? AI coding assistants are everywhere in 2025. Companies are shipping faster, engineers are claiming 10x productivity gains. But most developers I know hit a wall within weeks.

Alex: The problem isn't the tools. It's the operating model. Most engineers treat AI agents like junior developers—waiting for them to "understand," fixing their code line-by-line, fighting context limits. That mental model is fundamentally wrong.

Sam: What's the right mental model then?

Alex: AI agents aren't teammates. They're CNC machines for code. Think about it—a CNC machine doesn't "understand" what you want. You give it precise specifications, it executes. If the output is wrong, you don't coach the machine, you fix your specifications.

Sam: That reframe is significant. Instead of managing a junior dev, you're operating industrial equipment.

Alex: Exactly. And that's what this course is—operator training. We teach a systematic approach used in production environments. Three phases: Plan, Execute, Validate.

Sam: Break those down for me.

Alex: Planning means breaking work into agent-appropriate tasks, researching architecture, grounding prompts in context. Execution is crafting precise prompts, delegating to specialized sub-agents, running operations in parallel. Validation uses tests as guardrails, reviews generated code critically, and requires evidence of correctness.

Sam: That sounds like a proper engineering workflow, just with agents as the execution layer.

Alex: That's precisely what it is. You're still the architect. You're still responsible for quality. But the agent handles execution at a pace you couldn't match manually.

Sam: Let's be clear about what this course isn't, though. I've seen a lot of "prompt engineering" content that's basically template copying.

Alex: This isn't that. Copying prompts doesn't work because context matters. We're teaching principles, not templates. This also isn't AI theory—we cover enough internals to operate effectively, nothing more. And critically, this isn't a replacement for fundamentals. You still need architecture knowledge, design patterns, system design. The agent amplifies your skills; it doesn't replace them.

Sam: So who's this actually for?

Alex: Engineers with three or more years of professional experience who've already tried AI assistants and hit frustration points. People who want to move faster without sacrificing code quality. If you don't have production experience yet, go get that first. This course assumes you know how to engineer software—we're teaching you how to orchestrate agents that execute it.

Sam: What's the structure?

Alex: Three modules, sequential. Module one covers fundamentals—mental models and architecture. Module two is methodology—prompting, grounding, workflow design. Module three is practical techniques—onboarding, planning, testing, reviewing, debugging. Each module builds on the previous. Don't skip ahead.

Sam: And the exercises?

Alex: Mandatory. Reading won't build operating skills. Work through the exercises on real codebases, not the toy examples we provide. You learn to operate by operating.

Sam: What should engineers expect to gain by the end?

Alex: Concrete capabilities. Onboard to unfamiliar codebases five to ten times faster using agentic research. Refactor complex features reliably with test-driven validation. Debug production issues by delegating log and database analysis to agents. Review code systematically with AI assistance while maintaining critical judgment. Plan and execute features with parallel sub-agent delegation.

Sam: That's a substantial list. But I'd argue the most valuable skill isn't on it.

Alex: You're thinking of judgment—knowing when to use agents and when to write code yourself.

Sam: Exactly. That's what separates someone who's productive from someone who's fighting the tools constantly.

Alex: And that judgment is what we're really teaching. The techniques are learnable. The judgment comes from understanding the underlying principles deeply enough to make good calls in novel situations.

Sam: What do people need before starting?

Alex: Three or more years of professional software engineering experience. Access to a CLI coding agent—Claude Code, OpenAI Codex, Copilot CLI, whatever you prefer. If you haven't picked one, Claude Code is recommended at time of writing for its plan mode, sub-agents, slash commands, hierarchical CLAUDE.md configuration, and status bar support. And most importantly, a willingness to unlearn "AI as teammate" and adopt "AI as tool."

Sam: That mindset shift is probably the hardest part.

Alex: It is. Engineers have spent years developing collaboration skills for working with humans. Those instincts actively interfere with operating AI effectively. You have to consciously override them.

Sam: Alright. Where do we start?

Alex: Lesson one: LLMs Demystified. We need to understand just enough about how these systems work to operate them effectively. Not the theory—the practical implications for your workflow.

Sam: Let's get into it.
