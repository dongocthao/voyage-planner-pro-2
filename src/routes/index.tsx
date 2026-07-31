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
import { useState } from "react";
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

const bunkerPlanColumns: Column[] = [
  { id: "port", label: "Port", width: 130 },
  { id: "fn", label: "F", width: 30 },
  { id: "eta", label: "ETA", width: 100 },
  { id: "etd", label: "ETD", width: 100 },
  { id: "grade", label: "Grade", width: 60 },
  { id: "rob", label: "ROB Arr", width: 70, align: "right" },
  { id: "qty", label: "Qty", width: 70, align: "right" },
  { id: "price", label: "Price", width: 70, align: "right" },
  { id: "cost", label: "Cost", width: 90, align: "right" },
  { id: "supplier", label: "Supplier", width: 110 },
];
const bunkerPlanRows: Row[] = [
  { __id: "p1", port: "DUMAI", fn: "B", eta: "10/01/22 19:26", etd: "11/01/22 04:00", grade: "IFO", rob: "420.00", qty: "300.00", price: "531.98", cost: "159,594.00", supplier: "PERTAMINA" },
  { __id: "p2", port: "SINGAPORE STRAIT", fn: "P", eta: "12/01/22 08:00", etd: "12/01/22 20:00", grade: "LSF", rob: "180.00", qty: "250.00", price: "550.00", cost: "137,500.00", supplier: "SENTEK" },
  { __id: "p3", port: "YANTAI", fn: "L", eta: "20/01/22 06:00", etd: "21/01/22 18:00", grade: "MDO", rob: "60.00", qty: "40.00", price: "650.00", cost: "26,000.00", supplier: "SINOPEC" },
  { __id: "p4", port: "HONG KONG", fn: "D", eta: "25/01/22 09:00", etd: "26/01/22 03:00", grade: "LSG", rob: "35.00", qty: "20.00", price: "700.00", cost: "14,000.00", supplier: "CHIMBUSCO" },
];

function BunkerPlanningModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-6">
      <div className="w-full max-w-[1100px] border border-ve-border bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-ve-border bg-ve-sectionBg px-3 py-1.5">
          <span className="text-[13px] font-semibold">Bunker Planning</span>
          <button
            type="button"
            onClick={onClose}
            className="ve-tool-btn px-2 text-[12px]"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-ve-label" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 border-b border-ve-border px-3 py-2">
          <Field label="Vessel"><Input value="VESON TRADER" /></Field>
          <Field label="Voyage No"><Input value="22001" align="right" /></Field>
          <Field label="Opr Type"><Input value="TCOV" /></Field>
          <Field label="Status"><Input value="Estimate" /></Field>
        </div>

        <div className="overflow-x-auto px-3 py-2">
          <EditableTable
            storageKey="bunker-planning"
            title="Bunker Requirements"
            initialColumns={bunkerPlanColumns}
            initialRows={bunkerPlanRows}
            minVisibleRows={6}
            resizable
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-ve-border bg-ve-toolbar px-3 py-2 text-[12px]">
          <button type="button" className="ve-tool-btn px-3 font-semibold text-ve-accent">
            Calculate
          </button>
          <button type="button" className="ve-tool-btn px-3 font-semibold text-ve-accent">
            Update Prices
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ve-tool-btn px-3 font-semibold text-ve-text"
          >
            Close
          </button>
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
