import { ImageResponse } from "next/og";

export const alt = "Bright Roots Home Learning: less time organising, more time learning together";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #FFFDF8 0%, #F7F2E8 55%, #E8F0E8 100%)",
          color: "#2E342F",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#3F5D46",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            BR
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#3F5D46" }}>Bright Roots Home Learning</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.1 }}>Less time organising.</div>
          <div style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.1, color: "#3F5D46" }}>
            More time learning together.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 28, fontWeight: 700, color: "#6E5A46" }}>
          <span>Weekly planner</span>
          <span>·</span>
          <span>Child accounts</span>
          <span>·</span>
          <span>Progress & reports</span>
        </div>
      </div>
    ),
    size,
  );
}
