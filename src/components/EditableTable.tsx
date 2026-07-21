import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

export type Column = {
  id: string;
  label: string;
  width: number;
  align?: "left" | "right";
};
export type Row = Record<string, string> & { __id: string };

type Props = {
  storageKey: string;
  initialColumns: Column[];
  initialRows: Row[];
  title?: string;
  /** Ensure the table body reserves at least this many rows worth of height */
  minVisibleRows?: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const ROW_H = 24;
const HEADER_H = 26;

export default function EditableTable({
  storageKey,
  initialColumns,
  initialRows,
  title,
  minVisibleRows,
}: Props) {
  const [columns] = useState<Column[]>(initialColumns);
  const [rows, setRows] = useState<Row[]>(() => {
    if (typeof window === "undefined") return initialRows;
    try {
      const raw = localStorage.getItem(`et:${storageKey}:rows`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return initialRows;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`et:${storageKey}:rows`, JSON.stringify(rows));
    } catch {}
  }, [rows, storageKey]);

  const addRowAfter = (id: string) => {
    setRows((rs) => {
      const idx = rs.findIndex((r) => r.__id === id);
      const nr: Row = { __id: uid() };
      columns.forEach((c) => (nr[c.id] = ""));
      const next = [...rs];
      next.splice(idx + 1, 0, nr);
      return next;
    });
  };

  const deleteRow = (id: string) =>
    setRows((rs) => (rs.length <= 1 ? rs : rs.filter((r) => r.__id !== id)));

  const updateCell = (rowId: string, colId: string, val: string) => {
    setRows((rs) => rs.map((r) => (r.__id === rowId ? { ...r, [colId]: val } : r)));
  };

  const ACTIONS_W = 56;
  const totalWidth = columns.reduce((s, c) => s + c.width, 0) + ACTIONS_W;
  const minBodyHeight = minVisibleRows ? minVisibleRows * ROW_H : undefined;

  return (
    <div className="border border-ve-border bg-white">
      {title && (
        <div className="flex items-center justify-between border-b border-ve-border bg-ve-sectionBg px-3 py-1">
          <span className="text-[13px] font-semibold text-ve-text">{title}</span>
        </div>
      )}

      <div>
        <div style={{ width: totalWidth, maxWidth: "100%" }}>
          {/* Header */}
          <div
            className="flex bg-ve-headerBg text-[11px] font-semibold text-ve-text"
            style={{ height: HEADER_H }}
          >
            {columns.map((col) => (
              <div
                key={col.id}
                style={{ width: col.width }}
                className="shrink-0 truncate border-r border-ve-border px-1.5 py-1"
              >
                {col.label}
              </div>
            ))}
            <div
              style={{ width: ACTIONS_W }}
              className="shrink-0 border-r border-ve-border px-1.5 py-1 text-center"
            >
              &nbsp;
            </div>
          </div>

          {/* Body */}
          <div style={{ minHeight: minBodyHeight }}>
            {rows.map((row) => (
              <div
                key={row.__id}
                className="group flex border-t border-ve-border text-[12px] hover:bg-ve-rowHover"
                style={{ height: ROW_H }}
              >
                {columns.map((col) => (
                  <div
                    key={col.id}
                    style={{ width: col.width }}
                    className="shrink-0 border-r border-ve-border"
                  >
                    <input
                      value={row[col.id] ?? ""}
                      onChange={(e) => updateCell(row.__id, col.id, e.target.value)}
                      className={`h-[24px] w-full border-0 bg-transparent px-1.5 text-[12px] outline-none focus:bg-white focus:ring-1 focus:ring-ve-accent ${col.align === "right" ? "text-right" : ""}`}
                    />
                  </div>
                ))}
                <div
                  style={{ width: ACTIONS_W }}
                  className="flex shrink-0 items-center justify-center gap-1 border-r border-ve-border"
                >
                  <button
                    type="button"
                    onClick={() => addRowAfter(row.__id)}
                    title="Thêm dòng"
                    className="grid h-4 w-4 place-items-center rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    <Plus className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRow(row.__id)}
                    title="Xoá dòng"
                    className="grid h-4 w-4 place-items-center rounded-full border border-sky-500 text-sky-600 hover:bg-sky-50"
                  >
                    <Minus className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
