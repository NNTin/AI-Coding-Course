---
source: intro.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T12:21:17.587Z
model: claude-haiku-4.5
tokenCount: 1576
---

Alex: Welcome to the AI Coding Course. I'm Alex, and this is Sam. We're going to spend the next few hours going deep on something that probably feels familiar but wrong: most developers who pick up AI coding assistants hit a wall within weeks.

Sam: Yeah, I've seen that. People get excited, then frustrated. The tools work in demos but something breaks down in real projects.

Alex: Exactly. And here's the thing—the tools are genuinely production-standard in 2025. Companies ship faster with them. Individual engineers are doing 10x their normal output. The technology isn't the problem.

Sam: So what is?

Alex: The operating model. Most developers approach AI agents like junior developers—you explain what you want, you wait for them to understand, you fix code line-by-line, you manage context limits. You're treating them like teammates when you should be treating them like CNC machines.

Sam: That's a striking analogy. You don't expect a CNC machine to understand design intent. You give it precise instructions and it executes.

Alex: Precisely. You need to learn to operate them. That's what this course is about.

Sam: Before we go deeper—I noticed something interesting. This course and the podcast you're listening to, they were both developed using the same AI techniques we're going to teach. The script, the voices you're hearing, all generated and validated through the methodology we're about to outline.

Alex: Right. It's not marketing. It's validation. If these techniques can produce production-grade training material on their own application, they're robust enough for your codebase. There's something recursive about that.

Sam: Definitely. Okay, so let's talk about what this course actually covers.

Alex: The course is structured around three things: Plan, Execute, Validate. That's the systematic approach used in production environments.

Planning is breaking work into agent-appropriate tasks, researching the architecture, and grounding everything in context. Execution is crafting precise prompts, delegating to specialized sub-agents, and running operations in parallel. Validation is using tests as guardrails, reviewing generated code critically, and requiring evidence of correctness.

Sam: Those are distinct skills. Most people focus on execution—getting good at prompt-writing—but you're saying the planning and validation are equally important.

Alex: More important, honestly. Good prompting means nothing if you've planned poorly. And weak validation is how bad code slips into production. The three work together.

Sam: Who's this course for?

Alex: Three-plus years of professional engineering experience is the baseline. You need to understand architecture, design patterns, system design. We're not teaching software engineering fundamentals. We're teaching you how to orchestrate agents that execute it autonomously.

You also need to have already tried AI coding assistants and hit those frustration points. People who haven't yet don't know what problems they're solving.

Sam: So this isn't for people learning to code.

Alex: No. And it's not AI theory. We cover enough about how these systems work to operate effectively, but nothing more. And honestly, copying prompts doesn't work. Understanding the principles does. That's why we focus on methodology, not templates.

Sam: What about someone who's tried an AI assistant, got frustrated, and then gave up? Is this course going to help them?

Alex: If they're willing to shift their mental model, absolutely. The frustration usually comes from treating agents like they're junior developers—expecting them to learn context, make judgment calls, understand intent. You have to change how you think about delegation.

Sam: What will people actually be able to do after completing this?

Alex: You'll be able to onboard to unfamiliar codebases five to ten times faster using agentic research. You'll refactor complex features reliably with test-driven validation. You can debug production issues by delegating log and database analysis to agents. You'll review code systematically with AI assistance while maintaining critical judgment.

And maybe most importantly—you'll know when to use agents and when to write code yourself. That judgment is what separates effective operators from frustrated ones.

Sam: The judgment piece seems crucial. There's a real temptation to throw everything at an AI tool.

Alex: Absolutely. Some tasks aren't suited for agentic work. Some require human intuition or architectural judgment that agents can't make independently. Learning those boundaries is part of becoming a good operator.

Sam: How should people approach the course itself?

Alex: Sequential consumption is recommended. Each module builds on previous concepts. You have three modules: Understanding the Tools covers mental models and architecture. Methodology covers prompting, grounding, and workflow design. Practical Techniques covers onboarding, planning, testing, reviewing, and debugging.

But here's the critical part—hands-on exercises are mandatory. Reading alone won't build operating skills. You need to work through exercises on real codebases, not the examples we provide. Real code has complexity and ambiguity that examples can't replicate.

Sam: That's probably where people actually learn whether they've internalized this stuff.

Alex: Exactly. Theory and practice are separated for a reason in this course structure. The exercises force you to make real judgment calls.

Sam: What do you need to actually get started?

Alex: You need three things. First, experience—three-plus years of professional software engineering. Second, access to a CLI coding agent. That could be Claude Code, OpenAI tools, Copilot CLI, or similar. Third, and this is non-negotiable, a willingness to unlearn the "AI as teammate" model and adopt "AI as tool" instead.

Sam: That mindset shift is the hardest part for most people, I'd guess.

Alex: It is. Because we've spent decades learning how to mentor junior developers, how to explain intent, how to be patient with learning curves. Those instincts actually work against you with AI agents. You have to think in terms of precise specifications, not mentorship.

Sam: All right. Let's go.

Alex: Let's go. Ready to start with Understanding the Tools.
