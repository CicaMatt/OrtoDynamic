type PlaceholderViewProps = {
  title: string;
};

export function PlaceholderView({ title }: PlaceholderViewProps) {
  return (
    <div>
      <header className="mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">{title}</h2>
      </header>

      <section className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Sezione in preparazione.
        </p>
      </section>
    </div>
  );
}
