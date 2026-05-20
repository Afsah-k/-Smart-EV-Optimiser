import { useEffect, useRef } from "react";

// ─── Leaflet map component ───────────────────────────────────────────────────
function ChargerMap({ chargers, bestCharger }) {
  const mapRef    = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    // Load Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link  = document.createElement("link");
      link.id     = "leaflet-css";
      link.rel    = "stylesheet";
      link.href   = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS then init map
    const initMap = () => {
      if (leafletRef.current) return; // already initialised

      const L = window.L;

      // Find a charger with valid coords to centre the map
      const validChargers = chargers.filter(c => c.lat && c.lng);
      if (!validChargers.length || !mapRef.current) return;

      const centre = [validChargers[0].lat, validChargers[0].lng];

      const map = L.map(mapRef.current, {
        center:          centre,
        zoom:            14,
        zoomControl:     true,
        scrollWheelZoom: false,
      });

      leafletRef.current = map;

      // OpenStreetMap tile layer — free, no API key
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom:     19,
      }).addTo(map);

      // Custom pin colours
      const makePinSvg = (color) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
          <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 24 14 24S28 23.33 28 14C28 6.27 21.73 0 14 0z"
                fill="${color}" stroke="#fff" stroke-width="2"/>
          <circle cx="14" cy="14" r="6" fill="#fff" opacity="0.9"/>
        </svg>`;

      const makeIcon = (color) => L.divIcon({
        html:        makePinSvg(color),
        className:   "",
        iconSize:    [28, 38],
        iconAnchor:  [14, 38],
        popupAnchor: [0, -40],
      });

      const bestIcon  = makeIcon("#00d4aa"); // teal   — best charger
      const otherIcon = makeIcon("#3b82f6"); // blue   — other chargers

      const bounds = [];

      validChargers.forEach((c, i) => {
        const isBest = bestCharger && c.name === bestCharger.name;
        const icon   = isBest ? bestIcon : otherIcon;

        const leafCompatText = c.leaf_compatible
          ? `<span style="color:#00d4aa;font-weight:600">✓ Leaf compatible</span>`
          : `<span style="color:#6b8a9a">Check compatibility</span>`;

        const popup = `
          <div style="font-family:sans-serif;min-width:180px">
            <div style="font-size:13px;font-weight:600;margin-bottom:4px;color:#111">
              ${isBest ? "⭐ " : ""}${c.name}
            </div>
            <div style="font-size:11px;color:#555;margin-bottom:6px">${c.address}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px">
              <div style="background:#f4f4f4;border-radius:4px;padding:4px 6px">
                <div style="color:#888">Power</div>
                <div style="font-weight:600;color:#111">${c.power_kw} kW</div>
              </div>
              <div style="background:#f4f4f4;border-radius:4px;padding:4px 6px">
                <div style="color:#888">Distance</div>
                <div style="font-weight:600;color:#111">${c.distance_miles} mi</div>
              </div>
              <div style="background:#f4f4f4;border-radius:4px;padding:4px 6px">
                <div style="color:#888">Charge time</div>
                <div style="font-weight:600;color:#111">${c.charge_time_minutes} mins</div>
              </div>
              <div style="background:#f4f4f4;border-radius:4px;padding:4px 6px">
                <div style="color:#888">Est. cost</div>
                <div style="font-weight:600;color:#111">£${c.estimated_cost_gbp}</div>
              </div>
            </div>
            <div style="margin-top:6px;font-size:11px">${leafCompatText}</div>
          </div>`;

        const marker = L.marker([c.lat, c.lng], { icon })
          .addTo(map)
          .bindPopup(popup, { maxWidth: 220 });

        // Auto-open popup for best charger
        if (isBest) marker.openPopup();

        bounds.push([c.lat, c.lng]);
      });

      // Fit map to show all charger pins
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    // If Leaflet already loaded, init immediately
    if (window.L) {
      initMap();
    } else {
      const script   = document.createElement("script");
      script.src     = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload  = initMap;
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, [chargers, bestCharger]);

  return (
    <div style={s.mapWrap}>
      <div ref={mapRef} style={s.map} />
      <div style={s.mapLegend}>
        <span style={s.legendItem}>
          <span style={{ ...s.legendDot, background: "#00d4aa" }} />
          Best match
        </span>
        <span style={s.legendItem}>
          <span style={{ ...s.legendDot, background: "#3b82f6" }} />
          Other chargers
        </span>
      </div>
    </div>
  );
}


// ─── Main results component ──────────────────────────────────────────────────
export default function EVResults({ result, onReset }) {
  if (!result || !result.success) return null;

  const { calculations, recommendation, all_chargers } = result;
  const best = recommendation.best_charger;

  // Only show chargers that have coordinates
  const mappableChargers = all_chargers.filter(c => c.lat && c.lng);

  return (
    <div style={s.shell}>

      {/* Warning strip */}
      {recommendation.warning && (
        <div style={s.warnStrip}>
          <span style={{ fontSize: 16 }}>⚠</span>
          {recommendation.warning}
        </div>
      )}

      {/* Best charger card */}
      <div style={s.sectionLabel}>best match</div>
      <div style={s.bestCard}>
        <div style={s.bestHeader}>
          <div>
            <div style={s.bestName}>{best.name}</div>
            <div style={s.bestAddr}>{best.address}</div>
          </div>
          <div style={{
            ...s.badge,
            background:   best.leaf_compatible ? "rgba(0,212,170,0.12)" : "rgba(107,138,154,0.12)",
            color:        best.leaf_compatible ? "#00d4aa" : "#6b8a9a",
            borderColor:  best.leaf_compatible ? "rgba(0,212,170,0.3)"  : "rgba(107,138,154,0.2)",
          }}>
            {best.connection_type === "Unknown" ? "Check compatibility" : best.connection_type}
            {best.leaf_compatible ? " ✓" : ""}
          </div>
        </div>
        <div style={s.statsRow}>
          <div style={s.stat}>
            <div style={s.statLabel}>Power</div>
            <div style={s.statVal}>{best.power_kw}<span style={s.statUnit}> kW</span></div>
          </div>
          <div style={s.stat}>
            <div style={s.statLabel}>Charge time</div>
            <div style={s.statVal}>{best.charge_time_minutes}<span style={s.statUnit}> mins</span></div>
          </div>
          <div style={s.stat}>
            <div style={s.statLabel}>Est. cost</div>
            <div style={s.statVal}>£{best.estimated_cost_gbp}</div>
          </div>
          <div style={s.stat}>
            <div style={s.statLabel}>Rate</div>
            <div style={s.statVal}>£{best.price_per_kwh}<span style={s.statUnit}>/kWh</span></div>
          </div>
        </div>
      </div>

      {/* MAP */}
      {mappableChargers.length > 0 && (
        <>
          <div style={s.sectionLabel}>charger locations</div>
          <ChargerMap chargers={mappableChargers} bestCharger={best} />
        </>
      )}

      {/* Battery + daily summary */}
      <div style={s.summaryGrid}>
        <div style={s.sumCard}>
          <div style={s.sumTitle}>Battery summary</div>
          <SumRow label="Current range"      value={`${calculations.estimated_range_miles} mi`} />
          <SumRow label="Range after charge" value={`${recommendation.range_after_charge} mi`} green />
          <SumRow label="Energy needed"      value={`${calculations.energy_needed_kwh} kWh`} />
        </div>
        <div style={s.sumCard}>
          <div style={s.sumTitle}>Daily need check</div>
          <SumRow label="Daily miles"        value={`${recommendation.daily_miles_needed} mi`} />
          <SumRow label="Covers daily need"  value={recommendation.covers_daily_need ? "Yes ✓" : "No ✗"} green={recommendation.covers_daily_need} />
          <SumRow label="Est. cost"          value={`£${calculations.estimated_cost_gbp}`} green />
        </div>
      </div>

      {/* Nearby chargers list */}
      {all_chargers && all_chargers.length > 0 && (
        <>
          <div style={s.sectionLabel}>nearby chargers</div>
          <div style={s.chargerList}>
            {all_chargers.map((c, i) => (
              <div key={i} style={{
                ...s.chargerRow,
                borderBottom: i < all_chargers.length - 1 ? "1px solid #1e2d45" : "none",
              }}>
                <div style={s.chargerRank}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.chargerName}>{c.name}</div>
                  <div style={s.chargerMeta}>
                    <span style={{
                      ...s.compatDot,
                      background: c.leaf_compatible ? "#00d4aa" : "#6b8a9a",
                    }} />
                    {c.connection_type} · {c.power_kw} kW · {c.charge_time_minutes} mins
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={s.chargerCost}>£{c.estimated_cost_gbp}</div>
                  <div style={s.chargerDist}>{c.distance_miles} mi away</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Search again */}
      <button onClick={onReset} style={s.resetBtn}>← Search again</button>
    </div>
  );
}

function SumRow({ label, value, green }) {
  return (
    <div style={s.sumRow}>
      <span style={s.sumKey}>{label}</span>
      <span style={{ ...s.sumVal, color: green ? "#00d4aa" : "#e8f4f1" }}>{value}</span>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = {
  shell: {
    background:  "#0a0f1a",
    borderRadius: 16,
    padding:     "1.5rem",
    fontFamily:  "'DM Sans', sans-serif",
    color:       "#e8f4f1",
    maxWidth:    640,
    margin:      "1rem auto 0",
  },
  sectionLabel: {
    fontSize:      11,
    color:         "#6b8a9a",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontFamily:    "monospace",
    marginBottom:  10,
  },
  bestCard: {
    background:   "#161f30",
    border:       "1.5px solid #00d4aa",
    borderRadius: 12,
    padding:      "1.25rem",
    marginBottom: "1rem",
  },
  bestHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   12,
    gap:            12,
  },
  bestName: { fontSize: 17, fontWeight: 500, color: "#e8f4f1" },
  bestAddr: { fontSize: 12, color: "#6b8a9a", marginTop: 2 },
  badge: {
    fontSize:    11,
    padding:     "3px 10px",
    borderRadius: 20,
    border:      "1px solid",
    whiteSpace:  "nowrap",
    flexShrink:  0,
  },
  statsRow: {
    display:             "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap:                 10,
  },
  stat: {
    background:   "#0d1825",
    borderRadius: 8,
    padding:      "10px 12px",
  },
  statLabel: { fontSize: 11, color: "#6b8a9a", marginBottom: 4 },
  statVal:   { fontSize: 16, fontWeight: 500, color: "#00d4aa", fontFamily: "monospace" },
  statUnit:  { fontSize: 11, color: "#6b8a9a" },
  warnStrip: {
    display:      "flex",
    alignItems:   "center",
    gap:          8,
    padding:      "8px 12px",
    background:   "rgba(245,158,11,0.08)",
    border:       "1px solid rgba(245,158,11,0.2)",
    borderRadius: 8,
    fontSize:     12,
    color:        "#f59e0b",
    marginBottom: "1rem",
  },

  // Map
  mapWrap: {
    marginBottom: "1rem",
    borderRadius: 12,
    overflow:     "hidden",
    border:       "1px solid #1e2d45",
    position:     "relative",
  },
  map: {
    height:  320,
    width:   "100%",
    zIndex:  1,
  },
  mapLegend: {
    display:        "flex",
    gap:            16,
    padding:        "8px 12px",
    background:     "#0d1825",
    borderTop:      "1px solid #1e2d45",
  },
  legendItem: {
    display:    "flex",
    alignItems: "center",
    gap:        6,
    fontSize:   11,
    color:      "#6b8a9a",
  },
  legendDot: {
    width:        10,
    height:       10,
    borderRadius: "50%",
    display:      "inline-block",
    flexShrink:   0,
  },

  // Summary
  summaryGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 10,
    marginBottom:        "1rem",
  },
  sumCard: {
    background:   "#161f30",
    border:       "1px solid #1e2d45",
    borderRadius: 10,
    padding:      "1rem",
  },
  sumTitle: { fontSize: 12, color: "#6b8a9a", marginBottom: 8 },
  sumRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    padding:        "4px 0",
    borderBottom:   "1px solid #1e2d45",
  },
  sumKey: { fontSize: 12, color: "#a0bbc8" },
  sumVal: { fontSize: 13, fontWeight: 500, fontFamily: "monospace" },

  // Charger list
  chargerList: {
    background:   "#161f30",
    border:       "1px solid #1e2d45",
    borderRadius: 10,
    overflow:     "hidden",
    marginBottom: "1.5rem",
  },
  chargerRow: {
    display:    "flex",
    alignItems: "center",
    gap:        12,
    padding:    "10px 14px",
  },
  chargerRank: {
    width:          20,
    height:         20,
    borderRadius:   "50%",
    background:     "#0d1825",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       11,
    color:          "#6b8a9a",
    flexShrink:     0,
    fontFamily:     "monospace",
  },
  chargerName: { fontSize: 13, fontWeight: 500, color: "#e8f4f1" },
  chargerMeta: {
    fontSize:   11,
    color:      "#6b8a9a",
    display:    "flex",
    alignItems: "center",
    gap:        4,
    marginTop:  2,
  },
  compatDot: {
    width:        6,
    height:       6,
    borderRadius: "50%",
    display:      "inline-block",
    flexShrink:   0,
  },
  chargerCost: { fontSize: 13, fontWeight: 500, color: "#00d4aa", fontFamily: "monospace" },
  chargerDist: { fontSize: 11, color: "#6b8a9a" },

  resetBtn: {
    background:   "transparent",
    border:       "1px solid #1e2d45",
    borderRadius: 8,
    color:        "#a0bbc8",
    fontFamily:   "'DM Sans', sans-serif",
    fontSize:     13,
    padding:      "8px 16px",
    cursor:       "pointer",
    width:        "100%",
  },
};