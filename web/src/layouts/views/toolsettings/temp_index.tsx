import React, { useEffect, useState } from "react";
import { fetchNui } from "../../../utils/fetchNui";

// const semverCompare = (a?: string, b?: string) => {
//   if (!a || !b) return 0;
//   const pa = a.replace(/^v/, "").split(".").map(Number);
//   const pb = b.replace(/^v/, "").split(".").map(Number);
//   for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
//     const na = pa[i] || 0;
//     const nb = pb[i] || 0;
//     if (na > nb) return 1;
//     if (na < nb) return -1;
//   }
//   return 0;
// };

const AdvancedToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("ht_mlotool_advancedEditing");
      return raw ? JSON.parse(raw) : false;
    } catch (e) {
      return false;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try to get value from the runtime via NUI. Assumed event: "getSetting"
        const resp = await fetchNui<boolean>("getSetting", { key: "advancedEditing" }, undefined as any);
        if (mounted && typeof resp === "boolean") {
          setEnabled(resp);
          localStorage.setItem("ht_mlotool_advancedEditing", JSON.stringify(resp));
        }
      } catch (err) {
        // ignore; keep local value
      }
    })();
    return () => { mounted = false };
  }, []);

  const toggle = async () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("ht_mlotool_advancedEditing", JSON.stringify(next));
    setLoading(true);
    try {
      // Best-effort persistence to the game runtime. Assumed event: "saveSetting"
      await fetchNui("saveSetting", { key: "advancedEditing", value: next });
    } catch (e) {
      // ignore failures - localStorage keeps the value for dev
      // optionally you could surface an error to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 12, borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600 }}>Advanced editing</div>
          <div style={{ fontSize: 12, color: "#666" }}>Enable extra editing controls and debug options.</div>
        </div>
        <div>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={enabled} onChange={toggle} disabled={loading} />
            <span style={{ fontSize: 13 }}>{enabled ? "On" : "Off"}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

const VersionChecker: React.FC = () => {
  const [current, setCurrent] = useState<string | null>(null);
  const [latest, setLatest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assumed NUI endpoints: getCurrentToolVersion and getLatestToolVersion
      // Provide mock values when running in browser/dev via second parameter
      const curr = await fetchNui<string>("getCurrentToolVersion", undefined, "v0.0.0");
      const lat = await fetchNui<string>("getLatestToolVersion", undefined, "v0.0.0");
      setCurrent(curr || null);
      setLatest(lat || null);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load() }, []);

  const status = () => {
    if (!current || !latest) return "unknown";
    // const cmp = semverCompare(current, latest);
    // if (cmp < 0) return "outdated";
    // if (cmp === 0) return "current";
    return "ahead";
  };

  return (
    <div style={{ padding: 12, borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>Tool version</div>
        <div style={{ fontSize: 12, color: "#666" }}>{loading ? "Checking..." : (status())}</div>
      </div>

      <div style={{ fontSize: 13, marginBottom: 8 }}>
        <div>Current: <strong>{current ?? "—"}</strong></div>
        <div>Latest: <strong>{latest ?? "—"}</strong></div>
      </div>

      {error && <div style={{ color: "var(--danger, #c00)", marginBottom: 8 }}>Error: {error}</div>}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={load} disabled={loading} style={{ padding: "6px 10px" }}>Refresh</button>
        {status() === "unknown" && (
          <button onClick={() => { /* Could trigger update flow in the runtime */ }} style={{ padding: "6px 10px" }}>
            Update
          </button>
        )}
      </div>
    </div>
  );
};

const ToolSettings: React.FC = () => {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Tool settings</h2>

      <AdvancedToggle />

      <div style={{ height: 12 }} />

      <VersionChecker />
    </div>
  );
};

export default ToolSettings;
