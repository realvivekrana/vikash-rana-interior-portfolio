const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
    <div>
      <h1 className="font-serif text-3xl text-white">{title}</h1>
      {subtitle && <p className="text-neutral-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default PageHeader;