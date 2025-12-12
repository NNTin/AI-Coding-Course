---
source: intro.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T07:57:45.738Z
model: claude-opus-4.5
tokenCount: 1581
---

Alex: Welcome to the AI Coding Course. I'm Alex, and joining me is Sam. Before we dive into the actual content, there's something worth acknowledging upfront.

Sam: The meta thing?

Alex: Exactly. This script you're listening to right now was generated using the same AI-assisted workflow we're about to teach you. The course content, the lesson structure, even this dialog—all developed using Claude Code and the techniques covered in later modules.

Sam: So we're AI-generated voices reading an AI-generated script about how to use AI to generate code. That's... recursive.

Alex: It is. And honestly, that's the point. If these techniques can produce production-grade training material about their own application, they're robust enough for your codebase. But enough meta-commentary—let's talk about why this course exists.

Sam: Right. AI coding assistants are everywhere now. It's 2025, they're production-standard. But I've talked to a lot of engineers who tried them, got frustrated, and either gave up or settled into this awkward pattern where they're basically babysitting the AI.

Alex: That frustration wall is real, and it's predictable. The problem isn't the tools—it's the operating model. Most developers approach AI agents like they're junior developers. They wait for the AI to "understand" their intent, they fix generated code line-by-line, they fight context limits constantly.

Sam: Which is exhausting. You end up spending more time correcting the AI than you would have spent just writing the code yourself.

Alex: Exactly. And that's because "AI as junior developer" is the wrong mental model entirely. AI agents aren't teammates. They're CNC machines for code. You don't negotiate with a CNC machine or hope it understands your vision. You learn to operate it—you give it precise instructions, you set up the right fixtures, you validate the output.

Sam: That's a useful reframe. A CNC machine is incredibly capable, but only if you know how to program it correctly.

Alex: Right. And that's what this course is: operator training. We're teaching the systematic approach used in production environments. Three phases: Plan, Execute, Validate.

Sam: Walk me through those.

Alex: Planning means breaking work into agent-appropriate tasks, researching architecture, grounding the agent in context. Execution is about crafting precise prompts, delegating to specialized sub-agents, running operations in parallel when possible. Validation uses tests as guardrails, requires critical code review, demands evidence of correctness.

Sam: So it's not just "write better prompts"—it's a complete workflow.

Alex: Correct. And let me be clear about what this course isn't. It's not AI theory. We cover enough internals to operate effectively, but we're not doing a deep dive on transformer architectures. It's not prompt templates—copying prompts doesn't work; understanding principles does.

Sam: That's important. I've seen engineers collect prompt templates like recipes, but they never get consistent results because they don't understand why a particular prompt structure works.

Alex: Exactly. This course also isn't a replacement for fundamentals. You still need to know architecture, design patterns, system design. And it's explicitly not for beginners—if you don't have production experience, you need to get that first.

Sam: So who is this for?

Alex: Engineers with three or more years of professional experience who've already tried AI coding assistants and hit those frustration points. People who want to move faster without sacrificing code quality. Engineers who need to understand codebases, debug issues, or plan features more efficiently—and care about production-readiness, not demos.

Sam: That's a specific audience. What do they get out of completing this?

Alex: Concrete capabilities. Onboarding to unfamiliar codebases five to ten times faster using agentic research. Refactoring complex features reliably with test-driven validation. Debugging production issues by delegating log and database analysis to agents. Reviewing code systematically with AI assistance while maintaining critical judgment. Planning and executing features with parallel sub-agent delegation.

Sam: Those are significant multipliers.

Alex: They are. But the most important skill you'll develop is judgment—knowing when to use agents and when to write code yourself. That's what separates effective operators from frustrated ones.

Sam: Let's talk about prerequisites. You mentioned three-plus years of experience. What else?

Alex: You need access to a CLI coding agent. Claude Code, OpenAI Codex, Copilot CLI—any of them will work. If you haven't picked one yet, Claude Code is recommended at time of writing because of features like plan mode, sub-agents, slash commands, hierarchical CLAUDE.md files, and status bar support.

Sam: And mindset?

Alex: Willingness to unlearn "AI as teammate" and adopt "AI as tool." That shift is harder than it sounds for a lot of engineers.

Sam: I can see that. We're trained to collaborate, to explain context, to work with people. Treating something that responds in natural language as a machine you operate—that requires a mental reset.

Alex: It does. But once you make that shift, everything else in this course clicks into place.

Sam: How should people work through the material?

Alex: Sequential consumption is recommended. Each module builds on previous concepts. Module one covers understanding the tools—mental models and architecture. Module two is methodology—prompting, grounding, workflow design. Module three is practical techniques—onboarding, planning, testing, reviewing, debugging.

Sam: And the exercises?

Alex: Mandatory. Reading alone won't build operating skills. Work through the exercises on real codebases—your own projects, not the examples we provide. The goal is to develop muscle memory for this workflow.

Sam: Makes sense. If you only practice on toy examples, you'll still struggle when you hit a real codebase with messy dependencies and unclear architecture.

Alex: Exactly. This course is designed for engineers who ship production code. The exercises reflect that.

Sam: Alright. Where do we start?

Alex: Module one: Understanding the Tools. We'll build the mental models you need before we get into methodology. Let's go.
