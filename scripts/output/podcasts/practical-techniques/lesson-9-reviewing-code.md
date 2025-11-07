---
source: practical-techniques/lesson-9-reviewing-code.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T14:46:21.098Z
model: claude-haiku-4.5
tokenCount: 2348
---

Alex: So you've finished implementing the feature. Tests pass, the agent executed your plan—everything looks good. But here's the critical question we need to address: is it actually correct? This is the Validate phase from Lesson 3, and it's where the probabilistic nature of AI coding assistants becomes relevant.

Sam: Probabilistic meaning the agent might introduce subtle bugs that don't fail tests? Like architectural mismatches or edge cases that pass the happy path but break in production?

Alex: Exactly. Code review catches what iterative development can't see. And here's the key insight: you need to review in a fresh context, separate from where the code was written. That separation is critical.

Sam: Why? Can't the same agent that wrote it just review its own work in the same conversation?

Alex: No, and this is actually an important lesson from earlier in the course. An agent reviewing its own work in the same conversation will defend its decisions. It has context around why it chose a particular approach, and that becomes a weakness when reviewing. A fresh context—a new conversation, or a completely different agent—analyzes objectively. No attachment to prior choices.

Sam: So you're leveraging the stateless nature that we talked about before. The agent doesn't know what it decided earlier, so it can't rationalize those decisions.

Alex: Right. And practically speaking, this means after implementation passes tests, you open a new conversation, provide just the code and the requirements, and ask for a systematic review. We have a template for this.

Sam: What makes the template different from just asking "please review this code"?

Alex: The template applies the prompting principles from Lesson 4—persona, chain-of-thought, structure, grounding. It establishes clear criteria for what you're looking for: logic bugs, architectural mismatches, edge cases, patterns that don't fit your codebase. And it requires evidence. No vague "this looks wrong"—line numbers, file paths, specific changes.

Sam: So the agent can't hallucinate issues that don't exist.

Alex: Exactly. The evidence requirement forces grounding. But here's where it gets real: review is also probabilistic. The reviewing agent can be wrong. It might suggest "fixes" that break working code or miss genuine issues entirely.

Sam: So tests become the arbiter. If the review suggests a change and tests suddenly fail, the review was probably incorrect.

Alex: Yes. And this is where operator judgment matters. You're looking for three outcomes: tests pass and the review finds real issues—ship after fixing. Tests pass and the review only nitpicks style—ship as-is. Tests fail after a review-suggested "fix"—reject the suggestion and trust your tests.

Sam: That makes sense. But how many times should you iterate on this cycle?

Alex: Until you hit green or diminishing returns. First review finds substantive issues, you fix them, re-run tests, review again in fresh context. Continue until the review is clean or the findings become trivial. Trivial looks like renaming variables for readability, or the agent inventing non-existent issues, or suggesting patterns that don't fit your architecture.

Sam: And excessive iteration becomes a problem. Like if you're on your fourth round of fixes for minor issues, you're probably just burning cost.

Alex: Right. The tests are objective. Once they pass and review quality drops to nitpicking, trust the tests and ship. The code is correct according to your specifications. Further AI review costs more than it provides.

Sam: So this is different from the implementation phase where you iterate based on test feedback. There it's "did I implement the specification?" Here it's "is the implementation actually good?"

Alex: Exactly. Tests validate correctness against specifications. Review validates quality—architectural fit, hidden bugs, maintainability. Two different gates.

Sam: Now, you mentioned pull requests earlier. Is this where that comes in?

Alex: Yes. Pull requests serve two audiences now: human maintainers and their AI review assistants. Those audiences process information completely differently.

Sam: How so?

Alex: Humans skim PR descriptions quickly, infer context visually, and want concise summaries. They're reading in three seconds and deciding if this is interesting. AI agents read statistically, chunk-by-chunk, and need explicit structure. Vague pronouns confuse them. Semantic drift breaks comprehension. They need specific terminology, file paths, architectural patterns enumerated.

Sam: So a typical PR description might work for one audience and confuse the other.

Alex: Right. The traditional approach is either write verbose enough for AI or concise enough for humans, but not both. We can do better. The pattern here uses a structured prompt that generates both—a human-optimized summary and an AI-optimized technical explanation.

Sam: What's the actual mechanism?

Alex: The prompt uses sub-agents. It has one agent explore your git history and understand what changed, another agent research documentation best practices for dual-audience communication, and a third analyze your codebase architecture. Those three agents synthesize their findings, and then the main agent drafts both descriptions.

Sam: Why sub-agents instead of one agent doing everything?

Alex: Context preservation. If one agent explores your entire git history, diffs 20 or 30 files, researches documentation patterns, and reads your codebase, that's 40,000+ tokens before you even start drafting. The sub-agents return only synthesized findings—this is what I learned about architecture, this is what I found in git, this is current best practice. Keeps the main agent's context clean for the actual drafting work.

Sam: That's where the U-shaped attention curve from Lesson 5 becomes relevant. All that exploration happens at the beginning of the context window, and then the actual work happens in the middle.

Alex: Exactly. By using sub-agents, you're moving the exploration out of the main context entirely. The synthesis arrives fresh.

Sam: So what does a dual-optimized PR description actually look like?

Alex: The human version is 1-3 paragraphs. It leads with value—what business problem this solves, why it matters. It mentions key files and any breaking changes prominently. It's scannable.

Sam: And the AI version?

Alex: Comprehensive. Explicit terminology used in your codebase. Sections for what was done, breaking changes, architectural decisions, files modified with their responsibilities. No vague pronouns. Everything the AI agent needs to understand the context without guessing.

Sam: Where would you actually use this? Like, how does it fit into workflow?

Alex: The human version goes in your GitHub PR description. The AI version goes in a separate markdown file committed to the repo—maybe PR_REVIEW_CONTEXT.md. Your commit message references both: see the PR description for summary, see the context file for detailed technical explanation. Now when CodeRabbit or Copilot or whatever AI review tool your team uses runs, it has both the changes and explicit technical grounding.

Sam: So you're not relying on the AI tool to infer architecture from the code alone.

Alex: Right. Code review tools work better with explicit context. And as more teams adopt AI-assisted review, this becomes important. You're optimizing for the actual review process your team uses.

Sam: Let me connect back to the beginning. Code review catches what tests miss. Fresh context prevents confirmation bias. You iterate until green or diminishing returns. And for teams doing AI-assisted code review, you optimize PR descriptions for both humans and AI.

Alex: That's the workflow. But here's the meta-level: this is the Validate phase from Lesson 3 applied to a specific problem. Research the context, plan your review strategy, execute the review, validate the findings. The same methodology, different domain.

Sam: So if someone wanted to adapt this for security audits or performance analysis, the pattern is the same.

Alex: Exactly. Establish clear criteria, require evidence, ground in actual code, iterate until you hit green or diminishing returns, and stop before obsessing over marginal improvements. The review template changes, but the methodology is transferable.

Sam: And for teams actually doing this, you'd probably codify it. Like put it in a .claude.md file so agents automatically trigger systematic reviews after implementation.

Alex: Right. Make it standard practice, not an afterthought. Once review is part of your documented workflow, agents treat it as a required step, not optional.

Sam: That feels like the difference between having a code review process and actually using it. Most teams have the policy but skip it under deadline pressure.

Alex: Exactly. When it's codified and agents enforce it automatically, it becomes less negotiable. And you're catching genuine bugs, not wasting time on theater.

Sam: Thanks for walking through this. The practical workflow is clear—review in fresh context, iterate until green or diminishing returns, optimize for both human and AI audiences when you're doing AI-assisted review.

Alex: That's it. Validate systematically, trust your tests as the objective arbiter, and ship when the code is correct and review quality drops to nitpicking.
