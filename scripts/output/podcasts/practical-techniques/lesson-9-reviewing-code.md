---
source: practical-techniques/lesson-9-reviewing-code.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T09:53:56.197Z
model: claude-opus-4.5
tokenCount: 2191
---

Alex: We've covered implementation, testing, the whole execution phase. But there's a critical step that separates production-quality code from "it compiles and tests pass." That's the validate phase—code review. And with AI-generated code, this becomes even more important.

Sam: Because agents make probabilistic errors, right? The code might pass tests but still have subtle issues—logic bugs, architectural mismatches, edge cases that aren't quite handled correctly.

Alex: Exactly. And here's the key insight that changes how you approach AI code review: you need to review in a fresh context, completely separate from where the code was written.

Sam: Why does that matter? Can't I just ask the same agent to review what it wrote?

Alex: You can, but you'll get biased results. Remember from our earlier discussions—agents are stateless but within a conversation, they build up context. An agent reviewing its own work in the same conversation will defend its decisions. It has this implicit attachment to the choices it made. Start a fresh context, and you get objective analysis without that baggage.

Sam: That's a subtle but important distinction. The agent isn't remembering between sessions, but within a session it's essentially invested in its prior outputs.

Alex: Right. Now, before we dive into review techniques, there's a critical distinction I want to make about codebases. Are you working in an agent-only codebase or a mixed codebase?

Sam: What's the difference in practice?

Alex: Agent-only codebases are maintained exclusively by AI—minimal human intervention at the code level. You can optimize the coding style slightly toward AI clarity: more explicit type annotations, more verbose documentation, detailed architectural context files. Your review question becomes "will an agent understand this six months from now?"

Sam: And mixed codebases?

Alex: That's most production codebases—humans and AI both work directly with the code. You optimize for human brevity while maintaining AI navigability. But here's what's non-negotiable in mixed codebases: you need a manual review step where you fully read and audit AI-generated code before committing.

Sam: Because without explicit project rules guiding style, agents generate code following patterns from their training data that might not match your team's standards.

Alex: Exactly. You tune your project rules to guide agents toward the writing style humans expect, then verify the output meets those expectations. The engineering standards—DRY, YAGNI, architecture, maintainability—those apply equally to both. It's the style optimization and review process that differs.

Sam: So let's talk about the actual review process. How do you structure an effective review prompt?

Alex: The review template integrates everything from prompting fundamentals. You give it persona—a senior engineer with domain expertise. You use chain of thought to structure the analysis. You ground it with specific constraints: provide file paths and line numbers, categorize findings by severity. The prompt forces evidence-based review rather than statistical guesses.

Sam: And this runs after implementation and testing are complete?

Alex: Right. After implementing, writing tests, making everything pass—this review catches what the iterative development process left behind. It's the final quality gate before committing.

Sam: Is it typically one pass, or do you iterate?

Alex: Code review is rarely one-pass. First review finds issues, you fix them, re-run tests to catch regressions, then review again in a fresh context. Not the same conversation where the agent will defend its prior decisions.

Sam: But the review itself is also an LLM making predictions. It can be wrong too.

Alex: This is where operator judgment becomes essential—the art of the process. Here's my decision matrix: tests passing plus review green equals ship. Tests passing plus review nitpicking equals ship. Tests failing after review "fixes"—the review was probably wrong, reject the suggestion.

Sam: That last one is interesting. The tests become the objective arbiter.

Alex: Exactly. Stop iterating when you reach either a green light—no substantive issues, tests pass—or diminishing returns. And diminishing returns shows up in specific ways: trivial nitpicking like "rename this variable," hallucinations where the agent invents non-existent issues, review-induced test failures where the "fix" broke working code, or excessive cost—four-plus iterations for minor remaining issues.

Sam: At that point you trust the tests and ship.

Alex: Right. Further AI review costs more than it provides and risks degrading quality.

Sam: Let's shift to pull requests. You mentioned they serve two audiences now—human reviewers and AI review assistants.

Alex: And these audiences process information fundamentally differently. Human reviewers scan quickly, infer meaning from context, value concise summaries—one to three paragraphs max. They want to understand the "why" and business value at a glance.

Sam: And AI assistants?

Alex: They parse content chunk by chunk, struggle with vague pronouns and semantic drift, need explicit structure. They require detailed technical context: specific file changes, architectural patterns, breaking changes enumerated clearly.

Sam: So traditional PR descriptions that optimize for one audience fail the other.

Alex: Exactly. Too verbose for humans, too vague for AI agents. The solution is generating both in a coordinated workflow using sub-agents.

Sam: How does that work in practice?

Alex: The prompt spawns a sub-agent for git history exploration. This is critical for context conservation. Without it, exploring twenty to thirty changed files consumes over forty thousand tokens, pushing critical constraints into that U-shaped attention curve's ignored middle.

Sam: The sub-agent returns only synthesized findings, keeping the main orchestrator's context clean.

Alex: Right. And this sub-agent capability is specific to Claude Code CLI. Other tools—Codex, GitHub Copilot—require splitting this into multiple sequential prompts: explore first, then draft based on findings.

Sam: What else does the dual PR prompt use?

Alex: Multi-source grounding—research tools for PR best practices while codebase search grounds descriptions in your actual architecture and coding style. Structured prompting with persona, communication constraints, format boundaries. And evidence requirements that force the agent to explore actual changes before drafting—it cannot generate accurate descriptions without reading commits and code.

Sam: So you get two outputs: a human-optimized description for the PR itself, and an AI-optimized context file.

Alex: Exactly. When you're reviewing a PR with dual descriptions, you read the human version first to understand the "why" and business value, scan for breaking changes and key files. Then you feed the AI-optimized description to your review assistant—it provides the comprehensive technical context needed for accurate analysis.

Sam: There's also a specific technique you mentioned for the review prompt itself—Chain of Draft?

Alex: Chain of Draft is an optimization of Chain of Thought prompting. Instead of generating verbose step-by-step explanations, you instruct the LLM to think through each step but keep the draft concise—five words max per step—then return the final assessment after a separator.

Sam: So you get the reasoning benefits of Chain of Thought with reduced token consumption.

Alex: And faster response times. The prompt reads: "Think step by step, but only keep a minimum draft for each thinking step, with five words at most. Return the assessment at the end of the response after a separator." It's particularly effective for reviews where you want structured analysis without the token overhead.

Sam: Let me summarize the key points. Review in fresh context to prevent confirmation bias. Apply the same four-phase methodology—research the intent, plan the review structure, execute the analysis, validate the decision to ship or fix.

Alex: Use structured review prompts with Chain of Thought or Chain of Draft. Iterate until green light or diminishing returns—fix issues, re-review in fresh context, stop when findings become trivial or hallucinated.

Sam: Evidence requirements force grounding—file paths and line numbers ensure findings are based on actual code.

Alex: And generate dual-optimized PR descriptions for both audiences. When reviewing PRs with dual descriptions, leverage that AI-optimized context—it provides the grounding needed for accurate analysis and reduces hallucinations.

Sam: The tests remain the objective arbiter throughout.

Alex: Always. When in doubt, trust the tests.
