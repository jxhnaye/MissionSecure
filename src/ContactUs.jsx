import React, { useState } from "react";

function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else setStatus("Failed to send.");
    } catch {
      setStatus("Error sending message.");
    }
  };

  return (
    <>
      {/* Button styled like your other topbar buttons */}
      <button className="btn btn--ghost" onClick={() => setIsOpen(true)}>
        Contact Us
      </button>

      {isOpen && (
        <div
          className="modal"
          style={{ alignItems: "flex-start", paddingTop: "100px" }} // moves bubble lower
          onClick={() => setIsOpen(false)}
        >
          <div
            className="modal__card bubble"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__head">
              <h2>Contact Us</h2>
              <button className="link" onClick={() => setIsOpen(false)}>
                ×
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
              <button type="submit" className="btn btn--primary">
                Send
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
