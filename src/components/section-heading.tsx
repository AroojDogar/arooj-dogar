/** Linear-style section header: small label, grey-gradient title, optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`reveal max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="text-sm font-medium text-accent">{eyebrow}</p>
      <h2 className="text-title mt-3 text-4xl text-balance sm:text-5xl">{title}</h2>
      {description && (
        <p
          className={`mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted ${center ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
