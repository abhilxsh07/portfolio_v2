import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const navItems = ["About", "Projects", "Skills", "Contact"];

export default function Navigation() {
    const [active, setActive] = useState(null);

    const scrollTo = (id) => {
        const el = document.getElementById(id.toLowerCase());
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setActive(id);
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-md">
                {navItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => scrollTo(item)}
                        className={cn(
                            "relative px-4 py-1.5 text-sm transition-colors rounded-full",
                            active === item ? "text-white" : "text-neutral-400 hover:text-white"
                        )}
                    >
                        {active === item && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-neutral-800 rounded-full"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 font-medium">{item}</span>
                    </button>
                ))}
            </div>
        </motion.nav>
    );
}
