import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Brand mark: trust blue with a gold B. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1E3A5F",
          color: "#FFC107",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        B
      </div>
    ),
    { ...size },
  );
}
