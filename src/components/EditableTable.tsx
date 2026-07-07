import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronDown, Plus, Trash2, SplitSquareHorizontal, ArrowLeftRight } from "lucide-react";
import { useViewMode } from "@/lib/view-mode";

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
  minColWidth?: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function EditableTable({
  storageKey,
  initialColumns,
  initialRows,
  title,
}: Props) {
  const { mode } = useViewMode();
  const isFinal = mode === "final";
  const [columns, setColumns] = useState<Column[]>(() => {
    if (typeof window === "undefined") return initialColumns;
    try {
      const raw = localStorage.getItem(`et:${storageKey}:cols`);
      if (raw) return JSON.parse(raw);
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
    try { localStorage.setItem(`et:${storageKey}:cols`, JSON.stringify(columns)); } catch {}
  }, [columns, storageKey]);
  useEffect(() => {
    try { localStorage.setItem(`et:${storageKey}:rows`, JSON.stringify(rows)); } catch {}
  }, [rows, storageKey]);

  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const resizingRef = useRef<{ id: string; startX: number; startW: number } | null>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const r = resizingRef.current;
    if (!r) return;
    const dx = e.clientX - r.startX;
    const newW = Math.max(minColWidth, r.startW + dx);
    setColumns((cs) => cs.map((c) => (c.id === r.id ? { ...c, width: newW } : c)));
  }, [minColWidth]);

  const onMouseUp = useCallback(() => {
    resizingRef.current = null;
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const startResize = (e: React.MouseEvent, col: Column) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = { id: col.id, startX: e.clientX, startW: col.width };
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const addColumn = (atIndex?: number) => {
    setColumns((cs) => {
      const newCol: Column = { id: uid(), label: "New Col", width: 90 };
      if (atIndex == null) return [...cs, newCol];
      const next = [...cs];
      next.splice(atIndex, 0, newCol);
      return next;
    });
  };

  const deleteColumn = (id: string) => {
    setColumns((cs) => cs.filter((c) => c.id !== id));
    setMenuFor(null);
  };

  const splitColumn = (id: string) => {
    setColumns((cs) => {
      const idx = cs.findIndex((c) => c.id === id);
      if (idx < 0) return cs;
      const orig = cs[idx];
      const halfW = Math.max(minColWidth, Math.floor(orig.width / 2));
      const left: Column = { ...orig, width: halfW, label: orig.label + " A" };
      const right: Column = { id: uid(), label: orig.label + " B", width: halfW };
      const next = [...cs];
      next.splice(idx, 1, left, right);
      return next;
    });
    setMenuFor(null);
  };

  const renameColumn = (id: string, label: string) => {
    setColumns((cs) => cs.map((c) => (c.id === id ? { ...c, label } : c)));
  };

  const toggleAlign = (id: string) => {
    setColumns((cs) => cs.map((c) => (c.id === id ? { ...c, align: c.align === "right" ? "left" : "right" } : c)));
    setMenuFor(null);
  };

  const addRow = () => {
    const r: Row = { __id: uid() };
    columns.forEach((c) => (r[c.id] = ""));
    setRows((rs) => [...rs, r]);
  };

  const deleteRow = (id: string) => setRows((rs) => rs.filter((r) => r.__id !== id));

  const updateCell = (rowId: string, colId: string, val: string) => {
    setRows((rs) => rs.map((r) => (r.__id === rowId ? { ...r, [colId]: val } : r)));
  };

  const resetTable = () => {
    if (!confirm("Reset bảng về mặc định?")) return;
    setColumns(initialColumns);
    setRows(initialRows);
  };

  const totalWidth = columns.reduce((s, c) => s + c.width, 0) + 32; // + row handle

  return (
    <div className="border border-ve-border bg-white">
      {title && (
        <div className="flex items-center justify-between border-b border-ve-border bg-ve-sectionBg px-3 py-1">
          <span className="text-[13px] font-semibold text-ve-text">{title}</span>
          <div className="flex items-center gap-2 text-[11px]">
            <button onClick={() => addColumn()} className="flex items-center gap-1 rounded border border-ve-border bg-white px-2 py-0.5 hover:bg-ve-rowHover">
              <Plus className="h-3 w-3" /> Thêm cột
            </button>
            <button onClick={addRow} className="flex items-center gap-1 rounded border border-ve-border bg-white px-2 py-0.5 hover:bg-ve-rowHover">
              <Plus className="h-3 w-3" /> Thêm dòng
            </button>
            <button onClick={resetTable} className="text-ve-label hover:text-ve-text">Reset</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div style={{ width: totalWidth }}>
          {/* Header */}
          <div className="flex bg-ve-headerBg text-[11px] font-semibold text-ve-text">
            <div className="w-8 shrink-0 border-r border-ve-border px-1 py-1 text-center">#</div>
            {columns.map((col, idx) => (
              <div
                key={col.id}
                style={{ width: col.width }}
                className="relative shrink-0 border-r border-ve-border px-1.5 py-1"
              >
                <div className="flex items-center justify-between gap-1">
                  {editingHeader === col.id ? (
                    <input
                      autoFocus
                      defaultValue={col.label}
                      onBlur={(e) => { renameColumn(col.id, e.target.value); setEditingHeader(null); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { renameColumn(col.id, (e.target as HTMLInputElement).value); setEditingHeader(null); }
                        if (e.key === "Escape") setEditingHeader(null);
                      }}
                      className="h-5 min-w-0 flex-1 border border-ve-accent bg-white px-1 text-[11px] outline-none"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => setEditingHeader(col.id)}
                      className="min-w-0 flex-1 cursor-text truncate"
                      title="Double-click để đổi tên"
                    >
                      {col.label}
                    </span>
                  )}
                  <button
                    onClick={() => setMenuFor(menuFor === col.id ? null : col.id)}
                    className="shrink-0 rounded p-0.5 text-ve-label hover:bg-white hover:text-ve-text"
                    aria-label="Column menu"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>

                {menuFor === col.id && (
                  <div
                    className="absolute left-0 top-full z-20 mt-0.5 w-44 rounded border border-ve-border bg-white py-1 text-[12px] shadow-lg"
                    onMouseLeave={() => setMenuFor(null)}
                  >
                    <button onClick={() => { setEditingHeader(col.id); setMenuFor(null); }} className="block w-full px-3 py-1 text-left hover:bg-ve-rowHover">Đổi tên</button>
                    <button onClick={() => { addColumn(idx); setMenuFor(null); }} className="flex w-full items-center gap-2 px-3 py-1 text-left hover:bg-ve-rowHover">
                      <Plus className="h-3 w-3" /> Chèn cột trái
                    </button>
                    <button onClick={() => { addColumn(idx + 1); setMenuFor(null); }} className="flex w-full items-center gap-2 px-3 py-1 text-left hover:bg-ve-rowHover">
                      <Plus className="h-3 w-3" /> Chèn cột phải
                    </button>
                    <button onClick={() => splitColumn(col.id)} className="flex w-full items-center gap-2 px-3 py-1 text-left hover:bg-ve-rowHover">
                      <SplitSquareHorizontal className="h-3 w-3" /> Chia cột (split)
                    </button>
                    <button onClick={() => toggleAlign(col.id)} className="flex w-full items-center gap-2 px-3 py-1 text-left hover:bg-ve-rowHover">
                      <ArrowLeftRight className="h-3 w-3" /> Đảo căn lề
                    </button>
                    <div className="my-1 border-t border-ve-border" />
                    <button onClick={() => deleteColumn(col.id)} className="flex w-full items-center gap-2 px-3 py-1 text-left text-red-600 hover:bg-ve-rowHover">
                      <Trash2 className="h-3 w-3" /> Xóa cột
                    </button>
                  </div>
                )}

                {/* Resize handle */}
                <div
                  onMouseDown={(e) => startResize(e, col)}
                  className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize hover:bg-ve-accent/60"
                />
              </div>
            ))}
          </div>

          {/* Body */}
          {rows.map((row) => (
            <div key={row.__id} className="group flex border-t border-ve-border text-[12px] hover:bg-ve-rowHover">
              <div className="flex w-8 shrink-0 items-center justify-center border-r border-ve-border text-ve-label">
                <button
                  onClick={() => deleteRow(row.__id)}
                  className="opacity-0 group-hover:opacity-100"
                  title="Xóa dòng"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
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
            </div>
          ))}

          {/* Add row */}
          <div className="border-t border-ve-border py-1 text-center">
            <button onClick={addRow} className="text-[12px] text-ve-accent hover:underline">
              + Thêm dòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
