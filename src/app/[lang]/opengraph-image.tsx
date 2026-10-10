import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

// Preview card shown when the site link is shared on WhatsApp, LinkedIn, X, etc.
export const alt = `${profile.name} — ${profile.role}`;
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
          padding: 80,
          background: "radial-gradient(circle at 80% 0%, #2b2a6b 0%, #08090a 60%)",
          color: "#f7f8f8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#8a8f98" }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#4cb782" }} />
          {profile.availability}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
          <div
            style={{
              fontSize: 48,

              color: "#8b8aff",
              fontStyle: "italic",
            }}
          >
            {profile.role}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#8a8f98" }}>
          Next.js · TypeScript · AI · Vercel
        </div>
      </div>
    ),
    size,
  );
}
