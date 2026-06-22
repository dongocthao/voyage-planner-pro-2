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
} from "lucide-react";
import EditableTable, { type Column, type Row } from "@/components/EditableTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voyage Estimator" },
      { name: "description", content: "Voyage Estimator — P&L, cargoes and itinerary." },
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
    <div className="flex items-center gap-2 py-[3px]">
      <label className={`${labelWidth} shrink-0 text-[12px] text-ve-label`}>{label}</label>
      <div className="flex-1">{children}</div>
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
  return (
    <div className="flex items-center gap-1 border-b border-ve-border bg-ve-toolbar px-2 py-1 text-[12px]">
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

function HeaderSection() {
  return (
    <div className="grid grid-cols-12 gap-4 border-b border-ve-border bg-white px-3 py-2">
      {/* Column 1 */}
      <div className="col-span-3">
        <Field label="Vessel">
          <Select value="" />
        </Field>
        <Field label="TC In Code"><Input /></Field>
        <Field label="Vessel DWT"><Input value="34,752" align="right" /></Field>
        <Field label="Dly Hire/Addr">
          <div className="flex gap-1">
            <Input value="0.00" align="right" />
            <Input value="0.00" align="right" />
          </div>
        </Field>
        <Field label="Hire Comm (%)"><Input value="0.00" align="right" /></Field>
        <Field label="DWF %"><Input value="7.00" align="right" /></Field>
        <Field label="Spd Bal/Ldn (kn)">
          <div className="flex gap-1">
            <Input value="12.00" align="right" />
            <Input value="11.50" align="right" />
          </div>
        </Field>
        <Field label="Category"><Input /></Field>
        <Field label="Commencing"><Input value="10/01/22 19:26" /></Field>
        <Field label="Completing"><Input value="27/01/22 12:17" /></Field>
        <Field label="Voyage Days"><Input value="16.6607" align="right" /></Field>
      </div>

      {/* Column 2 */}
      <div className="col-span-3">
        <Field label="Ballast Port" labelWidth="w-32"><Input value="DUMAI" /></Field>
        <Field label="Reposition Port" labelWidth="w-32"><Input /></Field>
        <Field label="Ballast Bonus" labelWidth="w-32"><Input value="0.00" align="right" /></Field>
        <Field label="Opr Type" labelWidth="w-32"><Input value="TCOV" /></Field>
        <Field label="Chtr Specialist" labelWidth="w-32"><Input disabled /></Field>
        <Field label="Company" labelWidth="w-32"><Input value="VESON" /></Field>
        <Field label="Trade Area" labelWidth="w-32"><Input /></Field>
        <Field label="Piracy Routing" labelWidth="w-32"><Input value="Default" /></Field>
        <Field label="ECA Routing" labelWidth="w-32">
          <div className="flex gap-1">
            <Input value="Enabled" />
            <Input value="19 items selec" className="text-ve-accent" />
          </div>
        </Field>
        <Field label="Load Line Routing" labelWidth="w-32"><Input value="Default" /></Field>
      </div>

      {/* Column 3: Bunker grid (editable) */}
      <div className="col-span-6">
        <EditableTable
          storageKey="bunkers"
          title="Bunkers"
          initialColumns={bunkerColumns}
          initialRows={bunkerData}
        />
        <div className="mt-1 px-1 text-[12px]">
          <label className="inline-flex items-center gap-1">
            <input type="checkbox" className="h-3 w-3" /> Use Scrubber
          </label>
        </div>
      </div>
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
  return (
    <div className="border-b border-ve-border bg-white">
      <EditableTable
        storageKey="cargoes"
        title="Cargoes"
        initialColumns={cargoColumns}
        initialRows={cargoData}
      />
      <div className="px-3 py-1 text-right text-[12px] font-semibold">Total: 8,000</div>
    </div>
  );
}

/* ---------- Itinerary ---------- */

const itineraryTabs = [
  "Cargo", "Draft/Restrictions", "Vessel Draft", "Charterer", "Port/Date", "Bunkers", "Port/Date Group",
];

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

function ItinerarySection() {
  return (
    <div className="bg-white">
      <div className="flex border-b border-ve-border bg-white text-[12px]">
        {itineraryTabs.map((t, i) => (
          <button
            key={t}
            className={`border-r border-ve-border px-3 py-1.5 ${i === 3 ? "border-b-2 border-b-ve-accent font-semibold text-ve-text" : "text-ve-label hover:text-ve-text"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <EditableTable
        storageKey="itinerary"
        title="Itinerary"
        initialColumns={itineraryColumns}
        initialRows={itineraryData}
      />

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

function PnLRow({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-ve-border px-3 py-1 text-[12px] ${bold ? "font-semibold" : ""} ${sub ? "pl-6 text-ve-label" : ""}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PnLPanel() {
  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-l border-ve-border bg-white">
      <div className="border-b border-ve-border bg-ve-sectionBg px-3 py-1 text-[13px] font-semibold">P&amp;L</div>
      <div className="flex border-b border-ve-border text-[12px]">
        <button className="flex-1 border-b-2 border-b-ve-accent bg-white px-3 py-1.5 font-semibold">All Periods</button>
        <button className="flex-1 px-3 py-1.5 text-ve-label hover:text-ve-text">Estimated</button>
      </div>

      <PnLRow label="REVENUES" value="" bold />
      {pnlRevenues.map((r) => <PnLRow key={r.l} label={r.l} value={r.v} sub />)}
      <PnLRow label="Total Revenues" value="306,968.75" bold />

      <PnLRow label="EXPENSES" value="" bold />
      {pnlExpenses.map((r) => <PnLRow key={r.l} label={r.l} value={r.v} sub />)}
      <PnLRow label="Total Expenses" value="201,172.85" bold />

      <div className="flex items-center justify-between border-b border-ve-border px-3 py-1.5 text-[12px]">
        <span>Voyage Result:</span>
        <span className="font-semibold tabular-nums">105,795.90</span>
      </div>
      <div className="flex items-center justify-between border-b border-ve-border px-3 py-1.5 text-[12px]">
        <span className="flex items-center gap-2">
          <input type="checkbox" className="h-3 w-3" /> Net Daily TCE:
        </span>
        <span className="font-semibold tabular-nums">6,350.01</span>
      </div>

      <PnLRow label="RUNNING COST" value="" bold />
      <PnLRow label="Total Running Cost" value="" />

      <PnLRow label="Profit (Loss)" value="105,795.9" bold />
      <PnLRow label="Net Voyage Days" value="16.66" bold />
      <PnLRow label="Daily Profit (Loss)" value="6,350.01" bold />
      <PnLRow label="Total/Off hire days" value="16.66" />
      <PnLRow label="Port/sea days" value="16.66" />
      <PnLRow label="Breakeven" value="18.64" bold />
      <PnLRow label="Per Unit Cost" value="17.80" bold />
      <PnLRow label="Freight Rate (USD/t)" value="28.5044" bold />

      <div className="flex items-center justify-between border-b border-ve-border px-3 py-1 text-[12px]">
        <span className="font-semibold">Deviation TCE</span>
        <input type="checkbox" className="h-3 w-3" />
      </div>
      <PnLRow label="CO2 Cost" value="" />
      <PnLRow label="CO2 Adjusted Profit (Loss)" value="105,795.90" bold />

      <div className="border-b border-ve-border bg-ve-sectionBg px-3 py-1 text-[12px] font-semibold tracking-widest">
        ESTIMATE REMARKS
      </div>
      <textarea className="min-h-[140px] flex-1 resize-none border-0 p-3 text-[12px] outline-none" />
    </aside>
  );
}

/* ---------- Page ---------- */

function VoyageEstimator() {
  return (
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
  );
}
