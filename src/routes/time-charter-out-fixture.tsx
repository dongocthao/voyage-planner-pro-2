import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  Save,
  Copy,
  Trash2,
  RefreshCw,
  ChevronDown,
  Files,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import EditableTable, { type Column, type Row } from "@/components/EditableTable";

export const Route = createFileRoute("/time-charter-out-fixture")({
  head: () => ({
    meta: [
      { title: "Time Charter Out Fixture — IMOS" },
      {
        name: "description",
        content:
          "TCO fixture entry: vessel and charterer terms, delivery/redelivery dates, hire pricing rows and broker commissions.",
      },
      { property: "og:title", content: "Time Charter Out Fixture — IMOS" },
      {
        property: "og:description",
        content:
          "TCO fixture entry: charterer terms, delivery/redelivery, hire pricing and broker commissions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TcoFixture,
});

/* ---------- Reusable bits ---------- */

function Field({
  label,
  children,
  labelWidth = "w-32",
  checkbox = false,
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
  checkbox?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 py-[1px]">
      {checkbox ? (
        <input type="checkbox" className="h-3 w-3 shrink-0" />
      ) : null}
      <label className={`${labelWidth} shrink-0 text-right text-[12px] text-ve-label`}>
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Input({
  value = "",
  align = "left",
  disabled = false,
  className = "",
}: {
  value?: string;
  align?: "left" | "right";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      defaultValue={value}
      className={`h-[22px] w-full border border-ve-border px-1.5 text-[12px] text-ve-text outline-none focus:border-ve-accent focus:ring-1 focus:ring-ve-accent/40 ${disabled ? "bg-ve-disabled" : "bg-white"} ${align === "right" ? "text-right" : ""} ${className}`}
    />
  );
}

/* Bare cell input used inside mini grids */
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


function Select({ value = "" }: { value?: string }) {
  return (
    <div className="relative">
      <input
        defaultValue={value}
        className="h-[22px] w-full border border-ve-border bg-white px-1.5 pr-6 text-[12px] text-ve-text outline-none focus:border-ve-accent focus:ring-1 focus:ring-ve-accent/40"
      />
      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-ve-text" />
    </div>
  );
}

function Toolbar() {
  const menus = [
    { label: "Other Info" },
    { label: "Options", caret: true },
    { label: "Hire Statement" },
    { label: "Issue Bill" },
    { label: "Commission", caret: true },
    { label: "Profit Sharing" },
    { label: "Sched a Voy" },
    { label: "Estimate" },
  ];
  return (
    <div className="flex items-center gap-1 border-b border-ve-border bg-white px-2 py-1 text-[13px]">
      <button className="ve-tool-btn" aria-label="Search">
        <Search className="h-4 w-4 text-ve-accent" />
      </button>
      <button className="ve-tool-btn flex items-center gap-1 px-2 font-semibold text-ve-text">
        <Save className="h-4 w-4 text-ve-accent" /> Save
      </button>
      <button className="ve-tool-btn" aria-label="Copy">
        <Copy className="h-4 w-4 text-ve-label" />
      </button>
      <button className="ve-tool-btn" aria-label="Delete">
        <Trash2 className="h-4 w-4 text-ve-label" />
      </button>
      <button className="ve-tool-btn flex items-center gap-0.5 px-1" aria-label="Duplicate">
        <Files className="h-4 w-4 text-ve-accent" />
        <ChevronDown className="h-3 w-3 text-ve-text" />
      </button>
      <button className="ve-tool-btn" aria-label="Refresh">
        <RefreshCw className="h-4 w-4 text-ve-accent" />
      </button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      {menus.map((m) => (
        <button
          key={m.label}
          className="ve-tool-btn flex items-center gap-1 px-2 font-semibold text-ve-accent hover:underline"
        >
          {m.label}
          {m.caret && <ChevronDown className="h-3 w-3" />}
        </button>
      ))}
      <button className="ve-tool-btn px-1" aria-label="More">
        <MoreHorizontal className="h-4 w-4 text-ve-label" />
      </button>
      <Link to="/time-charter-out" className="ml-auto pr-2 text-[12px] text-ve-accent hover:underline">
        ← TCO Estimate
      </Link>
    </div>
  );
}

/* ---------- Duration Min/Max mini grid ---------- */

function DurationGrid() {
  const heads = ["Dur.", "Unit", "-Days", "+Days", "E/L Redel."];
  const cols = "grid-cols-[0.85fr_0.85fr_0.7fr_0.7fr_minmax(0,1.6fr)]";
  return (
    <div className="mt-1 flex">
      <div className="w-[40px] shrink-0" />
      <div className="min-w-0 flex-1 border border-ve-border">
        <div className={`grid ${cols} bg-ve-sectionBg text-[12px] font-medium text-ve-text`}>
          {heads.map((h) => (
            <div key={h} className="min-w-0 truncate border-r border-ve-border px-1.5 py-[2px] last:border-r-0">
              {h}
            </div>
          ))}
        </div>
        {(["Min", "Max"] as const).map((r) => (
          <div key={r} className={`relative grid ${cols} border-t border-ve-border`}>
            <span className="absolute -left-[36px] top-[2px] text-[12px] text-ve-label">{r}</span>
            <div className="min-w-0 border-r border-ve-border">
              <CellInput value="0" align="right" />
            </div>
            <div className="min-w-0 border-r border-ve-border">
              <CellInput />
            </div>
            <div className="min-w-0 border-r border-ve-border">
              <CellInput align="right" />
            </div>
            <div className="min-w-0 border-r border-ve-border">
              <CellInput align="right" />
            </div>
            <div className="min-w-0">
              <CellInput />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ---------- Delivery / Redelivery ---------- */

function DeliveryGrid() {
  return (
    <div className="px-2 pt-2">
      <div className="flex">
        <div className="w-[190px] shrink-0" />
        <div className="min-w-0 flex-1 border border-ve-border">
          <div className="grid grid-cols-[220px_130px_130px_140px_1fr] bg-ve-sectionBg text-[12px] font-medium">
            {["Port", "Est GMT", "Proj/Act GMT", "Difference", "Remarks"].map((h) => (
              <div key={h} className="border-r border-ve-border px-1.5 py-[2px] last:border-r-0">
                {h}
              </div>
            ))}
          </div>
          {(["Delivery", "Redelivery"] as const).map((r) => (
            <div
              key={r}
              className="relative grid grid-cols-[220px_130px_130px_140px_1fr] border-t border-ve-border"
            >
              <span className="absolute -left-[80px] top-[3px] w-[74px] text-right text-[12px] text-ve-label">
                {r}
              </span>
              <div className="border-r border-ve-border py-[2px]">&nbsp;</div>
              <div className="border-r border-ve-border py-[2px]">&nbsp;</div>
              <div className="border-r border-ve-border py-[2px]">&nbsp;</div>
              <div className="border-r border-ve-border px-1.5 py-[2px] text-right text-[12px] tabular-nums">
                0.00
              </div>
              <div className="py-[2px]">&nbsp;</div>
            </div>
          ))}
          <div className="relative grid grid-cols-[220px_130px_130px_140px_1fr] border-t border-ve-border">
            <span className="absolute -left-[180px] top-[3px] w-[174px] text-right text-[12px] text-ve-label">
              Duration/Basis (days)
            </span>
            <div className="border-r border-ve-border px-1.5 py-[2px] text-right text-[12px] tabular-nums">
              0.0000
            </div>
            <div className="border-r border-ve-border px-1.5 py-[2px] text-right text-[12px] tabular-nums">
              0.0000
            </div>
            <div className="border-r border-ve-border px-1.5 py-[2px] text-[12px]">Min</div>
            <div className="border-r border-ve-border py-[2px]">&nbsp;</div>
            <div className="py-[2px]">&nbsp;</div>
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-start gap-6 pl-[190px]">
        <label className="inline-flex items-center gap-1 text-[12px]">
          <input type="checkbox" className="h-3 w-3" /> Use Local Time
        </label>
        <div className="ml-auto flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-1 text-[12px]">
              <input type="checkbox" className="h-3 w-3" /> Intercompany
            </label>
            <span className="text-[12px] text-ve-label">IC Company</span>
            <div className="w-[190px]">
              <Input disabled />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <span className="text-[12px] text-ve-label">IC Adj %</span>
            <div className="w-[190px]">
              <Input disabled />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1 flex justify-center">
        <label className="inline-flex items-center gap-1 text-[12px]">
          <input type="checkbox" className="h-3 w-3" /> Add All Off Hires
        </label>
      </div>
    </div>
  );
}

/* ---------- Tabs + grids ---------- */

const pricingColumns: Column[] = [
  { id: "hireRate", label: "Hire Rate", width: 120, align: "right" },
  { id: "rateType", label: "Rate Type", width: 90 },
  { id: "code", label: "Code", width: 76 },
  { id: "lock", label: "Lock", width: 76 },
  { id: "fromGmt", label: "From GMT", width: 120 },
  { id: "toGmt", label: "To GMT", width: 120 },
  { id: "duration", label: "Duration", width: 100, align: "right" },
  { id: "period", label: "Period", width: 88 },
  { id: "tclIns", label: "TCL Ins", width: 76 },
  { id: "comments", label: "Comments", width: 240 },
];
const pricingRows: Row[] = [];

const brokerColumns: Column[] = [
  { id: "broker", label: "Broker", width: 150 },
  { id: "cntrparty", label: "Internal Cntrparty", width: 150 },
  { id: "rate", label: "Rate", width: 96, align: "right" },
  { id: "type", label: "Type", width: 80 },
  { id: "method", label: "Payment Method", width: 160 },
  { id: "m", label: "M", width: 36 },
  { id: "fromGmt", label: "From GMT", width: 120 },
  { id: "toGmt", label: "To GMT", width: 120 },
  { id: "remarks", label: "Remarks", width: 240 },
];
const brokerRows: Row[] = [];

const TABS = [
  "Pricing",
  "Bunkers",
  "Exposure",
  "Performance",
  "Notice",
  "Off Hire",
  "Properties",
  "Inv Items",
  "Linked Trades",
  "Lease",
  "Emissions",
];

function TabsSection() {
  const [active, setActive] = useState(0);
  return (
    <div className="px-2 pt-2">
      <div className="flex flex-wrap items-end border-b border-ve-border text-[12px]">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(i)}
            className={`px-3 py-1.5 ${
              i === active
                ? "-mb-px border-b-2 border-b-ve-accent font-semibold text-ve-text"
                : "font-semibold text-ve-accent hover:underline"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-2 overflow-x-auto">
        <EditableTable
          key={`pricing-${active}`}
          storageKey={`tcofix:pricing:${TABS[active]}`}
          initialColumns={pricingColumns}
          initialRows={pricingRows}
          minVisibleRows={6}
          resizable
        />
      </div>

      <div className="mt-3 overflow-x-auto pb-3">
        <EditableTable
          storageKey="tcofix:broker"
          initialColumns={brokerColumns}
          initialRows={brokerRows}
          minVisibleRows={3}
          resizable
        />
      </div>
    </div>
  );
}

/* ---------- Summary sidebar ---------- */

function SummaryPanel() {
  const items = ["Broker(s)", "Voyage(s)", "Attachment(s)"];
  return (
    <aside className="w-[240px] shrink-0 px-3 pt-2">
      <h2 className="text-[17px] font-bold text-ve-text">Summary</h2>
      <button className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-ve-accent hover:underline">
        <ChevronRight className="h-3.5 w-3.5 text-ve-text" />
        Invoices
      </button>
      <div className="mt-2 flex flex-col items-start gap-2 pl-[18px]">
        {items.map((i) => (
          <button key={i} className="text-[13px] text-ve-accent hover:underline">
            {i}
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ---------- Page ---------- */

function TcoFixture() {
  return (
    <div className="min-h-screen bg-ve-app text-ve-text">
      <div className="mx-auto min-h-screen max-w-[1700px] border-x border-ve-border bg-white">
        <div className="px-3 pt-2 pb-1 text-[18px] font-bold">Time Charter Out</div>
        <Toolbar />

        <div className="flex">
          <div className="min-w-0 flex-1">
            {/* Header fields */}
            <div className="flex gap-4 px-2 pt-2">
              <div className="min-w-0 flex-1">
                <Field label="Vessel"><Select /></Field>
                <Field label="TC Code"><Input disabled /></Field>
                <Field label="Charterer"><Input /></Field>
                <Field label="Bill Via"><Input /></Field>
                <Field label="Laycan From" checkbox><Input /></Field>
                <Field label="Laycan To"><Input /></Field>
              </div>

              <div className="min-w-0 flex-1">
                <Field label="Date/Fixed By">
                  <div className="flex gap-1">
                    <Input />
                    <Input />
                  </div>
                </Field>
                <Field label="Company"><Input /></Field>
                <Field label="Department"><Input /></Field>
                <Field label="Trade Area"><Input /></Field>
                <Field label="Ref No."><Input /></Field>
                <Field label="Payment Terms">
                  <div className="flex gap-1">
                    <Input />
                    <Input />
                  </div>
                </Field>
                <Field label="Contract Type"><Input /></Field>
                <Field label="Ops Coordinator"><Input /></Field>
                <Field label="Chtr Specialist"><Input /></Field>
                <Field label="Conf Date GMT"><Input disabled /></Field>
              </div>

              <div className="min-w-0 flex-1">
                <Field label="Status" labelWidth="w-40"><Input value="OPPORTUNITY" /></Field>
                <Field label="Billing Period" labelWidth="w-40"><Input /></Field>
                <Field label="Billing Schedule" labelWidth="w-40"><Input value="IN ADVANCE" /></Field>
                <Field label="Rebillable Admin Fee %" labelWidth="w-40">
                  <Input value="0.00" align="right" />
                </Field>
                <Field label="Currency/Exchange Rate" labelWidth="w-40">
                  <div className="flex gap-1">
                    <div className="w-[60px] shrink-0">
                      <Input value="USD" />
                    </div>
                    <Input value="1.000000" align="right" />
                  </div>
                </Field>
                <Field label="Ref Contract" labelWidth="w-40"><Input /></Field>
                <DurationGrid />
              </div>
            </div>

            <DeliveryGrid />
            <TabsSection />
          </div>

          <SummaryPanel />
        </div>
      </div>
    </div>
  );
}
