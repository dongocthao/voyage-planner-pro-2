import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronDown,
  FilePlus,
  Pencil,
  RefreshCw,
  Trash2,
  Search,
  Printer,
  Download,
  FileText,
  Ruler,
  Anchor,
  Fuel,
  LineChart,
  LogOut,
} from "lucide-react";
import { useMemo, useState } from "react";
import EditableTable, { type Column, type Row, type FooterRow } from "@/components/EditableTable";

export const Route = createFileRoute("/voyage-charter-estimation")({
  head: () => ({
    meta: [
      { title: "Voyage Charter Estimation" },
      {
        name: "description",
        content:
          "Voyage Charter Estimation — dự tính chuyến, cargoes, itinerary, chi phí và P&L.",
      },
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
      <label className={`${labelWidth} shrink-0 text-right text-[12px] text-ve-label`}>
        {label}
      </label>
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

/* ---------- Toolbar ---------- */

type TB = { label: string; Icon: React.ComponentType<{ className?: string }>; color: string };
const TOOLBAR_BTNS: TB[] = [
  { label: "Thêm mới", Icon: FilePlus, color: "text-emerald-600" },
  { label: "Chỉnh sửa", Icon: Pencil, color: "text-blue-600" },
  { label: "Cập nhật", Icon: RefreshCw, color: "text-sky-600" },
  { label: "Xoá bỏ", Icon: Trash2, color: "text-red-600" },
  { label: "Tìm kiếm", Icon: Search, color: "text-indigo-600" },
  { label: "In ấn", Icon: Printer, color: "text-slate-600" },
  { label: "Xuất dữ liệu", Icon: Download, color: "text-emerald-700" },
  { label: "Báo cáo", Icon: FileText, color: "text-violet-600" },
  { label: "Tìm cự ly", Icon: Ruler, color: "text-amber-600" },
  { label: "Tra cứu cảng phí", Icon: Anchor, color: "text-teal-600" },
  { label: "Tính toán nhiên liệu", Icon: Fuel, color: "text-orange-600" },
  { label: "Phân tích độ nhạy", Icon: LineChart, color: "text-fuchsia-600" },
];

function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-ve-border bg-ve-toolbar px-2 py-1 text-[12px]">
      {TOOLBAR_BTNS.map((b) => (
        <button
          key={b.label}
          type="button"
          className="ve-tool-btn flex items-center gap-1 px-2 hover:bg-ve-rowHover"
        >
          <b.Icon className={`h-4 w-4 ${b.color}`} />
          <span className="text-ve-text">{b.label}</span>
        </button>
      ))}
      <button
        type="button"
        className="ve-tool-btn ml-auto flex items-center gap-1 px-2 hover:bg-ve-rowHover"
      >
        <LogOut className="h-4 w-4 text-rose-600" />
        <span className="text-ve-text">Thoát</span>
      </button>
      <Link to="/" className="ml-2 text-ve-accent hover:underline">
        ← Voyage Estimator
      </Link>
    </div>
  );
}

/* ---------- Fuel consumption (top-right) ---------- */

const FUEL_NAMES = ["VLSFO", "LSMGO", "HSF", "MDO"];

const fuelCols: Column[] = [
  { id: "fuel", label: "Nhiên liệu", width: 78 },
  { id: "load", label: "Chở hàng", width: 74, align: "right" },
  { id: "ballast", label: "Chạy rỗng", width: 74, align: "right" },
  { id: "run", label: "Chạy luồng", width: 74, align: "right" },
  { id: "load2", label: "Xếp hàng", width: 72, align: "right" },
  { id: "dis", label: "Dỡ hàng", width: 72, align: "right" },
  { id: "idle", label: "Nghỉ", width: 60, align: "right" },
  { id: "other", label: "Bù khác", width: 68, align: "right" },
];
const fuelData: Row[] = FUEL_NAMES.map((n, i) => {
  const r: Row = { __id: `f${i + 1}`, fuel: n };
  fuelCols.slice(1).forEach((c) => (r[c.id] = ""));
  return r;
});

/* ---------- Fuel price (top-right, moved from bottom) ---------- */

const costFuelCols: Column[] = [
  { id: "fuel", label: "Nhiên liệu", width: 80 },
  { id: "price", label: "Đơn giá / MT", width: 100, align: "right" },
  { id: "qty", label: "Lượng (MT)", width: 100, align: "right" },
  { id: "amt", label: "Thành tiền", width: 110, align: "right" },
];
const costFuelData: Row[] = FUEL_NAMES.map((n, i) => ({
  __id: `cf${i + 1}`,
  fuel: n,
  price: "",
  qty: "",
  amt: "",
}));

/* ---------- Header section ---------- */

function HeaderSection() {
  const [tab, setTab] = useState(0);
  const tabs = ["Toàn tải", "Kinh tế", "Tuỳ chỉnh"];
  return (
    <div className="grid grid-cols-12 gap-3 border-b border-ve-border bg-white px-3 py-2">
      {/* Column 1: identifiers */}
      <div className="col-span-3">
        <Field label="Mã dự tính"><Input /></Field>
        <Field label="Mã đơn hàng"><Input /></Field>
        <Field label="Tên tàu"><Select /></Field>
        <Field label="DWT">
          <div className="flex items-center gap-2">
            <div className="w-24"><Input value="34,752" align="right" /></div>
            <span className="whitespace-nowrap text-[12px] text-ve-label">Phí ngày tàu vận doanh</span>
          </div>
        </Field>
        <Field label="Kiểu khai thác">
          <div className="flex gap-1">
            <Select value="TCOV" />
            <Select />
          </div>
        </Field>
        <Field label="Đơn vị"><Select /></Field>
        <Field label="Nhân viên khai thác"><Select /></Field>
      </div>

      {/* Column 2: voyage */}
      <div className="col-span-3">
        <Field label="Cảng chạy rỗng"><Select /></Field>
        <Field label="Cảng điều động"><Select /></Field>
        <Field label="Bắt đầu chuyến"><Select value="10/01/22 19:26" /></Field>
        <Field label="Kết thúc chuyến"><Select value="27/01/22 12:17" /></Field>
        <Field label="Vùng hoạt động"><Input /></Field>
        <Field label="Rủi ro cướp biển">
          <div className="flex gap-1"><Input /><Input /></div>
        </Field>
        <Field label="Tuyến ECA">
          <div className="flex gap-1"><Input /><Input /></div>
        </Field>
      </div>

      {/* Column 3: speed + fuel consumption */}
      <div className="col-span-3">
        <div className="flex items-center justify-between border-b border-ve-border">
          <div className="flex items-center gap-2 text-[12px]">
            <span className="text-ve-label">Tốc độ (hl/h)</span>
            <span className="text-ve-label">Chở hàng</span>
            <div className="w-16"><Input value="11.50" align="right" /></div>
            <span className="text-ve-label">Chạy rỗng</span>
            <div className="w-16"><Input value="12.00" align="right" /></div>
          </div>
          <div className="flex text-[12px]">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`border-l border-ve-border px-3 py-1 ${i === tab ? "border-b-2 border-b-ve-accent bg-white font-semibold text-ve-text" : "bg-ve-sectionBg text-ve-label hover:text-ve-text"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-1 overflow-x-auto">
          <EditableTable
            storageKey="vce:fuel"
            initialColumns={fuelCols}
            initialRows={fuelData}
            minVisibleRows={4}
            hideActions
          />
        </div>
      </div>

      {/* Column 4: Lần chỉnh sửa gần nhất + fuel price */}
      <div className="col-span-3">
        <div className="flex items-center justify-between border-b border-ve-border pb-1">
          <span className="text-[12px] font-semibold text-ve-text">Lần chỉnh sửa gần nhất:</span>
          <div className="flex gap-1">
            <button className="flex items-center gap-1 border border-ve-border bg-white px-2 py-[2px] text-[11px] text-ve-text hover:bg-ve-rowHover">
              <Fuel className="h-3.5 w-3.5 text-orange-600" /> Tính nhiên liệu
            </button>
            <button className="flex items-center gap-1 border border-ve-border bg-white px-2 py-[2px] text-[11px] text-ve-text hover:bg-ve-rowHover">
              <RefreshCw className="h-3.5 w-3.5 text-sky-600" /> Cập nhật giá
            </button>
          </div>
        </div>
        <div className="mt-1 overflow-x-auto">
          <EditableTable
            storageKey="vce:costFuel"
            initialColumns={costFuelCols}
            initialRows={costFuelData}
            minVisibleRows={4}
            hideActions
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
  { id: "freight", label: "Tiền cước", width: 100, align: "right" },
  { id: "term", label: "ĐK Cước", width: 80 },
  { id: "hh", label: "% HH", width: 60, align: "right" },
  { id: "mg", label: "% MG", width: 60, align: "right" },
  { id: "tax", label: "Thuế cước", width: 80, align: "right" },
  { id: "liner", label: "Phí Liner", width: 80, align: "right" },
  { id: "chtr", label: "Bên thuê tàu", width: 180 },
];
const cargoData: Row[] = Array.from({ length: 7 }).map((_, i) => {
  const r: Row = { __id: `c${i + 1}` };
  cargoCols.forEach((c) => (r[c.id] = ""));
  return r;
});

/* ---------- Itinerary ---------- */

const itiCols: Column[] = [
  { id: "op", label: "Tác nghiệp", width: 100 },
  { id: "port", label: "Cảng / Vị trí", width: 160 },
  { id: "tz", label: "Múi giờ", width: 70, align: "right" },
  { id: "dist", label: "Cự ly", width: 60, align: "right" },
  { id: "eca", label: "ECA", width: 55, align: "right" },
  { id: "draft", label: "Độ trượt", width: 70, align: "right" },
  { id: "type", label: "Kiểu", width: 55 },
  { id: "spd", label: "Ngày chạy", width: 80, align: "right" },
  { id: "cday", label: "Ngày c...", width: 80 },
  { id: "rate", label: "Mức xếp dỡ", width: 90, align: "right" },
  { id: "berth", label: "Ngày đỗ", width: 80, align: "right" },
  { id: "wait", label: "Ngày chờ", width: 80, align: "right" },
  { id: "dem", label: "Mức phạt", width: 80, align: "right" },
  { id: "des", label: "Mức thưởng", width: 90, align: "right" },
  { id: "pf", label: "Cảng phí", width: 80, align: "right" },
  { id: "arr", label: "Ngày đến", width: 130 },
  { id: "dep", label: "Ngày rời", width: 130 },
];
const itiData: Row[] = Array.from({ length: 10 }).map((_, i) => {
  const r: Row = { __id: `i${i + 1}` };
  itiCols.forEach((c) => (r[c.id] = ""));
  return r;
});

function toNum(v: string | undefined) {
  if (!v) return 0;
  const n = parseFloat(v.replace(/,/g, ""));
  return isFinite(n) ? n : 0;
}
function fmt(n: number) {
  if (!n) return "";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/* ---------- Sidebar (Ước hiệu quả chuyến) ---------- */

function SidebarField({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-[1px]">
      <label className="w-32 shrink-0 text-right text-[12px] text-ve-label">{label}</label>
      <div className="flex-1"><Input align="right" /></div>
    </div>
  );
}

const REVENUE_ITEMS = [
  "Cước biển",
  "Phạt dôi nhật",
  "Bù chạy rỗng",
  "Thu khác",
  "Tổng doanh thu",
  "Tổng chi phí",
  "Lãi (Lỗ)",
  "Lãi (Lỗ)/ Ngày",
  "TCE",
  "Điểm hoà vốn",
];

const COST_ITEMS = [
  "Phí vận doanh",
  "Nhiên liệu",
  "Cảng phí",
  "Hoa hồng",
  "Môi giới",
  "Thuế cước",
  "Liner",
  "Thưởng dôi nhật",
  "Giám định",
  "Kiểm đếm",
  "Vật liệu",
  "Cấu bờ",
  "Xà lan",
  "Kênh eo",
  "Phí phát thải carbon",
  "Phí khác",
];

function Sidebar() {
  return (
    <aside className="flex flex-col border-l border-ve-border bg-white">
      <div className="border-b border-ve-border bg-ve-sectionBg px-3 py-1 text-[13px] font-semibold text-ve-text">
        ƯỚC HIỆU QUẢ CHUYẾN
      </div>
      <div className="px-3 py-2">
        <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-ve-text">
          DOANH THU CHUYẾN
        </div>
        {REVENUE_ITEMS.map((l) => (
          <SidebarField key={l} label={l} />
        ))}
        <div className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-wider text-ve-text">
          CHI PHÍ KHAI THÁC
        </div>
        {COST_ITEMS.map((l) => (
          <SidebarField key={l} label={l} />
        ))}
      </div>
    </aside>
  );
}

/* ---------- Time summary (bottom middle) ---------- */

function TimeSummary() {
  const leftRows = ["Chạy có hàng", "Chạy rỗng", "Chạy luồng"];
  const rightRows = ["Xếp hàng", "Dỡ hàng", "Thời gian chờ", "Thời gian khác"];
  return (
    <div className="border border-ve-border bg-white">
      <div className="flex items-center justify-between border-b border-ve-border bg-ve-sectionBg px-3 py-1">
        <span className="text-[13px] font-semibold text-ve-text">Tổng thời gian chuyến</span>
        <div className="flex items-center gap-2">
          <div className="w-20"><Input align="right" /></div>
          <span className="text-[12px] text-ve-label">Ngày</span>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r border-ve-border">
          {leftRows.map((r) => (
            <div key={r} className="flex border-t border-ve-border first:border-t-0 text-[12px]">
              <div className="w-[110px] shrink-0 border-r border-ve-border px-1.5 py-[3px] text-ve-label">
                {r}
              </div>
              <div className="flex-1">
                <input className="h-[22px] w-full border-0 bg-transparent px-1.5 text-right text-[12px] outline-none focus:bg-ve-rowHover" />
              </div>
            </div>
          ))}
        </div>
        <div>
          {rightRows.map((r) => (
            <div key={r} className="flex border-t border-ve-border first:border-t-0 text-[12px]">
              <div className="w-[110px] shrink-0 border-r border-ve-border px-1.5 py-[3px] text-ve-label">
                {r}
              </div>
              <div className="flex-1">
                <input className="h-[22px] w-full border-0 bg-transparent px-1.5 text-right text-[12px] outline-none focus:bg-ve-rowHover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Itinerary title checkboxes ---------- */

function ItineraryTitleRight() {
  return (
    <div className="flex items-center gap-4 text-[12px] text-ve-text">
      <label className="flex items-center gap-1"><input type="checkbox" /> Kênh Suez</label>
      <label className="flex items-center gap-1"><input type="checkbox" /> Kênh Panama</label>
      <label className="flex items-center gap-1"><input type="checkbox" /> Kênh Kiel</label>
    </div>
  );
}

/* ---------- Page ---------- */

function VoyageCharterEstimation() {
  const [cargoRows, setCargoRows] = useState<Row[]>(cargoData);
  const [itiRows, setItiRows] = useState<Row[]>(itiData);

  const cargoFooter: FooterRow[] = useMemo(() => {
    const sumQty = cargoRows.reduce((s, r) => s + toNum(r.qty), 0);
    const sumFrt = cargoRows.reduce((s, r) => s + toNum(r.freight), 0);
    const sumLiner = cargoRows.reduce((s, r) => s + toNum(r.liner), 0);
    return [
      {
        cells: {
          code: { text: "Tổng" },
          qty: { text: fmt(sumQty) },
          freight: { text: fmt(sumFrt) },
          liner: { text: fmt(sumLiner) },
        },
      },
    ];
  }, [cargoRows]);

  const itiFooter: FooterRow[] = useMemo(() => {
    const sum = (k: string) => itiRows.reduce((s, r) => s + toNum(r[k]), 0);
    return [
      {
        cells: {
          op: { text: "Bù độ trượt" },
          spd: { input: true },
          berth: { input: true },
          wait: { input: true },
        },
      },
      {
        cells: {
          op: { text: "Tổng" },
          dist: { text: fmt(sum("dist")) },
          eca: { text: fmt(sum("eca")) },
          spd: { text: fmt(sum("spd")) },
          berth: { text: fmt(sum("berth")) },
          wait: { text: fmt(sum("wait")) },
          dem: { text: fmt(sum("dem")) },
          des: { text: fmt(sum("des")) },
          pf: { text: fmt(sum("pf")) },
        },
      },
    ];
  }, [itiRows]);

  return (
    <div className="min-h-screen bg-ve-app text-ve-text">
      <div className="mx-auto flex min-h-screen w-full max-w-[1900px] flex-col border-x border-ve-border bg-white">
        <div className="flex items-center gap-2 border-b border-ve-border bg-white px-3 py-1.5 text-[13px] font-semibold">
          <span>Voyage Charter Estimation</span>
        </div>

        <Toolbar />

        <HeaderSection />

        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_360px]">
          {/* Left/main area */}
          <div className="flex flex-col">
            <div className="border-b border-ve-border bg-white p-3">
              <div className="overflow-x-auto">
                <EditableTable
                  storageKey="vce:cargoes"
                  title="Danh sách hàng hoá"
                  initialColumns={cargoCols}
                  initialRows={cargoData}
                  minVisibleRows={7}
                  resizable
                  onRowsChange={setCargoRows}
                  footerRows={cargoFooter}
                />
              </div>
            </div>

            <div className="border-b border-ve-border bg-white p-3">
              <div className="overflow-x-auto">
                <EditableTable
                  storageKey="vce:itinerary"
                  title="Lịch trình chuyến"
                  titleRight={<ItineraryTitleRight />}
                  initialColumns={itiCols}
                  initialRows={itiData}
                  minVisibleRows={10}
                  resizable
                  onRowsChange={setItiRows}
                  footerRows={itiFooter}
                />
              </div>
            </div>

            {/* Bottom: notes + time summary */}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 bg-white p-3">
              <div className="border border-ve-border">
                <div className="border-b border-ve-border bg-ve-sectionBg px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-ve-text">
                  Ghi chú bảng dự tính
                </div>
                <textarea className="h-32 w-full resize-none border-0 bg-white p-2 text-[12px] outline-none" />
              </div>
              <TimeSummary />
            </div>
          </div>

          {/* Right sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
