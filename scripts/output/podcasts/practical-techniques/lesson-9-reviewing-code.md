---
source: practical-techniques/lesson-9-reviewing-code.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T16:55:42.309Z
model: claude-haiku-4.5
tokenCount: 3240
---

Alex: Your tests pass. The agent executed the plan. Everything looks complete. So what's the next question that should be nagging at you?

Sam: Whether it's actually correct.

Alex: Exactly. And that's the critical insight here. Implementation and correctness aren't the same thing. An agent can write code that passes your test suite and still have subtle bugs, architectural mismatches, edge cases handled wrong, patterns that just don't fit your codebase. This is the Validate phase from Lesson 3's four-phase workflow—the systematic quality gate before you ship.

Sam: So we're talking about code review as a formal step in the AI-assisted development process.

Alex: Right. But here's where it gets interesting. Code review with AI has a unique characteristic you need to understand: confirmation bias at scale. An agent reviewing its own work in the same conversation will defend its decisions. It has context for why it made those choices, and that context becomes a filter for how it analyzes its own code.

Sam: That's a blind spot you can't see from inside the same conversation.

Alex: Exactly. The solution is elegant: review in a fresh context, separate from where the code was written. This leverages the stateless nature of agents from Lessons 1 and 2. A new agent, without attachment to the prior decisions, analyzes objectively. Same model, same capabilities, but different analysis because it's seeing the code without the baggage of having made the original choices.

Sam: So it's not about using a different tool or model. It's about context isolation.

Alex: Precisely. You can use the exact same AI system. What changes is the conversation boundary. When you spawn a review in a fresh context, you get objective analysis instead of defensive rationalization.

Sam: What does that review look like? How do you actually structure it?

Alex: There's a prompt template that integrates techniques from Lesson 4: Prompting 101. Let me walk you through it. The template has a specific structure: you're setting up the persona, defining what the agent is analyzing, specifying the constraints of the review, and requiring evidence-based findings.

Sam: Evidence-based as in file paths and line numbers.

Alex: Exactly. This is from Lesson 7—you force grounding. The agent can't just say "there's a problem with error handling." It has to say "in src/handlers/auth.ts at lines 45-52, the error handling doesn't account for network timeouts in the refresh token flow, which violates the pattern you use in src/handlers/api.ts at lines 23-31." Now the findings are rooted in actual code, not statistical guessing.

Sam: And the template applies the prompting principles we covered earlier?

Alex: It does. Persona, constraint specification, structural requirements, grounding requirements. The same architecture you'd use for any complex prompt, now applied to review. This lets you adapt the pattern for security audits, performance analysis, architectural review—you're not memorizing a template, you're understanding the principles behind it.

Sam: Once you have the review, what do you do with it?

Alex: Code review is iterative. First review finds issues. You fix them. Then you run tests again—Lesson 8—to catch regressions. Then you review again in a fresh context, not the same conversation where the agent will defend prior decisions. You cycle through this: review in fresh context, fix issues, validate with tests, repeat.

Sam: And you keep going until...?

Alex: Until you hit a green light or diminishing returns. A green light is when there are no substantive issues and tests pass. Diminishing returns looks like this: the agent is nitpicking trivial style preferences, or it's hallucinating non-existent issues, or the "fixes" it suggests actually break working code—and your test suite catches that regression.

Sam: The tests are your objective arbiter at that point.

Alex: Exactly. If the review suggests a change and your tests fail after implementing it, the review was probably wrong. Reject the suggestion. Trust your tests. When you reach diminishing returns—maybe 4 or more iterations on minor remaining issues—the cost of additional AI review exceeds the value. Further review risks degrading quality. That's when you ship.

Sam: This assumes you have comprehensive test coverage.

Alex: It does. Lesson 8 covers that. If your tests don't catch the regression, that's a test suite problem, not a code review problem. The review cycle depends on tests being the ground truth.

Sam: What about reviewing pull requests? That's a different context entirely.

Alex: That's where it gets sophisticated. Pull requests serve two fundamentally different audiences with completely different information processing patterns. Human reviewers scan quickly, infer from context, value concise summaries—maybe 1 to 3 paragraphs. They want the "why" and business value at a glance. AI review assistants parse content chunk-by-chunk, struggle with vague pronouns and semantic drift, need explicit structure.

Sam: So a traditional PR description optimized for one audience will fail for the other.

Alex: Exactly. Too verbose for humans, too vague for AI. The solution is generating dual-optimized descriptions in a coordinated workflow. You generate a concise human-optimized summary on the PR itself, then a comprehensive AI-optimized technical context document.

Sam: How does that workflow actually work?

Alex: You use sub-agents for context conservation. This is a capability unique to Claude Code CLI. You spawn a separate agent to explore the git history and changed files, analyze the architecture, understand the codebase patterns. That sub-agent synthesizes findings and returns only the high-level results, not the raw diffs.

Sam: Why is that important?

Alex: Token consumption. Exploring 20 to 30 changed files could consume 40,000 tokens just in diffs. You'd push critical constraints into the U-shaped attention curve's ignored middle—the part of your context where the model starts missing important connections. By isolating that work in a sub-agent, you preserve your main context for synthesis and dual description generation. Other tools like GitHub Copilot or Codex can't do this. They require multiple sequential prompts: explore first, then draft. In Claude Code, you get parallel context management.

Sam: So the AI-optimized description has the architectural patterns, specific file changes, technical decisions, breaking changes enumerated clearly.

Alex: Right. It's structured for AI to parse effectively. Then when you're reviewing that PR, you read the human-optimized summary first to understand the intent, then feed the AI-optimized description to your review assistant for detailed technical analysis.

Sam: And the review itself follows a pattern.

Alex: It does. There's a template that includes a one-sentence verdict, strengths, issues organized by severity with file and line references, reusability opportunities, and a decision: approve, request changes, or reject. This structure is important because it forces the reviewer—human or AI—to think through multiple dimensions of the changeset.

Sam: You mention Chain of Draft in the material as an optimization of Chain of Thought.

Alex: Yes. CoD is efficient for reviews. Instead of generating verbose step-by-step explanations, you instruct the AI to think through each step but keep the draft minimal—5 words maximum per step. Then return the assessment after a separator. You get the same reasoning benefits as full Chain of Thought but with reduced tokens and faster responses. For review work specifically, where you're doing complex analysis across multiple dimensions, CoD is more practical than verbose CoT.

Sam: What's the difference in practice?

Alex: Chain of Thought says "think step by step and show all your reasoning." You get output like "First I examined the error handling. I found that on line 45, the code doesn't account for timeout scenarios. This is problematic because in line 23 we see the pattern is to wrap timeouts in a retry mechanism." That's clear but verbose. Chain of Draft says "think step by step, keep each step to 5 words, show final assessment after ####." You get "Line 45: missing timeout handling. Pattern breach: line 23. Inconsistent error strategy." Then the full assessment. Same analysis, less overhead.

Sam: So for a code review that's analyzing multiple files across multiple dimensions, CoD lets the AI do structured reasoning without token bloat.

Alex: Exactly. This matters in practice because reviews often look at multiple dimensions simultaneously: does this match the architecture, are errors handled consistently, does it follow our patterns, does it handle edge cases, is there duplicated logic. CoD lets you structure that analysis efficiently.

Sam: The material emphasizes evidence requirements—that the review must provide file paths and line numbers.

Alex: That's from Lesson 7. Evidence requirements force grounding. They prevent the agent from making statistical guesses. If I say "there's a problem with error handling," I'm guessing. If I say "in src/utils/validation.ts at lines 12-18, the validation function doesn't handle null input for the email field, but in src/services/user.ts at lines 45-52, the usage assumes null is impossible," now I'm pointing at specific code. The reviewer can verify or refute that claim by looking at actual lines. It's the difference between opinion and evidence.

Sam: This applies to all the review types—security audits, performance analysis, architectural review.

Alex: Right. The pattern is reusable. You adapt the template, specify what you're reviewing for, require evidence, structure the findings. The principles stay consistent.

Sam: What happens when you're the one receiving a PR that has both descriptions?

Alex: You start with the human-optimized description to understand the "why" and business value. You quickly scan for breaking changes and key files affected. That forms your initial mental model. Then you feed the AI-optimized description to your review assistant—whatever tool you're using—and that gives the AI the comprehensive technical context it needs to analyze accurately. It reduces hallucinations because the AI has explicit terminology, file paths, architectural patterns. It knows exactly what changed and why.

Sam: So the workflow is: write code, test it, review it in fresh context, iterate until green or diminishing returns, then generate dual-optimized PR descriptions, have humans and AI review using that context.

Alex: That's the complete cycle. And the key insight throughout is that review is part of the four-phase methodology we learned in Lesson 3. You research the requirements, plan the review structure, execute the analysis, validate the findings. Apply that same rigor to review as you do to implementation.

Sam: What's the most common mistake you see with code review in this context?

Alex: Skipping the fresh context. Teams will have the agent review its own work in the same conversation, get defensive feedback, then ship anyway because they know the context. That defeats the entire purpose. Review is a quality gate. It only works if it's genuinely separate from implementation.

Sam: And the second mistake?

Alex: Not iterating. They get a review, see it's not green, fix one or two things, then ship anyway. Or the opposite: iterating endlessly on nitpicks. You need to recognize when you've hit diminishing returns. If the review is finding genuine bugs, iterate. If it's suggesting variable renames and worrying about code style, you're past the point where the review adds value. Trust your tests and ship.

Sam: The emphasis on tests being the objective arbiter is important here.

Alex: It's critical. Review is probabilistic—the AI can be wrong. It might suggest changes that break working code. Your test suite is the only objective measure of correctness. If the review suggestion causes test failures, the review was wrong. Reject it. If the tests pass and review is green, you ship. If tests pass and review is nitpicking, you ship. The tests are the ground truth.

Sam: So the methodology respects both the capability and the limitation of AI review.

Alex: Exactly. AI review is powerful for catching logical issues, architectural mismatches, pattern violations, edge cases. It's limited because it's still making statistical predictions. Combine it with tests as your objective gate, and you get the benefits without the risks.

Sam: This works for the entire review process—self-review of your own code, PR reviews with human and AI, all the way through.

Alex: The principles are consistent. Research before analyzing. Structure your review. Require evidence. Iterate systematically. Stop at green or diminishing returns. The template adapts for the specific context—security review, performance analysis, architecture—but the methodology stays the same.
