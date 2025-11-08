---
source: practical-techniques/lesson-9-reviewing-code.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T09:39:43.040Z
model: claude-haiku-4.5
tokenCount: 2485
---

Alex: Welcome to Lesson 9: Reviewing Code. At this point in the workflow—you've got tests passing, the agent executed your plan—there's one final gate before shipping. The question is: is the code actually correct?

Sam: I assume you don't just mean "does it compile." You're talking about logic bugs, architectural mismatches, all the stuff that passes tests but is still wrong.

Alex: Exactly. This is the Validate phase from Lesson 3's four-phase workflow. Code review is that quality gate, and here's the critical insight: you need to review in a fresh context, separate from where the code was written.

Sam: What do you mean by fresh context?

Alex: If an agent reviews its own work in the same conversation, it defends its decisions. It has attachment to the choices it made earlier. A fresh context means starting a new conversation with just the code and a review prompt, no history of why the agent built it that way. The agent in fresh context analyzes objectively.

Sam: So you're leveraging the stateless nature of agents from earlier lessons.

Alex: Precisely. The agent doesn't know this is a review. It just sees code and a structured prompt asking specific questions. Let me walk you through the template.

The review prompt integrates techniques from Lesson 4: Prompting 101. Understanding why each element exists lets you adapt this for other review tasks—security audits, performance analysis, architectural review. The template is a shell script with structured prompting: you provide the code to review, specify what to look for, and require chain-of-thought reasoning with file paths and line numbers.

Sam: File paths and line numbers—that's the evidence requirement from Lesson 7, isn't it?

Alex: Right. When the agent says "there's a bug here," it has to point to the exact location. That prevents hallucinations. The agent can't just claim there's a problem without grounding it in the actual code.

Sam: What does the template structure look like?

Alex: You're building a prompt that does several things in sequence: first, explain the context—what's this code supposed to do, what were the original requirements; second, define the review scope—what aspects matter most, what's out of scope; third, provide the code itself; fourth, ask specific review questions using chain-of-thought—think step by step, show your reasoning, cite line numbers. The template is about twenty lines, structured as shell commands that feed the code and prompt into Claude, capture the review, and log it for your records.

Sam: So after the first review, what happens if it finds issues?

Alex: You fix them. Then you re-run tests from Lesson 8 to catch regressions. After tests pass again, you do a fresh review in a new conversation. This is the iterative cycle: review, fix, test, review again.

Sam: And you keep looping until what?

Alex: Until you reach either a green light—no substantive issues, tests pass—or diminishing returns. Diminishing returns show up as three patterns. First, nitpicking: the agent's complaining about variable names or trivial style preferences. Second, hallucinations: the agent invents issues that don't actually exist or suggests patterns that don't fit your architecture. Third, review-induced test failures: the agent's "fix" broke code that was working.

Sam: That third one's interesting. The agent breaks something, tests catch it, and you reject the suggestion?

Alex: Exactly. Your tests are the objective arbiter. If the review suggests a change and tests fail, the review was probably wrong. Trust the tests. At that point you stop iterating. Further AI review costs more than it provides and risks degrading quality.

Sam: Is there a point where review is just not worth it anymore?

Alex: When diminishing returns hit, yes. That's typically after three or four iterations dealing with minor remaining issues. The cost-benefit flips. You ship with high confidence that critical issues are caught and fixed.

Now, there's a second pattern in this lesson: Pull Requests for both human and AI reviewers.

Sam: Those are different audiences with different needs.

Alex: Fundamentally different. Human reviewers scan quickly, infer meaning from context, and value concise summaries—one to three paragraphs max. They want the "why" and business value. AI review assistants parse content chunk by chunk, struggle with vague pronouns, and need explicit structure. They require detailed technical context: specific file changes, architectural patterns, breaking changes enumerated clearly.

Sam: So a traditional PR description optimizes for one or the other?

Alex: Right. Too verbose for humans, too vague for AI agents. The solution is to generate both outputs in a coordinated workflow using sub-agents. There's an advanced prompt pattern for this that demonstrates multiple techniques from Lessons 4, 5, and 7.

Sam: What does the pattern do?

Alex: It generates two descriptions simultaneously: one optimized for human reviewers, one for AI assistants. The human version is scannable—lead with value, mention key files, highlight breaking changes prominently, keep it to three paragraphs. The AI version is comprehensive—explicit terminology, structured sections, specific file paths, no vague pronouns.

Sam: And sub-agents play a role here?

Alex: They do. The instruction spawns a separate agent to explore git history and understand the changes, preventing the main conversation's context from filling with commit diffs. Without this, exploring twenty to thirty changed files consumes forty-plus thousand tokens, pushing critical context into the attention curve's ignored middle.

Sam: That's the U-shaped attention curve from Lesson 5.

Alex: Exactly. The sub-agent returns only synthesized findings. This sub-agent capability is actually unique to Claude Code CLI—we're in early 2025, and other tools like Cursor, Windsurf, GitHub Copilot, and Cody require splitting this into multiple sequential prompts. You explore first, then draft based on findings.

Sam: So the sub-agent saves context and prevents you from losing critical information?

Alex: Precisely. It's grounding through sub-task isolation. You're also using ArguSeek to research PR best practices while ChunkHound grounds descriptions in your actual codebase architecture and coding style.

The template itself is about nineteen lines of shell commands with nine specific requirements. It enforces that the agent must research the git history, learn your architecture, explore the actual code changes, and then generate both outputs. The agent cannot draft accurate descriptions without reading actual commits and code.

Sam: When would you actually use this pattern?

Alex: When you have a feature branch with multiple commits ready for review and your team uses AI-assisted code review tools—GitHub Copilot, CodeRabbit, Qodo Merge, and others alongside human reviewers. You replace the placeholders with your actual project name and a brief description of the intended changes, run the prompt in Claude Code CLI, and you get both outputs.

Sam: And then what?

Alex: Validate the outputs. The human description should be scannable and concise—one to three paragraphs communicating the why and business value. The AI description should be comprehensive and unambiguous: explicit terminology, structured sections, specific file paths, no vague pronouns.

Then integrate them: the human version goes into your GitHub PR description, the AI version goes into a separate markdown file committed to the repo—something like PR_REVIEW_CONTEXT.md. Your commit message references both: "See PR description for summary, PR_REVIEW_CONTEXT.md for detailed technical context."

Sam: That way both audiences get what they need.

Alex: Right. The workflow becomes systematic. You codify this process in your project's .claude.md or AGENTS.md file—Lesson 6—so agents automatically trigger systematic reviews after completing implementation tasks. It's not an afterthought; it's a standard practice.

Sam: And the template there specifies to open a fresh context, use the review template from this lesson?

Alex: Exactly. A new conversation, no prior history, just the code and the structured review prompt. That ensures objective analysis.

So stepping back, the key insight across this lesson is that review is a quality gate, but it needs structure. The template from Lesson 4 applies to review just like it applies to any prompting task: persona, chain-of-thought, specific structure, grounding, constraints. And fresh context prevents confirmation bias.

Sam: And then iterate: review, fix, test, review again.

Alex: Until you're either confident the code is solid or you're hitting diminishing returns. Tests are your arbiter. If a review suggestion breaks a test, reject it. Your tests caught what the review missed.

Sam: One more question—is review itself probabilistic?

Alex: It is. The agent can be wrong. It might suggest fixes that break working code or hallucinate issues that don't exist. Operator judgment is essential. Review plus tests passing is high confidence. Review plus tests failing means reject the suggestion. That's where the art comes in.

Sam: So you're not blindly trusting the AI to review code?

Alex: No. The AI is a tool in the workflow. Tests are your objective arbiter. Review finds things tests miss—architectural mismatches, edge cases, logic that's subtly wrong but passes your test suite. But the agent can be wrong about fixes. Your judgment, backed by tests, is what decides.

Alex: This workflow—implement, test, review in fresh context, iterate until confident or diminishing returns, then ship—that's the practical pattern. It catches the probabilistic errors that agents inevitably introduce. And it's repeatable, codifiable, part of your standard development process.

Sam: Understood. And the next lesson covers debugging when things go wrong.

Alex: Exactly. That's Lesson 10.
