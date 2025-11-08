---
source: methodology/lesson-4-prompting-101.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-08T08:32:09.277Z
model: claude-haiku-4.5
tokenCount: 3216
---

Alex: Let's start with something fundamental that changes how you think about working with AI. AI coding assistants aren't conversational partners. They're sophisticated pattern completion engines. Understanding that distinction is critical.

Sam: What do you mean by pattern completion? That sounds like we're not really communicating with the model—we're doing something else.

Alex: Exactly. When you write a prompt, you're not making a request. You're drawing the beginning of a pattern. The model's job is to predict what comes next based on statistical patterns from its training data. Think about it like this: when you start typing code, the editor's autocomplete starts predicting the next word, right? The model is doing that at a much larger scale.

Sam: So if I write "Write a TypeScript function that validates emails," I'm not asking a question. I'm starting a code block pattern and the model is just completing it.

Alex: Precisely. You're initializing the pattern completion engine. And here's what changes everything about effective prompting: the more specific you are about the pattern you're starting, the more constrained the completion space becomes. The model has fewer ambiguous choices to make.

Sam: That makes sense. So instead of being conversational about it, I should be direct and specific. Skip the politeness.

Alex: Absolutely. Skip pleasantries entirely. "Please write a function" uses tokens for politeness. So does "thank you" at the end. Those tokens dilute your signal without adding any clarity to the pattern you're trying to establish. The model doesn't care about manners. It cares about understanding the exact pattern you want completed.

Sam: Okay, so direct and minimal. What about the language I use? Does that matter?

Alex: It matters enormously. This is about choosing the right action verbs to establish clear patterns. Compare "Make a function that validates emails" versus "Write a TypeScript function that validates email addresses per RFC 5322 with three edge cases: reject multiple @ symbols, reject missing domains, accept plus addressing. Return an object with a valid boolean and optional reason field."

Sam: Night and day difference. The first one gives the model almost nothing—no language, no standard, no edge cases, no return type.

Alex: Right. And the second one draws the exact pattern you want completed. "Write" is stronger than "Make" because it's the verb developers use when writing code. "TypeScript" establishes the language pattern. "RFC 5322" invokes the validation standard. The three edge cases constrain the completion space. The return type specification means the model can't guess about structure.

Sam: So specificity compounds. Each piece of information narrows what the model will generate.

Alex: Exactly. And this principle applies everywhere. Another example: "Fix the bug" is weak. "Debug the null pointer exception in UserService.ts:47" is strong. "Update the docs" is weak. "Add JSDoc comments to all exported functions in auth.ts" is strong. Strong verbs plus specific context plus file locations create tight patterns the model completes accurately.

Sam: I'm seeing the pattern now. What about when you need to constrain what the model shouldn't do? Like if I want to say "don't modify existing middleware," how do you set that boundary?

Alex: This is where constraints come in. Constraints are guardrails that define the boundaries of the completion space. Without them, the model fills gaps with assumptions. Let me show you the difference. An unconstrained prompt might just say "Add authentication to the API." What authentication? JWT? OAuth? Session tokens? Which endpoints? The model has to guess.

Sam: And that guessing is where things fall apart.

Alex: Correct. Now compare that to a constrained version: "Add JWT authentication to three API endpoints: /users, /posts, /comments. Do NOT modify existing session middleware. Use jsonwebtoken library. Include rate limiting: 100 requests per hour per user. Return 401 Unauthorized for invalid tokens with a descriptive error message. Add unit tests for valid and invalid token scenarios."

Sam: That's completely specific. The model knows exactly what to build, what not to touch, which library, the rate limit number, the response codes, what to test.

Alex: The completion space is well-defined. The model can't make unexpected architectural decisions because you've constrained the boundaries explicitly. This is fundamental to reliable code generation.

Sam: Let me ask about something else. I've heard the term "persona" thrown around a lot. Like "You are a security expert" at the start of a prompt. Does that actually do anything?

Alex: It does, but not the way people think. Personas don't add knowledge. A security persona doesn't give the model new security information it didn't have before. What it does is bias the vocabulary distribution in the response. Writing "You are a security engineer" increases the probability that security-specific terms appear: threat model, attack surface, least privilege, defense in depth. Those terms act as semantic queries during the model's attention mechanism. They retrieve different training patterns than generic terms like "check for issues."

Sam: So it's a vocabulary shortcut. Instead of me listing every security term I care about, I trigger the cluster associated with security engineering.

Alex: Exactly right. This is why personas only matter when domain-specific terminology matters. If you're doing a straightforward task like "format this JSON," a persona wastes tokens without adding value. But if you're analyzing a security vulnerability or optimizing for accessibility, a persona biases toward the right vocabulary and surfaces the right kind of thinking.

Sam: So personas affect which knowledge gets retrieved, not whether knowledge exists. I need to understand that distinction because it changes how I'd think about other tools—like when I'm searching a codebase.

Alex: That's the breakthrough insight. This principle governs everything: vocabulary is the control interface for semantic retrieval. When you query ChunkHound or other codebase search tools, "Authentication middleware patterns" retrieves different code chunks than "login code." When you use ArguSeek for research, "Rate limiting algorithms" finds different articles than "slow down requests." When you instruct sub-agents, vocabulary shifts what patterns they find. Choose terms that retrieve the patterns you need.

Sam: So understanding vocabulary as a control mechanism applies across all these different tools and contexts. That's powerful.

Alex: It is. Now let's talk about complexity. When tasks require multiple steps, you need explicit control over the execution path. That's where Chain-of-Thought comes in. CoT doesn't ask the model for reasoning—it dictates the path the model must follow. You provide turn-by-turn directions instead of just the destination.

Sam: What does that look like in practice?

Alex: Let's say you're debugging a failing test. Without CoT, you might just say "Debug this failing test." The model could skip important steps or miss something. With CoT, you specify each step: First, read the test file. Identify which test is failing. Analyze the test assertion—what's the expected value versus the actual value? Check if the test itself has a bug or if the implementation is wrong. Then determine the fix. Finally, run the test to verify it passes.

Sam: So I'm controlling the sequence the model executes. It can't skip steps or take shortcuts.

Alex: Correct. And there are real benefits. You dictate the sequence so validation happens at each stage—errors surface early rather than compounding. The execution is transparent so you see exactly what happened at each step, making debugging straightforward. And this is particularly essential for complex operations. Simple tasks don't need CoT, but multi-step operations—say five or more steps—require explicit guidance for accuracy. This is especially powerful in QA workflows where you need methodical, reliable execution.

Sam: I'm thinking about the tools we just discussed—personas, CoT, constraints. They all seem like different ways of directing where the model's attention goes.

Alex: That's a perceptive observation. They are. And that connects to something else: structure. Structure organizes information and directs the model's attention. Markdown, JSON, and XML are particularly effective because they're information-dense formats well-represented in training data. The key concept is information density—how much meaning is conveyed per token. Markdown is highly information-dense. Headings, lists, and code blocks provide clear semantic structure with minimal overhead.

Sam: So I could take a list of requirements and structure them as markdown, and that helps the model understand them better than just prose.

Alex: Much better. Consider this: instead of writing "Build an authentication service that supports login, validates tokens, handles errors gracefully, rejects invalid credentials quickly, and works with the existing database," structure it as markdown with sections for what to build, how to build it, how to test it, and what to avoid. The structure makes requirements scannable and draws the model's attention to distinct sections. Each section becomes a clear semantic unit.

Sam: What about failure modes? Are there things I should definitely avoid in prompts?

Alex: Yes. LLMs have predictable failure modes. One big one is negation. Models struggle with negation because attention mechanisms treat "NOT" as just another token competing for weight. When "NOT" receives low attention during processing, the model focuses on the concepts mentioned—like "passwords" and "plain text"—rather than their negation. It's called affirmation bias. The model's token generation fundamentally leans toward positive selection, what to include, rather than negative exclusion, what to avoid.

Sam: So if I write "Do NOT store passwords in plain text," the model might miss the negation and generate plain text password storage anyway because it focused on "passwords" and "plain text."

Alex: Exactly. The safer approach is to combine explicit negation with the positive opposite. "Do NOT store passwords in plain text. Instead, always store passwords as hashed values using bcrypt with a salt round of 12." This works because you state the constraint clearly, then immediately provide the positive pattern the model should follow. Implementation details—bcrypt, salt rounds—reinforce the correct pattern.

Sam: So negation plus positive opposite. What else?

Alex: Math. LLMs are probabilistic text predictors, not calculators. They're terrible at arithmetic. Don't rely on them to do calculations. If you need math, have the model write code that does the math. Don't ask it to calculate token counts or implement numeric algorithms directly. Have it generate code that does the calculation instead. The code executes correctly; the model's text prediction doesn't.

Sam: That's a clear boundary. The model writes the code, doesn't calculate directly.

Alex: Right. Let me synthesize what we've covered. Prompting is pattern completion, not conversation. You're initializing a pattern completion engine by drawing the beginning of the pattern you want completed. Skip pleasantries—they dilute signal. Choose action verbs that establish clear patterns. Use constraints as guardrails to define what the model should and shouldn't do. Use personas to bias toward domain-specific vocabulary when it matters, understanding that they affect retrieval, not capability. Use Chain-of-Thought for multi-step operations where you need explicit control and accuracy, particularly in QA workflows. Structure with markdown, JSON, or XML to direct attention and increase information density. And avoid negation—use explicit positive patterns instead. And don't ask the model to do math—have it write code that does the calculation.

Sam: So effective prompting is precision engineering. It's not about being conversational or polite.

Alex: Exactly. You're initializing a pattern completion engine. Be specific. Be structured. Be explicit. The specificity compounds across every decision you make—from the verbs you choose to the constraints you set to the structure you impose. Each choice narrows the completion space and increases the probability of getting exactly what you want.

Sam: This changes how I think about working with the model fundamentally. It's less like asking for help and more like specifying an exact pattern.

Alex: That's the mindset shift that makes you dangerous with these tools. Once you understand that the model is a pattern completion engine, not a conversational partner, you can design prompts that reliably produce the code you need.
