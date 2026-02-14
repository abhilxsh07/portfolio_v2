import { motion } from "framer-motion";
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconSend } from "@tabler/icons-react";

const links = [
    { icon: IconMail, label: "abh6l9sh@protonmail.com", href: "mailto:abh6l9sh@protonmail.com" },
    { icon: IconBrandGithub, label: "github.com/abhilxsh07", href: "https://github.com/abhilxsh07" },
    { icon: IconBrandLinkedin, label: "linkedin.com/in/abhilxsh", href: "https://www.linkedin.com/in/abhilxsh/" }
];

export default function Contact() {
    return (
        <section id="contact" className="relative z-10 px-6 md:px-16 lg:px-24 py-24">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <IconSend className="w-6 h-6 text-neutral-400" />
                    <h2 className="text-2xl font-light text-white">Get In Touch</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-neutral-900/60 border border-neutral-800 rounded-xl px-8 py-6 w-full max-w-2xl"
                >
                    <div className="space-y-3 mb-4">
                        {links.map(({ icon: Icon, label, href }, i) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-colors font-mono"
                            >
                                <Icon className="w-4 h-4 text-neutral-500" />
                                {label}
                            </motion.a>
                        ))}
                    </div>

                    <div className="border-t border-neutral-800 my-4" />

                    <p className="text-green-500 text-sm font-mono font-medium mb-2">
                        // OPEN_FOR_OPPORTUNITIES
                    </p>
                    <p className="text-sm text-neutral-500 font-mono leading-relaxed">
                        Shipping code — harder, better, faster, stronger.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
