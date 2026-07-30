import type { Column, FooterRow, Row } from "@/components/EditableTable";

const PORTS = ["CHITTAGONG", "MUARA BERAU ANCHORAGE", "HAZIRA"];

function mkRows(prefix: string, data: Record<string, string>[]): Row[] {
  return data.map((d, i) => ({ __id: `${prefix}${i + 1}`, ...d }) as Row);
}

/* ---------------- Cargo tab ---------------- */

export const cargoTabColumns: Column[] = [
  { id: "port", label: "Port", width: 170 },
  { id: "miles", label: "Miles", width: 60, align: "right" },
  { id: "spd", label: "Spd", width: 55, align: "right" },
  { id: "sdays", label: "SDays", width: 60, align: "right" },
  { id: "xsd", label: "XSD", width: 50, align: "right" },
  { id: "f", label: "F", width: 34 },
  { id: "grp", label: "Cargo Grp", width: 80 },
  { id: "gs", label: "GS", width: 40, align: "right" },
  { id: "grade", label: "Grade", width: 60 },
  { id: "ldQty", label: "L/D Qty", width: 80, align: "right" },
  { id: "unit", label: "Unit", width: 46 },
  { id: "altQty", label: "Alt Qty", width: 70, align: "right" },
  { id: "altUnit", label: "AltUnit", width: 60 },
  { id: "ldRate", label: "L/D Rate", width: 70, align: "right" },
  { id: "ru", label: "RU", width: 40 },
  { id: "c", label: "C", width: 34 },
  { id: "terms", label: "Terms", width: 66 },
  { id: "pd", label: "PD", width: 50, align: "right" },
  { id: "xpd", label: "XPD", width: 50, align: "right" },
  { id: "curr", label: "Curr", width: 50 },
  { id: "portExp", label: "PortExp", width: 76, align: "right" },
  { id: "b", label: "B", width: 40 },
];

export const cargoTabRows: Row[] = mkRows("ct", [
  { port: PORTS[0], miles: "", spd: "15.0", sdays: "", xsd: "", f: "C", grp: "", gs: "", grade: "", ldQty: "", unit: "", altQty: "", altUnit: "", ldRate: "", ru: "", c: "", terms: "", pd: "", xpd: "", curr: "USD", portExp: "", b: "" },
  { port: PORTS[1], miles: "2,807", spd: "15.0", sdays: "7.81", xsd: "0.5", f: "L", grp: "1 : DRY", gs: "1", grade: "COAL", ldQty: "40,626", unit: "MT", altQty: "", altUnit: "", ldRate: "", ru: "D", c: "Y", terms: "SHINC", pd: "0.50", xpd: "", curr: "USD", portExp: "50,000", b: "" },
  { port: PORTS[2], miles: "3,817", spd: "14.4", sdays: "11.05", xsd: "0.8", f: "D", grp: "1 : DRY", gs: "1", grade: "COAL", ldQty: "40,626", unit: "MT", altQty: "", altUnit: "", ldRate: "", ru: "D", c: "Y", terms: "SHINC", pd: "0.50", xpd: "", curr: "USD", portExp: "60,000", b: "" },
  { port: "", miles: "", spd: "0.0", sdays: "", xsd: "", f: "", grp: "", gs: "", grade: "", ldQty: "", unit: "", altQty: "", altUnit: "", ldRate: "", ru: "", c: "Y", terms: "", pd: "", xpd: "", curr: "USD", portExp: "", b: "" },
]);

export const cargoTabFooter: FooterRow[] = [
  {
    cells: {
      miles: { text: "6,624" },
      spd: { text: "18.86" },
      sdays: { text: "1.3" },
      pd: { text: "1.00" },
      portExp: { text: "110,000" },
    },
  },
];

/* ---------------- Draft/Restrictions ---------------- */

export const draftColumns: Column[] = [
  { id: "port", label: "Port", width: 170 },
  { id: "berth", label: "Berth", width: 60 },
  { id: "f", label: "F", width: 34 },
  { id: "draft", label: "Draft", width: 60, align: "right" },
  { id: "unit", label: "Unit", width: 46 },
  { id: "loadline", label: "Loadline", width: 90 },
  { id: "sal", label: "Salinity", width: 66, align: "right" },
  { id: "cargo", label: "Cargo", width: 66 },
  { id: "ldQty", label: "L/D Qty", width: 80, align: "right" },
  { id: "unit2", label: "Unit", width: 46 },
  { id: "altQty", label: "Alt Qty", width: 70, align: "right" },
  { id: "altUnit", label: "AltUnit", width: 60 },
  { id: "ft3", label: "FT3/MT", width: 74, align: "right" },
  { id: "m3", label: "M3/MT", width: 70, align: "right" },
  { id: "maxLift", label: "MaxLift", width: 74, align: "right" },
  { id: "robArr", label: "ROB Arr", width: 74, align: "right" },
  { id: "lsSday", label: "LS SDay", width: 74, align: "right" },
  { id: "lsPd", label: "LS PD", width: 66, align: "right" },
];

export const draftRows: Row[] = mkRows("dr", [
  { port: PORTS[0], berth: "QUAY", f: "C", draft: "", unit: "", loadline: "Summer Salt", sal: "1.025", cargo: "", ldQty: "", unit2: "", altQty: "0.000", altUnit: "", ft3: "", m3: "", maxLift: "57,592", robArr: "407.00", lsSday: "0.00", lsPd: "" },
  { port: PORTS[1], berth: "QUAY", f: "L", draft: "", unit: "", loadline: "Summer Salt", sal: "1.025", cargo: "COAL", ldQty: "40,626", unit2: "MT", altQty: "0.000", altUnit: "", ft3: "40.9650", m3: "1.1600", maxLift: "40,626", robArr: "240.16", lsSday: "0.00", lsPd: "" },
  { port: PORTS[2], berth: "QUAY", f: "D", draft: "", unit: "", loadline: "Summer Salt", sal: "1.025", cargo: "COAL", ldQty: "40,626", unit2: "MT", altQty: "0.000", altUnit: "", ft3: "40.9650", m3: "1.1600", maxLift: "40,626", robArr: "2.00", lsSday: "0.00", lsPd: "" },
]);

/* ---------------- Charterer ---------------- */

export const chartererColumns: Column[] = [
  { id: "port", label: "Port", width: 170 },
  { id: "miles", label: "Miles", width: 60, align: "right" },
  { id: "wf", label: "WF%", width: 56, align: "right" },
  { id: "draft", label: "Draft", width: 60, align: "right" },
  { id: "unit", label: "Unit", width: 46 },
  { id: "f", label: "F", width: 34 },
  { id: "loadline", label: "Loadline", width: 90 },
  { id: "sal", label: "Salinity", width: 66, align: "right" },
  { id: "ifoQty", label: "IFO Qty", width: 70, align: "right" },
  { id: "ifoPrc", label: "IFO Prc", width: 70, align: "right" },
  { id: "lsfQty", label: "LSF Qty", width: 70, align: "right" },
  { id: "lsfPrc", label: "LSF Prc", width: 70, align: "right" },
  { id: "curr", label: "Curr", width: 50 },
  { id: "portExp", label: "PortExp", width: 76, align: "right" },
  { id: "baseExp", label: "BaseExp", width: 78, align: "right" },
  { id: "grp", label: "Cargo Grp", width: 80 },
  { id: "gs", label: "GS", width: 40, align: "right" },
  { id: "grade", label: "Grade", width: 60 },
];

export const chartererRows: Row[] = mkRows("ch", [
  { port: PORTS[0], miles: "", wf: "7.00", draft: "", unit: "", f: "C", loadline: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "", baseExp: "", grp: "", gs: "", grade: "" },
  { port: PORTS[1], miles: "2,807", wf: "7.00", draft: "", unit: "", f: "L", loadline: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "50,000", baseExp: "50,000", grp: "1 : DRY", gs: "1", grade: "COAL" },
  { port: PORTS[2], miles: "3,817", wf: "7.00", draft: "", unit: "", f: "D", loadline: "Summer Salt", sal: "1.025", ifoQty: "", ifoPrc: "", lsfQty: "", lsfPrc: "", curr: "USD", portExp: "60,000", baseExp: "60,000", grp: "1 : DRY", gs: "1", grade: "COAL" },
]);

export const chartererFooter: FooterRow[] = [
  { cells: { miles: { text: "6,624" }, portExp: { text: "110,000" } } },
];

/* ---------------- Port/Date ---------------- */

export const portDateColumns: Column[] = [
  { id: "seq", label: "Seq", width: 46, align: "right" },
  { id: "port", label: "Port", width: 170 },
  { id: "miles", label: "Miles", width: 66, align: "right" },
  { id: "spd", label: "Spd", width: 55, align: "right" },
  { id: "sdays", label: "SDays", width: 60, align: "right" },
  { id: "xsd", label: "XSD", width: 50, align: "right" },
  { id: "f", label: "F", width: 34 },
  { id: "wf", label: "WF%", width: 60, align: "right" },
  { id: "day", label: "Day", width: 50 },
  { id: "eta", label: "ETA", width: 110, align: "right" },
  { id: "idle", label: "Idle", width: 56, align: "right" },
  { id: "pdays", label: "PDays", width: 60, align: "right" },
  { id: "xpd", label: "XPD", width: 50, align: "right" },
  { id: "dem", label: "Dem", width: 50, align: "right" },
  { id: "day2", label: "Day", width: 50 },
  { id: "etd", label: "ETD", width: 110, align: "right" },
  { id: "tz", label: "TZ", width: 46, align: "right" },
];

export const portDateRows: Row[] = mkRows("pd", [
  { seq: "10", port: "HAMBURG", miles: "", spd: "0.0", sdays: "", xsd: "", f: "C", wf: "7.00", day: "THU", eta: "05/08/14 18:19", idle: "0.00", pdays: "", xpd: "", dem: "", day2: "THU", etd: "05/08/14 18:19", tz: "" },
  { seq: "", port: "ENGLISH CHANNEL", miles: "395", spd: "0.0", sdays: "", xsd: "", f: "P", wf: "7.00", day: "THU", eta: "05/08/14 17:19", idle: "", pdays: "", xpd: "", dem: "", day2: "THU", etd: "05/08/14 17:19", tz: "1.0" },
  { seq: "", port: "GIBRALTAR", miles: "1,276", spd: "0.0", sdays: "", xsd: "", f: "P", wf: "7.00", day: "THU", eta: "05/08/14 18:19", idle: "", pdays: "", xpd: "", dem: "", day2: "THU", etd: "05/08/14 18:19", tz: "2.0" },
  { seq: "", port: "SUEZ CANAL", miles: "1,963", spd: "0.0", sdays: "", xsd: "", f: "I", wf: "7.00", day: "THU", eta: "05/08/14 18:19", idle: "0.00", pdays: "1.00", xpd: "1.0", dem: "", day2: "SAT", etd: "05/10/14 18:19", tz: "2.0" },
]);

/* ---------------- Bunkers ---------------- */

export const bunkerTabColumns: Column[] = [
  { id: "port", label: "Port", width: 170 },
  { id: "arr", label: "Arrival", width: 106, align: "right" },
  { id: "dep", label: "Departure", width: 106, align: "right" },
  { id: "ifoArr", label: "IFO Arr", width: 84, align: "right" },
  { id: "ifoRec", label: "IFO Rec", width: 84, align: "right" },
  { id: "ifoDep", label: "IFO Dep", width: 84, align: "right" },
  { id: "lsfArr", label: "LSF Arr", width: 84, align: "right" },
  { id: "lsfRec", label: "LSF Rec", width: 84, align: "right" },
  { id: "lsfDep", label: "LSF Dep", width: 84, align: "right" },
  { id: "lsgArr", label: "LSG Arr", width: 84, align: "right" },
  { id: "lsgRec", label: "LSG Rec", width: 84, align: "right" },
  { id: "lsgDep", label: "LSG Dep", width: 84, align: "right" },
  { id: "mgoArr", label: "MGO Arr", width: 86, align: "right" },
  { id: "mgoRec", label: "MGO Rec", width: 86, align: "right" },
  { id: "mgoDep", label: "MGO Dep", width: 86, align: "right" },
];

export const bunkerTabRows: Row[] = mkRows("bk", [
  { port: "SANTOS", arr: "", dep: "07/19/18 03:07", ifoArr: "2,000.000", ifoRec: "", ifoDep: "2,000.000", lsfArr: "510.793", lsfRec: "", lsfDep: "510.793", lsgArr: "495.324", lsgRec: "", lsgDep: "495.324", mgoArr: "495.078", mgoRec: "", mgoDep: "495.078" },
  { port: "CAPE OF GOOD HOPE", arr: "07/29/18 11:17", dep: "07/29/18 11:17", ifoArr: "1,639.695", ifoRec: "", ifoDep: "1,639.695", lsfArr: "510.793", lsfRec: "", lsfDep: "510.793", lsgArr: "495.324", lsgRec: "", lsgDep: "495.324", mgoArr: "492.849", mgoRec: "", mgoDep: "492.849" },
  { port: "PORT HEDLAND", arr: "08/14/18 05:30", dep: "08/16/18 12:07", ifoArr: "1,088.193", ifoRec: "", ifoDep: "1,074.044", lsfArr: "510.793", lsfRec: "", lsfDep: "510.793", lsgArr: "495.324", lsgRec: "", lsgDep: "495.324", mgoArr: "489.437", mgoRec: "", mgoDep: "489.437" },
  { port: "CIGADING", arr: "08/20/18 06:35", dep: "08/21/18 01:57", ifoArr: "938.267", ifoRec: "", ifoDep: "932.579", lsfArr: "510.793", lsfRec: "", lsfDep: "510.793", lsgArr: "495.324", lsgRec: "", lsgDep: "495.324", mgoArr: "487.930", mgoRec: "", mgoDep: "487.930" },
  { port: "YANGPU", arr: "08/26/18 17:46", dep: "08/27/18 17:11", ifoArr: "732.821", ifoRec: "", ifoDep: "725.885", lsfArr: "510.793", lsfRec: "", lsfDep: "510.793", lsgArr: "495.324", lsgRec: "", lsgDep: "495.324", mgoArr: "486.477", mgoRec: "", mgoDep: "486.477" },
]);

/* ---------------- Exp Details ---------------- */

export const expDetailsColumns: Column[] = [
  { id: "port", label: "Port", width: 190 },
  { id: "f", label: "F", width: 34 },
  { id: "grp", label: "Cargo Grp", width: 84 },
  { id: "gs", label: "GS", width: 44, align: "right" },
  { id: "grade", label: "Grade", width: 66 },
  { id: "ldQty", label: "L/D Qty", width: 84, align: "right" },
  { id: "unit", label: "Unit", width: 46 },
  { id: "seaHB", label: "Sea H/B", width: 84, align: "right" },
  { id: "portHB", label: "Port H/B", width: 80, align: "right" },
  { id: "portExp", label: "PortExp", width: 80, align: "right" },
  { id: "demDes", label: "Dem/Des", width: 84, align: "right" },
  { id: "common", label: "Common", width: 80, align: "right" },
  { id: "expUnit", label: "Exp/Unit", width: 80, align: "right" },
  { id: "ttlUnit", label: "Ttl/Unit", width: 80, align: "right" },
];

export const expDetailsRows: Row[] = mkRows("ed", [
  { port: PORTS[0], f: "C", grp: "", gs: "", grade: "", ldQty: "0", unit: "", seaHB: "", portHB: "", portExp: "", demDes: "", common: "", expUnit: "", ttlUnit: "" },
  { port: PORTS[1], f: "L", grp: "1 : DRY", gs: "1", grade: "COAL", ldQty: "40,626", unit: "MT", seaHB: "100,350", portHB: "1,500", portExp: "50,000", demDes: "", common: "2.47", expUnit: "1.27", ttlUnit: "" },
  { port: PORTS[2], f: "D", grp: "1 : DRY", gs: "1", grade: "COAL", ldQty: "40,626", unit: "MT", seaHB: "142,053", portHB: "1,500", portExp: "60,000", demDes: "", common: "3.50", expUnit: "1.51", ttlUnit: "8.75" },
]);

/* ---------------- Custom ---------------- */

export const customColumns: Column[] = [
  { id: "port", label: "Port", width: 150 },
  { id: "miles", label: "M...", width: 60, align: "right" },
  { id: "wf", label: "WF%", width: 60, align: "right" },
  { id: "draft", label: "Draft", width: 60, align: "right" },
  { id: "unit", label: "Unit", width: 46 },
  { id: "f", label: "F", width: 34 },
  { id: "loadline", label: "Loadline", width: 92 },
  { id: "sal", label: "Sali...", width: 60, align: "right" },
  { id: "vlfArr", label: "VLF Arr", width: 80, align: "right" },
  { id: "vlfQty", label: "VLF Qty", width: 80, align: "right" },
  { id: "vlfPrc", label: "VLF Prc", width: 80, align: "right" },
  { id: "vlfDep", label: "VLF Dep", width: 80, align: "right" },
  { id: "lsf", label: "LSF Arr", width: 80, align: "right" },
];

export const customRows: Row[] = mkRows("cu", [
  { port: "CJK", miles: "", wf: "0.00", draft: "", unit: "", f: "C", loadline: "Summer Salt", sal: "1.025", vlfArr: "647.128", vlfQty: "", vlfPrc: "", vlfDep: "647.128", lsf: "" },
  { port: "ECA - CHINA", miles: "64", wf: "0.00", draft: "", unit: "", f: "P", loadline: "Summer Salt", sal: "1.025", vlfArr: "647.128", vlfQty: "", vlfPrc: "", vlfDep: "", lsf: "" },
  { port: "BUNBURY", miles: "3,968", wf: "0.00", draft: "", unit: "", f: "L", loadline: "Summer Salt", sal: "1.025", vlfArr: "328.271", vlfQty: "200.000", vlfPrc: "650.000", vlfDep: "", lsf: "" },
  { port: "BUNBURY", miles: "", wf: "0.00", draft: "", unit: "", f: "L", loadline: "Summer Salt", sal: "1.025", vlfArr: "", vlfQty: "", vlfPrc: "", vlfDep: "", lsf: "" },
  { port: "BUNBURY", miles: "", wf: "0.00", draft: "", unit: "", f: "L", loadline: "Summer Salt", sal: "1.025", vlfArr: "", vlfQty: "", vlfPrc: "", vlfDep: "512.104", lsf: "" },
  { port: "SAMALAJU PORT", miles: "2,615", wf: "0.00", draft: "", unit: "", f: "D", loadline: "Summer Salt", sal: "1.025", vlfArr: "224.143", vlfQty: "", vlfPrc: "", vlfDep: "200.000", lsf: "" },
]);
