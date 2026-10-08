import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// The picture shown when a link to the site is shared on Facebook, WhatsApp, X and the like.
export const alt = "Bright Roots Home Learning: Plan less. Learn more. Grow together.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The same cream as the house mark's own background, so the logo sits on the card without a box round it.
const CREAM = "#FCF8EC";

export default async function OpengraphImage() {
  const mark = await readFile(path.join(process.cwd(), "public/brand/house-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "64px 88px",
          background: CREAM,
          color: "#2E342F",
          fontFamily: "serif",
          borderBottom: "18px solid #2F5D3A",
        }}
      >
        <img src={markSrc} width={360} height={440} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#6E5A46", fontFamily: "sans-serif" }}>
            Bright Roots Home Learning
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
            <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.08, color: "#24452C" }}>Plan less.</div>
            <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.08, color: "#24452C" }}>Learn more.</div>
            <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.08, color: "#2F5D3A" }}>Grow together.</div>
          </div>
          <div style={{ fontSize: 28, marginTop: 32, color: "#6E5A46", fontFamily: "sans-serif" }}>
            A calm home learning planner for families
          </div>
        </div>
      </div>
    ),
    size,
  );
}
