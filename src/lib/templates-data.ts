export interface Template { id: string; slug: string; name: string; title: string; description: string; category: string; icon: string; isPremium: boolean; rating: number; usageCount: number; image: string; createdAt: string; }

export interface TemplateDetail extends Template { overview: string; bestSuitedFor: string[]; tone: string; estimatedWords: string; aiModel: string; modelDisplayName: string; sampleOutput: string; }

export const templatesDb: Template[] = [
  // ==================== BLOG (12) ====================
  {
    id: "tpl-blog-1",
    slug: "precision-article-composer",
    name: "Precision Article Composer",
    title: "Precision Article Composer",
    description: "Write clean, comprehensive technical publications and reports with academic rigor.",
    category: "Blog",
    icon: "FileText",
    isPremium: true,
    rating: 4.8,
    usageCount: 9300,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-24T10:00:00.000Z"
  },
  {
    id: "tpl-blog-2",
    slug: "seo-pillar-strategist",
    name: "SEO Pillar Article Strategist",
    title: "SEO Pillar Article Strategist",
    description: "Structure search-optimized longform pillar posts that map key semantic web keywords.",
    category: "Blog",
    icon: "FileText",
    isPremium: false,
    rating: 4.6,
    usageCount: 14200,
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-20T12:00:00.000Z"
  },
  {
    id: "tpl-blog-3",
    slug: "tech-innovation-outline",
    name: "Tech Innovation Blueprint",
    title: "Tech Innovation Blueprint",
    description: "Draft detailed blueprints and semantic structures for emerging technology platforms.",
    category: "Blog",
    icon: "FileText",
    isPremium: true,
    rating: 4.9,
    usageCount: 18100,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-22T08:00:00.000Z"
  },
  {
    id: "tpl-blog-4",
    slug: "creative-essay-analyst",
    name: "Creative Essay Analyst",
    title: "Creative Essay Analyst",
    description: "Generate deep cultural analyses and critiques detailing layout geometry and Swiss design.",
    category: "Blog",
    icon: "FileText",
    isPremium: false,
    rating: 4.3,
    usageCount: 5200,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-18T14:30:00.000Z"
  },
  {
    id: "tpl-blog-5",
    slug: "saas-velocity-composer",
    name: "SaaS Product Comparison",
    title: "SaaS Product Comparison",
    description: "Write conversion-focused alternative guides comparing features, APIs, and pricing modules.",
    category: "Blog",
    icon: "FileText",
    isPremium: true,
    rating: 4.7,
    usageCount: 11300,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-15T09:00:00.000Z"
  },
  {
    id: "tpl-blog-6",
    slug: "industry-insight-generator",
    name: "Industry Insight Generator",
    title: "Industry Insight Generator",
    description: "Synthesize macro-economic trends and tech cycles into readable newsletter blog updates.",
    category: "Blog",
    icon: "FileText",
    isPremium: false,
    rating: 4.4,
    usageCount: 8100,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-10T11:15:00.000Z"
  },
  {
    id: "tpl-blog-7",
    slug: "tutorial-how-to-scribe",
    name: "Developer Tutorial Scribe",
    title: "Developer Tutorial Scribe",
    description: "Write highly detailed step-by-step developer guides complete with code architecture layouts.",
    category: "Blog",
    icon: "FileText",
    isPremium: true,
    rating: 4.9,
    usageCount: 12500,
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-12T16:45:00.000Z"
  },
  {
    id: "tpl-blog-8",
    slug: "lifestyle-trend-writer",
    name: "Lifestyle & Trend Writer",
    title: "Lifestyle & Trend Writer",
    description: "Draft engaging listicles, trend reviews, and modern lifestyle content with dynamic spacing.",
    category: "Blog",
    icon: "FileText",
    isPremium: false,
    rating: 4.1,
    usageCount: 3400,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-05T13:20:00.000Z"
  },
  {
    id: "tpl-blog-9",
    slug: "case-study-narrator",
    name: "Case Study Narrator",
    title: "Case Study Narrator",
    description: "Construct persuasive customer success stories highlighting metrics, metrics, and outcomes.",
    category: "Blog",
    icon: "FileText",
    isPremium: true,
    rating: 4.7,
    usageCount: 15400,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-08T10:00:00.000Z"
  },
  {
    id: "tpl-blog-10",
    slug: "interview-transcriber",
    name: "Executive Interview Scribe",
    title: "Executive Interview Scribe",
    description: "Convert transcript files and conversations into structured Q&A interviews with key takeouts.",
    category: "Blog",
    icon: "FileText",
    isPremium: false,
    rating: 3.8,
    usageCount: 2200,
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-01T09:30:00.000Z"
  },
  {
    id: "tpl-blog-11",
    slug: "thought-leadership-ghost",
    name: "Thought Leadership Ghostwriter",
    title: "Thought Leadership Ghostwriter",
    description: "Compose strong personal stories and authority content targeted for professional platforms.",
    category: "Blog",
    icon: "FileText",
    isPremium: true,
    rating: 4.8,
    usageCount: 24500,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-03T15:00:00.000Z"
  },
  {
    id: "tpl-blog-12",
    slug: "hiring-culture-composer",
    name: "Corporate Culture Blueprint",
    title: "Corporate Culture Blueprint",
    description: "Draft internal newsletters, alignment values guides, and hiring announcements cleanly.",
    category: "Blog",
    icon: "FileText",
    isPremium: false,
    rating: 3.9,
    usageCount: 1600,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-28T11:00:00.000Z"
  },

  // ==================== SOCIAL MEDIA (12) ====================
  {
    id: "tpl-soc-1",
    slug: "strategic-tech-lead",
    name: "Strategic Tech Lead Insight",
    title: "Strategic Tech Lead Insight",
    description: "Generate high-engagement industrial insights for executive professional networks.",
    category: "Social",
    icon: "Sparkles",
    isPremium: true,
    rating: 4.7,
    usageCount: 22000,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-23T11:00:00.000Z"
  },
  {
    id: "tpl-soc-2",
    slug: "micro-manifesto-pitch",
    name: "Micro-Manifesto Tweet",
    title: "Micro-Manifesto Tweet",
    description: "Formulate crisp, punchy announcements asserting absolute product and speed dominance.",
    category: "Social",
    icon: "Sparkles",
    isPremium: false,
    rating: 4.9,
    usageCount: 18500,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-21T09:40:00.000Z"
  },
  {
    id: "tpl-soc-3",
    slug: "community-builder-thread",
    name: "Community Builder Thread",
    title: "Community Builder Thread",
    description: "Format interactive step guides on building robust developer interfaces and forms.",
    category: "Social",
    icon: "Sparkles",
    isPremium: false,
    rating: 4.5,
    usageCount: 8900,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-19T13:10:00.000Z"
  },
  {
    id: "tpl-soc-4",
    slug: "product-launch-teaser",
    name: "Product Launch Teaser",
    title: "Product Launch Teaser",
    description: "Create hype and anticipation for upcoming software platform deployments.",
    category: "Social",
    icon: "Sparkles",
    isPremium: true,
    rating: 4.6,
    usageCount: 12100,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-14T08:15:00.000Z"
  },
  {
    id: "tpl-soc-5",
    slug: "viral-framework-analyst",
    name: "Viral Framework Analyst",
    title: "Viral Framework Analyst",
    description: "Write analytical breakdowns of tech stacks that prompt heavy debates and retweets.",
    category: "Social",
    icon: "Sparkles",
    isPremium: false,
    rating: 4.2,
    usageCount: 30100,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-16T17:00:00.000Z"
  },
  {
    id: "tpl-soc-6",
    slug: "ama-session-promoter",
    name: "Interactive Q&A Session",
    title: "Interactive Q&A Session",
    description: "Prompt user questions, system requests, or product suggestions organically.",
    category: "Social",
    icon: "Sparkles",
    isPremium: true,
    rating: 4.4,
    usageCount: 4300,
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-07T12:00:00.000Z"
  },
  {
    id: "tpl-soc-7",
    slug: "infographic-car-script",
    name: "Carousel Graphic Script",
    title: "Carousel Graphic Script",
    description: "Write slide-by-slide copy outlines for multi-image business growth infographics.",
    category: "Social",
    icon: "Sparkles",
    isPremium: true,
    rating: 4.8,
    usageCount: 16200,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-09T09:20:00.000Z"
  },
  {
    id: "tpl-soc-8",
    slug: "memetic-marketing-node",
    name: "Memetic Marketing Node",
    title: "Memetic Marketing Node",
    description: "Generate highly relevant, industry-related comedy setups and meme copy blueprints.",
    category: "Social",
    icon: "Sparkles",
    isPremium: false,
    rating: 3.5,
    usageCount: 22000,
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-04T16:00:00.000Z"
  },
  {
    id: "tpl-soc-9",
    slug: "milestone-celebrator",
    name: "Corporate Milestone Alert",
    title: "Corporate Milestone Alert",
    description: "Celebrate user metrics, funding announcements, or corporate office expansion updates.",
    category: "Social",
    icon: "Sparkles",
    isPremium: true,
    rating: 4.7,
    usageCount: 9500,
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-02T10:10:00.000Z"
  },
  {
    id: "tpl-soc-10",
    slug: "event-livestream-hype",
    name: "Livestream Coverage Hype",
    title: "Livestream Coverage Hype",
    description: "Live-update templates prompting subscribers to join sessions or panels instantly.",
    category: "Social",
    icon: "Sparkles",
    isPremium: false,
    rating: 3.9,
    usageCount: 1300,
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-26T14:00:00.000Z"
  },
  {
    id: "tpl-soc-11",
    slug: "keynote-summary-thread",
    name: "Keynote Takeaway Synthesizer",
    title: "Keynote Takeaway Synthesizer",
    description: "Summarize major tech announcements, Apple/Google keynotes, or industry statements.",
    category: "Social",
    icon: "Sparkles",
    isPremium: true,
    rating: 4.9,
    usageCount: 28400,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-29T09:00:00.000Z"
  },
  {
    id: "tpl-soc-12",
    slug: "weekend-reflection-pitch",
    name: "Weekly Retrospective Prompt",
    title: "Weekly Retrospective Prompt",
    description: "Generate structured, inspiring weekend thoughts asking users to comment their updates.",
    category: "Social",
    icon: "Sparkles",
    isPremium: false,
    rating: 3.7,
    usageCount: 5100,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-24T15:30:00.000Z"
  },

  // ==================== EMAIL (12) ====================
  {
    id: "tpl-em-1",
    slug: "enterprise-sales-director",
    name: "Enterprise Cold Outreach",
    title: "Enterprise Cold Outreach",
    description: "Compose high-conversion cold emails targeting director-level operations leads.",
    category: "Email",
    icon: "Cpu",
    isPremium: true,
    rating: 4.8,
    usageCount: 12500,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-24T09:30:00.000Z"
  },
  {
    id: "tpl-em-2",
    slug: "changelog-dispatch",
    name: "Changelog Dispatch",
    title: "Changelog Dispatch",
    description: "Announce new updates, features, and platform fixes cleanly and efficiently.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 4.7,
    usageCount: 6300,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-20T14:00:00.000Z"
  },
  {
    id: "tpl-em-3",
    slug: "customer-welcome-track",
    name: "Customer Welcome Track",
    title: "Customer Welcome Track",
    description: "Onboard new platform accounts with engaging introductory directives.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 4.9,
    usageCount: 15400,
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-22T11:20:00.000Z"
  },
  {
    id: "tpl-em-4",
    slug: "reengagement-funnel-ping",
    name: "Churn Re-engagement Ping",
    title: "Churn Re-engagement Ping",
    description: "Re-engage dormant trial users with personalized system usage values.",
    category: "Email",
    icon: "Cpu",
    isPremium: true,
    rating: 4.4,
    usageCount: 7800,
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-13T10:45:00.000Z"
  },
  {
    id: "tpl-em-5",
    slug: "newsletter-curator",
    name: "Weekly Digest Curator",
    title: "Weekly Digest Curator",
    description: "Format high-density, readable link roundups and tech highlights.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 4.6,
    usageCount: 19800,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-17T09:00:00.000Z"
  },
  {
    id: "tpl-em-6",
    slug: "affiliate-jv-proposal",
    name: "Strategic Joint Venture Proposal",
    title: "Strategic Joint Venture Proposal",
    description: "Compose professional partnership letters requesting mutual software bundles.",
    category: "Email",
    icon: "Cpu",
    isPremium: true,
    rating: 4.3,
    usageCount: 2900,
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-11T12:00:00.000Z"
  },
  {
    id: "tpl-em-7",
    slug: "product-webinar-invite",
    name: "Product Demonstration Invite",
    title: "Product Demonstration Invite",
    description: "Promote live sandbox setups, walkthrough panels, or Q&A registrations.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 4.5,
    usageCount: 6500,
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-09T14:30:00.000Z"
  },
  {
    id: "tpl-em-8",
    slug: "feedback-survey-nps",
    name: "Feedback Survey & NPS Collector",
    title: "Feedback Survey & NPS Collector",
    description: "Politely request qualitative product suggestions or rating feedback.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 4.1,
    usageCount: 4200,
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-03T16:00:00.000Z"
  },
  {
    id: "tpl-em-9",
    slug: "black-friday-promoter",
    name: "High-Urgency Promo Email",
    title: "High-Urgency Promo Email",
    description: "Structure discount copy focused on countdowns and risk-free trial benefits.",
    category: "Email",
    icon: "Cpu",
    isPremium: true,
    rating: 4.8,
    usageCount: 31000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-06T08:00:00.000Z"
  },
  {
    id: "tpl-em-10",
    slug: "trial-expiration-countdown",
    name: "Trial Expiration Countdown",
    title: "Trial Expiration Countdown",
    description: "Remind users of impending workspace locking and prompt premium plan upgrades.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 4.2,
    usageCount: 9200,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-27T10:15:00.000Z"
  },
  {
    id: "tpl-em-11",
    slug: "support-ticket-closer",
    name: "Customer Care Ticket Closer",
    title: "Customer Care Ticket Closer",
    description: "Write helpful, warm resolution summaries that close customer issues nicely.",
    category: "Email",
    icon: "Cpu",
    isPremium: false,
    rating: 3.6,
    usageCount: 1800,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-30T15:00:00.000Z"
  },
  {
    id: "tpl-em-12",
    slug: "investor-update-memo",
    name: "Strategic Investor Retro",
    title: "Strategic Investor Retro",
    description: "Synthesize quarterly revenue parameters, milestones, and hiring maps clearly.",
    category: "Email",
    icon: "Cpu",
    isPremium: true,
    rating: 4.9,
    usageCount: 5600,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-23T11:00:00.000Z"
  },

  // ==================== AD COPY (12) ====================
  {
    id: "tpl-ad-1",
    slug: "dominant-value-prop",
    name: "Dominant Value Prop Headline",
    title: "Dominant Value Prop Headline",
    description: "Hook target audiences with extreme high-density advertising benefits.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: true,
    rating: 4.9,
    usageCount: 29000,
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-23T10:00:00.000Z"
  },
  {
    id: "tpl-ad-2",
    slug: "growth-funnel-magnet",
    name: "Growth Funnel Magnet Copy",
    title: "Growth Funnel Magnet Copy",
    description: "Persuade prospective accounts to initialize workspaces with smart risk-free CTAs.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 4.6,
    usageCount: 11000,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-21T11:30:00.000Z"
  },
  {
    id: "tpl-ad-3",
    slug: "saas-value-multiplexer",
    name: "SaaS Value Metric Ad",
    title: "SaaS Value Metric Ad",
    description: "Assert industrial authority by focusing on model speed and system reliability metrics.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 4.8,
    usageCount: 7800,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-18T09:00:00.000Z"
  },
  {
    id: "tpl-ad-4",
    slug: "google-search-adword",
    name: "AdWords Search Copy",
    title: "AdWords Search Copy",
    description: "Draft punchy Google search copy that maintains high CTR and meets character rules.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: true,
    rating: 4.5,
    usageCount: 16400,
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-14T15:20:00.000Z"
  },
  {
    id: "tpl-ad-5",
    slug: "facebook-feed-scrollstopper",
    name: "Social Feed Scrollstopper",
    title: "Social Feed Scrollstopper",
    description: "Hook casual scrollers instantly with curious and bold opening statements.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 4.4,
    usageCount: 22100,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-16T10:00:00.000Z"
  },
  {
    id: "tpl-ad-6",
    slug: "retargeting-objection-crusher",
    name: "Objection Crusher Copy",
    title: "Objection Crusher Copy",
    description: "Address pricing fears, data security concerns, or API limits dynamically.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: true,
    rating: 4.7,
    usageCount: 5400,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-08T09:10:00.000Z"
  },
  {
    id: "tpl-ad-7",
    slug: "youtube-video-outlinescript",
    name: "Pre-Roll Video Script",
    title: "Pre-Roll Video Script",
    description: "Compose high-impact 30-second scripts focusing on the first 5 seconds hook.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 4.2,
    usageCount: 3900,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-11T13:40:00.000Z"
  },
  {
    id: "tpl-ad-8",
    slug: "influencer-briefing-sheet",
    name: "Influencer Campaign Brief",
    title: "Influencer Campaign Brief",
    description: "Draft guidelines, talking points, and specific feature highlights for partners.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 3.9,
    usageCount: 1700,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-02T16:20:00.000Z"
  },
  {
    id: "tpl-ad-9",
    slug: "linkedin-promoted-memo",
    name: "Professional Sponsored Update",
    title: "Professional Sponsored Update",
    description: "Write executive B2B sponsored ads targeting business and operation metrics.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: true,
    rating: 4.8,
    usageCount: 14500,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-05-05T09:00:00.000Z"
  },
  {
    id: "tpl-ad-10",
    slug: "discount-offer-multiplier",
    name: "Discount Offer Copywriter",
    title: "Discount Offer Copywriter",
    description: "Structure limited-time seasonal promotional copies emphasizing risk-free terms.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 4.1,
    usageCount: 8600,
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-25T11:45:00.000Z"
  },
  {
    id: "tpl-ad-11",
    slug: "customer-quote-highlight",
    name: "Social Proof Highlight Ad",
    title: "Social Proof Highlight Ad",
    description: "Turn positive G2/Capterra system reviews into attractive ads featuring customer stats.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: false,
    rating: 4.6,
    usageCount: 12200,
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-29T10:00:00.000Z"
  },
  {
    id: "tpl-ad-12",
    slug: "newsletter-ad-slot",
    name: "Newsletter Sponsor Copy",
    title: "Newsletter Sponsor Copy",
    description: "Write high-density, minimal text ads designed for top developer newsletter sponsors.",
    category: "AdCopy",
    icon: "Briefcase",
    isPremium: true,
    rating: 4.7,
    usageCount: 9900,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-04-22T13:00:00.000Z"
  }
];

export interface Review {
  id: string;
  name: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RatingBar {
  stars: number;
  percent: number;
  count: number;
}

const CATEGORY_BEST_SUITED: Record<string, string[]> = {
  Blog: [
    "Content marketers and SEO specialists",
    "Technical writers and documentation teams",
    "Publishers and editorial teams",
    "Founders publishing thought leadership",
  ],
  Social: [
    "Social media managers",
    "Founders building personal brands",
    "Community managers and growth teams",
    "Marketing agencies managing client accounts",
  ],
  Email: [
    "Sales and outbound teams",
    "Customer success managers",
    "Product marketers launching features",
    "Newsletter and lifecycle marketers",
  ],
  AdCopy: [
    "Performance marketers",
    "Paid media specialists",
    "Conversion rate optimizers",
    "Agencies running multi-channel campaigns",
  ],
};

const TONE_BY_CATEGORY: Record<string, string> = {
  Blog: "Informative / Structured",
  Social: "Engaging / Concise",
  Email: "Direct / Professional",
  AdCopy: "Persuasive / High-impact",
};

const WORDS_BY_CATEGORY: Record<string, string> = {
  Blog: "1,200 – 2,500 words",
  Social: "80 – 300 words",
  Email: "150 – 400 words",
  AdCopy: "60 – 120 words",
};

const MODEL_DISPLAY: Record<string, string> = {
  "claude-sonnet": "Claude AI",
  "gpt-4o": "GPT-4o",
  "writeflow-pro": "WriteFlow Pro",
};

const REVIEW_AUTHORS = [
  { name: "Dr. Clara Mercer", initials: "CM" },
  { name: "Julian Haas", initials: "JH" },
  { name: "Markus Vane", initials: "MV" },
  { name: "Sarah Chen", initials: "SC" },
  { name: "Elena Rodriguez", initials: "ER" },
  { name: "James Okonkwo", initials: "JO" },
  { name: "Priya Nair", initials: "PN" },
  { name: "Tom Bradley", initials: "TB" },
];

const REVIEW_COMMENTS = [
  "Outstanding output quality. The structure and tone matched exactly what I needed for our campaign.",
  "Saves hours every week. The generated copy is polished and requires minimal editing.",
  "Best template I've used on the platform. Logical flow and precision are unmatched.",
  "Highly recommend for teams that need consistent, professional content at scale.",
  "The AI sample output was spot-on. Used it as a starting point and published within an hour.",
  "Clean formatting and strong hooks. Perfect for our B2B audience.",
  "Minor tweaks needed but overall exceptional. Will use again for similar projects.",
];

export function mapCategoryToFrontend(category: string): string {
  if (category === "Social") return "Social Media";
  if (category === "AdCopy") return "Ad Copy";
  return category;
}

export function mapCategoryToApi(category: string): string {
  if (category === "Social Media") return "Social";
  if (category === "Ad Copy") return "AdCopy";
  return category;
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return templatesDb.find((t) => t.slug === slug);
}

function buildSampleOutput(template: Template): string {
  return `${template.name.toUpperCase()} — SAMPLE OUTPUT

${template.description}

This content was generated using structured prompt engineering optimized for ${mapCategoryToFrontend(template.category)} workflows. Output adheres to tone guidelines and length targets configured for this template.

Key highlights:
• Clear hierarchical structure
• Audience-appropriate vocabulary
• Actionable closing statements
• Ready for light editorial polish`;
}

export function enrichTemplateDetail(template: Template): TemplateDetail {
  return {
    ...template,
    overview: `${template.description} This template is engineered for ${mapCategoryToFrontend(template.category)} workflows, delivering consistent structure, tone, and length with every generation.`,
    bestSuitedFor: CATEGORY_BEST_SUITED[template.category] ?? CATEGORY_BEST_SUITED.Blog,
    tone: TONE_BY_CATEGORY[template.category] ?? "Professional",
    estimatedWords: WORDS_BY_CATEGORY[template.category] ?? "500 – 1,000 words",
    aiModel: "claude-sonnet",
    modelDisplayName: MODEL_DISPLAY["claude-sonnet"],
    sampleOutput: buildSampleOutput(template),
  };
}

export function getReviewCount(template: Template): number {
  return Math.max(24, Math.floor(template.usageCount / 180) + 18);
}

export function getRatingDistribution(rating: number, totalReviews: number): RatingBar[] {
  const weights =
    rating >= 4.8
      ? [0.67, 0.2, 0.08, 0.03, 0.02]
      : rating >= 4.5
        ? [0.55, 0.28, 0.1, 0.04, 0.03]
        : rating >= 4.0
          ? [0.42, 0.32, 0.15, 0.06, 0.05]
          : [0.3, 0.28, 0.22, 0.12, 0.08];

  return [5, 4, 3, 2, 1].map((stars, i) => {
    const percent = Math.round(weights[i] * 100);
    return {
      stars,
      percent,
      count: Math.round((percent / 100) * totalReviews),
    };
  });
}

export function generateReviewsForTemplate(template: Template, count = 6): Review[] {
  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => {
    const author = REVIEW_AUTHORS[i % REVIEW_AUTHORS.length];
    const daysAgo = i * 4 + 2;
    const date = new Date(now - daysAgo * 86400000);
    const rating = i === 2 ? 4 : i === 5 ? 4 : 5;
    return {
      id: `rev-${template.slug}-${i}`,
      name: author.name,
      initials: author.initials,
      rating,
      comment: REVIEW_COMMENTS[i % REVIEW_COMMENTS.length],
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  });
}

export function getRelatedTemplates(template: Template, limit = 4): Template[] {
  return templatesDb
    .filter((t) => t.category === template.category && t.slug !== template.slug)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, limit);
}

