import { useEffect, useState } from "react";

function CyberNews({ modalClose, initialNews = null }) {
  const [news, setNews] = useState(initialNews ?? []);
  const [loading, setLoading] = useState(initialNews ? false : true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If we already have initialNews from prefetch, skip fetching
    if (initialNews) return;
    const controller = new AbortController();
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_NEWSAPI_KEY;
        if (!apiKey) {
          setError('No NewsAPI key configured. Add VITE_NEWSAPI_KEY to your .env');
          setNews([]);
          return;
        }
        const url = `https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        setNews(data.articles || []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    return () => controller.abort();
  }, [initialNews]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Cyber news">
      <div className="modal__card bubble news-modal" style={{
        maxWidth: "600px",
        maxHeight: "60vh",
        width: "90vw"
      }}>
        <div className="modal__head">
          <div className="about-brand">
            <h3 style={{ fontSize: "1.4rem", margin: "0" }}>Latest Cybersecurity News</h3>
          </div>
          <button className="link" onClick={modalClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__body" style={{
          maxHeight: "40vh",
          overflowY: "auto",
          padding: "1rem",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* Internet Explorer 10+ */
        }}>
          <style jsx>{`
            .modal__body::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
          {loading && <div style={{ padding: "1rem", textAlign: "center" }}>Loading news...</div>}
          {error && <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>Error: {error}</div>}
          {!loading && !error && !news.length && <div style={{ padding: "1rem", textAlign: "center" }}>No recent articles found.</div>}

          {!loading && !error && news.length > 0 && (
            <ul className="about-list" style={{ margin: "0", padding: "0" }}>
              {news.slice(0, 4).map((item) => (
                <li key={item.url || item.publishedAt} style={{
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border)",
                  listStyle: "none"
                }}>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      lineHeight: "1.4",
                      textDecoration: "underline",
                      color: "hsl(240, 100%, 70%)",
                      display: "block",
                      marginBottom: "0.5rem"
                    }}
                  >
                    {item.title}
                  </a>
                  <div style={{ 
                    fontSize: "0.8rem", 
                    color: "var(--muted)",
                    marginBottom: "0.5rem"
                  }}>
                    {item.source?.name || "Unknown source"} — {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Unknown date"}
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "var(--text)",
                    opacity: "0.8",
                    lineHeight: "1.4"
                  }}>
                    {item.description ? (item.description.length > 120 ? item.description.substring(0, 120) + "..." : item.description) : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="cta" style={{ padding: "0.25rem 1rem 1rem", textAlign: "center" }}>
          <button className="btn btn--primary" onClick={modalClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default CyberNews;