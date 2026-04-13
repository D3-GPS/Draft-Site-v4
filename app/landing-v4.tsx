import React, { useEffect, useMemo, useRef, useState } from "react";

type CtaType = "buy" | "apply" | "book_call" | "waitlist";
type LevelKey = "starter" | "growth" | "accelerator" | "elite";
type GoalValue = "wealth" | "business" | "marketing" | "sales" | "life-design" | "ai-tech";
type SituationValue = "early" | "stable" | "owner" | "investing" | "scaling";
type ChallengeValue = "money-clarity" | "income" | "system" | "opportunities" | "stuck";
type ExperienceValue = "beginner" | "some" | "advanced";
type CommitmentValue = "self-directed" | "guided" | "high-level";

type Program = {
  id: string;
  label: string;
};

type MasterCategory = {
  id: string;
  label: string;
  heroSubline: string;
  primaryPrograms: Program[];
  supportPrograms?: Program[];
};

type Recommendation = {
  masterId: string;
  activeProgramId: string;
  level: LevelKey;
  cta: CtaType;
  title: string;
  summary: string;
  outcome: string;
  whyFits: string;
  delivery: string;
  priceLabel: string;
  unlocks: string;
  learnMoreTitle: string;
  learnMoreBody: string;
  bullets: string[];
  note?: string;
};

const MASTER_CATEGORIES: MasterCategory[] = [
  {
    id: "wealth",
    label: "Wealth",
    heroSubline: "Build, protect, and expand your financial position with real structure.",
    primaryPrograms: [
      { id: "wealth-operating-system", label: "Wealth Operating System" },
      { id: "real-estate", label: "Real Estate" },
      { id: "portfolio-strategy", label: "Portfolio Strategy" },
    ],
    supportPrograms: [
      { id: "cash-flow", label: "Cash Flow" },
      { id: "debt-strategy", label: "Debt Strategy" },
      { id: "portfolio-review", label: "Portfolio Review" },
    ],
  },
  {
    id: "business",
    label: "Business",
    heroSubline: "Install the systems that improve decisions, execution, and performance.",
    primaryPrograms: [
      { id: "financial-systems", label: "Financial Systems" },
      { id: "operations-delivery", label: "Operations & Delivery" },
      { id: "revenue-systems", label: "Revenue Systems" },
      { id: "strategy-decision-making", label: "Strategy & Decision Making" },
      { id: "leadership-team", label: "Leadership & Team" },
    ],
    supportPrograms: [
      { id: "financial-control", label: "Financial Control" },
      { id: "kpi-dashboard", label: "KPI Dashboard" },
      { id: "process-design", label: "Process Design" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    heroSubline: "Create consistent demand, cleaner messaging, and scalable acquisition systems.",
    primaryPrograms: [
      { id: "attention", label: "Attention" },
      { id: "capture", label: "Capture" },
      { id: "nurture", label: "Nurture" },
      { id: "lead-activation", label: "Lead Activation" },
      { id: "retention-ascension", label: "Retention & Ascension" },
    ],
    supportPrograms: [
      { id: "ad-optimization", label: "Ad Optimization" },
      { id: "landing-page-optimization", label: "Landing Page Optimization" },
      { id: "analytics-tracking", label: "Analytics & Tracking" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    heroSubline: "Build a predictable pipeline, stronger conversion, and cleaner revenue movement.",
    primaryPrograms: [
      { id: "sales-skills-communication", label: "Sales Skills & Communication" },
      { id: "lead-handling-qualification", label: "Lead Handling & Qualification" },
      { id: "conversion", label: "Conversion" },
      { id: "follow-up-pipeline", label: "Follow-Up & Pipeline" },
      { id: "sales-systems-scaling", label: "Sales Systems & Scaling" },
    ],
    supportPrograms: [
      { id: "crm-setup", label: "CRM Setup" },
      { id: "script-development", label: "Script Development" },
      { id: "pipeline-repair", label: "Pipeline Repair" },
    ],
  },
  {
    id: "life-design",
    label: "Life Design",
    heroSubline: "Align time, energy, standards, and direction with a real operating system.",
    primaryPrograms: [
      { id: "time-lifestyle-design", label: "Time & Lifestyle Design" },
      { id: "life-strategy-direction", label: "Life Strategy & Direction" },
      { id: "income-path-selection", label: "Income Path Selection" },
      { id: "freedom-optionality", label: "Freedom & Optionality" },
      { id: "priorities-trade-offs", label: "Priorities & Trade-Offs" },
    ],
    supportPrograms: [
      { id: "time-audit", label: "Time Audit" },
      { id: "habit-systems", label: "Habit Systems" },
      { id: "decision-framework", label: "Decision Framework" },
    ],
  },
  {
    id: "ai",
    label: "AI / Tech",
    heroSubline: "Use AI as leverage inside the system you are already building.",
    primaryPrograms: [
      { id: "ai-foundations", label: "AI Foundations" },
      { id: "ai-workflows", label: "AI Workflows" },
      { id: "ai-implementation", label: "AI Implementation" },
    ],
    supportPrograms: [
      { id: "prompt-library", label: "Prompt Library" },
      { id: "automation-build", label: "Automation Build" },
      { id: "ai-audit", label: "AI Audit" },
    ],
  },
];

const PAYMENT_LINKS: Record<string, string> = {
  "wealth:starter": "#stripe-wealth-starter",
  "wealth:growth": "#stripe-wealth-growth",
  "wealth:accelerator": "#stripe-wealth-accelerator",
  "wealth:elite": "#stripe-wealth-elite",
  "business:starter": "#stripe-business-starter",
  "business:growth": "#stripe-business-growth",
  "business:accelerator": "#stripe-business-accelerator",
  "business:elite": "#stripe-business-elite",
  "marketing:starter": "#stripe-marketing-starter",
  "marketing:growth": "#stripe-marketing-growth",
  "marketing:accelerator": "#stripe-marketing-accelerator",
  "marketing:elite": "#stripe-marketing-elite",
  "sales:starter": "#stripe-sales-starter",
  "sales:growth": "#stripe-sales-growth",
  "sales:accelerator": "#stripe-sales-accelerator",
  "sales:elite": "#stripe-sales-elite",
  "life-design:starter": "#stripe-life-starter",
  "life-design:growth": "#stripe-life-growth",
  "life-design:accelerator": "#stripe-life-accelerator",
  "life-design:elite": "#stripe-life-elite",
  "ai:starter": "#stripe-ai-starter",
  "ai:growth": "#stripe-ai-growth",
  "ai:accelerator": "#stripe-ai-accelerator",
  "ai:elite": "#stripe-ai-elite",
};

const APPLICATION_LINKS: Record<string, string> = {
  wealth: "#tally-wealth",
  business: "#tally-business",
  marketing: "#tally-marketing",
  sales: "#tally-sales",
  "life-design": "#tally-life-design",
  ai: "#tally-ai",
};

const CALL_LINKS: Record<string, string> = {
  wealth: "#calendly-wealth",
  business: "#calendly-business",
  marketing: "#calendly-marketing",
  sales: "#calendly-sales",
  "life-design": "#calendly-life-design",
  ai: "#calendly-ai",
};

const LEVEL_META: Record<LevelKey, { title: string; priceLabel: string; delivery: string }> = {
  starter: {
    title: "Level 1–2",
    priceLabel: "$97 - $297",
    delivery: "Self-directed or light guidance with clean structure",
  },
  growth: {
    title: "Level 3–4",
    priceLabel: "Application required",
    delivery: "Guided implementation with stronger accountability",
  },
  accelerator: {
    title: "Level 5",
    priceLabel: "Application required",
    delivery: "Higher-touch support inside a stronger room",
  },
  elite: {
    title: "Level 6",
    priceLabel: "Book a call",
    delivery: "Private-path support, strategic leverage, and direct access",
  },
};

function getLevelMeta(level: LevelKey) {
  return LEVEL_META[level];
}

function titleCaseFromId(id: string) {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCategoryByGoal(goal: GoalValue) {
  if (goal === "ai-tech") return "ai";
  return goal;
}

function getDefaultTrack(masterId: string, situation: SituationValue, challenge: ChallengeValue, experience: ExperienceValue): string {
  if (masterId === "wealth") {
    if (challenge === "money-clarity") return "wealth-operating-system";
    if ((situation === "investing" || experience === "advanced") && challenge !== "money-clarity") return "portfolio-strategy";
    if (situation === "scaling") return "real-estate";
    return "wealth-operating-system";
  }
  if (masterId === "business") {
    if (challenge === "system") return "operations-delivery";
    if (challenge === "income") return "revenue-systems";
    if (situation === "owner") return "financial-systems";
    if (situation === "scaling") return "leadership-team";
    return "strategy-decision-making";
  }
  if (masterId === "marketing") {
    if (challenge === "opportunities") return "attention";
    if (challenge === "system") return "capture";
    if (challenge === "stuck") return "lead-activation";
    return "nurture";
  }
  if (masterId === "sales") {
    if (challenge === "opportunities") return "lead-handling-qualification";
    if (challenge === "income") return "conversion";
    if (challenge === "system") return "sales-systems-scaling";
    return "sales-skills-communication";
  }
  if (masterId === "life-design") {
    if (challenge === "stuck") return "life-strategy-direction";
    if (challenge === "system") return "priorities-trade-offs";
    if (challenge === "income") return "income-path-selection";
    return "time-lifestyle-design";
  }
  return "ai-workflows";
}

function getLevelFromQualifier(experience: ExperienceValue, commitment: CommitmentValue): LevelKey {
  if (experience === "beginner" && commitment === "self-directed") return "starter";
  if (experience === "beginner" && commitment === "guided") return "starter";
  if (experience === "some" && commitment === "self-directed") return "growth";
  if (experience === "some" && commitment === "guided") return "growth";
  if (experience === "advanced" && commitment === "guided") return "accelerator";
  if (experience === "advanced" && commitment === "high-level") return "elite";
  if (commitment === "high-level") return "accelerator";
  return "growth";
}

function getCtaFromLevel(level: LevelKey): CtaType {
  if (level === "starter") return "buy";
  if (level === "growth") return "apply";
  if (level === "accelerator") return "apply";
  return "book_call";
}

function buildLearnMore(masterId: string, activeProgramId: string, level: LevelKey) {
  const categoryLabel = titleCaseFromId(masterId);
  const programLabel = titleCaseFromId(activeProgramId);

  if (level === "starter") {
    return {
      title: `${programLabel} is the cleanest entry into ${categoryLabel}.`,
      body: "This is for people who need a clear starting point, a better operating rhythm, and enough structure to stop reacting and start building.",
      bullets: [
        "Who it is for: people who need clarity and a clean starting point",
        "What is included: structured roadmap, clear priorities, and guided next steps",
        "Expected outcome: less confusion, more traction, and a better operating standard",
        "Delivery format: self-directed or light-guidance experience",
      ],
      unlocks: "You stop circling the problem and start moving through a defined system with more control.",
      note: "Best for people who need to build consistency before stepping into more advanced support.",
    };
  }
  if (level === "growth") {
    return {
      title: `${programLabel} is where you build real control.`,
      body: "This level is for people who already know their issue is not information. They need better structure, stronger execution, and a system that compounds.",
      bullets: [
        "Who it is for: people with some traction who need stronger execution",
        "What is included: guided implementation, accountability, and cleaner system thinking",
        "Expected outcome: more consistency, better decisions, and measurable progress",
        "Delivery format: guided program with stronger support",
      ],
      unlocks: "You move from inconsistent effort to repeatable execution that actually compounds over time.",
      note: "Best for builders who are done improvising and ready to operate with more discipline.",
    };
  }
  if (level === "accelerator") {
    return {
      title: `${programLabel} is for operators ready for a stronger room.`,
      body: "This level is for people who already have movement and now need sharper feedback, stronger support, and a more serious growth environment.",
      bullets: [
        "Who it is for: people with momentum who need stronger support and sharper decisions",
        "What is included: higher-touch guidance, better feedback loops, and elevated standards",
        "Expected outcome: faster growth with more precision and less waste",
        "Delivery format: selective program with application-based entry",
      ],
      unlocks: "You upgrade not only the system, but the room, feedback, and pressure shaping your next stage.",
      note: "Best for people who need more than content and are ready for a more serious growth environment.",
    };
  }
  return {
    title: `${programLabel} is a private-path recommendation.`,
    body: "This level is for people whose next move depends on leverage, environment, and strategic access more than generic information.",
    bullets: [
      "Who it is for: leaders facing more consequential decisions",
      "What is included: strategic guidance, tailored support, and high-context access",
      "Expected outcome: better leverage, faster clarity, and cleaner execution at a higher level",
      "Delivery format: book a call and shape the right private path",
    ],
    unlocks: "You step into a room where the quality of thinking, support, and leverage matches the growth you are trying to create.",
    note: "Best for serious operators who need a more selective, higher-context next step.",
  };
}

function buildRecommendationFromPlan(params: {
  goal: GoalValue;
  situation: SituationValue;
  challenge: ChallengeValue;
  experience: ExperienceValue;
  commitment: CommitmentValue;
}): Recommendation {
  const { goal, situation, challenge, experience, commitment } = params;
  const masterId = getCategoryByGoal(goal);
  const activeProgramId = getDefaultTrack(masterId, situation, challenge, experience);
  const level = getLevelFromQualifier(experience, commitment);
  const cta = getCtaFromLevel(level);
  const levelMeta = getLevelMeta(level);
  const learnMore = buildLearnMore(masterId, activeProgramId, level);

  return {
    masterId,
    activeProgramId,
    level,
    cta,
    title: "Here’s Your Next Step",
    summary: `${titleCaseFromId(activeProgramId)} — ${levelMeta.title}`,
    outcome: learnMore.unlocks,
    whyFits: `Based on your answers, you need ${challenge === "money-clarity" ? "clarity and control" : challenge === "system" ? "stronger systems and cleaner execution" : challenge === "opportunities" ? "better opportunities and a more structured path" : challenge === "income" ? "a more direct route to better performance" : "a more defined path with better support"} before jumping to a more advanced move.`,
    delivery: levelMeta.delivery,
    priceLabel: levelMeta.priceLabel,
    unlocks: learnMore.unlocks,
    learnMoreTitle: learnMore.title,
    learnMoreBody: learnMore.body,
    bullets: learnMore.bullets,
    note: learnMore.note,
  };
}

function getRouteHref(rec: Recommendation) {
  if (rec.cta === "buy") return PAYMENT_LINKS[`${rec.masterId}:${rec.level}`] ?? "#stripe-default";
  if (rec.cta === "apply") return APPLICATION_LINKS[rec.masterId] ?? "#tally-default";
  if (rec.cta === "book_call") return CALL_LINKS[rec.masterId] ?? "#calendly-default";
  return "#waitlist-default";
}

function getRouteLabel(cta: CtaType) {
  switch (cta) {
    case "buy":
      return "Buy Now";
    case "apply":
      return "Apply";
    case "book_call":
      return "Book a Call";
    case "waitlist":
      return "Join the Waitlist";
  }
}

function stepTitle(step: number) {
  switch (step) {
    case 0:
      return "What are you trying to improve?";
    case 1:
      return "Where are you right now?";
    case 2:
      return "What is the biggest issue?";
    case 3:
      return "How experienced are you?";
    default:
      return "How do you want to move?";
  }
}

function sectionCardStyle(active: boolean) {
  return {
    border: active ? "1px solid #111" : "1px solid #e5e7eb",
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#111",
    borderRadius: 9999,
    padding: "10px 16px",
    fontSize: 14,
    cursor: "pointer" as const,
    transition: "all 0.2s ease",
  };
}

function pageStyles() {
  return `
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #fff; color: #111; }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
    .container-narrow { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    .section { border-bottom: 1px solid #e5e7eb; }
    .hero { text-align: center; padding: 96px 24px; }
    .badge { display: inline-block; font-size: 12px; border: 1px solid #e5e7eb; border-radius: 9999px; padding: 6px 12px; }
    .h1 { font-size: clamp(40px, 7vw, 64px); line-height: 1.05; font-weight: 700; margin: 28px 0 0; }
    .h2 { font-size: clamp(28px, 4vw, 40px); line-height: 1.1; font-weight: 700; margin: 0; }
    .sub { font-size: 18px; color: #555; max-width: 760px; margin: 24px auto 0; line-height: 1.6; }
    .pill-grid { display: grid; gap: 12px; }
    .pill-grid-3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .card-grid-3 { display: grid; gap: 24px; grid-template-columns: repeat(3, minmax(0,1fr)); }
    .card-grid-4 { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0,1fr)); }
    .card-grid-2 { display: grid; gap: 32px; grid-template-columns: repeat(2, minmax(0,1fr)); }
    .button-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 40px; }
    .btn { border: 1px solid #111; background: #111; color: #fff; border-radius: 9999px; padding: 14px 24px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn-secondary { border: 1px solid #d1d5db; background: #fff; color: #111; }
    .card { border: 1px solid #e5e7eb; border-radius: 32px; background: #fff; }
    .card-soft { border: 1px solid #e5e7eb; border-radius: 24px; background: #fafafa; }
    .card-pad-lg { padding: 28px; }
    .card-pad-md { padding: 20px; }
    .muted { color: #6b7280; }
    .small { font-size: 14px; }
    .tiny { font-size: 12px; }
    .section-pad { padding: 64px 0; }
    .mb-12 { margin-bottom: 48px; }
    .mt-8 { margin-top: 32px; }
    .mt-6 { margin-top: 24px; }
    .mt-4 { margin-top: 16px; }
    .mt-3 { margin-top: 12px; }
    .title-xl { font-size: 32px; font-weight: 700; }
    .title-lg { font-size: 24px; font-weight: 700; }
    .title-md { font-size: 20px; font-weight: 700; }
    .title-sm { font-size: 18px; font-weight: 700; }
    .inline-list { display: flex; flex-wrap: wrap; gap: 12px; }
    .progress-wrap { margin-top: 24px; max-width: 520px; }
    .progress-bar { width: 100%; height: 10px; border-radius: 999px; background: #eee; overflow: hidden; }
    .progress-fill { height: 100%; background: #111; }
    .space-y > * + * { margin-top: 8px; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.32); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 50; }
    .modal { width: 100%; max-height: 90vh; overflow: auto; background: #fff; border-radius: 32px; border: 1px solid #e5e7eb; }
    .modal-sm { max-width: 580px; }
    .modal-lg { max-width: 860px; }
    .modal-header { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #e5e7eb; padding: 20px 24px; display: flex; justify-content: space-between; gap: 16px; z-index: 5; }
    .modal-body { padding: 24px; }
    .close-btn { border: 1px solid #d1d5db; background: #fff; border-radius: 999px; width: 36px; height: 36px; cursor: pointer; }
    .option-list { display: grid; gap: 12px; }
    .option-btn { width: 100%; text-align: left; border: 1px solid #e5e7eb; background: #fff; border-radius: 20px; padding: 16px; font-size: 14px; cursor: pointer; }
    .option-btn.active { background: #111; color: #fff; border-color: #111; }
    .two-col { display: grid; gap: 40px; grid-template-columns: 1.1fr 0.9fr; }
    .info-grid-3 { display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0,1fr)); }
    .input-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    select { width: 100%; border: 1px solid #d1d5db; border-radius: 16px; padding: 12px 14px; background: #fff; font-size: 14px; }
    @media (max-width: 900px) {
      .pill-grid-3, .card-grid-3, .card-grid-4, .card-grid-2, .two-col, .info-grid-3 { grid-template-columns: 1fr; }
      .hero { padding: 72px 24px; }
    }
  `;
}

export default function LandingPageV4() {
  const recommendationRef = useRef<HTMLDivElement | null>(null);

  const [selectedMasterId, setSelectedMasterId] = useState<string>(MASTER_CATEGORIES[0].id);
  const [selectedPrimaryId, setSelectedPrimaryId] = useState<string>(MASTER_CATEGORIES[0].primaryPrograms[0].id);
  const [selectedSupportId, setSelectedSupportId] = useState<string>("");
  const [levelOverride, setLevelOverride] = useState<LevelKey | null>(null);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [goal, setGoal] = useState<GoalValue>("wealth");
  const [situation, setSituation] = useState<SituationValue>("early");
  const [challenge, setChallenge] = useState<ChallengeValue>("money-clarity");
  const [experience, setExperience] = useState<ExperienceValue>("beginner");
  const [commitment, setCommitment] = useState<CommitmentValue>("guided");

  const [activeRecommendation, setActiveRecommendation] = useState<Recommendation>(() =>
    buildRecommendationFromPlan({
      goal: "wealth",
      situation: "early",
      challenge: "money-clarity",
      experience: "beginner",
      commitment: "guided",
    })
  );

  const selectedMaster = useMemo(() => MASTER_CATEGORIES.find((m) => m.id === selectedMasterId)!, [selectedMasterId]);

  useEffect(() => {
    const nextPrimary = selectedMaster.primaryPrograms[0];
    setSelectedPrimaryId((prev) => {
      if (prev && selectedMaster.primaryPrograms.some((p) => p.id === prev)) return prev;
      return nextPrimary?.id ?? "";
    });
  }, [selectedMaster]);

  const activeProgramId = selectedSupportId || selectedPrimaryId;

  const explorerRecommendation = useMemo(() => {
    const base = buildRecommendationFromPlan({ goal, situation, challenge, experience, commitment });
    const desiredLevel = levelOverride || base.level;
    if (desiredLevel === base.level && base.masterId === selectedMasterId && base.activeProgramId === activeProgramId) {
      return activeRecommendation;
    }
    const levelMeta = getLevelMeta(desiredLevel);
    const learnMore = buildLearnMore(selectedMasterId, activeProgramId, desiredLevel);
    return {
      ...activeRecommendation,
      masterId: selectedMasterId,
      activeProgramId,
      level: desiredLevel,
      cta: getCtaFromLevel(desiredLevel),
      summary: `${titleCaseFromId(activeProgramId)} — ${levelMeta.title}`,
      delivery: levelMeta.delivery,
      priceLabel: levelMeta.priceLabel,
      unlocks: learnMore.unlocks,
      learnMoreTitle: learnMore.title,
      learnMoreBody: learnMore.body,
      bullets: learnMore.bullets,
      note: learnMore.note,
    };
  }, [activeRecommendation, activeProgramId, challenge, commitment, experience, goal, levelOverride, selectedMasterId, situation]);

  const routeHref = getRouteHref(explorerRecommendation);
  const routeLabel = getRouteLabel(explorerRecommendation.cta);

  const progressValue = useMemo(() => {
    const map = { starter: 25, growth: 55, accelerator: 80, elite: 100 } as const;
    return map[explorerRecommendation.level];
  }, [explorerRecommendation.level]);

  const levels = [
    { label: "Level 1", title: "Entry", desc: "Start with a self-guided system you can move through on your own.", sub: "For people who want structure, community, and recorded guidance before stepping into live execution." },
    { label: "Level 2", title: "Foundation", desc: "Build your first real execution system.", sub: "For people who are done improvising and ready to build real structure." },
    { label: "Level 3", title: "Control", desc: "Gain visibility and eliminate chaos.", sub: "For operators who need consistency, control, and cleaner execution." },
    { label: "Level 4", title: "Execution", desc: "Turn structure into real performance.", sub: "For builders ready to convert effort into measurable outcomes." },
    { label: "Level 5", title: "Acceleration", desc: "Operate with high-level peers.", sub: "For serious performers who want stronger rooms, sharper thinking, and faster growth." },
    { label: "Level 6", title: "Expansion", desc: "Enter rooms most people never access.", sub: "For leaders ready for elite environments, advanced strategy, and direct access to top experts." },
  ];

  const openPlanModal = () => {
    setCurrentStep(0);
    setPlanModalOpen(true);
  };

  const applyPlanRecommendation = () => {
    const recommendation = buildRecommendationFromPlan({ goal, situation, challenge, experience, commitment });
    setActiveRecommendation(recommendation);
    setSelectedMasterId(recommendation.masterId);
    setSelectedPrimaryId(recommendation.activeProgramId);
    setSelectedSupportId("");
    setLevelOverride(recommendation.level);
    setPlanModalOpen(false);
    setTimeout(() => {
      recommendationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const renderStepOptions = () => {
    if (currentStep === 0) {
      const options: { value: GoalValue; label: string }[] = [
        { value: "wealth", label: "Build wealth" },
        { value: "business", label: "Grow a business" },
        { value: "marketing", label: "Get more customers" },
        { value: "sales", label: "Improve sales performance" },
        { value: "life-design", label: "Create more freedom in my life" },
        { value: "ai-tech", label: "Use AI / tech better" },
      ];
      return options.map((option) => (
        <button key={option.value} type="button" onClick={() => { setGoal(option.value); setCurrentStep(1); }} className={`option-btn ${goal === option.value ? "active" : ""}`}>
          {option.label}
        </button>
      ));
    }
    if (currentStep === 1) {
      const options: { value: SituationValue; label: string }[] = [
        { value: "early", label: "Early stage / no structure" },
        { value: "stable", label: "Stable income" },
        { value: "owner", label: "Business owner" },
        { value: "investing", label: "Already investing" },
        { value: "scaling", label: "Scaling" },
      ];
      return options.map((option) => (
        <button key={option.value} type="button" onClick={() => { setSituation(option.value); setCurrentStep(2); }} className={`option-btn ${situation === option.value ? "active" : ""}`}>
          {option.label}
        </button>
      ));
    }
    if (currentStep === 2) {
      const options: { value: ChallengeValue; label: string }[] = [
        { value: "money-clarity", label: "I do not know where my money is going" },
        { value: "income", label: "I do not have enough income" },
        { value: "system", label: "I do not have a system" },
        { value: "opportunities", label: "I do not have enough opportunities" },
        { value: "stuck", label: "I feel stuck / not progressing" },
      ];
      return options.map((option) => (
        <button key={option.value} type="button" onClick={() => { setChallenge(option.value); setCurrentStep(3); }} className={`option-btn ${challenge === option.value ? "active" : ""}`}>
          {option.label}
        </button>
      ));
    }
    if (currentStep === 3) {
      const options: { value: ExperienceValue; label: string }[] = [
        { value: "beginner", label: "Beginner" },
        { value: "some", label: "Some experience" },
        { value: "advanced", label: "Advanced" },
      ];
      return options.map((option) => (
        <button key={option.value} type="button" onClick={() => { setExperience(option.value); setCurrentStep(4); }} className={`option-btn ${experience === option.value ? "active" : ""}`}>
          {option.label}
        </button>
      ));
    }
    const options: { value: CommitmentValue; label: string }[] = [
      { value: "self-directed", label: "Self-directed" },
      { value: "guided", label: "Guided program" },
      { value: "high-level", label: "High-level / fast results" },
    ];
    return options.map((option) => (
      <button key={option.value} type="button" onClick={() => setCommitment(option.value)} className={`option-btn ${commitment === option.value ? "active" : ""}`}>
        {option.label}
      </button>
    ));
  };

  return (
    <>
      <style>{pageStyles()}</style>
      <div className="min-h-screen">
        <section className="section">
          <div className="container-narrow hero">
            <div className="badge">D3 Growth Performance Systems</div>
            <h1 className="h1">
              Stop guessing your growth.
              <br />
              Start becoming the kind of operator who runs inside a system.
            </h1>
            <p className="sub">
              D3 is built for people who know more effort is not the answer. It gives you a structured path, 12-week execution cycles, and the right environment to grow into higher levels of capability, performance, and opportunity.
            </p>
            <div className="pill-grid pill-grid-3 mt-8">
              {["12-week execution cycles", "Clear progression by level", "Stronger rooms as you grow"].map((item) => (
                <div key={item} className="card-soft card-pad-md small">{item}</div>
              ))}
            </div>
            <div className="button-row">
              <button className="btn" onClick={openPlanModal}>Get My Plan</button>
              <a href="#progression" className="btn btn-secondary">Explore Systems</a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container section-pad" style={{textAlign:"center"}}>
            <h2 className="h2">Why D3 Feels Different</h2>
            <div className="card-grid-4 mt-8">
              {[
                "It is structured around execution, not inspiration.",
                "It gives people a path, not just information.",
                "It increases sophistication over time.",
                "It upgrades both capability and environment.",
              ].map((item) => (
                <div key={item} className="card-soft card-pad-md small">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section id="progression" className="section">
          <div className="container section-pad">
            <div className="mb-12" style={{maxWidth:760}}>
              <h2 className="h2">How You Progress</h2>
              <p className="sub" style={{margin:"12px 0 0", maxWidth:"none"}}>
                The engine stays the same. What changes is the depth of thinking, the quality of discussion, and the environment you grow inside.
              </p>
            </div>
            <div className="card-grid-3">
              {levels.map((lvl, idx) => {
                const isActive =
                  (explorerRecommendation.level === "starter" && idx <= 1) ||
                  (explorerRecommendation.level === "growth" && idx >= 2 && idx <= 3) ||
                  (explorerRecommendation.level === "accelerator" && idx === 4) ||
                  (explorerRecommendation.level === "elite" && idx === 5);
                return (
                  <div key={lvl.title} className="card" style={{background:isActive ? "#fafafa" : "#fff", borderColor:isActive ? "#111" : "#e5e7eb"}}>
                    <div className="card-pad-md">
                      <div className="tiny muted">{lvl.label}</div>
                      <div className="title-lg mt-3">{lvl.title}</div>
                      <div className="mt-3" style={{fontSize:16, lineHeight:1.5}}>{lvl.desc}</div>
                      <div className="mt-4 small muted" style={{lineHeight:1.6}}>{lvl.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-narrow section-pad" style={{textAlign:"center"}}>
            <div className="small muted">Get Your Plan</div>
            <h2 className="h2 mt-3">Not sure where to start?</h2>
            <p className="sub">We will place you into the right system, level, and next step in under 30 seconds.</p>
            <div className="mt-8">
              <button className="btn" onClick={openPlanModal}>Get My Plan</button>
            </div>
          </div>
        </section>

        <section id="recommendation" ref={recommendationRef} className="section">
          <div className="container section-pad">
            <div className="two-col">
              <div>
                <div className="small muted">Your roadmap</div>
                <h2 className="h2 mt-3">{activeRecommendation.title}</h2>
                <div className="title-md mt-4">{activeRecommendation.summary}</div>
                <p className="sub" style={{margin:"16px 0 0", maxWidth:"none"}}>{activeRecommendation.outcome}</p>
                <div className="card-soft card-pad-md mt-6">
                  <div className="small muted">Why this fits</div>
                  <div className="mt-3 small" style={{lineHeight:1.6}}>{activeRecommendation.whyFits}</div>
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${progressValue}%`}} />
                  </div>
                  <div className="tiny muted" style={{display:"flex", justifyContent:"space-between", marginTop:8}}>
                    <span>Starter</span><span>Growth</span><span>Accelerator</span><span>Elite</span>
                  </div>
                </div>
                <div className="button-row" style={{justifyContent:"flex-start"}}>
                  <a href={routeHref} className="btn">{routeLabel}</a>
                  <button className="btn btn-secondary" onClick={() => setAdvancedModalOpen(true)}>Refine My Plan</button>
                </div>
              </div>
              <div className="card">
                <div className="card-pad-lg">
                  <div className="small muted">Learn more</div>
                  <div className="title-lg mt-3">{explorerRecommendation.learnMoreTitle}</div>
                  <div className="mt-4 small" style={{lineHeight:1.7, color:"#4b5563"}}>{explorerRecommendation.learnMoreBody}</div>
                  <div className="space-y mt-6">
                    {explorerRecommendation.bullets.map((item) => (
                      <div key={item} className="small" style={{display:"flex", gap:8, lineHeight:1.6}}>
                        <span>•</span><span>{item}</span>
                      </div>
                    ))}
                  </div>
                  {explorerRecommendation.note ? <div className="tiny muted mt-4">{explorerRecommendation.note}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container section-pad">
            <div style={{maxWidth:760}}>
              <div className="small muted">Already know what you need?</div>
              <h2 className="h2 mt-3">Refine the recommendation or explore other paths.</h2>
              <p className="sub" style={{margin:"16px 0 0", maxWidth:"none"}}>Your recommended category, track, and level are already selected. You can adjust this if needed.</p>
            </div>

            <div className="inline-list mt-8">
              {MASTER_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  style={sectionCardStyle(selectedMasterId === item.id)}
                  onClick={() => {
                    setSelectedMasterId(item.id);
                    setSelectedSupportId("");
                    setSelectedPrimaryId(item.primaryPrograms[0]?.id ?? "");
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="card-soft card-pad-lg mt-8">
              <div>
                <div className="small" style={{fontWeight:600, marginBottom:12}}>Core program</div>
                <div className="inline-list">
                  {selectedMaster.primaryPrograms.map((program) => (
                    <button
                      key={program.id}
                      style={sectionCardStyle(selectedPrimaryId === program.id && !selectedSupportId)}
                      onClick={() => {
                        setSelectedPrimaryId(program.id);
                        setSelectedSupportId("");
                      }}
                    >
                      {program.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="small" style={{fontWeight:600, marginBottom:12}}>Support program</div>
                <div className="inline-list">
                  {selectedMaster.supportPrograms?.map((program) => (
                    <button
                      key={program.id}
                      style={sectionCardStyle(selectedSupportId === program.id)}
                      onClick={() => {
                        setSelectedSupportId(program.id);
                        setSelectedPrimaryId("");
                      }}
                    >
                      {program.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6" style={{maxWidth:280}}>
                <label className="input-label">Recommended level</label>
                <select value={levelOverride || activeRecommendation.level} onChange={(e) => setLevelOverride(e.target.value as LevelKey)}>
                  <option value="starter">Level 1–2</option>
                  <option value="growth">Level 3–4</option>
                  <option value="accelerator">Level 5</option>
                  <option value="elite">Level 6</option>
                </select>
              </div>

              <div className="button-row" style={{justifyContent:"flex-start", marginTop:24}}>
                <a href={routeHref} className="btn">{routeLabel}</a>
                <button className="btn btn-secondary" onClick={() => setAdvancedModalOpen(true)}>Advanced Adjustments</button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container section-pad">
            <div className="card-grid-2">
              <div className="card">
                <div className="card-pad-lg">
                  <div className="title-lg">What happens next</div>
                  <div className="mt-4 small muted" style={{lineHeight:1.6}}>Once you are placed, the next step routes you into the right buying, application, or call flow without breaking the landing-page experience.</div>
                  <div className="space-y mt-6 small">
                    <div>Buy Now → Stripe</div>
                    <div>Apply → Tally</div>
                    <div>Book a Call → Calendly</div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-pad-lg">
                  <div className="title-lg">Program explorer</div>
                  <div className="mt-4 small muted" style={{lineHeight:1.6}}>As you explore other tracks or levels, the Learn More panel updates so you can understand what changes before you commit.</div>
                  <div className="card-soft card-pad-md mt-6 small">You are not stuck with the first recommendation. The system guides first, then gives you control.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {planModalOpen ? (
          <div className="modal-backdrop" onClick={() => setPlanModalOpen(false)}>
            <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="title-md">Get My Plan</div>
                  <div className="small muted mt-3">This is a personalized roadmap generator, not a quiz. We will identify the right starting point and next step.</div>
                  <div className="tiny muted mt-3">Step {currentStep + 1} of 5</div>
                </div>
                <button className="close-btn" onClick={() => setPlanModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${((currentStep + 1) / 5) * 100}%`}} />
                </div>
                <div className="mt-6">
                  <div className="title-lg">{stepTitle(currentStep)}</div>
                  <div className="small muted mt-3">
                    {currentStep === 0 && "Choose the area where the real improvement matters most right now."}
                    {currentStep === 1 && "Be honest about your current situation so the recommendation stays accurate."}
                    {currentStep === 2 && "Pick the issue that is actually slowing you down the most."}
                    {currentStep === 3 && "Answer based on your real experience, not your ambition."}
                    {currentStep === 4 && "This helps us decide the right pace, support, and next step."}
                  </div>
                </div>
                <div className="option-list mt-6">{renderStepOptions()}</div>
                <div className="button-row" style={{justifyContent:"space-between", marginTop:24}}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0}>
                    <ChevronLeft style={{width:16,height:16,verticalAlign:"middle",marginRight:6}} /> Back
                  </button>
                  {currentStep < 4 ? (
                    <button className="btn" onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}>
                      Continue <ChevronRight style={{width:16,height:16,verticalAlign:"middle",marginLeft:6}} />
                    </button>
                  ) : (
                    <button className="btn" onClick={applyPlanRecommendation}>
                      See My Plan <ChevronRight style={{width:16,height:16,verticalAlign:"middle",marginLeft:6}} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {advancedModalOpen ? (
          <div className="modal-backdrop" onClick={() => setAdvancedModalOpen(false)}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="title-md">Advanced Adjustments</div>
                  <div className="small muted mt-3">Use this if you already know how you want to refine the recommendation.</div>
                </div>
                <button className="close-btn" onClick={() => setAdvancedModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="card-soft card-pad-md small">This is the power-user view. It is here if you want tighter control over the plan.</div>
                <div className="card-grid-2 mt-6">
                  <div>
                    <label className="input-label">Category</label>
                    <select value={selectedMasterId} onChange={(e) => setSelectedMasterId(e.target.value)}>
                      {MASTER_CATEGORIES.map((item) => (
                        <option key={item.id} value={item.id}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Level</label>
                    <select value={levelOverride || activeRecommendation.level} onChange={(e) => setLevelOverride(e.target.value as LevelKey)}>
                      <option value="starter">Level 1–2</option>
                      <option value="growth">Level 3–4</option>
                      <option value="accelerator">Level 5</option>
                      <option value="elite">Level 6</option>
                    </select>
                  </div>
                </div>
                <div className="card mt-6">
                  <div className="card-pad-md">
                    <div className="small muted">Preview</div>
                    <div className="title-md mt-3">{explorerRecommendation.summary}</div>
                    <div className="mt-3 small" style={{lineHeight:1.6}}>{explorerRecommendation.learnMoreBody}</div>
                  </div>
                </div>
                <div className="button-row" style={{justifyContent:"flex-start"}}>
                  <button className="btn" onClick={() => setAdvancedModalOpen(false)}>Use These Changes</button>
                  <a href={routeHref} className="btn">{routeLabel}</a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
