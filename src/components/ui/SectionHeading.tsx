import type { ReactNode } from "react";

type Props = { eyebrow: string; title: string; children?: ReactNode };
export function SectionHeading({ eyebrow, title, children }: Props) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <p className="lead">{children}</p>}
    </header>
  );
}
