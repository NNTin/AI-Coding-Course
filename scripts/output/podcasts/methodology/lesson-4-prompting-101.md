---
source: methodology/lesson-4-prompting-101.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-12-12T08:16:21.162Z
model: claude-opus-4.5
tokenCount: 2667
---

Alex: Let's talk about prompting, and I want to start by reframing how you think about it entirely. AI coding assistants aren't conversational partners. They're pattern completion engines. That distinction matters.

Sam: Pattern completion. So when I type a prompt, I'm not asking a question—I'm starting a sequence?

Alex: Exactly. You're drawing the beginning of a pattern, and the model predicts what comes next based on statistical patterns from its training data. Your prompt is the start of a sequence it will finish. Once you internalize that, everything about effective prompting clicks into place.

Sam: That explains why vague prompts get vague results. You're giving the model an ambiguous pattern to complete.

Alex: Right. And it also explains why you should skip pleasantries. "Please" and "thank you"—those tokens dilute your signal. The model doesn't need politeness; it needs clear pattern starts.

Sam: So instead of "Could you please write me a function that validates emails," I should just say "Write a function that validates emails."

Alex: Better, but let's make that concrete. An ineffective prompt says "Can you help me write a function that validates emails?" That's two lines with no context. An effective prompt looks completely different: "Write a TypeScript function that validates email addresses per RFC 5322. Handle these edge cases: reject multiple @ symbols, reject missing domains, accept plus addressing. Return an object with a valid boolean and optional reason field."

Sam: Night and day. The second version specifies the language, the standard, three explicit edge cases, and the exact return type structure.

Alex: You're drawing a precise pattern start. TypeScript function signature, validation rules, return type—the model completes this pattern with matching code. The more specific your pattern start, the more constrained the completion space.

Sam: What about function signatures? If I write something like "authMiddleware that validates JWT tokens and attaches user to request," the model knows exactly what shape of code to generate.

Alex: Precisely. You're starting a code block pattern. The model predicts what naturally follows based on similar patterns in training data. Give it "authMiddleware" with JWT validation and user attachment, and it completes with the middleware implementation, token verification, error handling—all matching the pattern you established.

Sam: Let's talk about verb choice. I've noticed some prompts work better than others even when they're asking for the same thing.

Alex: Strong verbs establish clear patterns. Compare "Make a function" versus "Write a function." Or "Fix the bug" versus "Debug the null pointer exception in UserService.ts line 47." The specific version constrains the completion space dramatically.

Sam: "Update the docs" versus "Add JSDoc comments to all exported functions in auth.ts."

Alex: Exactly. And specificity compounds. Here's what a complete refactoring pattern looks like: you define the type as "refactoring," specify the function name, give the location, provide specific context like "Extract the user validation logic from UserController into a standalone validateUser function with full type preservation."

Sam: No guessing required. The model knows exactly what transformation you want.

Alex: Now, without constraints, the model fills gaps with assumptions. If you say "Add authentication to the API"—what authentication? JWT? OAuth? Session tokens? Which endpoints?

Sam: So you need to define boundaries explicitly.

Alex: A constrained version specifies everything: Add JWT authentication to POST and PUT endpoints in the orders API. Verify tokens using the existing authService.verifyToken method. Return 401 for invalid tokens, 403 for insufficient permissions. Do NOT modify existing session middleware. Use the jsonwebtoken library. Six specific requirements that eliminate ambiguity.

Sam: Let's talk about personas. I've seen prompts that start with "You are a security engineer" or "Act as a performance expert." When does that actually help?

Alex: Personas work by biasing vocabulary distribution. When you write "You are a security engineer," you increase the probability of security-specific terms appearing in the response—"threat model," "attack surface," "least privilege." These terms act as semantic queries during attention, retrieving different training patterns than generic terms like "check for issues."

Sam: So the persona is a vocabulary shortcut.

Alex: Exactly. Instead of listing every security term explicitly, you trigger the cluster associated with "security engineer." A generic prompt like "Review this authentication code" gets generic advice—"Check for proper validation and error handling." But "You are a security engineer specializing in authentication systems. Review this code for OWASP Top 10 vulnerabilities, focusing on injection risks, broken authentication, and sensitive data exposure"—that gets targeted security analysis with specific vulnerabilities and mitigation strategies.

Sam: The persona didn't add knowledge; it changed which knowledge gets retrieved.

Alex: This principle applies universally. Vocabulary is the control interface for semantic retrieval. The same concept governs how you query codebase search tools like ChunkHound, web research agents like ArguSeek, vector databases, or instruct sub-agents. "Authentication middleware patterns" retrieves different code chunks than "login code." "Rate limiting algorithms" finds different research than "slow down requests."

Sam: Choose terms that retrieve the patterns you need.

Alex: Use personas when domain-specific terminology matters—security, performance, accessibility—or when you need consistent vocabulary across related tasks. Skip personas when the task is straightforward and adding persona context wastes tokens without adding value.

Sam: What about Chain-of-Thought? I've seen mixed advice on when to use explicit step-by-step instructions.

Alex: CoT provides control over execution paths. When tasks require multiple steps, you often need to dictate the route, not just the destination. Without CoT, you say "Fix the failing test." With CoT, you say: "Step one, read the test file and identify which test is failing. Step two, analyze test assertion—expected versus actual values. Step three, trace execution path to find divergence point. Step four, identify root cause. Step five, propose minimal fix that preserves existing behavior."

Sam: You're dictating the sequence. The model can't skip steps or take shortcuts.

Alex: Right. You get validation at each stage—errors surface early rather than compounding. You get transparent execution—you see exactly what happened at each step. And for complex operations, five or more steps, explicit guidance becomes essential for accuracy.

Sam: Modern models handle simple tasks without CoT, but multi-step operations need the guidance.

Alex: CoT is particularly powerful for QA workflows where you need methodical execution. We'll cover production examples of using tests as guardrails in Lesson 8.

Sam: Let's talk about structure. Markdown, JSON, XML—why do these formats work well in prompts?

Alex: They're information-dense. Different formats have different information density—how much meaning is conveyed per token. Markdown is highly information-dense: headings, lists, and code blocks provide clear semantic structure with minimal overhead. These formats are also well-represented in training data, so the model parses them reliably.

Sam: So a well-structured prompt helps the model parse intent and respond with matching structure.

Alex: Exactly. Use headings for hierarchical organization: "Requirements" section, "Technical Constraints" section, "Testing Requirements" section, "Anti-patterns" section. The structure makes requirements scannable and draws attention to distinct sections—what to build, how to build it, how to test it, what to avoid.

Sam: Now I want to talk about failure modes. What should we avoid when prompting?

Alex: Two big ones: negation and math. LLMs struggle with negation because attention mechanisms treat "NOT" as just another token competing for weight. When "NOT" receives low attention during processing, the model focuses on the concepts mentioned rather than their negation.

Sam: So if I say "Do NOT store passwords in plain text," the model might focus on "passwords" and "plain text" while missing the "NOT."

Alex: That's affirmation bias. The model's token generation fundamentally leans toward positive selection—what to include—rather than negative exclusion. A risky prompt says "Do NOT store passwords in plain text" and "Never log sensitive data." The model might miss the negation and generate exactly what you tried to prevent.

Sam: What's the fix?

Alex: Negation first, then positive opposite immediately after. "Do NOT store passwords in plain text. Instead, always store passwords as hashed values. Use bcrypt with a minimum of 10 salt rounds. Never use MD5 or SHA1 for password hashing." You state the constraint, then provide the logical NOT in positive form, then reinforce with implementation details.

Sam: And math?

Alex: LLMs are probabilistic text predictors, not calculators. They're terrible at arithmetic. Don't say "Calculate the total monthly cost for 150 users at $12 per user with a 15% enterprise discount." The model will generate plausible-sounding numbers that may be completely wrong.

Sam: Have it write code instead.

Alex: Exactly. "Write a Python function that calculates monthly subscription cost. Inputs: user count as integer, price per user as float, discount percentage as float. Return the discounted total." The math happens in the code execution, not in token prediction.

Sam: Let me summarize the key points. Prompting is pattern completion, not conversation. Skip pleasantries—they dilute signal. Personas affect vocabulary distribution, not capability. Chain-of-Thought gives you control over execution paths for complex multi-step tasks. Structure with Markdown, JSON, or XML directs attention efficiently.

Alex: And avoid negation by stating what you want explicitly—negation then positive opposite. Don't rely on LLMs for math; have them write code that does math. Effective prompting is precision engineering. You're not having a conversation—you're initializing a pattern completion engine. Be specific, be structured, be explicit.

Sam: Next up is Lesson 5 on Grounding, where we'll cover semantic search tools and how vocabulary choice affects retrieval.

Alex: That's where the vocabulary principle we discussed today becomes even more powerful.
