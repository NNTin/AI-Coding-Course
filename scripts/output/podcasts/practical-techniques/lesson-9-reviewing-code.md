---
source: practical-techniques/lesson-9-reviewing-code.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T13:35:25.366Z
model: claude-haiku-4.5
tokenCount: 1728
---

Alex: Your tests pass. The agent executed your plan. Everything looks good. But here's the uncomfortable truth: an agent's implementation is probabilistic. It could contain subtle bugs—logic errors, architectural mismatches, edge cases handled wrong.

Sam: So testing alone isn't enough. You need code review.

Alex: Exactly. And this is where most teams break the workflow. They ask the same agent that wrote the code to review it. That's confirmation bias waiting to happen.

Sam: Why is that a problem? If the agent understands the code it wrote, wouldn't it catch its own mistakes?

Alex: No. An agent reviewing its own work in the same conversation will unconsciously defend its decisions. It remembers the reasoning that led to those choices. A fresh agent, in a new context, has no attachment to prior decisions. It analyzes objectively.

Sam: So you need a completely separate review conversation.

Alex: Yes. This connects back to the methodology from Lesson 3—Research, Plan, Execute, Validate. Code review is the Validate phase. It's the quality gate before shipping. And it has to be systematic, not a quick glance.

Sam: What does systematic review actually look like?

Alex: It starts with a review prompt template that bakes in everything from Lesson 4's prompting principles. You're assigning a persona—"expert code reviewer"—which biases the model toward review-specific vocabulary and patterns. Then you inject context: the original requirements, constraints, what the code was meant to accomplish.

Sam: You're grounding the review in your intent, not some generic definition of good code.

Alex: Precisely. Then you use Chain-of-Thought—"think step-by-step through each aspect below." The agent can't skip to "looks good" without systematically analyzing architecture, quality, maintainability, potential issues. You structure the checklist with numbered sections and subsections to force attention allocation.

Sam: That's the key, right? Without structure, an agent will focus on whatever's easiest to critique—syntax, naming conventions—and miss critical logic bugs.

Alex: Right. And you add an explicit grounding directive: "Use your code research tools to compare against existing patterns in our codebase." Without this, the agent hallucinates best practices that don't match your architecture. If your codebase uses active record everywhere, the agent shouldn't recommend repository patterns.

Sam: Then you have the hard constraint: "Do not edit anything—only review."

Alex: That's non-negotiable. In autonomous workflows, agents will "helpfully" fix issues they find, but you haven't validated those fixes yet. Review and execution have to be separate phases. You read the findings, make decisions, then implement fixes.

Sam: Once you have those findings, what happens?

Alex: You fix the issues. Then here's where most teams stop: they fix the code and assume it's done. But you need to review again—in a new context, same template, fresh perspective. The first review finds critical issues. Second review finds what remains. Third review might find nothing, or just nitpicks.

Sam: How do you know when to stop iterating?

Alex: When you hit diminishing returns. You're looking for a green light: no substantive issues. But watch for two stop signals. First, the agent starts nitpicking—reporting trivial style preferences instead of logic bugs. That means you're past the useful depth of review. Second, hallucination: the agent invents problems that don't exist, suggests patterns that don't fit your stack, or contradicts itself.

Sam: So three reviews is typical?

Alex: Could be two, could be four. Depends on the code. I've seen critical bugs caught in the first review that require only one fix cycle. I've also seen cases where the agent keeps finding minor issues through four iterations, and at some point you make a judgment call: further review costs more than manually verifying the remaining code.

Sam: The hands-on exercise in the material—the user profile export scenario—is a good example of this.

Alex: That one is instructive because it's designed to catch multiple classes of errors. There's a SQL injection vulnerability, an authorization bypass, error handling gaps, overly permissive data exposure. A systematic review catches those. A casual glance misses them.

Sam: And that only happens because you're in a fresh context, looking at the code objectively.

Alex: Yes. If you tried to review it in the same conversation where the agent generated it, the agent would defend the implementation. It would say "this matches standard patterns" because it's thinking about the reasoning that led to that code. Fresh context eliminates that bias.

Sam: What about the review template itself—is that flexible, or is it rigid?

Alex: It's a pattern you adapt. The structure works for security reviews, performance analysis, architectural validation. The core pattern is: persona, context injection, Chain-of-Thought instruction, structured checklist, grounding directive, execution constraint. You swap out the checklist items based on what you're reviewing for. Security review has different priorities than performance review.

Sam: So it's about understanding the principles, not memorizing a template.

Alex: Exactly. Once you understand that persona shapes vocabulary, that Chain-of-Thought forces systematic thinking, that grounding prevents hallucination, you can compose review prompts for any context. You might review database migrations, API contracts, configuration files. Same principles apply.

Sam: And the ultimate goal is codifying this as standard practice, right? Not something you remember to do on important PRs, but something that's automatic.

Alex: Right. You put this in your project's .claude.md or AGENTS.md file from Lesson 6. You write a rule: "After implementation is complete, trigger a systematic review in fresh context using the review template." Then agents automatically do it. Code review becomes a standard practice, not an afterthought.

Sam: Which fundamentally changes your shipping velocity. You're not waiting for a human code reviewer; you're getting automated review that actually catches the kind of errors humans miss on first pass.

Alex: Exactly. And you're thinking about Lesson 8's testing framework. Tests verify behavior. Review verifies that behavior was implemented correctly, that edge cases are handled, that the code fits your architecture. Together they form a quality gate that's actually defensible.

Sam: That's the payoff from understanding the four-phase methodology across all these lessons. Each phase builds on the last.

Alex: Yes. Research understands the landscape. Plan structures the solution. Execute generates the code. Validate catches what execution inevitably missed. And when you run that cycle systematically, with fresh context for review, you ship code with genuine confidence.
