import { FaDownload } from 'react-icons/fa';

/*
  Escape a single CSV cell value.

  Rules:
    • undefined / null → empty string
    • string  → wrapped in quotes if it contains a comma, quote,
      newline, or leading/trailing whitespace
    • numbers and booleans → stringified as-is
    • nested quotes → doubled ("")

  This produces output Excel reads correctly.
*/
const escapeCell = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);

    const needsQuoting =
        str.includes(',') ||
        str.includes('"') ||
        str.includes('\n') ||
        str.includes('\r') ||
        /^\s|\s$/.test(str);

    if (!needsQuoting) return str;
    return `"${str.replace(/"/g, '""')}"`;
};

/*
  Build a CSV string from column definitions + rows.

  `columns` is an array of { key, label }.
  `rows` is an array of objects whose keys match the column keys.
*/
const buildCsv = (columns, rows) => {
    const header = columns.map((c) => escapeCell(c.label)).join(',');
    const body = rows
        .map((row) =>
            columns.map((c) => escapeCell(row[c.key])).join(',')
        )
        .join('\n');
    return `${header}\n${body}`;
};

/*
  Trigger a browser download of a text file.
  Uses a Blob + an invisible anchor — the standard no-library approach.
*/
const downloadFile = (filename, contents, mime = 'text/csv;charset=utf-8') => {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    /* Release the object URL on the next tick so the download can start */
    setTimeout(() => URL.revokeObjectURL(url), 0);
};

/* YYYY-MM-DD stamp for the filename */
const dateStamp = () => {
    const d = new Date();
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
    ].join('-');
};

/*
  ReportExportButton — small button that exports the current report's
  rows as a CSV file.

  Props:
    filename  — base name (no extension); a date stamp is appended
    columns   — array of { key, label }
    rows      — array of records
    disabled  — optional; disables the button
*/
const ReportExportButton = ({ filename, columns, rows, disabled }) => {
    const onExport = () => {
        if (!Array.isArray(columns) || columns.length === 0) return;
        if (!Array.isArray(rows)) return;

        const csv = buildCsv(columns, rows);
        const name = `${filename}-${dateStamp()}.csv`;
        downloadFile(name, csv);
    };

    const isEmpty = !rows || rows.length === 0;

    return (
        <button
            onClick={onExport}
            disabled={disabled || isEmpty}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#173ef0] border border-white/10 text-white text-sm font-medium hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={isEmpty ? 'Nothing to export' : 'Download as CSV'}
        >
            <FaDownload className="w-3.5 h-3.5" />
            Export
        </button>
    );
};

export default ReportExportButton;