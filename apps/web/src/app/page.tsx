import type { ReactNode } from "react";
import { brand } from "@herpages/design-tokens";

export default function HomePage(): ReactNode {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>{brand.name}</h1>
      <p>{brand.tagline}</p>
      <p style={{ color: "#666", fontSize: 14, marginTop: 24 }}>
        Web shell — HP-002 development skeleton. Not a native vault.
      </p>
    </main>
  );
}
