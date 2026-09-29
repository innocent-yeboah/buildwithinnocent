import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Build With Innocent — Your business should work while you sleep.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 1200×630 share image. Replaces the old 736×736 file that was declared as 1600×900. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0E1F35",
          color: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            color: "#FFC107",
            fontWeight: 700,
          }}
        >
          BUILD WITH INNOCENT
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 28,
            maxWidth: 980,
          }}
        >
          Your business should work while you sleep.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            marginTop: 32,
            color: "#D8E3F0",
          }}
        >
          Digital business systems for African enterprises
        </div>
      </div>
    ),
    { ...size },
  );
}
