import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const err = await res.json().catch(() => ({}));
        setStatus(err?.error || "Failed to send.");
      }
    } catch {
      setStatus("Error sending message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* keep button style consistent with your topbar */}
      <button className="btn btn--ghost" onClick={() => setIsOpen(true)}>
        Contact Us
      </button>

      {isOpen && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contactUsTitle"
          onClick={() => setIsOpen(false)}
        >
          <div className="modal__card bubble" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <div className="about-brand">
                <h3 id="contactUsTitle">Contact Us</h3>
              </div>
              <button
                className="link"
                onClick={() => setIsOpen(false)}
                aria-label="Close Contact Us modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cta" style={{ flexDirection: "column", gap: "12px" }}>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                style={{ borderRadius: "12px", padding: "0.8rem", border: "1px solid var(--border)", background: "var(--panel)", color: "var(--text)" }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                style={{ borderRadius: "12px", padding: "0.8rem", border: "1px solid var(--border)", background: "var(--panel)", color: "var(--text)" }}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                required
                style={{ borderRadius: "12px", padding: "0.8rem", border: "1px solid var(--border)", background: "var(--panel)", color: "var(--text)" }}
              />
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? "Sending..." : "Send"}
              </button>
            </form>
            {status && <p style={{ marginTop: "8px", color: "var(--muted)" }}>{status}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default ContactUs;
