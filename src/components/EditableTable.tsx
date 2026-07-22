import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

export type Column = {
  id: string;
  label: string;
  width: number;
  align?: "left" | "right";
};
export type Row = Record<string, string> & { __id: string };

export type FooterCell = { text?: string; input?: boolean; value?: string };
export type FooterRow = { cells: Record<string, FooterCell> };

type Props = {
  storageKey: string;
  initialColumns: Column[];
  initialRows: Row[];
  title?: string;
  minVisibleRows?: number;
  resizable?: boolean;
  hideActions?: boolean;
  titleRight?: React.ReactNode;
  footerRows?: FooterRow[];
  /** Called whenever rows change, so parent can compute totals for footerRows. */
  onRowsChange?: (rows: Row[]) => void;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const ROW_H = 24;
const HEADER_H = 26;
const ACTIONS_W = 56;

export default function EditableTable({
  storageKey,
  initialColumns,
  initialRows,
  title,
  minVisibleRows,
  resizable = false,
  hideActions = false,
  titleRight,
  footerRows,
  onRowsChange,
}: Props) {
  const [columns, setColumns] = useState<Column[]>(() => {
    if (typeof window === "undefined") return initialColumns;
    try {
      const raw = localStorage.getItem(`et:${storageKey}:cols`);
      if (raw) {
        const saved = JSON.parse(raw) as { id: string; width: number }[];
        return initialColumns.map((c) => {
          const s = saved.find((x) => x.id === c.id);
          return s ? { ...c, width: s.width } : c;
        });
      }
    } catch {}
    return initialColumns;
  });

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
    onRowsChange?.(rows);
  }, [rows, storageKey, onRowsChange]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `et:${storageKey}:cols`,
        JSON.stringify(columns.map((c) => ({ id: c.id, width: c.width }))),
      );
    } catch {}
  }, [columns, storageKey]);

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

  /* ---- Column resize ---- */
  const dragRef = useRef<{ idx: number; startX: number; startW: number } | null>(null);
  const onDragStart = (idx: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { idx, startX: e.clientX, startW: columns[idx].width };
    const move = (ev: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const w = Math.max(40, d.startW + (ev.clientX - d.startX));
      setColumns((cs) => cs.map((c, i) => (i === d.idx ? { ...c, width: w } : c)));
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const actionsW = hideActions ? 0 : ACTIONS_W;
  const totalWidth = columns.reduce((s, c) => s + c.width, 0) + actionsW;
  const minBodyHeight = minVisibleRows ? minVisibleRows * ROW_H : undefined;

  return (
    <div className="border border-ve-border bg-white">
      {(title || titleRight) && (
        <div className="flex items-center gap-3 border-b border-ve-border bg-ve-sectionBg px-3 py-1">
          {title && <span className="text-[13px] font-semibold text-ve-text">{title}</span>}
          {titleRight}
        </div>
      )}

      <div style={{ width: totalWidth, maxWidth: "100%" }}>
        {/* Header */}
        <div
          className="flex bg-ve-headerBg text-[11px] font-semibold text-ve-text"
          style={{ height: HEADER_H }}
        >
          {columns.map((col, i) => (
            <div
              key={col.id}
              style={{ width: col.width }}
              className="relative shrink-0 truncate border-r border-ve-border px-1.5 py-1"
            >
              {col.label}
              {resizable && (
                <div
                  onMouseDown={onDragStart(i)}
                  className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-ve-accent/40"
                />
              )}
            </div>
          ))}
          {!hideActions && (
            <div
              style={{ width: ACTIONS_W }}
              className="shrink-0 border-r border-ve-border px-1.5 py-1 text-center"
            >
              &nbsp;
            </div>
          )}
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
              {!hideActions && (
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
              )}
            </div>
          ))}
        </div>

        {/* Footer rows */}
        {footerRows?.map((fr, fi) => (
          <div
            key={fi}
            className="flex border-t border-ve-border bg-ve-headerBg text-[12px] font-semibold text-ve-text"
            style={{ height: ROW_H }}
          >
            {columns.map((col) => {
              const cell = fr.cells[col.id];
              return (
                <div
                  key={col.id}
                  style={{ width: col.width }}
                  className={`shrink-0 border-r border-ve-border px-1.5 py-[3px] truncate ${col.align === "right" ? "text-right" : ""}`}
                >
                  {cell?.input ? (
                    <input
                      defaultValue={cell.value ?? ""}
                      className={`h-[18px] w-full border border-ve-border bg-white px-1 text-[12px] outline-none ${col.align === "right" ? "text-right" : ""}`}
                    />
                  ) : (
                    (cell?.text ?? "")
                  )}
                </div>
              );
            })}
            {!hideActions && (
              <div style={{ width: ACTIONS_W }} className="shrink-0 border-r border-ve-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
