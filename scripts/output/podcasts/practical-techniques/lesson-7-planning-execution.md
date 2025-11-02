---
source: practical-techniques/lesson-7-planning-execution.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:12:41.791Z
model: claude-haiku-4.5
tokenCount: 3946
---

Alex: Let's talk about what happens the moment you shift from implementing features yourself to orchestrating AI agents to do the work. It changes everything about how you think about your role.

Sam: How so? You're still building the same features, right?

Alex: You're building the same features, but your job has fundamentally changed from execution to orchestration. And the biggest mistake I see is people jumping straight to "implement this feature" without doing the groundwork first.

Sam: Grounding. That's the thing you mentioned in the outline.

Alex: Exactly. Grounding is loading the agent's context with everything it needs to make good decisions. Think about it this way - an agent has zero memory of your previous conversations. Every task starts from a completely blank context window. So if you ask it to add rate limiting without telling it how your middleware is structured, where your Redis configuration lives, or what your error handling patterns are, it's just going to make probabilistic guesses based on training data.

Sam: And those guesses will be... wrong?

Alex: Not always wrong. Sometimes generic. Usually a mismatch with your architecture. I've seen agents generate middleware that doesn't integrate with the existing error handling, or propose Redis configurations that don't match your setup. It all works, technically. But it doesn't fit.

Sam: So you're saying you need to load the agent with your codebase context before you ask it to code.

Alex: Before, during, and honestly throughout the conversation. There are three types of context that matter. First, codebase context - the patterns, naming conventions, architectural boundaries. Second, technical context - library documentation, API references, framework idioms. Third, business context - the actual requirements, constraints, edge cases.

Sam: That sounds like a lot of work upfront.

Alex: It is. Maybe 10 minutes of work upfront. Versus hours of rework when the agent's output doesn't fit your architecture. And here's the thing - this isn't really different from what you do as a senior engineer when you're inheriting a codebase. You don't jump into implementing a feature. You read the existing code, understand the patterns, understand why decisions were made the way they were.

Sam: Right. So you're applying that same discipline to directing an AI agent.

Alex: Exactly. And when you do it right, the agent operates at a much higher level. Instead of generating generic middleware, it can say "I see you're using Zod for validation in src/validation/, following the pattern in userSchema.ts. I'll match that approach."

Sam: That's the difference between generic code and code that fits.

Alex: That's the difference between work that compounds versus work that creates technical debt. Once you ground an agent, it makes reasonable decisions. It follows your patterns. It respects your constraints.

Sam: Okay, but that's about giving the agent good information. What about the questions you ask it? You mentioned that separately - knowing when to ask clarifying questions versus making informed assumptions.

Alex: Right. So you've grounded the agent with context. Now you're asking it to implement something. There's ambiguity in almost every feature request. The art is knowing what ambiguity to resolve before execution and what to let the agent figure out.

Sam: When do you ask for clarification?

Alex: Ask when the decision has real implications. Ask when there's genuine business logic ambiguity - "should expired premium users retain read access?" - that depends on your product strategy, not technical conventions. Ask when there are security or compliance implications - "can we log PII for debugging?" - because that's not the agent's call to make. Ask when there are multiple valid technical approaches with different trade-offs - "optimize for write throughput or read latency?" - because you're the one living with the consequences.

Sam: And when don't you ask?

Alex: Don't ask when the patterns are already established in your codebase. Don't ask for standard engineering practices like proper error handling or validation. Don't ask questions you can answer by reading documentation. And this is important - don't ask open-ended questions you could answer cheaply by having the agent investigate first.

Sam: So you gather evidence before you ask.

Alex: That's the key move. If you need to ask a clarifying question, include the evidence in that question. "I see we're using JWTs for auth in existing middleware, and I found pagination patterns in three endpoints already, but this new scenario is different because X - which approach do you prefer?" That's a question that gets you a good answer.

Sam: Versus "how should I implement pagination?"

Alex: Versus just... uncertainty. And that uncertainty compounds through the entire task.

Sam: Okay, so you've grounded the agent, you've asked good clarifying questions. Now what? That's where the decomposition comes in, right?

Alex: This is where you start thinking like a shipping engineer again. Most complex features can't be done in one pass. You need to break them down into independent, parallelizable units of work.

Sam: What does parallelizable actually mean in this context?

Alex: It means no data dependencies, no control flow dependencies. If Task B doesn't read data written by Task A, if it doesn't call functions defined in Task A, if it doesn't import modules created by Task A - then it's parallelizable. You can execute them independently, even across different agent instances.

Sam: And the method you use for breaking things down is SPIDR.

Alex: SPIDR is one method. It's good for most scenarios. The idea is you look at a feature and ask yourself - what are the dimensions of complexity here? Because complexity usually lives in several places at once.

Sam: Walk me through it.

Alex: **S is Spike** - you separate exploration from implementation. "Evaluate Stripe versus Braintree for payment processing" is one task. "Implement the chosen payment provider" is a completely separate task that happens after. You do the research upfront, then implementation. That's how you avoid thrashing.

Sam: **P is Path** - different user workflows. "Login with email and password" is one story. "Login with OAuth" is a separate story. "Login with magic link" is its own thing. You're not trying to solve every way to log in at once.

Alex: Right. Each path can be developed, tested, and shipped independently. The second one doesn't unblock the third one.

Sam: **I is Interfaces** - platform variations?

Alex: Or UI complexity. "Support Chrome and Firefox" is different from "add Safari support." "Basic share button that just copies the URL" is different from "rich share modal with social preview cards." You can ship the simple version first, prove the concept, then enhance it.

Sam: **D is Data** - data type variations?

Alex: Start simple, add complexity. "Upload MP4 videos" is task one. "Support WebM and AVI formats" is task two. "Handle employees with one manager" is the initial story. "Support matrix reporting with multiple managers" is a follow-up. You're not trying to handle every edge case in data modeling upfront.

Alex: And **R is Rules** - business logic, incrementally.

Sam: "Upload videos with basic validation" versus "enforce copyright detection" versus "block offensive content in comments."

Alex: Exactly. You deliver the core functionality, then add business rules as separate tasks.

Sam: This feels like it's about shipping velocity, not just parallelization.

Alex: That's the real win. You're shipping a working feature every few days instead of waiting for everything to be perfect in two weeks. And from the agent's perspective, it's working with smaller, more focused scope. Smaller scope means fewer variables, better focus, better quality.

Sam: Let me ask a tactical question. How do you know if something is a true dependency versus a false dependency? Because I imagine the temptation is to say "oh, I need the schema first" or "I need the auth layer first" when maybe you don't.

Alex: That's a great instinct to be skeptical about. The dependency analysis is concrete. Does Task B read data written by Task A? Does it call functions defined in Task A? Does it import modules created by Task A? Does it require Task A's tests to pass first?

Sam: Four questions.

Alex: If all four are "no," the tasks are parallelizable. If any is "yes," there's a true dependency. And what I notice is - a lot of things that feel like dependencies aren't, because people conflate "task B will be easier after task A is done" with "task B requires task A to be done."

Sam: So you could implement the OAuth flow and the email/password flow completely independently.

Alex: You could. They share some common infrastructure maybe - the user model, the session layer. But if you've defined that infrastructure first, then both flows can be built in parallel. The common stuff doesn't block them.

Sam: So you do need to do infrastructure first.

Alex: Infrastructure and interfaces. Define the shape of the user object, the shape of the auth token, the shape of the API response. Define those upfront as contracts. Then teams can implement in parallel against those contracts.

Sam: Okay, so once you've decomposed the work, how do you actually execute it? Is it all parallel?

Alex: No, you need to be smart about it. If you have tight dependencies, you go sequential - one agent instance works through the tasks in order. That's especially useful when you're learning a new codebase. You observe, you understand, then you parallelize.

Sam: But parallel is better for velocity.

Alex: Parallel is better for velocity if you manage the integration costs. And this is the part people underestimate. Parallelization adds integration overhead. Budget for it.

Sam: What kind of overhead are we talking about?

Alex: Merge conflicts - multiple branches touching the same files. API mismatches - agent A expects interface X, but agent B built interface Y. Test interactions - unit tests pass independently, but integration tests fail because the agents made different assumptions about timing or error handling.

Sam: So parallel development isn't free.

Alex: It's not free. I usually budget 20 to 30 percent of parallel execution time for merging, conflict resolution, and integration testing. If your tasks are truly independent and well-scoped, that overhead stays low. If they're not, it explodes.

Sam: How do you keep it low?

Alex: Three things. First, clear interface contracts before implementation. Write down what Agent A is going to build and what interface it's going to provide. Agent B does the same. Those interfaces are locked in before coding starts. Second, isolated feature branches - each workstream has its own branch, no shared work-in-progress. Third, and this is important - integration is an explicit task. Don't assume parallel work will merge cleanly. Write a task that says "integrate auth layer with user management" and treat it as serious work.

Sam: And communication boundaries - sharing completed things, not work-in-progress.

Alex: Right. You share the interface definition and then the completed implementation. You don't share half-built code and assume the other agent will figure it out.

Sam: This is starting to feel less like "have multiple agents work in parallel" and more like classical software engineering.

Alex: Because it is. This isn't new thinking. You're just applying the thinking that good teams have always applied - clear contracts, explicit integration, visible coordination - to AI agents instead of people.

Sam: So when do you actually parallelize versus staying sequential?

Alex: Parallelize when tasks are clearly independent, no shared files, well-defined interface contracts, low integration cost. Parallelize when you have a deadline and need velocity. Stay sequential when you're learning the codebase, when tasks are tightly coupled, when integration costs are high relative to the execution savings.

Sam: What's a concrete example of high integration cost?

Alex: Suppose you're building a multi-factor authentication system. You could parallelize implementation of TOTP, backup codes, and SMS verification because they're pretty independent. But if you parallelize the schema changes, the middleware integration, the API changes, and the UI all at once, you've got everything touching the auth layer. Merging becomes painful.

Sam: So you do the schema and middleware sequentially, then parallelize the TOTP and backup codes implementations once those are in place.

Alex: That's a good hybrid approach. You do the foundational work first, then parallelize the add-ons.

Sam: Alright, so you've grounded the agent, asked good clarifying questions, decomposed the work, and now you're executing it - either sequentially or in parallel. What are the artifacts that make this real?

Alex: Task lists. Interface contracts written down. Architecture decision records if the decisions are significant. These turn invisible planning into tangible deliverables.

Sam: Why does that matter?

Alex: Because it's how you track progress. How you communicate with stakeholders. How you recover context if you get interrupted. And it's how you verify that your plan actually worked. You can look back and ask - did we execute the tasks we said we would? Did we hit the interface contracts we defined?

Sam: So the artifacts are your source of truth.

Alex: They're your project management system. They're your insurance policy against thrashing.

Sam: One more thing. You said earlier that grounding is not optional. But practically, how much effort are we talking about?

Alex: Depends on the complexity of the feature, but for a typical mid-sized feature, maybe 10 to 15 minutes. You spend a few minutes reviewing existing code patterns. A few minutes reading relevant documentation. A minute or two identifying what questions you need to ask. Then you write a grounding prompt that includes all of that context.

Sam: So it's an upfront investment, but not huge.

Alex: It's small relative to the rework time you save. I've watched teams try to skip grounding because they're in a hurry, and I've watched them spend three times as long fixing the agent's output as they would have spent grounding it properly.

Sam: The false economy of skipping preparation.

Alex: Exactly. Especially with agents, where you're not getting course corrections from a person who knows your codebase. You need to load the agent with everything it needs to make good decisions upfront.

Sam: Alright. So to recap - grounding is loading context before execution. Clarifying questions come with evidence, not guesses. Decomposition breaks features into parallelizable units. Execution can be sequential or parallel depending on dependencies and integration costs. And artifacts make it all verifiable.

Alex: That's the framework. And it's not magic. It's the same discipline that good engineering teams have always applied. We're just being intentional about it because we're directing AI agents instead of writing code ourselves.

Sam: Which means we need to be even more explicit about our thinking, because the agent doesn't have institutional knowledge or context recovery like a teammate would.

Alex: Exactly. The agent doesn't have your experience. Doesn't have your instincts. So you have to externalize all of that into explicit context and contracts.

Sam: That actually sounds like it improves team quality across the board.

Alex: It does. Because now you're forced to document your patterns, articulate your constraints, define your interfaces. That's good. That's how systems stay coherent as they scale.
