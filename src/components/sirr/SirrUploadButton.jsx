// ═══════════════════════════════════════════════════════════════
// SIRR UPLOAD BUTTON — PERMANENT MULTI-PART STORAGE
// ═══════════════════════════════════════════════════════════════
// Every uploaded PDF URL is permanently written to the book's
// pdf_parts array IMMEDIATELY at upload time — never kept only in
// conversation state. The background engine rebuilds exclusively
// from the stored pdf_parts list.
//
// Two modes:
//   • "new"   — starts a new SIRR book (Part 1)
//   • "append" — adds the next PDF part to an EXISTING book
//
// A single book may be built from many PDF parts (Part 1 ... Part N).
// Adding a part appends to pdf_parts and resets extraction_status to
// "pending" so the background processor resumes automatically.
// ═══════════════════════════════════════════════════════════════
import { useRef, useState, useEffect } from "react";
import { UploadCloud, Loader2, BookPlus, Layers } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SirrUploadButton({ onUploaded, language }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("new"); // "new" | "append"
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const isMl = language === "ml";

  const loadBooks = () => {
    base44.entities.SirrManuscriptBook.list("-created_date", 200)
      .then((b) => setBooks(b || []))
      .catch(() => {});
  };

  useEffect(() => {
    if (mode === "append") loadBooks();
  }, [mode]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError(isMl ? "PDF ഫയൽ മാത്രം" : "PDF files only");
      return;
    }
    if (mode === "append" && !selectedBookId) {
      setError(isMl ? "ഒരു ഗ്രന്ഥം തിരഞ്ഞെടുക്കുക" : "Select a book first");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // 1. Upload PDF to permanent SIRR storage.
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const file_url = upRes?.file_url || upRes?.data?.file_url;
      if (!file_url) throw new Error("Upload failed");

      const now = new Date().toISOString();
      const stamp = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      const sirr_book_id = mode === "new" ? `SIRRB-${stamp}-${rand}` : selectedBookId;

      if (mode === "new") {
        // 2a. Create a new book with Part 1 permanently stored in pdf_parts.
        await base44.entities.SirrManuscriptBook.create({
          sirr_book_id,
          book_title: file.name,
          original_file_url: file_url,
          original_file_name: file.name,
          source: "sirr_upload",
          upload_date: now,
          extraction_status: "uploading",
          total_pages: 0,
          combined_total_pages: 0,
          total_entries: 0,
          last_processed_page: 0,
          current_part_index: 0,
          pdf_parts: [
            {
              part_id: `SIRRP-${sirr_book_id}-1`,
              part_number: 1,
              file_url,
              file_name: file.name,
              page_start: 1,
              page_end: 0,
              page_count: 0,
              uploaded_at: now,
              processed: false,
              extraction_status: "pending",
              ocr_status: "pending",
              verification_status: "unverified",
            },
          ],
        });
      } else {
        // 2b. Append the next part to the selected existing book.
        const book = books.find((b) => b.sirr_book_id === selectedBookId);
        if (!book) throw new Error("Book not found");
        const existingParts = Array.isArray(book.pdf_parts) ? book.pdf_parts : [];
        const newPartNumber = existingParts.length + 1;
        const newParts = [
          ...existingParts,
          {
            part_id: `SIRRP-${selectedBookId}-${newPartNumber}`,
            part_number: newPartNumber,
            file_url,
            file_name: file.name,
            page_start: 1,
            page_end: 0,
            page_count: 0,
            uploaded_at: now,
            processed: false,
            extraction_status: "pending",
            ocr_status: "pending",
            verification_status: "unverified",
          },
        ];
        const bookRecordId = book.id || book._id;
        await base44.entities.SirrManuscriptBook.update(bookRecordId, {
          pdf_parts: newParts,
          extraction_status: "uploading",
        });
      }

      // 3. Read-back verification — confirm the URL is permanently persisted
      //    in pdf_parts BEFORE reporting this part as uploaded.
      const verifyBookId = mode === "new" ? sirr_book_id : selectedBookId;
      const fetched = await base44.entities.SirrManuscriptBook.filter({ sirr_book_id: verifyBookId }, undefined, 1);
      const savedBook = fetched[0];
      const savedParts = Array.isArray(savedBook?.pdf_parts) ? savedBook.pdf_parts : [];
      const partIdx = savedParts.findIndex((p) => p.file_url === file_url);
      if (partIdx === -1) {
        const failedPartNumber = mode === "new" ? 1 : (savedParts.length + 1);
        throw new Error(`Part ${failedPartNumber} upload FAILED — PDF URL was not persisted in pdf_parts (book ${verifyBookId}). Upload stopped. Please retry this part.`);
      }

      // 4. After Part 1 of a new book, switch to append mode and select this
      //    book so the user can add more parts OR click "Begin Processing".
      if (mode === "new") {
        setMode("append");
        setSelectedBookId(sirr_book_id);
        loadBooks();
      }

      // 5. Refresh the library. Do NOT start processing — the user uploads
      //    all parts first, then clicks "Begin Processing".
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  const selectedBook = books.find((b) => b.sirr_book_id === selectedBookId) || null;

  const handleBeginProcessing = async () => {
    if (!selectedBook) return;
    setBusy(true);
    setError("");
    try {
      await base44.entities.SirrManuscriptBook.update(selectedBook.id || selectedBook._id, {
        extraction_status: "pending",
      });
      base44.functions.invoke("sirrProcessNextChunk", {}).catch(() => {});
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setMode("new")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
            mode === "new" ? "btn-gold" : ""
          }`}
          style={
            mode !== "new"
              ? {
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }
              : {}
          }
        >
          <BookPlus className="w-3.5 h-3.5" />
          {isMl ? "പുതിയ ഗ്രന്ഥം" : "New Book"}
        </button>
        <button
          onClick={() => setMode("append")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
            mode === "append" ? "btn-gold" : ""
          }`}
          style={
            mode !== "append"
              ? {
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }
              : {}
          }
        >
          <Layers className="w-3.5 h-3.5" />
          {isMl ? "ഭാഗം ചേർക്കുക" : "Add Part"}
        </button>
      </div>

      {/* Book selector for append mode */}
      {mode === "append" && (
        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl text-xs"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.80)",
            border: "1px solid rgba(212,175,55,0.15)",
            colorScheme: "dark",
          }}
        >
          <option value="">{isMl ? "ഗ്രന്ഥം തിരഞ്ഞെടുക്കുക..." : "Select book..."}</option>
          {books.map((b) => (
            <option key={b.sirr_book_id} value={b.sirr_book_id}>
              {b.malayalam_book_name || b.book_title}
              {Array.isArray(b.pdf_parts) && b.pdf_parts.length > 0
                ? ` (${b.pdf_parts.length} ${isMl ? "ഭാഗങ്ങൾ" : "parts"})`
                : ""}
            </option>
          ))}
        </select>
      )}

      {/* Begin Processing — only shown when ALL parts have been uploaded.
          The engine ignores 'uploading' books, so nothing is processed until
          the user clicks this. */}
      {mode === "append" && selectedBook?.extraction_status === "uploading" && (
        <button
          onClick={handleBeginProcessing}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)",
            color: "#0d1b2a",
            boxShadow: "0 0 32px rgba(16,185,129,0.45)",
          }}
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Layers className="w-4 h-4" />
              {isMl ? "പ്രോസസ്സിംഗ് ആരംഭിക്കുക" : "Begin Processing"}
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 btn-gold"
      >
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isMl ? "അപ്‌ലോഡ് ചെയ്യുന്നു..." : "Uploading..."}
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            {mode === "new"
              ? isMl
                ? "സിറർ ഗ്രന്ഥം ഇറക്കുമതി ചെയ്യുക (ഭാഗം 1)"
                : "Upload SIRR PDF (Part 1)"
              : isMl
              ? "അടുത്ത ഭാഗം അപ്‌ലോഡ് ചെയ്യുക"
              : "Upload Next PDF Part"}
          </>
        )}
      </button>

      {!busy && !error && (
        <p
          className="font-inter text-[9px] text-center"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          {mode === "new"
            ? isMl
              ? "പുതിയ ഗ്രന്ഥത്തിന്റെ ആദ്യ ഭാഗം അപ്‌ലോഡ് ചെയ്യുക"
              : "Upload the first part of a new manuscript"
            : isMl
            ? "തിരഞ്ഞെടുത്ത ഗ്രന്ഥത്തിലേക്ക് അടുത്ത ഭാഗം ചേർക്കുക"
            : "Append the next part to the selected book"}
        </p>
      )}
      {error && (
        <p className="font-inter text-[10px] text-center" style={{ color: "#F87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}