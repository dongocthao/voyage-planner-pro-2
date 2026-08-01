import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Save,
  Trash2,
  ChevronDown,
  FileText,
  Lock,
  Check,
  Globe,
} from "lucide-react";
import { useState } from "react";
import EditableTable, {
  type Column,
  type Row,
  type FooterRow,
} from "@/components/EditableTable";
import * as T from "@/components/itinerary-tabs";

export const Route = createFileRoute("/time-charter-out")({
  head: () => ({
    meta: [
      { title: "Time Charter Out Estimator — IMOS" },
      {
        name: "description",
        content:
          "Time Charter Out estimator: TCO hire, TCO terms, estimated delivery/redelivery, itinerary grids and P&L.",
      },
      { property: "og:title", content: "Time Charter Out Estimator — IMOS" },
      {
        property: "og:description",
        content:
          "Time Charter Out estimator: TCO hire, TCO terms, delivery/redelivery and P&L.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TimeCharterOut,
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
      <button className="ve-tool-btn px-2 text-ve-accent hover:underline">Open TCO Fixture</button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn flex items-center gap-1 px-2">
        <FileText className="h-4 w-4 text-ve-label" /> Reports <ChevronDown className="h-3 w-3" />
      </button>
      <button className="ve-tool-btn" aria-label="Lock">
        <Lock className="h-4 w-4 text-emerald-600" />
      </button>
      <Check className="ml-1 h-4 w-4 text-emerald-600" />
      <Link to="/" className="ml-auto pr-2 text-ve-accent hover:underline">
        ← Voyage Estimator
      </Link>
      <Globe className="h-4 w-4 text-ve-accent" />
    </div>
  );
}

/* ---------- Bunkers grid (top-right) ---------- */

const bunkerColumns: Column[] = [
  { id: "name", label: "Name", width: 80 },
  { id: "price", label: "Price", width: 80, align: "right" },
  { id: "sBal", label: "S Bal", width: 70, align: "right" },
  { id: "sLad", label: "S Lad", width: 70, align: "right" },
  { id: "pLd", label: "P Ld", width: 70, align: "right" },
  { id: "pDis", label: "P Dis", width: 70, align: "right" },
  { id: "idle", label: "Idle", width: 66, align: "right" },
];
const bunkerData: Row[] = [
  { __id: "tb1", name: "LSFO", price: "750.00", sBal: "32.60", sLad: "36.44", pLd: "4.25", pDis: "5.24", idle: "3.00" },
  { __id: "tb2", name: "MGO", price: "625.00", sBal: "0.20", sLad: "0.20", pLd: "2.00", pDis: "2.00", idle: "1.75" },
  { __id: "tb3", name: "B30", price: "0.00", sBal: "", sLad: "", pLd: "", pDis: "", idle: "" },
];

/* ---------- Header section ---------- */

function HeaderSection() {
  return (
    <div className="flex gap-3 border-b border-ve-border bg-white py-1.5 pl-2 pr-0">
      {/* Column 1 */}
      <div className="min-w-0 flex-1">
        <Field label="Vessel" labelWidth="w-24"><Select /></Field>
        <Field label="TC In Code" labelWidth="w-24"><Input disabled /></Field>
        <Field label="Vessel DWT" labelWidth="w-24"><Input value="178,000.00" align="right" /></Field>
        <Field label="Dly Hire/Addr" labelWidth="w-24">
          <div className="flex gap-1">
            <Input value="18,000.00" align="right" />
            <Input value="0.00" align="right" />
          </div>
        </Field>
        <Field label="DWF %" labelWidth="w-24"><Input value="5.00" align="right" /></Field>
        <Field label="Spd Bal/Ldn (kn)" labelWidth="w-24">
          <div className="flex gap-1">
            <Input value="12.50" align="right" />
            <Input value="12.50" align="right" />
          </div>
        </Field>
        <Field label="Category" labelWidth="w-24"><Input /></Field>
        <Field label="Commencing" labelWidth="w-24"><Input value="05/01/25 08:00" align="right" /></Field>
        <Field label="Completing" labelWidth="w-24"><Input value="06/05/25 19:22" align="right" /></Field>
      </div>

      {/* Column 2 */}
      <div className="min-w-0 flex-1">
        <Field label="Ballast Port" labelWidth="w-32"><Input value="PORT HEDLAND" /></Field>
        <Field label="Reposition Port" labelWidth="w-32"><Input /></Field>
        <Field label="Ballast Bonus" labelWidth="w-32"><Input value="0.00" align="right" /></Field>
        <Field label="Opr Type" labelWidth="w-32"><Input value="TCTO" /></Field>
        <Field label="Chtr Specialist" labelWidth="w-32"><Input value="admin" /></Field>
        <Field label="Company" labelWidth="w-32"><Input disabled /></Field>
        <Field label="Trade Area" labelWidth="w-32"><Input value="PACIFIC" /></Field>
        <Field label="Piracy Routing" labelWidth="w-32"><Input value="Default" /></Field>
        <Field label="ECA Routing" labelWidth="w-32"><Input value="Default" /></Field>
        <Field label="Load Line Routing" labelWidth="w-32"><Input value="Default" /></Field>
        <Field label="INL Routing" labelWidth="w-32"><Input value="Default" /></Field>
        <Field label="TCO Duration" labelWidth="w-32"><Input value="35.47" align="right" /></Field>
      </div>

      {/* Bunkers grid */}
      <div className="shrink-0">
        <EditableTable
          storageKey="tco:bunkers"
          initialColumns={bunkerColumns}
          initialRows={bunkerData}
          minVisibleRows={4}
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

/* ---------- TCO Hire ---------- */

const tcoHireColumns: Column[] = [
  { id: "hireRate", label: "Hire Rate", width: 380, align: "right" },
  { id: "rateType", label: "Rate Type", width: 300 },
  { id: "duration", label: "Duration", width: 300, align: "right" },
  { id: "period", label: "Period", width: 220 },
];
const tcoHireData: Row[] = [
  { __id: "th1", hireRate: "20,000.00", rateType: "Per Day", duration: "35.47", period: "Days" },
];

/* ---------- TCO Terms ---------- */

const tcoTermsColumns: Column[] = [
  { id: "delivery", label: "Delivery Port", width: 320 },
  { id: "redelivery", label: "Redelivery Port", width: 320 },
  { id: "broker", label: "Broker %", width: 190, align: "right" },
  { id: "addr", label: "Addr %", width: 170, align: "right" },
  { id: "bb", label: "Ballast Bonus", width: 180, align: "right" },
  { id: "bbComm", label: "BB Comm", width: 110 },
];
const tcoTermsData: Row[] = [
  {
    __id: "tt1",
    delivery: "PORT HEDLAND",
    redelivery: "PORT HEDLAND",
    broker: "3.50",
    addr: "0.00",
    bb: "0.00",
    bbComm: "",
  },
];

const tcoBrokerColumns: Column[] = [
  { id: "broker", label: "Broker", width: 640 },
  { id: "amount", label: "Amount", width: 200, align: "right" },
  { id: "type", label: "Type", width: 190 },
  { id: "method", label: "Payment Method", width: 260 },
];
const tcoBrokerData: Row[] = [
  { __id: "tbk1", broker: "CLARKSONS", amount: "3.500", type: "%", method: "Deduct from hire" },
];

/* ---------- Est Delivery / Redelivery ---------- */

const estColumns: Column[] = [
  { id: "lsfQty", label: "LSF Qty", width: 230, align: "right" },
  { id: "lsfPrc", label: "LSF Prc", width: 230, align: "right" },
  { id: "mgoQty", label: "MGO Qty", width: 230, align: "right" },
  { id: "mgoPrc", label: "MGO Prc", width: 230, align: "right" },
  { id: "b30Qty", label: "B30 Qty", width: 220, align: "right" },
  { id: "b30Prc", label: "B30 Prc", width: 220, align: "right" },
];
const estDeliveryData: Row[] = [
  { __id: "ed1", lsfQty: "1,000.00", lsfPrc: "750.00", mgoQty: "300.00", mgoPrc: "650.00", b30Qty: "0.00", b30Prc: "0.00" },
];
const estRedeliveryData: Row[] = [
  { __id: "er1", lsfQty: "1,000.00", lsfPrc: "690.00", mgoQty: "300.00", mgoPrc: "550.00", b30Qty: "0.00", b30Prc: "0.00" },
];

/* ---------- Itinerary ---------- */

const tcoItineraryColumns: Column[] = [
  { id: "port", label: "Port", width: 150 },
  { id: "miles", label: "Miles", width: 60, align: "right" },
  { id: "draft", label: "Draft", width: 60, align: "right" },
  { id: "unit", label: "Unit", width: 46 },
  { id: "f", label: "F", width: 34 },
  { id: "loadline", label: "Loadline", width: 96 },
  { id: "sal", label: "Salinity", width: 62, align: "right" },
  { id: "lsfQty", label: "LSF Qty", width: 70, align: "right" },
  { id: "lsfPrc", label: "LSF Prc", width: 70, align: "right" },
  { id: "mgoQty", label: "MGO Qty", width: 74, align: "right" },
  { id: "mgoPrc", label: "MGO Prc", width: 74, align: "right" },
  { id: "portExp", label: "PortExp", width: 70, align: "right" },
  { id: "cargo", label: "Cargo", width: 74 },
  { id: "ldQty", label: "L/D Qty", width: 72, align: "right" },
  { id: "ldRate", label: "L/D Rate", width: 74, align: "right" },
  { id: "ru", label: "RU", width: 40 },
  { id: "spd", label: "Spd", width: 50, align: "right" },
  { id: "sdays", label: "SDays", width: 58, align: "right" },
  { id: "lsSday", label: "LS SDay", width: 68, align: "right" },
  { id: "terms", label: "Terms", width: 64 },
  { id: "c", label: "C", width: 34 },
  { id: "pd", label: "PD", width: 46, align: "right" },
  { id: "xpd", label: "XPD", width: 46, align: "right" },
  { id: "ecaZone", label: "ECA Zone (At Sea)", width: 150 },
  { id: "eta", label: "ETA", width: 110, align: "right" },
  { id: "etd", label: "ETD", width: 110, align: "right" },
  { id: "tz", label: "TZ", width: 44, align: "right" },
  { id: "ecaRouting", label: "ECA Routing", width: 110 },
  { id: "piracy", label: "Piracy Routing", width: 110 },
];

const tcoItineraryData: Row[] = [
  { __id: "ti1", port: "PORT HEDLAND", miles: "5.00", draft: "", unit: "", f: "C", loadline: "Summer Salt", sal: "1.025", lsfQty: "", lsfPrc: "", mgoQty: "", mgoPrc: "", portExp: "", cargo: "", ldQty: "", ldRate: "", ru: "", spd: "12.5", sdays: "0.00", lsSday: "", terms: "", c: "", pd: "", xpd: "", ecaZone: "", eta: "05/01/25 08:00", etd: "05/01/25 08:00", tz: "8.0", ecaRouting: "", piracy: "" },
  { __id: "ti2", port: "PORT HEDLAND", miles: "5.00", draft: "", unit: "", f: "Y", loadline: "Summer Salt", sal: "1.025", lsfQty: "", lsfPrc: "", mgoQty: "", mgoPrc: "", portExp: "", cargo: "", ldQty: "", ldRate: "", ru: "", spd: "12.5", sdays: "0.00", lsSday: "", terms: "SECA - NORTH SEA", c: "", pd: "", xpd: "", ecaZone: "SECA - NORTH SEA", eta: "05/01/25 08:00", etd: "06/05/25 19:22", tz: "8.0", ecaRouting: "", piracy: "" },
  { __id: "ti3", port: "PORT HEDLAND", miles: "5.00", draft: "", unit: "", f: "Z", loadline: "Summer Salt", sal: "1.025", lsfQty: "", lsfPrc: "", mgoQty: "", mgoPrc: "", portExp: "", cargo: "", ldQty: "", ldRate: "", ru: "", spd: "12.5", sdays: "0.00", lsSday: "", terms: "SECA - NORTH SEA", c: "", pd: "", xpd: "", ecaZone: "SECA - NORTH SEA", eta: "06/05/25 19:22", etd: "06/05/25 19:22", tz: "8.0", ecaRouting: "", piracy: "" },
];

type TabDef = {
  key: string;
  label: string;
  columns: Column[];
  rows: Row[];
  footerRows?: FooterRow[];
};

const TABS: TabDef[] = [
  { key: "cargo", label: "Cargo", columns: T.cargoTabColumns, rows: T.cargoTabRows, footerRows: T.cargoTabFooter },
  { key: "draft", label: "Draft/Restrictions", columns: T.draftColumns, rows: T.draftRows },
  { key: "charterer", label: "Charterer", columns: tcoItineraryColumns, rows: tcoItineraryData },
  { key: "portdate", label: "Port/Date", columns: T.portDateColumns, rows: T.portDateRows },
  { key: "bunkers", label: "Bunkers", columns: T.bunkerTabColumns, rows: T.bunkerTabRows },
  { key: "pdgroup", label: "Port/Date Group", columns: T.portDateColumns, rows: T.portDateRows },
];

function ItinerarySection() {
  const [active, setActive] = useState(2);
  const tab = TABS[active];
  return (
    <div className="border-t border-ve-border bg-white">
      <div className="px-3 pt-2 text-[13px] font-semibold text-ve-text">Itinerary</div>
      <div className="flex flex-wrap border-b border-ve-border bg-white text-[12px]">
        {TABS.map((t, i) => (
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
          storageKey={`tco:itinerary:${tab.key}`}
          initialColumns={tab.columns}
          initialRows={tab.rows}
          footerRows={tab.footerRows}
          minVisibleRows={5}
          resizable
        />
      </div>
    </div>
  );
}

/* ---------- Section wrapper ---------- */

function GridSection({
  title,
  children,
  extra,
}: {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <div className="border-t border-ve-border bg-white">
      <div className="flex items-center justify-between px-3 py-1">
        <span className="text-[13px] font-semibold text-ve-text">{title}</span>
        {extra}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/* ---------- P&L sidebar ---------- */

type PnLItem = {
  label: string;
  value: string;
  kind?: "section" | "bold" | "sub";
};

const pnlItems: PnLItem[] = [
  { label: "REVENUES", value: "", kind: "section" },
  { label: "TCO Hire", value: "709,480.05", kind: "sub" },
  { label: "TCO Hire Comm.", value: "(24,831.80)", kind: "sub" },
  { label: "TCO Bunker Adjustment", value: "10,183.49", kind: "sub" },
  { label: "Misc. Revenue", value: "", kind: "sub" },
  { label: "Total Revenues", value: "694,831.74", kind: "bold" },
  { label: "EXPENSES", value: "", kind: "section" },
  { label: "Hold Cleaning", value: "5,000.00", kind: "sub" },
  { label: "Bunkers", value: "", kind: "sub" },
  { label: "Port Expenses", value: "", kind: "sub" },
  { label: "Misc. Expenses", value: "", kind: "sub" },
  { label: "Total Expenses", value: "5,000.00", kind: "bold" },
  { label: "Voyage Result:", value: "689,831.74", kind: "bold" },
  { label: "Net Daily TCE:", value: "19,446.12", kind: "bold" },
  { label: "RUNNING COST", value: "", kind: "section" },
  { label: "Hire", value: "638,532.04", kind: "sub" },
  { label: "CVE", value: "1,182.47", kind: "sub" },
  { label: "Total Running Cost", value: "639,714.51", kind: "bold" },
  { label: "Profit (Loss)", value: "50,117.23", kind: "bold" },
  { label: "Net Voyage Days", value: "35.47", kind: "bold" },
  { label: "Daily Profit (Loss)", value: "1,412.79", kind: "bold" },
  { label: "Total/Off hire days", value: "35.47" },
  { label: "Port/sea days", value: "35.47" },
  { label: "Breakeven", value: "" },
  { label: "Freight Rate (USD/t)", value: "0" },
  { label: "Gross TCE", value: "19,159.05" },
  { label: "CO2 Cost", value: "" },
];

function PnLPanel() {
  let dataIdx = -1;
  return (
    <aside className="flex w-[270px] shrink-0 flex-col border-l border-ve-border bg-white">
      <div className="border-b border-ve-border bg-ve-sectionBg px-2 py-1 text-[13px] font-semibold">
        P&amp;L
      </div>
      <div className="flex border-b border-ve-border text-[12px]">
        <button className="flex-1 px-2 py-1.5 text-ve-label hover:text-ve-text">All Periods</button>
        <button className="flex-1 border-b-2 border-b-ve-accent bg-white px-2 py-1.5 font-semibold">
          Estimated
        </button>
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
            <span className="truncate">{it.label}</span>
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

function TimeCharterOut() {
  return (
    <div className="min-h-screen bg-ve-app text-ve-text">
      <div className="mx-auto flex min-h-screen max-w-[1700px] flex-col border-x border-ve-border bg-white">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-ve-border bg-white px-3 py-1.5 text-[13px] font-semibold">
          <span>Untitled</span>
          <span className="font-normal text-ve-label">/</span>
          <span>ADM-000014</span>
          <span className="ml-2 text-[12px] font-normal text-ve-label">Time Charter Out</span>
          <div className="ml-auto">
            <Globe className="h-4 w-4 text-ve-accent" />
          </div>
        </div>

        <Toolbar />

        <div className="flex flex-1">
          <div className="min-w-0 flex-1 overflow-auto">
            <HeaderSection />

            <GridSection title="TCO Hire">
              <EditableTable
                storageKey="tco:hire"
                initialColumns={tcoHireColumns}
                initialRows={tcoHireData}
                minVisibleRows={2}
                resizable
              />
            </GridSection>

            <GridSection title="TCO Terms">
              <div className="space-y-2">
                <EditableTable
                  storageKey="tco:terms"
                  initialColumns={tcoTermsColumns}
                  initialRows={tcoTermsData}
                  minVisibleRows={2}
                  resizable
                />
                <EditableTable
                  storageKey="tco:broker"
                  initialColumns={tcoBrokerColumns}
                  initialRows={tcoBrokerData}
                  minVisibleRows={2}
                  resizable
                />
              </div>
            </GridSection>

            <GridSection title="Est Delivery">
              <EditableTable
                storageKey="tco:estDelivery"
                initialColumns={estColumns}
                initialRows={estDeliveryData}
                minVisibleRows={2}
                resizable
              />
            </GridSection>

            <GridSection title="Est Redelivery">
              <EditableTable
                storageKey="tco:estRedelivery"
                initialColumns={estColumns}
                initialRows={estRedeliveryData}
                minVisibleRows={2}
                resizable
              />
            </GridSection>

            <ItinerarySection />
          </div>

          <PnLPanel />
        </div>
      </div>
    </div>
  );
}
