import { useState } from 'react';
import './ContactMe.css';

function ContactMe() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const onChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = e => {
        e.preventDefault();
    };

    return (
        <section className="contact-section">
            <p className="contact-heading">
                Have a question or want to work together? Leave your
                <br />
                details and I&apos;ll get back to you as soon as possible.
            </p>

            <form className="contact-form" onSubmit={onSubmit}>
                <input
                    className="contact-input"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={onChange}
                    autoComplete="name"
                />

                <input
                    className="contact-input"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={onChange}
                    autoComplete="email"
                />

                <textarea
                    className="contact-textarea"
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={onChange}
                    rows={6}
                />

                <div className="contact-actions">
                    <button className="contact-submit" type="submit">
                        SUBMIT
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ContactMe;
