type Properties = {
  className?: string;
  label?: string;
};

export default function Spinner(properties: Properties) {
  return (
    <div className={"text-primary mb-0.5 flex flex-col items-center space-y-3"}>
      {properties.label ? <p>{properties.label}</p> : null}
      <div className={properties?.className}>
        <div className="border-primary h-full w-full animate-spin rounded-full border-2 border-t-transparent" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}