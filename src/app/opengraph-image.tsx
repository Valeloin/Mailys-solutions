import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Image de partage par défaut (Facebook, LinkedIn, X…), générée à la
// volée à partir du dégradé de marque — sert de repli pour toute page
// qui ne définit pas sa propre image (ex. articles de blog sans cover).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.name;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #FF6B6B 0%, #E11D2A 45%, #F97316 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Développement d&apos;applications métier sur mesure pour PME
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          Digitalisation · Modernisation · Maintenance WINDEV / WEBDEV
        </div>
      </div>
    ),
    { ...size }
  );
}
