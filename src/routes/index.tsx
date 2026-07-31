import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Save,
  Trash2,
  ChevronDown,
  FileText,
  Lock,
  RefreshCw,
  AlertTriangle,
  Globe,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import EditableTable, {
  type Column,
  type Row,
  type FooterRow,
} from "@/components/EditableTable";
import * as T from "@/components/itinerary-tabs";
import { ViewModeProvider, useViewMode } from "@/lib/view-mode";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IMOS Voyage Estimator" },
      {
        name: "description",
        content: "IMOS Voyage Estimator — P&L, cargoes, bunkers and itinerary grids.",
      },
      { property: "og:title", content: "IMOS Voyage Estimator" },
      {
        property: "og:description",
        content: "IMOS Voyage Estimator — P&L, cargoes, bunkers and itinerary grids.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VoyageEstimator,
});


/* ---------- Reusable bits ---------- */

function Field({
  label,
  children,
  labelWidth = "w-28",
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 py-[1px]">
      <label className={`${labelWidth} shrink-0 text-[12px] text-ve-label`}>{label}</label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Input({
  value = "",
  align = "left",
  className = "",
  disabled = false,
}: {
  value?: string;
  align?: "left" | "right";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <input
      defaultValue={value}
      disabled={disabled}
      className={`h-[22px] w-full border border-ve-border bg-white px-1.5 text-[12px] text-ve-text outline-none focus:border-ve-accent focus:ring-1 focus:ring-ve-accent/40 disabled:bg-ve-disabled ${align === "right" ? "text-right" : ""} ${className}`}
    />
  );
}

function Select({ value = "" }: { value?: string }) {
  return (
    <div className="relative">
      <input
        defaultValue={value}
        className="h-[22px] w-full border border-ve-border bg-white px-1.5 pr-6 text-[12px] text-ve-text outline-none focus:border-ve-accent focus:ring-1 focus:ring-ve-accent/40"
      />
      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-ve-label" />
    </div>
  );
}

function Toolbar() {
  const { mode, setMode } = useViewMode();
  return (
    <div className="flex items-center gap-1 border-b border-ve-border bg-ve-toolbar px-2 py-1 text-[12px]">
      <button
        onClick={() => setMode(mode === "edit" ? "final" : "edit")}
        className={`ve-tool-btn flex items-center gap-1 rounded px-2 font-semibold ${mode === "final" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
        title="Chuyển chế độ chỉnh sửa / final"
      >
        {mode === "final" ? "Final (Read-only)" : "Editing (WYSIWYG)"}
      </button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn" aria-label="Add">
        <Plus className="h-4 w-4 text-ve-accent" />
      </button>
      <button className="ve-tool-btn" aria-label="Search">
        <Search className="h-4 w-4 text-ve-accent" />
      </button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn flex items-center gap-1 px-2 font-semibold text-ve-text">
        <Save className="h-4 w-4 text-ve-accent" /> Save
      </button>
      <button className="ve-tool-btn" aria-label="Delete">
        <Trash2 className="h-4 w-4 text-ve-label" />
      </button>
      <button className="ve-tool-btn flex items-center gap-1 px-2">
        Menu <ChevronDown className="h-3 w-3" />
      </button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn px-2 text-ve-accent hover:underline">Add Cargo</button>
      <button className="ve-tool-btn px-2 text-ve-accent hover:underline">Schedule Voyage</button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn flex items-center gap-1 px-2">
        <FileText className="h-4 w-4 text-ve-label" /> Reports{" "}
        <ChevronDown className="h-3 w-3" />
      </button>
      <button className="ve-tool-btn" aria-label="Lock">
        <Lock className="h-4 w-4 text-emerald-600" />
      </button>
      <button className="ve-tool-btn flex items-center gap-1 px-2">
        <RefreshCw className="h-4 w-4 text-ve-accent" /> Refresh Market Rates
      </button>
      <AlertTriangle className="ml-1 h-4 w-4 text-amber-500" />
      <div className="ml-auto pr-1">
        <Globe className="h-4 w-4 text-ve-accent" />
      </div>
    </div>
  );
}

/* ---------- Section: header form (Vessel + Bunkers grid) ---------- */

const bunkerColumns: Column[] = [
  { id: "name", label: "Name", width: 70 },
  { id: "symbol", label: "Symbol", width: 70 },
  { id: "basis", label: "Basis", width: 70 },
  { id: "price", label: "Price", width: 70, align: "right" },
  { id: "sBal", label: "S Bal", width: 60, align: "right" },
  { id: "sLad", label: "S Lad", width: 60, align: "right" },
  { id: "pLd", label: "P Ld", width: 60, align: "right" },
  { id: "pDis", label: "P Dis", width: 60, align: "right" },
  { id: "idle", label: "Idle", width: 60, align: "right" },
];
const bunkerData: Row[] = [
  { __id: "b1", name: "IFO", symbol: "", basis: "", price: "531.98", sBal: "12.00", sLad: "12.00", pLd: "5.00", pDis: "5.00", idle: "1.00" },
  { __id: "b2", name: "LSF", symbol: "", basis: "", price: "550.00", sBal: "12.00", sLad: "12.00", pLd: "5.00", pDis: "5.00", idle: "1.00" },
  { __id: "b3", name: "MDO", symbol: "", basis: "", price: "650.00", sBal: "0.10", sLad: "0.10", pLd: "2.00", pDis: "2.00", idle: "1.00" },
  { __id: "b4", name: "LSG", symbol: "", basis: "", price: "700.00", sBal: "0.10", sLad: "0.10", pLd: "2.00", pDis: "2.00", idle: "1.00" },
];

const bunkerPlanPorts = [
  { port: "HONG KONG", f: "C" },
  { port: "CAPE OF GOOD HOPE", f: "P" },
  { port: "ENGLISH CHANNEL", f: "P" },
  { port: "ROTTERDAM", f: "L" },
  { port: "ENGLISH CHANNEL", f: "P" },
  { port: "CAPE OF GOOD HOPE", f: "P" },
  { port: "FUJAIRAH", f: "D" },
];

const BP_GRADES = ["VLS0.5%", "LSG", "MDO", "MGO"];

function BpField({
  label,
  labelWidth = "w-24",
  children,
}: {
  label: string;
  labelWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 py-[1px]">
      <label className={`${labelWidth} shrink-0 text-right text-[12px] text-ve-text`}>
        {label}
      </label>
      {children}
    </div>
  );
}

function BunkerPlanningModal({ onClose }: { onClose: () => void }) {
  const [grade, setGrade] = useState(0);
  const cols = [
    { id: "port", label: "Port Name", w: 190, align: "left" },
    { id: "f", label: "F", w: 34, align: "left" },
    { id: "sea", label: "Sea Cons", w: 100, align: "right" },
    { id: "robArr", label: "ROB Arr", w: 100, align: "right" },
    { id: "portCons", label: "Port Cons", w: 100, align: "right" },
    { id: "receive", label: "Receive", w: 100, align: "right" },
    { id: "price", label: "Price", w: 100, align: "right" },
    { id: "robDep", label: "ROB Dep", w: 100, align: "right" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
      <div className="w-full max-w-[820px] border border-ve-border bg-ve-app shadow-xl">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-ve-titleBar px-3 py-2">
          <span className="text-[13px] font-bold text-ve-titleBarText">
            Bunker Planning: Estimate ADM-000189
          </span>
          <div className="flex items-center gap-3">
            <button type="button" className="text-ve-titleBarText/80 hover:text-ve-titleBarText">
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-ve-titleBarText/80 hover:text-ve-titleBarText"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Grade tabs */}
        <div className="flex items-end gap-4 px-4 pt-3 text-[12px]">
          {BP_GRADES.map((g, i) => (
            <button
              key={g}
              type="button"
              onClick={() => setGrade(i)}
              className={`pb-1 ${i === grade ? "border-b-2 border-b-ve-accent font-semibold text-ve-text" : "text-ve-label hover:text-ve-text"}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Top fields */}
        <div className="flex flex-wrap items-start gap-x-6 gap-y-1 px-4 pt-3">
          <div>
            <BpField label="Init Quantity">
              <div className="w-24"><Input value="458.000" align="right" disabled /></div>
            </BpField>
            <BpField label="End Quantity">
              <div className="w-24"><Input value="458.000" align="right" disabled /></div>
            </BpField>
          </div>
          <div>
            <BpField label="Init Price" labelWidth="w-16">
              <div className="w-24"><Input value="0.00" align="right" /></div>
            </BpField>
            <BpField label="End Price" labelWidth="w-16">
              <div className="w-24"><Input value="0.00" align="right" /></div>
            </BpField>
          </div>
          <div>
            <BpField label="Calc Method" labelWidth="w-20">
              <div className="w-28"><Input value="FIFO" /></div>
            </BpField>
            <label className="flex items-center gap-1.5 pt-1 text-[12px] text-ve-text">
              <input type="checkbox" className="h-3.5 w-3.5" />
              Transfer Received When Fixing
            </label>
          </div>
          <div className="ml-auto">
            <BpField label="Total Cons" labelWidth="w-20">
              <div className="w-28"><Input value="0.000" align="right" disabled /></div>
            </BpField>
          </div>
        </div>

        {/* Grid */}
        <div className="px-4 pt-3">
          <div className="overflow-x-auto border border-ve-border bg-white">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-ve-sectionBg">
                  {cols.map((c) => (
                    <th
                      key={c.id}
                      style={{ width: c.w }}
                      className={`border-b border-r border-ve-border px-1.5 py-1 font-semibold text-ve-text ${c.align === "right" ? "text-right" : "text-left"}`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bunkerPlanPorts.map((r, i) => (
                  <tr key={`${r.port}-${i}`} className={i % 2 ? "bg-ve-altRow" : "bg-white"}>
                    <td className="border-r border-ve-border px-1.5 py-[3px] font-semibold text-ve-text">
                      {r.port}
                    </td>
                    <td className="border-r border-ve-border px-1.5 py-[3px]">{r.f}</td>
                    <td className="border-r border-ve-border px-1.5 py-[3px] text-right tabular-nums">0.000</td>
                    <td className="border-r border-ve-border px-1.5 py-[3px] text-right tabular-nums">458.000</td>
                    <td className="border-r border-ve-border px-1.5 py-[3px] text-right tabular-nums">0.00</td>
                    <td className="border-r border-ve-border px-1.5 py-[3px] text-right tabular-nums"></td>
                    <td className="border-r border-ve-border px-1.5 py-[3px] text-right tabular-nums"></td>
                    <td className="px-1.5 py-[3px] text-right tabular-nums">458.000</td>
                  </tr>
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`empty${i}`} className={(bunkerPlanPorts.length + i) % 2 ? "bg-ve-altRow" : "bg-white"}>
                    {cols.map((c) => (
                      <td key={c.id} className="border-r border-ve-border px-1.5 py-[3px]">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals row */}
        <div className="flex items-center gap-2 px-4 pt-2 text-[12px]">
          <span className="w-[190px] text-right font-semibold text-ve-text">Totals</span>
          <div className="w-[100px]"><Input value="0.000" align="right" disabled /></div>
          <div className="w-[100px]" />
          <div className="w-[100px]"><Input value="0.000" align="right" disabled /></div>
          <div className="w-[100px]"><Input value="0.000" align="right" disabled /></div>
          <label className="flex items-center gap-1.5 text-ve-text">
            <input type="checkbox" className="h-3.5 w-3.5" /> Disable Backup Fuels
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 pt-1 text-[12px]">
          <span className="text-ve-text">Fuel Zone Set</span>
          <div className="w-40"><Input /></div>
        </div>

        {/* Bottom options */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3 text-[12px]">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-ve-text">
              <input type="checkbox" className="h-3.5 w-3.5" /> Optimize Liftings for Cargo:
              <span className="w-40"><Input disabled /></span>
            </label>
            <label className="flex items-center gap-1.5 text-ve-text">
              <input type="checkbox" className="h-3.5 w-3.5" /> Use Scrubber
            </label>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-ve-text">CO2 Price Per MT</span>
            <div className="w-16"><Input value="EUR" /></div>
            <div className="w-20"><Input value="80.000" align="right" /></div>
            <span className="text-ve-text">CO2 Exchange Rate</span>
            <div className="w-20"><Input value="0.952" align="right" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}


function HeaderSection() {
  const [planOpen, setPlanOpen] = useState(false);
  return (
    <div className="flex gap-2 border-b border-ve-border bg-white py-1.5 pl-2 pr-0">
      {/* Column 1 */}
      <div className="min-w-0 flex-1">
        <Field label="Vessel" labelWidth="w-24">
          <Select value="" />
        </Field>
        <Field label="TC In Code" labelWidth="w-24"><Input /></Field>
        <Field label="Vessel DWT" labelWidth="w-24"><Input value="34,752" align="right" /></Field>
        <Field label="Dly Hire/Addr" labelWidth="w-24">
          <div className="flex gap-1">
            <Input value="0.00" align="right" />
            <Input value="0.00" align="right" />
          </div>
        </Field>
        <Field label="Hire Comm (%)" labelWidth="w-24"><Input value="0.00" align="right" /></Field>
        <Field label="DWF %" labelWidth="w-24"><Input value="7.00" align="right" /></Field>
        <Field label="Spd Bal/Ldn (kn)" labelWidth="w-24">
          <div className="flex gap-1">
            <Input value="12.00" align="right" />
            <Input value="11.50" align="right" />
          </div>
        </Field>
        <Field label="Category" labelWidth="w-24"><Input /></Field>
        <Field label="Commencing" labelWidth="w-24"><Input value="10/01/22 19:26" /></Field>
        <Field label="Completing" labelWidth="w-24"><Input value="27/01/22 12:17" /></Field>
        <Field label="Voyage Days" labelWidth="w-24"><Input value="16.6607" align="right" /></Field>
      </div>

      {/* Column 2 */}
      <div className="min-w-0 flex-1">
        <Field label="Ballast Port" labelWidth="w-28"><Input value="DUMAI" /></Field>
        <Field label="Reposition Port" labelWidth="w-28"><Input /></Field>
        <Field label="Ballast Bonus" labelWidth="w-28"><Input value="0.00" align="right" /></Field>
        <Field label="Opr Type" labelWidth="w-28"><Input value="TCOV" /></Field>
        <Field label="Chtr Specialist" labelWidth="w-28"><Input disabled /></Field>
        <Field label="Company" labelWidth="w-28"><Input value="VESON" /></Field>
        <Field label="Trade Area" labelWidth="w-28"><Input /></Field>
        <Field label="Piracy Routing" labelWidth="w-28"><Input value="Default" /></Field>
        <Field label="ECA Routing" labelWidth="w-28">
          <div className="flex gap-1">
            <Input value="Enabled" />
            <Input value="19 items selec" className="text-ve-accent" />
          </div>
        </Field>
        <Field label="Load Line Routing" labelWidth="w-28"><Input value="Default" /></Field>
      </div>

      {/* Bunker grid (flush to P&L on the right) */}
      <div className="shrink-0">
        <EditableTable
          storageKey="bunkers"
          title="Bunkers"
          initialColumns={bunkerColumns}
          initialRows={bunkerData}
          titleRight={
            <button
              type="button"
              onClick={() => setPlanOpen(true)}
              className="ve-tool-btn ml-auto px-2 text-[12px] font-semibold text-ve-accent"
            >
              Bunker planning
            </button>
          }
        />
        <div className="mt-1 px-1 text-[12px]">
          <label className="inline-flex items-center gap-1">
            <input type="checkbox" className="h-3 w-3" /> Use Scrubber
          </label>
        </div>
      </div>

      {planOpen && <BunkerPlanningModal onClose={() => setPlanOpen(false)} />}
    </div>
  );
}

/* ---------- Cargoes ---------- */

const cargoColumns: Column[] = [
  { id: "n", label: "N", width: 40, align: "right" },
  { id: "id", label: "ID", width: 60 },
  { id: "group", label: "Group", width: 110 },
  { id: "qty", label: "C/P Qty", width: 80, align: "right" },
  { id: "unit", label: "Unit", width: 60 },
  { id: "opt", label: "Opt %", width: 70, align: "right" },
  { id: "optType", label: "Opt Type", width: 80 },
  { id: "t", label: "T", width: 40 },
  { id: "frt", label: "Frt Rate", width: 80, align: "right" },
  { id: "lump", label: "Lumpsum", width: 100, align: "right" },
  { id: "comm", label: "Comm%", width: 70, align: "right" },
  { id: "chtr", label: "Charterer", width: 120 },
  { id: "curr", label: "Curr", width: 60 },
  { id: "exch", label: "Exch Rate", width: 80 },
];
const cargoData: Row[] = [
  { __id: "c1", n: "1", id: "", group: "LIQUID", qty: "3,000", unit: "MT", opt: "10.00", optType: "MOLOO", t: "F", frt: "37.0000", lump: "0.00", comm: "6.25", chtr: "RICHSTRONG", curr: "USD", exch: "1.000000" },
  { __id: "c2", n: "2", id: "", group: "LIQUID", qty: "5,000", unit: "MT", opt: "0.00", optType: "MOLOO", t: "L", frt: "25.0000", lump: "200,000.00", comm: "3.75", chtr: "WUCHAN", curr: "USD", exch: "1.000000" },
];

function CargoesSection() {
  const [qtyTotal, setQtyTotal] = useState(() =>
    cargoData.reduce((s, r) => s + (Number((r.qty ?? "").replace(/,/g, "")) || 0), 0),
  );
  const handleRows = useCallback((rows: Row[]) => {
    setQtyTotal(rows.reduce((s, r) => s + (Number((r.qty ?? "").replace(/,/g, "")) || 0), 0));
  }, []);

  const cargoFooter: FooterRow[] = [
    {
      cells: {
        group: { text: "Total" },
        qty: { text: qtyTotal.toLocaleString("en-US") },
      },
    },
  ];

  return (
    <div className="border-b border-ve-border bg-white">
      <div className="overflow-x-auto">
        <EditableTable
          storageKey="cargoes"
          title="Cargoes"
          initialColumns={cargoColumns}
          initialRows={cargoData}
          footerRows={cargoFooter}
          onRowsChange={handleRows}
          resizable
        />
      </div>
      <div className="h-4" />
    </div>
  );
}

/* ---------- Itinerary ---------- */

type TabDef = {
  key: string;
  label: string;
  columns: Column[];
  rows: Row[];
  footerRows?: FooterRow[];
};

const itineraryColumns: Column[] = [
  { id: "port", label: "Port", width: 140 },
  { id: "miles", label: "Miles", width: 60, align: "right" },
  { id: "wf", label: "WF%", width: 50, align: "right" },
  { id: "draft", label: "Draft", width: 60 },
  { id: "unit", label: "Unit", width: 40 },
  { id: "load", label: "Loadline", width: 90 },
  { id: "sal", label: "Salinity", width: 60, align: "right" },
  { id: "ifoQty", label: "IFO Qty", width: 70, align: "right" },
  { id: "ifoPrc", label: "IFO Prc", width: 70, align: "right" },
  { id: "lsfQty", label: "LSF Qty", width: 70, align: "right" },
  { id: "lsfPrc", label: "LSF Prc", width: 70, align: "right" },
  { id: "curr", label: "Curr", width: 50 },
  { id: "portExp", label: "PortExp", width: 70, align: "right" },
  { id: "baseExp", label: "BaseExp", width: 70, align: "right" },
  { id: "grp", label: "Cargo Grp", width: 90 },
  { id: "gs", label: "GS", width: 40 },
  { id: "grade", label: "Grade", width: 70 },
];
const itineraryData: Row[] = [
  { __id: "i1", port: "DUMAI", miles: "", wf: "7.00", draft: "", unit: "C", load: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "", baseExp: "", grp: "", gs: "", grade: "" },
  { __id: "i2", port: "SINGAPORE STRAIT", miles: "208", wf: "7.00", draft: "", unit: "P", load: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "", baseExp: "", grp: "", gs: "", grade: "" },
  { __id: "i3", port: "YANTAI", miles: "2,586", wf: "7.00", draft: "", unit: "L", load: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "10,000", baseExp: "10,000", grp: "1 : LIQUID", gs: "1", grade: "SOY" },
  { __id: "i4", port: "YOSU", miles: "444", wf: "0.00", draft: "", unit: "L", load: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "25,000", baseExp: "25,000", grp: "2 : LIQUID", gs: "1", grade: "MIXE" },
  { __id: "i5", port: "HONG KONG", miles: "1,147", wf: "7.00", draft: "", unit: "D", load: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "3,500", baseExp: "3,500", grp: "1 : LIQUID", gs: "1", grade: "SOY" },
  { __id: "i6", port: "DONGGUAN", miles: "58", wf: "7.00", draft: "", unit: "D", load: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "40,000", baseExp: "40,000", grp: "2 : LIQUID", gs: "1", grade: "MIXE" },
];

const ITINERARY_TABS: TabDef[] = [
  { key: "cargo", label: "Cargo", columns: T.cargoTabColumns, rows: T.cargoTabRows, footerRows: T.cargoTabFooter },
  { key: "exp", label: "Exp Details", columns: T.expDetailsColumns, rows: T.expDetailsRows },
  { key: "draft", label: "Draft/Restrictions", columns: T.draftColumns, rows: T.draftRows },
  { key: "vessel", label: "Vessel Draft", columns: itineraryColumns, rows: itineraryData },
  { key: "charterer", label: "Charterer", columns: T.chartererColumns, rows: T.chartererRows, footerRows: T.chartererFooter },
  { key: "custom", label: "Custom", columns: T.customColumns, rows: T.customRows },
  { key: "portdate", label: "Port/Date", columns: T.portDateColumns, rows: T.portDateRows },
  { key: "bunkers", label: "Bunkers", columns: T.bunkerTabColumns, rows: T.bunkerTabRows },
  { key: "pdgroup", label: "Port/Date Group", columns: T.portDateColumns, rows: T.portDateRows },
];

function ItinerarySection() {
  const [active, setActive] = useState(0);
  const tab = ITINERARY_TABS[active];
  return (
    <div className="bg-white">
      <div className="flex flex-wrap border-b border-ve-border bg-white text-[12px]">
        {ITINERARY_TABS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(i)}
            className={`border-r border-ve-border px-3 py-1.5 ${i === active ? "border-b-2 border-b-ve-accent font-semibold text-ve-text" : "text-ve-label hover:text-ve-text"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <EditableTable
          key={tab.key}
          storageKey={`itinerary:${tab.key}`}
          title="Itinerary"
          initialColumns={tab.columns}
          initialRows={tab.rows}
          footerRows={tab.footerRows}
          resizable
        />
      </div>


      {/* Bunker Sensitivity */}
      <div className="border-t border-ve-border px-3 py-3">
        <div className="grid grid-cols-[160px_repeat(4,1fr)] items-center gap-2 text-[12px]">
          <div />
          <div className="text-center font-semibold">IFO</div>
          <div className="text-center font-semibold">LSF</div>
          <div className="text-center font-semibold">MDO</div>
          <div className="text-center font-semibold">LSG</div>
          <div className="font-semibold text-ve-text">Bunker Sensitivity:</div>
          <Input value="0.000000" align="right" />
          <Input value="0.000000" align="right" />
          <Input value="0.000000" align="right" />
          <Input value="0.000000" align="right" />
        </div>
      </div>
    </div>
  );
}


/* ---------- P&L Sidebar ---------- */

const pnlRevenues = [
  { l: "Freight", v: "322,100.00" },
  { l: "Freight Comm.", v: "(3,052.50)" },
  { l: "Freight Add. Comm.", v: "(12,078.75)" },
  { l: "Misc. Revenue", v: "" },
];
const pnlExpenses = [
  { l: "Bunkers", v: "107,672.85" },
  { l: "Port Expenses", v: "78,500.00" },
  { l: "Misc. Expenses", v: "15,000.00" },
];

type PnLItem = {
  label: string;
  value: string;
  kind?: "section" | "bold" | "sub";
  node?: React.ReactNode;
};

const pnlItems: PnLItem[] = [
  { label: "REVENUES", value: "", kind: "section" },
  ...pnlRevenues.map((r) => ({ label: r.l, value: r.v, kind: "sub" as const })),
  { label: "Total Revenues", value: "306,968.75", kind: "bold" },
  { label: "EXPENSES", value: "", kind: "section" },
  ...pnlExpenses.map((r) => ({ label: r.l, value: r.v, kind: "sub" as const })),
  { label: "Total Expenses", value: "201,172.85", kind: "bold" },
  { label: "Voyage Result:", value: "105,795.90", kind: "bold" },
  { label: "Net Daily TCE:", value: "6,350.01", kind: "bold", node: <input type="checkbox" className="h-3 w-3" /> },
  { label: "RUNNING COST", value: "", kind: "section" },
  { label: "Total Running Cost", value: "" },
  { label: "Profit (Loss)", value: "105,795.9", kind: "bold" },
  { label: "Net Voyage Days", value: "16.66", kind: "bold" },
  { label: "Daily Profit (Loss)", value: "6,350.01", kind: "bold" },
  { label: "Total/Off hire days", value: "16.66" },
  { label: "Port/sea days", value: "16.66" },
  { label: "Breakeven", value: "18.64", kind: "bold" },
  { label: "Per Unit Cost", value: "17.80", kind: "bold" },
  { label: "Freight Rate (USD/t)", value: "28.5044", kind: "bold" },
  { label: "Deviation TCE", value: "", kind: "bold", node: <input type="checkbox" className="h-3 w-3" /> },
  { label: "CO2 Cost", value: "" },
  { label: "CO2 Adjusted Profit (Loss)", value: "105,795.90", kind: "bold" },
];

function PnLPanel() {
  let dataIdx = -1;
  return (
    <aside className="flex w-[270px] shrink-0 flex-col border-l border-ve-border bg-white">
      <div className="border-b border-ve-border bg-ve-sectionBg px-2 py-1 text-[13px] font-semibold">
        P&amp;L
      </div>
      <div className="flex border-b border-ve-border text-[12px]">
        <button className="flex-1 border-b-2 border-b-ve-accent bg-white px-2 py-1.5 font-semibold">
          All Periods
        </button>
        <button className="flex-1 px-2 py-1.5 text-ve-label hover:text-ve-text">Estimated</button>
      </div>

      {pnlItems.map((it) => {
        const isSection = it.kind === "section";
        if (!isSection) dataIdx += 1;
        const bg = isSection ? "bg-ve-sectionBg" : dataIdx % 2 === 0 ? "bg-white" : "bg-ve-altRow";
        return (
          <div
            key={it.label}
            className={`flex items-center justify-between gap-1 border-b border-ve-border px-2 py-1 text-[12px] ${bg} ${it.kind === "bold" || isSection ? "font-semibold" : ""} ${it.kind === "sub" ? "pl-4 text-ve-label" : ""}`}
          >
            <span className="flex items-center gap-1 truncate">
              {it.node}
              {it.label}
            </span>
            <span className="shrink-0 tabular-nums">{it.value}</span>
          </div>
        );
      })}

      <div className="border-b border-ve-border bg-ve-sectionBg px-2 py-1 text-[12px] font-semibold tracking-widest">
        ESTIMATE REMARKS
      </div>
      <textarea className="min-h-[140px] flex-1 resize-none border-0 p-2 text-[12px] outline-none" />
    </aside>
  );
}

/* ---------- Page ---------- */

function VoyageEstimator() {
  return (
    <ViewModeProvider>
      <div className="min-h-screen bg-ve-app text-ve-text">
        <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col border-x border-ve-border bg-white">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-ve-border bg-white px-3 py-1.5 text-[12px]">
            <div className="h-5 w-32 rounded-sm bg-ve-disabled" />
            <span className="text-ve-label">/</span>
            <div className="h-5 w-40 rounded-sm bg-ve-disabled" />
            <div className="ml-auto">
              <Globe className="h-4 w-4 text-ve-accent" />
            </div>
          </div>

          <Toolbar />

          <div className="flex flex-1">
            <div className="flex-1 overflow-auto">
              <HeaderSection />
              <CargoesSection />
              <ItinerarySection />
            </div>
            <PnLPanel />
          </div>
        </div>
      </div>
    </ViewModeProvider>
  );
}
