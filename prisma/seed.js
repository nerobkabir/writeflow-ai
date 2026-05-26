const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function main() {
  console.log("Starting database seeding process...");

  // 1. Clean existing records (in dependency order)
  await prisma.notification.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.aIUsageHistory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.document.deleteMany();
  await prisma.template.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.contactMessage.deleteMany();

  console.log("Database cleared.");

  // 2. Create Users (passwords hashed with bcrypt)
  const adminPassword = await hashPassword("123456");
  const userPassword = await hashPassword("123456");

  const admin = await prisma.user.create({
    data: {
      id: "admin-phase1",
      name: "Alexander Admin",
      email: "admin@writeflow.com",
      password: adminPassword,
      role: "ADMIN",
      plan: "TEAM",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      bio: "Chief Content Architect & Operations Administrator.",
    },
  });

  const user = await prisma.user.create({
    data: {
      id: "user-phase1",
      name: "John Writer",
      email: "user@writeflow.com",
      password: userPassword,
      role: "USER",
      plan: "PRO",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
      bio: "Professional content creator and copywriter.",
    },
  });

  console.log("Admin and regular User records created.");

  // 3. Create 12 Templates (3 per category: Blog, Social, Email, AdCopy)
  const templatesData = [
    // --- Blog ---
    {
      title: "Precision Article Composer",
      slug: "precision-article-composer",
      description: "Write clean, comprehensive technical publications and reports with academic rigor.",
      category: "Blog",
      prompt: "Generate a clinical assessment summary regarding cortical stimulation methods.",
      sampleOutput: "CLINICAL EFFICACY ASSESSMENT REPORT: Active hemispheric stimulation pairs with standard neuro-rehab protocols.",
      tone: "Formal",
      estimatedWords: 1500,
      aiModel: "claude-sonnet",
      usageCount: 9300,
      rating: 4.8,
    },
    {
      title: "Tech Innovation Outline",
      slug: "tech-innovation-outline",
      description: "Draft detailed blueprints and semantic structures for emerging technology platforms.",
      category: "Blog",
      prompt: "System outline for Go-based Raft consensus engines.",
      sampleOutput: "SEMANTIC SYSTEM SPECIFICATION: sub-millisecond updates and partition resiliency active.",
      tone: "Professional",
      estimatedWords: 2000,
      aiModel: "claude-sonnet",
      usageCount: 14000,
      rating: 4.9,
    },
    {
      title: "Minimalist Design Trends",
      slug: "minimalist-design-trends",
      description: "Analyze modern aesthetics, typography, and functional spacing hierarchies.",
      category: "Blog",
      prompt: "Creative essay regarding Swiss design precision and clinical monochromatic scales.",
      sampleOutput: "THE SWISS Blueprints: Functionality dominates layout geometry.",
      tone: "Casual",
      estimatedWords: 1200,
      aiModel: "claude-sonnet",
      usageCount: 5200,
      rating: 4.6,
    },

    // --- Social ---
    {
      title: "Strategic Tech Lead",
      slug: "strategic-tech-lead",
      description: "Generate high-engagement industrial insights for executive professional networks.",
      category: "Social",
      prompt: "Write a short strategic update regarding NRR and SaaS operations metrics.",
      sampleOutput: "SaaS update: ARR reaches $42.6M. Efficiency triggers reduced overall customer acquisition payback to 11 months.",
      tone: "Professional",
      estimatedWords: 150,
      aiModel: "claude-sonnet",
      usageCount: 22000,
      rating: 4.7,
    },
    {
      title: "Micro-Manifesto Pitch",
      slug: "micro-manifesto-pitch",
      description: "Formulate crisp, punchy announcements asserting absolute product dominance.",
      category: "Social",
      prompt: "Generate brand vision tweet for Swiss horology mechanical tools.",
      sampleOutput: "We do not measure temporal speed. We capture clinical permanence.",
      tone: "Friendly",
      estimatedWords: 80,
      aiModel: "claude-sonnet",
      usageCount: 18500,
      rating: 4.9,
    },
    {
      title: "Community Builder Thread",
      slug: "community-builder-thread",
      description: "Format interactive step guides on building robust developer interfaces.",
      category: "Social",
      prompt: "Write tips on clean React form integrations.",
      sampleOutput: "Clean form tips: 1. Deploy explicit Zod models. 2. Implement checkmark spring bounces on success.",
      tone: "Casual",
      estimatedWords: 250,
      aiModel: "claude-sonnet",
      usageCount: 8900,
      rating: 4.5,
    },

    // --- Email ---
    {
      title: "Enterprise Sales Director",
      slug: "enterprise-sales-director",
      description: "Compose high-conversion cold emails targeting director-level operations leads.",
      category: "Email",
      prompt: "Write an introduction requesting a sandbox workspace trial setup.",
      sampleOutput: "Subject: Strategic Workspace Operations Setup - Review. Initialize automated developer sandboxes for your teams.",
      tone: "Formal",
      estimatedWords: 200,
      aiModel: "claude-sonnet",
      usageCount: 12500,
      rating: 4.8,
    },
    {
      title: "Changelog Dispatch",
      slug: "changelog-dispatch",
      description: "Announce new updates, features, and platform fixes cleanly and efficiently.",
      category: "Email",
      prompt: "Changelog email announcing version 2.4.8-PRO deployment.",
      sampleOutput: "Subject: Platform Update v2.4.8-PRO. Blinking green status controls and Tiptap editing modules now active.",
      tone: "Professional",
      estimatedWords: 350,
      aiModel: "claude-sonnet",
      usageCount: 6300,
      rating: 4.7,
    },
    {
      title: "Customer Welcome Track",
      slug: "customer-welcome-track",
      description: "Onboard new platform accounts with engaging introductory directives.",
      category: "Email",
      prompt: "Write a friendly welcome letter explaining document workspace setups.",
      sampleOutput: "Welcome to WriteFlow. Select a pre-engineered prompt blueprint and start publishing with zero delay.",
      tone: "Friendly",
      estimatedWords: 180,
      aiModel: "claude-sonnet",
      usageCount: 15400,
      rating: 4.9,
    },

    // --- AdCopy ---
    {
      title: "Dominant Value Prop",
      slug: "dominant-value-prop",
      description: "Hook target audiences with extreme high-density advertising benefits.",
      category: "AdCopy",
      prompt: "Write search engine ad headlines focusing on clinical precision writing.",
      sampleOutput: "WriteFlow AI: Absolute Precision. Swiss Engineered Blueprints. Get Started Today.",
      tone: "Formal",
      estimatedWords: 60,
      aiModel: "claude-sonnet",
      usageCount: 29000,
      rating: 4.9,
    },
    {
      title: "Growth Funnel Magnet",
      slug: "growth-funnel-magnet",
      description: "Persuade prospective accounts to initialize workspaces with smart risk-free CTAs.",
      category: "AdCopy",
      prompt: "Ad outline focusing on credit-card free trial registration benefits.",
      sampleOutput: "No credit cards. Complete credentials sandbox autofills. Deploy custom templates in 2 seconds.",
      tone: "Casual",
      estimatedWords: 90,
      aiModel: "claude-sonnet",
      usageCount: 11000,
      rating: 4.6,
    },
    {
      title: "SaaS Value Multiplexer",
      slug: "saas-value-multiplexer",
      description: "Assert industrial authority by focusing on system reliability metrics.",
      category: "AdCopy",
      prompt: "Generate display ad text highlighting 99.8% model success rates.",
      sampleOutput: "Command absolute authority. Built-in validator checks safeguard output logic flow. Click to try.",
      tone: "Professional",
      estimatedWords: 75,
      aiModel: "claude-sonnet",
      usageCount: 7800,
      rating: 4.8,
    },
  ];

  const templates = [];
  for (const t of templatesData) {
    const created = await prisma.template.create({ data: t });
    templates.push(created);
  }

  console.log("12 pre-engineered Templates seeded.");

  // 4. Create 5 Documents per User (Total 10)
  const users = [admin, user];
  const docStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"];

  for (const currUser of users) {
    for (let i = 1; i <= 5; i++) {
      const randomTpl = templates[Math.floor(Math.random() * templates.length)];
      await prisma.document.create({
        data: {
          userId: currUser.id,
          templateId: randomTpl.id,
          title: `File ${i}: ${randomTpl.title} Draft`,
          content: `This is a sample document content specifically structured for ${currUser.name}. Integrating core variables of the ${randomTpl.title} blueprint. Standard metrics demonstrate absolute precision is active.`,
          metaDescription: `High-density outline representing parameters for document ${i}.`,
          tags: ["SaaS", currUser.role.toLowerCase(), randomTpl.category.toLowerCase()],
          status: docStatuses[(i - 1) % docStatuses.length],
          wordCount: 120 + i * 35,
        },
      });
    }
  }

  console.log("10 Documents created (5 for Admin, 5 for User).");

  // 5. Create 20 Reviews (mix pending/approved/rejected)
  const reviewStatuses = ["APPROVED", "PENDING", "REJECTED"];
  const reviewers = [
    { name: "John Writer", id: user.id },
    { name: "Alexander Admin", id: admin.id },
  ];

  for (let i = 1; i <= 20; i++) {
    const reviewer = reviewers[i % reviewers.length];
    const randomTpl = templates[i % templates.length];
    await prisma.review.create({
      data: {
        userId: reviewer.id,
        templateId: randomTpl.id,
        rating: 4 + (i % 2), // 4 or 5 stars
        comment: `Excellent prompt validation checks. Generated ${randomTpl.tone} output immediately. Evaluation score: ${(9.5 + (i * 0.02)).toFixed(2)}/10.0.`,
        status: reviewStatuses[i % reviewStatuses.length],
      },
    });
  }

  console.log("20 Reviews seeded.");

  // 6. Create 30 AI Usage History entries
  const agentTypes = ["DRAFT", "REWRITE", "CHAT", "SUMMARISE"];
  
  for (let i = 1; i <= 30; i++) {
    const selectedUser = users[i % users.length];
    const agent = agentTypes[i % agentTypes.length];
    await prisma.aIUsageHistory.create({
      data: {
        userId: selectedUser.id,
        agentType: agent,
        promptSnippet: `Triggering ${agent.toLowerCase()} reasoning check for target index: ${i}`,
        tokensUsed: 1200 + i * 140,
        responseTime: 400 + i * 85, // ms
      },
    });
  }

  console.log("30 AI Usage History entries seeded.");

  // 7. Create Default SiteSettings record
  await prisma.siteSettings.create({
    data: {
      id: "singleton",
      siteName: "WriteFlow AI",
      maintenanceMode: false,
      draftAgentOn: true,
      rewriteAgentOn: true,
      chatAgentOn: true,
    },
  });

  console.log("Default SiteSettings singleton record established.");

  // 8. Create 6 detailed Blog posts
  const blogPostsData = [
    {
      title: "How AI is Transforming Professional Content Creation",
      slug: "how-ai-is-transforming-professional-content-creation",
      category: "AI Writing",
      excerpt: "Explore the profound shifts in copywriting, software documentation, and marketing strategies driven by advanced generative systems.",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
      content: `### The Shift in Content Paradigms

Generative AI is no longer a futuristic speculation; it is actively restructuring how communication happens. From small software blueprints to massive enterprise publications, organizations are utilizing modern AI writing aids to cut down editing loops and speed up deployment cycles.

#### Why Quality is the New Premium

When anyone can generate generic content in seconds, **precision** and **tone** become the absolute differentiators. Generative models must be constrained by pre-engineered prompts and structured validation boundaries. This ensures that the generated copy preserves the brand voice rather than reading like generic predictive text.

1. **Precision Outline**: Always organize with robust structures.
2. **Context Limits**: Feed the generator highly specific variables.
3. **Refinement Loops**: Leverage TipTap-like inline rewriters to polish content.

#### Looking Ahead

As we design the next phase of WriteFlow AI, our focus remains on providing content architects with horological precision. We bridge the gap between prompt engineering and final copy.`,
      authorName: "Sarah Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      readTime: "6 min read",
    },
    {
      title: "5 Tones That Convert: A WriteFlow Guide",
      slug: "5-tones-that-convert-a-writeflow-guide",
      category: "AI Writing",
      excerpt: "Discover how tailoring your writing tone to your audience's emotional scale boosts conversion rates by up to 40%.",
      thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&q=80",
      content: `### Finding the Right Frequency

Your content is only as good as the tone it conveys. A formal tone might command respect in academic publications but will alienate readers looking for quick, CASUAL software guides. Tailoring your tone ensures alignment with your audience's expectations.

#### The 5 Key Frequencies

1. **Professional**: Concise, metric-driven, and authority-focused. Perfect for SaaS features and cold outreach.
2. **Casual**: Relaxed, conversational, and direct. Ideal for community threads and newsletters.
3. **Formal**: Rigorous and analytically sound. Essential for clinical, financial, or legal papers.
4. **Friendly**: Supportive, empathetic, and engaging. Great for welcoming new users or onboarding emails.
5. **Urgent**: Active verbs, clear hooks, and risk-free CTAs. Best for advertising copies.

#### Applying the Tone Matrix

At WriteFlow, we build tone modifiers directly into our generation templates. Whether you are drafting a technical blueprint or composing a strategic LinkedIn update, selecting the correct tone translates directly to user trust and higher engagement.`,
      authorName: "Marcus Vance",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      readTime: "4 min read",
    },
    {
      title: "From Blank Page to Published: Our Content Architecture System",
      slug: "from-blank-page-to-published-our-content-architecture-system",
      category: "Product",
      excerpt: "Step behind the curtain to examine WriteFlow's semantic template pipelines that take the friction out of writing.",
      thumbnail: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=1000&q=80",
      content: `### Engineering the Blank Canvas

The most daunting phase of content creation is the beginning. A flashing text cursor represents a friction point. Our goal at WriteFlow AI is to build a high-performance content bridge.

#### Pre-Engineered Prompts

By structuring inputs inside dedicated category forms, we eliminate the need for users to guess prompt configurations. Our backend maps variables (tone, keyword, word count) onto custom-tuned blueprints, ensuring high-fidelity outputs.

#### Markdown First

We treat markdown as a core standard. It ensures that content is clean, highly portable, and ready for head-to-head integration with headless CMS networks or developer pipelines.`,
      authorName: "Elena Rostova",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
      readTime: "5 min read",
    },
    {
      title: "Maximizing ROI on AI-Generated Marketing Materials",
      slug: "maximizing-roi-on-ai-generated-marketing-materials",
      category: "Case Studies",
      excerpt: "How a leading Horology group utilized WriteFlow templates to scale display ad copy and reduce agency spend by 65%.",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&q=80",
      content: `### Ad Scale at Horology Speed

Marketing teams are under constant pressure to generate hundreds of micro-copy variations across diverse networks. In this case study, we examine how a horology tools brand scaled up their growth funnel using WriteFlow AI templates.

#### Key Results

- **65% reduction** in external copywriting spend.
- **4.8x increase** in total copy variations tested.
- **12.5% increase** in display ad conversion rates.

#### The Process

The team pre-engineered standard value proposition cards and linked them directly to WriteFlow's high-density templates. This let regular product managers generate fully compliant professional copy variations in seconds.`,
      authorName: "Sarah Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      readTime: "7 min read",
    },
    {
      title: "Getting Started with Custom Prompts in WriteFlow",
      slug: "getting-started-with-custom-prompts-in-writeflow",
      category: "Tutorials",
      excerpt: "A comprehensive developer-friendly tutorial on structuring prompt parameters to get flawless generation outputs.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=80",
      content: `### The Anatomy of a Flawless Prompt

Writing prompts for AI is an engineering discipline. If your inputs are vague, your outputs will reflect that ambiguity.

#### Tutorial Steps

1. **Assign a Role**: Always tell the AI who it is (e.g., Enterprise Sales Director).
2. **Define Constraints**: Restrict maximum estimated words and tones clearly.
3. **Include Sample Outputs**: Giving 1-2 examples of perfect outputs increases predictability by over 80%.

#### Template Blueprinting

With WriteFlow's Admin Templates dashboard, you can save these structures as reusable blueprints. Regular users can click, fill in simple forms, and generate optimized copy instantly.`,
      authorName: "Marcus Vance",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      readTime: "5 min read",
    },
    {
      title: "WriteFlow AI Product Roadmap: Q3 & Beyond",
      slug: "writeflow-ai-product-roadmap-q3-and-beyond",
      category: "Product",
      excerpt: "An exclusive look at our upcoming features including real-time team collaboration, audio transcripts, and offline storage.",
      thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1000&q=80",
      content: `### The Next Horizon for WriteFlow

We are building a comprehensive writing ecosystem. As we scale up our generative pipelines, we are excited to share what is on our product roadmap.

#### Upcoming Features

- **Real-Time Collaboration**: Share doc links with teammates and edit side-by-side.
- **Audio Transcript AI**: Upload recordings and convert them into beautifully structured technical docs.
- **Local Sandbox Storage**: Offline draft buffers so your edits are always safe.

#### Our Vision

We build tools that feel like fine engineering. Keep your status indicators operational—the future of content creation is fast, precise, and completely secure.`,
      authorName: "Elena Rostova",
      authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
      readTime: "4 min read",
    },
  ];

  for (const p of blogPostsData) {
    await prisma.blogPost.create({ data: p });
  }

  console.log("6 detailed Blog posts seeded successfully.");

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error occurred while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
