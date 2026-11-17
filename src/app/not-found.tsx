import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      data-theme="dark"
      style={{ minHeight: "100svh", display: "grid", placeContent: "center", gap: 28, padding: "0 var(--gutter)", textAlign: "center" }}
    >
      <p className="eyebrow">404</p>
      <h1 className="display" style={{ fontSize: "clamp(48px, 8vw, 140px)" }}>
        This room is <em>dark.</em>
      </h1>
      <p style={{ color: "var(--muted)" }}>The page you were looking for is not here.</p>
      <Link href="/" className="btn" style={{ justifySelf: "center" }}>
        Back to NOIR <span className="arrow" aria-hidden="true" />
      </Link>
    </main>
  );
}
