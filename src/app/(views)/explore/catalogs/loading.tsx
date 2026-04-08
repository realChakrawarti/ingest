import Spinner from "~/widgets/spinner";

export default function CatalogsLoading() {
  return (
    <div className="mt-7 flex h-full flex-col items-center">
      <Spinner label="Catalogs are being generated." className="size-7" />
    </div>
  );
}