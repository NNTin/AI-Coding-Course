---
source: methodology/lesson-4-prompting-101.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-06T12:37:44.802Z
model: claude-haiku-4.5
tokenCount: 2120
---

Alex: Let's talk about prompting, and I want to start with something that fundamentally changes how people think about this. AI coding assistants aren't conversational partners. They're pattern completion engines. You're not making a request—you're drawing the beginning of a pattern the model will finish.

Sam: That's a different mental model than how most people interact with AI. So when I write a prompt, I'm essentially seeding the pattern I want the model to complete?

Alex: Exactly. Think about it this way: you write "Write a TypeScript function that validates", and you've already drawn the beginning of a code block pattern. The model's job is predicting what naturally follows based on everything it's seen in its training data. The more specific your pattern start, the more constrained the completion space.

Sam: So the precision of how I frame things matters a lot more than I probably think.

Alex: Massively. Let's start with something simple: skip pleasantries. "Please" and "thank you"—these tokens dilute your signal without adding any clarity. The model doesn't need politeness. What it needs is clarity about the pattern you're establishing.

Sam: Right. That's actually jarring to think about because we're trained to be polite. But from the model's perspective, those tokens are just noise competing for attention that could go toward the actual intent.

Alex: Exactly. Now, let's talk about action verbs. The difference between "make a function" and "write a function" might sound minor, but it establishes different patterns. When you're specific—"debug the null pointer exception in UserService.ts:47"—versus vague—"fix the bug"—you're defining how constrained the completion space is.

Sam: I can see how that would affect what the model generates. A specific location and error type narrows things down significantly compared to just "fix the bug."

Alex: Consider a refactoring task. Instead of "improve performance," you write: "optimize the database query to use indexed columns, remove the N+1 join in the user retrieval loop, and reduce the result set size below 1000 rows." You've defined the refactoring pattern completely. No guessing required.

Sam: That's interesting because you're really constraining what "solution" means. There's only one reasonable way to solve that.

Alex: Exactly. And constraints are critical. Without them, the model fills gaps with assumptions. If you say "add authentication," the model doesn't know if you mean JWT, OAuth, session tokens, or something else. It has to guess. If you say "add JWT-based authentication to the /api/users endpoint with refresh token rotation and 15-minute expiry," now the pattern is unambiguous.

Sam: So specificity isn't just nice to have—it's actually how you control what the model does.

Alex: It is. And this principle extends to something most people get wrong: personas. A lot of people think assigning a persona adds knowledge. "You are a security engineer" doesn't make the model smarter about security. What it does is bias the vocabulary distribution. When you write that persona, you increase the probability of security-specific terms like "threat model," "attack surface," "least privilege" appearing in the response.

Sam: So it's a vocabulary steering technique.

Alex: That's exactly right. Those terms act as semantic queries during attention. They retrieve different training patterns than generic terms like "check for issues." The persona is a shortcut—instead of listing every security term explicitly, you trigger the entire cluster associated with "security engineer."

Sam: That's clever. So you're not adding knowledge, you're retrieving knowledge more precisely.

Alex: Precisely. And that principle is universal. This is how you query codebase search tools, web research agents, vector databases. "Authentication middleware patterns" retrieves different code chunks than "login code." "Rate limiting algorithms" finds different research than "slow down requests." Vocabulary is your control interface for semantic retrieval.

Sam: So personas are valuable, but only when domain-specific vocabulary matters and you need consistent terminology. If the task is straightforward, it wastes tokens.

Alex: Right. Use them when they genuinely improve grounding. Skip them when the task is simple enough that adding persona context is just overhead.

Sam: Let's move to something else. I notice you mention "Chain-of-Thought" in the material. What's the actual value there?

Alex: Chain-of-Thought gives you explicit control over the execution path for complex tasks. When you have something that requires multiple steps, you can't just point at the destination. You need to dictate the route.

Sam: So it's not about reasoning. It's about control.

Alex: Exactly. You're not asking the model to think through something. You're defining the sequence of steps it must execute. Each step must complete before the next begins. This is particularly powerful for QA workflows where you need methodical execution—you validate at each stage, errors surface early, and the execution path is transparent.

Sam: How many steps triggers the need for CoT? Is there a threshold?

Alex: Generally, if you're looking at five or more steps, CoT becomes essential for accuracy. Simple tasks can work without it. Multi-step operations—especially when you need validation at each stage or the output of one step feeds into the next—that's where explicit guidance prevents errors from compounding.

Sam: That makes sense. One failure early with no CoT could cascade.

Alex: Exactly. Now, let's talk about structure. How you organize information in your prompt directs the model's attention. Markdown is particularly effective because it's information-dense. Headings, lists, code blocks—they provide clear semantic structure with minimal token overhead.

Sam: So well-structured prompts help the model parse intent better.

Alex: Yes. And it helps you think through requirements. When you're writing requirements in a structured format—what to build, how to build it, how to test it, what to avoid—you're forcing clarity on yourself. The model benefits from that clarity.

Sam: What about some of the pitfalls? Things that commonly go wrong?

Alex: There are two major failure modes worth understanding. First: negation. LLMs struggle with negation because attention mechanisms treat "NOT" as just another token competing for weight. If "NOT" gets low attention, the model focuses on the concepts mentioned—"passwords," "plain text"—while ignoring the negation. It's called affirmation bias. The model's token generation fundamentally leans toward positive selection.

Sam: So telling the model "don't store passwords in plain text" might miss the negation and generate plain text storage anyway.

Alex: Right. The pattern to use instead is: explicit negation, then positive opposite. "Do NOT store passwords in plain text. Instead, always store passwords as hashed values using bcrypt with a salt round of 12." You're giving negation explicitly, then providing the correct pattern in positive form.

Sam: The positive opposite removes ambiguity about what you actually want.

Alex: Exactly. Second pitfall: LLMs can't do math. They're probabilistic text predictors, not calculators. If you ask them to compute something, they'll generate plausible-sounding numbers that might be completely wrong. Don't do that.

Sam: So if I need arithmetic, have the model write code that does the math instead of computing it directly.

Alex: That's the move. The model is excellent at writing code. The code is excellent at calculating. You're playing to each system's strengths.

Sam: That's a nice way to think about it. So pulling this together—what's the core principle here?

Alex: Prompting is precision engineering. You're not having a conversation. You're initializing a pattern completion engine. That means being specific about what pattern you're establishing, constraining the completion space through explicit details, using structure to organize information, and choosing vocabulary that retrieves the right training patterns. When you get that right, the model completes the pattern exactly as you intended.

Sam: And the flip side is that vague prompts create massive completion spaces where the model has to guess.

Alex: Exactly. It's the difference between drawing a clear blueprint and showing a rough sketch. One has one reasonable completion. The other has thousands.
