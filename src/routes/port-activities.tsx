import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, X } from "lucide-react";

export const Route = createFileRoute("/port-activities")({
  head: () => ({
    meta: [
      { title: "Port Activities — IMOS" },
      {
        name: "description",
        content:
          "Port activities entry: prev/current port, bunker ROB per fuel type, activity log with times, remarks and draft figures.",
      },
      { property: "og:title", content: "Port Activities — IMOS" },
      {
        property: "og:description",
        content:
          "Log port activities, bunker ROB quantities and arrival/departure drafts for a voyage port call.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PortActivitiesPage,
});

const ACTIVITY_OPTIONS = [
  "END OF SEA PASSAGE",
  "ANCHORED",
  "ANCHOR AWEIGH",
  "ALL FAST (AF)",
  "START CARGO OPERATION",
  "STOP CARGO OPERATION",
  "RESUME CARGO OPERATION",
  "END CARGO OPERATION",
  "UNMOORED",
  "START OF SEA PASSAGE",
];

type ActRow = {
  activity: string;
  at: string;
  remarks: string;
  dateFrom: string;
  time: string;
};

const INITIAL_ROWS: ActRow[] = [
  { activity: "END OF SEA PASSAGE", at: "PS", remarks: "", dateFrom: "", time: "00:00" },
  { activity: "ANCHORED", at: "NM", remarks: "REASON:", dateFrom: "", time: "00:00" },
  { activity: "ANCHOR AWEIGH", at: "NM", remarks: "", dateFrom: "", time: "00:00" },
  { activity: "ALL FAST (AF)", at: "AF", remarks: "BERTH:", dateFrom: "", time: "00:00" },
  { activity: "START CARGO OPERATION", at: "OS", remarks: "CARGO:", dateFrom: "", time: "00:00" },
  { activity: "STOP CARGO OPERATION", at: "OS", remarks: "", dateFrom: "", time: "00:00" },
  { activity: "RESUME CARGO OPERATION", at: "OS", remarks: "", dateFrom: "", time: "00:00" },
  { activity: "END CARGO OPERATION", at: "OE", remarks: "", dateFrom: "", time: "00:00" },
  { activity: "UNMOORED", at: "NM", remarks: "", dateFrom: "", time: "00:00" },
  { activity: "START OF SEA PASSAGE", at: "PE", remarks: "", dateFrom: "", time: "00:00" },
];

function Field({
  label,
  children,
  labelWidth = "w-[110px]",
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 py-[1px]">
      <label className={`${labelWidth} shrink-0 text-right text-[12px] text-ve-label`}>{label}</label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Input({
  value = "",
  align = "left",
  className = "",
}: {
  value?: string;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <input
      defaultValue={value}
      className={`h-[22px] w-full border border-ve-border bg-white px-1.5 text-[12px] text-ve-text outline-none focus:border-ve-accent focus:ring-1 focus:ring-ve-accent/40 ${align === "right" ? "text-right" : ""} ${className}`}
    />
  );
}

function CellInput({
  value = "",
  align = "left",
}: {
  value?: string;
  align?: "left" | "right";
}) {
  return (
    <input
      defaultValue={value}
      className={`h-[20px] w-full min-w-0 bg-transparent px-1.5 text-[12px] tabular-nums text-ve-text outline-none focus:bg-white focus:ring-1 focus:ring-ve-accent/40 ${align === "right" ? "text-right" : ""}`}
    />
  );
}

/* ---------- Bunker ROB grid ---------- */

const ROB_COLS =
  "grid-cols-[70px_repeat(6,minmax(0,1fr))]";

function RobGrid() {
  const heads = ["Type", "ROB Prev", "Sea Cons", "Cons Rate", "ROB Arr", "Received", "PortCons", "ROB Dep"];
  const rows: [string, string][] = [
    ["IFO", "719.512"],
    ["LSF", "500.000"],
    ["LSG", "500.000"],
    ["MGO", "492.867"],
  ];
  return (
    <div className="border border-ve-border bg-white">
      <div className="grid grid-cols-[70px_repeat(7,minmax(0,1fr))] bg-ve-headerBg text-[12px] font-medium text-ve-accent">
        {heads.map((h) => (
          <div
            key={h}
            className={`min-w-0 truncate border-r border-ve-border px-1.5 py-[3px] last:border-r-0 ${h === "Type" ? "" : "text-right"}`}
          >
            {h}
          </div>
        ))}
      </div>
      {rows.map(([t, prev]) => (
        <div
          key={t}
          className="grid grid-cols-[70px_repeat(7,minmax(0,1fr))] border-t border-ve-border"
        >
          <div className="min-w-0 border-r border-ve-border px-1.5 py-[2px] text-[12px] text-ve-text">{t}</div>
          <div className="min-w-0 border-r border-ve-border"><CellInput value={prev} align="right" /></div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-0 border-r border-ve-border last:border-r-0">
              <CellInput value="0.000" align="right" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Port activities grid ---------- */

const ACT_COLS =
  "grid-cols-[minmax(0,2.2fr)_60px_minmax(0,1.2fr)_minmax(0,1.1fr)_80px_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]";

function ActivitiesGrid() {
  const [rows, setRows] = useState<ActRow[]>(INITIAL_ROWS);

  const update = (i: number, activity: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, activity } : row)));

  return (
    <div className="border border-ve-border bg-white">
      {/* Bunker Quantity ROB spanning header */}
      <div className={`grid ${ACT_COLS} bg-ve-sectionBg text-[12px] font-medium text-ve-text`}>
        <div className="col-span-5" />
        <div className="col-span-4 border-l border-ve-border px-1.5 py-[3px] text-center">
          Bunker Quantity ROB
        </div>
      </div>
      <div className={`grid ${ACT_COLS} border-t border-ve-border bg-ve-headerBg text-[12px] font-medium text-ve-accent`}>
        {["Activity", "AT", "Remarks", "Date From", "Time"].map((h) => (
          <div key={h} className="min-w-0 truncate border-r border-ve-border px-1.5 py-[3px]">
            {h}
          </div>
        ))}
        {["IFO", "LSO", "MGO", "LSG"].map((h) => (
          <div key={h} className="min-w-0 truncate border-r border-ve-border px-1.5 py-[3px] text-right last:border-r-0">
            {h}
          </div>
        ))}
      </div>

      {rows.map((row, i) => (
        <div
          key={i}
          className={`grid ${ACT_COLS} border-t border-ve-border ${i % 2 ? "bg-ve-headerBg/60" : ""}`}
        >
          <div className="min-w-0 border-r border-ve-border">
            <select
              value={row.activity}
              onChange={(e) => update(i, e.target.value)}
              className="h-[20px] w-full min-w-0 cursor-pointer bg-transparent px-1 text-[12px] text-ve-text outline-none focus:bg-white focus:ring-1 focus:ring-ve-accent/40"
            >
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 border-r border-ve-border"><CellInput value={row.at} /></div>
          <div className="min-w-0 border-r border-ve-border"><CellInput value={row.remarks} /></div>
          <div className="min-w-0 border-r border-ve-border"><CellInput value={row.dateFrom} /></div>
          <div className="min-w-0 border-r border-ve-border"><CellInput value={row.time} align="right" /></div>
          {Array.from({ length: 4 }).map((_, k) => (
            <div key={k} className="min-w-0 border-r border-ve-border last:border-r-0">
              <CellInput align="right" />
            </div>
          ))}
        </div>
      ))}

      {/* filler space */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={`f${i}`} className={`grid ${ACT_COLS} border-t border-ve-border`}>
          {Array.from({ length: 9 }).map((_, k) => (
            <div key={k} className="h-[20px] min-w-0 border-r border-ve-border last:border-r-0" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Page ---------- */

function PortActivitiesPage() {
  return (
    <div className="min-h-screen bg-ve-app text-ve-text">
      <div className="mx-auto min-h-screen max-w-[1400px] border-x border-ve-border bg-white px-4 py-3">
        {/* Title */}
        <div className="flex items-start">
          <div>
            <h1 className="text-[18px] font-bold text-ve-text">Port Activities</h1>
            <div className="text-[13px] font-semibold text-ve-label">Mv Vinaship Unity , Voy No.</div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-ve-accent">
            <button className="ve-tool-btn" aria-label="Minimize"><Minus className="h-4 w-4" /></button>
            <button className="ve-tool-btn" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Header area */}
        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div className="w-[260px] shrink-0">
            <Field label="Prev Port"><Input value="SUEZ CANAL" /></Field>
            <Field label="Curr Port"><Input value="ROTTERDAM" /></Field>
            <Field label="Function"><Input value="LOADING" /></Field>
            <Field label="Arrival"><Input value="10/13/15 22:42" align="right" /></Field>
            <Field label="Departure"><Input value="10/15/15 22:42" align="right" /></Field>
          </div>

          <div className="w-[80px] shrink-0">
            <div className="text-[12px] font-semibold text-ve-text">Rotation</div>
            <div className="mt-[2px]"><Input value="2.0" align="right" /></div>
            <div className="mt-[6px] text-[12px] font-semibold text-ve-text">GMT</div>
            <div className="mt-[2px]"><Input value="2.0" align="right" /></div>
            <div className="mt-[2px]"><Input value="2.0" align="right" /></div>
          </div>

          <div className="min-w-[520px] flex-1">
            <RobGrid />
          </div>
        </div>

        {/* Activities */}
        <div className="mt-6">
          <div className="flex items-end gap-4 border-b border-ve-accent/40">
            <div className="border-b-2 border-b-ve-accent px-1 pb-1 text-[13px] font-semibold uppercase tracking-wide text-ve-accent">
              Port Activities
            </div>
            <button className="mb-1 bg-ve-titleBar px-3 py-1 text-[12px] font-medium text-ve-titleBarText hover:opacity-90">
              Sort Activities
            </button>
          </div>
          <div className="mt-1 overflow-x-auto">
            <ActivitiesGrid />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap items-start gap-10">
          <div className="w-[260px]">
            <Field label="Arrival Draft Fwd (m)" labelWidth="w-[150px]">
              <Input value="0.00" align="right" />
            </Field>
            <Field label="Arrival Draft Aft (m)" labelWidth="w-[150px]">
              <Input value="0.00" align="right" />
            </Field>
          </div>
          <div className="w-[290px]">
            <Field label="Departure Draft Fwd (m)" labelWidth="w-[170px]">
              <Input value="0.00" align="right" />
            </Field>
            <Field label="Departure Draft Aft (m)" labelWidth="w-[170px]">
              <Input value="0.00" align="right" />
            </Field>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {["Save", "Cancel", "Close"].map((b) => (
              <button
                key={b}
                className="h-[30px] w-[130px] border border-ve-text bg-white text-[13px] text-ve-text hover:bg-ve-rowHover"
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
