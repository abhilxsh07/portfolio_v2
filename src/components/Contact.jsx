import { useState } from "react";
import { motion } from "framer-motion";
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconSend } from "@tabler/icons-react";

const links = [
    { icon: IconMail, label: "abh6l9sh@protonmail.com", href: "mailto:abh6l9sh@protonmail.com", ariaLabel: "Send email to abh6l9sh@protonmail.com" },
    { icon: IconBrandGithub, label: "github.com/abhilxsh07", href: "https://github.com/abhilxsh07", ariaLabel: "Visit GitHub profile" },
    { icon: IconBrandLinkedin, label: "linkedin.com/in/abhilxsh", href: "https://www.linkedin.com/in/abhilxsh/", ariaLabel: "Visit LinkedIn profile" }
];

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
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    from_name: "Portfolio Contact Form"
                })
            });
            if (res.ok) {
                setStatus("sent");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setStatus("idle"), 3000);
            } else {
                setStatus("error");
                setTimeout(() => setStatus("idle"), 3000);
            }
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
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

                    <p className="text-green-500 text-sm font-mono font-medium mb-2">
                        // OPEN_FOR_OPPORTUNITIES
                    </p>
                    <p className="text-sm text-neutral-500 font-mono leading-relaxed">
                        Shipping code — harder, better, faster, stronger.
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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-xs text-neutral-500 font-mono mb-1.5">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Your name"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-neutral-500 font-mono mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="you@example.com"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-neutral-600 outline-none focus:border-neutral-600 transition-colors"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-neutral-500 font-mono mb-1.5">Message</label>
                            <textarea
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
                            {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send Message"}
                        </button>
                        {status === "sent" && (
                            <p className="text-green-400 text-xs font-mono mt-2">Message sent successfully!</p>
                        )}
                        {status === "error" && (
                            <p className="text-red-400 text-xs font-mono mt-2">Something went wrong. Please try again.</p>
                        )}
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
