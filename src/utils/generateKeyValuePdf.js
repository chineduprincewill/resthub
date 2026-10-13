import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Format a value for display in the PDF.
 * Handles strings, numbers, booleans, arrays of tuples, nested objects, dates.
 */
const formatValue = (value) => {
    if (value == null || value === '') return '—';

    // Array of tuples (e.g. radio results: [["RIF","R","2026-01-12"], ...])
    if (Array.isArray(value)) {
        // If every item is a tuple/array, render as "drug: result (date)" lines
        if (value.every(item => Array.isArray(item))) {
            return value
                .map(([drug, result, date]) => `${drug}: ${result} (${date})`)
                .join('\n');
        }
        // Otherwise just join primitives
        return value.map(v => String(v)).join(', ');
    }

    // Plain object — flatten one level
    if (typeof value === 'object') {
        // Try to detect a {drug: {result, date}} shape
        const entries = Object.entries(value);
        const looksLikeRadio = entries.every(
            ([, v]) => v && typeof v === 'object' && 'result' in v
        );
        if (looksLikeRadio) {
            return entries
                .map(([drug, v]) => `${drug}: ${v.result} (${v.date ?? '—'})`)
                .join('\n');
        }
        return JSON.stringify(value);
    }

    return String(value);
};

/**
 * Human-friendly label: "Treatment Year (YYYY)" → "Treatment Year (YYYY)"
 * (You can add snake_case → Title Case conversion here if you want.)
 */
const formatKey = (key) => {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * Generate a PDF of key/value pairs from an object.
 *
 * @param {Object} data        - The object to render (e.g. editrecord)
 * @param {Object} [options]
 * @param {string} [options.title='Record Details']
 * @param {string} [options.filename='record.pdf']
 * @param {string[]} [options.exclude=[]]  - Keys to skip (e.g. ['form_id'])
 * @param {string} [options.subtitle]      - Optional line under the title
 * @returns {jsPDF} The jsPDF instance (so caller can .save() or .output())
 */
export function generateKeyValuePdf(data, options = {}) {
    const {
        title = 'Record Details',
        filename = 'record.pdf',
        exclude = ['form_id'],
        subtitle,
    } = options;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;

    // ── Header ───────────────────────────────────────────
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, margin);

    let cursorY = margin + 18;

    if (subtitle) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(subtitle, margin, cursorY);
        doc.setTextColor(0);
        cursorY += 14;
    }

    doc.setDrawColor(200);
    doc.line(margin, cursorY + 4, pageWidth - margin, cursorY + 4);
    cursorY += 12;

    // ── Build rows ───────────────────────────────────────
    const excludedSet = new Set(exclude);
    const rows = Object.entries(data || {})
        .filter(([key]) => !excludedSet.has(key))
        .map(([key, value]) => [formatKey(key), formatValue(value)]);

    // ── Table ────────────────────────────────────────────
    autoTable(doc, {
        startY: cursorY,
        head: [['Field', 'Value']],
        body: rows,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 6,
            valign: 'top',
            overflow: 'linebreak',
        },
        headStyles: {
            fillColor: [30, 41, 59],
            textColor: 255,
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { cellWidth: 160, fontStyle: 'bold', fillColor: [245, 247, 250] },
            1: { cellWidth: 'auto' },
        },
        alternateRowStyles: { fillColor: [250, 250, 252] },
        margin: { left: margin, right: margin },

        // Footer on every page
        didDrawPage: (dataArg) => {
            const pageCount = doc.internal.getNumberOfPages();
            const current = doc.internal.getCurrentPageInfo().pageNumber;
            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text(
                `Page ${current} of ${pageCount}`,
                pageWidth - margin,
                doc.internal.pageSize.getHeight() - 20,
                { align: 'right' }
            );
            doc.setTextColor(0);
        },
    });

    // ── Save ─────────────────────────────────────────────
    doc.save(filename);
    return doc;
}