type FormSectionProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

export function FormSection({ title, description, children, actions }: FormSectionProps) {
  return (
    <section className="surface-panel gap-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">{title}</h2>
          <p className="max-w-2xl text-sm leading-7 text-neutral-500">{description}</p>
        </div>
        {actions ? <div className="w-full lg:w-auto">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
