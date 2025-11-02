---
source: practical-techniques/lesson-9-reviewing-code.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-02T09:12:56.688Z
model: claude-haiku-4.5
tokenCount: 5332
---

Alex: Code review is fascinating because it's simultaneously one of the highest-leverage activities a team can do and one of the most often done poorly. When it works, it's catching bugs before they hit production, maintaining architectural consistency, and spreading knowledge across the team. When it doesn't work, it becomes this tedious process where reviewers nitpick style issues while missing actual security flaws.

Sam: Yeah, I've been on both sides of that. The worst reviews I've done are when I'm drowning in trivial formatting comments someone could have caught with a linter, and meanwhile there's a real problem nobody's catching. So where's the leverage point here with AI?

Alex: The insight is pretty straightforward: AI is exceptionally good at the mechanical aspects of code review. It can spot SQL injection vulnerabilities, flag missing error handling, find duplicate code, catch performance anti-patterns like N+1 queries. All the things that are tedious to check manually but mostly objective. And if you automate those checks, you free up human reviewers to focus on the stuff that actually requires judgment.

Sam: The stuff AI can't do as well.

Alex: Exactly. Whether the code actually solves the business problem. Whether it fits the architecture. Whether there are UX implications the engineer didn't consider. Whether it creates unnecessary coupling or over-engineering. That's where human judgment matters.

Sam: So the workflow is basically: run AI first, then humans focus on architecture and context?

Alex: Not quite, and this is important. The most effective code review actually happens before the PR even exists. Before you commit. You do a pre-commit review with your AI agent, catch the low-hanging fruit yourself, iterate locally, and then when you submit, you're already confident about the basics. The reviewer can focus on the hard parts.

Sam: That sounds efficient, but doesn't that mean you're doing the review work twice? Once locally with AI, once when someone reviews the PR?

Alex: You're not doing it twice. You're doing different things. Your pre-commit review catches syntax errors, security anti-patterns, performance issues, error handling gaps. All the things that slow down a reviewer. Then when a human reviewer looks at it, they're not distracted by those problems. They can actually think about whether this belongs in this module, whether it's going to create problems under load, whether the UX makes sense.

Sam: OK, so let's talk about what AI actually catches in a pre-commit review. Because I want to understand the boundary. What can it reliably find?

Alex: Security issues are pretty clear cut. SQL injection, XSS, auth bypasses, hardcoded credentials, sensitive data being logged. Anything that matches a known vulnerability pattern. Performance patterns are similar - the AI can spot the classic mistakes. N+1 queries, unnecessary loops, algorithms with bad complexity.

Sam: Because those are pattern matches.

Alex: Right. Error handling too. Missing try-catch blocks, unchecked return values, silent failures. Code smells like duplicated logic, god objects, tight coupling. Style inconsistencies. All of that is pattern-matchable and fixable before a human even sees it.

Sam: And the business logic stuff - "does this actually solve the problem" - that requires context a general AI doesn't have?

Alex: Exactly. That's the thing. The AI can tell you "this function has a 5-argument parameter list and uses global state," but it can't tell you whether that's actually wrong for your system. It can't tell you if the requirement was actually about limiting requests or if this is solving a different problem. It can't tell you if this change is going to confuse your users or cause operational issues in production.

Sam: So in practice, what does the pre-commit review workflow look like? Do you literally prompt the AI to review your code before you commit?

Alex: Yes. And it's faster than waiting for CI to fail. You write some code, you get to a point where you think it's done, you run your AI agent through a structured review. You ask it to look for security issues, performance problems, error handling. The AI runs in seconds and gives you a report. Most of the time you'll find two or three things to fix before commit. Every once in a while it'll find something critical that would have made it to production.

Sam: What does "structured review" mean here? Are you using some kind of standardized prompt?

Alex: That's the key point. You can't just say "review my code." You get boilerplate nonsense. You need to be specific. Check for SQL injection. Check for unhandled promise rejections. Check for race conditions in concurrent access. Make it architectural if you can - "does this layer know too much about that layer?" That kind of specificity gets better results.

Sam: And you're iterating based on what the AI finds?

Alex: Absolutely. The AI finds an issue, you fix it, you re-run the AI to make sure you didn't introduce anything else. You might do that cycle two or three times before you commit. It's cheap - a few seconds per cycle - and it beats the cost of shipping broken code or waiting for a human reviewer to catch it.

Sam: That makes sense for things the AI is good at. Let me shift to the commit message side. You mentioned earlier that git history is documentation. That's something I definitely see teams mess up. How does AI fit there?

Alex: Commit messages are this weird thing where everyone knows they're important, but most teams are terrible at them. You see commits like "fix stuff" or "update code" that are completely useless. Or the opposite - these giant walls of text that nobody actually reads. The Conventional Commits format exists specifically to solve this: a structured format that enables automation and clarity.

Sam: Yeah, I've seen that. `feat:` for features, `fix:` for bug fixes, `docs:` for documentation. That kind of thing.

Alex: Right. And the key is that the commit message isn't just for humans. It's for automation. Your version bumping can be automated if your commits follow the format. Your changelog can be auto-generated. Your release notes can be built from commit messages. But more importantly, when you're looking at git history six months later trying to understand why a particular line of code exists, the commit message is your only resource. If it says "fix bug," that's useless. If it says "fix SQL injection in user export endpoint where untrusted input was passed directly to query builder," that's actually useful.

Sam: So the structure matters because it carries information.

Alex: Exactly. And this is where AI comes in. You can ask your AI agent to generate a commit message, but by default you'll get something mediocre. You need to be specific. Tell the AI what problem this solves, what the security implication is, what the business context is. If you've got a ticket number, reference it. Then the AI can generate something actually useful.

Sam: Let me push back on that though. If you're spending time crafting a detailed prompt to get the AI to generate a good commit message, aren't you just doing the work yourself anyway? Why not just write it?

Alex: Fair point. But here's the thing - you do the thinking anyway. You're already mentally modeling what the change is and why you made it. The AI prompt forces you to externalize that thinking. And then the AI formats it correctly, makes sure it follows the convention, keeps it concise. It's not about the AI thinking - it's about the AI being a structured wrapper around thinking you're already doing.

Sam: So it's more about consistency and format than about the AI's creativity.

Alex: Totally. And once you've done a few of these, you build templates. "Here's what a good security fix commit message looks like. Here's what a good refactor looks like." The AI fills in the specifics based on your code diff.

Sam: OK, so let's talk about atomic commits. That seems like a separate concern from commit messages. What's the principle there?

Alex: Atomic commit is the smallest complete unit of change. One logical thing. Tests pass. Can be reverted cleanly. The reason it matters is purely practical. If you have a PR that's a hundred commits but they're all atomic, a reviewer can understand each commit in context. If it's a hundred files changed in one commit, nobody can review that effectively. It's also about future archaeology. Six months from now when you're trying to understand why something is the way it is, git bisect will point you to the exact commit. If that commit is atomic, you understand immediately. If it's a giant monolith, you're stuck.

Sam: But doesn't that argue for really small commits? Like, commit every time you compile something?

Alex: There's a balance. The goal is logical completeness. A feature might require a database migration, a backend API change, and a frontend UI change. That's three commits if it makes sense to do them independently. But within each commit, everything is self-contained and the tests pass. You're not committing half a feature.

Sam: What's the practical workflow for that? How do you actually manage that when you're developing?

Alex: This is where understanding git staging is helpful. You're working on multiple things. You git add the database migration, commit that with a clear message. Then you git add the backend changes, commit those. The frontend separately. Each commit builds on the previous one. And the workflow here is that AI can help you reason about what's atomic and what isn't. You can ask the AI, "Are these changes logically separate?" It can help you figure out how to break them up.

Sam: What about when things are actually intertwined? Like, you genuinely can't test the frontend change without the backend change?

Alex: Then they go in the same commit. The atomic principle isn't about being artificially small. It's about logical coherence. And honestly, if you're finding that things are deeply intertwined, that might be a sign about your architecture. If a UI change can't be tested without a backend change, maybe there's coupling there that shouldn't exist.

Sam: Fair point. So the workflow is basically: develop, stage changes logically, commit with meaningful messages. And AI helps at the staging and commit message steps?

Alex: Yes. AI can help you think through what's atomic. AI can help you generate messages. What AI doesn't do is think about whether this is actually a good idea architecturally. That's still you.

Sam: Let's move to pull request review then, because that's where the bigger picture stuff matters. You've got a teammate's code. You're reviewing it. How does AI fit into that process?

Alex: AI handles the mechanical checks. You do the thinking. The PR comes in, you ask your AI to do a security audit, a performance analysis, check error handling, make sure tests pass. All the stuff that takes a lot of careful reading. The AI generates a report. Meanwhile, you're reading the actual code and thinking about whether this makes sense for the system. Does it belong in this module? Does it create unnecessary coupling? What happens if this crashes under load? What's the UX experience if this fails?

Sam: So you're not replacing the human review, you're just paralleling the mechanical parts?

Alex: Exactly. The human and AI are doing different things simultaneously. By the time you're done thinking about architecture, the AI's done flagging syntax errors and security issues. Then you synthesize. The AI finds five things, you find three things, you have eight things to address. Some of them might be style fixes the AI caught, some might be serious architectural issues you caught.

Sam: And then you're giving feedback. Does AI help there too?

Alex: Yeah, if you're drafting review comments. You can ask the AI to help you write feedback that's constructive and specific. Not "this is bad," but "this pattern tends to create coupling because... here's a better approach... here's a link to the docs on this." That takes time to write well. The AI can help.

Sam: But you still need to approve the approach before you write it?

Alex: Absolutely. The AI's suggestion might be technically correct but not fit your team's conventions. Or it might be over-engineered. You read it, think about whether it's actually the feedback you want to give, potentially revise it. Then you post it.

Sam: OK, so let me test my understanding. The checklist the AI handles - code compiles, no obvious security holes, error handling exists, no hardcoded secrets, performance patterns are sound, style is consistent, tests exist. That's the AI part?

Alex: Right. Those are mostly objective. Either there's error handling or there isn't. Either the SQL looks safe or it doesn't. Style either matches or it doesn't.

Sam: And the human part is whether the business requirements are met, whether it fits the architecture, whether the UX is sensible, whether there's over-engineering, whether the scope is appropriate, whether the rollback strategy is clear?

Alex: Exactly. Those require context. You need to know what the requirement was. You need to understand the system design. You need to think about operational concerns. That's not something you can pattern-match.

Sam: So where's the boundary getting fuzzy? Like, what's something AI might catch but isn't always right about?

Alex: Architectural decisions, actually. The AI might see a pattern and flag it as "this looks coupled" or "this is a code smell." But the AI doesn't know whether that coupling is necessary, whether this is a boundary condition where the pattern makes sense. It can surface questions, but it can't answer them.

Sam: That's interesting. So the AI is good at identifying candidates for further review, not at making the judgment call itself?

Alex: That's a really good way to put it. The AI can say "this class has twenty methods and references five different modules - that might be a god object." A human then evaluates: "Is it actually a problem? Or is this the right abstraction for this particular domain?" The AI can point out the pattern faster than a human might notice it, but it can't make the judgment.

Sam: What about a scenario where you're under time pressure and you just want to ship code? Do you still do the full pre-commit AI review?

Alex: Yes. Actually, especially then. When you're under time pressure, you're more likely to make mistakes. Running a quick AI security audit takes thirty seconds. It's insurance. If you skip it and ship something broken, you've lost days. The time investment is zero compared to the cost of fixing it later.

Sam: But someone could just skip the review and ship code. That happens constantly.

Alex: It does. And those teams experience the cost. Bugs make it to production. Security issues get discovered by bad actors. The teams that are mature about this treat pre-commit review as non-negotiable. It's as automatic as saving your file. You don't think about it - you just do it.

Sam: Fair. Let me ask about a specific scenario. I'm reviewing a PR for a password reset feature. The engineer has implemented it, tests pass, everything looks reasonable. But there are actually several security issues. What does the AI-assisted process look like?

Alex: Good example. You ask your AI agent to do a security audit specifically on password reset code. The AI will probably find several things: no password hashing, no token-based reset flow, no rate limiting, insufficient input validation, missing error handling. Basically, the AI can identify the patterns of a broken password reset.

Sam: And then you feed that back to the engineer?

Alex: Right. You draft feedback. "The current implementation allows anyone with an email address to reset anyone else's password. Here's why that's a problem. Here's the correct approach: generate a time-limited token, send it to the email address, verify the token before allowing reset, invalidate existing sessions." You might even ask the AI to draft that explanation, then review it to make sure it's accurate.

Sam: But there are things the AI won't catch about that scenario, right?

Alex: Definitely. The AI might not realize that the password reset email is never actually sent. The engineer forgot that part. The AI might not flag that existing sessions aren't invalidated. Or that there's no notification sent to the user's previous email address to alert them that something changed. Those are more subtle - they require understanding the full user flow and operational best practices.

Sam: So the AI catches the mechanisms - the cryptography, the security patterns - but misses the process flow?

Alex: Exactly. Because process flow requires understanding the entire system, not just code patterns. The AI sees "this function changes a password" but doesn't see "and this should invalidate sessions and notify the user."

Sam: That's a really useful boundary to understand. So the combination is: AI is comprehensive about mechanisms, humans are comprehensive about context and flow.

Alex: That's right. And together, you catch more than either would alone. The engineer ships code, you catch the serious issues with AI and human judgment, the code is better. Everyone wins.

Sam: One more question. You said earlier that you shouldn't squash commits by default. That seems to go against what a lot of teams do. Why preserve atomic commits?

Alex: Future archaeology. Code exists for years. At some point, someone - maybe you, probably not - is trying to understand why something is the way it is. They're going to use git blame and git log to figure it out. If you squashed everything into one commit that says "implement feature X," they've got no granular history. If the feature is split into atomic commits, they can understand the progression of how it was built and why each part matters.

Sam: But if they can read the code, don't they understand what it does?

Alex: No. Understanding what code does is different from understanding why it was written that way. Why did we choose this approach instead of that approach? What was the problem we were solving? Those are questions git history should answer. If all of that is squashed into a single commit with a generic message, it's lost.

Sam: So squashing is only appropriate if the individual commits are junk. Like, fixup commits.

Alex: Right. If you have a commit that says "fix typo in function name" or "run linter," those are fixup commits. Those should be squashed into their parent. But if each commit represents a logical step - database schema, API, UI - those should stay separate.

Sam: OK, this makes sense. So to step back, the whole workflow is: write code, pre-commit AI review, iterate, commit atomically with meaningful messages, someone does the full review, AI flags mechanical issues, human focuses on architecture and context, combine feedback, iterate, merge when everything checks out.

Alex: That's the systematic version. In practice, teams vary. But the core principles are: automate the mechanical parts with AI, focus human judgment on what matters, preserve history for future understanding. And do the cheap review work early - pre-commit - rather than late - after you've pushed.

Sam: Does the AI-assisted approach change how you think about code review as a cultural practice?

Alex: It changes the emphasis. Code review is still about quality and knowledge sharing. But now it's more about judgment than about catching typos. If your code reviewers are spending time on style and formatting, they're not thinking about whether this is architecturally sound. The AI review surfaces the style issues. The human review is about the hard parts.

Sam: Which makes sense. Humans are expensive. AI is cheap. Use the cheap thing on cheap problems.

Alex: Exactly. And use the expensive thing on expensive problems. If your team's reviewers are constantly distracted by trivial issues, they burn out and they miss the important stuff. If you automate the trivial, they have space to think about the important.

Sam: Last question. How do you know if you're doing this right? What's the indicator that the system is working?

Alex: Several things. One: Are bugs getting caught pre-commit or before merge? You should be catching most mechanical issues with AI before a human even sees it. Two: Are your commit messages actually useful? Can you blame a line and understand why it's there? Three: Are your reviewers able to focus on high-value feedback instead of nitpicking? And four: When problems do happen, can you use git history to understand how you got there?

Sam: And if you're not seeing those things?

Alex: Then something's wrong with the system. Maybe the AI prompts aren't good. Maybe reviewers aren't actually focusing on the hard stuff. Maybe commits aren't atomic. Those are the knobs to adjust.

Sam: This has been useful. So the summary is: automate the mechanical with AI, focus humans on context, keep history atomic and meaningful. And the benefit is faster reviews, better quality, and better future understanding.

Alex: Nailed it. Code review is one of your highest-leverage activities. AI makes you faster at the tedious parts so you can be better at the parts that matter.
