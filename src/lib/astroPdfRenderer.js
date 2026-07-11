// ═══════════════════════════════════════════════════════════════
// ASTRO PDF RENDERER — Client-side PDF page → image conversion
// Uses pdfjs-dist to render each PDF page to a PNG blob.
// Pages are rendered STRICTLY IN ORDER (1, 2, 3, ...) to preserve
// manuscript page sequence. No parallel rendering.
// ═══════════════════════════════════════════════════════════════
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const RENDER_SCALE = 2;

/**
 * Render every page of a PDF file to a PNG blob, IN ORDER.
 * @param {File} file — the PDF file selected by the user
 * @param {function} onProgress — called with (pageNumber, totalPages) per page
 * @returns {Promise<Array<{page_number: number, blob: Blob}>>} — ordered page images
 */
export async function renderPdfPages(file, onProgress) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (onProgress) onProgress(i, totalPages);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
    pages.push({ page_number: i, blob });
    // Release canvas memory immediately
    canvas.width = 0;
    canvas.height = 0;
    page.cleanup();
  }

  pdf.destroy();
  return pages;
}