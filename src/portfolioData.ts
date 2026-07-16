// This file is the site's content layer. Keeping prose and links outside the
// React components means most portfolio edits do not require touching layout.

// IDs become HTML anchors such as `#work-oracle`, so spelling changes here can
// also affect links in the capability map.
export type FeaturedWorkId =
  | "oracle"
  | "ibm"
  | "soapbox"
  | "resource-hub"
  | "mobilizeut"
  | "captain-fanplastic"
  | "kingdom-builder"
  | "huffman-coding"
  | "college-football-graph"
  | "doubly-linked-list"
  | "cnn-image-classifier"
  | "qrmor"
  | "traffic-research";

export type ExperienceId = "oracle" | "ibm" | "soapbox" | "truce" | "traffic-research";

// A discriminated union lets TypeScript enforce an important privacy rule:
// public work must have a URL, while private/unavailable work cannot have one.
export type CodeAccess =
  | Readonly<{
      visibility: "public";
      label: string;
      url: string;
      note: string;
    }>
  | Readonly<{
      visibility: "private" | "unavailable";
      label: string;
      note: string;
      url?: never;
    }>;

export interface FeaturedWork {
  readonly id: FeaturedWorkId;
  readonly title: string;
  readonly organization: string;
  readonly kind: "experience" | "project";
  readonly role: string | null;
  readonly timeframe: string | null;
  readonly summary: string;
  readonly challenge: string;
  readonly approach: string;
  readonly result: string;
  readonly technologies: readonly string[];
  readonly code: CodeAccess;
  readonly visualLabel?: string;
  readonly visual?: Readonly<{
    src: string;
    alt: string;
  }>;
  readonly demo?: Readonly<{
    label: string;
    url: string;
  }>;
}

export interface ExperienceEntry {
  readonly id: ExperienceId;
  readonly organization: string;
  readonly role: string;
  readonly timeframe: string;
  readonly location?: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
}

export interface EvidenceReference {
  readonly label: string;
  readonly href: `#${string}`;
}

export interface CapabilityGroup {
  readonly title: string;
  readonly summary: string;
  readonly skills: readonly string[];
  readonly evidence: readonly EvidenceReference[];
}

export interface Education {
  readonly institution: string;
  readonly degree: string;
  readonly timeframe: string;
  readonly gpa: string;
  readonly location: string;
  readonly coursework: readonly string[];
}

// Only these destinations are intentionally public. Add another identifier here
// only after its corresponding entry is safe to publish.
export type ExternalLinkId = "github" | "linkedin" | "email";

export interface ExternalLink {
  readonly id: ExternalLinkId;
  readonly label: string;
  readonly href: string;
  readonly kind: "profile" | "contact";
}

export interface ProofPoint {
  readonly value: string;
  readonly label: string;
  readonly context: string;
}

/** Identity content shared by the hero and the workbench overview application. */
export const profile = {
  name: "Gerard Zhou",
  eyebrow: "CS @ UT Austin · Systems, infrastructure, and product",
  headline: "I build reliable systems.",
  introduction:
    "I’m a computer science student and software engineer working across cloud infrastructure, distributed systems, backend APIs, and developer tools.",
  location: "Austin, Texas",
  portraitSrc: "/gerard-zhou-headshot.jpg",
} as const;

export const proofPoints = [
  {
    value: ">70%",
    label: "less configuration effort",
    context: "IBM operator workflow",
  },
  {
    value: "~89% faster",
    label: "estimated OCI VCN release workflow",
    context: "45 min → 5 min via CI/CD automation",
  },
  {
    value: "20+",
    label: "backend endpoints shipped",
    context: "Soapbox platform",
  },
  {
    value: "04+",
    label: "engineering internships",
    context: "cloud to product",
  },
] as const satisfies readonly ProofPoint[];

export const personalInterests = [
  "Hiking",
  "Weightlifting",
  "Cooking",
  "Chess",
  "Basketball",
  "Competitive programming",
] as const;

// `satisfies` validates every object against FeaturedWork without throwing away
// useful literal types. `readonly` prevents accidental runtime mutation.
export const featuredWork = [
  {
    id: "oracle",
    title: "Release automation with a smaller blast radius",
    organization: "Oracle Cloud Infrastructure",
    kind: "experience",
    role: "Software Engineer Intern",
    timeframe: "May 2026 - Present",
    summary:
      "Designing a safer, repeatable release path for cloud infrastructure changes that previously included a roughly 45-minute manual workflow.",
    challenge:
      "Infrastructure changes needed a repeatable release path and stronger separation between test environments before broader deployment.",
    approach:
      "Designing a CI/CD release pipeline, implementing infrastructure-as-code and release configuration changes, and documenting the orchestration and environment-isolation design.",
    result:
      "The in-progress system targets removal of the roughly 45-minute manual step while reducing deployment blast radius and operational risk through dedicated test environments.",
    technologies: ["Terraform", "CI/CD", "Infrastructure as code", "Release orchestration"],
    code: {
      visibility: "private",
      label: "Employer-owned code",
      note: "Source and internal implementation details are not public.",
    },
  },
  {
    id: "ibm",
    title: "Kubernetes lifecycle management, packaged as an operator",
    organization: "IBM",
    kind: "experience",
    role: "Software Engineer Intern",
    timeframe: "Feb 2026 - May 2026",
    summary:
      "Built a Go operator that automated deployment and lifecycle management for enterprise software across OpenShift and Kubernetes.",
    challenge:
      "The existing Helm-based deployment workflow required substantial user configuration across two Kubernetes platforms.",
    approach:
      "Developed custom resource schemas and reconciliation logic with Operator SDK, secured networking with TLS, and packaged the operator with OLM bundles and Helm charts.",
    result:
      "Reduced user configuration effort by over 70% and enabled deployment on both Red Hat OpenShift and native Kubernetes.",
    technologies: ["Go", "Kubernetes", "OpenShift", "Operator SDK", "Helm", "OLM", "TLS"],
    code: {
      visibility: "private",
      label: "Employer-owned code",
      note: "Source and product-specific implementation details are not public.",
    },
  },
  {
    id: "soapbox",
    title: "Mobile and API platform for nonprofit volunteer coordination",
    organization: "Soapbox",
    kind: "experience",
    role: "Software Engineer Intern",
    timeframe: "Jun 2025 - Aug 2025",
    summary:
      "Developed product infrastructure for a program reporting 26,000+ volunteers and 20,000+ kilograms of litter removed.",
    challenge:
      "A large volunteer initiative needed a mobile experience and dependable backend services for participation and cleanup data.",
    approach:
      "Built the React Native application and 20+ REST endpoints with Node.js, Express, PostgreSQL, authentication, Redis traffic controls, and mapping integrations.",
    result:
      "Delivered the mobile and API foundations used to support the program, with rate limiting to mitigate abusive traffic and precise map-based interactions.",
    technologies: [
      "React Native",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Redis",
      "REST APIs",
    ],
    code: {
      visibility: "unavailable",
      label: "Project-team code",
      note: "The project repository is not linked from this portfolio.",
    },
  },
  {
    id: "resource-hub",
    title: "Free AP study resources, organized for 500+ students",
    organization: "AP Resource Hub",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Launched a course-specific resource hub used by 500+ students and viewed more than 5,000 times.",
    challenge:
      "Free AP preparation materials were scattered across dozens of sites, subjects, and formats.",
    approach:
      "Built a browsable React and Vite catalog with routed course pages, curated practice resources, contact submissions, and GA4 usage instrumentation.",
    result:
      "Reached 5K+ views and 500+ users while giving students one place to discover accessible AP study resources.",
    technologies: ["React", "Vite", "React Router", "GA4", "EmailJS", "CSS Modules"],
    visualLabel: "Study library",
    code: {
      visibility: "public",
      label: "View source code",
      url: "https://github.com/GerardZhou/resource-hub-for-school",
      note: "Public project repository.",
    },
  },
  {
    id: "mobilizeut",
    title: "Accessibility preferences built into route planning",
    organization: "MobilizeUT · Longhorn Developers",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Built an accessible campus mobility app through Longhorn Developers for 100+ UT Austin students with disabilities.",
    challenge:
      "Campus route planning needed to account for user-specific accessibility preferences instead of treating every route as interchangeable.",
    approach:
      "Implemented a Hono backend on Cloudflare Workers, integrated route mapping, added Google OAuth, and extended Cloudflare D1 schemas for accessibility preferences.",
    result:
      "Delivered route mapping and preference-aware account foundations for the team's React Native mobility experience.",
    technologies: [
      "React Native",
      "TypeScript",
      "Hono",
      "Cloudflare Workers",
      "Cloudflare D1",
      "OpenRouteService",
    ],
    visualLabel: "Accessible routes",
    code: {
      visibility: "public",
      label: "View team repository",
      url: "https://github.com/Longhorn-Developers/Mobilize",
      note: "Public Longhorn Developers team repository.",
    },
  },
  {
    id: "captain-fanplastic",
    title: "Cleanup participation and impact, connected end to end",
    organization: "Captain Fanplastic · Soapbox",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Built mobile and backend workflows for environmental cleanup events, material tracking, leaderboards, and participant profiles.",
    challenge:
      "Teachers, students, and independent volunteers needed one workflow to create events, join cleanups, and record outcomes.",
    approach:
      "Developed an Expo and React Native client with an Express API, Clerk authentication, PostgreSQL data models, role-based access, and Upstash rate limiting.",
    result:
      "Delivered cross-platform event participation, material logging, leaderboard, and profile experiences backed by authenticated REST APIs.",
    technologies: [
      "React Native",
      "Expo",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Clerk",
      "Upstash Redis",
    ],
    visualLabel: "Cleanup platform",
    code: {
      visibility: "public",
      label: "View source code",
      url: "https://github.com/GerardZhou/captain_fanplastic_app",
      note: "Public mobile and backend repository.",
    },
  },
  {
    id: "kingdom-builder",
    title: "A tabletop strategy game engine built in Java",
    organization: "KingdomBuilder · Team project",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Co-developed a four-player desktop game with interactive turns, randomized hex maps, special actions, and objective scoring.",
    challenge:
      "A rules-heavy board game needed to become a clear, playable desktop experience with coordinated game state.",
    approach:
      "Modeled players, cards, hexes, settlements, scoring, and randomized board sectors in Java, then built the interactive interface with Swing and AWT.",
    result:
      "Shipped executable builds with multiple map layouts, turn flow, special-location tokens, objective cards, and winner calculation.",
    technologies: ["Java", "Swing", "AWT", "OOP", "Game state", "Graph modeling"],
    visualLabel: "Strategy game",
    code: {
      visibility: "public",
      label: "View team repository",
      url: "https://github.com/VishalSurya2773/KingdomBuilder",
      note: "Public four-person team repository.",
    },
  },
  {
    id: "huffman-coding",
    title: "Lossless compression, built from the bit level up",
    organization: "Huffman Coding · Partner project",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Partnered on a Java compressor and decompressor that converts byte frequencies into compact, prefix-free encodings.",
    challenge:
      "A lossless file format needed to preserve arbitrary input while accounting for headers, bit-level output, and malformed compressed data.",
    approach:
      "Built Huffman trees with a priority queue, generated encoding maps through traversal, supported count- and tree-based headers, and streamed individual bits during compression and reconstruction.",
    result:
      "Validated round-trip compression across text, HTML, image, and benchmark corpora, including 43.2% overall compression on the Calgary dataset.",
    technologies: [
      "Java",
      "Huffman coding",
      "Priority queues",
      "Binary trees",
      "Bit streams",
      "File I/O",
    ],
    visualLabel: "Compression lab",
    code: {
      visibility: "public",
      label: "View partner repository",
      url: "https://github.com/GerardZhou/Huffman-Coding",
      note: "Public partner-project repository.",
    },
  },
  {
    id: "college-football-graph",
    title: "Ranking college football teams through graph centrality",
    organization: "College Football Graph",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Modeled college football results as a graph to explore how connectivity and shortest paths can produce team rankings.",
    challenge:
      "Win-loss totals alone do not express strength of schedule or the relationships connecting teams across a season.",
    approach:
      "Implemented weighted and unweighted graph traversal, Dijkstra’s algorithm, all-pairs path analysis, graph diameter, and centrality-based ranking in Java.",
    result:
      "Generated computational rankings from 2005, 2008, and 2014 season data and compared them with the corresponding AP polls.",
    technologies: [
      "Java",
      "Graph algorithms",
      "Dijkstra’s algorithm",
      "Breadth-first search",
      "Priority queues",
    ],
    visualLabel: "Graph rankings",
    code: {
      visibility: "public",
      label: "View source code",
      url: "https://github.com/GerardZhou/CollegeFootballGraphAssignment",
      note: "Public graph-assignment repository.",
    },
  },
  {
    id: "doubly-linked-list",
    title: "A generic list engineered for bidirectional traversal",
    organization: "Doubly Linked List",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Implemented a generic Java list from scratch with previous and next links connecting every node.",
    challenge:
      "The collection needed predictable insert, removal, range, equality, and iteration behavior without relying on Java’s built-in linked-list implementation.",
    approach:
      "Implemented the IList contract, including indexed updates, sublists, range removal, equality, and an iterator with safe element removal.",
    result:
      "Completed a reusable collection that searches from the nearest end for indexed access and maintains first, last, size, and neighboring-node invariants.",
    technologies: ["Java", "Generics", "Data structures", "Iterators", "OOP"],
    visualLabel: "Data structure",
    code: {
      visibility: "public",
      label: "View source code",
      url: "https://github.com/GerardZhou/DoublyLinkedList",
      note: "Public data-structure repository.",
    },
  },
  {
    id: "cnn-image-classifier",
    title: "Training a CNN to distinguish cats from dogs",
    organization: "CNN Image Classifier",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "Built a TensorFlow image-classification notebook to learn the full workflow from image cleanup through model inference.",
    challenge:
      "A small, mixed-format image dataset needed validation, preprocessing, training splits, and a model capable of binary classification.",
    approach:
      "Filtered invalid images, created TensorFlow datasets, normalized inputs, and trained a Keras network with three convolution and max-pooling stages followed by dense layers.",
    result:
      "Tracked training and validation performance, saved and reloaded the model, and verified predictions on separate cat and dog images.",
    technologies: ["Python", "TensorFlow", "Keras", "CNNs", "OpenCV", "Jupyter"],
    visualLabel: "Vision model",
    code: {
      visibility: "public",
      label: "View notebook",
      url: "https://github.com/GerardZhou/CNNImageClassifier",
      note: "Public learning-project repository and notebook.",
    },
  },
  {
    id: "qrmor",
    title: "More context before opening a QR-code destination",
    organization: "QRmor",
    kind: "project",
    role: null,
    timeframe: null,
    summary:
      "A public React Native prototype that checks QR-code destinations and presents useful context before a user chooses to continue.",
    challenge:
      "QR codes conceal their destination, leaving users with little information for evaluating a link before opening it.",
    approach:
      "Built a mobile prototype that reads QR codes, checks destination URLs with VirusTotal, and uses Gemini to summarize links when the scan reports no threats detected.",
    result:
      "Combined scan results and concise link summaries in one review flow without presenting the prototype as a guarantee of URL safety.",
    technologies: [
      "React Native",
      "TypeScript",
      "Node.js",
      "Express",
      "VirusTotal API",
      "Google Gemini",
    ],
    visualLabel: "Link scanner",
    code: {
      visibility: "public",
      label: "View public prototype",
      url: "https://github.com/GerardZhou/QRmor",
      note: "Public prototype repository; production readiness is not claimed.",
    },
  },
  {
    id: "traffic-research",
    title: "Route optimization in a simulated traffic network",
    organization: "University of Houston Research",
    kind: "experience",
    role: null,
    timeframe: null,
    summary:
      "Explored traffic simulation and route optimization using SUMO and graph-based shortest-path methods.",
    challenge:
      "Traffic experiments needed a reproducible way to compare routing behavior under simulated network conditions.",
    approach:
      "Modeled road networks in SUMO and applied Dijkstra’s algorithm to reason about route selection and optimization tradeoffs.",
    result:
      "Produced a research-oriented simulation workflow for studying how routing decisions affect modeled traffic flow.",
    technologies: ["Python", "SUMO", "Dijkstra’s algorithm", "Optimization"],
    code: {
      visibility: "unavailable",
      label: "Research materials",
      note: "No reviewed public source repository is available for this work.",
    },
  },
] as const satisfies readonly FeaturedWork[];

// The timeline repeats the most relevant experience in a faster chronological
// format. It is separate from featuredWork because the two sections tell
// different stories and should be editable independently.
export const experienceTimeline = [
  {
    id: "oracle",
    organization: "Oracle Cloud Infrastructure",
    role: "Software Engineer Intern",
    timeframe: "May 2026 - Present",
    summary:
      "Designing release automation and isolated test environments for cloud infrastructure changes.",
    highlights: [
      "Designing a CI/CD release path to automate a 45-minute manual workflow, targeting a reduction to 5 minutes—an 89% improvement.",
      "Implemented infrastructure-as-code and release configuration changes for dedicated test environments.",
      "Authored a design covering release automation, orchestration, and infrastructure isolation.",
    ],
    technologies: ["Terraform", "CI/CD", "Infrastructure as code"],
  },
  {
    id: "ibm",
    organization: "IBM",
    role: "Software Engineer Intern",
    timeframe: "Feb 2026 - May 2026",
    summary:
      "Automated enterprise software deployment and lifecycle management on OpenShift and Kubernetes.",
    highlights: [
      "Developed a Kubernetes operator in Go with Operator SDK.",
      "Designed custom resource schemas and reconciliation logic that reduced configuration effort by over 70%.",
      "Implemented TLS-secured networking and packaged OLM bundles and Helm charts for both supported platforms.",
    ],
    technologies: ["Go", "Kubernetes", "OpenShift", "Operator SDK", "Helm", "OLM"],
  },
  {
    id: "soapbox",
    organization: "Soapbox",
    role: "Software Engineer Intern",
    timeframe: "Jun 2025 - Aug 2025",
    summary:
      "Built mobile and backend capabilities for a large-scale volunteer cleanup program.",
    highlights: [
      "Developed a React Native application for a program reporting 26,000+ volunteers and 20,000+ kilograms of litter removed.",
      "Engineered 20+ REST endpoints with Node.js, Express, PostgreSQL, and authentication.",
      "Added Redis rate limiting to mitigate abusive traffic and integrated mapping APIs.",
    ],
    technologies: ["React Native", "Node.js", "Express", "PostgreSQL", "Redis"],
  },
  {
    id: "truce",
    organization: "TRUCE Software (Cellcontrol, Inc.)",
    role: "Software Engineer Intern",
    timeframe: "Jul 2024 - Jan 2025",
    summary:
      "Strengthened automated validation, test coverage, and static analysis across Python services.",
    highlights: [
      "Automated pre-review validation with Git pre-commit hooks and linting checks.",
      "Developed Pytest suites for AWS Lambda functions, AWS SQS, and REST APIs.",
      "Applied Ruff and Mypy static analysis across at least four codebases.",
    ],
    technologies: ["Python", "Pytest", "AWS Lambda", "AWS SQS", "Ruff", "Mypy"],
  },
  {
    id: "traffic-research",
    organization: "University of Houston, Real-Time Systems Lab",
    role: "Algorithms Research Intern",
    timeframe: "Jun 2024 - Aug 2024",
    summary:
      "Researched traffic-aware vehicle routing optimization and simulation workflows in Python.",
    highlights: [
      "Developed a vehicle routing optimization algorithm in Python that achieved 18% higher computational efficiency than Dijkstra's algorithm across urban traffic simulations.",
      "Implemented SUMO and TraCI traffic simulations to model real-world routing and benchmark algorithmic performance.",
    ],
    technologies: ["Python", "SUMO", "TraCI", "Optimization", "Dijkstra's algorithm"],
  },
] as const satisfies readonly ExperienceEntry[];

// Capabilities are evidence-linked: every skill cluster points back to a real
// project or experience instead of presenting an unsupported keyword cloud.
export const capabilityGroups = [
  {
    title: "Cloud and release engineering",
    summary:
      "Automating repeatable infrastructure change while constraining operational risk.",
    skills: ["Terraform", "CI/CD", "Infrastructure as code", "Environment isolation"],
    evidence: [
      { label: "Oracle release automation", href: "#experience-oracle" },
      { label: "IBM cross-platform packaging", href: "#experience-ibm" },
    ],
  },
  {
    title: "Kubernetes automation",
    summary:
      "Encoding lifecycle operations as declarative resources and reconciliation logic.",
    skills: ["Go", "Kubernetes", "OpenShift", "Operator SDK", "CRDs", "Helm", "OLM"],
    evidence: [{ label: "IBM Kubernetes operator", href: "#experience-ibm" }],
  },
  {
    title: "Backend and platform systems",
    summary:
      "Building authenticated APIs, data models, and traffic controls behind product experiences.",
    skills: [
      "Node.js",
      "Express",
      "Hono",
      "PostgreSQL",
      "Redis",
      "Cloudflare Workers",
      "Cloudflare D1",
    ],
    evidence: [
      { label: "Soapbox API platform", href: "#experience-soapbox" },
      { label: "MobilizeUT routing backend", href: "#work-mobilizeut" },
      { label: "Captain Fanplastic API", href: "#work-captain-fanplastic" },
    ],
  },
  {
    title: "Web and mobile product engineering",
    summary:
      "Connecting usable interfaces to mapping, identity, learning, and decision-support services.",
    skills: ["React", "React Native", "TypeScript", "REST APIs", "OAuth", "Mapping APIs"],
    evidence: [
      { label: "AP Resource Hub", href: "#work-resource-hub" },
      { label: "MobilizeUT accessible routing", href: "#work-mobilizeut" },
      { label: "Captain Fanplastic app", href: "#work-captain-fanplastic" },
      { label: "QRmor public prototype", href: "#work-qrmor" },
    ],
  },
  {
    title: "Software quality and reliability",
    summary:
      "Moving correctness checks earlier and designing guardrails into systems and delivery workflows.",
    skills: ["Pytest", "Ruff", "Mypy", "Git hooks", "TLS", "Rate limiting"],
    evidence: [
      { label: "TRUCE validation and testing", href: "#experience-truce" },
      { label: "IBM TLS-secured operator", href: "#experience-ibm" },
      { label: "Soapbox traffic controls", href: "#experience-soapbox" },
    ],
  },
  {
    title: "Analytical foundations",
    summary:
      "Coursework supporting rigorous reasoning about algorithms, systems, probability, and linear models.",
    skills: [
      "Data Structures & Algorithms",
      "Computer Architecture",
      "Calculus",
      "Probability",
      "Linear Algebra",
      "Java",
      "Object-oriented design",
    ],
    evidence: [
      { label: "Traffic simulation research", href: "#experience-traffic-research" },
      { label: "KingdomBuilder game engine", href: "#work-kingdom-builder" },
      { label: "UT Austin coursework", href: "#education" },
    ],
  },
] as const satisfies readonly CapabilityGroup[];

// Education remains a single object because the current page shows one degree.
export const education = {
  institution: "University of Texas at Austin",
  degree: "Bachelor of Science in Computer Science",
  timeframe: "Expected May 2028",
  gpa: "3.6",
  location: "Austin, TX",
  coursework: [
    "Data Structures & Algorithms",
    "Object Oriented Programming",
    "Computer Architecture",
    "Calculus",
    "Probability",
    "Linear Algebra",
  ],
} as const satisfies Education;

// Centralizing external destinations prevents slightly different URLs from
// being copied into multiple components. The contact email is public by design.
export const externalLinks = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/GerardZhou",
    kind: "profile",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gerard-zhou",
    kind: "profile",
  },
  {
    id: "email",
    label: "Email",
    href: "mailto:gerardzhou07@gmail.com",
    kind: "contact",
  },
] as const satisfies readonly ExternalLink[];
