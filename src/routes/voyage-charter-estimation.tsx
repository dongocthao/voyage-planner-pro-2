import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Plus, Search, Save, Trash2, FileText, Lock, RefreshCw, AlertTriangle, Globe } from "lucide-react";
import { useState } from "react";
import EditableTable, { type Column, type Row } from "@/components/EditableTable";

export const Route = createFileRoute("/voyage-charter-estimation")({
  head: () => ({
    meta: [
      { title: "Voyage Charter Estimation" },
      { name: "description", content: "Voyage Charter Estimation — dự tính chuyến, cargoes, itinerary, chi phí và P&L." },
    ],
  }),
  component: VoyageCharterEstimation,
});

/* ---------- Reusable bits ---------- */

function Field({
  label,
  children,
  labelWidth = "w-32",
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: string;
}) {
  return (
    <div className="flex items-center gap-2 py-[1px]">
      <label className={`${labelWidth} shrink-0 text-right text-[12px] text-ve-label`}>{label}</label>
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
      <button className="ve-tool-btn" aria-label="Add"><Plus className="h-4 w-4 text-ve-accent" /></button>
      <button className="ve-tool-btn" aria-label="Search"><Search className="h-4 w-4 text-ve-accent" /></button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn flex items-center gap-1 px-2 font-semibold text-ve-text">
        <Save className="h-4 w-4 text-ve-accent" /> Lưu
      </button>
      <button className="ve-tool-btn" aria-label="Delete"><Trash2 className="h-4 w-4 text-ve-label" /></button>
      <button className="ve-tool-btn flex items-center gap-1 px-2">Menu <ChevronDown className="h-3 w-3" /></button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn px-2 text-ve-accent hover:underline">Thêm hàng</button>
      <button className="ve-tool-btn px-2 text-ve-accent hover:underline">Lịch trình</button>
      <span className="mx-1 h-4 w-px bg-ve-border" />
      <button className="ve-tool-btn flex items-center gap-1 px-2">
        <FileText className="h-4 w-4 text-ve-label" /> Báo cáo <ChevronDown className="h-3 w-3" />
      </button>
      <button className="ve-tool-btn"><Lock className="h-4 w-4 text-emerald-600" /></button>
      <button className="ve-tool-btn flex items-center gap-1 px-2">
        <RefreshCw className="h-4 w-4 text-ve-accent" /> Cập nhật giá
      </button>
      <AlertTriangle className="ml-1 h-4 w-4 text-amber-500" />
      <div className="ml-auto flex items-center gap-2 pr-1">
        <Link to="/" className="text-ve-accent hover:underline">← Voyage Estimator</Link>
        <Globe className="h-4 w-4 text-ve-accent" />
      </div>
    </div>
  );
}

/* ---------- Header section: Fuel tabs ---------- */

const fuelCols: Column[] = [
  { id: "fuel", label: "Nhiên liệu", width: 80 },
  { id: "load", label: "Chở hàng", width: 70, align: "right" },
  { id: "ballast", label: "Chạy rỗng", width: 70, align: "right" },
  { id: "run", label: "Chạy luồng", width: 70, align: "right" },
  { id: "load2", label: "Xếp hàng", width: 70, align: "right" },
  { id: "dis", label: "Dỡ hàng", width: 70, align: "right" },
  { id: "idle", label: "Nghỉ", width: 55, align: "right" },
  { id: "other", label: "Bù khác", width: 65, align: "right" },
];
const fuelData: Row[] = [
  { __id: "f1", fuel: "FO", load: "12.00", ballast: "11.00", run: "5.00", load2: "3.00", dis: "3.00", idle: "1.00", other: "0.00" },
  { __id: "f2", fuel: "DO", load: "0.50", ballast: "0.50", run: "1.50", load2: "0.80", dis: "0.80", idle: "0.30", other: "0.00" },
  { __id: "f3", fuel: "", load: "", ballast: "", run: "", load2: "", dis: "", idle: "", other: "" },
  { __id: "f4", fuel: "", load: "", ballast: "", run: "", load2: "", dis: "", idle: "", other: "" },
];

function HeaderSection() {
  const [tab, setTab] = useState(0);
  const tabs = ["Toàn tải", "Kinh tế", "Tuỳ chỉnh"];
  return (
    <div className="grid grid-cols-12 gap-3 border-b border-ve-border bg-white px-3 py-2">
      {/* Column 1 */}
      <div className="col-span-3">
        <Field label="Mã dự tính"><Input /></Field>
        <Field label="Mã đơn hàng"><Input /></Field>
        <Field label="Tên tàu"><Select /></Field>
        <Field label="DWT">
          <div className="flex gap-1">
            <Input value="34,752" align="right" />
            <Input value="MT" />
          </div>
        </Field>
        <Field label="Kiểu khai thác"><Select value="TCOV" /></Field>
        <Field label="Đơn vị"><Select /></Field>
        <Field label="Nhân viên khai thác"><Select /></Field>
      </div>

      {/* Column 2 */}
      <div className="col-span-4">
        <Field label="Cảng chạy rỗng"><Select /></Field>
        <Field label="Cảng điều động"><Select /></Field>
        <Field label="Bắt đầu chuyến"><Select value="10/01/22 19:26" /></Field>
        <Field label="Kết thúc chuyến"><Select value="27/01/22 12:17" /></Field>
        <Field label="Vùng hoạt động"><Input /></Field>
        <Field label="Rủi ro cướp biển">
          <div className="flex gap-1">
            <Input /><Input />
          </div>
        </Field>
        <Field label="Tuyến ECA">
          <div className="flex gap-1">
            <Input /><Input />
          </div>
        </Field>
      </div>

      {/* Column 3: Tabs + speed + fuel table */}
      <div className="col-span-5">
        <div className="flex border-b border-ve-border text-[12px]">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`border-r border-ve-border px-3 py-1 ${i === tab ? "border-b-2 border-b-ve-accent bg-white font-semibold text-ve-text" : "bg-ve-sectionBg text-ve-label hover:text-ve-text"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="w-24 shrink-0 text-[12px] text-ve-label">Tốc độ (hl/h)</div>
          <label className="text-[12px] text-ve-label">Chở hàng</label>
          <div className="w-20"><Input value="11.50" align="right" /></div>
          <label className="text-[12px] text-ve-label">Chạy rỗng</label>
          <div className="w-20"><Input value="12.00" align="right" /></div>
        </div>
        <div className="mt-1">
          <EditableTable
            storageKey="vce:fuel"
            initialColumns={fuelCols}
            initialRows={fuelData}
            minVisibleRows={4}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Cargoes ---------- */

const cargoCols: Column[] = [
  { id: "code", label: "Mã hàng", width: 80 },
  { id: "name", label: "Tên hàng", width: 160 },
  { id: "group", label: "Phân nhóm", width: 110 },
  { id: "qty", label: "Khối lượng", width: 90, align: "right" },
  { id: "unit", label: "Đơn vị tính", width: 80 },
  { id: "tol", label: "% Dung sai", width: 80, align: "right" },
  { id: "tolType", label: "Kiểu dung sai", width: 100 },
  { id: "frtType", label: "Loại cước", width: 90 },
  { id: "frtRate", label: "Giá cước", width: 90, align: "right" },
  { id: "lump", label: "Cước khoán", width: 100, align: "right" },
  { id: "term", label: "ĐK Cước", width: 80 },
  { id: "hh", label: "% HH", width: 60, align: "right" },
  { id: "mg", label: "% MG", width: 60, align: "right" },
  { id: "tax", label: "Thuế cước", width: 80, align: "right" },
  { id: "liner", label: "Phí Liner", width: 80, align: "right" },
  { id: "chtr", label: "Bên thuê tàu", width: 150 },
];
const cargoData: Row[] = Array.from({ length: 5 }).map((_, i) => {
  const r: Row = { __id: `c${i + 1}` };
  cargoCols.forEach((c) => (r[c.id] = ""));
  return r;
});

/* ---------- Itinerary ---------- */

const itiCols: Column[] = [
  { id: "op", label: "Tác nghiệp", width: 110 },
  { id: "port", label: "Cảng / Vị trí", width: 160 },
  { id: "dist", label: "Cự ly", width: 70, align: "right" },
  { id: "eca", label: "ECA", width: 60, align: "right" },
  { id: "draft", label: "Độ trừ", width: 70, align: "right" },
  { id: "type", label: "Kiểu", width: 60 },
  { id: "spd", label: "Tốc độ", width: 70, align: "right" },
  { id: "cday", label: "Ngày c...", width: 90 },
  { id: "rate", label: "Mức xếp dỡ", width: 100, align: "right" },
  { id: "berth", label: "Ngày đỗ", width: 90 },
  { id: "wait", label: "Ngày chờ", width: 90 },
  { id: "dem", label: "Mức phạt", width: 90, align: "right" },
  { id: "des", label: "Mức thưởng", width: 90, align: "right" },
  { id: "pf", label: "Cảng phí", width: 90, align: "right" },
  { id: "arr", label: "Ngày đến", width: 110 },
  { id: "dep", label: "Ngày rời", width: 110 },
];
const itiData: Row[] = Array.from({ length: 10 }).map((_, i) => {
  const r: Row = { __id: `i${i + 1}` };
  itiCols.forEach((c) => (r[c.id] = ""));
  return r;
});

/* ---------- Chi phí + Nhiên liệu + P&L ---------- */

function CostFieldColumn({ items }: { items: [string, string][] }) {
  return (
    <div>
      {items.map(([l, v]) => (
        <Field key={l} label={l} labelWidth="w-28"><Input value={v} align="right" /></Field>
      ))}
    </div>
  );
}

const costCol1: [string, string][] = [
  ["Chi phí ngày tàu", ""],
  ["Nhiên liệu", ""],
  ["Cảng phí", ""],
  ["Hoa hồng", ""],
  ["Môi giới", ""],
  ["Thuế cước", ""],
  ["Liner", ""],
  ["Thưởng dôi nhật", ""],
];
const costCol2: [string, string][] = [
  ["Giám định", ""],
  ["Kiểm đếm", ""],
  ["Vật liệu", ""],
  ["Cấu bờ", ""],
  ["Xà lan", ""],
  ["Kênh eo", ""],
  ["Bồi dưỡng", ""],
  ["Phí khác", ""],
];
const pnlItems: [string, string][] = [
  ["Cước biển", ""],
  ["Phạt dôi nhật", ""],
  ["Bù chạy rỗng", ""],
  ["Thu khác", ""],
  ["Tổng doanh thu", ""],
  ["Tổng chi phí", ""],
  ["Lãi (Lỗ)", ""],
  ["Lãi (Lỗ)/ Ngày", ""],
  ["TCE", ""],
  ["Điểm hoà vốn", ""],
];

const costFuelCols: Column[] = [
  { id: "fuel", label: "Nhiên liệu", width: 100 },
  { id: "price", label: "Đơn giá / MT", width: 110, align: "right" },
  { id: "qty", label: "Lượng (MT)", width: 100, align: "right" },
  { id: "amt", label: "Thành tiền", width: 130, align: "right" },
];
const costFuelData: Row[] = [
  { __id: "cf1", fuel: "FO", price: "", qty: "", amt: "" },
  { __id: "cf2", fuel: "DO", price: "", qty: "", amt: "" },
  { __id: "cf3", fuel: "", price: "", qty: "", amt: "" },
  { __id: "cf4", fuel: "", price: "", qty: "", amt: "" },
];

function CostSection() {
  return (
    <div className="grid grid-cols-12 gap-4 border-t border-ve-border bg-white px-3 py-3">
      <div className="col-span-3">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-ve-text">Chi phí khai thác</div>
        <CostFieldColumn items={costCol1} />
      </div>
      <div className="col-span-2 pt-5">
        <CostFieldColumn items={costCol2} />
      </div>
      <div className="col-span-4 pt-1">
        <EditableTable
          storageKey="vce:costFuel"
          initialColumns={costFuelCols}
          initialRows={costFuelData}
          minVisibleRows={4}
        />
      </div>
      <div className="col-span-3">
        <CostFieldColumn items={pnlItems} />
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function VoyageCharterEstimation() {
  return (
    <div className="min-h-screen bg-ve-app text-ve-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1900px] flex-col border-x border-ve-border bg-white">
        <div className="flex items-center gap-2 border-b border-ve-border bg-white px-3 py-1.5 text-[13px] font-semibold">
          <span>Voyage Charter Estimation</span>
        </div>

        <Toolbar />

        <div className="flex-1 overflow-auto">
          <HeaderSection />

          <div className="border-b border-ve-border bg-white p-3">
            <EditableTable
              storageKey="vce:cargoes"
              title="Danh sách hàng hoá"
              initialColumns={cargoCols}
              initialRows={cargoData}
              minVisibleRows={5}
            />
          </div>

          <div className="border-b border-ve-border bg-white p-3">
            <EditableTable
              storageKey="vce:itinerary"
              title="Lịch trình chuyến"
              initialColumns={itiCols}
              initialRows={itiData}
              minVisibleRows={10}
            />
          </div>

          <CostSection />
        </div>
      </div>
    </div>
  );
}
