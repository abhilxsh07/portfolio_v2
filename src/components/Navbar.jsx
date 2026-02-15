import { motion } from "framer-motion";

const routes = [
    { label: "/skills", href: "#skills" },
    { label: "/projects", href: "#projects" },
    { label: "/experience", href: "#experience" },
    { label: "/contact", href: "#contact" }
];

export default function Navbar() {
    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60"
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <a
                    href="#"
                    onClick={scrollToTop}
                    className="font-mono text-sm text-neutral-300 hover:text-white transition-colors"
                >
                    <span className="text-neutral-500">&gt;_</span> abhilashkar.dev

                </a>

                <div className="flex items-center gap-6 md:gap-8">
                    {routes.map((route) => (
                        <a
                            key={route.label}
                            href={route.href}
                            className="font-mono text-sm text-neutral-400 hover:text-white transition-colors hidden sm:inline"
                        >
                            {route.label}
                        </a>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
}
