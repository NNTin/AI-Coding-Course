---
source: methodology/lesson-4-prompting-101.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-07T13:47:38.432Z
model: claude-haiku-4.5
tokenCount: 2545
---

Alex: Let's talk about something fundamental that changes how you work with AI. Most people treat AI models like conversational partners—you ask a question, you get an answer. But that's not really what's happening under the hood.

Sam: What do you mean? They're not answering questions?

Alex: Not in the way you're probably thinking. These models are pattern completion engines. Think of your prompt as the beginning of a pattern. The model's job is to predict what comes next based on statistical patterns from training data. Your prompt isn't a request—it's a starting point the model completes.

Sam: So when I write "Write a TypeScript function," I'm not asking for code, I'm starting a code block pattern?

Alex: Exactly. And the more precisely you draw that beginning, the more constrained the completion becomes. You're setting up conditions for what can follow. The vague prompt "Write a TypeScript function that validates emails"—that's like sketching the first line of a pattern. The model has to guess language, which validation standard, edge cases, everything.

Sam: But a specific prompt would lock all that down.

Alex: Right. Something like: "Write a TypeScript function that validates email addresses per RFC 5322. Handle these edge cases: reject multiple @ symbols, reject missing domains, accept plus addressing. Return an object with a valid boolean and optional reason field." Now the model has a precise pattern to complete. The language is set, the validation standard is clear, the edge cases are defined, the return type is explicit.

Sam: That makes sense. So the first rule is just be specific.

Alex: It's more than that. First, skip the pleasantries. "Please write a function"—the "please" is just a token that doesn't add clarity. It's noise. AI doesn't need social courtesy. Every token costs you. Use direct, imperative language. "Write" not "could you please write." "Debug the null pointer exception in UserService.ts:47" not "maybe look at the bug somewhere in the service code?"

Sam: Direct action verbs.

Alex: Exactly. And action verbs establish a pattern. Look at the difference: "Fix the bug" is weak. "Debug the null pointer exception in UserService.ts:47" is strong. The second one tells the model where the problem is, what kind of problem it is, and what file to look at. You're not asking the model to hunt—you're giving it coordinates.

Sam: So specificity extends to everything—the action, the context, the constraints.

Alex: Yes. And here's where this gets interesting with constraints. Without constraints, the model fills gaps with assumptions. Say you prompt: "Add authentication middleware." The model might ask itself: JWT or OAuth? Session tokens? Which endpoints? How should it store tokens? Without boundaries, it guesses. But if you specify: "Do NOT modify existing session middleware. Use jsonwebtoken library. Validate against environment variable JWT_SECRET. Return 401 on token missing or invalid"—now there's no guessing. The completion space is defined.

Sam: It's like setting up a scaffolding for the model to build within.

Alex: Exactly. Now, there's another technique that's useful when you need the model to think about domain-specific problems differently. Personas. People often think personas add knowledge, but that's not quite right. Personas work by biasing vocabulary distribution.

Sam: Biasing vocabulary?

Alex: When you write "You are a security engineer analyzing this code," you're not making the model smarter about security. You're increasing the probability that security-specific vocabulary appears in the response. Terms like "threat model," "attack surface," "least privilege." These terms act as semantic queries during the attention mechanism. They retrieve different patterns from training data than generic terms like "check for issues."

Sam: So "You are a security engineer" versus just asking for a code review—the first one shifts which vocabulary gets pulled from training.

Alex: Right. A generic prompt might say "Check for proper validation and error handling." A security-focused prompt would identify specific vulnerabilities, discuss attack surface, mention least privilege principles. The persona is a vocabulary shortcut. Instead of listing every security term explicitly, you trigger the cluster. Use personas when domain terminology matters—security, performance, accessibility. Skip it when the task is straightforward; the persona just wastes tokens.

Sam: And this principle applies more broadly than prompts?

Alex: Exactly. When you're querying a codebase search tool or asking a research agent, "Authentication middleware patterns" retrieves different results than "login code." "Rate limiting algorithms" finds different research than "slow down requests." Vocabulary is your control interface for semantic retrieval. Choose terms that retrieve what you need.

Sam: So we've covered being specific, being direct, using strong verbs, constraining assumptions, and using vocabulary to bias retrieval. What about more complex tasks?

Alex: That's where Chain-of-Thought comes in. When a task requires multiple steps, you often need explicit control over the execution path. CoT means you define each step the model must follow—like giving turn-by-turn directions instead of just the destination. You control the route, and errors surface early rather than compounding.

Sam: Is this necessary for everything?

Alex: No. Simple tasks work fine without it. Write a function, debug a specific issue—those are straightforward. But multi-step operations where you need methodical execution? Definitely. Like a QA workflow: read the failing test, identify what's being asserted, compare expected versus actual values, diagnose the root cause. Each step validates before you move to the next. If you just say "debug the test," you lose visibility into how the model approached it. With explicit steps, you see exactly what happened, and if something went wrong, you know where.

Sam: So CoT is less about getting better answers and more about getting control and transparency.

Alex: It's about both, actually. Control and transparency lead to better answers because the model can't skip steps or take shortcuts. Complex operations require that methodical execution. But the real power is you're not relying on the model to figure out the right approach—you're dictating it.

Sam: Okay, so we have specificity, clarity, personas for vocabulary, CoT for control. Anything else?

Alex: Structure. How you organize information matters. Markdown, JSON, XML—these are information-dense formats that are well-represented in training data. A well-structured prompt helps the model parse intent and respond with matching structure. Instead of burying requirements in prose, use headings and lists. Make requirements scannable. Something like:

"Build a user authentication service. What to build: login endpoint, refresh token flow, password reset. How to build it: use bcrypt for password hashing, store tokens in Redis, implement rate limiting on login attempts. How to test it: write unit tests for each endpoint, integration tests for the full flow. What to avoid: don't store passwords in plain text, don't log sensitive data, don't use hardcoded secrets."

The structure makes each section distinct. Requirements jump out at you and at the model.

Sam: That seems cleaner than paragraphs. What about failure modes—things that commonly break?

Alex: Two main ones. First, negation. LLMs struggle with "don't" because attention mechanisms treat NOT as just another token competing for weight. The model focuses on the concepts mentioned—"passwords," "plain text"—and might miss the negation entirely. It's called affirmation bias. The model leans toward positive selection, not negative exclusion.

Sam: So saying "don't store passwords in plain text" is risky because the model might focus on "store passwords" and "plain text" and miss the don't.

Alex: Exactly. The fix is explicit negation followed by the positive opposite. "Do NOT store passwords in plain text. Instead, always hash passwords using bcrypt with a salt round of 12." Now you've stated the constraint clearly and provided the correct pattern immediately. The positive opposite acts as the logical NOT in pattern form.

Sam: And the second failure mode?

Alex: Math. LLMs are probabilistic text predictors. They're terrible at arithmetic. Don't ask them to calculate 47 times 89 or figure out memory allocations. They'll generate plausible-sounding numbers that are completely wrong. If you need math, have the model write code that does the calculation. Let the runtime execute it correctly instead of relying on the model's statistical guesses.

Sam: That's a good distinction. The model is good at generating code that does math, just not at doing math itself.

Alex: Right. Write a program, not an answer. Let me bring this together. Prompting is precision engineering. You're initializing a pattern completion engine, not having a conversation. Be specific about what you want, be direct with action verbs, constrain assumptions, use vocabulary strategically, structure information clearly, and use CoT for complex tasks. Avoid negation—state positives instead—and don't rely on arithmetic. You're not asking nicely; you're drawing the pattern you want completed.

Sam: So the mindset shift is thinking about what pattern you're starting, not what question you're asking.

Alex: Exactly. That frame changes everything about how you write prompts. Instead of "Can you help me debug this?" it's "Here's the failing test, here's the assertion, here's what's expected versus actual—diagnose the root cause." You're not asking for help; you're starting a pattern. The model completes it.

Sam: Makes sense. I think I see how this compounds with the other techniques we've covered—specificity makes the pattern tighter, CoT defines the steps, structure makes it parseable.

Alex: And vocabulary makes it semantic. They all work together. You're not just throwing prompts at a wall; you're engineering the conditions for the model to produce exactly what you need. That's where real productivity comes from.
