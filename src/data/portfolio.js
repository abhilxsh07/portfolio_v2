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

export const navigation = [
    { label: "Work", href: "/work" },
    { label: "Stack", href: "/stack" },
    { label: "Experience", href: "/experience" },
    { label: "Contact", href: "/contact" }
];

export const projects = [
    {
        id: "cursus",
        title: "Cursus",
        subtitle: "A study workspace for your own notes.",
        description:
            "Upload course material, ask questions with source citations, and generate summaries and quizzes. Dated tasks can sync to Google Calendar.",
        role: "Creator · full-stack development",
        proof: "Private uploads, cited answers, and one-way Google Calendar sync in one workspace.",
        note: "Fully built, then shelved when Notion shipped most of the same features. Sign-ups are closed, so the screens here use sample data.",
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
        description: "A Futurix hackathon platform for team registration and project submissions.",
        role: "Technical Staff · Futurix",
        proof: "Registration and submission flows backed by PHP and MySQL.",
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
            "A Windows reader built with C++/WinRT and WinUI 3. PDFium renders the pages; Direct2D applies night filters while thumbnails and printouts keep their original colours.",
        role: "Native Windows development",
        proof: "Tabs, four night presets, Find with highlights, text selection across pages, an outline sidebar and printing in original colours.",
        note: "Based on NightPDF by Joe Loya and Lunarequest. An independent rewrite, not an official successor.",
        tech: ["C++/WinRT", "WinUI 3", "Windows App SDK", "PDFium", "Direct2D"],
        liveUrl: null,
        repoUrl: "https://github.com/abhilxsh07/sable",
        group: "featured",
        status: "In development",
        buildingNote: null
    },
    {
        id: "clipstash",
        title: "clipstash",
        subtitle: "Useful snippets, one command away.",
        description: "A Python CLI for saving, tagging, searching, and copying code snippets from the terminal.",
        role: "Creator · Python development",
        proof: "Clipboard workflows and JSON import/export; installable from source.",
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
        description: "Playbook pages for Founders Club's IdeaSpark 3.0.",
        role: "Technical Staff · Founders Club",
        proof: "Event playbook pages built with Next.js.",
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
            "A personal portfolio with an interactive terminal, illustrated profile card, and custom animation.",
        role: "Design and development",
        proof: "Shared project data powers the page and its terminal commands.",
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
export function getProject(id) {
    return projects.find((project) => project.id === id);
}
export const contactLinks = [
    { id: "email", label: profile.email, href: `mailto:${profile.email}`, ariaLabel: `Email ${profile.name}` },
    { id: "github", label: "github.com/abhilxsh07", href: profile.github, ariaLabel: "Visit GitHub profile" },
    { id: "linkedin", label: "linkedin.com/in/abhilxsh", href: profile.linkedin, ariaLabel: "Visit LinkedIn profile" }
];
