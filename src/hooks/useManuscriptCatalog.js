// Fetches every stored manuscript (ManuscriptBook) plus every non-marker
// AstroClockKnowledge record, and exposes them for the Reference Library catalog
// and Import History. Read-only — never writes or modifies any record.
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function useManuscriptCatalog() {
  const [books, setBooks] = useState([]);
  const [knowledge, setKnowledge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [bookRes, ackRes] = await Promise.all([
          base44.entities.ManuscriptBook.list("-upload_date", 200),
          base44.entities.AstroClockKnowledge.filter({ is_marker: false }, "-updated_date", 1000),
        ]);
        if (!alive) return;
        setBooks(Array.isArray(bookRes) ? bookRes : []);
        setKnowledge(Array.isArray(ackRes) ? ackRes : []);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load catalog");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { books, knowledge, loading, error };
}