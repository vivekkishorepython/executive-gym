import { categories, type Card } from "./types";
// Each tuple teaches a single behavior: situation, response, explanation.
const lessons: string[][][] = [
  [
    [
      "Someone criticizes my work.",
      "Can you give me a specific example?",
      "Turn vague criticism into actionable feedback.",
    ],
    [
      "A colleague interrupts me in a meeting.",
      "I’d like to finish this thought, then hear your perspective.",
      "Hold your turn without dismissing theirs.",
    ],
    [
      "I’m asked to take on work beyond my capacity.",
      "I can take this on if we move another priority. Which should shift?",
      "Make capacity a concrete tradeoff.",
    ],
    [
      "A deadline is unrealistic.",
      "I can deliver the core analysis by Friday. The full scope needs until Tuesday.",
      "Offer a feasible commitment.",
    ],
    [
      "My recommendation is brushed aside.",
      "Before we move on, I’d like us to consider the risk this addresses.",
      "Bring attention back to the decision.",
    ],
    [
      "A colleague speaks for me.",
      "Let me share my own view on that.",
      "Reclaim your voice calmly.",
    ],
    [
      "I disagree with the proposed approach.",
      "I see it differently. My concern is the impact on our customers.",
      "Ground disagreement in an outcome.",
    ],
    [
      "A request arrives outside my working hours.",
      "I’ll review this tomorrow morning. If it’s urgent, please clarify the deadline.",
      "State availability and invite clarity.",
    ],
    [
      "Someone assigns me a task without discussing it.",
      "Let’s confirm scope and priority before I commit.",
      "Pause an implied commitment.",
    ],
    [
      "A meeting ends without my input.",
      "I have one point that could change the next step. May I add it?",
      "Create a clear opening to contribute.",
    ],
  ],
  [
    [
      "A colleague seems frustrated with a delay.",
      "What is this delay making harder for you?",
      "Understand the impact before solving.",
    ],
    [
      "A teammate says they feel overwhelmed.",
      "Which part feels hardest right now?",
      "Invite a specific account of the problem.",
    ],
    [
      "Someone reacts defensively to feedback.",
      "I can see this is difficult to hear. What’s your perspective?",
      "Make room for their experience.",
    ],
    [
      "A colleague makes a mistake.",
      "Let’s understand what happened before deciding what to change.",
      "Replace blame with curiosity.",
    ],
    [
      "A teammate is unusually quiet.",
      "I noticed you’ve been quieter today. Would you like to check in privately?",
      "Offer connection without forcing disclosure.",
    ],
    [
      "A stakeholder is upset about a change.",
      "What are you most concerned about losing with this change?",
      "Identify the concern beneath the reaction.",
    ],
    [
      "Someone shares a difficult personal situation.",
      "Thank you for telling me. What support at work would help?",
      "Let them define useful support.",
    ],
    [
      "I’m unsure whether I understood someone.",
      "It sounds like your main concern is timing. Is that right?",
      "Check understanding before responding.",
    ],
    [
      "A colleague’s view differs from mine.",
      "What experience led you to that conclusion?",
      "Explore context without assuming motives.",
    ],
    [
      "A teammate declines my offer of help.",
      "Understood. If that changes, you can let me know.",
      "Respect their autonomy.",
    ],
  ],
  [
    [
      "I’m asked for an update by a senior leader.",
      "We’re on track for Friday. The main risk is approval, and I’m addressing it today.",
      "Lead with status, risk, and action.",
    ],
    [
      "I need time to answer a difficult question.",
      "Let me take a moment to think through that.",
      "Use a deliberate pause.",
    ],
    [
      "I don’t know an answer in a meeting.",
      "I don’t have that figure yet. I’ll verify it and follow up by tomorrow.",
      "Be clear about uncertainty and follow-through.",
    ],
    [
      "My presentation is running long.",
      "The decision we need today is whether to proceed with the pilot.",
      "Return attention to the decision.",
    ],
    [
      "I’m introducing a recommendation.",
      "I recommend option B because it reduces risk while meeting the deadline.",
      "State the recommendation before details.",
    ],
    [
      "The discussion becomes scattered.",
      "Let’s return to the outcome we’re trying to achieve.",
      "Provide a calm organizing frame.",
    ],
    [
      "I feel pressure to speak quickly.",
      "My key point is this: we need one accountable owner.",
      "Choose one clear message.",
    ],
    [
      "An executive challenges my assumptions.",
      "That assumption is worth testing. Here’s how we can validate it.",
      "Treat scrutiny as an opportunity for rigor.",
    ],
    [
      "I need to describe a setback.",
      "We missed the milestone. Here’s the recovery plan and revised date.",
      "Pair accountability with a concrete next step.",
    ],
    [
      "I’m closing a meeting.",
      "We’ve agreed on the pilot. Priya owns the next step, due Friday.",
      "Close with a decision, owner, and date.",
    ],
  ],
  [
    [
      "A disagreement is becoming personal.",
      "Let’s focus on the proposal and its impact, rather than on each other.",
      "Move the discussion back to the work.",
    ],
    [
      "Two colleagues argue over a solution.",
      "What criteria would help us compare these options fairly?",
      "Establish a shared basis for deciding.",
    ],
    [
      "Someone uses a sharp tone with me.",
      "I want to resolve this. Can we discuss the concern calmly?",
      "Set a respectful condition for dialogue.",
    ],
    [
      "We keep repeating the same disagreement.",
      "What information would help us move beyond this point?",
      "Identify the missing evidence.",
    ],
    [
      "I contributed to a misunderstanding.",
      "I wasn’t clear about the deadline. I’ll clarify the expectation now.",
      "Own your part specifically.",
    ],
    [
      "A colleague says I ignored their input.",
      "Which input did you feel we missed? Let’s revisit it.",
      "Ask for specifics before defending.",
    ],
    [
      "A conflict is disrupting a meeting.",
      "This needs a focused conversation. Let’s set aside time after this meeting.",
      "Move the conflict to an appropriate setting.",
    ],
    [
      "We disagree on priorities.",
      "What outcome are we each trying to protect?",
      "Find the interests behind the positions.",
    ],
    [
      "A difficult conversation stalls.",
      "Can we agree on one next step, even if we don’t agree on everything?",
      "Seek a workable point of agreement.",
    ],
    [
      "A colleague repeatedly misses our agreement.",
      "We agreed on Friday delivery, and it’s slipped twice. What needs to change?",
      "Name the pattern without attacking character.",
    ],
  ],
  [
    [
      "My boss gives me competing priorities.",
      "If I can complete only one today, which matters most?",
      "Request a clear priority decision.",
    ],
    [
      "My boss changes direction unexpectedly.",
      "What has changed, and what should we stop doing as a result?",
      "Clarify the reason and the tradeoff.",
    ],
    [
      "I need feedback from my boss.",
      "What is one behavior I could change to be more effective in these meetings?",
      "Make feedback specific and usable.",
    ],
    [
      "I disagree with my boss’s plan.",
      "I see a risk with the timeline. May I walk you through an alternative?",
      "Offer a reasoned alternative respectfully.",
    ],
    [
      "My boss is unavailable and a decision is due.",
      "I plan to proceed with option A unless you flag a concern by 3 p.m.",
      "Use an agreed decision boundary; don’t assume authority you lack.",
    ],
    [
      "My boss asks for a surprise update.",
      "The deliverable is on schedule. I need your decision on scope by Thursday.",
      "Make the required support visible.",
    ],
    [
      "My role expectations are unclear.",
      "What would successful performance look like over the next three months?",
      "Align on observable expectations.",
    ],
    [
      "My boss gives only vague praise.",
      "Thank you. Which part should I repeat on the next project?",
      "Turn praise into actionable insight.",
    ],
    [
      "I need to raise a delivery risk.",
      "I want to flag this early: approval may delay launch by two days.",
      "Give advance notice before a problem escalates.",
    ],
    [
      "I want more responsibility.",
      "I’d like to own the next pilot. What would you need to see to support that?",
      "Connect ambition with readiness criteria.",
    ],
  ],
  [
    [
      "A team member needs clearer direction.",
      "The outcome is a one-page recommendation by Friday. You can choose the approach.",
      "Define the result while allowing autonomy.",
    ],
    [
      "A teammate misses a deadline.",
      "What got in the way, and what is a realistic recovery date?",
      "Diagnose before agreeing on recovery.",
    ],
    [
      "A teammate asks me to decide everything.",
      "What do you recommend, and what tradeoff did you consider?",
      "Build decision-making capability.",
    ],
    [
      "I need to delegate important work.",
      "You own the draft. Let’s check progress on Wednesday before the final review.",
      "Pair ownership with a clear checkpoint.",
    ],
    [
      "A teammate does excellent work.",
      "Your clear risk summary helped us make the decision faster.",
      "Recognize a specific contribution.",
    ],
    [
      "I need to give corrective feedback.",
      "In today’s meeting, the interruptions made it hard for others to contribute. Please let them finish.",
      "Describe an observable behavior and a change.",
    ],
    [
      "A team member is overloaded.",
      "Let’s review your commitments and decide what to defer.",
      "Treat overload as a prioritization issue.",
    ],
    [
      "A new teammate is hesitant to speak.",
      "I’d like your perspective. You can also send it after the meeting.",
      "Provide more than one way to contribute.",
    ],
    [
      "The team is unclear about a decision.",
      "I’ll explain the decision, the reason, and what it means for our work.",
      "Provide context as well as direction.",
    ],
    [
      "I made an error that affected my team.",
      "I made the wrong call on scope. I’ll correct it and update the plan today.",
      "Model accountability without shifting blame.",
    ],
  ],
  [
    [
      "A peer asks for a favor that affects my deadline.",
      "I can help for thirty minutes today. What is the highest-priority piece?",
      "Bound your help clearly.",
    ],
    [
      "A peer takes credit for shared work.",
      "I’m glad this landed well. Let’s also acknowledge the analysis our team contributed.",
      "Make shared contributions visible.",
    ],
    [
      "I need a peer’s input urgently.",
      "Could you review these two questions by noon? They’re blocking the release decision.",
      "Make the request specific and explain its impact.",
    ],
    [
      "A peer and I duplicate work.",
      "Let’s agree on ownership so we don’t both solve the same problem.",
      "Clarify responsibilities early.",
    ],
    [
      "A colleague repeatedly bypasses our agreement.",
      "Can we revisit how requests come in? The current process is creating rework.",
      "Address the process behind the friction.",
    ],
    [
      "I want to build a working relationship.",
      "What are your team’s main priorities this quarter?",
      "Start with their goals.",
    ],
    [
      "A peer gives useful feedback.",
      "That helped. I’ll revise the summary to make the decision clearer.",
      "Acknowledge the value and the action.",
    ],
    [
      "A peer asks me to support a proposal I haven’t read.",
      "I’ll review it before offering my support.",
      "Keep endorsement grounded in understanding.",
    ],
    [
      "A peer disagrees in front of others.",
      "Let’s compare our assumptions so the group can assess both views.",
      "Make disagreement useful to the group.",
    ],
    [
      "I need to reset a strained peer relationship.",
      "I’d like us to work more smoothly. Can we discuss what each of us needs?",
      "Invite a mutual reset.",
    ],
  ],
  [
    [
      "Two departments have different goals.",
      "What outcome do both teams need this project to deliver?",
      "Establish a shared outcome.",
    ],
    [
      "A dependency is delaying my team.",
      "What date can your team commit to, and what support would make that possible?",
      "Negotiate a credible dependency date.",
    ],
    [
      "Ownership falls between teams.",
      "Who will be accountable for this handoff from start to finish?",
      "Name one accountable owner.",
    ],
    [
      "Another team uses unfamiliar terminology.",
      "Can we define that term so we’re working from the same understanding?",
      "Build shared language.",
    ],
    [
      "A partner team changes the requirements.",
      "What impact will this have on scope and timing? Let’s update the agreement.",
      "Make the change explicit.",
    ],
    [
      "A project has too many status meetings.",
      "Could we use a written update and meet only for decisions or blockers?",
      "Protect attention while preserving coordination.",
    ],
    [
      "A team raises a late concern.",
      "What must be resolved before launch, and what can follow afterward?",
      "Separate launch blockers from later improvements.",
    ],
    [
      "I’m escalating a cross-team blocker.",
      "We need a decision on ownership by Thursday to protect the launch date.",
      "Escalate the decision needed, not personal blame.",
    ],
    [
      "A handoff causes repeated errors.",
      "Let’s agree on a checklist and an acceptance point for the handoff.",
      "Create a clear boundary of responsibility.",
    ],
    [
      "I need support from another function.",
      "This will help us reduce customer wait time. What would your team need to participate?",
      "Connect the request to value and capacity.",
    ],
  ],
  [
    [
      "My contribution is missing from a project update.",
      "Could we include my work on the analysis in the final update?",
      "Ask directly for accurate recognition.",
    ],
    [
      "I want to discuss career growth.",
      "I’d like to discuss my next level and the evidence needed to get there.",
      "Turn advancement into a concrete conversation.",
    ],
    [
      "I’ve delivered a meaningful result.",
      "The new process reduced rework. I’d like to share the approach with the team.",
      "Communicate the value of your work.",
    ],
    [
      "I’m given work that doesn’t build my skills.",
      "I can handle this task. I’d also like to plan for work that develops my leadership skills.",
      "Pair the current commitment with a growth request.",
    ],
    [
      "I need resources to succeed.",
      "To meet this deadline, I need a reviewer assigned by Tuesday.",
      "Ask for the specific support required.",
    ],
    [
      "I’m excluded from a relevant meeting.",
      "This decision affects my work. Could I join the discussion?",
      "Explain why your participation matters.",
    ],
    [
      "I’m asked about my achievements.",
      "I led the analysis that helped the team choose the lower-risk option.",
      "Describe your role and its impact accurately.",
    ],
    [
      "I want to discuss compensation.",
      "Could we review my compensation in light of my scope and contributions?",
      "Open a factual discussion without threats.",
    ],
    [
      "My development keeps getting postponed.",
      "Can we set a date for this conversation and agree on the preparation?",
      "Request a concrete commitment.",
    ],
    [
      "I hesitate to volunteer for a visible assignment.",
      "I’d like to lead this. Here is how I would approach the first milestone.",
      "Show interest alongside a practical plan.",
    ],
  ],
  [
    [
      "I’m unsure who can approve my proposal.",
      "Who owns this decision, and who should be consulted before approval?",
      "Understand legitimate decision authority.",
    ],
    [
      "A senior person makes an unsupported claim.",
      "What evidence should we review before making this decision?",
      "Ask for a sound decision basis respectfully.",
    ],
    [
      "I’m asked to act beyond my authority.",
      "I can prepare the recommendation. The approval needs to come from the accountable owner.",
      "Clarify the boundary of your role.",
    ],
    [
      "A powerful stakeholder is blocking progress.",
      "What concern would need to be addressed for you to support the next step?",
      "Understand the condition for support.",
    ],
    [
      "I have authority over a decision affecting others.",
      "Before I decide, I’d like to hear from the people doing this work.",
      "Use authority with informed input.",
    ],
    [
      "A team member challenges my decision.",
      "Walk me through the risk you see. I’ll consider it before we proceed.",
      "Keep authority open to relevant evidence.",
    ],
    [
      "I need to navigate conflicting sponsors.",
      "Let’s bring the tradeoff to the decision owner with both perspectives included.",
      "Use transparent escalation.",
    ],
    [
      "Someone implies I must agree because of their title.",
      "I understand the direction. I still need to flag this delivery risk.",
      "Keep material concerns visible.",
    ],
    [
      "I’m invited into a higher-level discussion.",
      "What decision can I help clarify with the information I have?",
      "Contribute through relevant expertise.",
    ],
    [
      "I control a resource another team needs.",
      "Let’s agree on fair allocation criteria and make them visible.",
      "Apply power transparently.",
    ],
  ],
  [
    [
      "I need support for a new idea.",
      "Could we test this with a small pilot before making a larger commitment?",
      "Lower uncertainty with a bounded experiment.",
    ],
    [
      "A stakeholder is unconvinced.",
      "Which part of the proposal feels least compelling to you?",
      "Locate the obstacle to agreement.",
    ],
    [
      "I’m presenting to a team with different priorities.",
      "This approach supports your goal of reducing turnaround time.",
      "Connect the proposal to a real shared interest.",
    ],
    [
      "My recommendation has a tradeoff.",
      "This is faster, but it increases support work. Here’s how we can manage that.",
      "Build trust by making costs visible.",
    ],
    [
      "A proposal needs wider input.",
      "Who else will be affected and should have a voice in this decision?",
      "Include relevant perspectives.",
    ],
    [
      "I need to persuade with limited time.",
      "The main benefit is fewer handoff errors. The evidence is in last month’s review.",
      "Pair one benefit with evidence.",
    ],
    [
      "A team resists a process change.",
      "What would make this change easier to try in your workflow?",
      "Invite practical adaptation.",
    ],
    [
      "I’m asking someone to sponsor an idea.",
      "Would you support a two-week pilot with these success measures?",
      "Ask for a specific, measurable commitment.",
    ],
    [
      "New evidence weakens my proposal.",
      "This changes my recommendation. I suggest we adjust the scope.",
      "Let evidence update your position.",
    ],
    [
      "A discussion ends with general interest.",
      "Can we agree on the next step and who will own it?",
      "Convert interest into explicit action.",
    ],
  ],
];
export const seedCards: Card[] = lessons.flatMap((group, categoryIndex) =>
  group.map(([front, back, explanation], index) => ({
    id: `00000000-0000-4000-8000-${String(categoryIndex * 10 + index + 1).padStart(12, "0")}`,
    category: categories[categoryIndex],
    front,
    back,
    explanation,
    difficulty: index < 5 ? "beginner" : "intermediate",
    display_order: index + 1,
    published: true,
  })),
);
