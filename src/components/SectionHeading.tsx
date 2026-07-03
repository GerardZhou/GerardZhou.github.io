interface SectionHeadingProps {
  // Keeping this content configurable gives every major section one consistent structure.
  index: string;
  kicker: string;
  title: string;
  description?: string;
}

/** Shared heading pattern for numbered portfolio sections. */
export function SectionHeading({
  index,
  kicker,
  title,
  description,
}: SectionHeadingProps) {
  return (
    // A semantic header groups the section label, h2, and supporting description.
    <header className={`section-heading${description ? "" : " section-heading-compact"}`}>
      <div className="section-heading-label">
        <span>{index}</span>
        <p>{kicker}</p>
      </div>
      <h2>{title}</h2>
      {description ? <p className="section-heading-description">{description}</p> : null}
    </header>
  );
}
