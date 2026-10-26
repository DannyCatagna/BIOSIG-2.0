import { useState, type ReactNode } from "react";
export function ReadingIndex({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(
    () => !window.matchMedia("(max-width: 640px)").matches,
  );
  return (
    <aside className="reading-index">
      <button
        className="index-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Ocultar índice" : "Mostrar índice de lectura"}
      </button>
      <div hidden={!open}>{children}</div>
    </aside>
  );
}
