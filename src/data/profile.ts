// Edit this file to make the portfolio yours. Everything on the site —
// and everything the AI assistant knows about you — comes from here and
// from your public GitHub repositories.

export type FeaturedProject = {
  name: string;
  description: string;
  tech: string[];
  /** Live site, e.g. your Vercel deployment */
  liveUrl?: string;
  /** "owner/repo" on GitHub */
  repo?: string;
  highlights?: string[];
  /** Screenshot in the public folder, e.g. "/projects/my-app.png" (1280×800 works best) */
  image?: string;
};

export type PricingPlan = {
  name: string;
  /** Starting price shown on the card, e.g. "$300" */
  price: string;
  description: string;
  features: string[];
  /** Highlights the card as "Most popular" */
  featured?: boolean;
};

export const profile = {
  name: "Arooj Dogar",
  role: "Full-Stack & AI Developer",
  location: "Remote · Available worldwide",
  tagline:
    "I design and build fast, AI-powered web applications — from idea to production on Vercel.",
  about:
    "I'm a full-stack developer focused on modern web apps with Next.js, TypeScript and AI. I help startups and businesses turn ideas into polished products: landing pages, dashboards, SaaS platforms and AI features like chat assistants, smart search and automation.",
  availability: "Open to freelance projects and contract work",
  /** Your CV/resume PDF in the public folder, e.g. "/cv.pdf". Leave "" to hide the download button. */
  resume: "",
  /** Your photo: put the file in the `public` folder and write its name here, e.g. "/profile.jpg". Leave "" to show initials. */
  photo: "/profile.jpeg",
  /** How much to zoom into the photo (1 = no zoom, 1.5 = 50% closer) */
  photoZoom: 1.3,
  /** Point to zoom towards, "x% y%" from the top-left — usually your face */
  photoFocus: "49% 33%",

  /** Your live website address (used for Google, the sitemap and share previews) */
  website: "https://aroojdogar.vercel.app",
  email: "uroojdogar1435@gmail.com",
  /**
   * WhatsApp number with country code, digits only — no +, spaces or leading 0.
   * Example for Pakistan 0300 1234567 → "923001234567". Leave "" to hide WhatsApp.
   */
  whatsapp: "923286008989",
  /** Message pre-typed for visitors when they open WhatsApp */
  whatsappMessage: "Hi Arooj! I saw your portfolio and I'd like to discuss a project.",
  /** Your GitHub username — public repos are pulled in automatically */
  githubUsername: "AroojDogar",
  socials: {
    github: "https://github.com/AroojDogar",
    linkedin: "https://www.linkedin.com/in/arooj-sarwar-38106642b",
    instagram: "https://www.instagram.com/arooj_official89?mdxt=Y3VjNGN6ZHF0bHRt&utm_source=qr",
    tiktok: "https://www.tiktok.com/@arooj_official89?_r=1&_t=ZS-9AQ88GE5Zqv",
    twitter: "",
  },

  services: [
    {
      title: "Full-Stack Web Apps",
      description:
        "Production-ready apps with Next.js, TypeScript, databases, authentication and APIs.",
    },
    {
      title: "AI Integration",
      description:
        "Chat assistants, content generation, document Q&A and workflow automation with modern LLMs.",
    },
    {
      title: "Landing Pages & Websites",
      description:
        "Fast, responsive, SEO-friendly sites with Tailwind CSS that convert visitors into customers.",
    },
    {
      title: "Deployment & Performance",
      description:
        "CI/CD with GitHub and Vercel, Core Web Vitals tuning, and scalable hosting setups.",
    },
  ],

  skills: {
    Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    Backend: ["Node.js", "REST APIs", "Route Handlers", "Databases"],
    AI: ["AI SDK", "LLM chat assistants", "Prompt engineering", "RAG"],
    Tools: ["Git & GitHub", "Vercel", "VS Code", "CI/CD"],
  },

  /** Hand-picked projects shown first. Add your best work here. */
  featured: [
    {
      name: "Halden Strata GT",
      description:
        "An immersive, scroll-driven 3D website for a concept electric GT car. The camera flies around the car as you scroll, with WebGL shaders and parallax effects.",
      tech: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS", "Vercel"],
      liveUrl: "https://halden-strata.vercel.app/",
      repo: "AroojDogar/halden-strata",
      image: "/projects/halden-strata.png",
      highlights: [
        "Scroll-controlled 3D camera animation",
        "Custom GPU shaders and mouse-reactive scene",
      ],
    },
    {
      name: "Ember & Saffron",
      description:
        "A complete restaurant platform with QR table ordering in English, Urdu and Arabic, card payments, live order tracking and a kitchen dashboard.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      liveUrl: "https://ember-saffron-two.vercel.app/",
      repo: "AroojDogar/ember-saffron",
      image: "/projects/ember-saffron.png",
      highlights: [
        "Multi-language ordering via QR code",
        "Real-time kitchen order screen with sound alerts",
      ],
    },
    {
      name: "PulseBoard",
      description:
        "A fast, accessible SaaS analytics dashboard showing revenue, customers, churn and growth channels in one place.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      liveUrl: "https://pulseboard-jet.vercel.app/",
      repo: "AroojDogar/pulseboard",
      image: "/projects/pulseboard.png",
      highlights: ["Interactive charts and KPIs", "Accessible, responsive design"],
    },
    {
      name: "The Chai Index",
      description:
        "Compares everyday prices across 50 countries using live exchange rates, and shows each item as minutes of minimum-wage work.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      liveUrl: "https://chai-index.vercel.app/",
      repo: "AroojDogar/chai-index",
      image: "/projects/chai-index.png",
      highlights: ["Live currency conversion", "Data storytelling across 50 countries"],
    },
  ] satisfies FeaturedProject[],

  /** Steps shown in the "How we'll work together" section */
  process: [
    {
      title: "Discovery",
      description:
        "We talk about your goals, users and budget. You get a clear scope, timeline and fixed quote.",
    },
    {
      title: "Design & plan",
      description:
        "I map out pages, features and the tech stack, and share a design direction before any code.",
    },
    {
      title: "Build & review",
      description:
        "I build in small steps with a live preview link on Vercel, so you can test and give feedback anytime.",
    },
    {
      title: "Launch & support",
      description:
        "Your site goes live on your domain, fast and SEO-ready, with support after launch.",
    },
  ],

  /** Packages in the Pricing section — set your own prices here */
  pricing: [
    {
      name: "Starter",
      price: "$300",
      description: "A fast, beautiful landing page or small business website.",
      features: [
        "Up to 5 pages",
        "Mobile-friendly, modern design",
        "Contact form & WhatsApp button",
        "Basic SEO setup",
        "Deployed on Vercel",
      ],
    },
    {
      name: "Business",
      price: "$900",
      description: "A complete website or web app for a growing business.",
      features: [
        "Up to 12 pages or core app features",
        "Admin dashboard or content editing",
        "Online booking, ordering or payments",
        "Multi-language support",
        "SEO & performance optimization",
        "30 days of support",
      ],
      featured: true,
    },
    {
      name: "AI Pro",
      price: "$1,500",
      description: "A custom web app with AI features built in.",
      features: [
        "Everything in Business",
        "AI chatbot trained on your business",
        "AI content or document tools",
        "Automations & integrations",
        "60 days of support",
      ],
    },
  ] satisfies PricingPlan[],
};

export type Profile = typeof profile;
