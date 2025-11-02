---
source: methodology/lesson-4-prompting-101.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:10:06.093Z
model: claude-haiku-4.5
tokenCount: 2654
---

Alex: Let's talk about something that fundamentally changes how most engineers approach AI coding assistants. The moment you understand that these models aren't conversational partners—they're pattern completion engines—everything shifts.

Sam: That's an interesting framing. When you say pattern completion, what exactly are you mean? I think most people treat these tools like they'd treat a colleague in Slack.

Alex: Right, and that's the core misconception. When you write a prompt, you're not making a request. You're drawing the beginning of a pattern and the model's job is to predict statistically what comes next based on patterns in its training data. Think of it like... you write the opening bars of a melody, and the model completes the song based on thousands of melodies it's seen before.

Sam: So if I'm writing a TypeScript function, the code structure itself becomes part of the pattern?

Alex: Exactly. The signature, the parameter types, the comment style—all of that trains the model about what kind of completion you want. That's why being precise about that pattern start matters so much. Every token shapes what the model predicts next.

Sam: That makes sense. But I'm curious—does that mean I should be more formal in my prompts? More verbose?

Alex: Actually, the opposite. Skip pleasantries entirely. "Please write a function" versus "Write a function"—the word "please" is noise. It doesn't add clarity, it just wastes tokens that could be devoted to signal. The model doesn't care about politeness. It cares about parsing your intent from the tokens you provide.

Sam: That feels almost rude, honestly. But I get the logic—tokens are finite and attention is limited.

Alex: You're thinking about this right. That's where action verbs come in. Instead of "make a function," you say "write a function." Instead of "fix the bug," you say "debug the null pointer exception in UserService.ts at line 47." The stronger the verb, the more constrained the completion space becomes. You're essentially narrowing what the model can plausibly generate.

Sam: I can see how that compounds. If I say "fix the bug" without context, the model has to guess what bug, where, why. But "debug the null pointer exception in UserService.ts:47" draws a very specific pattern.

Alex: And this is where constraints become your best friend. Without them, the model fills gaps with assumptions. Say you want authentication added to an endpoint. If you just say "add authentication," the model might use JWT, might use OAuth, might use session tokens—each is plausible, none is what you probably need.

Sam: So the prompt becomes almost a formal specification?

Alex: In a way, yes. You're defining the constraints explicitly. "Add JWT-based authentication to the /user endpoint. Extract the token from the Authorization header. Verify against the secret key stored in environment variables. Return a 401 if the token is invalid or missing." Now the completion space is bounded. The model knows exactly what pattern to fill in.

Sam: I'm thinking about something though. When I work with junior engineers, sometimes I explain things in different ways depending on who I'm talking to. Are you saying personas work the same way here?

Alex: Exactly. A persona is a vocabulary shortcut. If you write "You are a security engineer," you're increasing the probability that security-specific terms appear in the response. Words like "threat model," "attack surface," "least privilege." Those terms act as semantic queries during the model's attention mechanism. They retrieve different training patterns than generic terms like "check for issues."

Sam: So the persona doesn't actually make the model smarter about security?

Alex: No, it doesn't add knowledge. It changes which knowledge gets retrieved. The model has security patterns in its training data. The persona just makes certain patterns more likely to surface. But here's the key: you only use personas when domain-specific vocabulary actually matters. If the task is straightforward and adding a persona just wastes tokens, skip it.

Sam: That's the minimalism I like. So personas aren't a magic bullet—they're a tool when they solve a specific problem.

Alex: Precisely. Speaking of control and precision, there's another concept that matters for complex tasks: Chain-of-Thought. This is where you explicitly define each step the model must follow, like giving turn-by-turn directions instead of just the destination.

Sam: What kind of complex tasks are we talking about?

Alex: Anything with multiple steps—especially quality assurance workflows. Say you're debugging something. Without Chain-of-Thought, you might ask the model to "fix this code." It takes shortcuts, makes assumptions, or misses validation steps. With Chain-of-Thought, you dictate the exact path: First, parse the error. Second, identify the root cause. Third, propose the fix. Fourth, explain why this fix works. Fifth, suggest how to prevent this in the future.

Sam: So you're removing the model's ability to take shortcuts?

Alex: You're controlling the route. And more importantly, you're making errors surface at each stage. If the root cause analysis is wrong in step two, you see it before you get to the fix. Errors don't compound through five steps because each step can be validated independently.

Sam: When would I not use Chain-of-Thought? Seems like always defining the path would be safer.

Alex: For simple tasks, it's overhead. If you're generating a basic function or writing a comment, Chain-of-Thought adds friction without benefit. But for multi-step operations—anything five steps or more—especially where accuracy matters, it becomes essential. QA workflows particularly benefit because they're inherently sequential.

Sam: Okay, so now I've got a prompt that's precise, constrained, maybe structured with steps. What about how I actually format it?

Alex: Structure matters because it directs the model's attention. Markdown, JSON, XML—these are information-dense formats. A markdown heading conveys "this is a section" with minimal tokens. A bulleted list is scannable. Code blocks are semantically distinct from prose. Compare two approaches: one that's just prose paragraphs, another that uses headings, lists, and sections. The structured version helps the model parse intent.

Sam: Does it also help the model generate structured output?

Alex: Yes. If you provide a JSON structure as an example, the model learns to match that structure. If you format requirements as a markdown list, the model's response will likely match that organization. Format shapes output.

Sam: What about things I should avoid? I'm assuming there are failure modes that are predictable?

Alex: Definitely. The big one is negation. LLMs struggle with "don't" or "avoid" because of how attention mechanisms work. When you write "do NOT store passwords in plain text," the model might focus attention on "passwords" and "plain text" while underweighting the negation. It's called affirmation bias—the model leans toward positive selection.

Sam: So saying "don't do X" might cause it to do X anyway?

Alex: It's a risk. The safer pattern is: state the negation clearly, then provide the positive opposite. "Do NOT store passwords in plain text. Instead, always hash passwords using bcrypt with a minimum of 12 salt rounds." The positive opposite gives the model the actual pattern to complete.

Sam: That's interesting. It's turning a negative constraint into a positive pattern.

Alex: Exactly. You're shifting from "what not to do" to "what to do instead." The model naturally completes positive patterns better. And while we're on failure modes—don't rely on LLMs for arithmetic. They're probabilistic text predictors, not calculators. If you need to calculate something, have the model write code that does the math. Never ask the model to compute numbers directly.

Sam: So if I needed to calculate memory requirements for a cache, I'd ask it to write a function that calculates it, not to give me the number?

Alex: Exactly. The code is accurate, the raw arithmetic isn't. The model generates plausible-sounding numbers that might be completely wrong. Code is testable and executable.

Sam: So to synthesize this—I'm thinking about prompts as patterns, being specific about what I want, avoiding ambiguity, using structure, and steering around known failure modes.

Alex: That's it. And the underlying principle is this: effective prompting is precision engineering. You're initializing a pattern completion engine, not having a conversation. Every token counts. Constraints focus the model's attention. Structure makes intent clear. Personas bias vocabulary toward domain-specific patterns. Chain-of-Thought controls execution for complex tasks.

Sam: The thing I appreciate about this framing is it removes the mystery. It's not magic—it's statistical pattern matching that you can predict and control.

Alex: That's exactly right. Once you understand the mechanism, you can be intentional about every aspect of how you prompt. You're not guessing, you're designing.

Sam: I'm curious how this connects to working with codebases. When you're asking an AI to understand existing code and make changes, does this same logic apply?

Alex: Completely. In fact, Lesson 5 covers grounding—how to anchor prompts in actual code, tests, and documentation. The same principle applies: be specific about what file, what line number, what context. Don't make the model guess. But that's a conversation for the next lesson.

Sam: Fair enough. So the key takeaway here is that prompting is a skill—a learnable, predictable skill. It's not about sounding natural, it's about being precise.

Alex: Exactly. And precision compounds. A precise prompt produces precise output. Precise output reduces iteration. Fewer iterations means faster work. That's the leverage point for using these tools effectively at scale.

Sam: Before we wrap, is there a difference in how you prompt for different types of tasks? Code versus documentation versus design discussion?

Alex: The principles are the same, but the patterns you're drawing are different. Code prompts need concrete syntax patterns. Documentation prompts need structural clarity. Design discussion prompts benefit from constraint definition. But in all cases: be specific, eliminate ambiguity, structure your input, avoid known failure modes.

Sam: Alright, that clicks. Pattern completion, not conversation. Precision engineering, not requests.

Alex: That's the foundation. Master this, and everything else becomes more effective.
