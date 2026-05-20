import { useState } from "react";

const EV_DATABASE = {
  Nissan: {
    "Leaf 24 kWh (2013–2017)":    { capacity_kwh: 21.3, efficiency: 3.4, max_charge_kw: 6.6,  max_dc_kw: 50,  connectors: ["CHAdeMO", "Type 1"] },
    "Leaf 30 kWh (2016–2017)":    { capacity_kwh: 28,   efficiency: 3.5, max_charge_kw: 6.6,  max_dc_kw: 50,  connectors: ["CHAdeMO", "Type 1"] },
    "Leaf 40 kWh (2018–2021)":    { capacity_kwh: 36,   efficiency: 3.7, max_charge_kw: 6.6,  max_dc_kw: 50,  connectors: ["CHAdeMO", "Type 2"] },
    "Leaf 62 kWh e+ (2019–2022)": { capacity_kwh: 56,   efficiency: 3.5, max_charge_kw: 6.6,  max_dc_kw: 100, connectors: ["CHAdeMO", "Type 2"] },
  },
  Tesla: {
    "Model 3 Standard Range": { capacity_kwh: 57.5, efficiency: 4.2, max_charge_kw: 11,  max_dc_kw: 170, connectors: ["CCS", "Type 2"] },
    "Model 3 Long Range":     { capacity_kwh: 75,   efficiency: 4.1, max_charge_kw: 11,  max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model 3 Performance":    { capacity_kwh: 75,   efficiency: 3.9, max_charge_kw: 11,  max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model Y Long Range":     { capacity_kwh: 75,   efficiency: 3.8, max_charge_kw: 11,  max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model Y Performance":    { capacity_kwh: 75,   efficiency: 3.6, max_charge_kw: 11,  max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model S Long Range":     { capacity_kwh: 100,  efficiency: 3.8, max_charge_kw: 11,  max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model X Long Range":     { capacity_kwh: 100,  efficiency: 3.2, max_charge_kw: 11,  max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
  },
  Volkswagen: {
    "ID.3 45 kWh":  { capacity_kwh: 45, efficiency: 3.9, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "ID.3 58 kWh":  { capacity_kwh: 58, efficiency: 3.9, max_charge_kw: 11, max_dc_kw: 120, connectors: ["CCS", "Type 2"] },
    "ID.3 77 kWh":  { capacity_kwh: 77, efficiency: 3.7, max_charge_kw: 11, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "ID.4 52 kWh":  { capacity_kwh: 52, efficiency: 3.5, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "ID.4 77 kWh":  { capacity_kwh: 77, efficiency: 3.5, max_charge_kw: 11, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "ID.5 GTX":     { capacity_kwh: 77, efficiency: 3.4, max_charge_kw: 11, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
  },
  BMW: {
    "i3 (2013–2022)": { capacity_kwh: 37.9, efficiency: 3.9, max_charge_kw: 11, max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "iX xDrive40":    { capacity_kwh: 71,   efficiency: 3.2, max_charge_kw: 11, max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "iX xDrive50":    { capacity_kwh: 105,  efficiency: 3.1, max_charge_kw: 22, max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
    "i4 eDrive40":    { capacity_kwh: 80.7, efficiency: 3.9, max_charge_kw: 11, max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
    "i4 M50":         { capacity_kwh: 80.7, efficiency: 3.5, max_charge_kw: 11, max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
    "iX1 xDrive30":   { capacity_kwh: 64.7, efficiency: 3.6, max_charge_kw: 11, max_dc_kw: 130, connectors: ["CCS", "Type 2"] },
  },
  Hyundai: {
    "IONIQ 5 58 kWh":      { capacity_kwh: 58, efficiency: 3.7, max_charge_kw: 11,  max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "IONIQ 5 77 kWh":      { capacity_kwh: 77, efficiency: 3.6, max_charge_kw: 11,  max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "IONIQ 6 53 kWh":      { capacity_kwh: 53, efficiency: 4.3, max_charge_kw: 11,  max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "IONIQ 6 77 kWh":      { capacity_kwh: 77, efficiency: 4.2, max_charge_kw: 11,  max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "Kona Electric 39 kWh":{ capacity_kwh: 39, efficiency: 3.9, max_charge_kw: 7.2, max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "Kona Electric 64 kWh":{ capacity_kwh: 64, efficiency: 3.8, max_charge_kw: 7.2, max_dc_kw: 77,  connectors: ["CCS", "Type 2"] },
  },
  Kia: {
    "EV6 58 kWh":   { capacity_kwh: 58, efficiency: 3.8, max_charge_kw: 11,  max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "EV6 77 kWh":   { capacity_kwh: 77, efficiency: 3.8, max_charge_kw: 11,  max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "EV6 GT":       { capacity_kwh: 77, efficiency: 3.4, max_charge_kw: 11,  max_dc_kw: 350, connectors: ["CCS", "Type 2"] },
    "e-Niro 39 kWh":{ capacity_kwh: 39, efficiency: 3.7, max_charge_kw: 7.2, max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "e-Niro 64 kWh":{ capacity_kwh: 64, efficiency: 3.8, max_charge_kw: 7.2, max_dc_kw: 77,  connectors: ["CCS", "Type 2"] },
    "EV9 76 kWh":   { capacity_kwh: 76, efficiency: 3.1, max_charge_kw: 11,  max_dc_kw: 240, connectors: ["CCS", "Type 2"] },
  },
  Renault: {
    "Zoe 41 kWh (2017–2019)": { capacity_kwh: 41, efficiency: 3.6, max_charge_kw: 22,  max_dc_kw: 0,   connectors: ["Type 2"] },
    "Zoe 52 kWh (2019–2021)": { capacity_kwh: 52, efficiency: 3.6, max_charge_kw: 22,  max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "Megane E-Tech 40 kWh":   { capacity_kwh: 40, efficiency: 3.8, max_charge_kw: 7.4, max_dc_kw: 85,  connectors: ["CCS", "Type 2"] },
    "Megane E-Tech 60 kWh":   { capacity_kwh: 60, efficiency: 3.7, max_charge_kw: 22,  max_dc_kw: 130, connectors: ["CCS", "Type 2"] },
  },
  Audi: {
    "e-tron 55 quattro":   { capacity_kwh: 86.5, efficiency: 2.9, max_charge_kw: 11, max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "e-tron 50 quattro":   { capacity_kwh: 64.7, efficiency: 3.0, max_charge_kw: 11, max_dc_kw: 120, connectors: ["CCS", "Type 2"] },
    "Q4 e-tron 45":        { capacity_kwh: 76.6, efficiency: 3.5, max_charge_kw: 11, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "Q4 e-tron 50 quattro":{ capacity_kwh: 76.6, efficiency: 3.3, max_charge_kw: 11, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
  },
  Mercedes: {
    "EQA 250":      { capacity_kwh: 66.5,  efficiency: 3.6, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "EQB 300 4MATIC":{ capacity_kwh: 66.5, efficiency: 3.3, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "EQC 400":      { capacity_kwh: 80,    efficiency: 3.0, max_charge_kw: 11, max_dc_kw: 110, connectors: ["CCS", "Type 2"] },
    "EQS 450+":     { capacity_kwh: 107.8, efficiency: 3.8, max_charge_kw: 22, max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
  },
  Peugeot: {
    "e-208":  { capacity_kwh: 50, efficiency: 3.7, max_charge_kw: 11,  max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "e-2008": { capacity_kwh: 50, efficiency: 3.5, max_charge_kw: 11,  max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "e-Rifter":{ capacity_kwh: 50, efficiency: 3.2, max_charge_kw: 7.4, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
  },
  Vauxhall: {
    "Corsa-e":  { capacity_kwh: 50, efficiency: 3.7, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "Mokka-e":  { capacity_kwh: 50, efficiency: 3.5, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "Vivaro-e": { capacity_kwh: 75, efficiency: 2.8, max_charge_kw: 11, max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
  },
  MG: {
    "MG4 Standard 51 kWh": { capacity_kwh: 51, efficiency: 3.9, max_charge_kw: 6.6, max_dc_kw: 117, connectors: ["CCS", "Type 2"] },
    "MG4 Long Range 64 kWh":{ capacity_kwh: 64, efficiency: 4.0, max_charge_kw: 6.6, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "MG ZS EV 44 kWh":     { capacity_kwh: 44, efficiency: 3.5, max_charge_kw: 6.6, max_dc_kw: 76,  connectors: ["CCS", "Type 2"] },
    "MG ZS EV 72 kWh":     { capacity_kwh: 72, efficiency: 3.7, max_charge_kw: 6.6, max_dc_kw: 76,  connectors: ["CCS", "Type 2"] },
  },
  Ford: {
    "Mustang Mach-E SR": { capacity_kwh: 68, efficiency: 3.4, max_charge_kw: 11, max_dc_kw: 115, connectors: ["CCS", "Type 2"] },
    "Mustang Mach-E ER": { capacity_kwh: 88, efficiency: 3.3, max_charge_kw: 11, max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "Explorer 77 kWh":   { capacity_kwh: 77, efficiency: 3.5, max_charge_kw: 11, max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
  },
  Volvo: {
    "XC40 Recharge":    { capacity_kwh: 69, efficiency: 3.2, max_charge_kw: 11, max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "C40 Recharge":     { capacity_kwh: 69, efficiency: 3.4, max_charge_kw: 11, max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "EX30 Single Motor":{ capacity_kwh: 51, efficiency: 4.0, max_charge_kw: 11, max_dc_kw: 153, connectors: ["CCS", "Type 2"] },
  },
  Porsche: {
    "Taycan 4S":          { capacity_kwh: 83.7, efficiency: 3.1, max_charge_kw: 22, max_dc_kw: 270, connectors: ["CCS", "Type 2"] },
    "Taycan Turbo":       { capacity_kwh: 93.4, efficiency: 2.9, max_charge_kw: 22, max_dc_kw: 270, connectors: ["CCS", "Type 2"] },
    "Taycan Cross Turismo":{ capacity_kwh: 93.4, efficiency: 2.9, max_charge_kw: 22, max_dc_kw: 270, connectors: ["CCS", "Type 2"] },
  },
};

const CHARGER_TYPES = [
  { id: "slow",  label: "Slow",  speed: "3–7 kW",    icon: "🔌" },
  { id: "fast",  label: "Fast",  speed: "7–22 kW",   icon: "⚡" },
  { id: "rapid", label: "Rapid", speed: "50–150 kW", icon: "🚀" },
];

const MAKES = Object.keys(EV_DATABASE).sort();

export default function EVOptimiserForm({ onSubmit }) {
  const [form, setForm] = useState({
    currentBattery: 35,
    targetBattery:  80,
    capacity:       36,
    efficiency:     3.7,
    dailyDriving:   45,
    location:       "Colchester",
    charger:        "fast",
    connectors:     ["CHAdeMO", "Type 2"],
  });

  const [selectedMake,  setSelectedMake]  = useState("Nissan");
  const [selectedModel, setSelectedModel] = useState("Leaf 40 kWh (2018–2021)");
  const [gpsLoading,    setGpsLoading]    = useState(false);
  const [gpsError,      setGpsError]      = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const models = selectedMake ? Object.keys(EV_DATABASE[selectedMake]) : [];

  const applyVehicle = (make, model) => {
    const v = EV_DATABASE[make]?.[model];
    if (!v) return;
    setForm(p => ({ ...p, capacity: v.capacity_kwh, efficiency: v.efficiency, connectors: v.connectors }));
  };

  const handleMakeChange = (make) => {
    setSelectedMake(make);
    const first = Object.keys(EV_DATABASE[make])[0];
    setSelectedModel(first);
    applyVehicle(make, first);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    applyVehicle(selectedMake, model);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsError("GPS not supported."); return; }
    setGpsLoading(true); setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res  = await fetch(`https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}&limit=1`);
          const data = await res.json();
          set("location", data.result?.[0]?.postcode || `${latitude.toFixed(5)},${longitude.toFixed(5)}`);
        } catch { set("location", `${latitude.toFixed(5)},${longitude.toFixed(5)}`); }
        setGpsLoading(false);
      },
      () => { setGpsError("Allow location access and try again."); setGpsLoading(false); },
      { timeout: 8000 }
    );
  };

  const v            = EV_DATABASE[selectedMake]?.[selectedModel];
  const batteryColor = form.currentBattery < 20 ? "#ef4444" : form.currentBattery < 50 ? "#f59e0b" : "#00d4aa";
  const currentRange = Math.round((form.capacity * (form.currentBattery / 100)) * form.efficiency);
  const rangeAfter   = Math.round((form.capacity * (form.targetBattery  / 100)) * form.efficiency);

  const handleSubmit = (e) => { e.preventDefault(); if (onSubmit) onSubmit(form); };

  return (
    <div style={s.page}>
      {/* ── HEADER ── */}
      <div style={s.header}>
        <div style={s.logoMark}>
          <svg viewBox="0 0 18 18" width={16} height={16} fill="none">
            <path d="M10 2L4 10h5l-1 6 6-8h-5l1-6z" fill="white" />
          </svg>
        </div>
        <div>
          <div style={s.brand}>SMART<span style={{ color: "#6b8a9a", fontWeight: 400 }}>EV</span></div>
          <div style={s.brandSub}>Charging Optimiser</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={s.form}>

        {/* ── VEHICLE CARD ── */}
        <div style={s.card}>
          <div style={s.cardLabel}>Your Vehicle</div>
          <div style={s.row}>
            <div style={s.col}>
              <div style={s.fieldLabel}>Make</div>
              <div style={s.selectWrap}>
                <select value={selectedMake} onChange={e => handleMakeChange(e.target.value)} style={s.select}>
                  {MAKES.map(m => <option key={m}>{m}</option>)}
                </select>
                <span style={s.arrow}>▾</span>
              </div>
            </div>
            <div style={{ ...s.col, flex: 2 }}>
              <div style={s.fieldLabel}>Model</div>
              <div style={s.selectWrap}>
                <select value={selectedModel} onChange={e => handleModelChange(e.target.value)} style={s.select}>
                  {models.map(m => <option key={m}>{m}</option>)}
                </select>
                <span style={s.arrow}>▾</span>
              </div>
            </div>
          </div>

          {/* Compact specs row */}
          {v && (
            <div style={s.specsRow}>
              <Spec label="Battery"    value={`${v.capacity_kwh} kWh`} />
              <Spec label="Range/kWh"  value={`${v.efficiency} mi`} />
              <Spec label="Max AC"     value={`${v.max_charge_kw} kW`} />
              <Spec label="Max DC"     value={v.max_dc_kw > 0 ? `${v.max_dc_kw} kW` : "N/A"} />
            </div>
          )}
        </div>

        {/* ── BATTERY CARD ── */}
        <div style={s.card}>
          <div style={s.cardLabel}>Battery Level</div>

          {/* Visual bar */}
          <div style={s.battTrack}>
            <div style={{ ...s.battTarget, width: `${form.targetBattery}%` }} />
            <div style={{ ...s.battCurrent, width: `${form.currentBattery}%`, background: `linear-gradient(90deg,${batteryColor},${batteryColor}cc)` }} />
          </div>
          <div style={s.battMeta}>
            <span style={{ color: batteryColor, fontFamily: "monospace", fontSize: 13, fontWeight: 600 }}>
              {form.currentBattery}% · ~{currentRange} mi
            </span>
            <span style={{ color: "#3b82f6", fontFamily: "monospace", fontSize: 12 }}>
              → {form.targetBattery}% · {rangeAfter} mi
            </span>
          </div>

          {/* Two sliders side by side */}
          <div style={s.row}>
            <div style={s.col}>
              <div style={s.sliderHead}>
                <span style={s.fieldLabel}>Now</span>
                <span style={{ ...s.fieldLabel, color: batteryColor, fontWeight: 600 }}>{form.currentBattery}%</span>
              </div>
              <input type="range" min="0" max="100" step="1"
                value={form.currentBattery}
                onChange={e => set("currentBattery", Number(e.target.value))}
                style={s.range} />
            </div>
            <div style={s.col}>
              <div style={s.sliderHead}>
                <span style={s.fieldLabel}>Target</span>
                <span style={{ ...s.fieldLabel, color: "#3b82f6", fontWeight: 600 }}>{form.targetBattery}%</span>
              </div>
              <input type="range" min="0" max="100" step="1"
                value={form.targetBattery}
                onChange={e => set("targetBattery", Number(e.target.value))}
                style={s.range} />
            </div>
          </div>
        </div>

        {/* ── DETAILS CARD ── */}
        <div style={s.card}>
          <div style={s.cardLabel}>Trip Details</div>
          <div style={s.row}>
            <div style={s.col}>
              <div style={s.fieldLabel}>Daily miles</div>
              <input type="number" min="0" max="500"
                value={form.dailyDriving}
                onChange={e => set("dailyDriving", Number(e.target.value))}
                style={s.input} />
            </div>
            <div style={{ ...s.col, flex: 2 }}>
              <div style={s.fieldLabel}>Location</div>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="text"
                  value={form.location}
                  onChange={e => set("location", e.target.value)}
                  placeholder="Postcode or town"
                  style={{ ...s.input, flex: 1 }} />
                <button type="button" onClick={handleGPS} style={{ ...s.gpsBtn, background: gpsLoading ? "rgba(0,212,170,0.2)" : "#0d1825" }} title="Use my location">
                  {gpsLoading ? "…" : "📍"}
                </button>
              </div>
              {gpsError && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{gpsError}</div>}
            </div>
          </div>
        </div>

        {/* ── CHARGER TYPE CARD ── */}
        <div style={s.card}>
          <div style={s.cardLabel}>Charger Type</div>
          <div style={s.chargerRow}>
            {CHARGER_TYPES.map(c => {
              const disabled = c.id === "rapid" && v?.max_dc_kw === 0;
              const active   = form.charger === c.id;
              return (
                <label key={c.id} style={{
                  ...s.chargerBtn,
                  borderColor:  active ? "#00d4aa" : "#1e2d45",
                  background:   active ? "rgba(0,212,170,0.08)" : "#0d1825",
                  opacity:      disabled ? 0.4 : 1,
                  cursor:       disabled ? "not-allowed" : "pointer",
                }}>
                  <input type="radio" name="charger" value={c.id}
                    checked={active} disabled={disabled}
                    onChange={() => !disabled && set("charger", c.id)}
                    style={{ display: "none" }} />
                  <div style={s.chargerIcon}>{c.icon}</div>
                  <div style={{ ...s.chargerLabel, color: active ? "#00d4aa" : "#e8f4f1" }}>{c.label}</div>
                  <div style={s.chargerSpeed}>{c.speed}</div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <button type="submit" style={s.submitBtn}>
          ⚡ Find Charging Stations
        </button>

      </form>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 10, color: "#6b8a9a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#00d4aa", fontFamily: "monospace" }}>{value}</div>
    </div>
  );
}

const s = {
  page: {
    background:  "#0a0f1a",
    minHeight:   "100vh",
    padding:     "env(safe-area-inset-top, 16px) 16px 32px",
    fontFamily:  "'DM Sans', sans-serif",
    color:       "#e8f4f1",
    maxWidth:    480,
    margin:      "0 auto",
  },
  header: {
    display:     "flex",
    alignItems:  "center",
    gap:         10,
    padding:     "16px 0 20px",
  },
  logoMark: {
    width:          36,
    height:         36,
    borderRadius:   10,
    background:     "linear-gradient(135deg,#00d4aa,#3b82f6)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  brand:    { fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: "#00d4aa", letterSpacing: "0.04em", lineHeight: 1.2 },
  brandSub: { fontSize: 11, color: "#6b8a9a", marginTop: 1 },
  form:     { display: "flex", flexDirection: "column", gap: 12 },

  // Card
  card: {
    background:   "#111827",
    border:       "1px solid #1e2d45",
    borderRadius: 14,
    padding:      "14px 16px",
  },
  cardLabel: {
    fontSize:      11,
    color:         "#6b8a9a",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontFamily:    "monospace",
    marginBottom:  10,
  },

  // Layout
  row: { display: "flex", gap: 10, alignItems: "flex-start" },
  col: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },

  // Specs
  specsRow: {
    display:        "flex",
    marginTop:      10,
    padding:        "8px 0 2px",
    borderTop:      "1px solid #1e2d45",
    justifyContent: "space-around",
  },

  // Fields
  fieldLabel: { fontSize: 11, color: "#6b8a9a", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "monospace" },
  selectWrap: { position: "relative" },
  select: {
    background:    "#0d1825",
    border:        "1px solid #1e2d45",
    borderRadius:  8,
    color:         "#e8f4f1",
    fontFamily:    "'DM Sans',sans-serif",
    fontSize:      13,
    padding:       "9px 28px 9px 10px",
    outline:       "none",
    width:         "100%",
    appearance:    "none",
    height:        38,
  },
  arrow: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#6b8a9a", pointerEvents: "none", fontSize: 11 },
  input: {
    background:   "#0d1825",
    border:       "1px solid #1e2d45",
    borderRadius: 8,
    color:        "#e8f4f1",
    fontFamily:   "'DM Sans',sans-serif",
    fontSize:     13,
    padding:      "9px 10px",
    outline:      "none",
    width:        "100%",
    height:       38,
    boxSizing:    "border-box",
  },
  gpsBtn: {
    width:          38,
    height:         38,
    flexShrink:     0,
    border:         "1px solid #1e2d45",
    borderRadius:   8,
    cursor:         "pointer",
    fontSize:       16,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    transition:     "background 0.2s",
    padding:        0,
  },

  // Battery
  battTrack: {
    height:       14,
    background:   "#0d1825",
    borderRadius: 4,
    border:       "1px solid #1e2d45",
    position:     "relative",
    overflow:     "hidden",
    marginBottom: 6,
  },
  battCurrent: { height: "100%", position: "absolute", top: 0, left: 0, borderRadius: 3, transition: "width 0.3s ease" },
  battTarget:  { height: "100%", position: "absolute", top: 0, left: 0, borderRadius: 3, background: "repeating-linear-gradient(90deg,rgba(59,130,246,0.2) 0px,rgba(59,130,246,0.2) 5px,transparent 5px,transparent 10px)", borderRight: "2px solid #3b82f6", transition: "width 0.3s ease" },
  battMeta:    { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  sliderHead:  { display: "flex", justifyContent: "space-between", alignItems: "center" },
  range:       { width: "100%", accentColor: "#00d4aa", cursor: "pointer", marginTop: 4 },

  // Charger type
  chargerRow: { display: "flex", gap: 8 },
  chargerBtn: {
    flex:           1,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            3,
    padding:        "10px 6px",
    border:         "1px solid",
    borderRadius:   10,
    transition:     "all 0.2s",
  },
  chargerIcon:  { fontSize: 20 },
  chargerLabel: { fontSize: 12, fontWeight: 500 },
  chargerSpeed: { fontSize: 10, color: "#6b8a9a", fontFamily: "monospace" },

  // Submit
  submitBtn: {
    width:        "100%",
    padding:      "15px",
    background:   "linear-gradient(90deg,#00d4aa,#3b82f6)",
    border:       "none",
    borderRadius: 12,
    fontFamily:   "'DM Sans',sans-serif",
    fontSize:     16,
    fontWeight:   600,
    color:        "#0a0f1a",
    cursor:       "pointer",
    letterSpacing:"0.02em",
  },
};