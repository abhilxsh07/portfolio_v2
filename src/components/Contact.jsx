import { useState } from "react";
import { IconMail, IconBrandGithub, IconBrandLinkedin, IconSend, IconFileText } from "@tabler/icons-react";
import { profile, contactLinks } from "../data/portfolio";
import SectionHeading from "./SectionHeading";

const icons = { email: IconMail, github: IconBrandGithub, linkedin: IconBrandLinkedin };
const links = contactLinks.map((link) => ({ ...link, icon: icons[link.id] }));

const fieldClass = "min-h-11 w-full rounded-md border border-neutral-700 bg-neutral-900/65 px-3 py-2.5 text-base text-white";
const statusText = {
    empty: "Fill in your name and message before sending.",
    error: "The message could not be sent. Try again or use the email link.",
    sending: "Sending your message.",
    sent: "Message sent."
};

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === "sending") return;
        const name = formData.name.trim();
        const email = formData.email.trim();
        const message = formData.message.trim();
        if (!name || !message) {
            setStatus("empty");
            return;
        }
        setStatus("sending");
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: "96aff589-b21e-4732-b72d-b9c92a9dca9e",
                    botcheck: e.currentTarget.elements.botcheck.checked,
                    name,
                    email,
                    message,
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
        <section id="contact" className="relative z-10 px-6 pb-20 pt-20 md:px-16 lg:px-24">
            <div className="mx-auto max-w-5xl">
                <SectionHeading as="h1" title="Contact" />
                <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12">
                    <div className="border-t border-pencil/30 pt-4">
                        <h2 className="font-serif text-2xl italic text-paper">Availability</h2>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-300">{profile.contact}</p>
                        <address className="mt-4 not-italic">
                            {links.map(({ icon: Icon, label, href, ariaLabel }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                                    rel="noopener noreferrer"
                                    aria-label={ariaLabel}
                                    className="flex min-h-11 items-center gap-3 text-sm text-neutral-300 [overflow-wrap:anywhere] hover:text-green-400"
                                >
                                    <Icon size={17} aria-hidden="true" className="shrink-0 text-pencil" />
                                    <span>{label}</span>
                                </a>
                            ))}
                            <a
                                href={profile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View résumé (opens in new tab)"
                                className="flex min-h-11 items-center gap-3 text-sm text-neutral-300 hover:text-green-400"
                            >
                                <IconFileText size={17} aria-hidden="true" className="text-pencil" /> Résumé
                            </a>
                        </address>
                    </div>

                    <div className="border-t border-pencil/30 pt-4">
                        <h2 className="mb-4 font-serif text-2xl italic text-paper">Send a message</h2>
                        <form onSubmit={handleSubmit} aria-busy={status === "sending"}>
                            <input type="checkbox" name="botcheck" tabIndex={-1} hidden />
                            <fieldset disabled={status === "sending"} className="min-w-0 space-y-4 disabled:opacity-60">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact-name" className="mb-1.5 block text-sm text-neutral-300">Name</label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            value={formData.name}
                                            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                                            className={fieldClass}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="mb-1.5 block text-sm text-neutral-300">Email</label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            autoComplete="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                                            className={fieldClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="mb-1.5 block text-sm text-neutral-300">Message</label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                                        className={fieldClass + " resize-y"}
                                    />
                                </div>
                                <button type="submit" className="min-h-11 rounded-md bg-green-400 px-4 text-sm font-medium text-neutral-950 hover:bg-green-300">
                                    <span className="inline-flex items-center gap-2">
                                        {status === "sending" ? "Sending…" : "Send message"} <IconSend size={16} aria-hidden="true" />
                                    </span>
                                </button>
                            </fieldset>
                        </form>
                        <p role="status" className={`mt-3 text-sm ${status === "error" || status === "empty" ? "text-red-300" : "text-neutral-300"}`}>
                            {statusText[status]}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
