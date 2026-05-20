import { useState } from "react";

// ─────────────────────────────────────────────
//  EV DATABASE
//  capacity_kwh     → usable battery size
//  efficiency       → real-world miles per kWh
//  max_charge_kw    → max AC charge rate
//  max_dc_kw        → max DC rapid charge rate
//  connectors       → supported connector types
// ─────────────────────────────────────────────
const EV_DATABASE = {
  Nissan: {
    "Leaf 24 kWh (2013–2017)":   { capacity_kwh: 21.3, efficiency: 3.4, max_charge_kw: 6.6,  max_dc_kw: 50,  connectors: ["CHAdeMO", "Type 1"] },
    "Leaf 30 kWh (2016–2017)":   { capacity_kwh: 28,   efficiency: 3.5, max_charge_kw: 6.6,  max_dc_kw: 50,  connectors: ["CHAdeMO", "Type 1"] },
    "Leaf 40 kWh (2018–2021)":   { capacity_kwh: 36,   efficiency: 3.7, max_charge_kw: 6.6,  max_dc_kw: 50,  connectors: ["CHAdeMO", "Type 2"] },
    "Leaf 62 kWh e+ (2019–2022)":{ capacity_kwh: 56,   efficiency: 3.5, max_charge_kw: 6.6,  max_dc_kw: 100, connectors: ["CHAdeMO", "Type 2"] },
  },
  Tesla: {
    "Model 3 Standard Range":    { capacity_kwh: 57.5, efficiency: 4.2, max_charge_kw: 11,   max_dc_kw: 170, connectors: ["CCS", "Type 2"] },
    "Model 3 Long Range":        { capacity_kwh: 75,   efficiency: 4.1, max_charge_kw: 11,   max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model 3 Performance":       { capacity_kwh: 75,   efficiency: 3.9, max_charge_kw: 11,   max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model Y Long Range":        { capacity_kwh: 75,   efficiency: 3.8, max_charge_kw: 11,   max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model Y Performance":       { capacity_kwh: 75,   efficiency: 3.6, max_charge_kw: 11,   max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model S Long Range":        { capacity_kwh: 100,  efficiency: 3.8, max_charge_kw: 11,   max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
    "Model X Long Range":        { capacity_kwh: 100,  efficiency: 3.2, max_charge_kw: 11,   max_dc_kw: 250, connectors: ["CCS", "Type 2"] },
  },
  Volkswagen: {
    "ID.3 45 kWh":               { capacity_kwh: 45,   efficiency: 3.9, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "ID.3 58 kWh":               { capacity_kwh: 58,   efficiency: 3.9, max_charge_kw: 11,   max_dc_kw: 120, connectors: ["CCS", "Type 2"] },
    "ID.3 77 kWh":               { capacity_kwh: 77,   efficiency: 3.7, max_charge_kw: 11,   max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "ID.4 52 kWh":               { capacity_kwh: 52,   efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "ID.4 77 kWh":               { capacity_kwh: 77,   efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "ID.5 GTX":                  { capacity_kwh: 77,   efficiency: 3.4, max_charge_kw: 11,   max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
  },
  BMW: {
    "i3 (2013–2022)":            { capacity_kwh: 37.9, efficiency: 3.9, max_charge_kw: 11,   max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "iX xDrive40":               { capacity_kwh: 71,   efficiency: 3.2, max_charge_kw: 11,   max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "iX xDrive50":               { capacity_kwh: 105,  efficiency: 3.1, max_charge_kw: 22,   max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
    "i4 eDrive40":               { capacity_kwh: 80.7, efficiency: 3.9, max_charge_kw: 11,   max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
    "i4 M50":                    { capacity_kwh: 80.7, efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
    "iX1 xDrive30":              { capacity_kwh: 64.7, efficiency: 3.6, max_charge_kw: 11,   max_dc_kw: 130, connectors: ["CCS", "Type 2"] },
  },
  Hyundai: {
    "IONIQ 5 58 kWh":            { capacity_kwh: 58,   efficiency: 3.7, max_charge_kw: 11,   max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "IONIQ 5 77 kWh":            { capacity_kwh: 77,   efficiency: 3.6, max_charge_kw: 11,   max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "IONIQ 6 53 kWh":            { capacity_kwh: 53,   efficiency: 4.3, max_charge_kw: 11,   max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "IONIQ 6 77 kWh":            { capacity_kwh: 77,   efficiency: 4.2, max_charge_kw: 11,   max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "Kona Electric 39 kWh":      { capacity_kwh: 39,   efficiency: 3.9, max_charge_kw: 7.2,  max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "Kona Electric 64 kWh":      { capacity_kwh: 64,   efficiency: 3.8, max_charge_kw: 7.2,  max_dc_kw: 77,  connectors: ["CCS", "Type 2"] },
  },
  Kia: {
    "EV6 58 kWh":                { capacity_kwh: 58,   efficiency: 3.8, max_charge_kw: 11,   max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "EV6 77 kWh":                { capacity_kwh: 77,   efficiency: 3.8, max_charge_kw: 11,   max_dc_kw: 220, connectors: ["CCS", "Type 2"] },
    "EV6 GT":                    { capacity_kwh: 77,   efficiency: 3.4, max_charge_kw: 11,   max_dc_kw: 350, connectors: ["CCS", "Type 2"] },
    "e-Niro 39 kWh":             { capacity_kwh: 39,   efficiency: 3.7, max_charge_kw: 7.2,  max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "e-Niro 64 kWh":             { capacity_kwh: 64,   efficiency: 3.8, max_charge_kw: 7.2,  max_dc_kw: 77,  connectors: ["CCS", "Type 2"] },
    "EV9 76 kWh":                { capacity_kwh: 76,   efficiency: 3.1, max_charge_kw: 11,   max_dc_kw: 240, connectors: ["CCS", "Type 2"] },
  },
  Renault: {
    "Zoe 41 kWh (2017–2019)":    { capacity_kwh: 41,   efficiency: 3.6, max_charge_kw: 22,   max_dc_kw: 0,   connectors: ["Type 2"] },
    "Zoe 52 kWh (2019–2021)":    { capacity_kwh: 52,   efficiency: 3.6, max_charge_kw: 22,   max_dc_kw: 50,  connectors: ["CCS", "Type 2"] },
    "Megane E-Tech 40 kWh":      { capacity_kwh: 40,   efficiency: 3.8, max_charge_kw: 7.4,  max_dc_kw: 85,  connectors: ["CCS", "Type 2"] },
    "Megane E-Tech 60 kWh":      { capacity_kwh: 60,   efficiency: 3.7, max_charge_kw: 22,   max_dc_kw: 130, connectors: ["CCS", "Type 2"] },
  },
  Audi: {
    "e-tron 55 quattro":         { capacity_kwh: 86.5, efficiency: 2.9, max_charge_kw: 11,   max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "e-tron 50 quattro":         { capacity_kwh: 64.7, efficiency: 3.0, max_charge_kw: 11,   max_dc_kw: 120, connectors: ["CCS", "Type 2"] },
    "Q4 e-tron 45":              { capacity_kwh: 76.6, efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "Q4 e-tron 50 quattro":      { capacity_kwh: 76.6, efficiency: 3.3, max_charge_kw: 11,   max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
  },
  Mercedes: {
    "EQA 250":                   { capacity_kwh: 66.5, efficiency: 3.6, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "EQB 300 4MATIC":            { capacity_kwh: 66.5, efficiency: 3.3, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "EQC 400":                   { capacity_kwh: 80,   efficiency: 3.0, max_charge_kw: 11,   max_dc_kw: 110, connectors: ["CCS", "Type 2"] },
    "EQS 450+":                  { capacity_kwh: 107.8,efficiency: 3.8, max_charge_kw: 22,   max_dc_kw: 200, connectors: ["CCS", "Type 2"] },
  },
  Peugeot: {
    "e-208":                     { capacity_kwh: 50,   efficiency: 3.7, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "e-2008":                    { capacity_kwh: 50,   efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "e-Rifter":                  { capacity_kwh: 50,   efficiency: 3.2, max_charge_kw: 7.4,  max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
  },
  Vauxhall: {
    "Corsa-e":                   { capacity_kwh: 50,   efficiency: 3.7, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "Mokka-e":                   { capacity_kwh: 50,   efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
    "Vivaro-e":                  { capacity_kwh: 75,   efficiency: 2.8, max_charge_kw: 11,   max_dc_kw: 100, connectors: ["CCS", "Type 2"] },
  },
  MG: {
    "MG4 Standard 51 kWh":       { capacity_kwh: 51,   efficiency: 3.9, max_charge_kw: 6.6,  max_dc_kw: 117, connectors: ["CCS", "Type 2"] },
    "MG4 Long Range 64 kWh":     { capacity_kwh: 64,   efficiency: 4.0, max_charge_kw: 6.6,  max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
    "MG ZS EV 44 kWh":           { capacity_kwh: 44,   efficiency: 3.5, max_charge_kw: 6.6,  max_dc_kw: 76,  connectors: ["CCS", "Type 2"] },
    "MG ZS EV 72 kWh":           { capacity_kwh: 72,   efficiency: 3.7, max_charge_kw: 6.6,  max_dc_kw: 76,  connectors: ["CCS", "Type 2"] },
  },
  Ford: {
    "Mustang Mach-E SR":         { capacity_kwh: 68,   efficiency: 3.4, max_charge_kw: 11,   max_dc_kw: 115, connectors: ["CCS", "Type 2"] },
    "Mustang Mach-E ER":         { capacity_kwh: 88,   efficiency: 3.3, max_charge_kw: 11,   max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "Explorer 77 kWh":           { capacity_kwh: 77,   efficiency: 3.5, max_charge_kw: 11,   max_dc_kw: 135, connectors: ["CCS", "Type 2"] },
  },
  Volvo: {
    "XC40 Recharge":             { capacity_kwh: 69,   efficiency: 3.2, max_charge_kw: 11,   max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "C40 Recharge":              { capacity_kwh: 69,   efficiency: 3.4, max_charge_kw: 11,   max_dc_kw: 150, connectors: ["CCS", "Type 2"] },
    "EX30 Single Motor":         { capacity_kwh: 51,   efficiency: 4.0, max_charge_kw: 11,   max_dc_kw: 153, connectors: ["CCS", "Type 2"] },
  },
  Porsche: {
    "Taycan 4S":                 { capacity_kwh: 83.7, efficiency: 3.1, max_charge_kw: 22,   max_dc_kw: 270, connectors: ["CCS", "Type 2"] },
    "Taycan Turbo":              { capacity_kwh: 93.4, efficiency: 2.9, max_charge_kw: 22,   max_dc_kw: 270, connectors: ["CCS", "Type 2"] },
    "Taycan Cross Turismo":      { capacity_kwh: 93.4, efficiency: 2.9, max_charge_kw: 22,   max_dc_kw: 270, connectors: ["CCS", "Type 2"] },
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
    capacity:       40,
    efficiency:     3.7,
    dailyDriving:   45,
    location:       "Colchester",
    charger:        "fast",
    connectors:     ["CHAdeMO", "Type 2"],
  });

  const [selectedMake,  setSelectedMake]  = useState("Nissan");
  const [selectedModel, setSelectedModel] = useState("Leaf 40 kWh (2018–2021)");
  const [showVehicleInfo, setShowVehicleInfo] = useState(true);
const [gpsLoading, setGpsLoading]           = useState(false);
const [gpsError,   setGpsError]             = useState(null);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const models = selectedMake ? Object.keys(EV_DATABASE[selectedMake]) : [];

  const handleMakeChange = (make) => {
    setSelectedMake(make);
    const firstModel = Object.keys(EV_DATABASE[make])[0];
    setSelectedModel(firstModel);
    applyVehicle(make, firstModel);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    applyVehicle(selectedMake, model);
  };

  const applyVehicle = (make, model) => {
    const v = EV_DATABASE[make]?.[model];
    if (!v) return;
    setForm(prev => ({
      ...prev,
      capacity:   v.capacity_kwh,
      efficiency: v.efficiency,
      connectors: v.connectors,
    }));
    setShowVehicleInfo(true);
  };

  const handleGPS = () => {
  if (!navigator.geolocation) {
    setGpsError("GPS not supported by your browser.");
    return;
  }

  setGpsLoading(true);
  setGpsError(null);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        // Reverse geocode to get postcode using postcodes.io
        const res  = await fetch(
          `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}&limit=1`
        );
        const data = await res.json();
        if (data.result && data.result[0]) {
          set("location", data.result[0].postcode);
        } else {
          // Fallback: use coordinates directly
          set("location", `${latitude.toFixed(5)},${longitude.toFixed(5)}`);
        }
      } catch {
        set("location", `${latitude.toFixed(5)},${longitude.toFixed(5)}`);
      }
      setGpsLoading(false);
    },
    (err) => {
      setGpsError("Could not get location. Please allow location access.");
      setGpsLoading(false);
    },
    { timeout: 8000 }
  );
};

  const currentVehicle = EV_DATABASE[selectedMake]?.[selectedModel];

  const batteryColor =
    form.currentBattery < 20 ? "#ef4444" :
    form.currentBattery < 50 ? "#f59e0b" : "#00d4aa";

  const currentRange = Math.round(
    (form.capacity * (form.currentBattery / 100)) * form.efficiency
  );
  const rangeAfter = Math.round(
    (form.capacity * (form.targetBattery / 100)) * form.efficiency
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div style={sty.shell}>
      {/* Header */}
      <div style={sty.header}>
        <div style={sty.logoMark}>
          <svg viewBox="0 0 18 18" width={18} height={18} fill="none">
            <path d="M10 2L4 10h5l-1 6 6-8h-5l1-6z" fill="white" />
          </svg>
        </div>
        <span style={sty.brand}>
          SMART<span style={{ color: "#6b8a9a", fontWeight: 400 }}>EV</span> OPTIMISER
        </span>
      </div>

      <h1 style={sty.title}>Charge smarter, not harder.</h1>
      <p style={sty.subtitle}>Select your car and we'll handle the rest.</p>

      {/* ── VEHICLE SELECTOR ─────────────────────── */}
      <div style={sty.vehicleSection}>
        <div style={sty.sectionLabel}>your vehicle</div>
        <div style={sty.vehicleRow}>
          {/* Make */}
          <div style={sty.field}>
            <label style={sty.label}>Make</label>
            <div style={sty.selectWrap}>
              <select
                value={selectedMake}
                onChange={e => handleMakeChange(e.target.value)}
                style={sty.select}
              >
                {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span style={sty.selectArrow}>▾</span>
            </div>
          </div>

          {/* Model */}
          <div style={{ ...sty.field, flex: 2 }}>
            <label style={sty.label}>Model</label>
            <div style={sty.selectWrap}>
              <select
                value={selectedModel}
                onChange={e => handleModelChange(e.target.value)}
                style={sty.select}
              >
                {models.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span style={sty.selectArrow}>▾</span>
            </div>
          </div>
        </div>

        {/* Vehicle info strip */}
        {currentVehicle && showVehicleInfo && (
          <div style={sty.vehicleInfoStrip}>
            <VehicleStat label="Battery"    value={`${currentVehicle.capacity_kwh} kWh`} />
            <VehicleStat label="Efficiency" value={`${currentVehicle.efficiency} mi/kWh`} />
            <VehicleStat label="Max AC"     value={`${currentVehicle.max_charge_kw} kW`} />
            <VehicleStat label="Max DC"     value={currentVehicle.max_dc_kw > 0 ? `${currentVehicle.max_dc_kw} kW` : "N/A"} />
            <div style={sty.connectorTags}>
              {currentVehicle.connectors.map(c => (
                <span key={c} style={sty.connectorTag}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BATTERY VISUAL ───────────────────────── */}
      <div style={sty.batteryHero}>
        <div style={sty.batteryRow}>
          <div style={{ flex: 1 }}>
            <div style={sty.batteryLabel}>battery status</div>
            <div style={sty.batteryTrack}>
              <div style={{ ...sty.targetFill,  width: `${form.targetBattery}%` }} />
              <div style={{ ...sty.batteryFill, width: `${form.currentBattery}%`, background: `linear-gradient(90deg,${batteryColor},${batteryColor}dd)` }} />
            </div>
            <div style={sty.batteryLegend}>
              <span style={sty.legendItem}><span style={{ ...sty.legendDot, background: "#00d4aa" }} />Current</span>
              <span style={sty.legendItem}><span style={{ ...sty.legendDot, background: "rgba(59,130,246,0.5)", border: "1px solid #3b82f6" }} />Target</span>
              <span style={{ ...sty.legendItem, marginLeft: "auto", color: batteryColor, fontFamily: "monospace", fontSize: 12 }}>
                ~{currentRange} mi now → {rangeAfter} mi after
              </span>
            </div>
          </div>
          <div style={{ ...sty.battPct, color: batteryColor }}>{form.currentBattery}%</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={sty.formGrid}>

        {/* Current battery slider */}
        <div style={sty.field}>
          <label style={sty.label}>Current battery (%)</label>
          <div style={sty.sliderTop}>
            <span style={sty.sliderUnit}>0 → 100%</span>
            <span style={sty.sliderVal}>{form.currentBattery}%</span>
          </div>
          <input type="range" min="0" max="100" step="1"
            value={form.currentBattery}
            onChange={e => set("currentBattery", Number(e.target.value))}
            style={sty.range} />
        </div>

        {/* Target battery slider */}
        <div style={sty.field}>
          <label style={sty.label}>Target battery (%)</label>
          <div style={sty.sliderTop}>
            <span style={sty.sliderUnit}>0 → 100%</span>
            <span style={sty.sliderVal}>{form.targetBattery}%</span>
          </div>
          <input type="range" min="0" max="100" step="1"
            value={form.targetBattery}
            onChange={e => set("targetBattery", Number(e.target.value))}
            style={sty.range} />
        </div>

        {/* Daily driving */}
        <div style={sty.field}>
          <label style={sty.label}>Daily driving need (miles)</label>
          <input type="number" min="0" max="500"
            value={form.dailyDriving}
            onChange={e => set("dailyDriving", Number(e.target.value))}
            style={sty.input} />
        </div>
        {/* Location */}
        <div style={sty.field}>
          <label style={sty.label}>Location</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text"
              value={form.location}
              onChange={e => set("location", e.target.value)}
              placeholder="Postcode or town"
              style={{ ...sty.input, flex: 1 }} />
            <button
              type="button"
              onClick={handleGPS}
              title="Use my location"
              style={{
                ...sty.gpsBtn,
                background: gpsLoading ? "rgba(0,212,170,0.2)" : "#0d1825",
              }}
            >
              {gpsLoading ? "..." : "📍"}
            </button>
          </div>
          {gpsError && (
            <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
              {gpsError}
            </div>
          )}
        </div>

        {/* Charger type */}
        <div style={{ ...sty.field, gridColumn: "1 / -1" }}>
          <label style={sty.label}>Preferred charger type</label>
          <div style={sty.chargerGrid}>
            {CHARGER_TYPES.map(c => {
              // Warn if vehicle can't use rapid
              const isRapidDisabled = c.id === "rapid" && currentVehicle && currentVehicle.max_dc_kw === 0;
              return (
                <label key={c.id} style={{
                  ...sty.chargerLabel,
                  ...(form.charger === c.id ? sty.chargerActive : {}),
                  opacity: isRapidDisabled ? 0.4 : 1,
                  cursor:  isRapidDisabled ? "not-allowed" : "pointer",
                }}>
                  <input type="radio" name="charger" value={c.id}
                    checked={form.charger === c.id}
                    disabled={isRapidDisabled}
                    onChange={() => !isRapidDisabled && set("charger", c.id)}
                    style={{ display: "none" }} />
                  <span style={{ fontSize: 20 }}>{c.icon}</span>
                  <span style={{ ...sty.chargerName, color: form.charger === c.id ? "#00d4aa" : "#a0bbc8" }}>
                    {c.label}
                  </span>
                  <span style={sty.chargerSpeed}>{c.speed}</span>
                  {isRapidDisabled && <span style={sty.chargerNoSupport}>Not supported</span>}
                </label>
              );
            })}
          </div>
        </div>

        <button type="submit" style={{ ...sty.submitBtn, gridColumn: "1 / -1" }}>
          Find Charging Stations →
        </button>

        <div style={{ ...sty.infoStrip, gridColumn: "1 / -1" }}>
          <div style={sty.infoDot} />
          Calculations use your vehicle's real efficiency of {form.efficiency} mi/kWh and {form.capacity} kWh battery.
        </div>
      </form>
    </div>
  );
}

function VehicleStat({ label, value }) {
  return (
    <div style={sty.vehicleStat}>
      <div style={sty.vehicleStatLabel}>{label}</div>
      <div style={sty.vehicleStatVal}>{value}</div>
    </div>
  );
}

const sty = {
  shell: {
    background:  "#0a0f1a",
    borderRadius: 16,
    padding:     "2rem",
    fontFamily:  "'DM Sans', sans-serif",
    color:       "#e8f4f1",
    maxWidth:    640,
    margin:      "0 auto",
  },
  header:   { display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" },
  logoMark: { width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#00d4aa,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  brand:    { fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: "#00d4aa", letterSpacing: "0.05em" },
  title:    { fontSize: 22, fontWeight: 500, color: "#e8f4f1", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#6b8a9a", marginBottom: "1.5rem" },

  // Vehicle selector
  vehicleSection: { marginBottom: "1.25rem" },
  sectionLabel:   { fontSize: 11, color: "#6b8a9a", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "monospace", marginBottom: 8 },
  vehicleRow:     { display: "flex", gap: 10, marginBottom: 10 },
  vehicleInfoStrip: {
    display:         "flex",
    flexWrap:        "wrap",
    gap:             8,
    padding:         "10px 12px",
    background:      "rgba(0,212,170,0.05)",
    border:          "1px solid rgba(0,212,170,0.15)",
    borderRadius:    8,
    alignItems:      "center",
  },
  vehicleStat:      { display: "flex", flexDirection: "column", gap: 2, minWidth: 60 },
  vehicleStatLabel: { fontSize: 10, color: "#6b8a9a", textTransform: "uppercase", letterSpacing: "0.06em" },
  vehicleStatVal:   { fontSize: 13, fontWeight: 500, color: "#00d4aa", fontFamily: "monospace" },
  connectorTags:    { display: "flex", gap: 4, flexWrap: "wrap", marginLeft: "auto" },
  connectorTag:     { fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" },

  // Battery
  batteryHero:  { background: "#161f30", border: "1px solid #1e2d45", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" },
  batteryRow:   { display: "flex", alignItems: "center", gap: 16 },
  batteryLabel: { fontSize: 11, color: "#6b8a9a", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 },
  batteryTrack: { height: 18, background: "#0d1825", borderRadius: 4, border: "1px solid #1e2d45", position: "relative", overflow: "hidden" },
  batteryFill:  { height: "100%", borderRadius: 3, position: "absolute", top: 0, left: 0, transition: "width 0.3s ease" },
  targetFill:   { height: "100%", position: "absolute", top: 0, left: 0, borderRadius: 3, background: "repeating-linear-gradient(90deg,rgba(59,130,246,0.18) 0px,rgba(59,130,246,0.18) 6px,transparent 6px,transparent 12px)", borderRight: "2px solid #3b82f6", transition: "width 0.3s ease" },
  batteryLegend:{ display: "flex", gap: 12, marginTop: 8, alignItems: "center", flexWrap: "wrap" },
  legendItem:   { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b8a9a" },
  legendDot:    { width: 8, height: 8, borderRadius: 2, display: "inline-block" },
  battPct:      { fontFamily: "monospace", fontSize: 20, fontWeight: 700, minWidth: 52, textAlign: "right" },

  // Form
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" },
  field:    { display: "flex", flexDirection: "column", gap: 6 },
  label:    { fontSize: 11, color: "#a0bbc8", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "monospace" },
  sliderTop:{ display: "flex", justifyContent: "space-between", alignItems: "baseline" },
  sliderUnit:{ fontSize: 11, color: "#6b8a9a" },
  sliderVal: { fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "#00d4aa" },
  range:    { width: "100%", accentColor: "#00d4aa", cursor: "pointer" },
  input: { background: "#0d1825", border: "1px solid #1e2d45", borderRadius: 8, color: "#e8f4f1", fontFamily: "'DM Sans',sans-serif", fontSize: 14, padding: "9px 12px", outline: "none", width: "100%", height: "42px", boxSizing: "border-box" },
  selectWrap: { position: "relative" },
  select: { background: "#0d1825", border: "1px solid #1e2d45", borderRadius: 8, color: "#e8f4f1", fontFamily: "'DM Sans',sans-serif", fontSize: 14, padding: "9px 32px 9px 12px", outline: "none", width: "100%", appearance: "none", height: "42px", boxSizing: "border-box" },
  selectArrow: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#6b8a9a", pointerEvents: "none", fontSize: 12 },

  chargerGrid:    { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  chargerLabel:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 8px", background: "#0d1825", border: "1px solid #1e2d45", borderRadius: 8, transition: "border-color 0.2s,background 0.2s" },
  chargerActive:  { borderColor: "#00d4aa", background: "rgba(0,212,170,0.07)" },
  chargerName:    { fontSize: 12, fontWeight: 500, transition: "color 0.2s" },
  chargerSpeed:   { fontFamily: "monospace", fontSize: 10, color: "#6b8a9a" },
  chargerNoSupport: { fontSize: 10, color: "#ef4444", marginTop: 2 },

  submitBtn: { padding: 13, background: "linear-gradient(90deg,#00d4aa,#3b82f6)", border: "none", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, color: "#0a0f1a", cursor: "pointer" },
  infoStrip: { display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, fontSize: 11, color: "#6b8a9a" },
  infoDot:   { width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 },
  gpsBtn: {
  width:        42,
  height:       42,
  flexShrink:   0,
  border:       "1px solid #1e2d45",
  borderRadius: 8,
  cursor:       "pointer",
  fontSize:     18,
  display:      "flex",
  alignItems:   "center",
  justifyContent: "center",
  transition:   "background 0.2s",
  color:        "#00d4aa",
},
};