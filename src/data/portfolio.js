export const profile = {
    name: "Abhilash Kar",
    handle: "abhilxsh07",
    role: "Full-stack developer",
    location: "Chennai, India",
    intro: "I build web apps and Windows software.",
    context: "CSE student at SRMIST and co-founder of Forma Labs.",
    proof: "Currently building sable, a dark-mode PDF reader in C++ and WinUI 3.",
    email: "abh6l9sh@protonmail.com",
    github: "https://github.com/abhilxsh07",
    linkedin: "https://www.linkedin.com/in/abhilxsh/",
    resume: "/resume",
    studioUrl: null,
    contact:
        "Open to internships and full-stack roles. I also take on client projects through Forma Labs."
};

// Shows up on the home page and in the terminal. Bump the date whenever this changes.
export const now = {
    updated: "2026-11-01",
    text:
        "Mostly sable. I'm getting it to parity with NightPDF before I add anything of my own. Forma Labs is building a site for a financial-services client, and on free evenings I go back to the GPT I'm writing from scratch."
};

export const navigation = [
    { label: "Work", href: "/work" },
    { label: "Stack", href: "/stack" },
    { label: "Experience", href: "/experience" },
    { label: "Uses", href: "/uses" },
    { label: "Contact", href: "/contact" }
];

export const projects = [
    {
        id: "cursus",
        title: "Cursus",
        subtitle: "A study workspace for your own notes.",
        description:
            "A study workspace with private uploads, document-grounded chat, summaries, quizzes and one-way Google Calendar sync.",
        role: "Built the full-stack app: upload checks, background indexing, the study tools and the Calendar integration.",
        proof: "Each user's files are isolated with row-level security, and chat and study tools draw on a daily AI budget per user.",
        note: "Development is paused and sign-ups are closed.",
        tech: ["Next.js", "TypeScript", "Supabase", "pgvector", "OpenAI", "Inngest", "Redis"],
        liveUrl: null,
        repoUrl: null,
        group: "case-study",
        status: "Shelved",
        buildingNote: null
    },
    {
        id: "ultron",
        title: "Ultron 9.0",
        subtitle: "A hackathon, from registration to submission.",
        description: "Futurix's hackathon platform for Ultron 9.0, from team registration to project submission.",
        role: "Worked on the team-registration and project-submission flows. This was a team build.",
        proof: null,
        tech: ["React", "TypeScript", "Tailwind CSS", "PHP", "MySQL"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/futurixUltron9.0",
        group: "selected",
        status: "Built",
        buildingNote: null
    },
    {
        id: "sable",
        title: "sable",
        subtitle: "A dark-mode PDF reader for Windows.",
        description:
            "A native rewrite of NightPDF in C++/WinRT and WinUI 3. Night presets change how pages are drawn, so thumbnails and printouts keep their original colours.",
        role: "Built the native shell, the PDFium integration, the Direct2D filter, and the reading tools so far.",
        proof: "Tabs, four night presets, Find with highlights, text selection across pages, an outline sidebar, and printing in original colours.",
        note: "Based on NightPDF by Joe Loya and Lunarequest. An independent rewrite, not an official successor.",
        tech: ["C++/WinRT", "WinUI 3", "Windows App SDK", "PDFium", "Direct2D"],
        liveUrl: null,
        repoUrl: null,
        group: "featured",
        status: "In development",
        buildingNote: null
    },
    {
        id: "clipstash",
        title: "clipstash",
        subtitle: "Useful snippets, one command away.",
        description:
            "A Python CLI for keeping code snippets: save, tag, search, copy to the clipboard, and move them in and out as JSON.",
        role: "Built it myself.",
        proof: "Installable from source, with a test suite.",
        tech: ["Python", "CLI", "Clipboard", "JSON"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/clipstash",
        group: "selected",
        status: "Usable",
        buildingNote: null
    },
    {
        id: "llm-lab",
        title: "LLM lab",
        subtitle: "Learning by building the model.",
        description: "Experiments with a GPT built from scratch and a LoRA fine-tune of Llama 3.1 8B.",
        role: "Personal experiments",
        proof: "Exploring model internals alongside parameter-efficient fine-tuning.",
        tech: ["Python", "GPT", "LoRA", "Fine-tuning"],
        liveUrl: null,
        repoUrl: null,
        group: "building",
        status: "In progress",
        buildingNote: "Building a GPT from scratch and experimenting with a LoRA fine-tune of Llama 3.1 8B."
    },
    {
        id: "ideaspark",
        title: "IdeaSpark 3.0 playbook",
        subtitle: "Event guides and resources.",
        description: "The event playbook for Founders Club's IdeaSpark 3.0.",
        role: "Built the playbook pages: schedule, tracks, judging criteria and participant guidance.",
        proof: "Live on the event site.",
        tech: ["Next.js", "Front-end development"],
        liveUrl: "https://ideaspark.thefoundersclub.tech/playbook",
        repoUrl: "https://github.com/founder-srm/IdeaSpark",
        group: "selected",
        status: "Live",
        buildingNote: null
    },
    {
        id: "portfolio",
        title: "abhilashkar.dev",
        subtitle: "The site you're exploring.",
        description:
            "This site: an interactive terminal, an illustrated profile card, and walkthroughs of sable and Cursus.",
        role: "Designed and built it. One data file feeds the pages and the terminal commands.",
        proof: "A dependency audit on 19 Oct 2026 found three advisories; compatible updates cleared them.",
        tech: ["React", "Vite", "Tailwind CSS", "Motion"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/portfolio_v2",
        group: "selected",
        status: "Live",
        buildingNote: null
    },
    {
        id: "event-snapshot",
        title: "Event Snapshot",
        subtitle: "Collaborative hackathon application",
        description: "A team-built hackathon application.",
        role: "Team collaboration",
        proof: null,
        tech: ["Next.js", "React", "TypeScript"],
        liveUrl: null,
        repoUrl: "https://github.com/Sharveswar007/ultron-futurix",
        group: "earlier",
        status: "Built",
        buildingNote: null
    },
    {
        id: "student-db",
        title: "Student DB Manager",
        subtitle: "Student records with Python and MySQL",
        description: "A student-record CRUD tool and query interface.",
        role: "Personal project",
        proof: null,
        tech: ["Python", "MySQL"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/funny/blob/main/Python/studDatabase.py",
        group: "earlier",
        status: "Built",
        buildingNote: null
    },
    {
        id: "reflex",
        title: "Reflex Arc Demonstration",
        subtitle: "An educational programming experiment",
        description: "A demonstration of the biological reflex arc.",
        role: "College project",
        proof: null,
        tech: ["Python"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/collegeProjects/blob/main/reflexArcDemonstration.py",
        group: "earlier",
        status: "Built",
        buildingNote: null
    },
    {
        id: "legacy",
        title: "Legacy portfolio",
        subtitle: "An earlier version of this site",
        description: "An exploration of React, WebGL effects, and custom interactions.",
        role: "Design and development",
        proof: null,
        tech: ["React", "WebGL", "Vite"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/webPortfolio-legacy",
        group: "earlier",
        status: "Built",
        buildingNote: null
    },
    {
        id: "memscope",
        title: "memscope",
        subtitle: "Python memory profiling",
        description: "An exploration of object-level memory usage and reference graphs.",
        role: "Personal project",
        proof: null,
        tech: ["Python", "Memory profiling"],
        liveUrl: null,
        repoUrl: null,
        group: "building",
        status: "On hold",
        buildingNote: "Paused while I focus on other projects."
    }
];

export const builtWith = [
    { projectId: "sable", skills: ["C++", "WinUI 3", "PDFium", "Direct2D"] },
    { projectId: "cursus", skills: ["Next.js", "TypeScript", "Supabase", "pgvector", "OpenAI", "Redis"] },
    { projectId: "ultron", skills: ["React", "PHP", "MySQL", "Tailwind CSS"] },
    { projectId: "clipstash", skills: ["Python", "CLI tooling"] },
    { projectId: "portfolio", skills: ["React", "Vite", "Tailwind CSS", "Motion"] }
];
export const alsoUse = ["Git", "Docker", "PostgreSQL", "NumPy"];
export const learning = ["GPT architecture", "LoRA fine-tuning"];

export const experienceIntro =
    "I'm in my second year at SRMIST, so all of this fits around classes. The clubs gave me my first real users. Forma Labs is where I build for clients.";

export const experience = [
    {
        id: "forma",
        title: "Co-founder",
        company: "Forma Labs",
        date: "Aug 2026 – Present",
        status: "Current",
        projectId: null,
        description:
            "Co-running a two-person full-stack product studio that builds landing pages, product UIs and the backends behind them. Currently building a website for a financial-services client."
    },
    {
        id: "founders",
        title: "Technical Staff",
        company: "Founders Club",
        date: "Sep 2026 – Present",
        status: "Current",
        projectId: "ideaspark",
        description: "Built the playbook pages for IdeaSpark 3.0."
    },
    {
        id: "futurix",
        title: "Technical Staff",
        company: "Futurix",
        date: "Sep 2025 – Present",
        status: "Current",
        projectId: "ultron",
        description:
            "Worked on the Ultron 9.0 hackathon platform, including team registration and project submission flows."
    },
    {
        id: "srmist",
        title: "B.Tech · Computer Science & Engineering",
        company: "SRMIST",
        date: "2025 – 2029 (expected)",
        status: "In progress",
        projectId: null,
        description: null
    }
];
// The /uses page. Only things I actually open most days.
export const uses = [
    {
        heading: "Machine",
        items: [
            "An Acer Nitro V 15: i5-13420H, 32 GB of DDR5 and an RTX 4050 with 6 GB. It runs Windows 11, which helps when you're building a Windows app, and the 4050 is what my GPT experiments train on.",
            "A Nothing Phone (3)."
        ]
    },
    {
        heading: "Code",
        items: [
            "Visual Studio for sable. WinUI 3 more or less expects it.",
            "JetBrains for everything else: WebStorm for the web stuff, PyCharm for Python, CLion when C++ doesn't need the Windows tooling.",
            "uv for every Python project. I don't use pip or venv directly anymore.",
            "Git, and Docker when something needs to run the same way on another machine."
        ]
    },
    {
        heading: "Off-screen",
        items: ["Autodesk SketchBook for drawing.", "DaVinci Resolve for cutting video."]
    }
];

export function getProject(id) {
    return projects.find((project) => project.id === id);
}
export const contactLinks = [
    { id: "email", label: profile.email, href: `mailto:${profile.email}`, ariaLabel: `Email ${profile.name}` },
    { id: "github", label: "github.com/abhilxsh07", href: profile.github, ariaLabel: "Visit GitHub profile" },
    { id: "linkedin", label: "linkedin.com/in/abhilxsh", href: profile.linkedin, ariaLabel: "Visit LinkedIn profile" }
];
