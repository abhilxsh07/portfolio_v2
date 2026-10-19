import { useState } from "react";
import { motion } from "motion/react";
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconSend } from "@tabler/icons-react";
import { profile, contactLinks } from "../data/portfolio";

const icons = { email: IconMail, github: IconBrandGithub, linkedin: IconBrandLinkedin };
const links = contactLinks.map((link) => ({ ...link, icon: icons[link.id] }));

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: "96aff589-b21e-4732-b72d-b9c92a9dca9e",
                    botcheck: e.target.elements.botcheck.checked,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    from_name: "Portfolio Contact Form"
                })
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setStatus("sent");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

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
                    <h2 className="text-2xl font-light text-white">Contact</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-neutral-900/60 border border-neutral-800 rounded-xl px-8 py-6 w-full max-w-2xl"
                >
                    <div className="space-y-3 mb-4">
                        {links.map(({ icon: Icon, label, href, ariaLabel }, i) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={ariaLabel}
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

                    <p className="text-green-400 text-sm font-mono font-medium mb-2">
                        // LET'S_BUILD
                    </p>
                    <p className="text-sm text-neutral-500 font-mono leading-relaxed">
                        {profile.contact}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-neutral-900/60 border border-neutral-800 rounded-xl px-8 py-6 w-full max-w-2xl mt-6"
                >
                    <p className="text-green-500 text-sm font-mono font-medium mb-4">// or drop a message</p>
                    <form onSubmit={handleSubmit} aria-busy={status === "sending"}>
                        <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="hidden" style={{ display: "none" }} />

                        <div className="mb-4">
                            <label htmlFor="contact-name" className="block text-xs text-neutral-400 font-mono mb-1.5">Name</label>

                            <input
                                id="contact-name"
                                name="name"
                                autoComplete="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Your name"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contact-email" className="block text-xs text-neutral-400 font-mono mb-1.5">Email</label>
                            <input
                                id="contact-email"
                                name="email"
                                autoComplete="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="you@example.com"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contact-message" className="block text-xs text-neutral-400 font-mono mb-1.5">Message</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                required
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                placeholder="What's on your mind?"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium font-mono transition-colors bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 border border-neutral-700 disabled:opacity-50"
                        >
                            {status === "sending" ? "Sending..." : "Send Message"}
                        </button>
                        <p role="status" aria-live="polite" className={`text-xs font-mono mt-2 ${status === "error" ? "text-red-400" : "text-green-400"}`}>
                            {status === "sent" ? "Message sent successfully!" : status === "error" ? "Something went wrong. Please try again or use the email link above." : status === "sending" ? "Sending your message…" : ""}
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
